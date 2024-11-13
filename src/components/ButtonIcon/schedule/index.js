import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { WARNA_SEKUNDER } from '../../../utils';
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';

const ButtonIcon = ({ title }) => {
  const Icon = () => {
    const iconMap = {
      'Kalender': require('../../../assets/icon/kalender.png'),
      'Tugas Proyek': require('../../../assets/icon/tugas.png'),
    };

    const SelectedIcon = iconMap[title] || require('../../../assets/icon/kalender.png');

    return <Image source={SelectedIcon} style={{ width: 73, height: 73 }} />;
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.button}>
        <Icon />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const ButtonIconGridSchedul = ({ data }) => {
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
    { title: 'Kalender' },
    { title: 'Tugas Proyek' },
  ];

  return <ButtonIconGridSchedul data={data} />;
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
    width: '50%', // Mengatur lebar untuk 3 kolom
    alignItems: 'center',
    marginBottom: 30,
    padding: 14,
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
