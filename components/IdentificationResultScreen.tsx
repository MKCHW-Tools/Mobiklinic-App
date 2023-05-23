import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type IdentificationResultScreenProps = {
  route: RouteProp<{ params: { identificationResults: any[] } }, 'params'>;
};

const IdentificationResultScreen: React.FC<IdentificationResultScreenProps> = ({ route }) => {
  const { identificationResults} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identification Results:</Text>
      {identificationResults.map((result) => (
        <View key={result.guid} style={styles.resultContainer}>
          <Text>Tier: {result.tier}</Text>
          <Text>Confidence: {result.confidenceScore}</Text>
          <Text>Guid: {result.guid}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default IdentificationResultScreen;
