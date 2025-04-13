import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  ScrollView, 
  Dimensions, 
  FlatList,
  RefreshControl,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle 
} from 'react-native-reanimated';
import { API_URL, API_MAIN } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-swiper';
// Constants for assets
const projectImage = require('../../../assets/images/bg-img-top_transparan.png');
const imgProject = { uri: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg' };

const tabLabels = {
  'LULUS': 'Lulus',  // 'In Progress' maps to 'in_progress'
  'GAGAL': 'Gagal',  // 'In Progress' maps to 'in_progress'
};


const tabs = Object.keys(tabLabels);
// const tabs = ['In Progress', 'Completed', 'Reject', 'Accept'];
  
const MutuScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Lulus');
  const [inspeksiMutu, setMutu] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular,
    Rubik_500Medium
  });
  // Fungsi untuk mengubah tab
  const handleTabChange = (tab) => {
    setSelectedTab(tabLabels[tab]); // Pastikan label sesuai dengan API
  };

  useEffect(() => {
    // console.log("Updated inspeksiMutu:", inspeksiMutu);
    const fetchMutu = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // console.log('Token:', token);

        if (!token) {
          // console.error('Token not found!');
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Authentication Error',
            text2: 'Token not found. Please log in again.',
          });
          navigation.navigate('Login');
          return;
        }

        const allMutu = [];

        if (selectedTab === 'Lulus') {
          const response = await axios.get(`${API_URL}/inspeksi-mutu`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          allMutu.push({
            hasil_uji: 'Lulus',
            inspeksi_mutu: response.data.data.data,
          });
            // console.log('s:');
          setLoading(false);
        } else {
            // console.log('ss:');

          for (const status of tabs) {
            const response = await axios.get(`${API_URL}/inspeksi-mutu?hasil_uji=${tabLabels[status]}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            allMutu.push({
                hasil_uji: tabLabels[status],
                inspeksi_mutu: response.data.data,
            });
          }
        }

        setMutu(allMutu);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized! Please log in again.');
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Authentication Error',
            text2: 'Invalid token. Please log in again.',
          });
          navigation.navigate('Login');
        } else {
          console.error('Error fetching inspeksi mutu:', error);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Server Error',
            text2: 'Failed to fetch project data.',
          });
        }
      }
    };

    fetchMutu();
  }, [selectedTab]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }
  const filteredData = inspeksiMutu.find((p) => p.hasil_uji === selectedTab)?.inspeksi_mutu || [];

  const renderItem = ({ item }) => {
      // Validasi item.image, pastikan item.image adalah string yang bisa diproses dengan split
      let images = [];

      if (typeof item.proyek.image === 'string') {
        images = item.proyek.image.split(',');  // Pisahkan jika berupa string dengan koma
      } else if (Array.isArray(item.proyek.image)) {
        images = item.proyek.image;  // Jika sudah berupa array, langsung gunakan
      }
      // Menampilkan gambar pertama
      const imageUrl = images.length > 0 ? `${API_MAIN}/storage/project/image/${images[0]}` : null;
      
      return (
        <View key={item.proyek.id} style={styles.card}>
            {/* Menampilkan gambar pertama jika ada */}
            {imageUrl ? (
                <Image
                source={{ uri: imageUrl }}
                style={styles.projectImage}
                resizeMode="cover"
                />
            ) : (
                // Tampilkan gambar default jika tidak ada gambar
                <Image source={imgProject} style={styles.projectImage} resizeMode="cover" />
            )}
            <View style={styles.cardDetails}>
                <Text style={styles.projectTitle}>{item.proyek.project_name}</Text>
                <View style={styles.projectInfo}>
                    <FontAwesome name="building" size={16} color="#ddd" />
                    <Text style={styles.projectInfoText}> {item.proyek.type_name}</Text>
                </View>
                <Text style={styles.projectLocation}>{item.proyek.location}</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => navigation.navigate('CreateInspeksi',{ proyek_id: item.proyek.id })}
                    >
                        <Text style={styles.acceptButtonText}>+ Inspeksi</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptButton}
                        onPress={() => navigation.navigate('Koreksi')}
                        >
                        <Text style={styles.acceptButtonText}>+ Koreksi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        );
    };
  


  return (
    <View style={styles.container}>
       <FlatList 
          ListHeaderComponent={
            <>
              {/* Header */}
              <ImageBackground source={projectImage} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                  <FontAwesome name="chevron-left" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Management Mutu</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateInspeksi')}>
                  {/* <FontAwesome name="plus" size={22} color="white" /> */}
                </TouchableOpacity>
              </ImageBackground>
              
              {/* Content */}
              <View style={styles.footerCard}>
                <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>

                  {/* Tabs */}
                  <View style={styles.tabs}>
                    {tabs.map(tab => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.tabButton,
                          { backgroundColor: selectedTab === tabLabels[tab] ? '#3576F7' : '#fff' },                        ]}
                        onPress={() => handleTabChange(tab)}
                      >
                        <Text style={[
                            styles.tabText,
                            { color: selectedTab === tabLabels[tab]  ? '#fff' : '#000' }
                            ]}>
                            {tabLabels[tab]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            
          </>
            }
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}            
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              !loading && <Text style={{ textAlign: 'center', marginTop: 10 }}>No inspeksi-mutu available.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
    </View>
  );
};

export default MutuScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFF8',
    // position: "absolute",
    
  },
  footerCard: {
    marginHorizontal: 20,
    marginVertical: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    position: "relative",
    backgroundColor: '#fff',
    top: -70,
  },
  header: {
    width: windowWidth,
    height: windowHeight * 0.32,
    justifyContent: 'center',
    alignItems: 'center',

  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    top: -70,
  },

  backButton: {
    position: 'absolute',
    top: 50,
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
    borderRadius: 30,
    // padding: 5,
    height:60,
    width:390,
    // backgroundColor: '#ddd',

  },
  tabButton: {
    flex: 1,
    // padding: 10,
    margin: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',

  },
  activeTab: {
    backgroundColor: '#3576F7',
  },
  tabText: {
    color: '#000',
    fontSize: 12,
    fontFamily: "Rubik_500Medium",
  },
  activeTabText: {
    color: '#fff',
  },
  projectList: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  projectImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
  },
  cardDetails: {
    flex: 1,
    marginLeft: 15,
  },
  projectTitle: {
    fontSize: 15,
    fontFamily: "Rubik_700Bold",
    color: '#333',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    lineHeight: 15,
  },
  projectInfoText: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
    fontFamily: "Rubik_400Regular",
    marginLeft: 5, // Jarak antara ikon dan teks
    lineHeight: 15,
  },
  projectLocation: {
    fontSize: 10,
    color: '#888',
    fontFamily: "Rubik_400Regular",
    lineHeight: 15,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rejectButton: {
    backgroundColor: '#F36F6F',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 30,
  },
  rejectButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    fontFamily: "Rubik_400Regular",
  },
  acceptButton: {
    backgroundColor: '#3576F7',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 6,
  },
  acceptButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    fontFamily: "Rubik_400Regular",
  },
});
