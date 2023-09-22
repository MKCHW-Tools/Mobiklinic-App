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
import CopyRight from './copyright';
import {URLS} from '../constants/API';

const AntenatalCare = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  // const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {patientId, setPatientId} = useContext(DataResultsContext);
  const {userNames} = useContext(DataResultsContext);
  // const currentDate = new Date();
  const {sessionId} = useContext(DataResultsContext);
  const [routineVisitDate, setRoutineVisitDate] = useState('');
  const [expectedDateOfDelivery, setExpectedDateOfDelivery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [prescriptions, setSelectedPrescriptions] = useState([]);
  const {isBeneficiaryConfirmed} = useContext(DataResultsContext);
  const [medicines, setMedicines] = useState([
    {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      description: '',
    },
  ]);

  const handleAddMedicine = () => {
    console.log(patientId);
    setMedicines([
      ...medicines,
      {name: '', dosage: '', frequency: '', duration: '', description: ''},
    ]);
  };

  const handleRemoveMedicine = index => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

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
    weight: '',
    bloodGroup: '',
    prescriptions: '',
    nextOfKin: '',
    nextOfKinContact: '',
    drugNotes: '',
    biometricsVerified: isBeneficiaryConfirmed,
    // registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('Patient ID :', patientId);
      console.log('Biometrically Verified:', isBeneficiaryConfirmed);
      if (state.isLoading) {
        // Prevent multiple submissions
        return;
      }
      if (
        state.pregnancyStatus === '' ||
        routineVisitDate === '' ||
        state.bloodGroup === ''
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setState({...state, isLoading: true}); // Set isLoading state to true
      const response = await fetch(`${URLS.BASE}/${patientId}/antenantals`, {
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
          reviewedBy: userNames,
          simprintsGui: dataResults,
          simSessionId: sessionId,
          medicines: medicines,
          biometricsVerified: isBeneficiaryConfirmed,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // setId(data.id);
        Alert.alert('Antenatal Care Patient Registered');
        navigation.navigate('Dashboard');
        console.log(state,medicines);
      } else {
        console.log(state, medicines);
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

  const renderMedicineInputs = () => {
    return medicines.map((medicine, index) => (
      <View key={index} style={STYLES.medicineContainer}>
        <Text style={STYLES.userLabel}>Medicine #{index + 1}:</Text>
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Medicine:</Text>
          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={medicine.name}
            onValueChange={value => handleMedicineChange(index, 'name', value)}
            style={[STYLES.field, {color: COLORS.BLACK}]} // Add color style
            dropdownIconColor={COLORS.GREY_LIGHTER}>
            <Picker.Item label="" value="" />
            <Picker.Item
              label="Folic Acid Supplements"
              value="Folic Acid Supplements"
            />
            <Picker.Item
              label="Folic Acid  & Iron Supplements"
              value="Folic Acid  & Iron Supplements"
            />
            <Picker.Item label="Iron Supplements" value="Iron Supplements" />
            <Picker.Item
              label="Calcium Supplements"
              value="Calcium Supplements"
            />
            <Picker.Item label="Fansidar" value="Fansidar" />
            <Picker.Item label="Mebendazole" value="Mebendazole" />
            <Picker.Item label="Paracemotol" value="Paracemotol" />
            <Picker.Item label="Vitamin C " value="Vitamin C" />
            <Picker.Item label="Magnesium" value="Magnesium" />
            <Picker.Item label="Cetirizine" value="Cetirizine" />

            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Instructions:</Text>
          <TextInput
            style={[
              STYLES.field,
              {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
            ]}
            placeholder="Take Medicine after eating"
            value={medicine.description}
            onChangeText={text =>
              handleMedicineChange(index, 'description', text)
            }
            placeholderTextColor={COLORS.GREY}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={STYLES.wrap}>
          <View style={STYLES.detail}>
            <Picker
              placeholderTextColor={COLORS.BLACK}
              selectedValue={medicine.dosage}
              onValueChange={value =>
                handleMedicineChange(index, 'dosage', value)
              }
              style={[STYLES.field, {color: COLORS.BLACK}]}
              dropdownIconColor={COLORS.GREY_LIGHTER}>
              <Picker.Item label="Dose" value="Dose" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="7" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
          </View>
          <Text
            style={[
              STYLES.userLabel,
              {color: COLORS.BLACK, paddingHorizontal: 10, fontWeight: 'bold'},
            ]}>
            X
          </Text>

          <View style={STYLES.detail}>
            <Picker
              placeholderTextColor={COLORS.BLACK}
              selectedValue={medicine.frequency}
              onValueChange={value =>
                handleMedicineChange(index, 'frequency', value)
              }
              style={[STYLES.field, {color: COLORS.BLACK}]} // Add color style
              dropdownIconColor={COLORS.GREY_LIGHTER}>
              <Picker.Item label="Freq" value="Frequency" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="7" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
          </View>
          <Text style={STYLES.label}>for</Text>
        </View>
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Days:</Text>
          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={medicine.duration}
            onValueChange={value =>
              handleMedicineChange(index, 'duration', value)
            }
            style={[STYLES.field, {color: COLORS.BLACK}]} // Add color style
            dropdownIconColor={COLORS.GREY_LIGHTER}>
            <Picker.Item label="" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="7" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
          </Picker>
        </View>

        <Text
          style={[STYLES.field, {color: COLORS.BLACK, paddingVertical: 10}]}>
          (Press "Remove" To Remove Medicine)
        </Text>
        <TouchableOpacity onPress={() => handleRemoveMedicine(index)}>
          <Text style={STYLES.medicineRemoveButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    ));
  };

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
            value={state.pregnancyStatus}
            onChangeText={text => setState({...state, pregnancyStatus: text})}
            placeholder="Enter Pregnancy Status e.g 'first trimster'"
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
            <Picker.Item label="Don't Know" value="Don't Know" />
          </Picker>
        </View>

        {/* Weight */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Current Weight:</Text>

          <TextInput
            keyboardType="numeric"
            value={state.weight}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({...state, weight: text})}
            placeholder="Current Weight (Kgs)"
            style={[STYLES.field, {paddingHorizontal: 30}]}
          />
        </View>

        {/* prescriptions */}

        {/* drug note*/}
        {/* <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Drug Notes*:</Text>

          <TextInput
            value={state.drugNotes}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({...state, drugNotes: text})}
            placeholder="Add Drug Note eg '2 tabs per day"
            style={[STYLES.field, {paddingHorizontal: 30}]}
            multiline={true}
            numberOfLines={2}
          />
        </View> */}

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
            onChangeText={text => setState({...state, nextOfKin: text})}
            placeholder="Next of Kin"
            style={[STYLES.field, {paddingHorizontal: 30}]}
          />
        </View>

        {/* next of kin */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Next of Kin Contact:</Text>

          <TextInput
            value={state.nextOfKinContact}
            placeholderTextColor={COLORS.GREY}
            onChangeText={text => setState({...state, nextOfKinContact: text})}
            placeholder="Add Contact"
            keyboardType="numeric"
            style={[STYLES.field, {paddingHorizontal: 30}]}
          />
        </View>

        {renderMedicineInputs()}
        <Text
          style={[STYLES.field, {color: COLORS.BLACK, paddingVertical: 10}]}>
          (Press "Add Medicine" To Add More than One Medicine)
        </Text>
        <TouchableOpacity
          style={STYLES.addMedicineButton}
          onPress={handleAddMedicine}>
          <Text style={STYLES.addMedicineButtonText}>Add Medicine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={STYLES.submit} onPress={handleSubmit}>
          <Text style={STYLES.submitText}>Submit</Text>
        </TouchableOpacity>
        <CopyRight />
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
  prescribe: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    color: COLORS.BLACK,
    fontSize: 14,
    paddingVertical: 8,
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
  multiSelect: {
    width: '80%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHTER,
    borderRadius: 10,
    padding: 8,
  },
  item: {
    padding: 8,
  },
  selectedItem: {
    backgroundColor: COLORS.PRIMARY,
  },
  selectedItemText: {
    color: COLORS.BLACK,
  },
  checkbox: {
    marginRight: 8,
  },
  select: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
    alignItems: 'center',
  },
  labeledItem: {
    // flexDirection: 'row',
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
  addMedicineButton: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    // paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  addMedicineButtonText: {
    color: COLORS.PRIMARY,
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
  },
  field: {
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
    fontWeight: 'medium',
    fontSize: 13,
  },
  medicineInput: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    color: COLORS.BLACK,
  },
  userLabel: {
    fontWeight: 'medium',
    marginHorizontal: 5,
    marginVertical: 10,
    color: COLORS.BLACK,
    fontSize: 16,
    textAlign: 'center',
  },
  medicineRemoveButton: {
    color: COLORS.BLACK, // Customize the color as needed
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'right',
  },
});
