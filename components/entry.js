import * as React from 'react';
import {AuthProvider} from './contexts/auth';

import AppNav from './navigators/AppNav';
import AuthStack from './navigators/AuthStack';

const Entry = () => {
  React.useEffect(() => {
    //clearStorage();
    //autoLogin()
  }, []);
  return (
    // <AuthProvider>
    // 	<AppNav />
    // </AuthProvider>

    <AuthStack />
  );
};

export default Entry;
