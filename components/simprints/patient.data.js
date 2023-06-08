import * as React from 'react';
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
import {COLORS, DIMENS} from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {useNavigation} from '@react-navigation/native';

import {DiagnosisContext} from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';

const PatientData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  // const navigation = useNavigation();
  // date
  const currentDate = new Date();

  const [state, setState] = React.useState({
    isLoading: false,
    firstName: '',
    sex: 'female',
    ageGroup: '',
    phoneNumber: '',
    lastName: '',
    weight: '',
    height: '',
    district: '',
    country: '',
    primaryLanguage: '',
  });

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
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />

      {_header()}

      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Patient Profile</Text>
        {/* first Name */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.BLACK}
          onChangeText={text => setState({...state, firstName: text})}
          value={state.firstName}
          placeholder="First Name *"
        />
        {/* last name */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.BLACK}
          onChangeText={text => setState({...state, lastName: text})}
          value={state.lastName}
          placeholder="Last Name *"
        />

        {/* Phone Number */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          keyboardType="phone-pad"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, phoneNumber: text})}
          value={state.phoneNumber}
          placeholder="Phone Number *"
        />
        {/* district */}
        <View style={STYLES.pickers} placeholderTextColor="rgba(0,0,0,0.7)">
          <Picker
            placeholder="District"
            selectedValue={state.country}
            onValueChange={(value, index) =>
              setState({...state, country: value})
            }
            style={STYLES.pickerItemStyle}>
            <Picker.Item label="Country" value="Country" />
            <Picker.Item label="Uganda" value="Uganda" />
            <Picker.Item label="Kenya" value="Kenya" />
            <Picker.Item label="Rwanda" value="Rwanda" />
            <Picker.Item label="Tanzania" value="Tanzania" />
          </Picker>
        </View>

        {/* district */}
        <View style={STYLES.pickers} placeholderTextColor="rgba(0,0,0,0.7)">
          <Picker
            placeholder="District"
            selectedValue={state.district}
            onValueChange={(value, index) =>
              setState({...state, district: value})
            }
            style={STYLES.pickerItemStyle}>
            <Picker.Item label="District" value="District" />
            <Picker.Item label="Kampala" value="Kampala" />
            <Picker.Item label="Buikwe" value="Buikwe" />
            <Picker.Item label="Jinja" value="Jinja" />
            <Picker.Item label="Masaka" value="Masaka" />
            <Picker.Item label="Mbarara" value="Mbarara" />
          </Picker>
        </View>

        {/* primary_language */}
        <View style={STYLES.pickers} placeholderTextColor="rgba(0,0,0,0.7)">
          <Picker
            placeholder="Language*"
            selectedValue={state.primaryLanguage}
            onValueChange={(value, index) =>
              setState({...state, primaryLanguage: value})
            }
            style={STYLES.pickerItemStyle}>
            <Picker.Item label="Primary Language" value="Language" />
            <Picker.Item label="Luganda" value="Luganda" />
            <Picker.Item label="Lusoga" value="Lusoga" />
            <Picker.Item label="Runyakore" value="Runyakore" />
            <Picker.Item label="Rutoro" value="Rutoro" />
            <Picker.Item label="English" value="English" />
          </Picker>
        </View>

        {/* sex */}
        <View style={STYLES.pickers}>
          <Picker
            placeholder="Gender"
            selectedValue={state.sex}
            onValueChange={(value, index) => setState({...state, sex: value})}
            style={STYLES.pickerItemStyle}>
            <Picker.Item label="Gender *" value="Gender" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* age group */}
        <View style={STYLES.pickers} placeholderTextColor="rgba(0,0,0,0.7)">
          <Picker
            style={{color: 'rgba(0,0,0,0.7)'}}
            selectedValue={state.ageGroup}
            onValueChange={(value, index) =>
              setState({...state, ageGroup: value})
            }>
            <Picker.Item label="Age group" value="Age group" />
            <Picker.Item label="0 - 3" value="0 - 3" />
            <Picker.Item label="3 - 10" value="3 - 10" />
            <Picker.Item label="10 - 17" value="10 - 17" />
            <Picker.Item label="17 - 40" value="17 - 40" />
            <Picker.Item label="40 - 60" value="40 - 60" />
            <Picker.Item label="60 above" value="60 above" />
          </Picker>
        </View>

        {/* wieght and height */}
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            keyboardType="numeric"
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, weight: text})}
            value={state.weight}
            placeholder="Weight(kg)"
          />
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            keyboardType="numeric"
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, height: text})}
            value={state.height}
            placeholder="Height(cm)"
          />
        </View>

        <TouchableOpacity
          style={STYLES.btn}
          onPress={() =>
            navigation.navigate('PatientSummary', {paramKey: state})
          }>
          <Text style={STYLES.btnText}>Next</Text>
          <Icon
            name="arrow-right"
            size={20}
            strokeSize={3}
            color={COLORS.WHITE}
          />
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
    // borderBottomColor: 'rgba(0,0,0,0.7)',
    // borderBottomWidth:1,
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
    // fontWeight: 'bold', // Customize the text color here
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
  label: {
    flex: 2,
    color: 'rgba(0,0,0,0.7)',
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
  },
  detail: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: 15,
    backgroundColor: COLORS.GREY_LIGHTER,
    color: 'rgba(0,0,0,0.7)',
  },
  btn: {
    backgroundColor: COLORS.BLACK,
    padding: DIMENS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 16,
    alignItems: 'center',
    fontWeight: '900',
    justifyContent: 'center',
    paddingLeft: 40,
    color: COLORS.WHITE,
  },
});
