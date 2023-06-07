import React, { useCallback,useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const DatabaseComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Make an API request to fetch the data from the database
      const endpoint = `https://mobi-be-production.up.railway.app/patients/${enrollmentGuid}`;
      const jsonData = await response.json();

      // Assuming the response data is an array of objects
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>
      {data ? (
        data.map(item => (
          <View key={item.id}>
            <Text>{`Name: ${item.firstName} ${item.lastName}`}</Text>
            <Text>{`Sex: ${item.sex}`}</Text>
            <Text>{`Age Group: ${item.ageGroup}`}</Text>
            <Text>{`Phone Number: ${item.phoneNumber}`}</Text>
            <Text>{`Weight: ${item.weight}`}</Text>
            <Text>{`Height: ${item.height}`}</Text>
            <Text>{`District: ${item.district}`}</Text>
            <Text>{`Country: ${item.country}`}</Text>
            <Text>{`Primary Language: ${item.primaryLanguage}`}</Text>
            <Text>{`Simprints GUI: ${item.simprintsGui}`}</Text>
          </View>
        ))
      ) : (
        <Text>Loading data...</Text>
      )}
    </View>
  );
};

export default DatabaseComponent;
