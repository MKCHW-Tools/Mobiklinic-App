import React from "react";
import forgotPassword from "../screens/password.forgot";
import PasswordReset from "../screens/password.reset";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import Signup from "../screens/signup";
const Stack = createStackNavigator();

function AppStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{
					headerShown: false,
					// animationTypeForReplace: state.isSignout ? "pop" : "push",
				}}
			/>
			<Stack.Screen
				name="Signup"
				component={Signup}
				options={{
					headerShown: false,
					// animationTypeForReplace: state.isSignout ? "pop" : "push",
				}}
			/>
			<Stack.Screen
				name="forgotPassword"
				options={{ headerShown: false }}
				component={forgotPassword}
			/>
			<Stack.Screen
				name="resetPassword"
				options={{ headerShown: false }}
				component={PasswordReset}
			/>
		</Stack.Navigator>
	);
}

export default AppStack;
