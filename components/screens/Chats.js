import * as React from "react";
import axios from "axios";
import { URLS } from "../constants/API";

import {
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import IconFont from "react-native-vector-icons/FontAwesome";
import { COLORS, DIMENS } from "../constants/styles";
import { colors, ListItem } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../parts/custom-header";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Loader from "../ui/loader";

export default function Chats({ route, navigation }) {
	const [isLoading, setLoading] = React.useState(true);
	const [error, setError] = React.useState("");
	const [chats, setChats] = React.useState([]);

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
					Messages
				</Text>
			}
		/>
	);
	const _keyExtractor = (item) => item.threadID;
	React.useEffect(() => {
		const fetchChats = async () => {
			const user = JSON.parse(await AsyncStorage.getItem("@user"));
			// console.log(user);
			const {
				tokens: { accessToken },
			} = user;
			axios.defaults.baseURL = URLS.BASE;
			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${accessToken}`;
			axios.defaults.headers.post["Content-Type"] =
				"application/json; charset=UTF-8";
			axios.defaults.headers.post["Accept"] = "application/json";

			const response = await axios.get(`/chats?page=1`);
			const {
				data: { chats: serverChats },
			} = response;
			// console.log(serverChats);
			if (serverChats?.length <= 0) {
				setLoading(false);
				setError(`You do not have messages yet!`);
				return;
			}

			serverChats?.forEach((serverChat) => {
				serverChat.users.forEach(async (user) => {
					const response = await axios.get(`/users/${user}`);
					console.log(response.data);
				});
			});

			// const _chats = response?.data;
			// console.log(_chats);
			/*let itemsOnDevice = await AsyncStorage.getItem(`@${items[i]}`);
			itemsOnDevice = JSON.parse(itemsOnDevice) || [];
			const all = uniqWith([..._items, ...itemsOnDevice], isEqual);
			AsyncStorage.setItem(`@${items[i]}`, JSON.stringify(all)); */
		};

		fetchChats();
	}, []);

	const _renderItem = ({ item }) => (
		<TouchableOpacity onPress={() => navigation.navigate("Chat", item)}>
			<ListItem bottomDivider>
				<Icon name="circle" color={COLORS.GREY} SIZE={25} />
				<ListItem.Content>
					<ListItem.Title style={STYLES.listTitle}>
						{item.thread[item.thread.length - 1].msg}
					</ListItem.Title>
				</ListItem.Content>
				<ListItem.Chevron size={30} />
			</ListItem>
		</TouchableOpacity>
	);

	if (isLoading) {
		return <Loader />;
	}

	if (error !== "") {
		return (
			<View style={STYLES.darkWrapper}>
				{_header()}
				<View style={STYLES.body}>
					<Text style={STYLES.error}>{error}</Text>
					<TouchableOpacity
						style={STYLES.button}
						onPress={() => navigation.navigate("Doctors")}>
						<Text style={STYLES.buttonTextWhite}>
							Choose a doctor to send your first message.
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	return (
		<>
			<FlatList
				data={chats}
				renderItem={_renderItem}
				keyExtractor={_keyExtractor}
			/>
		</>
	);
}

const STYLES = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: COLORS.SECONDARY,
	},
	darkWrapper: {
		flex: 1,
		backgroundColor: COLORS.BLACK,
	},
	header: {
		flex: 1,
		borderColor: COLORS.ACCENT_1,
	},
	body: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
	},

	messageHeader: {
		padding: 10,
		flexDirection: "row",
		backgroundColor: COLORS.ACCENT_1,
	},
	messageHeaderInner: {
		paddingLeft: 20,
	},
	messageReceiver: {
		fontWeight: "bold",
	},
	lastSeen: {
		fontSize: 9,
	},
	messageTime: {
		textAlign: "right",
		color: "#064374",
	},
	message: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		elevation: 1,
		marginBottom: 8,
		borderRadius: 8,
		padding: 10,
		paddingBottom: 5,
	},
	threadBody: {
		flex: 2,
		padding: 20,
	},
	contentContainerStyle: {
		paddingBottom: 40,
	},
	messageInput: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 50,
		flexDirection: "row",
		flex: 3,
		alignItems: "center",
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 10,
	},
	messageInputEmoji: {
		flex: 1,
	},
	messageInputControl: {
		flex: 2,
		padding: 0,
		paddingLeft: 5,
		paddingRight: 5,
	},
	messageInputBtn: {
		backgroundColor: COLORS.PRIMARY,
		width: 50,
		height: 50,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	messageFooter: {
		flexDirection: "row",
		alignItems: "center",
		margin: 10,
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
		color: COLORS.BLACK,
		fontSize: 16,
		fontWeight: "bold",
	},
	subtitle: {
		flexDirection: "row",
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
	yesText: {
		color: COLORS.PRIMARY,
	},
	rightHeader: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	icon: {
		marginLeft: 10,
	},
	button: {
		backgroundColor: COLORS.ERRORS,
		marginTop: 20,
		padding: 10,
	},
	buttonTextWhite: {
		color: COLORS.WHITE,
		fontSize: 20,
	},
	error: {
		color: COLORS.ERRORS,
		fontSize: 30,
	},
});
