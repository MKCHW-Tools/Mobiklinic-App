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
  Button
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {useFormik} from 'formik';
import validationSchema from '../helpers/validationSchema';

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {DiagnosisContext} from '../providers/Diagnosis';
import {COLORS, DIMENS} from '../constants/styles';

const PatientData = ({navigation}) => {
  const diagnosisContext = useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  const formik = useFormik({
    initialValues: {
      fullname: '',
      gender: 'female',
      age_group: '',
      phone: '',
      condition: '',
      isPregnant: false,
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {fullname, gender, age_group, phone, condition, isPregnant} =
        values;
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
        diagnosisContext.setDiagnoses([newstate, ...diagnoses]);

        Alert.alert('Saved', `Diagnosis code: ${code}`, [{text: 'OK'}]);

        formik.resetForm();
      } else {
        Alert.alert('Ooops!', 'Complete all fields', [{text: 'OK'}]);
      }
    },
  });

  const _header = () => (
    <View style={STYLES.header}>
      <TouchableOpacity
        style={STYLES.leftHeader}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
      </TouchableOpacity>
      <Text style={[STYLES.centerHeader, STYLES.title]}>Patient Data</Text>
      <TouchableOpacity
        style={STYLES.rightHeader}
        onPress={formik.handleSubmit}>
        <Icon name="check" size={25} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
  );

  // if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />

      {_header()}

      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Enter patient details.</Text>

        <TextInput
          style={STYLES.input}
          onChangeText={formik.handleChange('fullname')}
          onBlur={formik.handleBlur('fullname')}
          value={formik.values.fullname}
          placeholder="Full name"
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <Text style={STYLES.error}>{formik.errors.fullname}</Text>
        )}

        <View style={STYLES.pickerWrapper}>
          <Text style={STYLES.pickerLabel}>Gender</Text>
          <Picker
            style={STYLES.picker}
            selectedValue={formik.values.gender}
            onValueChange={formik.handleChange('gender')}>
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
          </Picker>
        </View>
        {formik.touched.gender && formik.errors.gender && (
          <Text style={STYLES.error}>{formik.errors.gender}</Text>
        )}

        <View style={STYLES.pickerWrapper}>
          <Text style={STYLES.pickerLabel}>Age Group</Text>
          <Picker
            style={STYLES.picker}
            selectedValue={formik.values.age_group}
            onValueChange={formik.handleChange('age_group')}>
            <Picker.Item label="0-12" value="0-12" />
            <Picker.Item label="13-18" value="13-18" />
            <Picker.Item label="19-25" value="19-25" />
            <Picker.Item label="26-40" value="26-40" />
            <Picker.Item label="41-60" value="41-60" />
            <Picker.Item label="Above 60" value="above-60" />
          </Picker>
        </View>
        {formik.touched.age_group && formik.errors.age_group && (
          <Text style={STYLES.error}>{formik.errors.age_group}</Text>
        )}

        <TextInput
          style={STYLES.input}
          onChangeText={formik.handleChange('phone')}
          onBlur={formik.handleBlur('phone')}
          value={formik.values.phone}
          keyboardType="phone-pad"
          placeholder="Phone number"
        />
        {formik.touched.phone && formik.errors.phone && (
          <Text style={STYLES.error}>{formik.errors.phone}</Text>
        )}

        <TextInput
          style={[STYLES.input, {height: 100}]}
          onChangeText={formik.handleChange('condition')}
          onBlur={formik.handleBlur('condition')}
          value={formik.values.condition}
          multiline
          numberOfLines={4}
          placeholder="Condition"
        />
        {formik.touched.condition && formik.errors.condition && (
          <Text style={STYLES.error}>{formik.errors.condition}</Text>
        )}

        <View style={STYLES.switchWrapper}>
          <Text style={STYLES.switchLabel}>Pregnant?</Text>
          <Switch
            value={formik.values.isPregnant}
            onValueChange={value => formik.setFieldValue('isPregnant', value)}
          />
        </View>
        <Button title="Next" onPress={formik.handleSubmit} />
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
  error: {
    fontSize: 12,
    color: 'red',
  },
});

export default PatientData;
