import * as React from "react";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons, Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import IconFont from "@expo/vector-icons/FontAwesome";
import { COLORS, DIMENS } from "../constants/styles";
import { colors, ListItem } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URLS } from "../constants/API";
import { AuthContext } from "../contexts/auth";

export default function Chat({ route, navigation }) {
	const [chats, setChats] = React.useState([]);
	let [msg, setMsg] = React.useState("");
	let [chatId, setChatId] = React.useState(null);
	const doctor = route?.params?._id;
	const name = route?.params?.name;

	let currentTime = new Date();
	let [keyboardStatus, setKeyboardStatus] = React.useState(false);
	const { user, tokens } = React.useContext(AuthContext);
	// console.log(user);
	const getChats = async (chatId) => {
		try {
			const conversation = await AsyncStorage.getItem(chatId);
			const messages = JSON.parse(conversation) || [];
			// console.log(messages.length);
			// console.log(JSON.stringify(messages, null, 2));
			setChats([...messages]);
		} catch (e) {
			console.log("Get chats", e);
		}
	};
	const getUser = async () => {
		try {
			const user = await AsyncStorage.getItem("@user");
			return JSON.parse(user);
		} catch (e) {
			console.log(e);
		}
	};
	const getChat = async (chatUsers) => {
		try {
			return await AsyncStorage.getItem(chatUsers);
		} catch (e) {
			console.log(e);
		}
	};
	const makeChatId = async () => {
		const { id, tokens } = await getUser();
		const myChat = await getChat(`${id}${doctor}`);
		if (typeof myChat !== "string") {
			let response = await fetch(`${URLS.BASE}/chats`, {
				method: "POST",
				body: JSON.stringify({
					userId: [id, doctor],
				}),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					Accept: "application/json",
					Authorization: tokens.accessToken,
				},
			});

			let json_data = await response.json();
			const chatUsers = `${id}${doctor}`;
			const chatId = json_data._id;
			await AsyncStorage.setItem(chatUsers, chatId);
			setChatId(chatId);
		} else {
			setChatId(myChat);
			getChats(myChat);
		}
	};
	const sendMessasge = async () => {
		let response = await fetch(`${URLS.BASE}/chats`, {
			method: "POST",
			body: JSON.stringify({
				sender: id,
				content: msg,
				chatId: chatId,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				Accept: "application/json",
				Authorization: tokens.accessToken,
			},
		});

		let json_data = await response.json();
		console.log(json_data);
	};
	React.useEffect(() => {
		// console.log(JSON.stringify(userContext.accessToken, null, 2));
		const getKeys = async () => {
			const keys = await AsyncStorage.getAllKeys();
			console.log(keys);
		};
		// getKeys();
		makeChatId();
	}, []);
	const AMessage = ({ chat, style }) => {
		let statusIcon = <Feather name="clock" />;
		switch (chat?.status) {
			case 0:
				statusIcon = <Feather name="clock" />;
				break;
			case 1:
				statusIcon = <Feather name="check" />;
				break;
			case 2:
				statusIcon = <Ionicons name="checkmark-done" />;
				break;
			case 3:
				statusIcon = <Ionicons name="checkmark-done" />;
				break;
			default:
				statusIcon = <Feather name="clock" />;
				break;
		}

		return (
			<View style={style}>
				<Text>{chat?.msg}</Text>
				<View>
					<Text style={STYLES.messageTime}>{chat?.time}</Text>
					{statusIcon}
				</View>
			</View>
		);
	};

	return (
		<>
			<View style={STYLES.messageHeader}>
				<TouchableOpacity
					onPress={() => navigation.navigate("Doctors")}>
					<Feather
						name="arrow-left"
						size={30}
						strokeSize={4}
						color={COLORS.BLACK}
					/>
				</TouchableOpacity>
				<IconFont
					name="user"
					size={30}
					strokeSize={4}
					style={STYLES.icon}
					color={COLORS.BLACK}
				/>
				<View style={STYLES.messageHeaderInner}>
					<Text style={STYLES.messageReceiver}>{name}</Text>
					<Text style={STYLES.lastSeen}>
						Last seen {currentTime.toLocaleDateString()} at{" "}
						{currentTime.toLocaleTimeString()}
					</Text>
				</View>
			</View>
			<ScrollView
				contentContainerStyle={STYLES.contentContainerStyle}
				style={STYLES.threadBody}
				keyboardDismissMode="on-drag">
				{chats?.map((chatItem, index) => (
					<AMessage
						style={[
							STYLES.message,
							chatItem?.from == "you" ? STYLES.you : STYLES.other,
						]}
						key={index.toString()}
						chat={chatItem}
					/>
				))}
			</ScrollView>
			<View style={STYLES.messageFooter}>
				<View style={STYLES.messageInput}>
					<TouchableOpacity>
						<Feather
							name="smile"
							size={30}
							strokeSize={5}
							color="rgba(0,0,0,.5)"
						/>
					</TouchableOpacity>
					<TextInput
						value={msg}
						multiline={true}
						numberOfLines={3}
						style={STYLES.messageInputControl}
						onChangeText={(text) => setMsg(text)}
						placeholder={"Type a message"}
						onFocus={() => setKeyboardStatus(true)}
					/>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="paperclip"
							size={24}
							color="black"
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Ionicons name="camera" size={24} color="black" />
					</TouchableOpacity>
				</View>
				{msg?.length > 0 ? (
					<TouchableOpacity
						style={STYLES.messageInputBtn}
						onPress={async () => {
							try {
								let date = new Date();
								let time = `${date.getHours()}:${date.getMinutes()}`;
								// let id = `msgid${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
								const { id } = await getUser();
								await AsyncStorage.setItem(
									String(chatId),
									JSON.stringify([
										...chats,
										{
											msg,
											sender: id,
											time,
											date: date.toDateString(),
											status: 2,
											backend_id: null,
										},
									])
								);
								await sendMessasge();
								await getChats(chatId);
								/* setChats([
									...chats,
									{
										msg,
										sender: id,
										time,
										date: date.toDateString(),
										status: 2,
										backend_id: null,
									},
								]); */
								setMsg("");
							} catch (error) {
								console.log(error);
							}
						}}>
						<Octicons
							name="paper-airplane"
							size={24}
							color={COLORS.WHITE}
							backgroundColor={COLORS.ACCENT_1}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={STYLES.messageInputBtn}>
						<IconFont
							name="microphone"
							size={25}
							strokeSize={5}
							color={COLORS.WHITE}
							backgroundColor={COLORS.ACCENT_1}
						/>
					</TouchableOpacity>
				)}
			</View>
		</>
	);
}
const STYLES = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: COLORS.SECONDARY,
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
		padding: 7,
		paddingLeft: 5,
		paddingRight: 5,
	},
	messageInputBtn: {
		backgroundColor: COLORS.PRIMARY,
		width: 45,
		height: 45,
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
	you: {
		backgroundColor: COLORS.WHITE,
	},
	other: {
		backgroundColor: "#C5E3FC",
	},
});
