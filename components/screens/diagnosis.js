import * as React from "react";
import {
	View,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
	StatusBar,
} from "react-native";

import Loader from "../ui/loader";
import { ListItem } from "react-native-elements";
import { CustomStatusBar } from "../ui/custom.status.bar";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiagnosisContext } from "../providers/Diagnosis";

import { COLORS, DIMENS } from "../constants/styles";

import CustomHeader from "../parts/custom-header";

const Diagnose = ({ navigation }) => {
	const diagnosesContext = React.useContext(DiagnosisContext);
	const { diagnoses } = diagnosesContext;

	const [state, setState] = React.useState({ isLoading: true });

	const _keyExtractor = (item, index) => index.toString();

	const _renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("ViewDiagnosis", item)}>
				<ListItem bottomDivider>
					{item?.patient?.gender == "Female" ? (
						item?.patient?.isPregnant ? (
							<Icon
								name="check-circle"
								color={COLORS.PRIMARY}
								size={20}
							/>
						) : (
							<Icon
								name="minus-circle"
								color={COLORS.GREY}
								SIZE={25}
							/>
						)
					) : (
						<Icon name="circle" color={COLORS.GREY} SIZE={25} />
					)}

					<ListItem.Content>
						<ListItem.Title style={STYLES.listTitle}>
							{item?._id}
						</ListItem.Title>

						<ListItem.Subtitle style={STYLES.subtitle}>
							<Text>Age {item?.patient?.age}</Text>
						</ListItem.Subtitle>
					</ListItem.Content>
					<ListItem.Chevron size={30} />
				</ListItem>
			</TouchableOpacity>
		);
	};

	React.useEffect(() => {
		getDiagnoses();
	}, []);

	const getDiagnoses = async () => {
		try {
			const jsonString = await AsyncStorage.getItem("@diagnosis");
			diagnosesContext.setDiagnoses(
				jsonString ? JSON.parse(jsonString) : diagnoses
			);
			setState({ ...state, isLoading: false });
		} catch (err) {
			throw err;
		}
	};

	const _header = () => (
		<CustomHeader
			left={
				<TouchableOpacity
					style={{
						marginHorizontal: 4,
						width: 35,
						height: 35,
						/*                         borderRadius: 100,
                        backgroundColor: COLORS.GREY,
                        borderColor:COLORS.BLACK,
                        borderStyle:'solid',
                        borderWidth:1, */
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => navigation.openDrawer()}>
					<Icon name="menu" size={25} color={COLORS.BLACK} />
				</TouchableOpacity>
			}
			title={
				<Text style={[STYLES.centerHeader, STYLES.title]}>
					Diagnoses
				</Text>
			}
			right={
				<TouchableOpacity
					onPress={() => navigation.navigate("NewDiagnosis")}
					style={{
						marginHorizontal: 4,
						width: 35,
						height: 35,
						borderRadius: 100,
						backgroundColor: COLORS.BLACK,
						borderColor: COLORS.BLACK,
						borderStyle: "solid",
						borderWidth: 1,
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Icon name="plus" size={25} color={COLORS.WHITE} />
				</TouchableOpacity>
			}
		/>
	);

	if (state.isLoading) {
		return <Loader />;
	} else {
		if (typeof diagnoses === "object" && diagnoses.length == 0)
			return (
				<View style={STYLES.wrapper}>
					<CustomStatusBar />

					{_header()}

					<View style={STYLES.body}>
						<Icon name="smile" size={60} color={COLORS.GREY} />

						<Text style={STYLES.alert}>
							You don't have Diagnosis info yet.
						</Text>
					</View>
				</View>
			);

		return (
			<View style={STYLES.wrapper}>
				<CustomStatusBar />

				{_header()}

				<FlatList
					data={diagnoses}
					renderItem={_renderItem}
					keyExtractor={_keyExtractor}
				/>
			</View>
		);
	}
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
		color: COLORS.BLACK,
		fontSize: 16,
		fontWeight: "bold",
	},
	subtitle: {
		flexDirection: "row",
		// opacity:0.5
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
});

export default Diagnose;
