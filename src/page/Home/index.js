import React from "react";
import { View, Image, Text, StyleSheet, ImageBackground, Dimensions, ScrollView,TouchableOpacity } from "react-native";
import { ImgHeader, User, Menu } from "../../assets";
import ButtonIconGrid from '../../components/ButtonIcon/management'; // Pastikan jalur ini benar
import ButtonIconGridSchedul from '../../components/ButtonIcon/schedule'; 
import ButtonIconGridProgress from '../../components/ButtonIcon/progress'; 
import { WARNA_ABU_ABU } from '../../utils';
import { useNavigation } from '@react-navigation/native'; // Menggunakan navigasi

const Home = () => {
  const data = [
    { title: 'Proyek' },
    { title: 'Waktu' },
    { title: 'Biaya' },
    { title: 'Keselamatan Kerja (K3)' },
    { title: 'Mutu' },
    { title: 'Kalender' },
    { title: 'Tugas Proyek' },
  ];

const navigation = useNavigation(); // Hook navigasi untuk mengarahkan ke profil
const goToProfile = () => {
  navigation.navigate('Profile'); // Navigasi ke halaman profil, pastikan route 'Profile' sudah diatur
};
const goToProyek = () => {
  navigation.navigate('Proyek'); // Navigasi ke halaman Proyek, pastikan route 'Proyek' sudah diatur
};

const handleSeeAll = (menuType) => {
  // Logika navigasi ke menu "All" berdasarkan jenis menu
  alert(`See all ${menuType}`); // Ganti dengan navigasi ke layar yang sesuai
};

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={ImgHeader} style={styles.header}>
          <Image source={User} style={styles.user} />
          <View style={styles.hello}>
            <Text style={styles.selamat}>Selamat Datang, </Text>
            <Text style={styles.username}>Yamin</Text>
          </View>
          <TouchableOpacity onPress={goToProfile}>
            <Image source={Menu} style={styles.menu} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.body}>
          <View style={styles.cardMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.titleMenu}>Management</Text>
              {/* <TouchableOpacity style={styles.seeAllButton} onPress={() => handleSeeAll('Management')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity> */}
            </View>
              <ButtonIconGrid data={data} />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.cardMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.titleMenu}>Schedule</Text>
              {/* <TouchableOpacity style={styles.seeAllButton} onPress={() => handleSeeAll('Management')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity> */}
            </View>
            <ButtonIconGridSchedul data={data} />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.cardMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.titleMenu}>Progress</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={() => handleSeeAll('Management')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ButtonIconGridProgress data={data} />
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default Home;

const windowWidht = Dimensions.get("window").width; // Untuk dimension mengikuti device
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
    alignItems: 'center',
    backgroundColor: '#F2EFF8',
  },
  header: {
    width: windowWidht,
    height: windowHeight * 0.33,
    paddingHorizontal: 30,
    paddingTop: 44,
    paddingVertical: 30,
  },
  hello: {
    marginTop: windowHeight * 0.01,
  },
  user: {
    width: windowWidht * 0.09,
    height: windowHeight * 0.05,
  },
  menu: {
    position: "absolute",
    top: -80,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  selamat: {
    fontSize: 12,
    color: "white",
    fontFamily: 'Rubik_400Regular',
  },
  username: {
    fontSize: 14,
    color: "white",
    fontFamily: 'Rubik_500Medium',
  },
  body: {
    flex: 1,
    marginTop: -30, // Overlaps the header with negative margin
    paddingHorizontal: 0,
    paddingVertical: 0,

  },  
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingRight: 30,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#317BEF',
    fontFamily: 'Rubik_400Regular',
    fontWeight: '400',
  },
  titleMenu:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'Left',
    fontFamily: 'Rubik_500Medium',
    marginBottom: 10,  // Menambah ruang bawah
    paddingHorizontal: 30,  // Menambah padding kiri dan kanan
  },
  card: {
    width: windowWidht * 1,
    height: windowHeight * 1,
    backgroundColor: "#F2EFF8",
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    paddingTop: 20,
  },
  cardMenu: {
    width: windowWidht * 1,
    backgroundColor: "#F2EFF8",
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    paddingTop: 20,
  },


});
