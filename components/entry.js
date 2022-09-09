import * as React from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./contexts/auth";
import { UserContext } from "./providers/User";
import forgotPassword from "./screens/password.forgot";
import PasswordReset from "./screens/password.reset";
import Login from "./screens/login";
import {
	DrawerNavigation,
	DrawerNavigationLogged,
} from "./helpers/navigations";
import {
	cyrb53,
	RETRIEVE_LOCAL_USERS,
	SAVE_LOCAL_USERS,
} from "./helpers/functions";
import Loader from "./ui/loader";
import { URLS } from "./constants/API";
import Diagnose from "./screens/diagnosis";
import Ambulances from "./screens/ambulance";
import Doctors from "./screens/doctors";
import ViewDiagnosis from "./screens/diagnosis.view";
import NewDiagnosis from "./screens/diagnosis.new";
import FollowUp from "./screens/diagnosis.follow.up";
import { initialStateAuth, reducerAuth } from "./reducers/Auth";

const Stack = createStackNavigator();

const Entry = () => {
	const userContext = React.useContext(UserContext);
	const [state, dispatch] = React.useReducer(reducerAuth, initialStateAuth);

	React.useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const autoLogin = async () => {
			// AsyncStorage.clear()

			let accessToken = null;

			try {
				let tokenString = await AsyncStorage.getItem("tokens");

				let tokens = tokenString !== null && JSON.parse(tokenString);
				accessToken = tokens.accessToken;

				userContext.setAccessToken(accessToken);

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

		autoLogin()
	}, []);

	const memo = React.useMemo(
		() => ({
			signIn: async (data) => {
				let { user, setLoading } = data;

				// In a production app, we need to send some data (usually username, password) to server and get a token
				// We will also need to handle errors if sign in failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token

				if (typeof user === undefined) {
					Alert.alert(
						"Error",
						"Provide your phone number and password"
					);
					return;
				}

				const { username, password } = user;

				if (username == "" && password == "") {
					Alert.alert(
						"Error",
						"Provide your phone number and password"
					);
					return;
				}

				let theUsers = null;

				try {
					theUsers = await RETRIEVE_LOCAL_USERS();
					theUsers = JSON.parse(theUsers);
				} catch (err) {
					console.log(err);
				}

				if (theUsers !== null && theUsers.length > 0) {
					let hash = cyrb53(password);
					let aUser = theUsers.filter(
						(theUser) =>
							theUser.username === username &&
							theUser.hash === hash
					)[0];

					if (aUser !== undefined && aUser.username === username) {
						dispatch({ type: "SIGN_IN", accessToken: password });
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
						const { result, accessToken, refreshToken } = json_data;

						if (result == "Success") {
							await SAVE_LOCAL_USERS(username, password);

							userContext.setAccessToken(accessToken);

							await AsyncStorage.setItem(
								"tokens",
								JSON.stringify({ accessToken, refreshToken })
							);

							dispatch({ type: "SIGN_IN", accessToken });
						} else
							Alert.alert(
								"Failed to login",
								"Check your login details"
							);
					} catch (err) {
						err?.message == "Network request failed" &&
							Alert.alert(
								"Oops!",
								"Check your internet connection"
							);
						setLoading(false);
						console.log(err);
					}
				}
			},
			signOut: () => {
				AsyncStorage.removeItem("tokens");
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
	const { isLoading, accessToken } = state;
	return (
		<AuthContext.Provider value={memo}>
			<NavigationContainer>
				<Stack.Navigator>
					{isLoading ? (
                // We haven't finished checking for the token yet
                <Stack.Screen name="loader" component={Loader} options={{headerShown: false}} />
                )
                :
                accessToken == null
                ?
                (
                    <>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{headerShown: false}} />
                    <Stack.Screen name="Login" component={Login} options={{
                        headerShown: false,
                        animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                        }} />
                    <Stack.Screen name="forgotPassword" options={{ headerShown: false }} component={forgotPassword} />
                    <Stack.Screen name="resetPassword" options={{ headerShown: false }} component={PasswordReset} />
                    </>
                )
                :
                (
                    <>
                    <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={DrawerNavigationLogged} />
                    <Stack.Screen name="Doctors" options={{ headerShown: false }} component={Doctors} />
                    <Stack.Screen name="Ambulances" options={{ headerShown: false }} component={Ambulances} />
                    <Stack.Screen name="Diagnose" options={{ headerShown: false }} component={Diagnose} />
                    <Stack.Screen name="ViewDiagnosis" options={{ headerShown: false }} component={ViewDiagnosis} />
                    <Stack.Screen name="NewDiagnosis" options={{ headerShown: false }} component={NewDiagnosis} />
                    <Stack.Screen name="FollowUp" options={{ headerShown: false }} component={FollowUp} />
                    </>
                )
                }
				</Stack.Navigator>
			</NavigationContainer>
		</AuthContext.Provider>
	);
};

export default Entry;
