import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../GraphQl/mutations';
import { ApolloClient, InMemoryCache } from '@apollo/client';

import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

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

    const { accessToken, refreshToken, msg, result } = data;
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
    throw new Error(err);
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
    throw new Error(err);
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

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const client = new ApolloClient({
  uri: 'https://staging.mobiklinic.com/graphql',
  cache: new InMemoryCache(),
});

export const signIn = async (data) => {
  const { user, setIsLoading, setMyUser: setUser } = data;
  if (!user) {
    Alert.alert('Error', 'Provide your phone number and password');
    return;
  }

  const { username, password } = user;

  try {
    const response = await client.mutate({
      mutation: LOGIN_USER,
      variables: { username, password },
    });

    const { user } = response.data.loginUser;

    setUser({
      id: user.id,
      username: user.username,
      tokens: {
        access: user.accessToken,
        refresh: user.refreshToken,
      },
      offline: false,
    });
    setIsLoading(false);
  } catch (err) {
    Alert.alert('Failed to login', 'Check your login details');
    setIsLoading(false);
    console.error(err);
  }
};

export const useAuth = () => {
  const [myUser, setMyUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleSignIn = async (user) => {
    setIsLoading(true);
    signIn({ user, setIsLoading, setMyUser });
  };

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const user = await RETRIEVE_LOCAL_USER();

        if (user) {
          if (user.offline === true) {
            // the user logged in previously without an internet connection
            const refreshedUser = await tokensRefresh(user);
            if (refreshedUser) {
              setMyUser(refreshedUser);
              setIsLoading(false);
            } else {
              setMyUser(null);
              setIsLoading(false);
            }
          } else {
            // the user logged in previously with an internet connection
            setMyUser(user);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    getUser();
  }, []);

  return { myUser, isLoading, handleSignIn };
};
