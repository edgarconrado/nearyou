import { CategoriesService, type Category } from '@/services/categories.service';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FiltersSectionProps {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
}

// Icono por defecto para "Todos"
const DEFAULT_TODOS_ICON: keyof typeof Ionicons.glyphMap = 'apps-outline';
// Icono por defecto para categorías sin icono
const DEFAULT_CATEGORY_ICON: keyof typeof Ionicons.glyphMap = 'location-outline';

export const FiltersSection: React.FC<FiltersSectionProps> = ({
    selectedFilter,
    onFilterChange,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();

        // Suscribirse a cambios en tiempo real
        const channel = CategoriesService.subscribeToChanges((payload) => {
            console.log('Category change:', payload);
            loadCategories(); // Recargar categorías cuando hay cambios
        });

        return () => {
            CategoriesService.unsubscribeFromChanges(channel);
        };
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await CategoriesService.getAllActiveCategories();

        if (error) {
            console.error('Error loading categories:', error);
            setError('Error al cargar categorías');
        } else if (data) {
            setCategories(data);
        }

        setLoading(false);
    };

    // Función para obtener el icono
    const getIconName = (category: Category): keyof typeof Ionicons.glyphMap => {
        // Si la categoría tiene un icono definido en la BD, usarlo
        if (category.icon && category.icon in Ionicons.glyphMap) {
            return category.icon as keyof typeof Ionicons.glyphMap;
        }
        // Si no, usar el icono por defecto
        return DEFAULT_CATEGORY_ICON;
    };

    if (loading) {
        return (
            <View style={styles.filtersWrapper}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#003D7A" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.filtersWrapper}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={loadCategories} style={styles.retryButton}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Crear array de filtros con "Todos" al inicio
    const allFilters = [
        { id: 'todos', name: 'Todos', icon: DEFAULT_TODOS_ICON },
        ...categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: getIconName(cat),
        }))
    ];

    return (
        <View style={styles.filtersWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
            >
                {allFilters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterChip,
                            selectedFilter === filter.name && styles.filterChipActive
                        ]}
                        onPress={() => onFilterChange(filter.name)}
                    >
                        <Ionicons
                            name={filter.icon}
                            size={18}
                            color={selectedFilter === filter.name ? '#FFFFFF' : '#003D7A'}
                        />
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter.name && styles.filterTextActive
                            ]}
                        >
                            {filter.name}
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
    loadingContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    errorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
    },
    retryButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#003D7A',
        borderRadius: 12,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});