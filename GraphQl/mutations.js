import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation loginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password) {
            token,
            user {
                id
                username
                password
            }
        }
    }

`;