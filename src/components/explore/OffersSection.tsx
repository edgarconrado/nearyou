import { useOffers } from '@/hooks/use-offers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OfferCard } from './OfferCard';

interface OffersSectionProps {
    zoneId?: string;
    onSeeAll?: () => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ zoneId, onSeeAll }) => {
    const { offers, loading, error, refetch } = useOffers({
        zoneId,
        withBusiness: true,
        autoRefresh: true, // Actualización en tiempo real
    });
    
    if (loading) {
        return (
            <View style={styles.offersSection}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Ionicons name="pricetag" size={24} color="#003D7A" />
                        <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003D7A" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.offersSection}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Ionicons name="pricetag" size={24} color="#003D7A" />
                        <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (offers.length === 0) {
        return (
            <View style={styles.offersSection}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Ionicons name="pricetag" size={24} color="#003D7A" />
                        <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
                    </View>
                </View>
                <View style={styles.emptyContainer}>
                    <Ionicons name="pricetag-outline" size={48} color="#CCC" />
                    <Text style={styles.emptyText}>No hay ofertas disponibles</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.offersSection}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name="pricetag" size={24} color="#003D7A" />
                    <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
                </View>
                {offers.length > 3 && onSeeAll && (
                    <TouchableOpacity onPress={onSeeAll}>
                        <Text style={styles.seeAllText}>Ver todas</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.offersScrollContent}
            >
                {offers.map((offer, index) => (
                    <View
                        key={offer.id}
                        style={{ marginRight: index === offers.length - 1 ? 0 : 12 }}
                    >
                        <OfferCard offer={offer} />
                    </View>
                ))}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    offersSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#003D7A',
        fontWeight: '600',
    },
    offersScrollContent: {
        paddingHorizontal: 16,

    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 12,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
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
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
});