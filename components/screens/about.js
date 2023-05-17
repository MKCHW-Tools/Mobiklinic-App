import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  Button,
  NativeModules,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { COLORS, DIMENS } from "../constants/styles";
import CustomHeader from "../parts/custom-header";


const About = ({ navigation }) => {
  // simprints
  var OpenSimprints = NativeModules.OpenActivity;
  const { openActivity } = NativeModules;

  const openFunction = () => {
    OpenSimprints.init(projectId, userId);
    OpenSimprints.open("tZqJnw0ajK04LMYdZzyw", "test_user", "mpower");
  };
  const handlePress = () => {
    // handle button press here
    console.log("Pressed!");
  };

  // end

  _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={() => navigation.openDrawer()}
        >
          <Icon name="menu" size={25} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      }
      title={
        <Text style={[STYLES.centerHeader, STYLES.textColor]}>
          About the app
        </Text>
      }
      right={
        <TouchableOpacity style={{ paddingRight: 10 }}>
          <Icon name="user" size={25} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      {_header()}
      <View style={STYLES.body}>
        <View style={STYLES.logoContainer}>
          <Image
            style={{ width: 70, height: 70 }}
            source={require("../imgs/logo.png")}
          />
          <Text style={STYLES.title}>MobiKlinic</Text>
        </View>

        <View>
          <Text style={STYLES.desc}>Last mile health digital safetynet</Text>
          <Text style={STYLES.heading}>
            In partnership with Ablestate Creatives
          </Text>
          <Text style={STYLES.desc}>Report technical challenges</Text>
          <Text>Ablestate Creatives</Text>
          <Text>
            <Icon name="phone-call" /> 0704255401
          </Text>
          <Button title="Open Simprints ID" onPress={() => openFunction()} />
        </View>
      </View>
    </View>
  );
};

const STYLES = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  textColor: {
    color: COLORS.SECONDARY,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    backgroundColor: COLORS.SECONDARY,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  body: {
    flex: 2,
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontWeight: "bold",
  },
  desc: {
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    textAlign: "center",
  },
  alert: {
    color: COLORS.GREY,
    textAlign: "center",
    marginTop: 15,
  },
  leftHeader: {
    flex: 1,
  },
});

export default About;
