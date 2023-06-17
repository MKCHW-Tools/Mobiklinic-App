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

const PatientMedical = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {patientId, setPatientId} = useContext(DataResultsContext);
  const currentDate = new Date();

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
    // registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('Patient ID :', patientId);
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
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/${patientId}/diagnosis`,
        {
          method: 'POST',
          body: JSON.stringify({
            condition: state.condition,
            dateOfDiagnosis: state.dateOfDiagnosis,
            impression: state.impression,
            drugsPrescribed: state.drugsPrescribed,
            dosage: state.dosage,
            frequency: state.frequency,
            duration: state.duration,
            followUpDate: state.followUpDate,
            isPregnant: state.isPregnant,
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
        Alert.alert('Data posted successfully');
        navigation.navigate('Dashboard');
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
        {/* condition */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Patient impression:</Text>
          <TextInput
            style={STYLES.field}
            value={state.impression}
            onChangeText={text => setState({...state, impression: text})}
            placeholder='signs and symptoms e.g "Headache, Fever, Cough"'
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Date for diagnosis */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Date for Diagnosis:</Text>
          <TextInput
            style={STYLES.field}
            value={state.dateOfDiagnosis}
            onChangeText={text => setState({...state, dateOfDiagnosis: text})}
          />
        </View>

        <View style={STYLES.wrap}>
          {/* dose */}
          <View style={STYLES.detail}>
            <TextInput
              value={state.dosage}
              placeholderTextColor={COLORS.BLACK}
              onChangeText={text => setState({...state, dosage: text})}
              placeholder="dosage"
            />
          </View>
          {/* units */}
          <View style={STYLES.detail}>
            <TextInput
              value={state.frequency}
              placeholderTextColor={COLORS.BLACK}
              onChangeText={text => setState({...state, frequency: text})}
              placeholder="frequency"
            />
          </View>

          {/* duration */}
          <View style={STYLES.detail}>
            <TextInput
              value={state.duration}
              placeholderTextColor={COLORS.BLACK}
              onChangeText={text => setState({...state, duration: text})}
              placeholder="duration"
            />
          </View>
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

        {/* Condition */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Condition:</Text>
          <TextInput
            style={STYLES.field}
            value={state.condition}
            onChangeText={text => setState({...state, condition: text})}
            placeholder='e.g "Malaria"'
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Drugs Adminstered */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Drugs Adminstered:</Text>
          <TextInput
            style={STYLES.field}
            value={state.drugsPrescribed}
            onChangeText={text => setState({...state, drugsPrescribed: text})}
            placeholder='e.g "Left Arm"'
          />
        </View>

        {/* follow up date */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Follow Up Date:</Text>
          <TextInput
            style={STYLES.field}
            value={state.followUpDate}
            onChangeText={text => setState({...state, followUpDate: text})}
          />
        </View>

        <TouchableOpacity style={STYLES.submit} onPress={handleSubmit}>
          <Text style={STYLES.submitText}>Submit</Text>
        </TouchableOpacity>
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
    fontSize: 14,
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
});