import React from 'react';
import { View, Button } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';

// Define the event emitter
const SimprintsEventEmitter = new NativeEventEmitter(NativeModules.StartActivityForResult);

export default function App() {
  const startSimprintsActivityForResult = async () => {
    try {
      const result = await NativeModules.StartActivityForResult.startActivityForResult();
      // Handle the result returned from the Simprints ID app
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  // Listen to the result event
  SimprintsEventEmitter.addListener('activityResultEvent', (event) => {
    // Handle the activity result
    const { requestCode, resultCode, data } = event;
    if (resultCode === 'RESULT_OK') {
      // Handle successful confirmation of identity or enrolment
      if (data.SIMPRINTS_IDENTIFICATIONS) {
        // Present identified matches to the user for selection
        const identifications = data.SIMPRINTS_IDENTIFICATIONS.identifications;
        if (identifications && identifications.length > 0) {
          // Process the identification results and present them to the user for selection
        }
      } else if (data.SIMPRINTS_REGISTRATION) {
        // Code to complete the enrolment as you would do with basic enrolment
        const registrationResult = data.SIMPRINTS_REGISTRATION;
        if (registrationResult) {
          // Extract the new unique id and save it along with the captured patient's information
          const uniqueId = registrationResult.uniqueId;
          // Save the uniqueId and captured patient's information
        }
      }
    } else {
      // Handle other checks for biometrics completed successfully and the resultCode is okay
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Enrollment/Identification" onPress={startSimprintsActivityForResult} />
    </View>
  );
}
