import type { BusinessFull } from '@services/businesses.service';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
    businesses: BusinessFull[];
    loading?: boolean;
    error?: string | null;
    onBusinessPress: (business: BusinessFull) => void;
    onRetry?: () => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
    businesses,
    loading = false,
    error = null,
    onBusinessPress,
    onRetry,
}) => {
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#003D7A" />
                <Text style={styles.loadingText}>Cargando negocios...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                {onRetry && (
                    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    if (businesses.length === 0) {
        return null; // El EmptyState se maneja en el padre
    }

    return (
        <>
            {businesses.map((business) => (
                <BusinessCard
                    key={business.id}
                    business={business}
                    onPress={() => onBusinessPress(business)}
                />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#003D7A',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});