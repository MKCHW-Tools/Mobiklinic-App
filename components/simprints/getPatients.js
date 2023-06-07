import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import Loader from '../ui/loader';
import Icon from 'react-native-vector-icons/Feather';
import CustomHeader from '../ui/custom-header';
import {COLORS, DIMENS} from '../constants/styles';

function GetPatients({navigation}) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Make an API call or fetch data from your database
      const response = await fetch(
        'http://mobi-be-production.up.railway.app/patients',
      );
      const data = await response.json();

      // Assuming the fetched data is an array and you want to access the first item
      const user = data[0];

      setUserData(user);
    } catch (error) {
      Alert.alert('Error fetching data:', error);
    }
  };

  if (!userData) {
    return (
      <View>
        <Loader />
      </View>
    );
  }

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{
            marginHorizontal: 4,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={<Text style={[STYLES.centerHeader, STYLES.title]}>Back</Text>}
    />
  );

  return (
    <View style={STYLES.wrapper}>
      <StatusBar backgroundColor={COLORS.WHITE_LOW} barStyle="dark-content" />
      {_header()}
      <ScrollView style={STYLES.body} keyboardDismissMode="on-drag">
        <Text style={STYLES.terms}>Patient Profile </Text>
        <Text style={STYLES.text}>
          Full Name {'\n'}
          {userData.firstName}
          {userData.lastName}
        </Text>
        <Text style={STYLES.text}>
          Phone Number {'\n'}
          {userData.phoneNumber}
        </Text>
        <Text style={STYLES.text}>
          Primary Language{'\n'}
          {userData.primaryLanguage}
        </Text>
        <Text style={STYLES.text}>
          District{'\n'}
          {route.params.paramKey.district}
        </Text>

        <Text style={STYLES.text}>
          Age Group{'\n'}
          {userData.ageGroup}
        </Text>

        <Text style={STYLES.text}>
          Sex{'\n'}
          {userData.sex}
        </Text>

        <Text style={STYLES.text}>Simprints GUID{'\n'}</Text>

        <TouchableOpacity
          style={STYLES.btn}
          onPress={() => navigation.navigate('SelectActivity')}>
          <Text style={STYLES.btnText}>Confirm Details</Text>
          <Icon
            name="arrow-right"
            size={20}
            strokeSize={3}
            color={COLORS.WHITE}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default GetPatients;

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
    textAlign: 'center',
    marginTop: 15,
  },
  text: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'left',
    fontSize: 16,
    color: COLORS.BLACK,
    fontWeight: 'medium',
    borderBottomWidth: 1,
    padding: DIMENS.PADDING,
    borderBottomColor: '#000',
    borderColor:COLORS.GREY,
  },
  subtitle: {
    flexDirection: 'row',
    fontSize: 10,
    color: COLORS.GREY,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    alignItems: 'center',
    flexGrow: 1,
  },
  leftHeader: {
    marginLeft: 10,
    flex: 1,
  },
  centerHeader: {
    flex: 2,
    alignItems: 'center',
    color: COLORS.SECONDARY,
  },
  rightHeader: {
    paddingRight: 10,
  },
  tip: {
    color: 'rgba(0,0,0,0.4)',
    paddingTop: 15,
    paddingBottom: 15,
  },
  input: {
    color: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  textarea: {
    color: 'rgba(0,0,0,0.7)',
    minHeight: 70,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
  },
  terms: {
    paddingVertical: 10,
    textAlign: 'center',
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  pickers: {
    // borderBottomColor: 'rgba(0,0,0,0.7)',
    // borderBottomWidth:1,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: -5,
    marginBottom: 10,
  },
  pickerItemStyle: {
    color: 'rgba(0,0,0,0.7)',
    fontWeight: 'bold', // Customize the text color here
  },
  labeled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: COLORS.BLACK,
    marginTop: 10,
    marginBottom: 10,
    borderColor: COLORS.GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
  },
  label: {
    flex: 2,
    color: 'rgba(0,0,0,0.7)',
  },
  field: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  submit: {
    flexDirection: 'row',
    padding: DIMENS.PADDING,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
  },
  submitText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
  },
  detail: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: 15,
    backgroundColor: COLORS.GREY_LIGHTER,
  },
  btn: {
    backgroundColor: COLORS.BLACK,
    padding: DIMENS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 16,
    alignItems: 'center',
    fontWeight: '900',
    justifyContent: 'center',
    paddingLeft: 40,
    color: COLORS.WHITE,
  },
});