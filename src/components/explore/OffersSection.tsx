import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Offer } from '../../types/types';
import { OfferCard } from './OfferCard';

interface OffersSectionProps {
    offers: Offer[];
}

export const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
    return (
        <View style={styles.offersSection}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name="pricetag" size={24} color="#003D7A" />
                    <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.offersScrollContent}
            >
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
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
        gap: 12,
    },
});