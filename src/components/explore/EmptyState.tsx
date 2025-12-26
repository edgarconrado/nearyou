import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
    onClear: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClear }) => {
    return (
        <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
            <Text style={styles.emptyStateMessage}>
                Intenta con otros términos de búsqueda o cambia los filtros
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    clearButton: {
        backgroundColor: '#003D7A',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    clearButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});