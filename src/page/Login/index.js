import React from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import bglogin from '../../assets/images/login.png'; 
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const Splash = () => {
  const navigation = useNavigation(); 
  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular,
    Rubik_500Medium
  });

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

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
            onChangeText={text => this.setState({ email: text })}
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
            onChangeText={text => this.setState({ password: text })}
          />
        </View>
        <View style={styles.btnContainer}>        
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Home')}
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
    fontSize: 50,
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
    marginHorizontal: 60,
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
    width: '40%', // Lebar tombol sosial
    height: 50,
    padding: 10,
    borderRadius: 12,
  },
  facebookButton: {
    backgroundColor: '#317BEF', // Facebook warna latar belakang
  },
  googleButton: {
    backgroundColor: '#317BEF', // Google warna latar belakang
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
    borderRadius: 12,
    marginBottom: 25,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 12,
    borderRadius: 12,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  btn: {
    left:-19,
    width: '100%',
    height: 50, // Sesuaikan tinggi tombol
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#317BEF', // Sesuaikan warna latar belakang tombol
    borderRadius: 14, // Sesuaikan sudut tombol
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
