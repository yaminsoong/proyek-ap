import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash, Home, Login, Profile, Proyek, CreateProyek, Waktu, CreateWaktu, Biaya, CreateBiaya,Mutu, CreateInspeksi } from '../page';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // console.log('isLoggedIn:', token);

        setIsLoggedIn(!!token); // Jika token ada, isLoggedIn menjadi true
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false); // Default ke false jika terjadi kesalahan
      }
    };

    checkLoginStatus();
  }, []);

  // Tampilkan indikator loading sementara status login belum ditentukan
  if (isLoggedIn === null) {
    return null; // Atau tampilkan komponen loading
  }

  // Navigasi berdasarkan status login
  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Splash"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Proyek" component={Proyek} />
      <Stack.Screen name="CreateProyek" component={CreateProyek} />
      <Stack.Screen name="Waktu" component={Waktu} />
      <Stack.Screen name="CreateWaktu" component={CreateWaktu} />
      <Stack.Screen name="Biaya" component={Biaya} />
      <Stack.Screen name="CreateBiaya" component={CreateBiaya} />
      <Stack.Screen name="Mutu" component={Mutu} />
      <Stack.Screen name="CreateInspeksi" component={CreateInspeksi} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
