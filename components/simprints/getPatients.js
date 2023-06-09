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
      } else {
        console.error('Error fetching user data:', response.status);
        Alert.alert(
          'Error',
          'Failed to fetch user data. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch user data. Please try again later.',
      );
    }
  };

  return (
    <View style={styles.container}>
      {_header()}
      <Text style={styles.label}>Simprints GUID</Text>
      <TextInput style={styles.input} value={guid} onChangeText={setGuid} />

      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>Get Beneficiary Data</Text>
      </TouchableOpacity>

      {userData && (
        <View style={styles.userData}>
          <Text style={styles.userDataLabel}>
            First Name {userData.firstName}
          </Text>
          <Text style={styles.userDataLabel}>
            Last Name: {userData.lastName}
          </Text>
          <Text style={styles.userDataLabel}>Sex: {userData.sex}</Text>
          <Text style={styles.userDataLabel}>
            Phone Number: {userData.phoneNumber}
          </Text>
          <Text style={styles.userDataLabel}>Country: {userData.country}</Text>
          <Text style={styles.userDataLabel}>
            District: {userData.district}
          </Text>
          <Text style={styles.userDataLabel}>
            Age Group: {userData.ageGroup}
          </Text>
          <Text style={styles.userDataLabel}>
            Weight(Kgs): {userData.weight}
          </Text>
          <Text style={styles.userDataLabel}>
            Height(Cms): {userData.height}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.BLACK,
    textAlign: 'center',
    marginVertical: 20,
  },
  centerHeader: {
    flex: 2,
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
    borderRadius: 5,
    marginBottom: 10,
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
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
});

export default GetPatients;
