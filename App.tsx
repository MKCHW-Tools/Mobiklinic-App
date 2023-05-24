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

DeviceEventEmitter.addListener('SimprintsRegistrationSuccess', event => {
  const {guid} = event;
  console.log(event);
  Alert.alert('Simprints Registration Success', guid);
});

DeviceEventEmitter.addListener('SimprintsRegistrationFailure', event => {
  const {error} = event;
  Alert.alert('Simprints Registration Failure', error);
});

DeviceEventEmitter.addListener('SimprintsRegistrationSuccess+', event => {
  const {guid} = event;
  console.log(event);
  Alert.alert('Simprints Enrollment Plus achieved', guid);
});

function App(): JSX.Element {
  const [identificationResults, setIdentificationResults] = useState([]);
  const [identificationPlusResults, setIdentificationPlusResults] = useState([]);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    const identificationResultSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationResults(results);
        setShowButtons(false); // Hide buttons after getting identification results
      },
    );

    return () => {
      identificationResultSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const identificationResultPlusSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      results => {
        setIdentificationPlusResults(results);
        setShowButtons(false); // Hide buttons after getting identification results
      },
    );

    return () => {
      identificationResultPlusSubscription.remove();
    };
  }, []);

  const handleIdentification = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    setShowButtons(false); // Hide buttons when identification starts
    IdentificationModule.triggerIdentification(projectID, moduleID, userID);
  };

  const handleIdentificationPlus = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    setShowButtons(false); // Hide buttons when identification starts
    IdentificationPlus.registerOrIdentify(projectID, moduleID, userID);
  };

  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open('WuDDHuqhcQ36P2U9rM7Y', 'test_user', 'mpower');
  };

  return (
    <View style={styles.container}>
      <View>
        {showButtons && ( // Render buttons only when showButtons is true
          <>
            <Button title="Start Enrollment" onPress={openFunction} />
            <View style={{height: 20}} />
            <Button
              title="Start Identification"
              onPress={handleIdentification}
            />
            <View style={{height: 20}} />
            <Button
              title="Start Identification Plus"
              onPress={handleIdentificationPlus}
            />
            <View style={{height: 20}} />
          </>
        )}
        <View style={{height: 20}} />
        
        {identificationResults.length > 0 && (
          <React.Fragment key="identificationplus-heading">
            <Text style={styles.text}>Identification Results:</Text>
            <View style={{ height: 20 }} />
          </React.Fragment>
        )}
        
        {(identificationResults as any[]).map(result => (
          <View key={result.id}>
            <Text key={result.guid}>
              <View style={{height: 20}} />
              Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid:{' '}
              {result.guid}
            </Text>
          </View>
        ))}

  {identificationPlusResults.length > 0 && (
          <React.Fragment key="identification-heading">
            <Text style={styles.text}>Identification Results:</Text>
            <View style={{ height: 20 }} />
          </React.Fragment>
        )}
        
        {(identificationPlusResults as any[]).map(result => (
          <View key={result.id}>
            <Text key={result.guid}>
              <View style={{height: 20}} />
              Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid:{' '}
              {result.guid}
            </Text>
          </View>
        ))}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;