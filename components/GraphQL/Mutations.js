import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      username
      password
      tokens {
        access
        refresh
      }
      offline
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation SignUpUser(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $password: String!
    $email: String!
  ) {
    signUpUser(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      password: $password
      email: $email
    ) {
      id
      username
      tokens {
        access
        refresh
      }
      offline
    }
  }
`;

export const REFRESH_TOKENS = gql`
  mutation RefreshTokens($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      result
    }
    offline
  }
`;

export const tokensRefreshMutation = gql`
  mutation TokensRefresh($user: UserInput!) {
    tokensRefresh(user: $user) {
      id
      username
      tokens {
        access
        refresh
      }
      offline
    }
  }
`;

export const DOWNLOAD_MUTATION = gql`
  mutation Download($accessToken: String!, $items: [String]!, $per_page: Int!) {
    download(accessToken: $accessToken, items: $items, per_page: $per_page)
  }
`;

export const SAVE_LOCAL_USER_MUTATION = gql`
  mutation SaveLocalUser($input: UserInput!) {
    saveLocalUser(input: $input) {
      id
      username
      hash
      tokens
    }
  }
`;
