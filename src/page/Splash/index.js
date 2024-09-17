import React from 'react';
import { View, Text, Button, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import hook dari React Navigation
import BgSplash from '../../assets/images/bg-screen.png'; // Sesuaikan jika ada
import ImgSplash from '../../assets/images/img-screen.png'; // Sesuaikan path
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';

const Splash = () => {
  const navigation = useNavigation(); // Menggunakan hook untuk mendapatkan objek navigation
  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular,
    Rubik_500Medium
  });
  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <ImageBackground source={BgSplash} style={styles.background}>
      <Image source={ImgSplash} style={styles.img} />
      <Text style={styles.title}>Manajemen Proyek</Text>
      <Text style={styles.text}>Mengelola Proyek dengan Efektif dan Efisien</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.btnText}>Start On Application</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
    alignItems: 'center',


  },
  img: {
    width: 269, // Tentukan ukuran gambar sesuai kebutuhan
    height: 155, // Tentukan ukuran gambar sesuai kebutuhan
    marginBottom: 12, // Jarak antara gambar dan teks    
  },
  title: {
    fontSize:18,
    fontWeight:"bold",
    color:"black",
    width:"70%",
    textAlign:"center",
    fontFamily:"Rubik_500Medium",
    marginBottom:10,
    lineHeight:30
  },
  text: {
    fontSize: 18,
    color:"black",
    width:"70%",
    textAlign:"center",
    fontFamily:"Rubik_400Regular",
    marginBottom: 20,
  },
  btn: {
    position: 'absolute',
    bottom: 53,
    width: 320,
    height: 47, // Sesuaikan tinggi tombol
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#317BEF', // Sesuaikan warna latar belakang tombol
    borderRadius: 14, // Sesuaikan sudut tombol
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Rubik_500Medium',
  }

});

export default Splash;
