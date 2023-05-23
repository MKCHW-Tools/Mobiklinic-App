/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { DeviceEventEmitter, NativeEventEmitter, Text } from 'react-native';
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

const { IdentificationModule } = NativeModules;
// const identificationEventEmitter = new NativeEventEmitter(IdentificationModule);


DeviceEventEmitter.addListener('SimprintsRegistrationSuccess', (event) => {
  const { guid } = event;
  console.log(event);
  Alert.alert("Simprints Registration Success", guid);
}
);

DeviceEventEmitter.addListener('SimprintsRegistrationFailure', (event) => {
  const { error } = event;
  Alert.alert("Simprints Registration Failure", error);
}
);



function App(): JSX.Element {
  const [identificationResults, setIdentificationResults] = useState([]);

  useEffect(() => {
    const identificationResultSubscription = DeviceEventEmitter.addListener(
      'onIdentificationResult',
      (results) => {
        setIdentificationResults(results);
      }
    );

    return () => {
      identificationResultSubscription.remove();
    };
  }, []);

  const handleIdentification = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    IdentificationModule.triggerIdentification(projectID, moduleID, userID);
  };


  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open("WuDDHuqhcQ36P2U9rM7Y", "test_user", "mpower");
  };
  


  return (
    <View style={styles.container}>
      <View>
      <Button title="Start Enorollment" onPress={openFunction} />
      <View style={{ height: 20 }} />
      <Button title="Start Identification" onPress={handleIdentification} />
      <View style={{ height: 20 }} />
      <Text>Identification Results:</Text>
      <View style={{ height: 20 }} />
      {(identificationResults as any[]).map((result) => (
        <Text key={result.guid}>
           <View style={{ height: 20 }} />
          Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid: {result.guid}
        </Text>
      ))}
      </View>
    </View>
  );
};

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
});



export default App;