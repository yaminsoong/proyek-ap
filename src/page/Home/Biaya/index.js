import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ImageBackground, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

const BiayaImage = require('../../../assets/images/bg-img-top.png'); // Background image
const imgBiaya = { uri: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg' };

export default function App() {
  const navigation = useNavigation(); // Initialize navigation
  const [selectedTab, setSelectedTab] = useState('In Progress');

  const tabs = ['Material', 'Pekerjaan', 'Alat', 'Upah'];

  const items = [
    { id: 1, title: 'Besi', amount: '200 Unit', price: '$50.00', icon: 'tools' },
    { id: 2, title: 'Pek. Pasir Urug', amount: '1000 m3', price: '$50.00', icon: 'dumpster' },
    { id: 3, title: 'Pemadatan tanah', amount: '200 m3', price: '$50.00', icon: 'dumpster' },
    { id: 4, title: 'Pembongkaran Keramik', amount: '200 Unit', price: '$50.00', icon: 'tools' },
    { id: 5, title: 'Upah galian tanah', amount: '- m3', price: '$50.00', icon: 'dollar-sign' }
  ];

  const renderItem = ({ id, title, amount, price, icon }) => (
    <View key={id} style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <FontAwesome5 name={icon} size={24} color="#A6A6A6" />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{title}</Text>
          <Text style={styles.itemAmount}>{amount}</Text>
        </View>
      </View>
      <Text style={styles.itemPrice}>{price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <ImageBackground source={BiayaImage} style={styles.header}>
          <TouchableOpacity style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <FontAwesome name="chevron-left" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar Biaya</Text>
          <TouchableOpacity style={styles.createButton}
            onPress={() => navigation.navigate('CreateProyek')}
          >
            <FontAwesome name="plus" size={22} color="white" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.footerCard}>
          {/* Tab Menu */}
          <View style={styles.tabs}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  { backgroundColor: selectedTab === tab ? '#3576F7' : '#A3C6F7' },
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Biaya Cards */}
          <ScrollView style={styles.scrollView}>
            {items.map(renderItem)}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFF8',
    position: "absolute",
  },
  footerCard: {
    marginHorizontal: 0,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 50,
    top: -50,
    position: "relative",
    backgroundColor: '#F2EFF8',
  },
  header: {
    width: windowWidth,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  createButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    padding: 10,
  },
  tabButton: {
    flex: 1,
    padding: 6,
    margin: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#3576F7',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "Rubik_500Medium",
  },
  activeTabText: {
    color: '#fff',
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemAmount: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
