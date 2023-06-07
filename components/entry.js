import * as React from 'react';
import {AuthProvider} from './contexts/auth';

import AppNav from './navigators/AppNav';
import {DataResultsProvider} from './contexts/DataResultsContext';

const Entry = () => {
  React.useEffect(() => {
    //clearStorage();
    //autoLogin()
  }, []);

  // Check if the user is logged in,
  // if yes, navigate to the app
  // if no, navigate to the login screen
  // To login the user, we need to send the user's credentials to the server
  // and get a token back
  //If network error, retrieve users from local storage
  // Compare users to the logged in user
  // If the user is found, login the user and navigate to the app.
  // If the user is not found, show an error message
  return (
    <DataResultsProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </DataResultsProvider>
  );
};

export default Entry;
