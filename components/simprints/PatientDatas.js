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
} from 'react-native';

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from '../helpers/functions';

import {DiagnosisContext} from '../providers/Diagnosis';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';


// const PatientSummary = ({route, navigation}) => {
  const PatientDatas = ({ navigation }) => {
    const { benData } = useContext(DataResultsContext);
    const [guid, setGuid] = React.useState(benData.length > 0 ? benData[0].guid : '');
    const [userData, setUserData] = React.useState(null);
  
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
    <Text style={styles.label}>Simprints GUID:</Text>
    <TextInput style={styles.input} value={guid} onChangeText={setGuid} />

    <TouchableOpacity style={styles.button} onPress={fetchData}>
      <Text style={styles.buttonText}>Get Beneficiary Data</Text>
    </TouchableOpacity>


      {userData && (
        <View style={styles.userData}>
          <Text style={styles.userDataLabel}>
            First Name: {userData.firstName}
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
          <Text style={styles.userDataLabel}>Weight(Kgs): {userData.weight}</Text>
          <Text style={styles.userDataLabel}>Height(Cms): {userData.height}</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
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
  },
});

export default PatientDatas;
