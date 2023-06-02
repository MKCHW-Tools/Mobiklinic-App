import React from 'react';
// import {AppRegistry} from 'react-native'
import Entry from './components/entry';
import {UserProvider} from './components/providers/User';
import {DiagnosisProvider} from './components/providers/Diagnosis';
import {DoctorsProvider} from './components/providers/Doctors';
// import {name as appName} from './app.json'
import SignUp from './components/screens/signup';
import AppStack from './components/navigators/AppStack';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <DiagnosisProvider>
          <DoctorsProvider>
            <Entry />
          </DoctorsProvider>
        </DiagnosisProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
// AppRegistry.registerComponent(appName, () => App)
