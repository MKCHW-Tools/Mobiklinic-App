import * as React from "react";
import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	StatusBar,
} from "react-native";
import CustomHeader from "../parts/custom-header";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Icon from "react-native-vector-icons/Feather";
import { COLORS, DIMENS } from "../constants/styles";
import { AuthContext } from "../contexts/auth";

const Profile = ({ navigation }) => {
	const { user } = React.useContext(AuthContext);
	React.useEffect(() => {
		console.log(user);
	});
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
						My Profile
					</Text>
				}
			/>
			<View style={STYLES.container}>
				<View>
					<Text style={[STYLES.centerHeader, STYLES.heroParagraph]}>Username</Text>
					<Text style={[STYLES.centerHeader, STYLES.heroParagraph]}>{user.username}</Text>
				</View>
			</View>
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
		color:COLORS.BLACK,

	},
	heroParagraph: {
		fontSize: 20,
		fontWeight: "semi-bold",
		color:COLORS.BLACK,

	},
	header: {
		flex: 1,
		color:COLORS.BLACK,

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
		color: COLORS.BLACK,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	leftHeader: {
		marginLeft: 10,
		flex: 1,
		color:COLORS.BLACK,
	},
	centerHeader: {
		flex: 2,
	},
	rightHeader: {
		flex: 1,
		color:COLORS.BLACK,

	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: 400,
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

export default Profile;


