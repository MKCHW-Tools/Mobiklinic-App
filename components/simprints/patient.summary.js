import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_PATIENT_DATA_QUERY} from '../graphql/Queries';
import {View, Text} from 'react-native';

const PatientSummary = ({patientId, simprintsId}) => {
  const {loading, error, data} = useQuery(GET_PATIENT_DATA_QUERY, {
    variables: {patientId},
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || !data.patient) {
    return <Text>No data found for Patient {patientId}</Text>;
  }

  const {fullname, phone, gender, dob, weight, height, address, age} =
    data.patient;

  return (
    <View>
      <Text>Patient Data:</Text>
      <Text>Full Name: {fullname}</Text>
      <Text>Phone Number: {phone}</Text>
      <Text>Gender: {gender}</Text>
      <Text>Date of Birth: {dob}</Text>
      <Text>Weight: {weight}</Text>
      <Text>Height: {height}</Text>
      <Text>Address: {address}</Text>
      <Text>Age GrouText: {age}</Text>
      <Text>SimTextrints ID: {simprintsId}</Text>
    </View>
  );
};

export default PatientSummary;
