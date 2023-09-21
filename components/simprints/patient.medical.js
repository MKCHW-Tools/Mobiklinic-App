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
import {format} from 'date-fns';
import CopyRight from './copyright';
import {URLS} from '../constants/API';

const PatientMedical = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {patientId, setPatientId} = useContext(DataResultsContext);
  const currentDate = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {sessionId} = useContext(DataResultsContext);
  const {userNames} = useContext(DataResultsContext);
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
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [showCustomConditionInput, setShowCustomConditionInput] =
    useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfDiagnosis;
    setShowDatePicker(false);

    // Update the respective state based on the selected date
    if (showDatePicker === 'diagnoses') {
      setDateOfDiagnosis(currentDate);
      setState({...state, dateOfDiagnosis: currentDate}); // Update state
      console.log('Date for Diagnosis:', currentDate);
    } else if (showDatePicker === 'followUp') {
      setFollowUpDate(currentDate);
      setState({...state, followUpDate: currentDate}); // Update state
      console.log('Date for Next Dose:', currentDate);
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
  const handleConditionChange = condition => {
    setSelectedCondition(condition);
    // If "Other" is selected, show the custom condition input field
    if (condition === 'Other') {
      setShowCustomConditionInput(true);
      setSelectedCondition(condition);
    } else {
      setShowCustomConditionInput(false);
      setSelectedCondition(condition);
    }
  };

  const [state, setState] = React.useState({
    condition: '',
    dateOfDiagnosis: '',
    impression: '',
    drugsPrescribed: '',
    dosage: '',
    frequency: '',
    duration: '',
    followUpDate: '',
    isPregnant: false,
    labTests: '',
    sessionId: '',
    biometricsVerified: isBeneficiaryConfirmed,
    simprintsGui: dataResults,

    // registeredById: '',
  });

  const handleSubmit = async () => {
    console.log(patientId);
    try {
      if (state.isLoading) {
        // Prevent multiple submissions
        return;
      }
      setState({ ...state, isLoading: true }); // Set isLoading state to true
  
      if (
        (selectedCondition === 'Other' && customCondition === '') || // Check if custom condition is empty when "Other" is selected
        state.dateOfDiagnosis === '' ||
        state.impression === ''
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
  
      // Format date strings
      const formattedDateOfDiagnosis = format(
        new Date(state.dateOfDiagnosis),
        'yyyy-MM-dd'
      );
      const formattedFollowUpDate = format(
        new Date(state.followUpDate),
        'yyyy-MM-dd'
      );
      
      // Determine the condition to post based on whether "Other" is selected
      const conditionToPost =
        selectedCondition === 'Other' ? customCondition : selectedCondition;
  
      const response = await fetch(`${URLS.BASE}/${patientId}/diagnosis`, {
        method: 'POST',
        body: JSON.stringify({
          condition: conditionToPost, // Use the determined condition
          dateOfDiagnosis: formattedDateOfDiagnosis,
          impression: state.impression,
          drugsPrescribed: state.drugsPrescribed,
          dosage: state.dosage,
          frequency: state.frequency,
          duration: state.duration,
          labTests: state.labTests,
          followUpDate: formattedFollowUpDate,
          isPregnant: state.isPregnant,
          simSessionId: state.sessionId,
          medicines: medicines,
          biometricsVerified: isBeneficiaryConfirmed,
          diagnosedBy: userNames,
          simprintsGui: dataResults,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Diagnosis Registered successfully');
        navigation.navigate('Dashboard');
      } else {
        console.log(state, medicines);
        console.error('Error posting data:', response.status);
        Alert.alert(
          'Error',
          'Failed to Register Diagnosis. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert(
        'Error',
        'Failed to Register Diagnosis. Please try again later.'
      );
      console.log(response);
    } finally {
      setState({ ...state, isLoading: false }); // Reset isLoading state to false
    }
  };
  

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
        <Text style={[STYLES.centerHeader, STYLES.title]}>
          MEDICAL DIAGNOSIS
        </Text>
      }
    />
  );

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
              selectedValue={medicine.dose}
              onValueChange={value =>
                handleMedicineChange(index, 'dose', value)
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

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <ScrollView style={STYLES.body}>
        {/* signs and symptoms */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Signs and Symptoms:</Text>
          <TextInput
            style={[
              STYLES.field,
              {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
            ]} // Add color and placeholderTextColor styles
            placeholderTextColor={COLORS.GREY}
            value={state.impression}
            onChangeText={text => setState({...state, impression: text})}
            placeholder='signs and symptoms e.g "Headache, Fever, Cough"'
            multiline={true}
            numberOfLines={3}
          />
        </View>

        {/* Date for diagnosis */}

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Date for Diagnosis:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            onPress={() => setShowDatePicker('diagnoses')}>
            <Text style={STYLES.datePickerText}>
              {formatDate(dateOfDiagnosis)}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'diagnoses' && (
            <DateTimePicker
              value={dateOfDiagnosis || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* LAB TESTS */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Lab Tests and Results:</Text>
          <TextInput
            style={[
              STYLES.field,
              {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
            ]} // Add color and placeholderTextColor styles
            placeholderTextColor={COLORS.GREY}
            value={state.labTests}
            onChangeText={text => setState({...state, labTests: text})}
            placeholder='Lab tests and results e.g "Malaria positive"'
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Follow Up date:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            placeholderTextColor={COLORS.GREY}
            onPress={() => setShowDatePicker('followUp')}>
            <Text style={STYLES.datePickerText}>
              {formatDate(followUpDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'followUp' && (
            <DateTimePicker
              value={followUpDate || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Condition */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Condition:</Text>

          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={selectedCondition}
            onValueChange={handleConditionChange}
            style={[STYLES.field, {color: COLORS.BLACK}]} // Add color style
            dropdownIconColor={COLORS.GREY_LIGHTER}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Malaria" value="Malria" />
            <Picker.Item label="Headache" value="Headache" />
            <Picker.Item label="Flue" value="Flue" />

            <Picker.Item label="Fever" value="Fever" />
            <Picker.Item label="Deworming" value="Deworming" />
            <Picker.Item label="Arthritis" value="Arthritis" />
            <Picker.Item label="Dehydration" value="Dehydration" />
            <Picker.Item label="Diabetes" value="Diabetes" />
            <Picker.Item label="Malnutrition" value="Malnutrition" />
            <Picker.Item label="Pneumonia" value="Pneumonia" />
            <Picker.Item
              label="Hypertension (High Blood Pressure)"
              value="Hypertension (High Blood Pressure)"
            />
            <Picker.Item label="Other" value="Other" />
          </Picker>

          {showCustomConditionInput && (
            <TextInput
              placeholder="Enter custom condition"
              value={customCondition}
              placeholderTextColor={COLORS.GREY}
              style={[STYLES.field, {color: COLORS.BLACK}]}
              multiline={true}
              numberOfLines={3}
              onChangeText={text => setCustomCondition(text)}
            />
          )}
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>
            Is pregnant? {state.isPregnant == false ? 'No' : 'Yes'}
          </Text>
          <Switch
            style={STYLES.switch}
            onValueChange={text => setState({...state, isPregnant: text})}
            value={state.isPregnant}
          />
        </View>

        {/* Render medicine inputs */}
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

export default PatientMedical;

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
    paddingVertical: 15,
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
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    color: COLORS.BLACK,
    fontSize: 14,
  },
  userLabel: {
    fontWeight: 'medium',
    marginHorizontal: 5,
    marginVertical: 10,
    color: COLORS.BLACK,
    fontSize: 16,
    textAlign: 'center',
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
  switch: {
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10,
  },
  guid: {
    textAlign: 'left',
    color: COLORS.BLACK,
    fontSize: 11,
    fontWeight: 'bold ',
    display: 'none',
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
    backgroundColor: COLORS.GREY_LIGHTER,
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
    alignItems: 'center',
    minHeight: 70,
  },
  detail: {
    flex: 1,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    // height: 50,
    // marginHorizontal: 5,
    fontStyle: 10,
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
  guid: {
    textAlign: 'left',
    color: COLORS.BLACK,
    fontSize: 11,
    fontWeight: 'bold ',
  },
  datePickerText: {
    paddingVertical: 10,
    paddingLeft: 12,
    fontSize: 15,
    color: COLORS.BLACK,
  },
  medicineContainer: {
    marginBottom: 20,
  },
  medicineLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  medicineInput: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    color: COLORS.BLACK,
  },
  medicineRemoveButton: {
    color: COLORS.BLACK, // Customize the color as needed
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'right',
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
});
