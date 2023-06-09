/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState,useContext} from 'react';
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
} from 'react-native';
import DataResultsContext from '../contexts/DataResultsContext';

const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;
var OpenActivity = NativeModules.OpenActivity;

const SimprintsID = ({navigation}) => {
  const {updateDataResults} = useContext(DataResultsContext);
  const {updateBenData} = useContext(DataResultsContext);

  const [identificationPlusResults, setIdentificationPlusResults] = useState(
    [],
  );
  const [identificationResults, setIdentificationResults] = useState([]);
  const [displayMode, setDisplayMode] = useState(null);
  const [enrollmentGuid, setEnrollmentGuid] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [selectedUserUniqueId, setSelectedUserUniqueId] = useState(null);
  const [noMatchButtonPressed, setNoMatchButtonPressed] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

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
    navigation.navigate('PatientDatas');
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

  return (
    <View style={styles.container}>
      {displayMode === 'enrollment' && (
        <>
          {enrollmentGuid && (
            <>
              <Text style={styles.text}>Beneficiary Enrolled on ID:</Text>
              <Text style={styles.text}>{enrollmentGuid}</Text>
              <View style={{height: 20}} />
            </>
          )}
          <View style={{height: 20}} />
          <Button title="Continue to Registration" onPress={confirmSelectedBeneficiary} />
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
                result.confidenceScore >= 50 && result.confidenceScore <= 99,
            )
            .map((result, index) => (
              <View key={index}>
                <Text style={styles.text}>
                  <View style={{height: 20}} />
                  Tier: {result.tier}, Confidence: {result.confidenceScore},
                  Guid: {result.guid}
                </Text>
              </View>
            ))}
          <View style={{height: 20}} />
          {showButtons ? (
            <>
              <Button
                title="Confirm Beneficiary"
                onPress={confirmSelectedBeneficiaryy}
              />
              <View style={{height: 20}} />
              <Button
                title="No Match"
                onPress={() => setNoMatchButtonPressed(true)}
              />
            </>
          ) : (
            <Button title="Go Back" onPress={goBack} />
          )}
        </>
      )}

      {displayMode === 'identification' && (
        <>
          {identificationResults.length > 0 && (
            <React.Fragment key="identification-heading">
              <Text style={styles.text}>Identification Results:</Text>
              <View style={{height: 20}} />
            </React.Fragment>
          )}

          {identificationResults
            .filter(
              result =>
                result.confidenceScore >= 50 && result.confidenceScore <= 99,
            )
            .map((result, index) => (
              <View key={index}>
                <Text style={styles.text}>
                  <View style={{height: 20}} />
                  Tier: {result.tier}, Confidence: {result.confidenceScore},
                  Guid: {result.guid}
                </Text>
              </View>
            ))}
          <View style={{height: 20}} />
          {showButtons ? (
            <>
              <Button
                title="Confirm Beneficiary"
                onPress={confirmSelectedBeneficiaryy}
              />
              <View style={{height: 20}} />
              <Button
                title="No Match"
                onPress={() => setNoMatchButtonPressed(true)}
              />
            </>
          ) : (
            <Button title="Go Back" onPress={goBack} />
          )}
        </>
      )}

      {!displayMode && (
        <>
          <Button
            title="Launch Biometrics to start registration"
            onPress={handleIdentificationPlus}
          />
          <View style={{height: 20}} />
          <Button title="Identify Beneficiary" onPress={handleIdentification} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
});

export default SimprintsID;