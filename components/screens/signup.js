import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	View,
	Text,
	TextInput,
	StyleSheet,
	StatusBar,
	Image,
	TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { COLORS, DIMENS } from "../constants/styles";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Loader from "../ui/loader";
const SignUp = ({ navigation }) => {
	const [user, setUser] = React.useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		eMail: "",
		password: "",
		cPassword: "",
		msg: "",
	});

	const _onBlur = () => {
		setUser({ ...user, hasFocus: false });
	};

	const _onFocus = () => {
		setUser({ ...user, hasFocus: true });
	};

	const _setUnderLineColor = (hasFocus) =>
		hasFocus == true ? COLORS.SECONDARY : COLORS.WHITE_LOW;

	const _doRegister = () => {
		const { firstName, lastName, phoneNumber, password, cPassword, msg } =
			user;

		console.log(JSON.stringify(user, null, 2));
		setUser({});
	};

	const _moveTo = (screen) => {
		navigation.navigate(screen);
	};

	const {
		firstName,
		lastName,
		phoneNumber,
		password,
		cPassword,
		eMail,
		msg,
	} = user;

	return (
		<View style={styles.container}>
			<CustomStatusBar />

			<View style={styles.logoContainer}>
				<Image
					style={{ width: 80, height: 80 }}
					source={require("../imgs/logo.png")}
				/>
				<Text style={styles.title}>Sign up</Text>
				<View>
					<Text style={styles.errorMsg}>{msg}</Text>
				</View>
			</View>

			<View style={styles.formContainer}>
				<TextInput
					style={styles.input}
					autoCorrect={false}
					onBlur={() => _onBlur()}
					onFocus={() => _onFocus()}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(firstName) =>
						setUser({ ...user, firstName })
					}
					value={firstName}
					placeholder="First name"
				/>

				<TextInput
					style={styles.input}
					autoCorrect={false}
					onBlur={() => _onBlur()}
					onFocus={() => _onFocus()}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(lastName) => setUser({ ...user, lastName })}
					value={lastName}
					placeholder="Last name"
				/>

				{/* 				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(eMail) => setState({ eMail })}
					value={eMail}
					placeholder="E-mail"
				/> */}

				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(phoneNumber) =>
						setUser({ ...user, phoneNumber })
					}
					value={phoneNumber}
					placeholder="Phone number"
				/>

				<TextInput
					style={styles.input}
					password={true}
					secureTextEntry={true}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(password) => setUser({ ...user, password })}
					value={password}
					placeholder="Password"
				/>
				<TextInput
					style={styles.input}
					password={true}
					secureTextEntry={true}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(cPassword) =>
						setUser({ ...user, cPassword })
					}
					value={cPassword}
					placeholder="Confirm Password"
				/>

				<TouchableOpacity
					style={[styles.btn, styles.btnPrimary]}
					onPress={() => _doRegister()}>
					<Text style={styles.whiteText}>Submit</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => _moveTo("Login")}>
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
		backgroundColor: COLORS.WHITE,
	},
	logoContainer: {
		flexGrow: 2,
		alignItems: "center",
		justifyContent: "center",
		padding: DIMENS.FORM.PADDING,
	},
	title: {
		color: COLORS.ACCENT_1,
		fontSize: 14,
		fontWeight: "bold",
		textTransform: "uppercase",
		padding: DIMENS.PADDING,
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
		flexGrow: 1,
		padding: DIMENS.FORM.PADDING,
		justifyContent: "center",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: COLORS.PRIMARY,
	},
	fieldContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
	},
	input: {
		backgroundColor: COLORS.WHITE_LOW,
		borderColor: COLORS.WHITE_LOW,
		borderRadius: 50,
		paddingHorizontal: 15,
		paddingVertical: 5,
		marginBottom: 10,
		fontFamily: "Roboto",
	},
	errorMsg: {
		color: COLORS.ERRORS,
	},
	btn: {
		padding: DIMENS.PADDING,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
		fontWeight: "bold",
	},
	muteText: {
		color: COLORS.WHITE_LOW,
	},
	whiteText: {
		color: COLORS.WHITE,
	},
});

export default SignUp;
