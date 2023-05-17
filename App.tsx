/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import type {PropsWithChildren} from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  Linking,
  Button,
  Alert,
  Platform,
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


type SectionProps = PropsWithChildren<{
  title: string;
}>;


DeviceEventEmitter.addListener('SimprintsRegistrationSuccess', (event)=>{
  const {guid} = event;
  console.log(event);
   Alert.alert("Simprints Registration Success", guid);
 }
 );

 DeviceEventEmitter.addListener('SimprintsRegistrationFailure', (event)=>{
   const {error} = event;
   Alert.alert("Simprints Registration Failure", error);
 }
 );



function App(): JSX.Element {
  
  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open("WuDDHuqhcQ36P2U9rM7Y", "test_user", "mpower");
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.container}>
      <Button title="Open Simprints ID" onPress={openFunction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



export default App;
 