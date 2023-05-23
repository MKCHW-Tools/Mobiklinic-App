import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IdentificationResultScreen from './components/IdentificationResultScreen';
import App from './App';

const Stack = createStackNavigator();

const Container = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="IdentificationResultScreen"
          component={IdentificationResultScreen}
          key="IdentificationResultScreen" 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Container;
