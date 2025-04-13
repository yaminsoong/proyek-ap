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
import { useSharedValue} from 'react-native-reanimated';
import { API_URL, API_MAIN } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Constants for assets
const projectImage = require('../../../assets/images/bg-img-top.png');
const imgProject = { uri: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg' };

const tabLabels = {
  'All List': 'all',  // 'In Progress' maps to 'in_progress'
  'In Progress': 'in_progress',  // 'In Progress' maps to 'in_progress'
  'Completed': 'completed'
};


const tabs = Object.keys(tabLabels);
// console.log('tabs:', tabs);
// const tabs = ['In Progress', 'Completed', 'Reject', 'Accept'];

const ProjectsScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('All List');
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollY = useSharedValue(0);


  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular,
    Rubik_500Medium
  });

  useEffect(() => {
    const fetchProjects = async () => {
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

        const allProjects = [];

        if (selectedTab === 'All List') {
          const response = await axios.get(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          allProjects.push({
            status: 'All List',
            projects: response.data.data,
          });
          setLoading(false);
        } else {
          for (const status of tabs) {
            const response = await axios.get(`${API_URL}/projects?status=${tabLabels[status]}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            allProjects.push({
              status,
              projects: response.data.data,
            });
          }
        }

        setProjects(allProjects);
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
          console.error('Error fetching projects:', error);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Server Error',
            text2: 'Failed to fetch project data.',
          });
        }
      }
    };

    fetchProjects();
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

  const renderItem = ({ item }) => {
      // Validasi item.image, pastikan item.image adalah string yang bisa diproses dengan split
      let images = [];

      if (typeof item.image === 'string') {
        images = item.image.split(',');  // Pisahkan jika berupa string dengan koma
      } else if (Array.isArray(item.image)) {
        images = item.image;  // Jika sudah berupa array, langsung gunakan
      }
      // Menampilkan gambar pertama
      const imageUrl = images.length > 0 ? `${API_MAIN}/storage/project/image/${images[0]}` : null;
      
      return (
        <View key={item.id} style={styles.card}>
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
          <Text style={styles.projectTitle}>{item.project_name}</Text>
          <View style={styles.projectInfo}>
            <FontAwesome name="building" size={16} color="#ddd" />
            <Text style={styles.projectInfoText}> {item.type_name}</Text>
          </View>
          <Text style={styles.projectLocation}>{item.location}</Text>
          {/* <View style={styles.buttons}>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View> */}
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
                <Text style={styles.headerTitle}>Project List</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateProyek')}>
                  <FontAwesome name="plus" size={22} color="white" />
                </TouchableOpacity>
              </ImageBackground>
              
              {/* Content */}
              <View style={styles.footerCard}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                  {/* Tabs */}
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
                </ScrollView>
              </View>
            
          </>
            }
            data={projects.find((p) => p.status === selectedTab)?.projects || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              !loading && <Text style={{ textAlign: 'center', marginTop: 10 }}>No projects available.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
    </View>
  );
};

export default ProjectsScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFF8',
    // position: "absolute",
    
  },
  footerCard: {
    marginHorizontal: 0,
    marginVertical: -40,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 30,
    position: "relative",
    backgroundColor: '#F2EFF8',
    top: -20,

  },
  header: {
    width: windowWidth,
    height: windowHeight * 0.33,
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
    padding: 5,
  },
  tabButton: {
    flex: 1,
    padding: 10,
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
  projectList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,

  },
  projectImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardDetails: {
    flex: 1,
    marginLeft: 10,
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
  },
  acceptButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    fontFamily: "Rubik_400Regular",
  },
});
