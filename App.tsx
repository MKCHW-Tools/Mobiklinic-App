/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {DeviceEventEmitter, NativeEventEmitter, Text} from 'react-native';
// import BeneficiarySelectionScreen from './BeneficiarySelectionScreen';

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

const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;

const App = () => {
  const [identificationPlusResults, setIdentificationPlusResults] = useState<
    {id: number; tier: string; confidenceScore: number; guid: string}[]
  >([]);
  const [identificationResults, setIdentificationResults] = useState<
    {id: number; tier: string; confidenceScore: number; guid: string}[]
  >([]);
  const [displayMode, setDisplayMode] = useState<string | null>(null);
  const [enrollmentGuid, setEnrollmentGuid] = useState<string | null>(null);

  useEffect(() => {
    const identificationPlusSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationPlusResults(results);
        setDisplayMode('identificationPlus');
      },
    );

    const identificationSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationResults(results);
        setDisplayMode('identification');
      },
    );

    const registrationSuccessSubscription = DeviceEventEmitter.addListener(
      'SimprintsRegistrationSuccess',
      event => {
        const {guid} = event;
        setEnrollmentGuid(guid);
        setDisplayMode('enrollment');
      },
    );

    return () => {
      identificationPlusSubscription.remove();
      identificationSubscription.remove();
      registrationSuccessSubscription.remove();
    };
  }, []);

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
              <Text>{enrollmentGuid}</Text>
              <View style={{height: 20}} />
            </>
          )}
<View style={{height: 20}} />
          <Button title="Go Back" onPress={goBack} />
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

          {identificationPlusResults.map((result, index) => (
            <View key={result.id + index}>
              <Text>
                <View style={{height: 20}} />
                Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid:{' '}
                {result.guid}
              </Text>
            </View>
          ))}
<View style={{height: 20}} />
          <Button title="Go Back" onPress={goBack} />
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

          {identificationResults.map((result, index) => (
            <View key={index}>
              <Text>
                <View style={{height: 20}} />
                Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid:{' '}
                {result.guid}
              </Text>
            </View>
          ))}
<View style={{height: 20}} />
          <Button title="Go Back" onPress={goBack} />
        </>
      )}

      {!displayMode && (
        <>
          <Button
            title="Start Biometric Search"
            onPress={handleIdentificationPlus}
          />
          <View style={{height: 20}} />
          <Button title="Start Identification" onPress={handleIdentification} />
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
  },
});

export default App;
