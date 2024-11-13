import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import bglogin from '../../assets/images/login.png'; 
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import { API_URL } from '@env'; // Import API_URL dari .env
import axios from 'axios';

const Splash = () => {
  const navigation = useNavigation(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular,
    Rubik_500Medium
  });

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        Alert.alert("Login Berhasil!", "Anda berhasil masuk.");
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert("Login Gagal", "Periksa email dan kata sandi Anda.");
    }
  };

  return (
    <ImageBackground source={bglogin} style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Access Account</Text>
      </View>
      <SafeAreaView style={styles.footer}>
        <Text style={styles.label}>Log in with one of the following options</Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <AntDesign name="google" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
            <FontAwesome name="facebook" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#AFAEBE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder='Your email'
            placeholderTextColor='#AFAEBE'
            onChangeText={text => setEmail(text)}
            value={email}
          />
        </View>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#AFAEBE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder='**********'
            placeholderTextColor='#AFAEBE'
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
          />
        </View>
        <View style={styles.btnContainer}>        
          <TouchableOpacity
            style={styles.btn}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Rubik_700Bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#A3ACFB',
    marginTop: 5,
  },
  footer: {
    flex: 2,
    justifyContent: 'flex-start',
    marginHorizontal: 50,
    paddingVertical: 40,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: 50,
    padding: 10,
    borderRadius: 50,
  },
  facebookButton: {
    backgroundColor: '#317BEF',
  },
  googleButton: {
    backgroundColor: '#317BEF',
    marginRight: 37,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Rubik_400Regular',
    marginLeft: 20,
  },
  label: {
    fontSize: 15,
    color: "#003A96",
    fontFamily: "Rubik_400Regular",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AFAEBE',
    borderRadius: 50,
    marginBottom: 25,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 12,
    borderRadius: 50,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  btn: {
    left: -19,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#317BEF',
    borderRadius: 50,
    marginHorizontal: 20,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Rubik_500Medium',
  },
});

export default Splash;
