import React, { useContext, useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { _removeStorageItem } from '../helpers/functions';
import { DiagnosisContext } from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';
import { COLORS, DIMENS } from '../constants/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelectView from 'react-native-multiselect-view';
import { format } from 'date-fns';

const AntenatalCare = ({ navigation }) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const { diagnoses } = diagnosisContext;
  const { dataResults } = useContext(DataResultsContext);
  const { patientId, setPatientId } = useContext(DataResultsContext);
  const currentDate = new Date();

  const [routineVisitDate, setRoutineVisitDate] = useState('');
  const [expectedDateOfDelivery, setExpectedDateOfDelivery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || routineVisitDate;
    setShowDatePicker(false);
    // Update the respective state based on the selected date
    if (showDatePicker === 'antenatal') {
      setRoutineVisitDate(currentDate);
      setState({ ...state, routineVisitDate: currentDate }); // Update state
      console.log('Date of Visit:', currentDate);
    } else if (showDatePicker === 'expectedDate') {
      setExpectedDateOfDelivery(currentDate);
      setState({ ...state, expectedDateOfDelivery: currentDate }); // Update state
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
    weight: '',
    bloodGroup: '',
    nextOfKin: '',
    nextOfKinContact: '',
    drugNotes: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('Patient ID :', patientId);
      if (state.isLoading) {
        // Prevent multiple submissions
        console.log("prevent multiple submissions")
        return;
      }
      if (
        state.pregnancyStatus === '' ||
        state.expectedDateOfDelivery === '' ||
        routineVisitDate === '' ||
        state.drugNotes === '' ||
        state.bloodGroup === '' ||
        state.prescriptions.length === 0
      ) {
        console.log('Testing Log:',
          state.pregnancyStatus,
          state.expectedDateOfDelivery,
          routineVisitDate
        )
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setState({ ...state, isLoading: true }); // Set isLoading state to true
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/${patientId}/antenantals`,
        {
          method: 'POST',
          body: JSON.stringify({
            pregnancyStatus: state.pregnancyStatus,
            expectedDateOfDelivery: state.expectedDateOfDelivery,
            nextOfKinContact: state.nextOfKinContact,
            routineVisitDate: state.routineVisitDate,
            weight: state.weight,
            bloodGroup: state.bloodGroup,
            prescriptions: state.prescriptions,
            nextOfKin: state.nextOfKin,
            drugNotes: state.drugNotes,
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
      setState({ ...state, isLoading: false }); // Reset isLoading state to false
    }
  };

  // Define your list of medications
  const medications = [
    'Folic Acid Supplements',
    'Iron Supplements',
    'Calcium Supplements',
    'Antiemeitics',
    'Antihistamines',
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
            style={[STYLES.field, { color: COLORS.BLACK }]} // Add color and placeholderTextColor styles
            placeholderTextColor={COLORS.GREY}
            value={state.pregnancyStatus}
            onChangeText={text => setState({ ...state, pregnancyStatus: text })}
            placeholder="Enter Pregnancy Status e.g 'lower back pain'"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* date for checkup */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Date for Check Up:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            onPress={() => setShowDatePicker('antenatal')}>
            <Text style={STYLES.datePickerText}>
              {formatDate(routineVisitDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'antenatal' && (
            <DateTimePicker
              testID='AdatePicker'
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
            testID="blood-group-picker"
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.bloodGroup}
            onValueChange={(value, index) =>
              setState({ ...state, bloodGroup: value })
            }
            dropdownIconColor={COLORS.GREY_LIGHTER}
            style={STYLES.field}
            itemStyle={{ fontSize: 8 }}>
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
          <Text style={STYLES.label}>Current Weight:</Text>

          <TextInput
            keyboardType="numeric"
            value={state.weight}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({ ...state, weight: text })}
            placeholder="Current Weight (Kgs)"
            style={[STYLES.field, { paddingHorizontal: 30 }]}
          />
        </View>

        {/* prescriptions */}
        <View style={STYLES.labeledItem} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.prescribe}>Prescriptions:</Text>
          <View style={STYLES.select}>
            <MultiSelectView
              accessible={true}
              accessibilityLabel="Prescriptions"
              testID="prescriptionsMultiSelect"
              data={medications}
              onSelectionChanged={selectedItems =>
                setState({ ...state, prescriptions: selectedItems })
              }
              style={STYLES.multiSelect}
              itemStyle={STYLES.item}
              selectedTextStyle={[
                STYLES.selectedItemText,
                { color: COLORS.BLACK },
              ]}
              selectedItemStyle={[
                STYLES.selectedItem,
                { backgroundColor: COLORS.PRIMARY },
              ]}
              checkboxStyle={STYLES.checkbox}
            />
          </View>
        </View>

        {/* drug note*/}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Drug Notes*:</Text>

          <TextInput
            value={state.drugNotes}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({ ...state, drugNotes: text })}
            placeholder="Add Drug Note"
            style={[STYLES.field, { paddingHorizontal: 30 }]}
            multiline={true}
            numberOfLines={2}
          />
        </View>

        {/* expected date of delivery */}
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
              testID="expected-delivery-date-picker"
              value={expectedDateOfDelivery || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* next of kin */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Next of Kin:</Text>

          <TextInput
            value={state.nextOfKin}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({ ...state, nextOfKin: text })}
            placeholder="Next of Kin"
            style={[STYLES.field, { paddingHorizontal: 30 }]}
          />
        </View>

        {/* next of kin */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Next of Kin Contact:</Text>

          <TextInput
            value={state.nextOfKinContact}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({ ...state, nextOfKinContact: text })}
            placeholder="Add Contact"
            keyboardType="numeric"
            style={[STYLES.field, { paddingHorizontal: 30 }]}
          />
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
    paddingHorizontal: 20,
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
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  labeled: {
    marginBottom: 20,
  },
  datePickerInput: {
    color: COLORS.BLACK,
    backgroundColor: COLORS.GREY_LIGHTER,
    borderRadius: DIMENS.INPUT_RADIUS,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  datePickerText: {
    color: COLORS.GREY,
  },
  submit: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    borderRadius: DIMENS.INPUT_RADIUS,
    marginTop: 20,
  },
  submitText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  field: {
    color: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  multiSelect: {
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: COLORS.GREY,
    borderBottomWidth: 1,
  },
  selectedItem: {
    backgroundColor: COLORS.PRIMARY,
  },
  selectedItemText: {
    color: COLORS.WHITE,
  },
  checkbox: {
    marginRight: 10,
  },
});
