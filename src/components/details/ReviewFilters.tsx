import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReviewFiltersProps {
    reviewFilter: number | 'all';
    onFilterChange: (filter: number | 'all') => void;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
    reviewFilter,
    onFilterChange,
}) => {
    return (
        <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filtrar por:</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
            >
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        reviewFilter === 'all' && styles.filterChipActive,
                    ]}
                    onPress={() => onFilterChange('all')}
                >
                    <Text
                        style={[
                            styles.filterChipText,
                            reviewFilter === 'all' && styles.filterChipTextActive,
                        ]}
                    >
                        Todas
                    </Text>
                </TouchableOpacity>
                {[5, 4, 3, 2, 1].map((star) => (
                    <TouchableOpacity
                        key={star}
                        style={[
                            styles.filterChip,
                            reviewFilter === star && styles.filterChipActive,
                        ]}
                        onPress={() => onFilterChange(star)}
                    >
                        <Ionicons
                            name="star"
                            size={16}
                            color={reviewFilter === star ? '#FFFFFF' : '#FFB800'}
                        />
                        <Text
                            style={[
                                styles.filterChipText,
                                reviewFilter === star && styles.filterChipTextActive,
                            ]}
                        >
                            {star}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    filterSection: {
        marginBottom: 24,
    },
    filterLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    filtersScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
});