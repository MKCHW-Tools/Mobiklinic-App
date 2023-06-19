/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState, useContext} from 'react';
import {DeviceEventEmitter, NativeEventEmitter, Text} from 'react-native';

import {
  Linking,
  Button,
  Alert,
  Modal,
  StyleSheet,
  useColorScheme,
  NativeModules,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import DataResultsContext from '../contexts/DataResultsContext';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, DIMENS} from '../constants/styles';
import CustomHeader from '../ui/custom-header';
import GetPatients from './getPatients';
import Collapsible from 'react-native-collapsible';
const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;
var OpenActivity = NativeModules.OpenActivity;

const SimprintsID = ({navigation}) => {
  const {updateDataResults} = useContext(DataResultsContext);
  const {updateBenData} = useContext(DataResultsContext);
  const {benData} = useContext(DataResultsContext);
  const [userData, setUserData] = React.useState(null);
  const [guid, setGuid] = React.useState(
    benData.length > 0 ? benData[0].guid : [],
  );
  const [identificationPlusResults, setIdentificationPlusResults] = useState(
    [],
  );
  const [collapsed, setCollapsed] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [identificationResults, setIdentificationResults] = useState([]);
  const [displayMode, setDisplayMode] = useState(null);
  const [enrollmentGuid, setEnrollmentGuid] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [selectedUserUniqueId, setSelectedUserUniqueId] = useState(null);
  const [noMatchButtonPressed, setNoMatchButtonPressed] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  // fetch data function
  const fetchData = async () => {
    console.log('GUID:', guid);

    try {
      const response = await fetch(
        `https://mobi-be-production.up.railway.app/patients/${guid}`,
      );
      if (response.ok) {
        const data = await response.json();
        const patientId = data.id;
        console.log('Patient id:', patientId);
        setPatientId(patientId);

        setUserData(data);
        setShowResults(true);
      } else {
        console.error('Error fetching user data:', response.status);
        Alert.alert(
          'Error',
          'Failed to fetch user data. Please try again later.',
        );
      }


    } catch (error) {
     
    }
    // navigation.navigate('GetPatients');
  };
  useEffect(() => {
    
    const identificationPlusSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationPlusResults(results);
        setDisplayMode('identificationPlus');
        updateBenData(results);
      },
    );

    const identificationSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationResults(results);
        setDisplayMode('identification');
        updateBenData(results);
        // updateDataResults(results);
      },
    );

    const registrationSuccessSubscription = DeviceEventEmitter.addListener(
      'SimprintsRegistrationSuccess',
      event => {
        const {guid} = event;
        setEnrollmentGuid(guid);
        setDisplayMode('enrollment');
        navigation.navigate('PatientData');
        updateDataResults(guid);
      },
    );

    return () => {
      identificationPlusSubscription.remove();
      identificationSubscription.remove();
      registrationSuccessSubscription.remove();
    };
  }, [updateDataResults, updateBenData]);

  const handleIdentificationPlus = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    IdentificationPlus.registerOrIdentify(projectID, moduleID, userID);
  };

  const handleIdentification = () => {
    
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    IdentificationModule.triggerIdentification(projectID, moduleID, userID);
  };

  const confirmSelectedBeneficiary = () => {
    if (sessionId && selectedUserUniqueId) {
      IdentificationPlus.confirmSelectedBeneficiary(
        sessionId,
        selectedUserUniqueId,
      );
    }
    navigation.navigate('PatientData');
    console.log('Beneficiary confirmed');
  };

  const confirmSelectedBeneficiaryy = () => {
    if (sessionId && selectedUserUniqueId) {
      IdentificationPlus.confirmSelectedBeneficiary(
        sessionId,
        selectedUserUniqueId,
      );
    }
    setGuid(guid);
    fetchData();
    navigation.navigate('GetPatients');
    console.log('Beneficiary confirmed');
  };

  useEffect(() => {
    if (noMatchButtonPressed) {
      console.log('No match found button pressed');
      // Call the noMatchFound method here if needed
      setNoMatchButtonPressed(false); // Reset the button pressed state
    }
  }, [noMatchButtonPressed]);

  const goBack = () => {
    setDisplayMode(null);
    setIdentificationPlusResults([]);
    setIdentificationResults([]);
    setEnrollmentGuid(null);
  };

  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open('WuDDHuqhcQ36P2U9rM7Y', 'test_user', 'mpower');
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
      title={<Text style={[styles.centerHeader]}>Biometrics Integration</Text>}
    />
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <View style={styles.wrap}>
        <Image style={{ width: 70, height: 70 }} source={require('../imgs/logo.png')} />
        <Text style={styles.title}>Mobiklinic</Text>
        
        <ScrollView >
        <View style={styles.container}>
          {displayMode === 'enrollment' && (
            <>
              {enrollmentGuid && (
                <>
                  <Text style={styles.text}>Beneficiary Enrolled on ID</Text>
                  <View style={{height: 30}} />

                  <TouchableOpacity
                    onPress={confirmSelectedBeneficiary}
                    style={styles.input}>
                    <Text style={styles.label}>
                      <Text style={{fontWeight: 'bold', fontSize: 15}}>
                        {enrollmentGuid}
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <View style={{height: 20}} />
                </>
              )}

              {/* <TouchableOpacity
                style={styles.button}
                onPress={confirmSelectedBeneficiary}>
                <Text style={styles.buttonText}>Continue to Registration</Text>
              </TouchableOpacity> */}
            </>
          )}

          {displayMode === 'identificationPlus' && (
            <>
              {identificationPlusResults.length > 0 && (
                <React.Fragment key="identification-plus-heading">
                  <Text style={styles.text}>Beneficiary Identified:</Text>
                  <View style={{height: 20}} />
                </React.Fragment>
              )}

              {identificationPlusResults
                .filter(
                  result =>
                    result.confidenceScore >= 50 &&
                    result.confidenceScore <= 99,
                )
                .map((result, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={confirmSelectedBeneficiaryy}>
                      <Text style={styles.label}>
                        <View style={{height: 20}} />
                        Tier:{'\t'}
                        {'\t'}
                        <Text style={{fontWeight: 'bold'}}>{result.tier}</Text>
                        {'\n'}
                        Confidence Score:{'\t'}
                        {'\t'}
                        <Text style={{fontWeight: 'bold'}}>
                          {result.confidenceScore}%
                        </Text>
                        {'\n'}
                        Guid:
                        <Text style={{fontWeight: 'bold'}}>{result.guid}</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              <View style={{height: 20}} />
              {showButtons ? (
                <>
                  <View style={{height: 20}} />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={openFunction}>
                    <Text style={styles.buttonText}>No Match</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.button} onPress={goBack}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {displayMode === 'identification' && (
            <>
              {identificationResults.length > 0 && (
                <React.Fragment key="identification-heading">
                  <Text style={styles.text}>Identification Results</Text>
                  <View style={{height: 20}} />
                </React.Fragment>
              )}

              {identificationResults
                .filter(
                  result =>
                    result.confidenceScore >= 50 &&
                    result.confidenceScore <= 99,
                )
                .map((result, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={confirmSelectedBeneficiaryy}>
                      <Text style={styles.label}>
                        <View style={{height: 20}} />
                        Tier:{'\t'}
                        {'\t'}
                        <Text style={{fontWeight: 'bold'}}>{result.tier}</Text>
                        {'\n'}
                        Confidence Score:{'\t'}
                        {'\t'}
                        <Text style={{fontWeight: 'bold'}}>
                          {result.confidenceScore}%
                        </Text>
                        {'\n'}
                        Guid:
                        <Text style={{fontWeight: 'bold'}}>{result.guid}</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              <View style={{height: 20}} />
              {showButtons ? (
                <>
                  {/* <TouchableOpacity
                    style={styles.button}
                    onPress={confirmSelectedBeneficiaryy}>
                    <Text style={styles.buttonText}>Confirm Beneficiary</Text>
                  </TouchableOpacity> */}

                  <View style={{height: 20}} />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={openFunction}>
                    <Text style={styles.buttonText}>No Match</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.button} onPress={goBack}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {!displayMode && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={handleIdentificationPlus}>
                <Text style={styles.buttonText}>Launch Simprints</Text>
              </TouchableOpacity>

              <View style={{height: 10}} />

              <TouchableOpacity
                style={styles.button}
                onPress={handleIdentification}>
                <Text style={styles.buttonText}>Identify Beneficiary</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        </ScrollView>
        <View style={styles.container}></View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
    height: '100%',
  },
  wrap: {
    flex: 2,
    alignItems: 'center',
    padding: 20,
    marginVertical: 30,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.ACCENT_1,
    alignItems: 'center',
    fontSize: 20,
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'medium',
    marginBottom: 10,
    color: COLORS.BLACK,
    textAlign: 'left',
    marginTop: 5,
    paddingHorizontal: 10,
  },

  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 9,
    shadowColor: COLORS.GRAY,
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textDecorationLine: 'underline',
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonStyle: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonStyle1: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    
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
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // input: {
  //   height: 40,
  //   borderColor: COLORS.GRAY,
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginBottom: 20,
  //   color: COLORS.BLACK,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  // },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
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
  userDataLabel1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.PRIMARY,
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
  accordionItem: {
    marginHorizontal: 15,
    marginTop: 10,
    paddingLeft: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionHeaderText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.BLACK,
  },
  accordionHeaderTitle: {
    marginRight: 5,
  },
  accordionHeaderIcon: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.ACCENT_1,
  },
  buttonSec: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 12,
    // paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  buttonStyle: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userData: {
    marginBottom: 20,
  },
  userDataLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  userDataValue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.BLACK,


  },
});

export default SimprintsID;
