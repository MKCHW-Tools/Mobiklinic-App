import * as React from "react";
import { Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./contexts/auth";
import { UserProvider, UserContext } from "./providers/User";
import forgotPassword from "./screens/password.forgot";
import PasswordReset from "./screens/password.reset";
import Login from "./screens/login";
import { DOWNLOAD } from "./helpers/functions";
import { DrawerNavigation, DrawerNavigationLogged } from "./navigators/drawers";
import {
	cyrb53,
	RETRIEVE_LOCAL_USER,
	SAVE_LOCAL_USER,
} from "./helpers/functions";
import Loader from "./ui/loader";
import { URLS } from "./constants/API";
import Diagnose from "./screens/diagnosis";
import Ambulances from "./screens/ambulance";
import Doctors from "./screens/doctors";
import ViewDiagnosis from "./screens/diagnosis.view";
import NewDiagnosis from "./screens/diagnosis.new";
import FollowUp from "./screens/diagnosis.follow.up";
import Chat from "./screens/Chat";
import Chats from "./screens/Chats";

import { initialStateAuth, reducerAuth } from "./reducers/Auth";
import AppNav from "./navigators/AppNav";

const Stack = createStackNavigator();

const Entry = () => {
	// const userContext = React.useContext(UserContext);
	// const [state, dispatch] = React.useReducer(reducerAuth, initialStateAuth);

	React.useEffect(() => {
		/*const clearStorage = async () => {
			await AsyncStorage.clear();
		};
		const autoLogin = async () => {
			let accessToken = null;

			try {
				let tokenString = await AsyncStorage.getItem("tokens");

				let tokens = tokenString !== null && JSON.parse(tokenString);
				accessToken = tokens.accessToken;

				dispatch({ type: "RESTORE_TOKEN", accessToken });
			} catch (e) {
				// Restoring token failed
				console.log(e);
				console.log("Restoring token failed");
				console.log("acessToken ", accessToken);
			}

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
		};
		//clearStorage();
		autoLogin();*/
	}, []);

	// Check if the user is logged in,
	// if yes, navigate to the app
	// if no, navigate to the login screen
	// To login the user, we need to send the user's credentials to the server
	// and get a token back
	//If network error, retrieve users from local storage
	// Compare users to the logged in user
	// If the user is found, login the user and navigate to the app.
	// If the user is not found, show an error message

	const memo = React.useMemo(
		() => ({
			signIn: async (data) => {
				let { user, setLoading } = data;

				if (typeof user === undefined) {
					Alert.alert(
						"Error",
						"Provide your phone number and password"
					);
					return;
				}

				const { username, password } = user;

				if (username === "" && password === "") {
					Alert.alert(
						"Error",
						"Provide your phone number and password"
					);
					return;
				}

				let theUser = null;

				try {
					theUser = await RETRIEVE_LOCAL_USER();
					theUser = JSON.parse(theUser);
				} catch (err) {
					console.log(err);
				}

				if (theUser !== null) {
					let hash = cyrb53(password);
					let myUser =
						theUser.username === username && theUser.hash === hash
							? theUser
							: null;

					/* 					let aUser = theUser.filter(
						(theUser) =>
							theUser.username === username &&
							theUser.hash === hash
					)[0]; */

					// console.log(myUser);

					if (myUser !== undefined && myUser.username === username) {
						dispatch({
							type: "SIGN_IN",
							accessToken: password,
							offline: true,
							user: myUser,
						});
						return;
					} else {
						Alert.alert("Failed to login", "Try again, please!");
						return;
					}
				} else {
					try {
						console.log("Starting network request");
						let response = await fetch(`${URLS.BASE}/users/login`, {
							method: "POST",
							body: JSON.stringify({
								username: username,
								password: password,
							}),
							headers: {
								"Content-type":
									"application/json; charset=UTF-8",
								Accept: "application/json",
							},
						});

						let json_data = await response.json();
						const { result, id, accessToken, refreshToken } =
							json_data;

						if (result == "Success") {
							await SAVE_LOCAL_USER({
								username,
								password,
								tokens: { accessToken, refreshToken },
							});

							const resources = [
								"ambulances",
								"doctors",
								"diagnosis",
							];

							if (
								DOWNLOAD({
									accessToken,
									items: resources,
									per_page: 10,
								})
							) {
								// userContext.setAccessToken(accessToken);
								// userContext.setUser({ id, username });
								dispatch({
									type: "SIGN_IN",
									accessToken,
									offline: false,
									user: {
										id,
										username,
									},
								});
							}
						} else
							Alert.alert(
								"Failed to login",
								"Check your login details",
								[
									{
										text: "Cancel",
										onPress: () => setLoading(false),
									},
								],

								{
									cancelable: true,
									onDissmiss: () => {
										setLoading(false);
									},
								}
							);
					} catch (err) {
						err?.message == "Network request failed" &&
							Alert.alert(
								"Oops!",
								"Check your internet connection",
								[
									{
										text: "Cancel",
										onPress: () => setLoading(false),
									},
								],
								{
									cancelable: true,
									onDissmiss: () => {
										setLoading(false);
									},
								}
							);
						setLoading(false);
						console.log(err);
					}
				}
			},
			signOut: () => {
				dispatch({ type: "SIGN_OUT" });
			},
			signUp: async (data) => {
				// In a production app, we need to send user data to server and get a token
				// We will also need to handle errors if sign up failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token
				const {
					firstname,
					lastname,
					theemail,
					thephone,
					thepassword,
					thepassword2,
				} = data.errors;

				if (
					firstname ||
					lastname ||
					theemail ||
					thephone ||
					thepassword ||
					thepassword2
				) {
					Alert.alert(
						"Fail",
						"Errors, Fix errors in the form, and try again!"
					);
					return;
				}

				const {
					firstName,
					lastName,
					phone,
					password,
					password2,
					email,
				} = data;

				if (
					firstName == "" ||
					lastName == "" ||
					phone.length < 12 ||
					password == "" ||
					password2 == ""
				) {
					Alert.alert(
						"Fail",
						"Fix errors in the form, and try again!"
					);
					console.log(
						firstName,
						lastName,
						phone,
						email,
						password,
						password2
					);
					return;
				}

				userContext.setIsRegistering("yes");

				try {
					await fetch(`${URLS.BASE}/register`, {
						method: "POST",
						body: JSON.stringify({
							phone: phone,
							fname: firstName,
							lname: lastName,
							email: email,
							role_id: 2,
							password: password,
							password_confirmation: password2,
						}),
						headers: {
							"Content-type": "application/json; charset=UTF-8",
							Accept: "application/json",
						},
					})
						.then((res) => res.json())
						.then((response) => {
							if (response.result == "success") {
								try {
									userContext.setIsRegistering("complete");
								} catch (err) {
									console.error(err);
								}
							} else if (response.result == "failure") {
								const { email, phone } = response.message;

								if (typeof email != "undefined")
									Alert.alert(
										"Registration failed!",
										"The email address you entered was used by another member."
									);
								else if (typeof phone != "undefined")
									Alert.alert(
										"Registration failed!",
										"The phone number you entered was used by another member."
									);
								else Alert.alert("Ooops!", "Try again!");

								console.log(response);
							} else {
								Alert.alert("Ooops!", "Try again!");
							}
						})
						.catch((err) => {
							console.log(err);
							Alert.alert(
								"Failure",
								"Something wrong happened. Check your internet and try again!"
							);
						});
				} catch (err) {
					console.error(err);
				}
			},
		}),
		[]
	);
	// const { isLoading, accessToken } = state;
	return (
		<AuthProvider>
			<AppNav />
		</AuthProvider>
	);
};

export default Entry;
