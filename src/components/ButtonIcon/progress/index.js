import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // for icons

const Card = ({ project }) => {
  return (
    <View style={styles.card}>
      {/* Project Image */}
      <Image 
        source={{ uri: project.image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Card Content */}
      <View style={styles.content}>
        {/* Project Title */}
        <Text style={styles.title}>{project.title}</Text>
        
        {/* Project Category */}
        <View style={styles.categoryContainer}>
          <FontAwesome name={project.category.icon} size={16} color="#4CAF50" />
          <Text style={styles.categoryName}>{project.category.name}</Text>
        </View>

        {/* Project Description */}
        <Text style={styles.description}>{project.description}</Text>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => project.onAction()}
        >
          <FontAwesome name="info-circle" size={16} color="black" />
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Example Usage
const ProjectCard = () => {
  const projects = [
    {
      image: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg',
      title: 'Proyek Jakarta Selatan',
      category: {
        name: 'Hotel',
        icon: 'hotel',
      },
      description: 'MT Haryono St No.kav 20, Cawang, East Jakarta City.',
      onAction: () => alert('View project details'),
    },
    {
      image: 'https://img.okezone.com/content/2018/10/31/320/1971553/25-proyek-senilai-rp280-triliun-di-jawa-barat-siap-dijual-berminat-n2G9h06vGu.jpg',
      title: 'Proyek Bandung Barat',
      category: {
        name: 'Commercial',
        icon: 'building',
      },
      description: 'Jl. Setiabudi No.45, Bandung.',
      onAction: () => alert('View project details'),
    },
    // Add more projects as needed
  ];

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {projects.map((project, index) => (
        <Card key={index} project={project} />
      ))}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 14,
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 12,
    width: 256,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryName: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  description: {
    marginTop: 12,
    color: '#666',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ProjectCard;
