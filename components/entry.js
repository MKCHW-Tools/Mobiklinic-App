import * as React from "react";
import { AuthProvider } from "./contexts/auth";

import AppNav from "./navigators/AppNav";

const Entry = () => {
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
	return (
		<AuthProvider>
			<AppNav />
		</AuthProvider>
	);
};

export default Entry;
