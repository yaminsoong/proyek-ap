import React, { useEffect, useState } from 'react';
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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Ensure .env is properly configured
import axios from 'axios';
import Toast from 'react-native-toast-message'; 

const projectImage = require('../../../assets/images/bg-img-top.png');

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

const CustomSelectList = ({ label, data, setSelected }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <SelectList       
      setSelected={setSelected}
      data={data}
      save="value"
      searchPlaceholder="Cari..."
      boxStyles={styles.selectListBox}
      dropdownStyles={styles.selectListDropdown}
    />
  </View>
);
const CustomSelectList1 = ({ label, data, setSelected }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <SelectList       
      setSelected={setSelected}
      data={data}
      save="key"
      searchPlaceholder="Cari..."
      boxStyles={styles.selectListBox}
      dropdownStyles={styles.selectListDropdown}
    />
  </View>
);

export default function CreateProject() {
  const navigation = useNavigation();
  const [imageUris, setImageUris] = useState([]);
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    pemberiTugas: '',
    konsultanMK: '',
    kontraktor: '',
    project_type_id: '',
    spmk: '',
    kontrak: '',
    nilaiKontrak: '',
    addendum2: '',
    addendum4: '',
    image:'',
  });
  const [proyekTypeOptions, setProyekTypeOptions] = useState([]);
  const [pemberiTugasOption, setPemberiTugasOption] = useState([]);

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

        const proyekTypeResponse = await axios.get(`${API_URL}/proyek-type`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pemberiTugasResponse = await axios.get(`${API_URL}/pemberi-tugas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set options for SelectList
        setProyekTypeOptions(
          proyekTypeResponse.data.map((item) => ({ key: item.id, value: item.type_name }))
        );
        setPemberiTugasOption(
          pemberiTugasResponse.data.map((item) => ({ key: item.id, value: item.name }))
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

  // Fungsi untuk memilih gambar dari galeri
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      console.log('Image Picker Result:', result); // Debugging

      if (!result.canceled && result.assets.length > 0) {
        const newUri = result.assets[0].uri;
        setImageUris((prevUris) => [...prevUris, newUri]);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  // Fungsi untuk mengambil gambar menggunakan kamera
  const pickImageFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      console.log('Image Picker Result:', result); // Debugging
      if (!result.canceled) {
        const newUri = result.assets[0].uri;
        setImageUris((prevUris) => [...prevUris, newUri]);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fungsi untuk menyimpan data proyek
  const handleSave = async () => {
    console.log('Data Form:', formData);

    if (
      !formData.projectName ||
      !formData.location ||
      !formData.spmk ||
      !formData.kontrak || 
      !formData.kontraktor 
    ) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan proyek',
        text2: 'Pastikan semua kolom yang wajib diisi sudah terisi.',
      });
      return;
    }

    if (
      isNaN(formData.project_type_id) ||
      isNaN(formData.nilaiKontrak) ||
      isNaN(formData.addendum2) ||
      isNaN(formData.addendum4)
    ) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan proyek',
        text2: 'Nilai kontrak harus berupa angka yang valid.',
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

      const formDataToSend = new FormData();
  
      // Menambahkan data proyek
      formDataToSend.append('project_name', formData.projectName);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('task_provider', formData.pemberiTugas);
      formDataToSend.append('management_consultant', formData.konsultanMK);
      formDataToSend.append('contractor', formData.kontraktor);
      formDataToSend.append('proyek_type_id', formData.project_type_id);
      formDataToSend.append('spmk_number', formData.spmk);
      formDataToSend.append('contract_number', formData.kontrak);
      formDataToSend.append('contract_value', formData.nilaiKontrak);
      formDataToSend.append('addendum2_value', formData.addendum2);
      formDataToSend.append('addendum4_value', formData.addendum4);

      // Menambahkan data proyek
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Menambahkan file gambar ke FormData
      imageUris.forEach((uri, index) => {
        try {
            // Ambil nama file dari URI, asumsikan URI memiliki format yang benar
            const fileNameWithExtension = uri.split('/').pop(); // Ambil bagian terakhir dari URI sebagai nama file beserta ekstensi
            const fileName = fileNameWithExtension.split('.')[0]; // Ambil nama file tanpa ekstensi
            const fileType = fileNameWithExtension.split('.').pop(); // Ambil ekstensi file
    
            // Logging detail file
            console.log(`Processing image[${index}]:`);
            console.log(`URI: ${uri}`);
            console.log(`File Name: ${fileName}`);
            console.log(`File Type: ${fileType}`);
    
            // Menambahkan file ke FormData
            formDataToSend.append(`image[${index}]`, {
                uri,
                name: `${fileName}.${fileType}`, // Pastikan nama file dan ekstensi sesuai
                type: `image/${fileType}`,
            });
    
            // Logging setelah file ditambahkan
            console.log(`Image[${index}] added to FormData`);
        } catch (error) {
            console.error(`Error processing image[${index}]:`, error);
        }
    });

      const response = await axios.post(`${API_URL}/projects/store`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('Response:', response);

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Proyek berhasil disimpan!',
          text2: 'Data proyek telah berhasil ditambahkan.',
        });
        navigation.navigate('Proyek');
      } else {
        throw new Error('Gagal menyimpan proyek');
      }
    } catch (error) {
      console.error('Error menyimpan proyek:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan proyek',
        text2: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan proyek.',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      >

        <ImageBackground source={projectImage} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Proyek')}
          >
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Proyek</Text>
        </ImageBackground>

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <View style={styles.mb_15}>
                <Text style={styles.label}>Image Upload Preview</Text>

                <View style={styles.imageContainer}>
                {imageUris.length > 0 ? (
                  imageUris.map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      style={styles.image}
                      accessible={true}
                      accessibilityLabel={`Upload photo preview ${index + 1}`}
                    />
                  ))
                  ) : (
                    <FontAwesome style="padding:10px" name="image" size={50} color="gray" />
                  )}
                
                </View>
                
                {/* Ganti TouchableOpacity yang memanggil pickImage */}
                <TouchableOpacity style={[styles.iconButton, styles.marginBottom]} >
                  <Button title="Take a Picture" onPress={pickImageFromCamera} style={styles.buttonText}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, styles.marginBottom]}>
                  <Button title="Pilih dari Galeri" onPress={pickImageFromGallery} style={styles.buttonText}/>
                </TouchableOpacity>

            </View>
                    
            <CustomInput
              label="Nama Proyek"
              placeholder="Masukkan Nama Proyek"
              value={formData.projectName}
              onChangeText={(text) => handleInputChange('projectName', text)}
            />

            <CustomInput
              label="Lokasi"
              placeholder="Masukkan Lokasi"
              value={formData.location}
              onChangeText={(text) => handleInputChange('location', text)}
            />

            <CustomSelectList
              label="Pemberi Tugas"
              data={pemberiTugasOption}
              setSelected={(value) => handleInputChange('pemberiTugas', value)}
            />

            <CustomInput
              label="Konsultan Manajemen Konstruksi"
              placeholder="Masukkan Konsultan MK"
              value={formData.konsultanMK}
              onChangeText={(text) => handleInputChange('konsultanMK', text)}
            />

            <CustomInput
              label="Kontraktor"
              placeholder="Masukkan Kontraktor"
              value={formData.kontraktor}
              onChangeText={(text) => handleInputChange('kontraktor', text)}
            />
            <CustomSelectList1
              label="Tipe Proyek"
              data={proyekTypeOptions}
              setSelected={(key) => handleInputChange('project_type_id', key)}
            />            
            <CustomInput
              label="Nomor SPMK"
              placeholder="Masukkan Nomor SPMK"
              value={formData.spmk}
              onChangeText={(text) => handleInputChange('spmk', text)}
            />

            <CustomInput
              label="Nomor Kontrak"
              placeholder="Masukkan Nomor Kontrak"
              value={formData.kontrak}
              onChangeText={(text) => handleInputChange('kontrak', text)}
            />

            <CustomInput
              label="Nilai Kontrak (include PPN)"
              placeholder="Masukkan Nilai Kontrak"
              value={formData.nilaiKontrak}
              onChangeText={(text) => handleInputChange('nilaiKontrak', text)}
            />

            <CustomInput
              label="Nilai Kontrak Addendum 2 (include PPN)"
              placeholder="Masukkan Nilai Addendum 2"
              value={formData.addendum2}
              onChangeText={(text) => handleInputChange('addendum2', text)}
            />

            <CustomInput
              label="Nilai Kontrak Addendum 4 (include PPN)"
              placeholder="Masukkan Nilai Addendum 4"
              value={formData.addendum4}
              onChangeText={(text) => handleInputChange('addendum4', text)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      
      </ScrollView>
    </View>
  );
}

const windowWidht = Dimensions.get("window").width; // Untuk dimension mengikuti device
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    
  },
  scrollContainer: {
    flexGrow: 1, // Menjamin konten bisa digulir jika lebih besar dari layar
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  image: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  header: {
    width: windowWidht,
    height: windowHeight * 0.33,
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
    borderRadius: 30,
    top: -50,
    flex: 1,
  },
   // Other styles...
  buttonText: {
    color: '#fff', // Warna teks
    fontSize: 10,
    fontFamily: 'Rubik_400Regular', // Ganti dengan font lain jika diperlukan
    fontWeight: 'bold',
  },
  marginBottom: {
    marginBottom: 5,
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
