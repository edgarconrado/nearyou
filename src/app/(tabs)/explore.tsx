
import BusinessListItem from "@/components/BusinessListItem";
import EmptyState from "@/components/EmptyState";
import FilterPill from "@/components/FilterPill";
import SearchBar from "@/components/SearchBar";
import Colors from "@/constants/colors";
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  isOpen: boolean;
  image?: string;
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const businesses: Business[] = [
    {
      id: 1,
      name: 'Restaurant El Mirador',
      category: 'Restaurante',
      rating: 4.8,
      reviews: 234,
      distance: '2.3 km',
      isOpen: true,
    },
    {
      id: 2,
      name: 'Hotel Vista Hermosa',
      category: 'Hotel',
      rating: 4.6,
      reviews: 189,
      distance: '1.5 km',
      isOpen: true,
    },
    {
      id: 3,
      name: 'Café Aroma',
      category: 'Restaurante',
      rating: 4.9,
      reviews: 412,
      distance: '0.8 km',
      isOpen: true,
    },
    {
      id: 4,
      name: 'Boutique La Moda',
      category: 'Tienda',
      rating: 4.5,
      reviews: 156,
      distance: '3.2 km',
      isOpen: false,
    },
    {
      id: 5,
      name: 'Museo Regional',
      category: 'Atracción',
      rating: 4.7,
      reviews: 298,
      distance: '2.8 km',
      isOpen: true,
    },
  ];

  // Generar filtros dinámicamente desde las categorías únicas
  const uniqueCategories = [...new Set(businesses.map(b => b.category))];
  const filters = ['Todos', ...uniqueCategories];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || business.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <BusinessListItem
      business={item}
      style={styles.businessItem}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
        
        {/* Barra de búsqueda */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por nombre o categoría..."
          onClear={() => setSearchQuery('')}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <FilterPill
              key={filter}
              label={filter}
              isActive={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
              style={styles.filterPill}
            />
          ))}
        </ScrollView>

        {/* Resultados */}
        <Text style={styles.resultsCount}>
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'resultado' : 'resultados'}
        </Text>

        <FlatList
          data={filteredBusinesses}
          renderItem={renderBusinessItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="search"
              title="No se encontraron resultados"
              message="Intenta con otros términos de búsqueda"
              actionLabel="Limpiar búsqueda"
              onAction={() => {
                setSearchQuery('');
                setSelectedFilter('Todos');
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBg,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 24,
  },
  filterPill: {
    marginRight: 8,
  },
  resultsCount: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  businessItem: {
    marginBottom: 16,
  },
});