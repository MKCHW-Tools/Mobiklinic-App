import {gql} from '@apollo/client';

export const RETRIEVE_LOCAL_USER_QUERY = gql`
  query RetrieveLocalUser {
    retrieveLocalUser {
      id
      username
      tokens
      offline
    }
  }
`;

// query to retreive data filled in patient data

export const GET_PATIENT_DATA_QUERY = gql`
  query GetPatientData($patientId: ID!) {
    patient(id: $patientId) {
      fullname
      phone
      gender
      dob
      weight
      height
      address
      age
    }
  }
`;
