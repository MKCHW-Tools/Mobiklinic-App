import * as React from "react";
import {
	Text,
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

export default function Chat({ route, navigation }) {
	const [chat, setChat] = React.useState([]);
	let [msg, setMsg] = React.useState("");

	const doctor = route?.params?._id;
	const name = route?.params?.name;

	let currentTime = new Date();
	let [keyboardStatus, setKeyboardStatus] = React.useState(false);
	const AMessage = ({ chat, style }) => {
		let statusIcon = <Icon name="clock" />;
		switch (chat?.status) {
			case 0:
				statusIcon = <Icon name="clock" />;
				break;
			case 1:
				statusIcon = <Icon name="check" />;
				break;
			case 2:
				statusIcon = <IconFont name="check-double" />;
				break;
			case 3:
				statusIcon = <IconFont name="check-double" />;
				break;
			default:
				statusIcon = <Icon name="clock" />;
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
				<TouchableOpacity onPress={() => navigation.navigate("Chats")}>
					<Icon
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
				{chat?.map((chatItem, index) => (
					<AMessage
						style={[
							STYLES.message,
							chatItem?.from == "you" ? STYLES.you : STYLES.other,
						]}
						key={chatItem?.id}
						chat={chatItem}
					/>
				))}
			</ScrollView>
			<View style={STYLES.messageFooter}>
				<View style={STYLES.messageInput}>
					<TouchableOpacity>
						<Icon
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
				</View>
				{keyboardStatus ? (
					<TouchableOpacity
						style={STYLES.messageInputBtn}
						onPress={async () => {
							try {
								let date = new Date();
								let time = `${date.getHours()}:${date.getMinutes()}`;
								let id = `msgid${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
								if (msg?.length > 0) {
									setChat([
										...chat,
										{
											id,
											msg,
											from: "you",
											time,
											date: date.toDateString(),
											status: 2,
										},
									]);
									setMsg("");
								}
							} catch (error) {
								console.log(error);
							}
						}}>
						<IconFont
							name="paper-plane"
							size={25}
							strokeSize={5}
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
	you: {
		backgroundColor: COLORS.WHITE,
	},
	other: {
		backgroundColor: "#C5E3FC",
	},
});
