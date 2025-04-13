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

const BiayaImage = require('../../../assets/images/bg-img-top.png');

const CustomInput = ({ label, placeholder, value, onChangeText }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
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
    save="value"
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


export default function CreateBiaya() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    biayaNama: '',
    satuan: '',
    volume: '',
    project_id: '',
    kategori: '',
    harga: '',
  });

  
  const [proyekOptions, setProyekOptions] = useState([]);
  const [kategoriOption, setKategori] = useState([
    { label: 'Material', value: 'Material' },
    { label: 'Alat', value: 'Alat' },
    { label: 'Pekerjaan', value: 'Pekerjaan' },
    { label: 'Upah', value: 'Upah' },
]);

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

        // Set options for SelectList
        setProyekOptions(
          proyekResponse.data.data.map((item) => ({ key: item.id, value: item.project_name }))
        );

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
  
    if (!formData.project_id || !formData.biayaNama || !formData.satuan) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan biaya items',
        text2: 'Pastikan semua kolom yang wajib diisi sudah terisi.',
      });
      return;
    }
    if (!formData.kategori) {
      Toast.show({
          type: 'error',
          text1: 'Gagal menyimpan items',
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
  
      const formDataToSend = {
        title: formData.biayaNama,
        unit: formData.satuan,
        volume: parseFloat(formData.volume),
        project_id: parseInt(formData.project_id, 10),
        price: parseFloat(formData.harga),
        kategori: formData.kategori,
      };

      console.log('Data yang dikirim:', formDataToSend);
  
      const response = await axios.post(`${API_URL}/items/store`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Biaya items berhasil disimpan!',
          text2: 'Data items telah berhasil ditambahkan.',
        });
        navigation.navigate('Biaya');
      } else {
        throw new Error('Gagal menyimpan items');
      }
    } catch (error) {
      console.error('Error menyimpan data:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan items',
        text2: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan items.',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      >
        <ImageBackground source={BiayaImage} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Biaya')}>
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Biaya Items</Text>
        </ImageBackground>

        <View style={styles.formContainer}>
          <CustomSelectList1
            label="Proyek"
            setSelected={(key) => handleInputChange('project_id', key)}
            data={proyekOptions}
            placeholder="Pilih proyek..."
            save="key"
          />          
          <CustomInput
              label="Nama Items"
              placeholder="Masukkan Nama Items"
              value={formData.biayaNama}
              onChangeText={(text) => handleInputChange('biayaNama', text)}
            />
          <CustomInput
              label="Volume"
              placeholder="Volume"
              value={formData.volume}
              onChangeText={(text) => handleInputChange('volume', text)}
            />
            <CustomInput
              label="Satuan"
              placeholder="Satuan"
              value={formData.satuan}
              onChangeText={(text) => handleInputChange('satuan', text)}
            />

            <CustomSelectList
                label="Kategori"
                data={kategoriOption}
                selectedValue={formData.kategori} // Nilai terpilih
                setSelected={(value) => handleInputChange('kategori', value)}
            />         
            <CustomInput
              label="Harga"
              placeholder="Harga"
              value={formData.harga}
              onChangeText={(text) => handleInputChange('harga', text)}
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
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
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
    top: -50,
  },
  mb_15: {
    marginBottom: 15,
   },
  selectListBox: {
    backgroundColor: '#F1F3FA',
    borderColor: '#C4C4C4',
    borderRadius: 10,
    marginBottom: 15,
  },
  selectListDropdown: {
    backgroundColor: '#FFF',
    borderColor: '#C4C4C4',
  },
  label: {
    fontSize: 12,
    color: '#002D76',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 12,
    color: '#555555',
  },
  label: {
    fontSize: 12,
    color: '#002D76',
    fontWeight: 'bold',
    marginBottom: 10,
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
