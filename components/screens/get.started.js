import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, DIMENS} from '../constants/styles';
import CustomHeader from '../parts/custom-header';
import CopyRight from '../simprints/copyright';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const GetStarted = ({navigation}) => {
  const handleLinkPress = () => {
    const url =
      'https://docs.google.com/document/d/1IKTAkLq2gCN2LDmBfjK9at5BVTBF68aj_bQmeeV92eo/edit?usp=sharing';
    Linking.openURL(url);
  };
  const openEmail = () => {
    Linking.openURL('mailto:mobiklinicuganda@gmail.com');
  };
  const openPhone = () => {
    Linking.openURL('tel:+256 784 528444');
  };
  _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{paddingLeft: 10}}
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={
        <Text style={[styles.centerHeader, styles.textColor]}>Get Started</Text>
      }
      right={
        <TouchableOpacity style={{paddingRight: 10}}>
          <Icon name="user" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Help</Text>
        <Text style={styles.description}>
          Welcome to the Help page. If you need assistance, please contact our
          support team.
        </Text>
        <Text style={styles.contact}>Contact Information:</Text>
        <Text style={styles.link} onPress={openPhone}>
          <MIcon name="phone" size={20} strokeSize={3} color={COLORS.PRIMARY} />
          <Text style={{paddingHorizontal: 20}}> Call Us</Text>
        </Text>

        <Text style={styles.link} onPress={openEmail}>
          <MIcon name="email" size={20} strokeSize={3} color={COLORS.PRIMARY} />
          <Text style={{paddingHorizontal: 20}}> Email Us</Text>
        </Text>

        

        <Text style={styles.link} onPress={handleLinkPress}>
          User Guide
        </Text>
        <CopyRight />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  textColor: {
    color: COLORS.BLACK,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: COLORS.SECONDARY,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  body: {
    flex: 2,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  desc: {
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
    color: COLORS.BLACK,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  alert: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: 15,
  },
  leftHeader: {
    flex: 1,
    paddingLeft: 10,
  },
  centerHeader: {
    flex: 2,
    flexDirection: 'row',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rightHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 50,
    // alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.BLACK,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.BLACK,
  },
  contact: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.BLACK,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingVertical:10
  },
  contactDetails: {
    fontSize: 16,
    marginBottom: 5,
    // textDecorationLine: 'underline',
    color: COLORS.BLACK,
  },
  link: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    paddingHorizontal: 100,
    paddingVertical: 5,
  },
});

export default GetStarted;
