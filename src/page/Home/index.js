import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { ImgHeader, User, Menu } from "../../assets";
import ButtonIcon from '../../components/ButtonIcon/ButtonIcon';
import {WARNA_ABU_ABU} from '../../utils/constant';
import {ScrollView} from 'react-native-gesture-handler';
 
const Home = () => {
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={ImgHeader} style={styles.header}>
          <Image source={User} style={styles.user}></Image>
            <View style={styles.hello}>
              <Text style={styles.selamat}>Selamat Datang, </Text>
              <Text style={styles.username}>Yamin</Text>
            </View>
            <Image source={Menu} style={styles.menu}></Image>
          </ImageBackground>
          <View style={styles.body}>
            <View style={styles.card}>
              <ButtonIcon title="Kiloan" type="layanan" />
              <ButtonIcon title="Satuan" type="layanan" />
              <ButtonIcon title="VIP" type="layanan" />
              <ButtonIcon title="Karpet" type="layanan" />
              <ButtonIcon title="Setrika Saja" type="layanan" />
              <ButtonIcon title="Ekspress" type="layanan" />
            </View>
          </View>
          <View style={styles.pesananAktif}>
            <Text style={styles.label}>Pesanan Aktif</Text>
            <PesananAktif title="Pesanan No. 0002142" status="Sudah Selesai"/>
            <PesananAktif title="Pesanan No. 0002142" status="Masih Dicuci"/>
            <PesananAktif title="Pesanan No. 0002142" status="Sudah Selesai"/>
            <PesananAktif title="Pesanan No. 0002142" status="Sudah Selesai"/>
          </View>
        </ScrollView>
    </View>
  );
};

export default Home;

const windowWidht = Dimensions.get("window").width; //Untuk dimension mengikuti divice
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  page: {
    flex: 1,
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
    top: 44,
    right: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  selamat: {
    fontSize: 12,
    color: "white",
  },
  username: {
    fontSize: 13,
    color: "white",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  body: {
    flex: 1,
    marginTop: -30, // Overlaps the header with negative margin
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  card: {
    width: windowWidht * 1,
    height: windowHeight * 0.8,
    backgroundColor: "#fff",
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    padding: 30,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
});
