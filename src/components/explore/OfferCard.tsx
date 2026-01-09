import type { OfferWithBusiness } from '@/services/offers.service';
import { OffersService } from '@/services/offers.service';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OfferCardProps {
    offer: OfferWithBusiness;
    onPress?: (offer: OfferWithBusiness) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
    // Formatear la fecha de validez
    const formatValidUntil = (date: string | null): string => {
        if (!date) return 'Sin límite';

        const validDate = new Date(date);
        const day = validDate.getDate();
        const month = validDate.toLocaleDateString('es-MX', { month: 'short' });

        return `${day} ${month}`;
    };

    // Obtener el porcentaje de descuento formateado
    const getDiscountText = (): string => {
        if (offer.discount_percentage) {
            return `${offer.discount_percentage}%`;
        }
        return '¡Oferta!';
    };

    // Obtener días restantes
    const getDaysRemaining = (): number | null => {
        return OffersService.getDaysRemaining(offer);
    };

    const daysLeft = getDaysRemaining();
    const isExpiringSoon = daysLeft !== null && daysLeft <= 3;

    return (
        <TouchableOpacity
            style={styles.offerCard}
            activeOpacity={0.8}
            onPress={() => onPress?.(offer)}
        >
            <Image
                source={{
                    uri: offer.image_url || offer.business?.main_image_url || 'https://via.placeholder.com/280x160?text=Sin+Imagen'
                }}
                style={styles.offerImage}
                resizeMode="cover"
            />

            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{getDiscountText()}</Text>
                <Text style={styles.discountLabel}>OFF</Text>
            </View>

            {isExpiringSoon && daysLeft !== null && (
                <View style={styles.urgencyBadge}>
                    <Ionicons name="timer-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.urgencyText}>
                        {daysLeft === 0 ? '¡Último día!' : `${daysLeft} días`}
                    </Text>
                </View>
            )}

            <View style={styles.offerInfo}>
                <Text style={styles.offerBusinessName} numberOfLines={1}>
                    {offer.business?.name || 'Negocio'}
                </Text>

                <Text style={styles.offerTitle} numberOfLines={2}>
                    {offer.title}
                </Text>

                {/* {offer.description && (
                    <Text style={styles.offerDescription} numberOfLines={1}>
                        {offer.description}
                    </Text>
                )} */}

                <View style={styles.offerFooter}>
                    <View style={styles.validUntilContainer}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.validUntilText}>
                            Hasta {formatValidUntil(offer.valid_until)}
                        </Text>
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
        marginRight: 16,
        marginBottom: 16,
    },
    offerImage: {
        width: '100%',
        height: 160,
        backgroundColor: '#F0F0F0',
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
    urgencyBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF9500',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    urgencyText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
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
        marginBottom: 4,
    },
    offerDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
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