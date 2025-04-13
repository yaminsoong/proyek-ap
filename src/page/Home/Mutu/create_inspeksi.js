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
import { useNavigation, useRoute } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Ensure .env is properly configured
import axios from 'axios';
import Toast from 'react-native-toast-message'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';


const inspeksiImage = require('../../../assets/images/bg-img-top.png');
const imgInspeksi = { uri: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg' };

const formatDateTime = (dateString) => {
  // Pastikan format tanggal sesuai dengan yang diharapkan (DD MMM YYYY)
  const formattedDate = moment(dateString, 'DD MMM YYYY').format('YYYY-MM-DD HH:mm:ss');

  // Memeriksa jika konversi berhasil
  if (!moment(formattedDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
    throw new Error('Tanggal tidak valid');
  }

  return formattedDate;
};

const CustomInput = ({ label, value, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity onPress={onPress} style={styles.input}>
      <Text style={styles.inputText}>
        {value ? new Date(value).toLocaleDateString() : "Pilih Tanggal"}
      </Text>
    </TouchableOpacity>
  </View>
);

const CustomInput1 = ({ label, placeholder, value, onChangeText }) => (
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
      save="key"
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

export default function CreateInspeksi() {
  const route = useRoute(); // 🔥 Panggil useRoute() di luar useEffect
  const { proyek_id } = route.params || {}; // Pastikan proyek_id aman dari undefined
  const [tanggalInspeksi, setTanggalInspeksi] = useState(new Date());
  const navigation = useNavigation();
  const [imageUris, setImageUris] = useState([]);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    proyek_id: proyek_id,
    inspektor_id: '',
    tanggal_inspeksi: new Date(),
    jenis_pekerjaan: '',
    standar: '',
    spesifikasi: '',
    metode_pengujian: '',
    hasil_uji: '',
    catatan: '',
    dokumen: null,
  });

  const [hasilUji, setHasilUji] = useState(null);
  const data = [
    { key: "Lulus", value: "Lulus" },
    { key: "Gagal", value: "Gagal" },
  ];

  const getInspektorId = async () => {
    const id = await AsyncStorage.getItem('inspektor_id');
    setFormData({ ...formData, inspektor_id: id });
  };  

  // Fetch data for proyekType and kontraktor
  useEffect(() => {
    getInspektorId();

    if (!proyek_id) {
      Toast.show({
        type: 'error',
        text1: 'Kesalahan Data',
        text2: 'ID Proyek tidak ditemukan.',
      });
      return;
    }

    const getProjectDetails = async () => {
            try {
                setLoading(true);

                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error("Token tidak ditemukan! Pastikan sudah login.");
                }

                const url = `${API_URL}/projects/?id=${proyek_id}`;
                console.log("Fetching URL:", url); // Debug URL
                console.log("Token:", token); // Debug token

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                console.log('respons:', response); // Debug token

                setProject(response.data);

            } catch (err) {
                console.error("Error fetching project details:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false);
            }
        };

        getProjectDetails();
  }, [proyek_id]);


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Sembunyikan DatePicker
    setDate(currentDate); // Update state `date`
    
    // Simpan ke formData agar bisa divalidasi
    handleInputChange('tanggal_inspeksi', currentDate.toISOString().split('T')[0]);
  };


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

  // Fungsi untuk memilih dokumen (PDF)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Bisa diubah jika hanya butuh PDF
        copyToCacheDirectory: true,
      });
  
      if (result.canceled) return;
  
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop();
      const fileType = fileName.split('.').pop();
      const mimeType = fileType === 'pdf' ? 'application/pdf' : `image/${fileType}`;
  
      handleInputChange('dokumen', { uri: fileUri, name: fileName, type: mimeType });
      console.log('Dokumen dipilih:', { uri: fileUri, name: fileName, type: mimeType });
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fungsi untuk menyimpan data proyek
  const handleSave = async () => {

        // Pastikan hasil_uji tersimpan ke formData sebelum validasi
      formData.hasil_uji = hasilUji;

      // Validasi input wajib
      const requiredFields = [
        'inspeksiName', 'tanggal_inspeksi', 'standar', 'dokumen', 
        'catatan', 'hasil_uji', 'jenis_pekerjaan', 'metode_pengujian', 'spesifikasi'
      ];

      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Gagal menyimpan data inspeksi',
          text2: `Kolom wajib tidak boleh kosong: ${emptyFields.join(', ')}`,
        });
        return;
      }


    try {
      // Ambil token autentikasi
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

      // Persiapkan FormData
      const formDataToSend = new FormData();
      const inspektorId = await AsyncStorage.getItem('inspektor_id');
      if (!inspektorId) {
        console.error("Inspektor ID tidak ditemukan!");
        return;
      }
      // Tambahkan data inspeksi
      formDataToSend.append('inspektor_id', inspektorId); // Tambahkan ID Inspektor
      formDataToSend.append('proyek_id', proyek_id);
            formDataToSend.append('inspeksi_name', formData.inspeksiName);
      if (formData.tanggal_inspeksi) {
        const tanggalInspeksi = new Date(formData.tanggal_inspeksi).toISOString().split('T')[0];
        formDataToSend.append('tanggal_inspeksi', tanggalInspeksi);
      } else {
        console.error("Error: tanggal_inspeksi tidak boleh kosong");
      }
      formDataToSend.append('jenis_pekerjaan', formData.jenis_pekerjaan);
      formDataToSend.append('standar', formData.standar);
      formDataToSend.append('spesifikasi', formData.spesifikasi);
      formDataToSend.append('metode_pengujian', formData.metode_pengujian);
      formDataToSend.append('hasil_uji', formData.hasil_uji);
      formDataToSend.append('catatan', formData.catatan);

      // Tambahkan dokumen (PDF atau gambar)
      if (formData.dokumen && formData.dokumen.uri) {
        const { uri, name, type } = formData.dokumen;
        formDataToSend.append('dokumen[]', {
          uri,
          name,
          type,
        });
        console.log('Dokumen ditambahkan ke FormData:', { uri, name, type });
      }

      // Tambahkan gambar ke dalam dokumen[] agar menjadi satu array
      if (imageUris.length > 0) {
        imageUris.forEach((uri, index) => {
          const fileName = uri.split('/').pop();
          const fileType = fileName.split('.').pop();
          const mimeType = `image/${fileType}`;

          formDataToSend.append('dokumen[]', {
            uri,
            name: fileName,
            type: mimeType,
          });

          console.log(`Image[${index}] added: ${fileName} - ${mimeType}`);
        });
      }

      // Debug: Log semua data sebelum dikirim
      console.log('FormData sebelum dikirim:', formDataToSend);
      // Kirim data ke API
      const response = await axios.post(`${API_URL}/inspeksi-mutu/store`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response:', response);

      // Cek status response
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Inspeksi berhasil disimpan!',
          text2: 'Inspeksi proyek telah berhasil ditambahkan.',
        });
        navigation.navigate('Mutu');
      } else {
        throw new Error(response.data?.message || 'Gagal menyimpan Inspeksi');
      }
    } catch (error) {
      console.error('Error menyimpan Inspeksi:', error.response?.data || error.message);

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Gagal menyimpan Inspeksi',
        text2: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan inspeksi proyek.',
      });
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      >

        <ImageBackground source={inspeksiImage} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Mutu')}
          >
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>


          <Text style={styles.headerTitle}>Management Mutu</Text>

        </ImageBackground>

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <CustomInput1
              label="Nama Inspeksi"
              placeholder="Masukkan Nama Inspeksi"
              value={formData.inspeksiName}
              onChangeText={(text) => handleInputChange('inspeksiName', text)}
            />


            <CustomInput
              label="Tanggal"
              value={formData.tanggal_inspeksi || "Pilih Tanggal"}
              onPress={() => setShowDatePicker(true)}
            />

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}       

            <CustomInput1
              label="Jenis Pekerjaan"
              placeholder="Jenis Pekerjaan"
              value={formData.jenis_pekerjaan}
              onChangeText={(text) => handleInputChange('jenis_pekerjaan', text)}
            />

            <CustomInput1
              label="Standar"
              placeholder="Standar"
              value={formData.standar}
              onChangeText={(text) => handleInputChange('standar', text)}
            />

            <CustomInput1
              label="Spesifikasi"
              placeholder="Spesifikasi"
              value={formData.spesifikasi}
              onChangeText={(text) => handleInputChange('spesifikasi', text)}
            />
            <CustomInput1
              label="Metode Pengujian"
              placeholder="Metode Pengujian"
              value={formData.metode_pengujian}
              onChangeText={(text) => handleInputChange('metode_pengujian', text)}
            />

            <CustomSelectList 
                label="Hasil Uji" 
                data={data} 
                selectedValue={hasilUji} 
                setSelected={setHasilUji} 
              />

            <CustomTextArea
              label="Catatan"
              placeholder="Catatan Inspeksi"
              value={formData.catatan}
              onChangeText={(text) => handleInputChange('catatan', text)}
            />

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
                  <Button title="Pilih dari Dokument" onPress={pickDocument} style={styles.buttonText}/>
                </TouchableOpacity>

            </View>

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
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
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
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
});
