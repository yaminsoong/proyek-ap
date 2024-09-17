import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  IconBiaya,
  IconK3,
  IconKalender,
  IconProyek,
  IconWaktu,
  IconMutu,
  IconTugas,
} from '../../assets';
import {WARNA_SEKUNDER} from '../../utils/constant';

const ButtonIcon = ({title, type}) => {
  const Icon = () => {
    if (title === 'Proyek') return <IconProyek />;

    if (title === 'Waktu') return <IconWaktu />;

    if (title === 'Biaya') return <IconBiaya />;

    if (title === 'Keselamatan Kerja (K3)') return <IconK3 />;

    if (title === 'Mutu') return <IconMutu />;

    if (title === 'Kalender') return <IconKalender />;

    if (title === 'Tugas Proyek') return <IconTugas />;

    return <IconProyek />;
  };

  return (
    <TouchableOpacity style={styles.container(type)}>
      <View style={styles.button(type)}>
        <Icon />
      </View>
      <Text style={styles.text(type)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  container: (type) => ({
      marginBottom : type === "layanan" ? 12 : 0,
      marginRight : type === "layanan" ? 30 : 0
  }), 
  button: (type) => ({
    backgroundColor: WARNA_SEKUNDER,
    padding: type === 'layanan' ? 12 : 7,
    borderRadius: 10,
  }),
  text: (type) => ({
    fontSize: type === 'layanan' ? 14 : 10,
    fontFamily:type === 'layanan' ? 'TitilliumWeb-Light' : 'TitilliumWeb-Regular',
    textAlign: 'center',
  }),

});
