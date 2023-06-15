import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

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

const GetPatients = () => {
  const navigation = useNavigation();
  const {benData} = useContext(DataResultsContext);
  const [guid, setGuid] = useState(benData.length > 0 ? benData[0].guid : '');
  const [userData, setUserData] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [vaccinations, setVaccinations] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const fetchData = async () => {
    console.log('GUID:', guid);
    try {
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/patients/${guid}`,
      );
      console.log('Response:', response);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setVaccinations(data.vaccinations); // Set the vaccination data
        setDiagnosis(data.diagnosis); // Set the vaccination data

        setShowConfirmButton(true); // Show the "Confirm Data" button
      } else {
        Alert.alert(
          'Error',
          'Beneficiary not found. Please check the GUID and try again.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Beneficiary not found. Please check the GUID ');
    }
  };

  useEffect(() => {
    if (guid) {
      fetchData();
    }
  }, [guid]);

  return (
    <View style={styles.container}>
      {/* <CustomHeader
        left={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
          </TouchableOpacity>
        }
        title={<Text style={styles.headerTitle}>Back</Text>}
      /> */}

      <ScrollView style={styles.body}>
        {/* <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={require('../imgs/logo.png')}
          />
          <Text style={styles.logoTitle}>Mobiklinic</Text>
        </View> */}

        {!userData && !guid && (
          <React.Fragment>
            <Text style={styles.label}>Simprints GUID</Text>
            <TextInput
              style={styles.input}
              value={guid}
              onChangeText={setGuid}
            />
          </React.Fragment>
        )}

        {userData && (
          <View style={styles.userData}>
            <Text style={styles.userDataLabel}>
              Full Name: {' \t'}
              <Text style={styles.userDataValue}>
                {userData.firstName}
                {' \t'}
                {userData.lastName}
              </Text>
            </Text>

            <Text style={styles.userDataLabel}>
              Phone Number:{'\t '}
              <Text style={styles.userDataValue}>{userData.phoneNumber}</Text>
            </Text>
            {userData.vaccinations && userData.vaccinations.length > 0 && (
              <View style={styles.vaccinationsContainer}>
                <Text style={styles.userDataLabel}>Vaccinations:</Text>
                {userData.vaccinations.map((vaccination, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Date of Vaccination:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.dateOfVaccination}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Date for Next Dose:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.dateForNextDose}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Vaccine Name:{' \t'}
                      <Text style={styles.userDataValue}>
                        {vaccination.vaccineName}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Units:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.units}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Site Administered:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.siteAdministered}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Facility:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.facility}
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {userData.diagnoses && userData.diagnoses.length > 0 && (
              <View style={styles.vaccinationsContainer}>
                <Text style={styles.userDataLabel}>Diagnosis:</Text>
                {userData.diagnoses.map((diagnosis, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Date of Vaccination:{' '}
                      <Text style={styles.userDataValue}>
                        {diagnosis.condition}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Date for Next Dose:{' '}
                      <Text style={styles.userDataValue}>
                        {diagnosis.dateForNextDose}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Impression:{' '}
                      <Text style={styles.userDataValue}>
                        {diagnosis.impression}
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {userData && (
          <TouchableOpacity
            style={styles.buttonSec}
            onPress={() => navigation.navigate('SelectActivity')}>
            <Text style={styles.buttonStyle}>Confirm Data</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginHorizontal: 4,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    paddingHorizontal: 30,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: COLORS.BLACK,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonSec: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  buttonStyle: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userData: {
    marginBottom: 20,
  },
  userDataLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.BLACK,
  },
  userDataValue: {
    fontWeight: 'normal',
    fontSize: 16,
  },
  vaccinationsContainer: {
    marginTop: 10,
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.GRAY,
  },
});

export default GetPatients;
