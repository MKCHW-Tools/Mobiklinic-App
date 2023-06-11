import React, {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import {URLS} from '../constants/API';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import DataResultsContext from '../contexts/DataResultsContext';

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
    const response = fetch(`${URLS.BASE}/tokens/refresh`, {
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
    new Error(err);
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


export const signIn = async data => {
 


  clearStorage();
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
   
    }
  }
  // } else {
  try {
    console.log('Starting network request');
    let response = await fetch(
      `https://mobi-be-production.up.railway.app/auth/login`,
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
    const {message, id, accessToken, refreshToken} = json_data;
  

    if (message === 'Login successful') {
      const userId = json_data.id;
      // updateUserLog(userId);
      console.log('User ID:', userId);

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
        setUser({
          id,
          username,
          tokens: {accessToken: accessToken, refreshToken: refreshToken},
          offline: false,
        });
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

export const signUp = async data => {
  const {
    firstName,
    lastName,
    phoneNumber,
    password,
    cPassword,
    eMail,
    setIsLoading,
    setProcess,
    setRegistered,
  } = data;

  setProcess('Registering, please wait!');

  if (
    firstName == '' ||
    lastName == '' ||
    phoneNumber.length < 12 ||
    password == '' ||
    cPassword == ''
  ) {
    Alert.alert('Fail', 'Fix errors in the form, and try again!');
    console.log(firstName, lastName, phoneNumber, eMail, password, cPassword);
    return;
  }

  try {
    await fetch(`https://mobi-be-production.up.railway.app/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({
        phone: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        email: eMail,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        setIsLoading(false);
        if (response.message == 'Signup successful') {
          setRegistered(true);
        } else if (response.result == 'Failure') {
          Alert.alert(
            'Sign up failure.',
            'Check Phone number and E-mail. Press Ok to try again.',
          );

          console.log(response);
        } else {
          Alert.alert('Ooops!', 'Try again!');
        }
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert(
          'Failure',
          'Something wrong happened. Check your internet and try again!',
        );
      });
  } catch (err) {
    console.error(err);
  }
};

export const signOut = async callback => {
  callback();
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};

export const autoLogin = async () => {
  let accessToken = null;

  try {
    let tokenString = await AsyncStorage.getItem('tokens');

    let tokens = tokenString !== null && JSON.parse(tokenString);
    accessToken = tokens.accessToken;
  } catch (e) {
    // Restoring token failed
    console.log(e);
    console.log('Restoring token failed');
    console.log('acessToken ', accessToken);
  }
};

export const getKeys = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log(keys);
};

const processMessage = async () => {};
