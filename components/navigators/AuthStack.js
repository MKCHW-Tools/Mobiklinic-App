// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { DrawerNavigationLogged } from "./drawers";
// import Diagnose from "../screens/diagnosis";
// import Ambulances from "../screens/ambulance";
// import Doctors from "../screens/doctors";
// import ViewDiagnosis from "../screens/diagnosis.view";
// import NewDiagnosis from "../screens/diagnosis.new";
// import FollowUp from "../screens/diagnosis.follow.up";
// import Chat from "../screens/Chat";
// import Chats from "../screens/Chats";
// import Profile from "../screens/profile";

// const Stack = createStackNavigator();

// function AuthStack() {
// 	return (
// 		<Stack.Navigator>
// 			<Stack.Screen
// 				name="Dashboard"
// 				options={{ headerShown: false }}
// 				component={DrawerNavigationLogged}
// 			/>
// 			<Stack.Screen
// 				name="Doctors"
// 				options={{ headerShown: false }}
// 				component={Doctors}
// 			/>
// 			<Stack.Screen
// 				name="Ambulances"
// 				options={{ headerShown: false }}
// 				component={Ambulances}
// 			/>
// 			<Stack.Screen
// 				name="Diagnose"
// 				options={{ headerShown: false }}
// 				component={Diagnose}
// 			/>
// 			<Stack.Screen
// 				name="ViewDiagnosis"
// 				options={{ headerShown: false }}
// 				component={ViewDiagnosis}
// 			/>
// 			<Stack.Screen
// 				name="NewDiagnosis"
// 				options={{ headerShown: false }}
// 				component={NewDiagnosis}
// 			/>
// 			<Stack.Screen
// 				name="FollowUp"
// 				options={{ headerShown: false }}
// 				component={FollowUp}
// 			/>
// 			<Stack.Screen
// 				name="Chats"
// 				options={{ headerShown: false }}
// 				component={Chats}
// 			/>
// 			<Stack.Screen
// 				name="Chat"
// 				options={{ headerShown: false }}
// 				component={Chat}
// 			/>
// 			<Stack.Screen
// 				name="Profile"
// 				options={{ headerShown: false }}
// 				component={Profile}
// 			/>
// 		</Stack.Navigator>
// 	);
// }

// export default AuthStack;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Diagnose from '../screens/diagnosis';
import Ambulances from '../screens/ambulance';
import Doctors from '../screens/doctors';
import ViewDiagnosis from '../screens/diagnosis.view';
import NewDiagnosis from '../screens/diagnosis.new';
import FollowUp from '../screens/diagnosis.follow.up';
import Chat from '../screens/Chat';
import Chats from '../screens/Chats';
import Profile from '../screens/profile';
// import {DrawerNavigation} from './drawers';
import Dashboard from '../screens/dashboard';
import {COLORS, DIMENS} from '../constants/styles';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import About from '../screens/about';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();


export const DrawerNavigation = () => {
  return (
    <Stack.Navigator
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
      drawerType={'slide'}
      hideStatusBar={'true'}
      drawerStyle={{
        backgroundColor: COLORS.PRIMARY,
        width: 240,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      {/* <Stack.Screen name="Covid" component={Covid19} /> */}
      {/* <Stack.Screen name="News" component={News} /> */}
      {/* <Stack.Screen name="Maternal" component={Maternal} /> */}
      {/* <Stack.Screen name="Health Tips" component={Tips} /> */}
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        options={{headerShown: false}}
        component={DrawerNavigation}
      />
      <Stack.Screen
        name="About"
        options={{headerShown: false}}
        component={About}
      />
      <Stack.Screen
        name="Doctors"
        options={{headerShown: false}}
        component={Doctors}
      />
      <Stack.Screen
        name="Ambulances"
        options={{headerShown: false}}
        component={Ambulances}
      />
      <Stack.Screen
        name="Diagnose"
        options={{headerShown: false}}
        component={Diagnose}
      />
      <Stack.Screen
        name="ViewDiagnosis"
        options={{headerShown: false}}
        component={ViewDiagnosis}
      />
      <Stack.Screen
        name="NewDiagnosis"
        options={{headerShown: false}}
        component={NewDiagnosis}
      />
      <Stack.Screen
        name="FollowUp"
        options={{headerShown: false}}
        component={FollowUp}
      />
      <Stack.Screen
        name="Chats"
        options={{headerShown: false}}
        component={Chats}
      />
      <Stack.Screen
        name="Chat"
        options={{headerShown: false}}
        component={Chat}
      />
      <Stack.Screen
        name="Profile"
        options={{headerShown: false}}
        component={Profile}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
