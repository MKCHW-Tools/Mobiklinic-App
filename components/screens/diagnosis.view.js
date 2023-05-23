import * as React from "react";
import {
	View,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
	StatusBar,
	ScrollView,
} from "react-native";

import { ListItem } from "react-native-elements";

import Icon from "react-native-vector-icons/Feather";
import { COLORS, DIMENS } from "../constants/styles";

import Loader from "../ui/loader";

import { DiagnosisContext } from "../providers/Diagnosis";

import CustomHeader from "../ui/custom-header";
import { _removeStorageItem } from "../helpers/functions";

const ViewDiagnosis = ({ route, navigation }) => {
	const [state, setState] = React.useState({
		isLoading: true,
		diagnosis: route.params,
	});

const diagnosisContext = React.useContext(DiagnosisContext);
	const { diagnoses } = diagnosisContext; 

	const _keyExtractor = (item, index) => index.toString();

	const _renderItem = ({ item }) => {
		const FollowUptypes = {
			1: "Trimester 1",
			2: "Trimester 2",
			3: "Trimester 3",
			4: "General",
		};
		return (
			<ListItem bottomDivider>
				<ListItem.Content style={{ margin: 0, padding: 0 }}>
					<ListItem.Title>
						{FollowUptypes[Number(item?.type)]}
					</ListItem.Title>
					<ListItem.Subtitle style={STYLES.listItemTitle}>
						Record on: {item?.date}
					</ListItem.Subtitle>
					<ListItem.Subtitle style={STYLES.listItemBody}>
						{item.details}
					</ListItem.Subtitle>
				</ListItem.Content>
				{/* <ListItem.Chevron size={30} /> */}
			</ListItem>
		);
	};

	const _header = () => {
		const { code } = state.diagnosis;

		return (
			<CustomHeader
				left={
					<TouchableOpacity
						style={{
							marginHorizontal: 4,
							width: 35,
							height: 35,
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() => navigation.goBack()}>
						<Icon
							name="arrow-left"
							size={25}
							color={COLORS.BLACK}
						/>
					</TouchableOpacity>
				}
				title={
					<Text style={[STYLES.centerHeader, STYLES.title]}>
						Diagnosis {code}
					</Text>
				}
			/>
		);
	};

	/* 	React.useEffect(() => {
	    getDiagnosis();
	}, []); */

	/* 	const getDiagnosis = async () => {
		try {
			const { _id } = route.params;
			const diagnosis = diagnoses.filter(
				(_diagnosis) => _diagnosis._id == _id
			)[0];
			setState({ ...state, diagnosis, isLoading: false });
		} catch (err) {
			throw err;
		}
	};
 */
	const { isLoading, code, date, patient, details, pregnant, followups } =
		state.diagnosis;

	if (isLoading) return <Loader />;

	return (
		<View style={STYLES.wrapper}>
			<StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />

			{_header()}

			<View style={STYLES.body}>
				<Text style={STYLES.heading}>Diagnosis Info</Text>
				<FlatList
					style={{ paddingHorizontal: 10 }}
					data={followups}
					renderItem={_renderItem}
					keyExtractor={_keyExtractor}
					ListHeaderComponent={
						<>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>
									Date{" "}
								</Text>
								<Text>{date}</Text>
							</View>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>Name</Text>
								<Text>{patient?.fullname}</Text>
							</View>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>
									Phone
								</Text>
								<Text>{patient?.phone}</Text>
							</View>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>
									Gender{" "}
								</Text>
								<Text>{patient?.gender}</Text>
							</View>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>
									Age group{" "}
								</Text>
								<Text>{patient?.age}</Text>
							</View>
							<View style={{ paddingBottom: 10 }}>
								<Text style={{ fontWeight: "bold" }}>
									Details
								</Text>
								<Text>{details}</Text>
							</View>
							{patient?.gender == "Female" && (
								<View style={{ paddingBottom: 10 }}>
									<Text style={{ fontWeight: "bold" }}>
										Pregnant?
									</Text>
									<Text>
										{patient?.pregnant == false
											? "No"
											: "Yes"}
									</Text>
								</View>
							)}
							<Text style={STYLES.heading}>Follow ups</Text>
						</>
					}
				/>
			</View>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("FollowUp", { diagnosis_code: code })
				}
				style={{
					marginBottom: 20,
					flexDirection: "row",
					borderRadius: 100,
					position: "absolute",
					width: "90%",
					bottom: 0,
					left: "5%",
					padding: 10,
					paddingHorizontal: 20,
					backgroundColor: COLORS.BLACK,
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Text style={STYLES.textBtn}>Add New Follow Up</Text>
				<Icon name="plus" size={25} color={COLORS.WHITE} />
			</TouchableOpacity>
		</View>
	);
};

export default ViewDiagnosis;

const STYLES = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: COLORS.SECONDARY,
	},
	header: {
		flex: 1,
	},
	heading: {
		borderBottom: 1,
		borderColor: COLORS.GREY,
		borderStyle: "solid",
		padding: 10,
		fontSize: 20,
		fontWeight: "bold",
	},
	body: {
		borderRadius: 10,
		backgroundColor: COLORS.WHITE,
		paddingTop: 10,
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
	},
	followupsHeader: {
		fontWeight: "bold",
		padding: DIMENS.PADDING,
		textTransform: "uppercase",
		backgroundColor: COLORS.GREY,
	},
	followupsTitle: {
		padding: DIMENS.PADDING,
		backgroundColor: COLORS.GREY_LIGHTER,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: COLORS.GREY,
		padding: DIMENS.PADDING,
	},
	followupsBody: {
		borderWidth: 1,
		borderTopWidth: 0,
		borderStyle: "solid",
		borderColor: COLORS.GREY,
		padding: DIMENS.PADDING,
	},
	mutedText: {
		color: COLORS.GREY,
	},
	leftHeader: {
		marginLeft: 10,
		flex: 1,
	},
	centerHeader: {
		flex: 2,
		alignItems: "center",
	},
	rightHeader: {
		paddingRight: 10,
	},
	button: {
		backgroundColor: COLORS.PRIMARY,
		height: 50,
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		color: COLORS.SECONDARY,
	},
	btnText: {
		color: COLORS.SECONDARY,
		textAlign: "center",
		textTransform: "uppercase",
	},
	icon: {
		marginLeft: 10,
	},
	btnSubmit: {
		flexDirection: "row",
		margin: 15,
		backgroundColor: COLORS.BLACK,
		width: 40,
		height: 40,
		borderRadius: 100,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.32,
		shadowRadius: 5.46,
		elevation: 9,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-end",
		position: "absolute",
		zIndex: 9999999,
	},
	textBtn: {
		color: COLORS.WHITE,
	},
	listItemTitle: {
		fontSize: 12,
		fontStyle: "italic",
		marginTop: 5,
	},
	listItemBody: {
		marginTop: 5,
		color: COLORS.BLACK,
		fontSize: 15,
	},
});
