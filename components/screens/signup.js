import * as React from 'react';

import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import {CustomStatusBar} from '../ui/custom.status.bar';
import {signUp} from '../helpers/functions';
import {validateUgandaPhoneNumber} from '../helpers/validation';
import Loader from '../ui/loader';
import {COLORS, DIMENS} from '../constants/styles';

const SignUp = ({navigation}) => {
  const [state, setState] = React.useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    eMail: '',
    password: '',
    cPassword: '',
    msg: '',
    hasFocus: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [hasRegistered, setRegistered] = React.useState(false);
  const [process, setProcess] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');

  const _moveTo = screen => {
    navigation.navigate(screen);
  };

  const {firstName, lastName, phoneNumber, password, cPassword, eMail, msg} =
    state;

  if (isLoading)
    return (
      <Loader>
        <Text>{process}</Text>
      </Loader>
    );

  if (hasRegistered) {
    return (
      <Loader loader={false}>
        <Text style={[styles.subTitle]}>Registration successful!</Text>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.navigate('Login')}>
          <Text>Login now</Text>
        </TouchableOpacity>
      </Loader>
    );
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar />

      <View style={styles.logoContainer}>
        <Image
          style={{width: 80, height: 80}}
          source={require('../imgs/logo.png')}
        />
        <Text style={styles.title}>Sign up to become A Mobiklinic CHP.</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.errorMsg}>{msg}</Text>
          </View>
          <View style={styles.labeled}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholderTextColor="grey"
              selectionColor={COLORS.SECONDARY}
              onChangeText={firstName => setState({...state, firstName})}
              value={firstName}
              placeholder="Enter First name"
            />
          </View>
          <View style={styles.labeled}>
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholderTextColor="grey"
              selectionColor={COLORS.SECONDARY}
              onChangeText={lastName => setState({...state, lastName})}
              value={lastName}
              placeholder="Enter Last name"
            />
          </View>
          <View style={styles.labeled}>
            <Text style={styles.label}>Email Address:</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholderTextColor="grey"
              selectionColor={COLORS.SECONDARY}
              onChangeText={eMail => setState({...state, eMail})}
              value={eMail}
              keyboardType="email-address"
              placeholder="Enter Email"
            />
          </View>
          <View style={styles.labeled}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholderTextColor="grey"
              keyboardType="numeric"
              selectionColor={COLORS.SECONDARY}
              onChangeText={phoneNumber => {
                setState({...state, phoneNumber});
                if (!validateUgandaPhoneNumber(phoneNumber)) {
                  setPhoneError('Provide valid phone number. e.g: 2567xxx...');
                } else {
                  setPhoneError('');
                }
              }}
              value={phoneNumber}
              placeholder="eg '256754XXXXXXX'"
            />
          </View>
          {phoneError != '' && (
            <Text style={[styles.alignError, styles.errorMsg]}>
              {phoneError}
            </Text>
          )}
          <View style={styles.labeled}>
            <Text style={styles.label}>Password:</Text>

            <TextInput
              style={styles.input}
              password={true}
              secureTextEntry={true}
              autoCorrect={false}
              placeholderTextColor="grey"
              selectionColor={COLORS.SECONDARY}
              onChangeText={password => setState({...state, password})}
              value={password}
              placeholder="Enter Password"
            />
          </View>

          <View style={styles.labeled}>
            <Text style={styles.label}>Confirm :</Text>
            <TextInput
              style={styles.input}
              password={true}
              secureTextEntry={true}
              autoCorrect={false}
              placeholderTextColor="grey"
              selectionColor={COLORS.SECONDARY}
              onChangeText={cPassword => {
                setState({...state, cPassword});
                if (password != cPassword) {
                  setPasswordError('Make sure passwords are not different.');
                } else {
                  setPasswordError('');
                }
              }}
              value={cPassword}
              placeholder="Enter Password again"
            />
          </View>
          {passwordError != '' && (
            <Text style={[styles.alignError, styles.errorMsg]}>
              {passwordError}
            </Text>
          )}
          {/* <TextInput
            style={styles.input}
            password={true}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor="grey"
            selectionColor={COLORS.SECONDARY}
            onChangeText={cPassword => {
              setState({...state, cPassword});
              if (password != cPassword) {
                setPasswordError('Make sure passwords are not different.');
              } else {
                setPasswordError('');
              }
            }}
            value={cPassword}
            placeholder="Enter Password again"
          /> */}

          {state.username != '' &&
          state.firstName != '' &&
          state.lastName != '' &&
          state.phoneNumber != '' &&
          state.password != '' &&
          state.cPassword != '' ? (
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => {
                setIsLoading(true);
                signUp({
                  ...state,
                  setIsLoading,
                  setProcess,
                  setRegistered,
                });
              }}>
              <Text style={styles.whiteText}>Sign Up</Text>
              <Icon
                name="arrow-right"
                size={20}
                strokeSize={3}
                color={COLORS.BLACK}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btn, styles.btnInfo]}>
              <Text style={styles.muteText}>Sign Up</Text>
              <Icon
                name="arrow-right"
                size={25}
                strokeSize={5}
                color={COLORS.BLACK}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.linkItem]}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: COLORS.WHITE,
  },
  body: {
    // flex: 1,
    paddingTop: 20,
    // paddingHorizontal: 12,
  },
  logoContainer: {
    flexGrow: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: DIMENS.FORM.PADDING,
  },
  title: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: DIMENS.PADDING,
  },
  subTitle: {
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  textColor: {
    color: COLORS.WHITE_LOW,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.BLACK,
  },
  labeled: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: COLORS.WHITE_LOW,
    borderRadius: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontFamily: 'Roboto',
    fontSize: 15,
    color: COLORS.BLACK,
    marginHorizontal: 15,
  },
  linkItem: {
    paddingTop: DIMENS.PADDING,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  formContainer: {
    flexGrow: 1,
    padding: DIMENS.FORM.PADDING,
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.PRIMARY,
  },
  input: {
    // borderColor: COLORS.WHITE_LOW,
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
    fontWeight: 'medium',
    paddingLeft:10,
    fontSize:15,
  },
  btn: {
    padding: DIMENS.PADDING,
    
  },
  errorMsg: {
    color: COLORS.ERRORS,
  },
  alignError: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  btn: {
    padding: DIMENS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 15,

  },
  btnInfo: {
    backgroundColor: COLORS.WHITE_LOW,
  },
  btnPrimary: {
    backgroundColor: COLORS.ACCENT_1,
  },
  submitText: {
    color: COLORS.ACCENT_1,
    fontWeight: 'bold',
  },
  muteText: {
    color: COLORS.BLACK,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  whiteText: {
    color: COLORS.BLACK,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
});

export default SignUp;
