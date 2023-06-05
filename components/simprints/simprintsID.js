import React, {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  Text,
  Linking,
  Button,
  Alert,
  Modal,
  StyleSheet,
  useColorScheme,
  NativeModules,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import {COLORS, DIMENS} from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';
import CustomHeader from '../parts/custom-header';
import {TouchableOpacityBase} from 'react-native';

const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;
var OpenActivity = NativeModules.OpenActivity;

// DeviceEventEmitter.addListener('SimprintsRegistrationSuccess', event => {
//   const {guid} = event;
//   console.log(event);
//   // Alert.alert('Beneficiary Biometrics registered', guid);
// });

const SimprintsID = ({navigation}) => {
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

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{
            marginHorizontal: 4,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <View style={styles.wrap}>
        <Image
          style={{width: 70, height: 70}}
          source={require('../imgs/logo.png')}
        />
        <Text style={styles.title}>Mobiklinic</Text>

        <View style={styles.container}>
          {displayMode === 'enrollment' && (
            <>
              {enrollmentGuid && (
                <>
                  <Text style={styles.text}>Beneficiary Enrolled on ID:</Text>
                  <Text style={styles.results}>{enrollmentGuid}</Text>
                  <View style={{height: 20}} />
                </>
              )}
              <View style={{height: 20}} />
              <Button
                title="Go Back"
                onPress={() => navigation.navigate('PatientData')}
              />
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
                    result.confidenceScore >= 50 &&
                    result.confidenceScore <= 99,
                )
                .map((result, index) => (
                  <View key={index}>
                    <Text>
                      <View style={{height: 20}} />
                      Tier: {result.tier}, Confidence: {result.confidenceScore},
                      Guid: {result.guid}
                    </Text>
                  </View>
                ))}
              <View style={{height: 20}} />
              {showButtons ? (
                <>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={confirmSelectedBeneficiary}>
                    <Text style={styles.buttonText}> Confirm Beneficiary</Text>
                    <Icon
                      name="arrow-right"
                      size={20}
                      strokeSize={3}
                      color={COLORS.WHITE}
                    />
                  </TouchableOpacity>
                  <View style={{height: 20}} />
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={goBack}>
                    <Text style={styles.buttonText}> No Match</Text>
                    <Icon
                      name="arrow-right"
                      size={20}
                      strokeSize={3}
                      color={COLORS.WHITE}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => setNoMatchButtonPressed(true)}>
                  <Text style={styles.buttonText}> No Match</Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>
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
                    result.confidenceScore >= 50 &&
                    result.confidenceScore <= 99,
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
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={confirmSelectedBeneficiary}>
                    <Text style={styles.buttonText}>Confirm Beneficiary</Text>
                    <Icon
                      name="arrow-right"
                      size={20}
                      strokeSize={3}
                      color={COLORS.WHITE}
                    />
                  </TouchableOpacity>

                  <View style={{height: 20}} />
                  <TouchableOpacity style={styles.buttonStyle} onPress={goBack}>
                    <Text style={styles.buttonText}>No Match</Text>
                    <Icon
                      name="arrow-right"
                      size={20}
                      strokeSize={3}
                      color={COLORS.WHITE}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.buttonStyle} onPress={goBack}>
                  <Text style={styles.buttonText}>Go Back</Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>
              )}
            </>
          )}

          {!displayMode && (
            <>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleIdentification}>
                <Text style={styles.buttonText}>
                  Launch Biometrics to start registration
                </Text>
                <Icon
                  name="arrow-right"
                  size={20}
                  strokeSize={3}
                  color={COLORS.WHITE}
                />
              </TouchableOpacity>
              <View style={{height: 20}} />
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleIdentification}>
                <Text style={styles.buttonText}>Identify Beneficiary </Text>
                <Icon
                  name="arrow-right"
                  size={20}
                  strokeSize={3}
                  color={COLORS.WHITE}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
    color: COLORS.SECONDARY,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    alignItems: 'center',
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgba(0,0,0,0.7)',
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
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    padding: DIMENS.PADDING,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
  wrap: {
    flex: 2,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: COLORS.ACCENT_1,
    fontSize: 20,
    marginVertical: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: DIMENS.PADDING,
  },
});

export default SimprintsID;
