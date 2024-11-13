import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ImageBackground, Dimensions, FlatList } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

const projectImage = require('../../../assets/images/bg-img-top.png'); // Background image

const scheduleData = [
  {
    id: 1,
    title: 'Start Proyek',
    description: 'Proyek Pertama Mulai Tgl\n01 September 2024 - 01 Maret 2025',
    time: '19.00 AM',
    icon: 'project',
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Meeting',
    description: '',
    time: '19.00 AM',
    icon: 'group',
    type: 'meeting',
  },
  {
    id: 3,
    title: 'Pemasangan Batu',
    description: 'Pemasangan batu pertama',
    time: '19.00 AM',
    icon: 'work',
    type: 'job',
  },
  {
    id: 4,
    title: 'Evaluasi',
    description: '',
    time: '19.00 AM',
    icon: 'assessment',
    type: 'evaluation',
  },
];

export default function ScheduleScreen() {
  const navigation = useNavigation(); // Initialize navigation
  const tabs = ['Meeting', 'Evaluasi', 'Pekerjaan', 'Pembongkaran', 'Kerjasama'];

  const [selectedTab, setSelectedTab] = useState('Meeting');
  const [selectedDate, setSelectedDate] = useState('01 Mon'); // State untuk tanggal yang dipilih

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.timeLine} />
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.eventTime}>{item.time}</Text>
          <View style={styles.iconRow}>
            <MaterialIcons name="group" size={18} color="#6D7E90" />
            <MaterialIcons name="message" size={18} color="#6D7E90" />
            <MaterialIcons name="settings" size={18} color="#6D7E90" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Tanggal */}
      <ImageBackground source={projectImage} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome name="chevron-left" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateWaktu')}
        >
          <FontAwesome name="plus" size={22} color="white" />
        </TouchableOpacity>

        {/* Tanggal di tengah */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
          {['01 Mon', '02 Tue', '03 Wed', '04 Thu', '05 Fri', '06 Sat', '07 Sun'].map((date, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dateItem, 
                selectedDate === date ? styles.activeDateItem : null
              ]}
              onPress={() => setSelectedDate(date)} // Set tanggal yang dipilih
            >
              <Text style={[styles.dateText, selectedDate === date ? styles.activeDateText : null]}>
                {date.split(' ')[0]}
              </Text>
              <Text style={[styles.dayText, selectedDate === date ? styles.activeDateText : null]}>
                {date.split(' ')[1]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ImageBackground>

      {/* Tabs */}
      <View style={styles.footerCard}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                { backgroundColor: selectedTab === tab ? '#3576F7' : '#A3C6F7' }, // Warna biru saat aktif, biru muda saat tidak aktif
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List Jadwal */}
        <FlatList
          data={scheduleData}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scheduleList}
          showsVerticalScrollIndicator={false} // Menyembunyikan indikator scroll vertikal
        />

      </View>
      </ScrollView>
    </View>
  );
}

const windowWidht = Dimensions.get("window").width; // Untuk dimension mengikuti device
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  footerCard: {
    marginHorizontal: 0,
    paddingVertical: 40,
    borderRadius: 50,
    top: -40,
    position: "relative",
    backgroundColor: '#F2EFF8',
  },
  header: {
    width: windowWidht,
    height: windowHeight * 0.33,
    justifyContent: 'left',
    alignItems: 'left',
    paddingTop: 20,

  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    left: 20,
    top: 70,
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
  dateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 90,
    alignSelf: 'center', // Menempatkan di tengah
  },
  dateItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    right:5,
    height: 60,
    alignItems: 'center',
  },
  activeDateItem: {
    backgroundColor: '#000', // Background hitam untuk tanggal aktif
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  dayText: {
    fontSize: 12,
    color: '#6D7E90',
  },
  activeDateText: {
    color: '#fff', // Warna putih untuk teks tanggal aktif
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 0,
  },
  tabButton: {
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
  scheduleList: {
    paddingHorizontal: 20,
    marginVertical:20,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeLine: {
    width: 2,
    backgroundColor: '#4A90E2',
    marginHorizontal: 10,
    borderRadius: 1,
    height: '100%',
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 12,
    color: '#6D7E90',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
});
