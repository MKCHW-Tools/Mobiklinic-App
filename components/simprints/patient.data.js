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

const PatientData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {userLog} = useContext(DataResultsContext);
  const {patientId, setPatientId} = useContext(DataResultsContext);

  // date
  const currentDate = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [ageGroup, setAgeGroup] = useState(''); // Add state for date of vaccination

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || ageGroup;
    setShowDatePicker(false);

    // Update the respective state based on the selected date
    if (showDatePicker === 'patient') {
      setAgeGroup(currentDate);
      setState({...state, ageGroup: currentDate});
      console.log('Date of birth:', currentDate);
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
    firstName: '',
    sex: '',
    ageGroup: '',
    phoneNumber: '',
    lastName: '',
    weight: '',
    height: '',
    district: '',
    country: '',
    primaryLanguage: '',
    simprintsGui: '',
    // registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('User Id:', userLog);

      if (state.isLoading) {
        // Prevent multiple submissions
        return;
      }
      setState({...state, isLoading: true}); // Set isLoading state to true

      if (
        state.firstName === '' ||
        state.lastName === '' ||
        ageGroup === '' ||
        state.phoneNumber === ''
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Remove any non-digit characters from the phone number
      const phoneNumber = state.phoneNumber.replace(/\D/g, '');

      // Check if the resulting phone number has exactly 10 digits
      if (phoneNumber.length !== 10) {
        Alert.alert('Error', 'Phone number must be 10 digits');
        return;
      }

      const response = await fetch(
        `https://mobi-be-production.up.railway.app/${userLog}/patients`,
        {
          method: 'POST',
          body: JSON.stringify({
            firstName: state.firstName,
            lastName: state.lastName,
            sex: state.sex,
            ageGroup: ageGroup,
            phoneNumber: state.phoneNumber,
            weight: state.weight,
            height: state.height,
            district: state.district,
            country: state.country,
            primaryLanguage: state.primaryLanguage,
            simprintsGui: dataResults,
            // registeredById: userLog,
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
        // Extract the patient ID from the response data
        const patientId = data.id; // Access the patient ID from the response data
        setPatientId(patientId);
        console.log('Patient ID:', patientId);
        Alert.alert('Data posted successfully');
        navigation.navigate('SelectActivity', {patientId: patientId});
      } else {
        console.error('Error posting data:', response.status);
        Alert.alert('Error', 'Failed to submit data. Please try again later.');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
    } finally {
      setState({...state, isLoading: false}); // Reset isLoading state to false
    }
  };

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{
            marginHorizontal: 4,
            // width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Icon name="arrow-left" size={25} color={COLORS.BLACK} /> */}
        </TouchableOpacity>
      }
      title={
        <Text style={[STYLES.centerHeader, STYLES.title]}>PATIENT PROFILE</Text>
      }
    />
  );

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {/* {_header()} */}

      <ScrollView style={STYLES.body}>
        <Text style={STYLES.title}>Beneficiary Profile</Text>

        {/* Simprints GUI */}
        <View style={STYLES.guid}>
          <Text style={STYLES.label}>Simprints GUI</Text>
          <TextInput
            style={STYLES.guid}
            value={dataResults}
            onChangeText={text => setState({...state, simprintsGui: text})}
            placeholder="Enter simprints GUI"
          />
        </View>
        {/* First Name */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>First Name:</Text>
          <TextInput
            style={STYLES.field}
            value={state.firstName}
            onChangeText={text => setState({...state, firstName: text})}
            placeholder="Enter first name"
          />
        </View>

        {/* Last Name */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Last Name:</Text>
          <TextInput
            style={STYLES.field}
            value={state.lastName}
            onChangeText={text => setState({...state, lastName: text})}
            placeholder="Enter last name"
          />
        </View>

        {/* Last Name */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Phone Number:</Text>
          <TextInput
            style={STYLES.field}
            value={state.phoneNumber}
            onChangeText={text => setState({...state, phoneNumber: text})}
            keyboardType="numeric"
            placeholder='eg:"0772700900'
          />
        </View>

        {/* Sex */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Sex:</Text>

          <Picker
            placeholder="Sex"
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.sex}
            onValueChange={(value, index) => setState({...state, sex: value})}
            style={STYLES.field}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {/* Age Group */}
        {/* <View style={STYLES.detail} placeholderTextColor="rgba(0,0,0,0.7)">
            <Picker
              placeholder="Age"
              placeholderTextColor={COLORS.BLACK}
              selectedValue={state.ageGroup}
              onValueChange={(value, index) =>
                setState({...state, ageGroup: value})
              }
              style={STYLES.pickerItemStyle}>
              <Picker.Item label="Age" value="Age group" />
              <Picker.Item label="0 - 3" value="0 - 3" />
              <Picker.Item label="3 - 10" value="3 - 10" />
              <Picker.Item label="10 - 17" value="10 - 17" />
              <Picker.Item label="17 - 40" value="17 - 40" />
              <Picker.Item label="40 - 60" value="40 - 60" />
              <Picker.Item label="60 above" value="60 above" />
            </Picker>
          </View> */}

        {/* Date for birth */}

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Date of Birth:</Text>
          <TouchableOpacity
            style={STYLES.datePickerInput}
            onPress={() => setShowDatePicker('patient')}>
            <Text style={STYLES.datePickerText}>{formatDate(ageGroup)}</Text>
          </TouchableOpacity>
          {showDatePicker === 'patient' && (
            <DateTimePicker
              value={ageGroup || new Date()} // Use null or fallback to current date
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={STYLES.wrap}>
          {/* Weight */}
          <View style={STYLES.detail}>
            {/* <Text style={STYLES.label}>Weight:</Text> */}
            <TextInput
              keyboardType="numeric"
              value={state.weight}
              placeholderTextColor={COLORS.BLACK}
              onChangeText={text => setState({...state, weight: text})}
              placeholder="Weight (Kgs)"
              style={STYLES.field}

            />
          </View>
          {/* Height */}
          <View style={STYLES.detail}>
            {/* <Text style={STYLES.label}>Height:</Text> */}
            <TextInput
              keyboardType="numeric"
              placeholderTextColor={COLORS.BLACK}
              value={state.height}
              style={STYLES.field}
              onChangeText={text => setState({...state, height: text})}
              placeholder="Height (cm)"
            />
          </View>
        </View>
        {/* Country */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Country:</Text>

          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.country}
            onValueChange={(value, index) =>
              setState({...state, country: value})
            }
            style={STYLES.field}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Uganda" value="Uganda" />
            <Picker.Item label="Kenya" value="Kenya" />
            <Picker.Item label="Rwanda" value="Rwanda" />
            <Picker.Item label="Tanzania" value="Tanzania" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* District */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>District:</Text>

          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.district}
            onValueChange={(value, index) =>
              setState({...state, district: value})
            }
            style={STYLES.field}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Kampala" value="Kampala" />
            <Picker.Item label="Buikwe" value="Buikwe" />
            <Picker.Item label="Jinja" value="Jinja" />
            <Picker.Item label="Masaka" value="Masaka" />
            <Picker.Item label="Mbarara" value="Mbarara" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Country */}
        <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
          <Text style={STYLES.label}>Primary Language:</Text>

          <Picker
            placeholderTextColor={COLORS.BLACK}
            selectedValue={state.primaryLanguage}
            onValueChange={(value, index) =>
              setState({...state, primaryLanguage: value})
            }
            style={STYLES.field}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Luganda" value="Luganda" />
            <Picker.Item label="Lusoga" value="Lusoga" />
            <Picker.Item label="Runyakore" value="Runyakore" />
            <Picker.Item label="Rutoro" value="Rutoro" />
            <Picker.Item label="English" value="English" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TouchableOpacity style={STYLES.submit} onPress={handleSubmit}>
          <Text style={STYLES.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PatientData;

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
    paddingVertical: 20,
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
    textAlign: 'center',
    flexGrow: 1,
    fontSize: 18,
    paddingVertical: 10,
    textDecorationLine: 'underline',
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
  },
  guid: {
    textAlign: 'left',
    color: COLORS.BLACK,
    fontSize: 11,
    fontWeight: 'bold',
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
  datePickerText: {
    paddingVertical: 10,
    paddingLeft: 12,
    fontSize: 15,
    color: COLORS.BLACK,
  },
  datePickerText: {
    paddingVertical: 10,
    paddingLeft: 12,
    fontSize: 14,
    color: COLORS.BLACK,
  },
});