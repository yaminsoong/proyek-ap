import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Dimensions, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

const projectImage = require('../../../assets/images/bg-img-top.png'); // Background image
const imgProject = { uri: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg' };
export default function App() {
  const navigation = useNavigation(); // Initialize navigation
  const [selectedTab, setSelectedTab] = useState('In Progress');

  const tabs = ['In Progress', 'Done', 'Reject', 'Accept'];

  const projects = [
    {
      id: 1,
      title: 'Proyek Kota Satu Selesai',
      location: 'MT Haryono St No.1xx 20, RT.4/RW.1, Cawang, Kramat Jati, East Jakarta City, Jakarta 13350',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Proyek Kota Satu Selesai',
      location: 'MT Haryono St No.1xx 20, RT.4/RW.1, Cawang, Kramat Jati, East Jakarta City, Jakarta 13350',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Proyek Kota Satu Selesai',
      location: 'MT Haryono St No.1xx 20, RT.4/RW.1, Cawang, Kramat Jati, East Jakarta City, Jakarta 13350',
      status: 'In Progress',
    },
  ];

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <Image source={imgProject} style={styles.projectImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectInfo}>Apartement</Text>
        <Text style={styles.projectLocation}>{item.location}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ImageBackground source={projectImage} style={styles.header}>
        <TouchableOpacity style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome name="chevron-left" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Proyek</Text>
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

        {/* Project Cards */}
        <FlatList
          data={projects}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()} // Use string IDs for FlatList
          contentContainerStyle={styles.projectList} // Style the FlatList container
        />
      </View>
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
  projectList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  projectInfo: {
    fontSize: 12,
    color: '#888',
    marginVertical: 4,
    fontFamily: "Rubik_400Regular",
  },
  projectLocation: {
    fontSize: 12,
    color: '#556',
    fontFamily: "Rubik_400Regular",
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
