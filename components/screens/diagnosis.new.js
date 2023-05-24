import React, {useState, useContext} from 'react';
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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {DiagnosisContext} from '../providers/Diagnosis';
import { COLORS, DIMENS } from "../constants/styles";


const NewDiagnosis = ({navigation}) => {
  const diagnosisContext = useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  const [state, setState] = useState({
    isLoading: false,
    fullname: '',
    gender: 'female',
    age_group: '',
    phone: '',
    condition: '',
    isPregnant: false,
    diagnosises: [],
  });

  const save = async () => {
    const {fullname, gender, age_group, phone, condition, isPregnant} = state;
    const code = generateRandomCode(5);
    const date = MyDate();

    const newstate = {
      code,
      date,
      patient: {
        fullname,
        phone,
        gender,
        age: age_group,
      },
      details: condition,
      pregnant: isPregnant,
      followups: [],
      uploaded: false,
    };

    if (fullname && gender && age_group && condition) {
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
    <View style={STYLES.header}>
      <TouchableOpacity
        style={STYLES.leftHeader}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
      </TouchableOpacity>
      <Text style={[STYLES.centerHeader, STYLES.title]}>Enter details</Text>
      <TouchableOpacity style={STYLES.rightHeader} onPress={() => save()}>
        <Icon name="check" size={25} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
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
          placeholder="Full name"
        />

        <View style={STYLES.pickerWrapper}>
          <Text style={STYLES.pickerLabel}>Gender</Text>
          <Picker
            style={STYLES.picker}
            selectedValue={state.gender}
            onValueChange={value => setState({...state, gender: value})}>
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
          </Picker>
        </View>

        <View style={STYLES.pickerWrapper}>
          <Text style={STYLES.pickerLabel}>Age Group</Text>
          <Picker
            style={STYLES.picker}
            selectedValue={state.age_group}
            onValueChange={value => setState({...state, age_group: value})}>
            <Picker.Item label="0-12" value="0-12" />
            <Picker.Item label="13-18" value="13-18" />
            <Picker.Item label="19-25" value="19-25" />
            <Picker.Item label="26-40" value="26-40" />
            <Picker.Item label="41-60" value="41-60" />
            <Picker.Item label="Above 60" value="above-60" />
          </Picker>
        </View>

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          keyboardType="phone-pad"
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, phone: text})}
          value={state.phone}
          placeholder="Phone number"
        />

        <TextInput
          style={[STYLES.input, {height: 100}]}
          autoCorrect={false}
          multiline
          numberOfLines={4}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, condition: text})}
          value={state.condition}
          placeholder="Condition"
        />

        <View style={STYLES.switchWrapper}>
          <Text style={STYLES.switchLabel}>Pregnant?</Text>
          <Switch
            value={state.isPregnant}
            onValueChange={value => setState({...state, isPregnant: value})}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
  },
  leftHeader: {
    flex: 1,
  },
  centerHeader: {
    flex: 8,
    textAlign: 'center',
  },
  rightHeader: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  body: {
    padding: 15,
  },
  terms: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  pickerWrapper: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: COLORS.BLACK,
  },
});

export default NewDiagnosis;
