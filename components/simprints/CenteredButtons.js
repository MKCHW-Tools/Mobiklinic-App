import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {COLORS, DIMENS} from '../constants/styles';
import DataResultsContext from '../contexts/DataResultsContext';

const CenteredButtons = ({navigation}) => {
  const {refusalData} = useContext(DataResultsContext);
  const {reason} = refusalData;
  const navigateToPatientData = () => {
    navigation.navigate('PatientData');
  };

  const navigateToPatientList = () => {
    navigation.navigate('BeneficaryAdd');
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{width: 70, height: 70, marginHorizontal: 80}}
          source={require('../imgs/logo.png')}
        />
        <Text style={styles.title}>Mobiklinic</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToPatientData}>
          <Text style={styles.buttonText}>Continue Registration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToPatientList}>
          <Text style={styles.buttonText}>Continue Identification </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 80,
  },

  button: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.ACCENT_1,
    alignItems: 'center',
    fontSize: 25,
    marginVertical: 20,
    paddingHorizontal: 50,
  },
});

export default CenteredButtons;
