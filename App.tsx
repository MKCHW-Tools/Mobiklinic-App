import React from 'react'
// import {AppRegistry} from 'react-native'
import Entry from './components/entry'
import {UserProvider} from './components/providers/User'
import {DiagnosisProvider} from './components/providers/Diagnosis'
import { DoctorsProvider } from './components/providers/Doctors'
// import {name as appName} from './app.json'
import SignUp from './components/screens/signup'
import AppStack from './components/navigators/AppStack'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'


const link = from([
    onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors)
            graphQLErrors.map(({message, locations, path}) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
            )
        if (networkError) console.log(`[Network error]: ${networkError}`)
    }
    ),

    new HttpLink({uri: 'https://staging.mobiklinic.com/graphql'})
]
    );

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: link
    });


export const App = () => {
    return (
        <ApolloProvider client={client}>
        <UserProvider>
            <DiagnosisProvider>
                <DoctorsProvider>
                    <Entry/>
                </DoctorsProvider>
            </DiagnosisProvider>
        </UserProvider>
        </ApolloProvider>
    )
}

export default App
