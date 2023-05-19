import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FoIcon from 'react-native-vector-icons/Fontisto';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../constants/styles';

import CustomHeader from '../parts/custom-header';
import {CustomStatusBar} from '../ui/custom.status.bar';
import {signOut} from '../helpers/functions';
import {AuthContext} from '../contexts/auth';

const Dashboard = ({navigation}) => {
//   const {setTokens, setUser} = useContext(AuthContext);

  return (
    <View style={styles.wrapper}>
      <CustomStatusBar />
      <CustomHeader
        style={styles.header}
        left={
          <TouchableOpacity
            style={styles.leftHeader}
            onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={32} color={COLORS.SECONDARY} />
          </TouchableOpacity>
        }
        title={
          <Text style={[styles.centerHeader, styles.title]}>Dashboard</Text>
        }
      />
      <View style={styles.hero}>
        <Text style={styles.heroHeading}>Hey CHP,</Text>
        <Text style={styles.heroParagraph}>Welcome back!</Text>
        <Text style={styles.heroParagraph}>
          Choose an option below to continue.
        </Text>
      </View>
      <View style={styles.container}>
        <View style={[styles.column, styles.rightPad]}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Diagnose')}>
              <View style={styles.cardIcon}>
                <Icon name="heart" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}>Diagnosis</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Messages')}>
              <View style={styles.cardIcon}>
                <Icon name="message-circle" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}>Messages</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}>
              <View style={styles.cardIcon}>
                <FAIcon name="user-md" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Doctors')}>
              <View style={styles.cardIcon}>
                <FoIcon name="doctor" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}>Doctors</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Ambulance')}>
              <View style={styles.cardIcon}>
                <MIcon name="ambulance" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}> Ambulances</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setTokens(null);
                signOut(setUser);
              }}>
              <View style={styles.cardIcon}>
                <MIcon name="logout" size={40} color={COLORS.BLACK} />
              </View>
              <Text style={styles.cardTitle}>Logout</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  hero: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  heroHeading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  heroParagraph: {
    fontSize: 20,
    fontWeight: '600',
  },
  header: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 400,
    padding: 10,
  },
  column: {
    flex: 1,
  },
  rightPad: {
    paddingRight: 10,
  },
  row: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ACCENT_1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  cardTitle: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftHeader: {
    marginLeft: 10,
    flex: 1,
  },
  centerHeader: {
    flex: 2,
  },
  rightHeader: {
    flex: 1,
  },
});

export default Dashboard;
