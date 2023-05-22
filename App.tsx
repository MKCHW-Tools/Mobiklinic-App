import React, { useEffect, useState } from 'react';
import { View, Text, Button, NativeModules, NativeEventEmitter } from 'react-native';

const { IdentificationModule } = NativeModules;
const identificationEventEmitter = new NativeEventEmitter(IdentificationModule);

const MyComponent = () => {
  const [identificationResults, setIdentificationResults] = useState([]);

  useEffect(() => {
    const identificationResultSubscription = identificationEventEmitter.addListener(
      'onIdentificationResult',
      (results) => {
        setIdentificationResults(results);
      }
    );

    return () => {
      identificationResultSubscription.remove();
    };
  }, []);

  const handleIdentification = () => {
    const projectID = 'WuDDHuqhcQ36P2U9rM7Y';
    const moduleID = 'test_user';
    const userID = 'mpower';

    IdentificationModule.triggerIdentification(projectID, moduleID, userID);
  };

  return (
    <View>
      <Text>Identification Results:</Text>
      {(identificationResults as any[]).map((result) => (
        <Text key={result.guid}>
          Tier: {result.tier}, Confidence: {result.confidenceScore}, Guid: {result.guid}
        </Text>
      ))}
      <Button title="Start Identification" onPress={handleIdentification} />
    </View>
  );
};

export default MyComponent;
