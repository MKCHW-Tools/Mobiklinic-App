import React, {useState, useContext} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';

import {COLORS, DIMENS} from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyDate} from '../helpers/functions';
import Loader from '../ui/loader';
import {DiagnosisContext} from '../providers/Diagnosis';
import CustomHeader from '../ui/custom-header';

const FollowUp = ({route, navigation}) => {
  const diagnosisContext = useContext(DiagnosisContext);
  const {diagnoses} = diagnosisContext;

  const [state, setState] = useState({
    id: route.params.diagnosis_code,
    type: 0,
    details: '',
    isLoading: false,
  });

  const pushToServer = async () => {
    return true;
  };

  const save = async () => {
    let date = MyDate();
    setState({...state, isLoading: true});

    const _diagnoses = diagnoses.map(_diagnosis => {
      if (_diagnosis.code === state.id) {
        _diagnosis.followups = [
          ..._diagnosis.followups,
          {type: state.type, details: state.details, date},
        ];
        _diagnosis.uploaded = false;
      }

      return _diagnosis;
    });

    diagnosisContext.setDiagnoses(_diagnoses);

    AsyncStorage.setItem('@diagnosis', JSON.stringify(_diagnoses), () => {
      if (pushToServer()) {
        Alert.alert('Saved', 'Follow up saved', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ViewDiagnosis', state.id),
          },
        ]);

        setState({
          type: 0,
          details: '',
          followups: [],
          isLoading: false,
        });
      }
    });
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
          Add New Follow Up to {state.id}
        </Text>
      }
    />
  );

  const {isLoading, details, type, id} = state;
  if (isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      <ScrollView style={STYLES.body}>
        <View style={STYLES.terms}>
          <Text>Enter follow up details below.</Text>
        </View>

        <Picker
          style={STYLES.pickers}
          itemStyle={{
            borderBottomColor: '#000',
            borderBottomStyle: 'solid',
          }}
          selectedValue={type}
          onValueChange={(value, index) => setState({...state, type: value})}>
          <Picker.Item label="Choose Type" value="0" />
          <Picker.Item label="Trimester 1" value="1" />
          <Picker.Item label="Trimester 2" value="2" />
          <Picker.Item label="Trimester 3" value="3" />
          <Picker.Item label="General" value="4" />
        </Picker>

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          multiline={true}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setState({...state, details: text})}
          value={details}
          placeholder="Description..."
        />
        <TouchableOpacity
          onPress={() => save()}
          style={{
            flexDirection: 'row',
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            backgroundColor: COLORS.BLACK,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={STYLES.textSubmit}>Save Follow up</Text>
          <Icon name="check" size={25} color={COLORS.WHITE} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  terms: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  pickers: {
    borderBottomColor: 'rgba(0,0,0,0.7)',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  input: {
    color: 'rgba(0,0,0,0.7)',
    minHeight: 70,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
    alignItems: 'center',
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
  },
  textSubmit: {
    color: COLORS.WHITE,
  },
});

export default FollowUp;
