import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CenteredButtons = ({ navigation }) =>  {
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
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CenteredButtons;
