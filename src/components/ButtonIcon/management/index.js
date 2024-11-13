import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ButtonIcon = ({ title }) => {
  const navigation = useNavigation(); // Gunakan hook useNavigation

  const Icon = () => {
    const iconMap = {
      'Proyek': require('../../../assets/icon/proyek.png'),
      'Waktu': require('../../../assets/icon/waktu.png'),
      'Biaya': require('../../../assets/icon/biaya.png'),
      'Keselamatan Kerja (K3)': require('../../../assets/icon/keselamatan.png'),
      'Mutu': require('../../../assets/icon/mutu.png'),
    };

    const SelectedIcon = iconMap[title] || require('../../../assets/icon/proyek.png');

    return <Image source={SelectedIcon} style={{ width: 73, height: 73 }} />;
  };

  const handlePress = () => {
    // Logika navigasi berdasarkan title
    switch (title) {
      case 'Proyek':
        navigation.navigate('Proyek'); // Navigasi ke layar Proyek
        break;
      case 'Waktu':
        navigation.navigate('Waktu'); // Navigasi ke layar Waktu
        break;
      case 'Biaya':
        navigation.navigate('Biaya'); // Navigasi ke layar Biaya
        break;
      case 'Keselamatan Kerja (K3)':
        navigation.navigate('K3Menu'); // Navigasi ke layar Keselamatan Kerja
        break;
      case 'Mutu':
        navigation.navigate('Mutu'); // Navigasi ke layar Mutu
        break;
      default:
        console.log('Tidak ada navigasi yang sesuai');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.button}>
        <Icon />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const ButtonIconGrid = ({ data }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        {data.map((item, index) => (
          <ButtonIcon key={index} title={item.title} />
        ))}
      </View>
    </ScrollView>
  );
};

export default function App() {
  const data = [
    { title: 'Proyek' },
    { title: 'Waktu' },
    { title: 'Biaya' },
    { title: 'Mutu' },
    { title: 'Keselamatan Kerja (K3)' },
  ];

  return <ButtonIconGrid data={data} />;
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 14,
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spasi antar ikon
  },
  card: {
    width: '20%', // Mengatur lebar untuk 3 kolom
    alignItems: 'center',
    marginBottom: 30,
    padding: 10,
  },
  button: {
    padding: 15,
    borderRadius: 50, // Membuat tombol menjadi bulat
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Rubik_400Regular',
    textAlign: 'center',
    marginTop: 4,
  },
});
