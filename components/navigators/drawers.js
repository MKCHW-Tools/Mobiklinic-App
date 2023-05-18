import "react-native-gesture-handler";
import * as React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

import { COLORS, DIMENS } from "../constants/styles";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from "@react-navigation/drawer";

import { signOut } from "../helpers/functions";
import { AuthContext } from "../contexts/auth";
import Dashboard from "../screens/dashboard";
import Chats from "../screens/Chats";
import Login from "../screens/login";
import About from "../screens/about";
import Covid19 from "../screens/covid19";
import News from "../screens/news";
import Maternal from "../screens/maternal";
import GetStarted from "../screens/get.started";
import Tips from "../screens/tips";
import Diagnose from "../screens/diagnosis";

import Doctors from "../screens/doctors";
import Ambulance from "../screens/ambulance";
import Profile from "../screens/profile";

const Drawer = createDrawerNavigator();

export const CustomDrawerContent = (props) => {
	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.DrawerHeader}>
				<Image
					source={require("../imgs/logo.png")}
					style={styles.DrawerHeaderIcon}
				/>
				<Text style={styles.DrawerHeaderText}>MobiKlinic</Text>
			</View>
			<DrawerItemList {...props} />
			{props.children}
		</DrawerContentScrollView>
	);
};

export const DrawerNavigation = () => {
	// const { accessToken } = React.useContext(UserContext);

	return (
		<Drawer.Navigator
			initialRouteName="Dashboard"
			drawerContentOptions={{
				itemsContainerStyle: {
					marginVertical: 0,
				},
				activeTintColor: COLORS.WHITE,
				inactiveTintColor: COLORS.WHITE,
				activeBackgroundColor: COLORS.ACCENT_1,
				itemStyle: {
					marginHorizontal: 0,
					// padding: DIMENS.PADDING,
					borderRadius: 0,
				},
			}}
			drawerType={"slide"}
			hideStatusBar={"true"}
			drawerStyle={{
				backgroundColor: COLORS.PRIMARY,
				width: 240,
			}}
			drawerContent={(props) => <CustomDrawerContent {...props} />}>
			<Drawer.Screen name="Dashboard" component={Dashboard} />
			<Drawer.Screen name="Covid" component={Covid19} />
			<Drawer.Screen name="News" component={News} />
			<Drawer.Screen name="Maternal" component={Maternal} />
			<Drawer.Screen name="Health Tips" component={Tips} />
			<Drawer.Screen
				name="Login"
				component={Login}
				options={{ headerShown: false, swipeEnabled: false }}
			/>
			<Drawer.Screen name="About" component={About} />
		</Drawer.Navigator>
	);
};

export const DrawerNavigationLogged = () => {
	// const { setTokens, setUser } = React.useContext(AuthContext);

	return (
		<Drawer.Navigator
			initialRouteName="Dashboard"
			drawerContentOptions={{
				itemsContainerStyle: {
					marginVertical: 0,
				},
				activeTintColor: COLORS.WHITE,
				inactiveTintColor: COLORS.WHITE,
				activeBackgroundColor: COLORS.ACCENT_1,
				itemStyle: {
					marginHorizontal: 0,
					borderRadius: 0,
				},
			}}
			drawerType={"slide"}
			hideStatusBar={"true"}
			drawerStyle={{
				backgroundColor: COLORS.PRIMARY,
				width: 240,
			}}
			drawerContent={(props) => (
				<CustomDrawerContent {...props}>
					<DrawerItem
						label="Sign out"
						onPress={() => {
							setTokens(null);
							signOut(setUser);
						}}
						inactiveBackgroundColor={COLORS.WHITE_LOW}
					/>
				</CustomDrawerContent>
			)}>
			<Drawer.Screen name="Dashboard" component={Dashboard} />
			<Drawer.Screen name="Messages" component={Chats} />
			<Drawer.Screen name="Diagnose" component={Diagnose} />
			<Drawer.Screen name="Doctors" component={Doctors} />
			<Drawer.Screen name="Ambulance" component={Ambulance} />
			<Drawer.Screen name="Profile" component={Profile} />
			<Drawer.Screen name="Help" component={GetStarted} />
			<Drawer.Screen name="About" component={About} />
		</Drawer.Navigator>
	);
};

const styles = StyleSheet.create({
	DrawerHeader: {
		backgroundColor: COLORS.PRIMARY,
		padding: DIMENS.PADDING,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	DrawerHeaderIcon: {
		width: 50,
		height: 50,
		borderRadius: 10,
	},
	DrawerHeaderText: {
		color: COLORS.WHITE,
		fontWeight: "bold",
		paddingLeft: DIMENS.PADDING,
	},
});
