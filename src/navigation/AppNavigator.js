import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash, Home, Login } from '../page';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{headerShown : false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
      <Stack.Screen name="Home" component={Home} options={{headerShown : false}}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
