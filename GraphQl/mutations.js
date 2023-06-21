import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation LoginUser($username: String!, $password: String!) {
  loginUser(password: $password, username: $username) {
    user {
      username
      firstName
      pk
      id
    }
  }
}
`;