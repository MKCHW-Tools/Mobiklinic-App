import React, {useContext, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import {validationSchema} from '../helpers/validationSchema';

const PatientData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;
  const {dataResults} = useContext(DataResultsContext);

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
  });

  const handleSubmit = async values => {
    try {
      const response = await fetch(
        'https://mobi-be-production.up.railway.app/patients',
        {
          method: 'POST',
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            sex: values.sex,
            ageGroup: values.ageGroup,
            phoneNumber: values.phoneNumber,
            weight: values.weight,
            height: values.height,
            district: values.district,
            country: values.country,
            primaryLanguage: values.primaryLanguage,
            simprintsGui: dataResults,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        await AsyncStorage.setItem('PatientData', JSON.stringify(values));

        Alert.alert('Data posted successfully');
        navigation.navigate('SelectActivity');
      } else {
        console.error('Error posting data:', response.status);
        Alert.alert('Error', 'Failed to submit data. Please try again later.');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
    }
    console.log(values);
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
          BENEFIARY INFORMATION
        </Text>
      }
    />
  );

  // if (state.isLoading) return <Loader />;

  return (
    <Formik
      initialValues={{
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
        // simprintsGui: dataResults,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {formikProps => (
        <View style={STYLES.wrapper}>
          {_header()}
          <ScrollView style={STYLES.body}>

            {/* Simprints GUI */}
            <View style={STYLES.labeled}>
              <Text style={STYLES.label}>Simprints GUI</Text>
              <TextInput
                style={STYLES.guid}
                value={dataResults}
                onChangeText={text => setState({...state, simprintsGui: text})}
              />
            </View>
            {/* First Name */}
            <View style={STYLES.labeled}>
              <Text style={STYLES.label}>First Name:</Text>
              <TextInput
                style={STYLES.field}
                // value={state.firstName}
                // onChangeText={text => setState({...state, firstName: text})}
                value={formikProps.values.firstName}
                onChangeText={formikProps.handleChange('firstName')}
                onBlur={formikProps.handleBlur('firstName')}
              />
              {formikProps.touched.firstName &&
                formikProps.errors.firstName && (
                  <Text style={STYLES.error}>
                    {formikProps.errors.firstName}
                  </Text>
                )}
            </View>

            {/* Last Name */}
            <View style={STYLES.labeled}>
              <Text style={STYLES.label}>Last Name:</Text>
              <TextInput
                style={STYLES.field}
                value={formikProps.values.lastName}
                onChangeText={formikProps.handleChange('lastName')}
                onBlur={formikProps.handleBlur('lastName')}
              />
              {formikProps.touched.lastName && formikProps.errors.lastName && (
                <Text style={STYLES.error}>{formikProps.errors.lastName}</Text>
              )}
            </View>
            {/* Phone Number */}
            <View style={STYLES.labeled}>
              <Text style={STYLES.label}>Phone Number:</Text>
              <TextInput
                style={STYLES.field}
                // value={state.phoneNumber}
                keyboardType="phone-pad"
                value={formikProps.values.phoneNumber}
                onChangeText={formikProps.handleChange('phoneNumber')}
                onBlur={formikProps.handleBlur('phoneNumber')}
              />
              {formikProps.touched.phoneNumber &&
                formikProps.errors.phoneNumber && (
                  <Text style={STYLES.error}>
                    {formikProps.errors.phoneNumber}
                  </Text>
                )}
            </View>

            <View style={STYLES.wrap}>
              {/* Sex */}
              <View
                style={STYLES.detail}
                placeholderTextColor="rgba(0,0,0,0.7)">
                <Picker
                  placeholder="Sex"
                  placeholderTextColor={COLORS.BLACK}
                  style={STYLES.pickerItemStyle}
                  selectedValue={formikProps.values.sex}
                  onValueChange={formikProps.handleChange('sex')}
                  onBlur={formikProps.handleBlur('sex')}>
                  <Picker.Item label="Sex" value="Gender" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                {/* {formikProps.touched.sex && formikProps.errors.sex && (
                  <Text style={STYLES.error}>{formikProps.errors.sex}</Text>
                )} */}
              </View>
              {/* Age Group */}
              <View
                style={STYLES.detail}
                placeholderTextColor="rgba(0,0,0,0.7)">
                <Picker
                  placeholder="Age"
                  placeholderTextColor={COLORS.BLACK}
                  // selectedValue={state.ageGroup}
                  // onValueChange={(value, index) =>
                  //   setState({...state, ageGroup: value})
                  // }
                  style={STYLES.pickerItemStyle}
                  selectedValue={formikProps.values.ageGroup}
                  onValueChange={formikProps.handleChange('ageGroup')}
                  onBlur={formikProps.handleBlur('ageGroup')}>
                  <Picker.Item label="Age" value="Age group" />
                  <Picker.Item label="0 - 3" value="0 - 3" />
                  <Picker.Item label="3 - 10" value="3 - 10" />
                  <Picker.Item label="10 - 17" value="10 - 17" />
                  <Picker.Item label="17 - 40" value="17 - 40" />
                  <Picker.Item label="40 - 60" value="40 - 60" />
                  <Picker.Item label="60 above" value="60 above" />
                </Picker>
                {/* {formikProps.touched.ageGroup &&
                  formikProps.errors.ageGroup && (
                    <Text style={STYLES.error}>
                      {formikProps.errors.ageGroup}
                    </Text>
                  )} */}
              </View>
            </View>

            <View style={STYLES.wrap}>
              {/* Weight */}
              <View style={STYLES.detail}>
                {/* <Text style={STYLES.label}>Weight:</Text> */}
                <TextInput
                  keyboardType="numeric"
                  // value={state.weight}
                  onBlur={formikProps.handleBlur('weight')}
                  value={formikProps.values.weight}
                  onChangeText={formikProps.handleChange('weight')}
                  placeholderTextColor={COLORS.BLACK}
                  // onChangeText={text => setState({...state, weight: text})}
                  placeholder="Weight (Kgs)"
                />
                {/* {formikProps.touched.weight && formikProps.errors.weight && (
                  <Text style={STYLES.error}>{formikProps.errors.weight}</Text>
                )} */}
              </View>

              {/* Height */}
              <View style={STYLES.detail}>
                {/* <Text style={STYLES.label}>Height:</Text> */}
                <TextInput
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.BLACK}
                  onBlur={formikProps.handleBlur('height')}
                  value={formikProps.values.height}
                  onChangeText={formikProps.handleChange('height')}
                  // value={state.weight}
                  // onChangeText={text => setState({...state, weight: text})}
                  placeholder="Height (cm)"
                />
                {/* {formikProps.touched.height && formikProps.errors.height && (
                  <Text style={STYLES.error}>{formikProps.errors.height}</Text>
                )} */}
              </View>
            </View>

            {/* country */}
            <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
              <Text style={STYLES.label}>Country:</Text>

              <Picker
                placeholder="Country"
                placeholderTextColor={COLORS.BLACK}
                // selectedValue={state.country}
                // onValueChange={(value, index) =>
                //   setState({...state, country: value})
                // }
                selectedValue={formikProps.values.country}
                onValueChange={formikProps.handleChange('country')}
                onBlur={formikProps.handleBlur('country')}
                style={STYLES.pickers}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Uganda" value="Uganda" />
                <Picker.Item label="Kenya" value="Kenya" />
                <Picker.Item label="Rwanda" value="Rwanda" />
                <Picker.Item label="Tanzania" value="Tanzania" />
              </Picker>
              {formikProps.touched.country && formikProps.errors.country && (
                <Text style={STYLES.error}>{formikProps.errors.country}</Text>
              )}
            </View>
            {/* District */}
            <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
              <Text style={STYLES.label}>District:</Text>

              <Picker
                placeholder="District"
                placeholderTextColor={COLORS.BLACK}
                // selectedValue={state.district}
                // onValueChange={(value, index) =>
                //   setState({...state, district: value})
                // }
                selectedValue={formikProps.values.district}
                onValueChange={formikProps.handleChange('district')}
                onBlur={formikProps.handleBlur('district')}
                style={STYLES.pickers}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Kampala" value="Kampala" />
                <Picker.Item label="Buikwe" value="Buikwe" />
                <Picker.Item label="Jinja" value="Jinja" />
                <Picker.Item label="Masaka" value="Masaka" />
                <Picker.Item label="Mbarara" value="Mbarara" />
              </Picker>
              {formikProps.touched.district && formikProps.errors.district && (
                <Text style={STYLES.error}>{formikProps.errors.district}</Text>
              )}
            </View>

            {/* Primary Language */}
            <View style={STYLES.labeled} placeholderTextColor="rgba(0,0,0,0.7)">
              <Text style={STYLES.label}>Primary Language:</Text>

              <Picker
                placeholder="Primary Language"
                placeholderTextColor={COLORS.BLACK}
                // selectedValue={state.primaryLanguage}
                // onValueChange={(value, index) =>
                //   setState({...state, primaryLanguage: value})
                // }
                selectedValue={formikProps.values.primaryLanguage}
                onValueChange={formikProps.handleChange('primaryLanguage')}
                onBlur={formikProps.handleBlur('primaryLanguage')}
                style={STYLES.pickers}>
                <Picker.Item label="" value="" />

                <Picker.Item label="Luganda" value="Luganda" />
                <Picker.Item label="Lusoga" value="Lusoga" />
                <Picker.Item label="Runyakore" value="Runyakore" />
                <Picker.Item label="Rutoro" value="Rutoro" />
                <Picker.Item label="English" value="English" />
              </Picker>
              {formikProps.touched.primaryLanguage &&
                formikProps.errors.primaryLanguage && (
                  <Text style={STYLES.error}>
                    {formikProps.errors.primaryLanguage}
                  </Text>
                )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={STYLES.submit} onPress={handleSubmit}>
              <Text style={STYLES.submitText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </Formik>
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
    paddingVertical:2,
  },
  alert: {
    color: COLORS.ACCENT_1,
    textAlign: 'center',
    marginTop: 15,
    backgroundColor: COLORS.WHITE,
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
    fontSize: 16,
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
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  guid: {
    textAlign: 'left',
    color: COLORS.BLACK,
    fontSize: 11,
    fontWeight: 'bold',
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
  error: {
    color: 'red',
    fontSize: 12,
    marginTop:1,
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
