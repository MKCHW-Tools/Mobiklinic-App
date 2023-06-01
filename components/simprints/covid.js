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

const CovidData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  // date
  const currentDate = new Date();

  const [state, setState] = React.useState({
    isLoading: false,
    vaccineManufacturerOne: '',
    facilityOne: '',
    facilityTwo: '',
    secondDoseDate: '',
    thirdDoseDate: '',
    firstDoseDate: '',
    vaccineManufacturerTwo:'',
    vaccineManufacturerThird:'',

  });

  const save = async () => {
    const {
      vaccineManufacturerOne,
      facilityOne,
      facilityTwo,
      firstDoseDate,
      firstDose,
      secondDoseDate,
      thirdDoseDate,
      vaccineManufacturerTwo,
      vaccineManufacturerThird,

    } = state;
    const code = generateRandomCode(5),
      date = MyDate();

    const newstate = {
      code,
      date,
      patient: {
        vaccineManufacturerOne,
        facilityOne,
        firstDoseDate,
        firstDose,
        facilityTwo,
        secondDoseDate,
        thirdDoseDate,
        vaccineManufacturerTwo, 
        vaccineManufacturerThird,
      },
      details: condition,
      followups: [],
      uploaded: false,
    };

    if (vaccineManufacturerOne && facilityOne && firstDoseDate) {
      // const data = await AsyncStorage.getItem('@diagnosis')
      // const prevstate = data !== null ? JSON.parse(data) : []
      setState({...state, isLoading: true});

      AsyncStorage.setItem(
        '@diagnosis',
        JSON.stringify([newstate, ...diagnoses]),
        () => {
          diagnosisContext.setDiagnoses([newstate, ...diagnoses]);

          Alert.alert('Saved', `Diagnosis code: ${code}`, [{text: 'OK'}]);

          setState({
            vaccineManufacturerOne: '',
            facilityOne: '',
            firstDoseDate: '',
            facilityTwo:'',
            firstDose: false,
            secondDoseDate: '',
            thirdDoseDate,
            vaccineManufacturerTwo,
            followups: [],
            isLoading: false,
          });
        },
      );
    } else {
      Alert.alert('Ooops!', 'Complete all fields', [{text: 'OK'}]);
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
        <Text style={[STYLES.centerHeader, STYLES.title]}>Covid Vaccine</Text>
      }
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

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />

      {_header()}

      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Covid Vaccine.</Text>
        {/* FIRST DOSE*/}
        <View style={STYLES.wrap}>
          <Text style={STYLES.terms}>FIRST DOSE *</Text>

          <View style={STYLES.pickers}>
            <Picker
              style={STYLES.pickerField}
              selectedValue={state.vaccineManufacturerOne}
              placeholderTextColor="rgba(0,0,0,0.7)"
              onValueChange={value =>
                setState({...state, vaccineManufacturerOne: value})
              }>
              <Picker.Item label="Pfizer-BioNTech" value="Pfizer-BioNTech" />
              <Picker.Item label="Moderna" value="Moderna" />
              <Picker.Item
                label="Johnson & Johnson"
                value="Johnson & Johnson"
              />
            </Picker>
          </View>
        </View>
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, facilityOne: text})}
            value={state.facilityOne}
            placeholder="FACILITY"
          />

          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, firstDoseDate: text})}
            value={state.firstDoseDate}
            placeholder="DATE"
          />
        </View>

        {/* SECOND DOSE*/}
        <View style={STYLES.wrap}>
          <Text style={STYLES.terms}>SECOND DOSE</Text>

          <View style={STYLES.pickers}>
            <Picker
              style={STYLES.pickerField}
              selectedValue={state.vaccineManufacturerTwo}
              placeholderTextColor="rgba(0,0,0,0.7)"
              onValueChange={value =>
                setState({...state, vaccineManufacturerTwo: value})
              }>
              <Picker.Item label="Pfizer-BioNTech" value="Pfizer-BioNTech" />
              <Picker.Item label="Moderna" value="Moderna" />
              <Picker.Item
                label="Johnson & Johnson"
                value="Johnson & Johnson"
              />
            </Picker>
          </View>
        </View>
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, facilityTwo: text})}
            value={state.facilityTwo}
            placeholder="FACILITY"
          />

          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, secondDoseDate: text})}
            value={state.secondDoseDate}
            placeholder="DATE"
          />
        </View>

         {/* THIRD DOSE*/}
        <View style={STYLES.wrap}>
          <Text style={STYLES.terms}>THIRD DOSE</Text>

          <View style={STYLES.pickers}>
            <Picker
              style={STYLES.pickerField}
              selectedValue={state.vaccineManufacturerTwo}
              placeholderTextColor="rgba(0,0,0,0.7)"
              onValueChange={value =>
                setState({...state, vaccineManufacturerTwo: value})
              }>
              <Picker.Item label="Pfizer-BioNTech" value="Pfizer-BioNTech" />
              <Picker.Item label="Moderna" value="Moderna" />
              <Picker.Item
                label="Johnson & Johnson"
                value="Johnson & Johnson"
              />
            </Picker>
          </View>
        </View>
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, facilityTwo: text})}
            value={state.facilityTwo}
            placeholder="FACILITY"
          />

          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, thirdDoseDate: text})}
            value={state.thirdDoseDate}
            placeholder="DATE FOR THIRD DOSE"
          />
        </View>

        <TouchableOpacity
          style={STYLES.btn}
          onPress={() => navigation.navigate('Dashboard')}>
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

export default CovidData;

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
    marginVertical: 10,
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
  pickerField: {
    color: 'rgba(0,0,0,0.7)',
    paddingHorizontal: -10,
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
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  pickers: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: -10,
    justifyContent:'center',
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: 15,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  pickerItemStyle: {
    color: 'red', // Customize the text color here
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
    marginVertical: 10,
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
    color: 'rgba(0,0,0,0.7)',
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
