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
  const [medicines, setMedicines] = useState([
    {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      description: '',
    },
  ]);

  const [dateOfDiagnosis, setDateOfDiagnosis] = useState(''); // Add state for date of vaccination
  const [followUpDate, setFollowUpDate] = useState(''); // Add state for date for next dose

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
    // registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      if (state.isLoading) {
        // Prevent multiple submissions
        return;
      }
      setState({...state, isLoading: true}); // Set isLoading state to true

      if (
        state.condition === '' ||
        state.dateOfDiagnosis === '' ||
        state.impression === ''
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Format date strings
      const formattedDateOfDiagnosis = format(
        new Date(state.dateOfDiagnosis),
        'yyyy-MM-dd',
      );
      const formattedFollowUpDate = format(
        new Date(state.followUpDate),
        'yyyy-MM-dd',
      );

      const response = await fetch(`${URLS.BASE}/${patientId}/diagnosis`, {
        method: 'POST',
        body: JSON.stringify({
          condition: state.condition,
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
          medicines: medicines, // Use the medicines array as is
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
        console.error('Error posting data:', response.status);
        Alert.alert(
          'Error',
          'Failed to Register Diagnosis. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert(
        'Error',
        'Failed to Register Diagnosis. Please try again later.',
      );
    } finally {
      setState({...state, isLoading: false}); // Reset isLoading state to false
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

  const renderMedicineInputs = () => {
    return medicines.map((medicine, index) => (
      <View key={index}>
        <Text style={STYLES.label}>Medicine #{index + 1}:</Text>
        <TextInput
          style={[
            STYLES.field,
            {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
          ]}
          placeholderTextColor={COLORS.GREY}
          value={medicine.name}
          onChangeText={text => handleMedicineChange(index, 'name', text)}
          placeholder="Medicine Name"
        />

        <TextInput
          style={[
            STYLES.field,
            {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
          ]}
          placeholderTextColor={COLORS.GREY}
          value={medicine.dosage}
          onChangeText={text => handleMedicineChange(index, 'dosage', text)}
          placeholder="Dosage"
        />

        <TextInput
          style={[
            STYLES.field,
            {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
          ]}
          placeholderTextColor={COLORS.GREY}
          value={medicine.frequency}
          onChangeText={text => handleMedicineChange(index, 'frequency', text)}
          placeholder="Frequency"
        />

        <TextInput
          style={[
            STYLES.field,
            {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
          ]}
          placeholderTextColor={COLORS.GREY}
          value={medicine.duration}
          onChangeText={text => handleMedicineChange(index, 'duration', text)}
          placeholder="Duration"
        />

        <TextInput
          style={[
            STYLES.field,
            {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
          ]}
          placeholderTextColor={COLORS.GREY}
          value={medicine.description}
          onChangeText={text =>
            handleMedicineChange(index, 'description', text)
          }
          placeholder="Description"
        />
        <TouchableOpacity onPress={() => handleRemoveMedicine(index)}>
          <Text style={STYLES.label}>Remove</Text>
        </TouchableOpacity>
      </View>
    ));
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

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <ScrollView style={STYLES.body}>
        {/* <View style={STYLES.guid}>
          <Text style={STYLES.label}>Simprints Session ID</Text>
          <TextInput
            style={STYLES.guid}
            value={sessionId}
            onChangeText={text => setState({...state, simSessionId: text})}
            placeholder="Enter simprints session ID"
          />
        </View> */}
        {/* condition */}
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

        {/* Condition */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Condition:</Text>
          <TextInput
            style={[
              STYLES.field,
              {color: COLORS.BLACK, placeholderTextColor: COLORS.GRAY},
            ]} // Add color and placeholderTextColor styles
            placeholderTextColor={COLORS.GREY}
            value={state.condition}
            onChangeText={text => setState({...state, condition: text})}
            placeholder='e.g "Malaria"'
            multiline={true}
            numberOfLines={3}
          />
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
        <TouchableOpacity onPress={handleAddMedicine}>
          <Text style={STYLES.label}>Add Medicine</Text>
        </TouchableOpacity>

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
});
