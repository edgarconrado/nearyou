import BusinessCard from '@/components/BusinessCard';
import CategoryButton from '@/components/CategoryButton';
import SearchBar from '@/components/SearchBar';
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface Category {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Business {
  id: number;
  name: string;
  rating: number;
  category: string;
  price: string;
  distance: string;
}

export default function HomeScreen() {
  const categories: Category[] = [
    { id: 1, name: 'Restaurantes', icon: 'restaurant' },
    { id: 2, name: 'Hoteles', icon: 'bed' },
    { id: 3, name: 'Tiendas', icon: 'storefront' },
    { id: 4, name: 'Atracciones', icon: 'ticket' },
  ];

  const featuredBusinesses: Business[] = [
    {
      id: 1,
      name: 'Restaurant El Mirador',
      rating: 4.8,
      category: 'Cocina tradicional',
      price: '$$',
      distance: '2.3 km',
    },
    {
      id: 2,
      name: 'Hotel Vista Hermosa',
      rating: 4.6,
      category: 'Hotel boutique',
      price: '$$$',
      distance: '1.5 km',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header oscuro */}
        <View style={styles.header}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeSection}>
              <View style={styles.logoIcon}>
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.welcomeText}>Bienvenid@</Text>
              <Text style={styles.userName}>Edgar</Text>
            </View>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Barra de búsqueda usando componente */}
          <SearchBar
            placeholder="Buscar restaurantes, hoteles, tiendas..."
            style={styles.searchBar}
          />

          {/* Categorías usando componente */}
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                icon={category.icon}
                label={category.name}
                onPress={() => router.push('/explore')}
                style={styles.categoryButton}
              />
            ))}
          </View>

          {/* Destacados usando BusinessCard */}
          <Text style={styles.sectionTitle}>Destacados</Text>
          {featuredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              style={styles.businessCard}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.darkBg,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoIcon: {
    width: 56,
    height: 56,
    backgroundColor: Colors.darkBg,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  searchBar: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryButton: {
    width: '23%',
  },
  businessCard: {
    marginBottom: 16,
  },
});