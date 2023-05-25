import * as React from 'react';

import {
  View,
  Image,
  Alert,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import {COLORS, DIMENS} from '../constants/styles';
import {URLS} from '../constants/API';

import {AuthContext} from '../contexts/auth';
import {CustomStatusBar} from '../ui/custom.status.bar';
import Loader from '../ui/loader';

const RETRIEVE_LOCAL_USER = async () => {
  try {
    let user = await AsyncStorage.getItem('@user');
    return JSON.parse(user) || null;
  } catch (err) {
    new Error(err);
  }
};

const SAVE_LOCAL_USER = async (user = {}) => {
  try {
    const HASH = cyrb53(user.password);

    await AsyncStorage.setItem(
      '@user',
      JSON.stringify({
        id: user.id,
        username: user.username,
        hash: HASH,
        tokens: user.tokens,
      }),
    );
  } catch (err) {
    new Error(err);
  }
};

const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const signIn = async data => {
  //clearStorage();
  let {user, setIsLoading, setMyUser: setUser} = data;

  if (typeof user === undefined) {
    Alert.alert('Error', 'Provide your phone number and password');
    return;
  }

  const {username, password} = user;
  let hash = cyrb53(password);

  if (username === '' && password === '') {
    Alert.alert('Error', 'Provide your phone number and password');
    return;
  }

  let theUser = null;

  try {
    theUser = await RETRIEVE_LOCAL_USER();
  } catch (err) {
    console.log(err);
  }

  if (theUser !== null) {
    let myUser =
      theUser.username === username && theUser.hash === hash ? theUser : null;

    if (myUser) {
      setUser({
        id: myUser.id,
        username: myUser.username,
        tokens: myUser.tokens,
        offline: true,
      });
      setIsLoading(false);
      return;
      //// It is possible that the user has changed the password, but it adheres to the past information stored on the device.
      //// This, we need to ask the online server when the user fail to sign in with the stored information.
      ////
      // } else {
      // 	Alert.alert(
      // 		"Failed to login",
      // 		"Check your login details",
      // 		[
      // 			{
      // 				text: "Cancel",
      // 				onPress: () => setIsLoading(false),
      // 			},
      // 		],
      //
      // 		{
      // 			cancelable: true,
      // 			onDismiss: () => {
      // 				setIsLoading(false);
      // 			},
      // 		}
      // 	);
    }
  }
  // } else {
  try {
    console.log('Logging in user ' + username);
    let response = await fetch(`${URLS.BASE}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
      },
    });

    let json_data = await response.json();
    const {result, id, accessToken, refreshToken} = json_data;

    if (result == 'Success') {
      await SAVE_LOCAL_USER({
        id,
        username,
        password,
        tokens: {access: accessToken, refresh: refreshToken},
      });

      const resources = ['ambulances', 'doctors', 'diagnosis'];

      if (
        DOWNLOAD({
          accessToken,
          items: resources,
          per_page: 10,
        })
      ) {
        setUser({
          id,
          username,
          tokens: {access: accessToken, refresh: refreshToken},
          offline: false,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          }),
        );
        setIsLoading(false);
        // setTokens({ access: accessToken });
      }
    } else {
      Alert.alert(
        'Failed to login',
        'Check your login details',
        [
          {
            text: 'Cancel',
            onPress: () => setIsLoading(false),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            setIsLoading(false);
          },
        },
      );
    }
  } catch (err) {
    err?.message == 'Network request failed' &&
      Alert.alert(
        'Oops!',
        'Check your internet connection',
        [
          {
            text: 'Cancel',
            onPress: () => setIsLoading(false),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            setIsLoading(false);
          },
        },
      );
    setIsLoading(false);
    console.log(err);
  }
  // }
};

const Login = ({navigation}) => {
  const {
    setUser: setMyUser,
    isLoading,
    setIsLoading,
    tokens,
    setTokens,
  } = React.useContext(AuthContext);
  const [user, setUser] = React.useState({
    username: '',
    password: '',
  });

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <CustomStatusBar />

      <View style={styles.logoContainer}>
        <Image
          style={{width: 80, height: 80}}
          source={require('../imgs/logo.png')}
        />
        <Text style={styles.title}>Sign in</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          autoCorrect={false}
          placeholderTextColor="grey"
          // keyboardType={'phone-pad'}
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setUser({...user, username: text})}
          value={user.username}
          placeholder="Phone number e.g: 256778xxxxxx"
        />

        <TextInput
          style={styles.input}
          password={true}
          secureTextEntry={true}
          autoCorrect={false}
          placeholderTextColor="grey"
          selectionColor={COLORS.SECONDARY}
          onChangeText={text => setUser({...user, password: text})}
          value={user.password}
          placeholder="Password"
        />

        {user.username != '' && user.password != '' ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => {
              setIsLoading(true);
              signIn({
                user,
                setIsLoading,
              });
            }}>
            <Text style={styles.whiteText}>Sign in</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnInfo]}>
            <Text style={styles.muteText}>Sign in</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={5}
              color={COLORS.WHITE_LOW}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
          <Text style={styles.linkItem}>Don't have an Account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  logoContainer: {
    flexGrow: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: DIMENS.FORM.PADDING,
  },
  title: {
    color: COLORS.ACCENT_1,
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
  linkItem: {
    paddingTop: DIMENS.PADDING,
    textAlign: 'center',
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
    backgroundColor: COLORS.WHITE_LOW,
    borderColor: COLORS.WHITE_LOW,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  btn: {
    padding: DIMENS.PADDING,
  },
  errorMsg: {
    color: COLORS.ERRORS,
  },
  btn: {
    padding: DIMENS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 15,
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
    color: COLORS.WHITE_LOW,
  },
  whiteText: {
    color: COLORS.WHITE,
  },
});
