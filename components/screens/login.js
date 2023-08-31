import React, {useCallback, useEffect, useState, useContext} from 'react';
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

import {AuthContext} from '../contexts/auth';
import {CustomStatusBar} from '../ui/custom.status.bar';
import Loader from '../ui/loader';
import DataResultsContext from '../contexts/DataResultsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URLS} from '../constants/API';

export const clearStorage = async () => {
  await AsyncStorage.clear();
};

export const _removeStorageItem = async key => {
  return await AsyncStorage.removeItem(key);
};

export const generateRandomCode = length => {
  const USABLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

  return new Array(length)
    .fill(null)
    .map(
      () =>
        USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)],
    )
    .join('');
};

export const MyDate = () => {
  const myDate = new Date();
  return `${
    myDate.getMonth() + 1
  }-${myDate.getDate()}-${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`;
};

export const tokensRefresh = async user => {
  const refresh = user.tokens.refresh;

  try {
    const response = await fetch(`${URLS.BASE}/tokens/refresh`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refresh}`,
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
      },
    });

    const data = await response.then(async response => {
      if (response.status === 401) {
        // the refresh token no longer works
        await AsyncStorage.setItem(
          '@user',
          JSON.stringify({
            id: user.id,
            username: user.username,
            hash: null, // overwrite the hash so that the user surely try to obtain new refresh tokens when they sign in next time.
            tokens: user.tokens,
          }),
        );
        return null;
      }
      return response.json();
    });
    if (data === null) return null;

    const {accessToken, refreshToken, msg, result} = data;
    if (result === 'Success') {
      await SAVE_LOCAL_USER({
        id: user.id,
        username: user.username,
        password: user.password,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
        offline: user.offline,
      });

      return {
        id: user.id,
        username: user.username,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
        offline: user.offline,
      };
    }
  } catch (e) {
    console.error(e.message);
  }

  return null;
};

export const RETRIEVE_LOCAL_USER = async () => {
  console.log('Retrieving local user');
  try {
    let user = await AsyncStorage.getItem('@user');
    return JSON.parse(user) || null;
  } catch (err) {
    console.error(err);
  }
};
export const SAVE_LOCAL_USER = async (user = {}) => {
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

export const cyrb53 = function (str, seed = 0) {
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

export const DOWNLOAD = async data => {
  // await AsyncStorage.removeItem("@doctors");
  // await AsyncStorage.removeItem("@ambulances");
  const {accessToken, items, userId, per_page} = data;
  axios.defaults.baseURL = URLS.BASE;
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axios.defaults.headers.post['Content-Type'] =
    'application/json; charset=UTF-8';
  axios.defaults.headers.post['Accept'] = 'application/json';
  const DATA_CATEGORY = ['diagnosis', 'chats'];
  for (let i = 0; i < items.length; i++) {
    try {
      const {
        data: {total},
      } = await axios.get(`/${items[i]}`);

      let pages = Math.round(total / per_page);
      pages = pages < 1 ? 1 : pages;
      let _downloaded = 0;
      for (let page = 1; page <= pages; page++) {
        const response = await axios.get(`/${items[i]}?page=${page}`);
        const _items = response.data[items[i]];

        let itemsOnDevice = await AsyncStorage.getItem(`@${items[i]}`);
        itemsOnDevice = JSON.parse(itemsOnDevice) || [];
        const all = uniqWith([..._items, ...itemsOnDevice], isEqual);
        AsyncStorage.setItem(`@${items[i]}`, JSON.stringify(all));
      }
    } catch (error) {
      console.log('Downlod', error);
    }

    if (i >= items.length) {
      return true;
    }
  }
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

  const {updateUserLog} = useContext(DataResultsContext);
  const {updateUserNames} = useContext(DataResultsContext);

  const signIn = async () => {
    clearStorage();
    let {username, password} = user;

    if (username === '' || password === '') {
      Alert.alert('Error', 'Provide your phone number and password');
      return;
    }

    let hash = cyrb53(password);

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
        setMyUser({
          id: myUser.id,
          username: myUser.username,
          tokens: myUser.tokens,
          offline: true,
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      console.log('Starting network request');
      let response = await fetch(
        `http://192.168.1.16:3000/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            phone: username,
            password: password,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
          },
        },
      );

      let json_data = await response.json();
      const {message, id, accessToken, refreshToken, firstName, lastName} =
        json_data;

      if (message === 'Login successful') {
        const id = json_data.id;
        updateUserLog(id);
        const name = json_data.firstName + ' ' + json_data.lastName;
        updateUserNames(name);
        console.log(id);
        console.log(name);

        await SAVE_LOCAL_USER({
          id,
          username,
          password,
          tokens: {accessToken: accessToken, refreshToken: refreshToken},
        });

        const resources = ['ambulances', 'doctors', 'diagnosis'];

        if (
          DOWNLOAD({
            accessToken,
            items: resources,
            per_page: 10,
          })
        ) {
          setMyUser({
            id,
            username,
            tokens: {accessToken: accessToken, refreshToken: refreshToken},
            offline: false,
          });
          setIsLoading(false);
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
  };

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
        <View style={styles.labeled}>
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
        </View>
        <View style={styles.labeled}>
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
        </View>

        {user.username != '' && user.password != '' ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => {
              setIsLoading(true);
              signIn();
            }}>
            <Text style={styles.whiteText}>SIGN IN</Text>
            <Icon
              name="arrow-right"
              size={20}
              strokeSize={3}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnInfo]}>
            <Text style={styles.muteText}>SIGN IN</Text>
            <Icon
              name="arrow-right"
              size={23}
              strokeSize={5}
              color={COLORS.BLACK}
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: DIMENS.FORM.PADDING,
  },
  title: {
    color: COLORS.ACCENT_1,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: DIMENS.PADDING,
    fontFamily: 'Roboto',
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

  labeled: {
    flexDirection: 'row',
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
    // marginHorizontal: 15,
  },
  input: {
    // borderColor: COLORS.WHITE_LOW,
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
    fontWeight: 'medium',
    paddingLeft: 10,
    fontSize: 15,
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
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
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
