import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_PATIENT_DATA_QUERY} from '../graphql/Queries';

const PatientSummary = ({patientId}) => {
  const {loading, error, data} = useQuery(GET_PATIENT_DATA_QUERY, {
    variables: {patientId},
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.patient) {
    return <p>No data found for patient {patientId}</p>;
  }

  const {fullname, phone, gender, dob, weight, height, address, age} =
    data.patient;

  return (
    <div>
      <h2>Patient Data:</h2>
      <p>Full Name: {fullname}</p>
      <p>Phone: {phone}</p>
      <p>Gender: {gender}</p>
      <p>Date of Birth: {dob}</p>
      <p>Weight: {weight}</p>
      <p>Height: {height}</p>
      <p>Address: {address}</p>
      <p>Age Group: {age}</p>
    </div>
  );
};

export default PatientSummary;
