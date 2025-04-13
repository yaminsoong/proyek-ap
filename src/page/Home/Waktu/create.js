import React, { useState, useEffect } from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import { SelectList } from 'react-native-dropdown-select-list';
import { API_URL } from '@env'; // Ensure .env is properly configured
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const WaktuImage = require('../../../assets/images/bg-img-top.png');

const CustomInput = ({ label, placeholder, value, onChangeText, onPress }) => (
  <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          editable={false} // Non-editable, just for displaying the selected date
        />
      </TouchableOpacity>
    </View>
);

const CustomInput1 = ({ label, placeholder, value, onChangeText }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input1}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const CustomSelectList = ({ label, data, selectedValue, setSelected }) => (
<View>
  <Text style={styles.label}>{label}</Text>
  <SelectList
    setSelected={setSelected}
    data={data}
    save="key"
    searchPlaceholder="Cari..."
    boxStyles={styles.selectListBox}
    dropdownStyles={styles.selectListDropdown}
    selected={selectedValue} // Pastikan nilai terpilih ditampilkan
  />
</View>
);

const CustomSelectList1 = ({ label, data, selectedValue, setSelected }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <SelectList
      setSelected={setSelected}
      data={data}
      save="key"
      searchPlaceholder="Cari..."
      boxStyles={styles.selectListBox}
      dropdownStyles={styles.selectListDropdown}
      selected={selectedValue} // Pastikan nilai terpilih ditampilkan
    />
  </View>
);

const CustomSelectList2 = ({ label, data, selectedValue, setSelected }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <SelectList
      setSelected={setSelected}
      data={data}
      save="value"
      searchPlaceholder="Cari..."
      boxStyles={styles.selectListBox}
      dropdownStyles={styles.selectListDropdown}
      selected={selectedValue} // Pastikan nilai terpilih ditampilkan
    />
  </View>
);

