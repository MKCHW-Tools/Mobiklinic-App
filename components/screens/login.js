import * as React from "react";

import {
	View,
	Image,
	Alert,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import Icon from "@expo/vector-icons/Feather";
import { COLORS, DIMENS } from "../constants/styles";
import { signIn } from "../helpers/functions";

import { AuthContext } from "../contexts/auth";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Loader from "../ui/loader";

const Login = () => {
	const {
		setUser: setMyUser,
		isLoading,
		setIsLoading,
		tokens,
		setTokens,
	} = React.useContext(AuthContext);
	const [user, setUser] = React.useState({
		username: "",
		password: "",
	});

	if (isLoading) return <Loader />;

	return (
		<View style={styles.container}>
			<CustomStatusBar />

			<View style={styles.logoContainer}>
				<Image
					style={{ width: 80, height: 80 }}
					source={require("../imgs/logo.png")}
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
					onChangeText={(text) =>
						setUser({ ...user, username: text })
					}
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
					onChangeText={(text) =>
						setUser({ ...user, password: text })
					}
					value={user.password}
					placeholder="Password"
				/>

				{user.username != "" && user.password != "" ? (
					<TouchableOpacity
						style={[styles.btn, styles.btnPrimary]}
						onPress={() => {
							setIsLoading(true);
							signIn({
								user,
								setIsLoading,
								setTokens,
								setMyUser,
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
				<TouchableOpacity
					onPress={() => this.setState({ toSignUp: true })}>
					<Text style={[styles.textColor, styles.linkItem]}>
						or, sign up
					</Text>
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
	input: {
		backgroundColor: COLORS.WHITE_LOW,
		// borderStyle: 'solid',
		// borderWidth: 2,
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
