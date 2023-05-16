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
 