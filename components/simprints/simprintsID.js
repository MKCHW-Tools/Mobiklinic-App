/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState, useContext} from 'react';
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
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import DataResultsContext from '../contexts/DataResultsContext';
import {COLORS, DIMENS} from '../constants/styles';
import CustomHeader from '../ui/custom-header';
import Icon from 'react-native-vector-icons/Feather';

const {IdentificationModule} = NativeModules;
const {IdentificationPlus} = NativeModules;
var OpenActivity = NativeModules.OpenActivity;

DeviceEventEmitter.addListener('SimprintsRegistrationSuccess', event => {
  const {guid} = event;
  console.log(event);
  Alert.alert('Beneficiary Biometrics registered', guid);
});

const SimprintsID = ({navigation}) => {
  const {updateDataResults} = useContext(DataResultsContext);

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
        updateDataResults(results);
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
  }, [updateDataResults]);

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
      title={<Text style={[styles.centerHeader]}>Back</Text>}
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
        {displayMode === 'enrollment' && (
          <>
            {enrollmentGuid && (
              <>
                <Text style={styles.text}>Beneficiary Enrolled on ID:</Text>
                <Text style={styles.text}>{enrollmentGuid}</Text>
                <View style={{height: 20}} />
              </>
            )}
            <View style={{height: 20}} />
            {/* <Button title="Go Back" onPress={goBack} /> */}
            <TouchableOpacity style={styles.btn} onPress={goBack}>
              <Text style={styles.btnText}>Go Back</Text>
              <Icon
                name="arrow-right"
                size={20}
                strokeSize={3}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
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
                  result.confidenceScore >= 50 && result.confidenceScore <= 99,
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
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={confirmSelectedBeneficiary}>
                  <Text style={styles.btnText}>Confirm Beneficiary</Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setNoMatchButtonPressed(true)}>
                  <Text style={styles.btnText}>No Match </Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              // <Button title="Go Back" onPress={goBack} />
              <TouchableOpacity style={styles.btn} oonPress={goBack}>
                <Text style={styles.btnText}>Go Back </Text>
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
                  result.confidenceScore >= 50 && result.confidenceScore <= 99,
              )
              .map((result, index) => (
                <View key={index}>
                  <Text style={styles.text}>Tier: {result.tier}</Text>
                  <Text style={styles.text}>
                    Confidence: {result.confidenceScore}, Guid: {result.guid}
                  </Text>

                  <Text style={styles.text}>Guid: {result.guid}</Text>
                </View>
              ))}
            <View style={{height: 20}} />
            {showButtons ? (
              // <>
              //   <Button
              //     title="Confirm Beneficiary"
              //     onPress={confirmSelectedBeneficiary}
              //   />
              //   <View style={{height: 20}} />
              //   <Button
              //     title="No Match"
              //     onPress={() => setNoMatchButtonPressed(true)}
              //   />
              // </>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={confirmSelectedBeneficiary}>
                  <Text style={styles.btnText}>Confirm Beneficiaryt</Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setNoMatchButtonPressed(true)}>
                  <Text style={styles.btnText}>No Match </Text>
                  <Icon
                    name="arrow-right"
                    size={20}
                    strokeSize={3}
                    color={COLORS.WHITE}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Button title="Go Back" onPress={goBack} />
            )}
          </>
        )}

        {!displayMode && (
          // <>
          //   <Button
          //     title="Launch Biometrics to start registration"
          //     onPress={handleIdentificationPlus}
          //   />
          //   <View style={{height: 20}} />
          //   <Button title="Identify Beneficiary" onPress={handleIdentification} />
          // </>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={handleIdentificationPlus}>
              <Text style={styles.btnText}>Launch Simprints</Text>
              <Icon
                name="arrow-right"
                size={20}
                strokeSize={3}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleIdentification}>
              <Text style={styles.btnText}>Identify Beneficiary </Text>
              <Icon
                name="arrow-right"
                size={20}
                strokeSize={3}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 2,
    paddingHorizontal: 20,
  },
  text: {
    paddingVertical: 6,
    textAlign: 'left',
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  alert: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: 15,
  },

  title: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    alignItems: 'center',
    flexGrow: 1,
  },
  leftHeader: {
    marginLeft: 10,
    flex: 1,
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  rightHeader: {
    paddingRight: 10,
  },
  tip: {
    color: 'rgba(0,0,0,0.4)',
    paddingTop: 15,
    paddingBottom: 15,
  },

  field: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  submit: {
    flexDirection: 'row',
    padding: DIMENS.PADDING,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
  },
  submitText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  wrap: {
    flex: 2,
    alignItems: 'center',
    padding: 20,
  },
  btnContainer: {
    flex: 1,
    marginVertical: 80,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  btn: {
    backgroundColor: COLORS.BLACK,
    padding: DIMENS.PADDING,
    // padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 16,
    alignItems: 'center',
    fontWeight: '900',
    justifyContent: 'center',
    paddingHorizontal: 20,
    color: COLORS.WHITE,
  },
  title: {
    color: COLORS.ACCENT_1,
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: DIMENS.PADDING,
  },
});

export default SimprintsID;
