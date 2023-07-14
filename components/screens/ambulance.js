import React, {useEffect, useContext, useState} from 'react';
import {
  Alert,
  View,
  Linking,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/styles';

import {AuthContext} from '../contexts/auth';
import CustomHeader from '../ui/custom-header';
import Loader from '../ui/loader';

const Ambulance = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: true,
    doctors: [],
    login: false,
  });

  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    _getDoctors();

    return () => {};
  }, []);

  const _getDoctors = async () => {
    // Fetch doctors from AsyncStorage or API

    // Dummy data for testing
    const dummyData = [
      {
        _id: '1',
        name: 'Kawoolo Hospital',
        hospital: 'Driver',
        status: 1,
        phone: '+256 772680727',
      },
      {
        _id: '2',
        name: 'St.Francis Ambulance ',
        hospital: 'Driver ',
        status: 1,
        phone: '+256 755996554',
      },
      {
        _id: '3',
        name: 'Kinoni Boda',
        hospital: 'Driver',
        status: 1,
        phone: '+256 772954307',
      },
      {
        _id: '4',
        name: 'Mukonge Health Center Ambulance ',
        specialisation: 'Clinician',
        hospital: 'Driver',
        status: 1,
        phone: '+256 707367315',
      },
      {
        _id: '5',
        name: 'St.Francis Ambulance',
        specialisation: 'General practitioner',
        hospital: 'Driver ',
        status: 1,
        phone: '256 755996554',
      },
    ];

    if (dummyData && dummyData.length > 0) {
      setState({doctors: dummyData, isLoading: false});
    } else {
      setState({doctors: [], isLoading: false});
    }

    // Rest of your code for fetching doctors

    // ...
  };

  const _keyExtractor = item => item._id;

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
        <ListItem bottomDivider>
          <Icon
            name="circle"
            size={25}
            color={
              item.status === 1
                ? 'green'
                : item.status === 2
                ? COLORS.PRIMARY
                : '#f00'
            }
          />
          <ListItem.Content>
            <ListItem.Title style={STYLES.listTitle}>
              {item.name}
            </ListItem.Title>
            <ListItem.Subtitle style={STYLES.subtitle}>
              <View style={STYLES.wrapper}>
                <View style={STYLES.subtitle}>
                  <Text style={STYLES.label}>Phone Number</Text>
                  <Text style={{color: COLORS.BLACK}}>{item.phone}</Text>
                </View>
                <View style={[STYLES.subtitle, {color: COLORS.BLACK}]}>
                  <Text style={{color: COLORS.BLACK}}>{item.hospital}</Text>
                </View>
              </View>
            </ListItem.Subtitle>
          </ListItem.Content>
          <Icon name="phone" size={25} color="rgba(0,0,0,.3)" />
        </ListItem>
      </TouchableOpacity>
    );
  };

  const {doctors, isLoading, login} = state;

  if (login) return <Login />;

  if (isLoading) return <Loader />;

  if (!doctors || doctors.length === 0) {
    return (
      <View style={STYLES.container}>
        <CustomHeader navigation={navigation} title={'Doctors'} />
        <View>
          <StatusBar />
          <Text style={STYLES.textColor}>No Doctors available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={STYLES.wrapper}>
      <StatusBar />

      <FlatList
        data={doctors}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
  alert: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    flexDirection: 'row',
    fontSize: 15,
    opacity: 0.5,
    color: COLORS.BLACK,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    color: COLORS.BLACK,
  },
  leftHeader: {
    flex: 1,
    paddingLeft: 10,
  },
  centerHeader: {
    flex: 2,
    flexDirection: 'row',
    color: COLORS.BLACK,
  },
  rightHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: COLORS.BLACK,
  },
});

export default Ambulance;
