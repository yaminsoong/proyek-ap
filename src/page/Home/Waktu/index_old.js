import React, { useState, useEffect,useCallback,useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ToastAndroid, ScrollView, ImageBackground, Dimensions, FlatList, RefreshControl,Modal  } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
// import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL, API_MAIN } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const schedulesImage = require('../../../assets/images/bg-img-top.png'); 

export default function ScheduleScreen() {
  const navigation = useNavigation(); 
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(''); 
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');  // Default 'All' tab
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(null); // Tanggal awal yang dipilih
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const tabLabels = {
    'All': 'All',  
    'Meeting': 'Meeting',
    'Evaluasi': 'Evaluasi',
    'Pekerjaan': 'Pekerjaan',
    'Pembongkaran': 'Pembongkaran',
    'Kerjasama': 'Kerjasama',
  };
  const tabs = Object.keys(tabLabels);

  const handleSelectDate = (selectedDate) => {
    console.log("Selected Date:", selectedDate);

    setSelectedDate(selectedDate);
  };

  // Fungsi fetchSchedules dipindahkan ke luar useEffect
  // const fetchSchedules = async () => {
  const fetchSchedules = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Authentication Error',
          text2: 'Token not found. Please log in again.',
        });
        // ToastAndroid.show('Token tidak ditemukan. Harap login ulang.', ToastAndroid.SHORT);

        navigation.navigate('Login');
        return;
      }

      setLoading(true);

      let url = `${API_URL}/schedules`;
      // Tambahkan filter tab jika bukan "All"
      const queryParams = [];
      if (selectedTab !== 'All') {
        queryParams.push(`type=${tabLabels[selectedTab]}`);
      }

      // Tambahkan filter start_date jika ada
      if (selectedDate) {
        queryParams.push(`start_date=${selectedDate}`);
      }

      // Gabungkan semua query params
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("response:",response.data);
      console.log("url:",url);

      // Pastikan schedules adalah array
      const scheduleData = response.data.data || response.data; 
      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Authentication Error',
          text2: 'Invalid token. Please log in again.',
        });
        navigation.navigate('Login');
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Server Error',
          text2: 'Failed to fetch schedules data.',
        });
      }
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
    fetchSchedules();
  }, [selectedTab,startDate, selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedules().finally(() => setRefreshing(false));
  };

  // const [headerTitle, setHeaderTitle] = useState(
  //   new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  // );
  const headerTitle = useMemo(() => 
    new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  , [selectedMonth, selectedYear]);
  

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.task_name}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.timeRow}>
        <Text style={styles.eventTime}>
          {item.start_date ? new Date(item.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
          {' - '}
          {item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </Text>

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
      <FlatList 
          ListHeaderComponent={
            <>
            <ImageBackground source={schedulesImage} style={styles.header}>
            <View style={styles.overlay}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
              >
                <FontAwesome name="chevron-left" size={22} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setOpen(true)}>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateWaktu')}
              >
                <FontAwesome name="plus" size={22} color="white" />
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
              {Array.from({ length: 7 }).map((_, index) => {
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + index);
                const formattedDate = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateItem, selectedDate === formattedDate ? styles.activeDateItem : null]}
                    onPress={() => handleSelectDate(formattedDate)}
                  >
                    <Text style={[styles.dateText, selectedDate === formattedDate ? styles.activeDateText : null]}>
                      {currentDate.getDate().toString().padStart(2, '0')}
                    </Text>
                    <Text style={[styles.dayText, selectedDate === formattedDate ? styles.activeDateText : null]}>
                      {currentDate.toLocaleDateString('id-ID', { weekday: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              </ScrollView>
            </View>

            </ImageBackground>

            <View style={styles.footerCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
                {tabs.map(tab => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabButton, { backgroundColor: selectedTab === tab ? '#3576F7' : '#fff' }]}
                    onPress={() => setSelectedTab(tab)}
                  >
                    <Text
                      style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            </>
          }
          data={Array.isArray(schedules) ? (selectedTab === 'All' ? schedules : schedules.filter((item) => item.type === selectedTab)) : []}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loading && <Text style={{ textAlign: 'center', marginTop: 10 }}>No schedule available.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          />
    </View>
  );
}

const windowWidht = Dimensions.get("window").width; 
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  footerCard: {
    marginHorizontal: 0,
    paddingVertical: 0,
    paddingTop: 40,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    top: -40,
    position: 'relative',
    backgroundColor: '#F8F9FB',
  },
  header: {
    width: windowWidht,
    height: windowHeight * 0.35,
    justifyContent: 'left',
    alignItems: 'left',
    paddingTop: 25,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 30,
    top: 80,
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
    paddingHorizontal: 15,
    marginTop: 100,
    alignSelf: 'center',
  },
  dateItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10,
    height: 60,
    alignItems: 'center',
  },
  activeDateItem: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dayText: {
    fontSize: 12,
    color: '#6D7E90',
  },
  activeDateText: {
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 50,
    marginHorizontal: 20,
    marginTop: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginRight: 10,
  },
  tabText: {
    color: '#6D7E90',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scheduleItem: {
    marginBottom: 20,
    marginHorizontal: 15,
    position: 'relative',
    paddingTop: 15,
  },

  eventCard: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6D7E90',
    marginBottom: 15,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    color: '#3576F7',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
