// components/explore/FiltersSection.tsx
import { useCategories } from '@/hooks/use-categories';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface FiltersSectionProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FiltersSection({ selectedFilter, onFilterChange }: FiltersSectionProps) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#003D7A" />
      </View>
    );
  }

  if (error) {
    return null; // Silently fail, just show "Todos"
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtro "Todos" */}
        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === 'Todos' && styles.filterChipActive,
          ]}
          onPress={() => onFilterChange('Todos')}
        >
          <Ionicons
            name="grid-outline"
            size={18}
            color={selectedFilter === 'Todos' ? '#FFF' : '#666'}
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'Todos' && styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </Pressable>

        {/* Filtros de categorías dinámicas */}
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.filterChip,
              selectedFilter === category.name && styles.filterChipActive,
            ]}
            onPress={() => onFilterChange(category.name)}
          >
            {category.icon && (
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedFilter === category.name ? '#FFF' : '#666'}
              />
            )}
            <Text
              style={[
                styles.filterText,
                selectedFilter === category.name && styles.filterTextActive,
              ]}
            >
              {category.name}
            </Text>
            {category.color && selectedFilter === category.name && (
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: category.color }
                ]}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  loadingContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#003D7A',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 2,
  },
});