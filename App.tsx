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

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';


type SendIntentButtonProps = {
  action: string;
  children: string;
  extras?: Array<{
    key: string;
    value: string | number | boolean;
  }>;
};

interface IdentificationResult {
  guid: string;
  tier: string;
  confidence: number;
}

interface IdentificationEvent {
  identificationResults: IdentificationResult[];
}


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


const { IdentificationModule } = NativeModules;


function App(): JSX.Element {
  

  const openIdentify = () => {
    IdentificationModule.startIdentification("WuDDHuqhcQ36P2U9rM7Y", "test_user", "mpower");

  };


  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open("WuDDHuqhcQ36P2U9rM7Y", "test_user", "mpower");
  };
  

  const [modalVisible, setModalVisible] = useState(false);
  const [identificationResults, setIdentificationResults] = useState<IdentificationResult[]>([]);

  const handleIdentificationSuccess = (event: IdentificationEvent) => {
    const { identificationResults } = event;
    setIdentificationResults(identificationResults);
    setModalVisible(true);
  };

  



  const isDarkMode = useColorScheme() === 'dark';


  return (
    <View style={styles.container}>
      <View>
      <Button title="Start Enorollment" onPress={openFunction} />
      <View style={{ height: 20 }} />
      <Button title="Start Identification" onPress={openIdentify} />
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
