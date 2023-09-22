import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS, DIMENS} from '../constants/styles';


const CenteredButtons = ({navigation}) => {
  const navigateToPatientData = () => {
    navigation.navigate('PatientData');
  };

  const navigateToPatientList = () => {
    navigation.navigate('PatientLists');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={navigateToPatientData}>
        <Text style={styles.buttonText}>Continue Registration</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToPatientList}>
        <Text style={styles.buttonText}>Continue Identification </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default CenteredButtons;
