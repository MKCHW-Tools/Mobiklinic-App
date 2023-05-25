import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {AuthContext} from '../contexts/auth';
function AppNav() {
  const {user} = useContext(AuthContext);
  return (
    <NavigationContainer>
      {user ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}

export default AppNav;
