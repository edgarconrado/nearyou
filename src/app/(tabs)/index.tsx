import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;


const zones = [
  {
    id: 1,
    title: 'Pátzcuaro Pueblo Mágico',
    location: 'Michoacán',
    slug: 'patzcuaro',
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Morelia Centro Histórico',
    location: 'Michoacán',
    slug: 'morelia',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Madrid Centro',
    location: 'Madrid',
    slug: 'madrid',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'Barcelona Gótico',
    location: 'Barcelona',
    slug: 'barcelona',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    title: 'Uruapan',
    location: 'Michoacán',
    slug: 'uruapan',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
];


export default function HomeScreen() {
 
 const router = useRouter();

  const handleZonePress = (zone) => {
    router.push({
      pathname: '/explore',
      params: {
        zoneId: zone.id,
        zoneName: zone.title,
        zoneLocation: zone.location,
        zoneImage: zone.image
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Explora por Zona</Text>
        
        <View style={styles.grid}>
          {zones.map((zone, index) => (
            <TouchableOpacity 
              key={zone.id} 
              style={[
                styles.card,
                index % 2 === 0 ? styles.cardLeft : styles.cardRight
              ]}
              activeOpacity={0.8}
              onPress={() => handleZonePress(zone)}
            >
              <Image 
                source={{ uri: zone.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{zone.title}</Text>
                  <Text style={styles.cardLocation}>{zone.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#003D7A',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    width: cardWidth,
    height: 140,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardLeft: {
    marginRight: 16,
  },
  cardRight: {
    marginLeft: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardContent: {
    gap: 2,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardLocation: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});