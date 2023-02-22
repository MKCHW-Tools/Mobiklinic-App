import * as React from "react";

import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	StatusBar,
} from "react-native";

import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";

import FoIcon from "@expo/vector-icons/Fontisto";
import { COLORS, DIMENS } from "../constants/styles";

import CustomHeader from "../parts/custom-header";
import { CustomStatusBar } from "../ui/custom.status.bar";

const Dashboard = ({ navigation }) => {
	return (
		<View style={STYLES.wrapper}>
			<CustomStatusBar />
			<CustomHeader
				style={STYLES.header}
				left={
					<TouchableOpacity style={STYLES.leftHeader}>
						<Icon
							name="menu"
							size={32}
							color={COLORS.SECONDARY}
							onPress={() => navigation.openDrawer()}
						/>
					</TouchableOpacity>
				}
				title={
					<Text style={[STYLES.centerHeader, STYLES.title]}>
						Dashboard
					</Text>
				}
			/>
			<View style={STYLES.hero}>
				<Text style={STYLES.heroHeading}>Hey CHP,</Text>
				<Text style={STYLES.heroParagraph}>Welcome back!</Text>
				<Text style={STYLES.heroParagraph}>
					Choose an option below to continue.
				</Text>
			</View>
			<View style={STYLES.container}>
				<View style={[STYLES.column, STYLES.rightPad]}>
					<View style={STYLES.row}>
						<TouchableOpacity
							style={STYLES.card}
							onPress={() => navigation.navigate("Diagnose")}>
							<View style={STYLES.cardIcon}>
								<Icon
									name="heart"
									size={40}
									strokeSize={3}
									color={COLORS.BLACK}
								/>
							</View>
							<Text style={STYLES.cardTitle}>Diagnosis</Text>
						</TouchableOpacity>
					</View>
					<View style={STYLES.row}>
						<TouchableOpacity
							style={STYLES.card}
							onPress={() => navigation.navigate("Doctors")}>
							<View style={STYLES.cardIcon}>
								<FoIcon
									name="doctor"
									size={40}
									strokeSize={3}
									color={COLORS.BLACK}
								/>
							</View>
							<Text style={STYLES.cardTitle}>Doctors</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={STYLES.column}>
					<View style={STYLES.row}>
						<TouchableOpacity
							style={STYLES.card}
							onPress={() => navigation.navigate("Messages")}>
							<View style={STYLES.cardIcon}>
								<Icon
									name="message-circle"
									size={40}
									strokeSize={3}
									color={COLORS.BLACK}
								/>
							</View>
							<Text style={STYLES.cardTitle}>Messages</Text>
						</TouchableOpacity>
					</View>
					<View style={STYLES.row}>
						<TouchableOpacity
							style={STYLES.card}
							onPress={() => navigation.navigate("Ambulance")}>
							<View style={STYLES.cardIcon}>
								<MIcon
									name="ambulance"
									size={40}
									strokeSize={3}
									color={COLORS.BLACK}
								/>
							</View>
							<Text style={STYLES.cardTitle}>Ambulances</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{/* <View style={STYLES.body}>
				<Icon name="smile" size={60} color={COLORS.GREY} />
				<Text style={STYLES.alert}>No data to show now.</Text>
			</View> */}
		</View>
	);
};

const STYLES = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: COLORS.SECONDARY,
	},
	hero: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	heroHeading: {
		fontSize: 30,
		fontWeight: "bold",
	},
	heroParagraph: {
		fontSize: 20,
		fontWeight: "semi-bold",
	},
	header: {
		flex: 1,
	},
	body: {
		justifyContent: "center",
		alignItems: "center",
	},
	alert: {
		color: COLORS.GREY,
		textAlign: "center",
		marginTop: 15,
	},
	subtitle: {
		flexDirection: "row",
		fontSize: 10,
		color: COLORS.GREY,
	},
	label: {
		fontWeight: "bold",
		marginLeft: 5,
		marginRight: 5,
	},
	title: {
		fontWeight: "bold",
		color: COLORS.SECONDARY,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	leftHeader: {
		marginLeft: 10,
		flex: 1,
	},
	centerHeader: {
		flex: 2,
	},
	rightHeader: {
		flex: 1,
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: 300,
		padding: 10,
	},
	column: {
		flex: 1,
	},
	rightPad: {
		paddingRight: 10,
	},
	row: {
		flex: 1,
	},
	card: {
		backgroundColor: COLORS.WHITE,
		flex: 1,
		borderRadius: 10,
		marginBottom: 10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.15,
		shadowRadius: 3.84,
		elevation: 2,
	},
	cardIcon: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.ACCENT_1,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
	},
	cardTitle: {
		padding: 10,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default Dashboard;
