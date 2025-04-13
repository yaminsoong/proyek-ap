import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const BiayaImage = require('../../../assets/images/bg-img-top.png');

export default function App() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Material');
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('pcs');

  const tabs = ['Material', 'Pekerjaan', 'Alat', 'Upah'];

  const fetchItems = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'Token tidak ditemukan.',
        });
        // setItems([]);
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data.data && Array.isArray(response.data.data.data)) {
        const data = response.data.data.data || [];
        const filteredData = data.filter(item => {
          // Pastikan kategori ada dan tidak null
          if (!item.kategori || item.kategori === null) {
            console.log('Item skipped (null or empty kategori):', item);  // Log item yang dilewati
            return false;  // Mengabaikan item dengan kategori null atau kosong
          }
          
          // Log perbandingan kategori
          console.log('Checking item:', item.kategori, 'Against Tab:', selectedTab);
          return item.kategori.toLowerCase() === selectedTab.toLowerCase();  // Perbandingan case-insensitive
        });
        
        console.log('Filtered Data:', filteredData);
        setItems(filteredData);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal mengambil data dari server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
    setTimeout(() => setRefreshing(false), 2000);
  };
  useEffect(() => {
    console.log('Updated selectedTab:', selectedTab);
    fetchItems();
  }, [selectedTab]);  // Log ketika selectedTab berubah



  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <FontAwesome5 name={item.icon || 'box'} size={24} color="#A6A6A6" />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Text style={styles.itemAmount}>{item.volume} {unit}</Text>
        </View>
      </View>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshing={refreshing} onRefresh={onRefresh} >
        <ImageBackground source={BiayaImage} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <FontAwesome name="chevron-left" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar Biaya</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateBiaya')}
          >
            <FontAwesome name="plus" size={22} color="white" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.footerCard}>
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  { backgroundColor: selectedTab === tab ? '#3576F7' : '#A3C6F7' },
                ]}
                onPress={() => {
                  console.log('Tab pressed:', tab);  // Cek apakah tab yang ditekan terdeteksi
                  setSelectedTab(tab);
                }}
                
                >
                <Text
                  style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.scrollView}>
            {loading ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Memuat data...
              </Text>
            ) : items.length > 0 ? (
              items.map((item) => renderItem({ item }))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Tidak ada data.
              </Text>
            )}
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
  },
  footerCard: {
    marginHorizontal: 0,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 50,
    top: -50,
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
  tabText: {
    color: '#fff',
    fontSize: 12,
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
