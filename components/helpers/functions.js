import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import {URLS} from '../constants/API';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import {
  LOGIN_USER,
  SIGN_UP_USER,
  REFRESH_TOKENS,
  DOWNLOAD_MUTATION,
  SAVE_LOCAL_USER_MUTATION,
} from '../graphql/Mutations';
import {RETRIEVE_LOCAL_USER_QUERY} from '../graphql/Queries';
import {ApolloClient, InMemoryCache} from '@apollo/client';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'https://staging.mobiklinic.com/graphql',
  cache: new InMemoryCache(),
});

// remove storage item
export const _removeStorageItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove item from storage:', error);
  }
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

// tokens refresh
export const tokensRefresh = async user => {
  const refresh = user.tokens.refresh;

  try {
    const response = await client.query({
      query: REFRESH_TOKENS,
      variables: {
        refreshToken: refresh,
      },
      context: {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      },
    });

    const {data} = response;
    const {tokensRefresh} = data;

    if (tokensRefresh === null) {
      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          id: user.id,
          username: user.username,
          hash: null,
          tokens: user.tokens,
        }),
      );
      return null;
    }

    const {id, username, tokens, offline} = tokensRefresh;
    const {access, refresh: newRefresh} = tokens;

    await SAVE_LOCAL_USER({
      id,
      username,
      password: user.password,
      tokens: {
        access,
        refresh: newRefresh,
      },
      offline,
    });

    return {
      id,
      username,
      tokens: {
        access,
        refresh: newRefresh,
      },
      offline,
    };
  } catch (error) {
    console.error(error.message);
  }

  return null;
};

// retrrieve local user
export const RETRIEVE_LOCAL_USER = async () => {
  console.log('Retrieving local user');
  try {
    const response = await client.query({
      query: RETRIEVE_LOCAL_USER_QUERY,
    });

    const {data} = response;
    return data.retrieveLocalUser;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// save local user
export const SAVE_LOCAL_USER = async (user = {}) => {
  try {
    const HASH = cyrb53(user.password);

    const response = await client.mutate({
      mutation: SAVE_LOCAL_USER_MUTATION,
      variables: {
        input: {
          id: user.id,
          username: user.username,
          hash: HASH,
          tokens: user.tokens,
        },
      },
    });

    const {data} = response;
    return data.saveLocalUser;
  } catch (error) {
    console.error(error.message);
    throw error;
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

// download
export const DOWNLOAD = async data => {
  const {accessToken, items, userId, per_page} = data;

  try {
    const response = await client.query({
      query: DOWNLOAD_MUTATION,
      variables: {
        accessToken,
        items,
        per_page,
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const {data} = response;
    const {download} = data;

    return download;
  } catch (error) {
    console.error(error.message);
  }

  return false;
};

// signin a user
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

  try {
    console.log('Starting network request');
    const response = await client.mutate({
      mutation: LOGIN_USER,
      variables: {
        username,
        password,
      },
    });

    const {data} = response;
    const {signIn} = data;

    const {id, tokens, offline} = signIn;

    await SAVE_LOCAL_USER({
      id,
      username,
      password,
      tokens: {
        access: tokens.access,
        refresh: tokens.refresh,
      },
    });

    const resources = ['ambulances', 'doctors', 'diagnosis'];

    if (
      DOWNLOAD({
        accessToken: tokens.access,
        items: resources,
        per_page: 10,
      })
    ) {
      setUser({
        id,
        username,
        tokens: {
          access: tokens.access,
          refresh: tokens.refresh,
        },
        offline,
      });
      setIsLoading(false);
    }
  } catch (error) {
    console.error(error);
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
};

// signup a user
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
    firstName === '' ||
    lastName === '' ||
    phoneNumber.length < 8 ||
    password === '' ||
    cPassword === ''
  ) {
    Alert.alert('Fail', 'Fix errors in the form and try again!');
    console.log(firstName, lastName, phoneNumber, eMail, password, cPassword);
    return;
  }

  try {
    const response = await client.mutate({
      mutation: SIGN_UP_USER,
      variables: {
        username: phoneNumber,
        phone: phoneNumber,
        name: `${firstName} ${lastName}`,
        email: eMail,
        password: password,
      },
    });

    const {data} = response;
    const {signUp} = data;
    const {result} = signUp;

    setIsLoading(false);

    if (result === 'Success') {
      setRegistered(true);
    } else if (result === 'Failure') {
      Alert.alert(
        'Sign up failure.',
        'Check Phone number and E-mail. Press Ok to try again.',
      );
    } else {
      Alert.alert('Oops!', 'Try again!');
    }
  } catch (error) {
    console.error(error);
    Alert.alert(
      'Failure',
      'Something wrong happened. Check your internet and try again!',
    );
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
