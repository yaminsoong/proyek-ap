import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import DropDownPicker from 'react-native-dropdown-picker'; 

const WaktuImage = require('../../../assets/images/bg-img-top.png');

export default function CreateWaktu() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    WaktuName: '',
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

  const [open, setOpen] = useState(false);
  const [pemberiTugas, setPemberiTugas] = useState(null);
  const [items, setItems] = useState([
    { label: 'PT. Adhi Karya', value: 'adhi_karya' },
    { label: 'PT. Waskita Karya', value: 'waskita_karya' },
    { label: 'PT. Wijaya Karya', value: 'wijaya_karya' },
    { label: 'PT. Hutama Karya', value: 'hutama_karya' },
    { label: 'PT. Pembangunan Perumahan', value: 'pembangunan_perumahan' },
  ]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderInput = (label, placeholder, field) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={text => handleInputChange(field, text)}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={WaktuImage} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Proyek')}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Schedule</Text>
      </ImageBackground>

      <View style={styles.formContainer}>
        {renderInput('Start Date', 'Masukkan Nama Proyek', 'WaktuName')}
        {renderInput('End Date', 'Masukkan Lokasi', 'location')}

        <Text style={styles.label}>Proyek</Text>
        <DropDownPicker
          open={open}
          value={pemberiTugas}
          items={items}
          setOpen={setOpen}
          setValue={setPemberiTugas}
          setItems={setItems}
          placeholder="Proyek"
          searchable={true}
          searchPlaceholder="Cari Pemberi Tugas..."
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          onChangeValue={(value) => handleInputChange('pemberiTugas', value)}
          listMode="FLATLIST"
        />

        {renderInput('Assign', 'Masukkan Konsultan MK', 'konsultanMK')}
        {renderInput('Description', 'Masukkan Kontraktor', 'kontraktor')}

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
  dropdown: {
    backgroundColor: '#F1F3FA',
    borderColor: '#C4C4C4',
    borderRadius: 30,
    fontSize: 12,
    color: '#555555',
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#C4C4C4',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 12,
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
