import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash, Home, Login, Profile, Proyek, CreateProyek, Waktu, CreateWaktu, Biaya, CreateBiaya } from '../page';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{headerShown : false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
      <Stack.Screen name="Home" component={Home} options={{headerShown : false}}/>
      <Stack.Screen name="Proyek" component={Proyek} options={{headerShown : false}}/>
      <Stack.Screen name="CreateProyek" component={CreateProyek} options={{headerShown : false}}/>
      <Stack.Screen name="Waktu" component={Waktu} options={{headerShown : false}}/>
      <Stack.Screen name="CreateWaktu" component={CreateWaktu} options={{headerShown : false}}/>
      <Stack.Screen name="Biaya" component={Biaya} options={{headerShown : false}}/>
      <Stack.Screen name="CreateBiaya" component={CreateBiaya} options={{headerShown : false}}/>
      <Stack.Screen name="Profile" component={Profile} options={{headerShown : false}}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
