import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { COLORS, DIMENS } from "../constants/styles";

const SignUp = ({ navigation }) => {
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    eMail: "",
    password: "",
    cPassword: "",
    msg: "",
    hasFocus: false,
  });

  const _onBlur = () => {
    setState({ hasFocus: false });
  };

  const _onFocus = () => {
    setState({ hasFocus: true });
  };

  _setUnderLineColor(hasFocus)(hasFocus == true)
    ? COLORS.SECONDARY
    : COLORS.WHITE_LOW;

  const _doRegister = () => {
    const { firstName, lastName, phoneNumber, password, hasFocus, eMail, msg } =
      state;

    if (users.length > 0) {
      users.forEach((USER) => {
        if (USER.msdn == phoneNumber) {
          return;
        } else {
          users.push({
            msdn: phoneNumber,
            pin: password,
            email: eMail,
            name: `${firstName} ${lastName}`,
          });

          this._moveTo("Login");
        }
      });
    }
  };

  const _moveTo = (screen) => {
    navigation.navigate(screen);
  };

  const { firstName, lastName, phoneNumber, password, hasFocus, eMail, msg } =
    state;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />

      <View style={styles.logoContainer}>
        <Icon name="user" size={120} color={COLORS.SECONDARY} />
        <Text style={styles.title}>MobiClinic</Text>
        <Text style={styles.subTitle}>Sign up</Text>
      </View>

      <View style={styles.formContainer}>
        <View>
          <Text style={styles.errorMsg}>{msg}</Text>
        </View>

        <TextInput
          style={styles.input}
          autoCorrect={false}
          onBlur={() => this._onBlur()}
          onFocus={() => this._onFocus()}
          underlineColorAndroid={this._setUnderLineColor(hasFocus)}
          placeholderTextColor={COLORS.WHITE_LOW}
          selectionColor={COLORS.SECONDARY}
          onChangeText={(firstName) => this.setState({ firstName })}
          value={firstName}
          placeholder="First name"
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          onBlur={() => this._onBlur()}
          onFocus={() => this._onFocus()}
          underlineColorAndroid={this._setUnderLineColor(hasFocus)}
          underlineColorAndroid={COLORS.WHITE_LOW}
          placeholderTextColor={COLORS.WHITE_LOW}
          selectionColor={COLORS.SECONDARY}
          onChangeText={(lastName) => this.setState({ lastName })}
          value={lastName}
          placeholder="Last name"
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          underlineColorAndroid={COLORS.WHITE_LOW}
          placeholderTextColor={COLORS.WHITE_LOW}
          selectionColor={COLORS.SECONDARY}
          onChangeText={(eMail) => this.setState({ eMail })}
          value={eMail}
          placeholder="E-mail"
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          underlineColorAndroid={COLORS.WHITE_LOW}
          placeholderTextColor={COLORS.WHITE_LOW}
          selectionColor={COLORS.SECONDARY}
          onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
          value={phoneNumber}
          placeholder="Phone number"
        />

        <TextInput
          style={styles.input}
          password={true}
          secureTextEntry={true}
          autoCorrect={false}
          underlineColorAndroid={COLORS.WHITE_LOW}
          placeholderTextColor={COLORS.WHITE_LOW}
          selectionColor={COLORS.SECONDARY}
          onChangeText={(password) => this.setState({ password })}
          value={password}
          placeholder="Password"
        />

        <TouchableOpacity
          style={styles.submit}
          onPress={() => this._doRegister()}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this._moveTo("Login")}>
          <Text style={[styles.textColor, styles.linkItem]}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingLeft: DIMENS.FORM.PADDING,
    paddingRight: DIMENS.FORM.PADDING,
  },
  logoContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.WHITE_LOW,
  },
  subTitle: {
    color: COLORS.SECONDARY,
    fontWeight: "bold",
    paddingVertical: 20,
  },
  textColor: {
    color: COLORS.WHITE_LOW,
  },
  linkItem: {
    paddingTop: DIMENS.PADDING,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 40,
  },
  fieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  input: {
    color: COLORS.SECONDARY,
  },
  btn: {
    padding: DIMENS.PADDING,
  },
  errorMsg: {
    color: COLORS.ERRORS,
  },
  submit: {
    padding: DIMENS.PADDING,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.ACCENT_1,
  },
  submitText: {
    color: COLORS.SECONDARY,
    textAlign: "center",
  },
});

export default SignUp;
