import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { AuthContext } from "../contexts/auth";
function AppNav() {
	const { tokens } = useContext(AuthContext);
	return (
		<NavigationContainer>
			{tokens ? <AuthStack /> : <AppStack />}
		</NavigationContainer>
	);
}

export default AppNav;
