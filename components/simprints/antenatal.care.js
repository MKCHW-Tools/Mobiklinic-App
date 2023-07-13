import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Alert,
  Switch,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {_removeStorageItem} from '../helpers/functions';
import {DiagnosisContext} from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';
import {COLORS, DIMENS} from '../constants/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelectView from 'react-native-multiselect-view';
import {format} from 'date-fns';

const AntenatalCare = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {patientId, setPatientId} = useContext(DataResultsContext);
  const currentDate = new Date();

  const [routineVisitDate, setRoutineVisitDate] = useState('');
  const [expectedDateOfDelivery, setExpectedDateOfDelivery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [prescriptions, setSelectedPrescriptions] = useState([]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || routineVisitDate;
    setShowDatePicker(false);
    // Update the respective state based on the selected date
    if (showDatePicker === 'antenatal') {
      setRoutineVisitDate(currentDate);
      setState({...state, routineVisitDate: currentDate}); // Update state
      console.log('Date of Visit:', currentDate);
    } else if (showDatePicker === 'expectedDate') {
      setExpectedDateOfDelivery(currentDate);
      setState({...state, expectedDateOfDelivery: currentDate}); // Update state
      console.log('Expected date:', currentDate);
    }
  };

  const formatDate = date => {
    if (date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year}`;
    }
    return 'Click to add date';
  };
  const [state, setState] = React.useState({
    pregnancyStatus: '',
    expectedDateOfDelivery: '',
    routineVisitDate: '',
    expectedDateOfDelivery: '',
    bloodGroup: '',
    prescriptions: [],

    // registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('Patient ID :', patientId);
      if (state.isLoading) {
        // Prevent multiple submissions
        return;
      }
      if (
        state.pregnancyStatus === '' ||
        state.expectedDateOfDelivery === '' ||
        routineVisitDate === '' || // Add check for dateOfVaccination
        state.bloodGroup === ''
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setState({...state, isLoading: true}); // Set isLoading state to true
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/${patientId}/vaccinations`,
        {
          method: 'POST',
          body: JSON.stringify({
            pregnancyStatus: state.pregnancyStatus,
            expectedDateOfDelivery: state.expectedDateOfDelivery,
            units: state.units,
            dateOfVaccination: state.dateOfVaccination,
            expectedDateOfDelivery: state.expectedDateOfDelivery,
            bloodGroup: state.bloodGroup,
            prescriptions: state.prescriptions,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        // setId(data.id);
        Alert.alert('Antenatal Care Patient Registered');
        navigation.navigate('Dashboard');
      } else {
        console.error('Error posting data:', response.status);
        Alert.alert(
          'Error',
          'Failed to Register patient. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert(
        'Error',
        'Failed to Register patient. Please try again later.',
      );
    } finally {
      setState({...state, isLoading: false}); // Reset isLoading state to false
    }
  };

  // Define your list of medications
  const medications = [
    'Prenatal Vitamins',
    'Folic Acid Supplements',
    'Iron Supplements',
    'Calcium Supplements',
    'Vitamin D Supplements',
    'Antiemeitics',
    'Antacids',
    'Antihistamines',
    'Laxatives or Stool Softeners',
    'Progesterone Supplements',
  ];

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{
            marginHorizontal: 4,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={
        <Text style={[STYLES.centerHeader, STYLES.title]}>Antenatal Care</Text>
      }
    />
  );

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <ScrollView style={STYLES.body}>
        {/* Pregnancy status */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Pregnacy Status:</Text>
          <TextInput
            style={[STYLES.field, {color: COLORS.BLACK}]} // Add color and placeholderTextColor styles
            placeholderTextColor={COLORS.GREY}
            value={state.units}
            onChangeText={text => setState({...state, units: text})}
            placeholder="Enter Pregnancy Status e.g 'lower back pain'"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Date for Check Up:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            onPress={() => setShowDatePicker('antenatal')}>
            <Text style={STYLES.datePickerText}>
              {formatDate(routineVisitDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'vaccination' && (
            <DateTimePicker
              value={routineVisitDate || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Blood Group */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Blood Group:</Text>

          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.bloodGroup}
            onValueChange={(value, index) =>
              setState({...state, bloodGroup: value})
            }
            dropdownIconColor={COLORS.GREY_LIGHTER}
            style={STYLES.field}
            itemStyle={{fontSize: 8}}>
            <Picker.Item label="" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />

            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
            <Picker.Item label="0+" value="O+" />
            <Picker.Item label="O-" value="O-" />
          </Picker>
        </View>

        {/* Weight */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Weight:</Text>

          <TextInput
            keyboardType="numeric"
            value={state.weight}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({...state, weight: text})}
            placeholder="Weight (Kgs)"
            style={[STYLES.field, {paddingHorizontal: 30}]}
          />
        </View>

        {/* prescriptions */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Prescriptions:</Text>

          {/* <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.prescriptions}
            onValueChange={(value, index) =>
              setState({...state, prescriptions: value})
            }
            style={[STYLES.field, {color: COLORS.BLACK}]} // Add color style
            dropdownIconColor={COLORS.GREY_LIGHTER}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Buikwe Hospital" value="Buikwe Hospital" />
            <Picker.Item label="Mulago Hospital" value="Mulago Hospital" />
            <Picker.Item
              label="Makonge Health Center III"
              value="Makonge Health Center III"
            />
            <Picker.Item
              label="Makonge Health Center III"
              value="Makonge Health Center III"
            />
            <Picker.Item
              label="Makindu Health Center III"
              value="Makindu Health Center III"
            />
            <Picker.Item
              label="Kisungu Health Center III"
              value="Kisungu Health Center III"
            />
            <Picker.Item
              label="Najjembe Health Center III"
              value="Najjemebe Health Center III"
            />
            <Picker.Item label="Kawolo Hospital" value="Kawolo Hospital" />
          </Picker> */}
          <MultiSelectView
            data={medications}
            onSelectionChanged={selectedItems =>
              setSelectedPrescriptions(selectedItems)
            }
          />
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Expected Date of Delivery:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            onPress={() => setShowDatePicker('expectedDate')}>
            <Text style={STYLES.datePickerText}>
              {formatDate(expectedDateOfDelivery)}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'expectedDate' && (
            <DateTimePicker
              value={expectedDateOfDelivery || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>
        <TouchableOpacity style={STYLES.submit} onPress={handleSubmit}>
          <Text style={STYLES.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AntenatalCare;

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 2,
    padding: 30,
  },
  alert: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    flexDirection: 'row',
    fontSize: 10,
    color: COLORS.GREY,
  },
  label: {
    fontWeight: 'medium',
    marginLeft: 5,
    marginRight: 5,
    color: COLORS.BLACK,
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    alignItems: 'center',
    flexGrow: 1,
  },
  leftHeader: {
    marginLeft: 10,
    flex: 1,
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
    color: COLORS.SECONDARY,
  },
  rightHeader: {
    paddingRight: 10,
  },
  tip: {
    color: 'rgba(0,0,0,0.4)',
    paddingTop: 15,
    paddingBottom: 15,
  },
  input: {
    color: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  textarea: {
    color: 'rgba(0,0,0,0.7)',
    minHeight: 70,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
  },
  terms: {
    paddingVertical: 10,
    textAlign: 'center',
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  pickers: {
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontWeight: 'bold',
    // backgroundColor: COLORS.GREY,
  },
  pickerItemStyle: {
    color: 'rgba(0,0,0,0.7)',
  },
  labeled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  field: {
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
    fontWeight: 'medium',
    fontSize: 13,
  },
  guid: {
    textAlign: 'left',
    color: COLORS.BLACK,
    fontSize: 11,
    fontWeight: 'bold ',
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    color: COLORS.BLACK,
    fontSize: 14,
  },
  submit: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
    borderRadius: 20,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  pickerWrap: {
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  smallInput: {
    width: 80,
    height: 40,
    textAlign: 'right',
    color: COLORS.BLACK,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // minHeight: 70,
    borderRadius: 20,
    marginBottom: 10,
    // paddingHorizontal: 10,
  },
  detail: {
    flex: 1,
    paddingHorizontal: 8,
    // paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    // height: 50,
    marginHorizontal: 5,
  },
  pickerStyle: {
    flex: 1,
    paddingHorizontal: 15,
    // paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    marginHorizontal: 5,
  },
  datePickerText: {
    paddingVertical: 10,
    paddingLeft: 12,
    fontSize: 15,
    color: COLORS.BLACK,
  },
  datePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: COLORS.GREY,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderRadius: 10,
  },
  datePickerText: {
    marginLeft: 5,
    color: COLORS.BLACK,
    fontSize: 14,
    paddingVertical: 12,
  },
});
