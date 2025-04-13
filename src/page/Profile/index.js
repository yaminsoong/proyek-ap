import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import hook dari React Navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pastikan AsyncStorage terimport
import Toast from 'react-native-toast-message'; // Pastikan Toast terimport dengan benar

const Profile = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Menghapus token dari AsyncStorage
    Toast.show({
      type: 'info',
      position: 'top',
      text1: 'Logout Berhasil',
      text2: 'Anda telah keluar.',
    });
    navigation.navigate('Login');
    
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Text style={styles.text}>Welcome to the Profile Page!</Text> 
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20, // Menambah jarak antara tombol dan teks
  },
});
