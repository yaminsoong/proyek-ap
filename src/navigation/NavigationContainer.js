import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  console.log('isLoggedIn:', isLoggedIn);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Token retrieved:", token);
        setIsLoggedIn(!!token); // Jika token ada, isLoggedIn menjadi true
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false); // Default ke false jika terjadi kesalahan
      }
    };

    checkLoginStatus();
  }, []); // Hanya dipanggil sekali, di awal render

  // Tampilkan indikator loading sementara status login belum ditentukan
  if (isLoggedIn === null) {
    return <Text>Loading...</Text>; // Loading sementara
  }

  return (
    <NavigationContainer>
      <AppNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );

};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Navigation;
