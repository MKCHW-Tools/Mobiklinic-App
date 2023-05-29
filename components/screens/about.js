import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, DIMENS} from '../constants/styles';
import CustomHeader from '../parts/custom-header';

const About = ({navigation}) => {
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
        <Text style={[STYLES.centerHeader, STYLES.textColor]}>
          About the app
        </Text>
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
          <Text style={STYLES.desc}>Last mile health digital safetynet</Text>
          <Text style={STYLES.heading}>
            In partnership with Ablestate Creatives
          </Text>
          <Text style={STYLES.desc}>Report technical challenges</Text>
          <Text style={STYLES.desc}>Ablestate Creatives</Text>
          <Text style={STYLES.desc}>
            <Icon name="phone-call" /> 0704255401
          </Text>
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
});

export default About;
