import React, {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Text,
  Button,
  Alert,
  Modal,
  StyleSheet,
  useColorScheme,
  NativeModules,
  View,
  TouchableOpacity,
} from 'react-native';
import {COLORS, DIMENS} from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';

const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;

function SimprintsID({navigation}) {
  const [identificationPlusResults, setIdentificationPlusResults] = useState(
    [],
  );
  const [enrollmentGuid, setEnrollmentGuid] = useState(null);
  const [showButtons, setShowButtons] = useState(true);

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

  useEffect(() => {
    const registrationSuccessSubscription = DeviceEventEmitter.addListener(
      'SimprintsRegistrationSuccess',
      event => {
        const {guid} = event;
        setEnrollmentGuid(guid);
      },
    );

    return () => {
      registrationSuccessSubscription.remove();
    };
  }, []);

  const handleIdentificationPlus = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    setShowButtons(false); // Hide buttons when identification starts
    IdentificationPlus.registerOrIdentify(projectID, moduleID, userID);
  };

  const goBack = () => {
    setShowButtons(true);
    setIdentificationPlusResults([]);
    setEnrollmentGuid(null);
  };

  return (
    <View style={styles.container}>
      <View>
        {showButtons && (
          <>
            <View style={{height: 20}} />
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleIdentificationPlus}>
              <Text style={styles.buttonText}>Open Simprints</Text>
              <Icon
                name="arrow-right"
                size={20}
                strokeSize={3}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>

            <View style={{height: 20}} />
          </>
        )}
        <View style={{height: 20}} />

        {enrollmentGuid && (
          <>
            <Text style={styles.text}>Beneficiary Enrolled on ID:</Text>
            <Text style={styles.results} >{enrollmentGuid}</Text>
            <View style={{height: 20}} />
          </>
        )}

        {identificationPlusResults.length > 0 && (
          <>
            <Text style={styles.text}>Beneficiary Identified :</Text>
            <View style={{height: 20}} />
          </>
        )}

        {identificationPlusResults.map((result) => (
          <View key={result.guid}>
            <Text>
              <View style={{height: 20}} />
              <Text style={styles.results}>
                Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid:{' '}
                {result.guid}
              </Text>
            </Text>
          </View>
        ))}
        <View style={{height: 20}} />
        {!showButtons && (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => navigation.navigate('PatientData')}>
            <Text style={styles.buttonText}>Diagnose Patient</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        )}
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
    color: COLORS.BLACK,
  },
  results: {
    fontSize: 16,
    color: COLORS.BLACK,
    fontWeight: 'light',
  },
  buttonStyle: {
    backgroundColor: COLORS.BLACK,
    padding: DIMENS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    padding: DIMENS.PADDING,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
});

export default SimprintsID;
