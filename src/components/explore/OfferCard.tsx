import { palette, radius, spacing, type } from '@/constants/design';
import type { OfferWithBusiness } from '@/services/offers.service';
import { OffersService } from '@/services/offers.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OfferCardProps {
    offer: OfferWithBusiness;
    onPress?: (offer: OfferWithBusiness) => void;
}

/**
 * Tarjeta de oferta para el carrusel horizontal. El descuento es lo único
 * en acento — es el dato que justifica la tarjeta. La urgencia se comunica
 * con texto, no con un segundo badge de color.
 */
export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
    const formatValidUntil = (date: string | null): string => {
        if (!date) return 'Sin límite';
        const validDate = new Date(date);
        const day = validDate.getDate();
        const month = validDate.toLocaleDateString('es-MX', { month: 'short' });
        return `${day} ${month}`;
    };

    const discount = offer.discount_percentage
        ? `${offer.discount_percentage}% OFF`
        : 'Oferta';

    const daysLeft = OffersService.getDaysRemaining(offer);
    const isExpiringSoon = daysLeft !== null && daysLeft <= 3;

    const image = offer.image_url || offer.business?.main_image_url;

    return (
        <Pressable
            onPress={() => onPress?.(offer)}
            accessibilityRole="button"
            accessibilityLabel={offer.title}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.imageWrap}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={180} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="image-outline" size={24} color={palette.faint} />
                    </View>
                )}

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{discount}</Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.business} numberOfLines={1}>
                    {offer.business?.name || 'Negocio'}
                </Text>

                <Text style={styles.title} numberOfLines={2}>
                    {offer.title}
                </Text>

                <Text style={[styles.valid, isExpiringSoon && styles.urgent]}>
                    {isExpiringSoon && daysLeft !== null
                        ? daysLeft === 0
                            ? 'Último día'
                            : `Quedan ${daysLeft} días`
                        : `Hasta ${formatValidUntil(offer.valid_until)}`}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: { width: 240, marginRight: spacing.md },
    pressed: { opacity: 0.8 },
    imageWrap: {
        width: '100%',
        aspectRatio: 3 / 2,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: palette.skeleton,
    },
    image: { width: '100%', height: '100%' },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    badge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: palette.accent,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 5,
    },
    badgeText: { ...type.captionStrong, color: palette.white },
    body: { paddingTop: spacing.md, gap: 1 },
    business: { ...type.caption },
    title: { ...type.smallStrong, fontSize: 15 },
    valid: { ...type.caption, marginTop: 2 },
    urgent: { color: palette.danger, fontWeight: '600' },
});