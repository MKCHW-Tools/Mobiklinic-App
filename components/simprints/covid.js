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
    vaccineManufacturer: '',
    facilty: '',
    dateAdminster: '',
    firstDose: false,
    secondDoseDate: '',
    firstDoseDate:'',
  });

  //   first dose
  const handleFirstDoseChange = value => {
    setState({...state, firstDose: value});
  };

  const handleSecondDoseDateChange = value => {
    setState({...state, secondDoseDate: value});
  };

  const save = async () => {
    const {
      vaccineManufacturer,
      facilty,
      dateAdminster,
      firstDose,
      secondDoseDate,
      firstDoseDate,
    } = state;
    const code = generateRandomCode(5),
      date = MyDate();

    const newstate = {
      code,
      date,
      patient: {
        vaccineManufacturer,
        facilty,
        firstDoseDate,
        firstDose,
        secondDoseDate,

      },
      details: condition,
      followups: [],
      uploaded: false,
    };

    if (vaccineManufacturer && facilty && firstDoseDate) {
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
            vaccineManufacturer: '',
            facilty: '',
            firstDoseDate: '',
            firstDose: false,
            secondDoseDate: '',
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
        {/* type of vaccine */}
        <View style={STYLES.pickers}>
          <Picker
            style={STYLES.pickerField}
            selectedValue={state.vaccineManufacturer}
            onValueChange={value =>
              setState({...state, vaccineManufacturer: value})
            }>
            <Picker.Item label="Pfizer-BioNTech" value="Pfizer-BioNTech" />
            <Picker.Item label="Moderna" value="Moderna" />
            <Picker.Item label="Johnson & Johnson" value="Johnson & Johnson" />
          </Picker>
        </View>

        <Text style={STYLES.label}>
          Did you receive the first dose of the COVID vaccine?
        </Text>
        <View style={STYLES.pickers}>
          <Picker
            selectedValue={state.firstDose}
            style={STYLES.pickerField}
            onValueChange={handleFirstDoseChange}>
            <Picker.Item label="No" value={false} />
            <Picker.Item label="Yes" value={true} />
          </Picker>
        </View>

        {state.firstDose && (
          <View>
            <Text>Second dose date:</Text>
            <TextInput
              style={STYLES.input}
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.7)"
              selectionColor={COLORS.BLACK}
              onChange={(event, date) => handleSecondDoseDateChange(date)}
              value={state.secondDoseDate}
              placeholder='Date for the second dose'
            />
          </View>
        )}

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.BLACK}
          onChangeText={text => setState({...state, firstDoseDate: text})}
          value={state.firstDoseDate}
          placeholder="Date for Adminstration *"
        />

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
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
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
    fontSize: 16,
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
    marginVertical:10,
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