const CustomTextArea = ({ label, value, onChangeText, placeholder }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
    <TextInput
      style={{
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 10,
        textAlignVertical: 'top', // Agar teks dimulai dari atas
      }}
      multiline={true}
      numberOfLines={4}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function CreateWaktu() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: '',
    project_id: '',
    assign_Id: '',
    description: ''
  });
  const [typeOption, setTypeOption] = useState([
    { label: 'Meeting', value: 'Meeting' },
    { label: 'Pekerjaan', value: 'Pekerjaan' },
    { label: 'Pembongkaran', value: 'Pembongkaran' },
    { label: 'Kerjasama', value: 'Kerjasama' },
]);
  
  const [proyekOptions, setProyekOptions] = useState([]);
  const [assignOption, setAssignOption] = useState([]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(selectedDate);
      
      setStartDate(selectedDate);
      handleInputChange('startDate', formattedDate);
    }
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(selectedDate);
      
      setEndDate(selectedDate);
      handleInputChange('endDate', formattedDate);
    }
  };
  

  const showDatepicker = (isStartDate) => {
    if (isStartDate) {
      setShowStartDatePicker(true);
    } else {
      setShowEndDatePicker(true);
    }
  };


  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  // Fetch data for proyekType and kontraktor
  useEffect(() => {

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Toast.show({
            type: 'error',
            text1: 'Kesalahan Autentikasi',
            text2: 'Token tidak ditemukan. Harap login kembali.',
          });
          navigation.navigate('Login');
          return;
        }

        const proyekResponse = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Set options for SelectList
        setProyekOptions(
          proyekResponse.data.data.map((item) => ({ key: item.id, value: item.project_name }))
        );

        // Set options for SelectList only if data exists
        // Periksa apakah data ada
        if (userResponse.data && userResponse.data.data) {
          const userData = userResponse.data.data;

          // Cek apakah data merupakan array atau objek
          if (Array.isArray(userData)) {
            // Jika data berupa array, gunakan map untuk mengonversi setiap elemen
            setAssignOption(userData.map((item) => ({ key: Number(item.id), value: item.name })));
          } else {
            // Jika hanya satu data pengguna, masukkan sebagai array
            setAssignOption([{ key: userData.id, value: userData.name }]);
          }
        } else {
          console.error('No data found');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show({
          type: 'error',
          text1: 'Gagal Memuat Data',
          text2: 'Terjadi kesalahan saat mengambil data dari server.',
        });
      }
    };

    fetchData();
  }, []);
  

  // Fungsi untuk menyimpan data proyek
  const handleSave = async () => {
    console.log('Data Form:', formData);
  
      if (!formData.project_id || !formData.startDate || !formData.endDate || !formData.description) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Gagal menyimpan schedule',
          text2: 'Pastikan semua kolom yang wajib diisi sudah terisi.',
        });
        return;
      }
      if (!formData.assign_Id) {
          Toast.show({
              type: 'error',
              text1: 'Gagal menyimpan schedule',
              text2: 'Kategori wajib diisi.',
          });
          return;
      }
      
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan!');
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Kesalahan Autentikasi',
          text2: 'Token tidak ditemukan. Harap login kembali.',
        });
        navigation.navigate('Login');
        return;
      }

      const formatDateTime = (dateString) => {
        // Pastikan format tanggal sesuai dengan yang diharapkan (DD MMM YYYY)
        const formattedDate = moment(dateString, 'DD MMM YYYY').format('YYYY-MM-DD HH:mm:ss');
      
        // Memeriksa jika konversi berhasil
        if (!moment(formattedDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
          throw new Error('Tanggal tidak valid');
        }
      
        return formattedDate;
      };
      
      // Contoh penggunaan
      const formDataToSend = {
        task_name: formData.taskName,
        start_date: formatDateTime(formData.startDate),
        end_date: formatDateTime(formData.endDate),
        project_id: parseInt(formData.project_id, 10),
        type: formData.type,
        description: formData.description,
        user_id: formData.assign_Id,
      };

      console.log('Data yang dikirim:', formDataToSend);
  
      const response = await axios.post(`${API_URL}/schedules/store`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Schedule berhasil disimpan!',
          text2: 'Data schedule telah berhasil ditambahkan.',
        });
        navigation.navigate('Waktu');
      } else {
        throw new Error('Gagal menyimpan schedule');
      }
    } catch (error) {
      console.error('Error menyimpan data:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan schedule',
        text2: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan schedule.',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      >
        <ImageBackground source={WaktuImage} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Waktu')}>
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Schedule</Text>
        </ImageBackground>

        <View style={styles.formContainer}>
          
          <CustomInput1
              label="Nama Schedule"
              placeholder="Masukkan Nama Schedule"
              value={formData.biayaNama}
              onChangeText={(text) => handleInputChange('taskName', text)}
            />

          <CustomInput
            label="Start Date"
            placeholder="Start Date"
            value={formData.startDate}
            onPress={() => showDatepicker(true)}
          />
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <CustomInput
            label="End Date"
            placeholder="End Date"
            value={formData.endDate}
            onPress={() => showDatepicker(false)}
          />
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <CustomSelectList1
            label="Proyek"
            setSelected={(key) => handleInputChange('project_id', key)}
            data={proyekOptions}
            placeholder="Pilih proyek..."
            save="key"
          />          

          <CustomSelectList
            label="Assign"
            data={assignOption}
            selectedValue={formData.assign_Id} // Nilai terpilih
            setSelected={(key) => handleInputChange('assign_Id', key)}
            save="key"
          />        
          <CustomSelectList2
            label="Kategori"
            data={typeOption}
            selectedValue={formData.type} // Nilai terpilih
            setSelected={(value) => handleInputChange('type', value)}
          />         
 
          <CustomTextArea
            label="Description"
            placeholder="Enter description here..."
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}> 
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    width: windowWidth,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center', // perbaiki 'alignschedule' menjadi 'alignItems'
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#F7F8FC',
    marginHorizontal: 0,
    paddingVertical: 40,
    paddingHorizontal: 40,
    borderRadius: 50,
    top: -40,
  },
  mb_15: {
    marginBottom: 15,
   },
   selectListBox: {
    backgroundColor: '#F1F3FA',
    borderColor: '#ccc',
    borderRadius: 15,
    marginBottom: 15,
  },
  selectListDropdown: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
  },
  label: {
    fontSize: 12,
    color: '#002D76',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F1F3FA',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 12,
    color: '#555555',
  },
  input1: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 12,
    color: '#555555',
  },
  saveButton: {
    backgroundColor: '#3576F7',
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
