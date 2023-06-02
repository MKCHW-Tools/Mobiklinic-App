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
