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
import {
  _removeStorageItem,
} from '../helpers/functions';
import {DiagnosisContext} from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';
import {COLORS, DIMENS} from '../constants/styles';


const PatientData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);
  const {userLog} = useContext(DataResultsContext);
  // const [ id, setId ] = React.useState(userLog.length > 0 ? userLog[0].id : '');

 

  // const navigation = useNavigation();
  // date
  const currentDate = new Date();

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
    registeredById: '',
  });

  const handleSubmit = async () => {
    try {
      console.log('User Id:', id);
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/${userLog}/patients`,
        {
          method: 'POST',
          body: JSON.stringify({
            firstName: state.firstName,
            lastName: state.lastName,
            sex: state.sex,
            ageGroup: state.ageGroup,
            phoneNumber: state.phoneNumber,
            weight: state.weight,
            height: state.height,
            district: state.district,
            country: state.country,
            primaryLanguage: state.primaryLanguage,
            simprintsGui: dataResults,
            registeredById: userLog,
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
        console.log('Data posted successfully');
      } else {
        console.error('Error posting data:', response.status);
        Alert.alert('Error', 'Failed to submit data. Please try again later.');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
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
        <Text style={[STYLES.centerHeader, STYLES.title]}>PATIENT PROFILE</Text>
      }
    />
  );

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      {_header()}
      <ScrollView style={STYLES.body}>
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

        {/* Sex */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Sex:</Text>
          <TextInput
            style={STYLES.field}
            value={state.sex}
            onChangeText={text => setState({...state, sex: text})}
            placeholder="Enter sex"
          />
        </View>

        {/* Age Group */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Age Group:</Text>
          <TextInput
            style={STYLES.field}
            value={state.ageGroup}
            onChangeText={text => setState({...state, ageGroup: text})}
            placeholder="Enter age group"
          />
        </View>

        {/* Phone Number */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Phone Number:</Text>
          <TextInput
            style={STYLES.field}
            value={state.phoneNumber}
            onChangeText={text => setState({...state, phoneNumber: text})}
            placeholder="Enter phone number"
          />
        </View>

        {/* Weight */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Weight:</Text>
          <TextInput
            style={STYLES.field}
            value={state.weight}
            onChangeText={text => setState({...state, weight: text})}
            placeholder="Enter weight"
          />
        </View>

        {/* Height */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Height:</Text>
          <TextInput
            style={STYLES.field}
            value={state.height}
            onChangeText={text => setState({...state, height: text})}
            placeholder="Enter height"
          />
        </View>

        {/* District */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>District:</Text>
          <TextInput
            style={STYLES.field}
            value={state.district}
            onChangeText={text => setState({...state, district: text})}
            placeholder="Enter district"
          />
        </View>

        {/* Country */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Country:</Text>
          <TextInput
            style={STYLES.field}
            value={state.country}
            onChangeText={text => setState({...state, country: text})}
            placeholder="Enter country"
          />
        </View>

        {/* Primary Language */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Primary Language:</Text>
          <TextInput
            style={STYLES.field}
            value={state.primaryLanguage}
            onChangeText={text => setState({...state, primaryLanguage: text})}
            placeholder="Enter primary language"
          />
        </View>

        {/* Simprints GUI */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Simprints GUI:</Text>
          <TextInput
            style={STYLES.field}
            value={dataResults}
            onChangeText={text => setState({...state, simprintsGui: text})}
            placeholder="Enter simprints GUI"
          />
        </View>

        {/* User id */}
        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>Registered By:</Text>
          <TextInput
            style={STYLES.field}
            value={userLog}
            onChangeText={text => setState({...state, registeredById: text})}
          />
        </View>

        {/* Submit Button */}
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
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: COLORS.GREY,
  },
  pickerItemStyle: {
    color: 'rgba(0,0,0,0.7)',
  },
  labeled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
  },
  field: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  submit: {
    flexDirection: 'row',
    padding: DIMENS.PADDING,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
  },
  submitText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
});
