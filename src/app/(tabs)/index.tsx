import { Header } from '@/components/home/Header';
import { ZoneGrid } from '@/components/home/ZoneGrid';
import { Logo } from '@/components/shared/logo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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

  const handleZonePress = (zone: any) => {
    router.push({
      pathname: '/explore',
      params: {
        zoneId: zone.id,
        zoneName: zone.title,
        zoneLocation: zone.location,
        zoneImage: zone.image,
      },
    });
  };

  return (

    <View style={styles.container}>

      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
      <Header />

      {/* Logo y nombre de la app */}
      <Logo
        version='Versión 1.0.0'
        slogan='Descubre, explora y comparte experiencias'
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explora por Zona</Text>
        <ZoneGrid zones={zones} onZonePress={handleZonePress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
});