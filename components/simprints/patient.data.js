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

const PatientData = ({navigation}) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  // date
  const currentDate = new Date();

  const [state, setState] = React.useState({
    isLoading: false,
    fullname: '',
    gender: 'female',
    age_group: '',
    phone: '',
    condition: '',
    weight: '',
    height: '',
    address: '',
    isPregnant: false,
    dob: new Date(),
    diagnosises: [],
  });

  const save = async () => {
    const {
      fullname,
      gender,
      age_group,
      phone,
      condition,
      isPregnant,
      dob,
      weight,
      height,
      address,
    } = state;
    const code = generateRandomCode(5),
      date = MyDate();

    const newstate = {
      code,
      date,
      patient: {
        fullname,
        phone,
        gender,
        dob,
        weight,
        height,
        address,
        age: age_group,
      },
      details: condition,
      pregnant: isPregnant,
      followups: [],
      uploaded: false,
    };

    if (fullname && gender && age_group && condition) {
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
            fullname: '',
            gender: '',
            age_group: '',
            phone: '',
            condition: '',
            dob: '',
            weight: 0,
            height: 0,
            isPregnant: false,
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
        <Text style={[STYLES.centerHeader, STYLES.title]}>Enter Patient Details</Text>
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
        <Text style={STYLES.terms}>Enter patient details.</Text>
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, fullname: text})}
          value={state.fullname}
          placeholder="Full name *"
        />
        {/* date of birth */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, dob: text})}
          value={state.dob}
          placeholder="Date of birth"
        />

        {/* wieght and height */}
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            selectionColor={COLORS.SECONDARY}
            onChangeText={text => setState({...state, weight: text})}
            value={state.weight}
            placeholder="Weight(kg)"
          />
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            selectionColor={COLORS.SECONDARY}
            onChangeText={text => setState({...state, height: text})}
            value={state.height}
            placeholder="Height(cm)"
          />
        </View>

        {/* gender */}
        <View style={STYLES.pickers}>
          <Picker
            placeholder="Gender"
            style={{color: 'rgba(0,0,0,0.7)'}}
            selectedValue={state.gender}
            onValueChange={(value, index) =>
              setState({...state, gender: value})
            }
            itemStyle={STYLES.pickerItemStyle}>
            <Picker.Item label="Gender *" value="Gender" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
          </Picker>
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>
            Is pregnant? {state.isPregnant == false ? 'No' : 'Yes'}
          </Text>
          <Switch
            style={STYLES.field}
            onValueChange={text => setState({...state, isPregnant: text})}
            value={state.isPregnant}
          />
        </View>

        <View style={STYLES.pickers} placeholderTextColor="rgba(0,0,0,0.7)">
          <Picker
            style={{color: 'rgba(0,0,0,0.7)'}}
            selectedValue={state.age_group}
            onValueChange={(value, index) =>
              setState({...state, age_group: value})
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

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, phone: text})}
          value={state.phone}
          placeholder="Phone number *"
        />

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, address: text})}
          value={state.address}
          placeholder="Address*"
        />
        <TouchableOpacity
          style={STYLES.btn}
          onPress={() => navigation.navigate('PatientMedical')}>
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
    fontSize:16,
    fontWeight: 'bold',
    paddingVertical:20,
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
