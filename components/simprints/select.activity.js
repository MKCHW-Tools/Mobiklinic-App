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
  Image,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
// import DateTimePicker from '@react-native-community/datetimepicker';
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

const SelectActivity = ({navigation, route}) => {
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
      title={<Text style={[STYLES.centerHeader]}>Back</Text>}
    />
  );
  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {/* {_header()} */}

      <View style={STYLES.wrap}>
        <Image
          style={{width: 70, height: 70}}
          source={require('../imgs/logo.png')}
        />
        <Text style={STYLES.title}>Mobiklinic</Text>
        <Text style={STYLES.text}>
          Beneficary Name: {'\t'}
          <Text style={{textDecorationLine: 'underline'}}>
            {route.params.paramKey.firstName}
            {'\t'}
            {route.params.paramKey.lastName}
          </Text>
        </Text>

        <View style={STYLES.btnContainer}>
          <TouchableOpacity
            style={STYLES.btn}
            onPress={() => navigation.navigate('PatientMedical')}>
            <Text style={STYLES.btnText}>Diagnose Patient</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={STYLES.btn}
            onPress={() => navigation.navigate('Vaccination')}>
            <Text style={STYLES.btnText}>Vaccination</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={STYLES.btn}
            onPress={() => navigation.navigate('AntenatalCare')}>
            <Text style={STYLES.btnText}>Antenatal Care</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={STYLES.btn}
            onPress={() => navigation.navigate('Dashboard')}>
            <Text style={STYLES.btnText}>Back To Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectActivity;

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
    paddingTop: 50,
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
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  rightHeader: {
    paddingRight: 10,
  },
  tip: {
    color: 'rgba(0,0,0,0.4)',
    paddingTop: 15,
    paddingBottom: 15,
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
    flex: 2,
    alignItems: 'center',
    padding: 20,
  },
  btnContainer: {
    flex: 1,
    marginVertical: 60,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  btn: {
    backgroundColor: COLORS.BLACK,
    padding: DIMENS.PADDING,
    // padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: COLORS.BLACK,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    color: COLORS.ACCENT_1,
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: DIMENS.PADDING,
  },
  text: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    textAlign: 'center',
    // flexGrow: 1,
    fontSize: 16,
  },
});
