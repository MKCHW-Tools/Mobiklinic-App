import React, {useContext} from 'react';
import {
  View,
  Alert,
  Switch,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {DiagnosisContext} from '../providers/Diagnosis';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';
import {COLORS, DIMENS} from '../constants/styles';
import CustomHeader from '../ui/custom-header';
import Icon from 'react-native-vector-icons/Feather';

// const PatientSummary = ({route, navigation}) => {
const GetPatients = ({navigation}) => {
  const {benData} = useContext(DataResultsContext);
  const [guid, setGuid] = React.useState(
    benData.length > 0 ? benData[0].guid : '',
  );
  const [userData, setUserData] = React.useState(null);
  const [showConfirmButton, setShowConfirmButton] = React.useState(false);

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
      title={<Text style={[styles.centerHeader]}>Back</Text>}
    />
  );

  const fetchData = async () => {
    console.log('GUID:', guid);
    try {
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/patients/${guid}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setShowConfirmButton(true); // Show the "Confirm Data" button
      } else {
        // console.error('Error fetching user data:', response.status);
        Alert.alert(
          'Error',
          'Beneficiary not found. Please check the GUID and try again.',
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Error',
        'Beneficiary not found. Please check the GUID and try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      {_header()}
      <ScrollView style={styles.body}>
        <View style={styles.logo}>
          <Image
            style={{width: 40, height: 40}}
            source={require('../imgs/logo.png')}
          />
          {/* <Text style={styles.title}>Mobiklinic</Text> */}
        </View>

        <Text style={styles.label}>Simprints GUID</Text>
        <TextInput style={styles.input} value={guid} onChangeText={setGuid} />

        <TouchableOpacity style={styles.button} onPress={fetchData}>
          <Text style={styles.buttonText}>Get Beneficiary Data</Text>
        </TouchableOpacity>

        {userData && (
          <View style={styles.userData}>
            <Text style={styles.userDataLabel}>
              First Name {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.firstName}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Last Name:{' \t'}
              <Text style={{fontWeight: 'bold'}}>{userData.lastName}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Sex{'\t'} {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.sex}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Phone Number {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.phoneNumber}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Country {'\t'}
              {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.country}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              District {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.district}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Age Group: {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.ageGroup}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Weight(Kgs): {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.weight}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Height(Cms) {'\t'}
              <Text style={{fontWeight: 'bold'}}>{userData.height}</Text>
            </Text>
          </View>
        )}
        {showConfirmButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SelectActivity')}>
            <Text style={styles.buttonText}>Confirm Data</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#fff',
  },
  body: {
    flex: 2,
    paddingHorizontal: 30,
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.BLACK,
    textAlign: 'center',
    marginTop: 5,
  },
  centerHeader: {
    flex: 1,
    alignItems: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userData: {
    marginTop: 20,
  },
  userDataLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
    borderBottomWidth: 1,
    padding: DIMENS.PADDING,
    borderBottomColor: '#000',
    borderColor: COLORS.GREY,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    color: COLORS.ACCENT_1,
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: DIMENS.PADDING,
  },
});

export default GetPatients;
