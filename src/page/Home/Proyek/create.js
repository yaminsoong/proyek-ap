import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,FlatList, Dimensions, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker

const projectImage = require('../../../assets/images/bg-img-top.png'); // Background image

export default function CreateProject() {
  const navigation = useNavigation(); // Initialize navigation

  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    pemberiTugas: '',
    konsultanMK: '',
    kontraktor: '',
    spmk: '',
    kontrak: '',
    nilaiKontrak: '',
    addendum2: '',
    addendum4: '',
  });

  const [open, setOpen] = useState(false); // State to handle dropdown open/close
  const [pemberiTugas, setPemberiTugas] = useState(null); // State for selected option
  const [items, setItems] = useState([
    { label: 'PT. Adhi Karya', value: 'adhi_karya' },
    { label: 'PT. Waskita Karya', value: 'waskita_karya' },
    { label: 'PT. Wijaya Karya', value: 'wijaya_karya' },
    { label: 'PT. Hutama Karya', value: 'hutama_karya' },
    { label: 'PT. Pembangunan Perumahan', value: 'pembangunan_perumahan' },
  ]); // Pemberi Tugas options

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={projectImage} style={styles.header}>
        <TouchableOpacity style={styles.backButton}
            onPress={() => navigation.navigate('Proyek')}
        >
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Proyek</Text>
      </ImageBackground>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nama Proyek</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nama Proyek"
          value={formData.projectName}
          onChangeText={text => handleInputChange('projectName', text)}
        />

        <Text style={styles.label}>Lokasi</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Lokasi"
          value={formData.location}
          onChangeText={text => handleInputChange('location', text)}
        />

        <Text style={styles.label}>Pemberi Tugas</Text>
        <DropDownPicker
          open={open}
          value={pemberiTugas}
          items={items}
          setOpen={setOpen}
          setValue={setPemberiTugas}
          setItems={setItems}
          placeholder="Pilih Pemberi Tugas"
          searchable={true}
          searchPlaceholder="Cari Pemberi Tugas..."
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          onChangeValue={(value) => handleInputChange('pemberiTugas', value)} // Capture selected value
          listMode="FLATLIST"
        />

        <Text style={styles.label}>Konsultan Manajemen Konstruksi</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Konsultan MK"
          value={formData.konsultanMK}
          onChangeText={text => handleInputChange('konsultanMK', text)}
        />

        <Text style={styles.label}>Kontraktor</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Kontraktor"
          value={formData.kontraktor}
          onChangeText={text => handleInputChange('kontraktor', text)}
        />

        <Text style={styles.label}>Nomor SPMK</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nomor SPMK"
          value={formData.spmk}
          onChangeText={text => handleInputChange('spmk', text)}
        />

        <Text style={styles.label}>Nomor Kontrak</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nomor Kontrak"
          value={formData.kontrak}
          onChangeText={text => handleInputChange('kontrak', text)}
        />

        <Text style={styles.label}>Nilai Kontrak (include PPN)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nilai Kontrak"
          value={formData.nilaiKontrak}
          onChangeText={text => handleInputChange('nilaiKontrak', text)}
        />

        <Text style={styles.label}>Nilai Kontrak Addendum 2 (include PPN)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nilai Addendum 2"
          value={formData.addendum2}
          onChangeText={text => handleInputChange('addendum2', text)}
        />

        <Text style={styles.label}>Nilai Kontrak Addendum 4 (include PPN)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan Nilai Addendum 4"
          value={formData.addendum4}
          onChangeText={text => handleInputChange('addendum4', text)}
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
   // Other styles...
   dropdown: {
    backgroundColor: '#F1F3FA',
    borderColor: '#C4C4C4',
    borderTopLeftRadius: 30, // Keep radius for the top left corner
    borderTopRightRadius: 30, // Keep radius for the top right corner
    borderBottomLeftRadius: 30, // No radius for bottom when closed
    borderBottomRightRadius: 30, // No radius for bottom when closed
    fontSize: 12,
    color: '#555555',
    marginBottom: 15,

  },
  dropdownContainer: {
    borderColor: '#C4C4C4',
    borderTopLeftRadius: 10, // Maintain top radius for the open state
    borderTopRightRadius: 10, // Maintain top radius for the open state
    borderBottomLeftRadius: 5, // Slight rounding at the bottom left
    borderBottomRightRadius: 5, // Slight rounding at the bottom right
    overflow: 'hidden', // Ensure no overflow issues with radius
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#002D76',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F1F3FA',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: 50,
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
