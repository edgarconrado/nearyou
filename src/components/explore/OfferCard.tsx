import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Offer } from '../../types/types';

interface OfferCardProps {
    offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    return (
        <TouchableOpacity style={styles.offerCard} activeOpacity={0.8}>
            <Image
                source={{ uri: offer.image }}
                style={styles.offerImage}
                resizeMode="cover"
            />
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{offer.discount}</Text>
                <Text style={styles.discountLabel}>OFF</Text>
            </View>
            <View style={styles.offerInfo}>
                <Text style={styles.offerBusinessName} numberOfLines={1}>
                    {offer.businessName}
                </Text>
                <Text style={styles.offerTitle} numberOfLines={2}>
                    {offer.title}
                </Text>
                <View style={styles.offerFooter}>
                    <View style={styles.validUntilContainer}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.validUntilText}>Hasta {offer.validUntil}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    offerCard: {
        width: 280,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginRight: 12,
    },
    offerImage: {
        width: '100%',
        height: 160,
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
    discountText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 24,
    },
    discountLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    offerInfo: {
        padding: 12,
    },
    offerBusinessName: {
        fontSize: 13,
        color: '#003D7A',
        fontWeight: '600',
        marginBottom: 4,
    },
    offerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 22,
        marginBottom: 8,
    },
    offerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    validUntilContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    validUntilText: {
        fontSize: 12,
        color: '#666',
    },
});