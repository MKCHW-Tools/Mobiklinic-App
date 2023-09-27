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
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CopyRight from '../simprints/copyright';

const About = ({navigation}) => {
  const openWebsite = () => {
    Linking.openURL('https://mobiklinic.com/');
  };

  const openEmail = () => {
    Linking.openURL('mailto:mobiklinicuganda@gmail.com');
  };

  _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{paddingLeft: 10}}
          onPress={() => navigation.goBack()}>
          <Icon name="menu" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      right={
        <TouchableOpacity style={{paddingRight: 10}}>
          <Icon name="user" size={25} color={COLORS.BLACK} />
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
            style={{width: 70, height: 70}}
            source={require('../imgs/logo.png')}
          />
          <Text style={STYLES.title}>MobiKlinic</Text>
        </View>

        <View>
          <Text style={STYLES.description}>
          The Mobiklinic app is a mobile application that streamlines healthcare processes and improves access to medical services, especially in rural areas. It integrates with SimprintsID, a biometric identification system, to enhance patient identification, data accuracy, and security. 
          {'\n'}
          Healthcare providers can register and manage beneficiaries, capture their biometric data using Simprints ID, and securely store their information.
          </Text>
          <View style={STYLES.email}>
            <TouchableOpacity style={STYLES.email} onPress={openWebsite}>
              <MIcon
                name="web"
                size={25}
                strokeSize={3}
                color={COLORS.PRIMARY}
              />
              <Text style={STYLES.link}>Visit Our Website</Text>
            </TouchableOpacity>
          </View>
          <View style={STYLES.email}>
            <TouchableOpacity style={STYLES.email} onPress={openEmail}>
              <MIcon
                name="email"
                size={25}
                strokeSize={3}
                color={COLORS.PRIMARY}
              />
              <Text style={STYLES.link}>Contact us</Text>
            </TouchableOpacity>
          </View>
          <CopyRight/>
        </View>
      </View>
    </View>
  );
};

const STYLES = StyleSheet.create({
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
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 15,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.BLACK,
    alignItems: 'center',
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    textAlign: 'left',
    paddingHorizontal: 25,
    marginBottom: 20,
    color: COLORS.BLACK,
    fontSize: 16,
  },
  link: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 15,
    textDecorationLine: 'underline',
  },
  credits: {
    marginTop: 40,
    fontStyle: 'italic',
    fontSize: 12,
    color: 'gray',
  },
  email: {
    flexDirection: 'row',
    // justifyContent: 'center',
    paddingHorizontal: 35,
    paddingVertical: 5,
    alignItems: 'flex-start',
  },
});

export default About;
