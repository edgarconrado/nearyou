import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FiltersSectionProps {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
}

const filters = ['Todos', 'Restaurante', 'Hotel', 'Tienda', 'Atracción', 'Taller', 'Comercio', 'Servicios'];

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    Todos: 'apps-outline',
    Restaurante: 'restaurant-outline',
    Hotel: 'bed-outline',
    Tienda: 'bag-handle-outline',
    Atracción: 'location-outline',
    Taller: 'hammer-outline',
    Comercio: 'storefront-outline',
    Servicios: 'sparkles-outline',
};

export const FiltersSection: React.FC<FiltersSectionProps> = ({
    selectedFilter,
    onFilterChange,
}) => {
    return (
        <View style={styles.filtersWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterChip,
                            selectedFilter === filter && styles.filterChipActive
                        ]}
                        onPress={() => onFilterChange(filter)}
                    >
                        <Ionicons
                            name={iconMap[filter]}
                            size={18}
                            color={selectedFilter === filter ? '#FFFFFF' : '#003D7A'}
                        />
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextActive
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    filtersWrapper: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filtersContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#003D7A',
        borderColor: '#003D7A',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#003D7A',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
});