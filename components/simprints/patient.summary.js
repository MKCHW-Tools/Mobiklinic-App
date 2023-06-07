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
import DateTimePicker from '@react-native-community/datetimepicker';
import {COLORS, DIMENS} from '../constants/styles';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {DiagnosisContext} from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';

import {useNavigation} from '@react-navigation/native';

const PatientSummary = ({route, navigation}) => {
  const {simprintsGuid} = route.params;

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
      title={<Text style={[STYLES.centerHeader, STYLES.title]}>Back</Text>}
      right={
        <TouchableOpacity
          onPress={() => save()}
          style={{
            marginHorizontal: 4,
            width: 35,
            height: 35,
            borderRadius: 100,
            backgroundColor: COLORS.BLACK,
            borderColor: COLORS.BLACK,
            borderStyle: 'solid',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="check" size={25} color={COLORS.WHITE} />
        </TouchableOpacity>
      }
    />
  );
  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Patient Profile </Text>
        <Text style={STYLES.text}>
          Full Name {'\n'}
          {route.params.paramKey.first_name}
          {route.params.paramKey.last_name}
        </Text>
        <Text style={STYLES.text}>
          Phone Number {'\n'}{route.params.paramKey.phone_number}
        </Text>
        <Text style={STYLES.text}>
          Primary Language{'\n'}{route.params.paramKey.primary_language}
        </Text>
        <Text style={STYLES.text}>
          District{'\n'}{route.params.paramKey.district}
        </Text>
        <Text style={STYLES.text}>Country{'\n'}{route.params.paramKey.country}</Text>
        <Text style={STYLES.text}>
          Age Group{'\n'}{route.params.paramKey.age_group}
        </Text>

        <Text style={STYLES.text}>Simprints GUID{'\n'}</Text>

        <TouchableOpacity
          style={STYLES.btn}
          onPress={() => navigation.navigate('SelectActivity')}>
          <Text style={STYLES.btnText}>Confirm Details</Text>
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

export default PatientSummary;

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
  text: {
    flex: 1,
    paddingVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: COLORS.BLACK,
    fontWeight: 'MEDIUM',
    borderBottomWidth: 1,
    padding: DIMENS.PADDING,
    borderBottomColor: '#000',
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
    paddingVertical: -5,
    marginBottom: 10,
  },
  pickerItemStyle: {
    color: 'rgba(0,0,0,0.7)',
    fontWeight: 'bold', // Customize the text color here
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
