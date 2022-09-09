import * as React from "react";
import {
  View,
  Alert,
  Switch,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Button,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";

import { COLORS, DIMENS } from "../constants/styles";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  _removeStorageItem,
  generateRandomCode,
  MyDate,
} from "../helpers/functions";

import { DiagnosisContext } from "../providers/Diagnosis";
import CustomHeader from "../ui/custom-header";
import Loader from "../ui/loader";

const NewDiagnosis = ({ navigation }) => {
  const diagnosisContext = React.useContext(DiagnosisContext);
  const { diagnoses } = diagnosisContext;

  const [state, setState] = React.useState({
    isLoading: false,
    fullname: "",
    gender: "female",
    age_group: "",
    phone: "",
    condition: "",
    isPregnant: false,
    diagnosises: [],
  });

  const save = async () => {
    const { fullname, gender, age_group, phone, condition, isPregnant } = state;
    const code = generateRandomCode(5),
      date = MyDate();

    const newstate = {
      code,
      date,
      fullname,
      msdn: phone,
      gender,
      age_group,
      condition,
      isPregnant,
      followups: [],
      uploaded: false,
    };

    if (fullname && gender && age_group && condition) {
      // const data = await AsyncStorage.getItem('@diagnosis')
      // const prevstate = data !== null ? JSON.parse(data) : []
      setState({ ...state, isLoading: true });

      AsyncStorage.setItem(
        "@diagnosis",
        JSON.stringify([newstate, ...diagnoses]),
        () => {
          diagnosisContext.setDiagnoses([newstate, ...diagnoses]);

          Alert.alert("Saved", `Diagnosis code: ${code}`, [{ text: "OK" }]);

          setState({
            fullname: "",
            gender: "",
            age_group: "",
            phone: "",
            condition: "",
            isPregnant: false,
            followups: [],
            isLoading: false,
          });
        }
      );
    } else {
      Alert.alert("Ooops!", "Complete all fields", [{ text: "OK" }]);
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
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={
        <Text style={[STYLES.centerHeader, STYLES.title]}>Enter details</Text>
      }
      right={
        <TouchableOpacity
          onPress={() => save()}
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
          }}
        >
          <Icon name="check" size={25} color={COLORS.WHITE} />
        </TouchableOpacity>
      }
    />
  );

  if (state.isLoading) return <Loader />;

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />

      {_header()}

      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Enter patient details.</Text>
        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={(text) => setState({ ...state, fullname: text })}
          value={state.fullname}
          placeholder="Full name"
        />

        <View style={STYLES.pickers}>
          <Picker
            selectedValue={state.gender}
            onValueChange={(value, index) =>
              setState({ ...state, gender: value })
            }
          >
            <Picker.Item label="Gender" value="Gender" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <View style={STYLES.labeled}>
          <Text style={STYLES.label}>
            Is pregnant? {state.isPregnant == false ? "No" : "Yes"}
          </Text>
          <Switch
            style={STYLES.field}
            onValueChange={(text) => setState({ ...state, isPregnant: text })}
            value={state.isPregnant}
          />
        </View>

        <View style={STYLES.pickers}>
          <Picker
            selectedValue={state.age_group}
            onValueChange={(value, index) =>
              setState({ ...state, age_group: value })
            }
          >
            <Picker.Item label="Age group" value="Age group" />
            <Picker.Item label="0 - 3" value="0 - 3" />
            <Picker.Item label="3 - 10" value="3 - 10" />
            <Picker.Item label="10 - 17" value="10 - 17" />
            <Picker.Item label="17 - 40" value="17 - 40" />
            <Picker.Item label="40 - 60" value="40 - 60" />
            <Picker.Item label="60 above" value="60 above" />
          </Picker>
        </View>

        <TextInput
          style={STYLES.input}
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={(text) => setState({ ...state, phone: text })}
          value={state.phone}
          placeholder="Phone number"
        />

        <TextInput
          style={STYLES.textarea}
          autoCorrect={false}
          multiline={true}
          placeholderTextColor="rgba(0,0,0,0.7)"
          selectionColor={COLORS.SECONDARY}
          onChangeText={(text) => setState({ ...state, condition: text })}
          value={state.condition}
          placeholder="Patience condition"
        />
      </ScrollView>
    </View>
  );
};

export default NewDiagnosis;

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE_LOW,
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 2,
    paddingHorizontal: 20,
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
    flexGrow: 1,
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
  tip: {
    color: "rgba(0,0,0,0.4)",
    paddingTop: 15,
    paddingBottom: 15,
  },
  input: {
    color: "rgba(0,0,0,0.7)",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  textarea: {
    color: "rgba(0,0,0,0.7)",
    minHeight: 70,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.GREY,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  terms: {
    paddingVertical: 10,
    textAlign: "center",
    color: "grey",
  },
  pickers: {
    // borderBottomColor: 'rgba(0,0,0,0.7)',
    // borderBottomWidth:1,
    borderColor: COLORS.GREY,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: -10,
    marginBottom: 10,
  },
  labeled: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 50,
  },
  label: {
    flex: 2,
  },
  field: {
    flex: 1,
    justifyContent: "flex-end",
  },
  submit: {
    flexDirection: "row",
    padding: DIMENS.PADDING,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
  },
  submitText: {
    color: COLORS.BLACK,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
