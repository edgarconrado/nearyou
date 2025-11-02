
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const businesses = [
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

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      style={styles.businessListItem}
      onPress={() => router.push({
        pathname: '/detail',
        params: { businessId: item.id }
      })}
    >
      <View style={styles.businessThumbnail} />
      <View style={styles.businessListInfo}>
        <Text style={styles.businessListName}>{item.name}</Text>
        <View style={styles.businessListRating}>
          <Ionicons name="star" size={14} color={Colors.accent} />
          <Text style={styles.smallRatingText}>
            {item.rating} ({item.reviews})
          </Text>
        </View>
        <Text style={styles.businessListMeta}>
          {item.category} • {item.distance}
        </Text>
        <View style={styles.businessBadges}>
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={12} color={Colors.textTertiary} />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
          <Text style={[
            styles.statusText,
            { color: item.isOpen ? Colors.open : Colors.closed }
          ]}>
            {item.isOpen ? 'Abierto ahora' : 'Cerrado'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
        
        {/* Barra de búsqueda */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o categoría..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
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
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
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
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={Colors.gray} />
              <Text style={styles.emptyText}>No se encontraron resultados</Text>
              <Text style={styles.emptySubtext}>
                Intenta con otros términos de búsqueda
              </Text>
            </View>
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
  searchBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Colors.shadow,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.textPrimary,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  filterTextActive: {
    color: Colors.white,
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
  businessListItem: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
    ...Colors.shadow,
  },
  businessThumbnail: {
    width: 112,
    height: 112,
    backgroundColor: Colors.primaryLight,
  },
  businessListInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  businessListName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  businessListRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  smallRatingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  businessListMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  businessBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.grayLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});