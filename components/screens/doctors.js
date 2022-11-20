import * as React from "react";
import {
	Alert,
	View,
	Linking,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
	StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ListItem } from "react-native-elements";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Icon from "react-native-vector-icons/Feather";
import { COLORS, DIMENS } from "../constants/styles";

import Login from "./login";
import { AuthContext } from "../contexts/auth";
import { DoctorsContext } from "../providers/Doctors";
import { UserContext } from "../providers/User";
import { tokensRefresh } from "../helpers/functions";
import CustomHeader from "../ui/custom-header";
import Loader from "../ui/loader";
import { URLS } from "../constants/API";

const Doctors = ({ navigation }) => {
	const [state, setState] = React.useState({
		isLoading: true,
		doctors: [],
		login: false,
	});
	const { user, setUser } = React.useContext(AuthContext);

	const { signOut } = React.useContext(AuthContext);

	const doctorsContext = React.useContext(DoctorsContext);

	const userContext = React.useContext(UserContext);

	React.useEffect(() => {
		_getDoctors();
		return () => {};
	}, []);

	const _getDoctors = async () => {
		let doctorsOnDevice = await AsyncStorage.getItem("@doctors");
		doctorsOnDevice = JSON.parse(doctorsOnDevice);
		setState({ doctors: doctorsOnDevice });

		// Pick local doctors first.
		//Then retrieve remote doctors if there isn't any local
		//Save each remote doctor to local storage.
		//Show no doctors if returned doctors are 0

		/*try {
			const tokenString = await AsyncStorage.getItem("@tokens");
			console.log(tokenString);
			const tokens = tokenString && (await JSON.parse(tokenString));

			console.log(tokens);
			const { accessToken } = tokens;

			if (accessToken) {
				const response = await fetch(`${URLS.BASE}/doctors`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-type": "application/json; charset=UTF-8",
						Accept: "application/json",
					},
				});

				const JSON_RESPONSE = await response.json();

				const { result, msg, doctors } = await JSON_RESPONSE;

				if (result == "Success") {
					doctorsContext.setDoctors({ ...state, doctors });
					setState({ ...state, doctors, isLoading: false });
					return;
				}

				if (result == "Failure") {
					if (msg == "Token expired") {
						const result = tokensRefresh();
						if (result.accessToken) {
							// userContext.setAccessToken(result.accessToken)
							await AsyncStorage.setItem(
								"tokens",
								JSON.stringify({
									accessToken: result.accessToken,
									refreshToken: result.refreshToken,
								})
							);
							_getDoctors();
						}
						return;
					}

					if (msg == "Invalid Access Token") {
						signOut();
						setState({ ...state, login: true });
						return;
					}

					console.log("Some errors");
					console.log(JSON_RESPONSE);
				}
			}
		} catch (e) {
			Alert.alert(`Ooops!`, `Something went wrong. Try again!`, [
				{ text: "OK" },
			]);

			console.log(e);
		}
		*/
	};

	const _keyExtractor = (item) => item._id;

	const _renderItem = ({ item }) => {
		return (
			<TouchableOpacity onPress={() => navigation.navigate("Chat", { users: [ { _id: user.id, ...user }, item] })}>
				<ListItem bottomDivider>
					<Icon
						name="circle"
						size={25}
						color={
							item.status == 1
								? "green"
								: item.status == 2
								? COLORS.PRIMARY
								: "#f00"
						}
					/>
					<ListItem.Content>
						<ListItem.Title style={STYLES.listTitle}>
							{item.name}
						</ListItem.Title>
						<ListItem.Subtitle style={STYLES.subtitle}>
							<View style={STYLES.wrapper}>
								<View style={STYLES.subtitle}>
									<Text style={STYLES.label}>
										Specilisation
									</Text>
									<Text>{item.specialisation}</Text>
								</View>
								<View style={STYLES.subtitle}>
									<Text style={STYLES.label}>Hospital</Text>
									<Text>{item.hospital}</Text>
								</View>
								<View style={STYLES.subtitle}>
									<Text style={STYLES.label}>District</Text>
									<Text>{item.district}</Text>
								</View>
								<View style={STYLES.subtitle}>
									<Text style={STYLES.label}>Languages</Text>
									<Text>{item.languages}</Text>
								</View>
							</View>
						</ListItem.Subtitle>
					</ListItem.Content>
					<Icon
						onPress={() => Linking.openURL(`tel:${item.phone}`)}
						name="phone"
						size={25}
						color="rgba(0,0,0,.3)"
					/>
				</ListItem>
			</TouchableOpacity>
		);
	};
	const _header = () => (
		<CustomHeader
			left={
				<TouchableOpacity
					style={{ paddingLeft: 10 }}
					onPress={() => navigation.openDrawer()}>
					<Icon name="menu" size={25} color={COLORS.SECONDARY} />
				</TouchableOpacity>
			}
			title={
				<Text style={[STYLES.centerHeader, STYLES.title]}>
					Medical Experts
				</Text>
			}
		/>
	);

	let { doctors, isLoading, login } = state;

	if (login) return <Login />;

	if (isLoading) return <Loader />;

	if (doctors?.length == 0)
		return (
			<View style={STYLES.container}>
				<CustomHeader navigation={navigation} title={"Doctors"} />
				<View>
					<CustomStatusBar />
					<Text style={STYLES.textColor}>No Doctors available</Text>
				</View>
			</View>
		);

	return (
		<View style={STYLES.wrapper}>
			<CustomStatusBar />

			{_header()}

			<FlatList
				data={doctors}
				renderItem={_renderItem}
				keyExtractor={_keyExtractor}
			/>
		</View>
	);
};

const STYLES = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: COLORS.SECONDARY,
	},
	header: {
		flex: 1,
	},
	body: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
		color: COLORS.SECONDARY,
		textAlign: "center",
	},
	alert: {
		color: COLORS.GREY,
		textAlign: "center",
		marginTop: 15,
	},
	listTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	subtitle: {
		flexDirection: "row",
		fontSize: 10,
		opacity: 0.5,
	},
	label: {
		fontWeight: "bold",
		marginRight: 5,
	},
	leftHeader: {
		flex: 1,
		paddingLeft: 10,
	},
	centerHeader: {
		flex: 2,
		flexDirection: "row",
	},
	rightHeader: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
});

export default Doctors;
