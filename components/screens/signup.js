import * as React from "react";

import {
	View,
	Text,
	Image,
	TextInput,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";
import { CustomStatusBar } from "../ui/custom.status.bar";
import { signUp } from "../helpers/functions";
import { validateUgandaPhoneNumber } from "../helpers/validation";
import Loader from "../ui/loader";
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

	const [isLoading, setIsLoading] = React.useState(false);
	const [hasRegistered, setRegistered] = React.useState(false);
	const [process, setProcess] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [phoneError, setPhoneError] = React.useState("");

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
	} = state;

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
					onPress={() => _moveTo("Login")}>
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
					style={{ width: 80, height: 80 }}
					source={require("../imgs/logo.png")}
				/>
				<Text style={styles.title}>
					Sign up to become A Mobiklinic CHP.
				</Text>
			</View>

			<View style={styles.formContainer}>
				<View>
					<Text style={styles.errorMsg}>{msg}</Text>
				</View>

				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(firstName) =>
						setState({ ...state, firstName })
					}
					value={firstName}
					placeholder="First name"
				/>

				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(lastName) =>
						setState({ ...state, lastName })
					}
					value={lastName}
					placeholder="Last name"
				/>

				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(eMail) => setState({ ...state, eMail })}
					value={eMail}
					placeholder="E-mail"
				/>

				<TextInput
					style={styles.input}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(phoneNumber) => {
						setState({ ...state, phoneNumber });
						if (!validateUgandaPhoneNumber(phoneNumber)) {
							setPhoneError(
								"Provide valid phone number. e.g: 2567xxx..."
							);
						} else {
							setPhoneError("");
						}
					}}
					value={phoneNumber}
					placeholder="Phone number"
				/>
				{phoneError != "" && (
					<Text style={[styles.alignError, styles.errorMsg]}>
						{phoneError}
					</Text>
				)}
				<TextInput
					style={styles.input}
					password={true}
					secureTextEntry={true}
					autoCorrect={false}
					placeholderTextColor="grey"
					selectionColor={COLORS.SECONDARY}
					onChangeText={(password) =>
						setState({ ...state, password })
					}
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
					onChangeText={(cPassword) => {
						setState({ ...state, cPassword });
						if (password != cPassword) {
							setPasswordError(
								"Make sure passwords are not different."
							);
						} else {
							setPasswordError("");
						}
					}}
					value={cPassword}
					placeholder="Enter Password again"
				/>
				{passwordError != "" && (
					<Text style={[styles.alignError, styles.errorMsg]}>
						{passwordError}
					</Text>
				)}
				{state.username != "" &&
				state.firstName != "" &&
				state.lastName != "" &&
				state.phoneNumber != "" &&
				state.password != "" &&
				state.cPassword != "" ? (
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
						<Text style={styles.whiteText}>Sign up</Text>
						<Icon
							name="arrow-right"
							size={20}
							strokeSize={3}
							color={COLORS.WHITE}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={[styles.btn, styles.btnInfo]}>
						<Text style={styles.muteText}>Sign up</Text>
						<Icon
							name="arrow-right"
							size={20}
							strokeSize={5}
							color={COLORS.WHITE_LOW}
						/>
					</TouchableOpacity>
				)}

				<TouchableOpacity onPress={() => _moveTo("Login")}>
					<Text style={[styles.linkItem]}>
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
		color: COLORS.BLACK,
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
	input: {
		backgroundColor: COLORS.WHITE_LOW,
		borderColor: COLORS.WHITE_LOW,
		borderRadius: 50,
		paddingHorizontal: 15,
		paddingVertical: 5,
		marginBottom: 10,
		fontFamily: "Roboto",
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
