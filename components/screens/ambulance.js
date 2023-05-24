import * as React from 'react';
import {
  View,
  Alert,
  Linking,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';

import {COLORS, DIMENS} from '../constants/styles';
import AuthContext from '../contexts/auth';
import {UserContext} from '../providers/User';
import {tokensRefresh} from '../helpers/functions';
import Loader from '../ui/loader';
import {URLS} from '../constants/API';

import CustomHeader from '../parts/custom-header';
import {CustomStatusBar} from '../ui/custom.status.bar';

const Ambulance = ({navigation}) => {
  const [state, setState] = React.useState({
    isLoading: true,
    ambulances: [],
  });

  React.useEffect(() => {
    _getAmbulances();
  }, []);

  const _getAmbulances = async () => {
    let ambulancesOnDevice = await AsyncStorage.getItem('@ambulances');
    ambulancesOnDevice = JSON.parse(ambulancesOnDevice) || [];
    setState({ambulances: ambulancesOnDevice, isLoading: false});
  };

  const _keyExtractor = item => item._id;

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.msdn}`)}>
        <ListItem bottomDivider>
          <Icon
            name="circle"
            size={25}
            color={
              item.status == 1
                ? 'green'
                : item.status == 2
                ? COLORS.PRIMARY
                : '#f00'
            }
          />
          <ListItem.Content>
            <ListItem.Title style={STYLES.listTitle}>
              {item.plate || item.msdn}
            </ListItem.Title>
            <ListItem.Subtitle style={STYLES.subtitle}>
              <View style={STYLES.wrapper}>
                <View style={STYLES.subtitle}>
                  <Text style={STYLES.label}>Driver</Text>
                  <Text>{item.driver}</Text>
                </View>
                <View style={STYLES.subtitle}>
                  <Text style={STYLES.label}>Hospital</Text>
                  <Text>{item.hospital}</Text>
                </View>
                {/* 								<View style={STYLES.subtitle}>
									<Text style={STYLES.label}>Location</Text>
									<Text>{item.location}</Text>
								</View> */}
                <View style={STYLES.subtitle}></View>
              </View>
            </ListItem.Subtitle>
          </ListItem.Content>
          <Icon name="phone" size={25} color="rgba(0,0,0,.3)" />
        </ListItem>
      </TouchableOpacity>
    );
  };

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{paddingLeft: 10}}
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      }
      title={
        <Text style={[STYLES.centerHeader, STYLES.title]}>Ambulances</Text>
      }
    />
  );

  let {isLoading, ambulances} = state;

  if (isLoading) return <Loader />;

  if (ambulances?.length == 0)
    return (
      <View style={STYLES.wrapper}>
        <CustomStatusBar />

        {_header()}

        <View style={STYLES.body}>
          <Icon name="smile" size={60} color={COLORS.GREY} />
          <Text style={STYLES.alert}>Can't not find Ambulances to show.</Text>
        </View>
      </View>
    );

  return (
    <View style={STYLES.wrapper}>
      <CustomStatusBar />
      {_header()}
      <FlatList
        data={ambulances}
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
    fontSize: 10,
    opacity: 0.5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  leftHeader: {
    flex: 1,
    paddingLeft: 10,
  },
  centerHeader: {
    flex: 2,
    flexDirection: 'row',
  },
  rightHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export default Ambulance;
