/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import type {PropsWithChildren} from 'react';
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


// const SendIntentButton = ({
//   action,
//   extras,
//   children,
// }: SendIntentButtonProps) => {
//   const handlePress = useCallback(async () => {
//     try {
//       await Linking.sendIntent(action, extras);
//     } catch (e: any) {
//       Alert.alert(e.message);
//     }
//   }, [action, extras]);

//   return <Button title={children} onPress={handlePress} />;
// };

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// const OpenSimprintsButton = () => {

//   const handlePress = useCallback(async () => {
//     try {
//       await Linking.openURL('https://play.google.com/store/apps/details?id=com.simprints.id');
//     } catch (e: any) {
//       Alert.alert(e.message);
//     }
//   }, []);

//   return <Button title="Open Simprints in playstore" onPress={handlePress} />;
// };


// function launchSimprintsID() {
//   // Check if the device is running Android
//   if (Platform.OS === 'android') {
//     // Construct the intent URI
//     const uri = 'intent://app/#Intent;scheme=com.simprints.id;end';

//     // Open the intent URI using the Linking module
//     Linking.openURL(uri).catch((err) => {
//       console.error('Failed to open Simprints ID app:', err);
//     });
//   } else {
//     console.error('The Simprints ID app is only available on Android.');
//   }
// }

// function MyComponent() {
//   // Call the launchSimprintsID function when a button is pressed
//   const handleButtonPress = () => {
//     launchSimprintsID();
//   };

//   return (
//     <Button title="Launch Simprints ID" onPress={handleButtonPress} />
//   );
// }


function App(): JSX.Element {
  var OpenActivity = NativeModules.OpenActivity;

  const openFunction = () => {
    OpenActivity.open();
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.container}>
      {/* <SendIntentButton action="com.android.intent.chrome">
        Hello SimPrints
      </SendIntentButton>

      <SendIntentButton action="android.intent.action.POWER_USAGE_SUMMARY">
        Power Usage Summary
      </SendIntentButton> */}

      {/* <OpenSimprintsButton />

      <MyComponent /> */}

      <Button title="Open Native Activity" onPress={openFunction} />
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
 ``