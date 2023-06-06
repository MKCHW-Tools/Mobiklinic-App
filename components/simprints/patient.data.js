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
// import DateTimePicker from '@react-native-community/datetimepicker';

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
    first_name: '',
    sex: 'female',
    age_group: '',
    phone_number: '',
    last_name: '',
    weight: '',
    height: '',
    district: '',
    country: '',
    date_of_birth: new Date(),
    primary_language: '',
  });

  const save = async () => {
    const {
      first_name,
      sex,
      age_group,
      phone_number,
      last_name,
      weight,
      height,
      district,
      country,
      date_of_birth,
      primary_language,
    } = state;
    const code = generateRandomCode(5),
      date = MyDate();

    const newstate = {
      code,
      date,
      first_name,
      sex,
      age_group,
      first_name,
      last_name,
      weight,
      height,
      district,
      country,
      phone_number,
      date_of_birth,
      primary_language,
      uploaded: false,
    };

    if (first_name && phone_number && age_group) {
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
            first_name: '',
            sex: 'female',
            age_group: '',
            phone_number: '',
            last_name: '',
            weight: '',
            height: '',
            district: '',
            country: '',
            date_of_birth: new Date(),
            primary_language: '',
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
        <Text style={[STYLES.centerHeader, STYLES.title]}>PATIENT PROFILE</Text>
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
        <Text style={STYLES.terms}>Patient Profile</Text>
        {/* first Name */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.BLACK}
          onChangeText={text => setState({...state, first_name: text})}
          value={state.first_name}
          placeholder="First Name *"
        />
        {/* last name */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.BLACK}
          onChangeText={text => setState({...state, last_name: text})}
          value={state.last_name}
          placeholder="Last Name *"
        />

        {/* Phone Number */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, phone_number: text})}
          value={state.phone_number}
          placeholder="Phone Number *"
        />
        {/* country */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, country: text})}
          value={state.country}
          placeholder="Country*"
        />
        {/* district */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, district: text})}
          value={state.district}
          placeholder="District of Residence *"
        />

        {/* primary_language */}
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, primary_language: text})}
          value={state.primary_language}
          placeholder="Primary Language *"
        />

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

        {/* wieght and height */}
        <View style={STYLES.wrap}>
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.7)"
            onChangeText={text => setState({...state, weight: text})}
            value={state.weight}
            placeholder="Weight(kg)"
          />
          <TextInput
            style={STYLES.detail}
            autoCorrect={false}
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
