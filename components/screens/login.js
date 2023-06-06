import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native

import { CustomStatusBar } from '../ui/custom.status.bar';
import Loader from '../ui/loader';
import { COLORS, DIMENS } from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(password: $password, username: $username) {
      user {
        username
        firstName
        pk
        id
      }
    }
  }
`;

const Login = () => {
  const navigation = useNavigation(); // Use useNavigation to get the navigation object
  const [user, setUser] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data } = await loginUser({
        variables: {
          username: user.username,
          password: user.password,
        },
      });
      console.log(data);
      setIsLoading(false);
      if (data.loginUser) {
        navigation.navigate('Dashboard', { user: data.loginUser.user });
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar />

      <View style={styles.logoContainer}>
        <Image
          style={{ width: 80, height: 80 }}
          source={require('../imgs/logo.png')}
        />
        <Text style={styles.title}>Sign in</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          autoCorrect={false}
          placeholderTextColor="grey"
          selectionColor={COLORS.SECONDARY}
          onChangeText={(text) => setUser({ ...user, username: text })}
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
          onChangeText={(text) => setUser({ ...user, password: text })}
          value={user.password}
          placeholder="Password"
        />

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={handleLogin}
          disabled={!user.username || !user.password}
        >
          <Text style={styles.whiteText}>Sign in</Text>
          <Icon
            name="arrow-right"
            size={20}
            strokeSize={3}
            color={COLORS.WHITE}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
          <Text style={styles.linkItem}>Don't have an Account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default Login;
