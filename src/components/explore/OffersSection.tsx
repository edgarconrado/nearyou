import { palette, spacing, type } from '@/constants/design';
import { useOffers } from '@/hooks/use-offers';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OfferCard } from './OfferCard';

interface OffersSectionProps {
    zoneId?: string;
    onSeeAll?: () => void;
}

/** Cabecera de sección compartida por todos los estados. */
function SectionHeader({ onSeeAll }: { onSeeAll?: () => void }) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Ofertas destacadas</Text>
            {onSeeAll && (
                <Pressable onPress={onSeeAll} hitSlop={8}>
                    <Text style={styles.seeAll}>Ver todas</Text>
                </Pressable>
            )}
        </View>
    );
}

export const OffersSection: React.FC<OffersSectionProps> = ({ zoneId, onSeeAll }) => {
    const { offers, loading, error, refetch } = useOffers({
        zoneId,
        withBusiness: true,
        autoRefresh: true,
    });

    if (loading) {
        return (
            <View style={styles.section}>
                <SectionHeader />
                <View style={styles.state}>
                    <ActivityIndicator color={palette.ink} />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.section}>
                <SectionHeader />
                <View style={styles.state}>
                    <Text style={styles.stateText}>{error}</Text>
                    <Pressable onPress={refetch} hitSlop={8}>
                        <Text style={styles.link}>Reintentar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // Sin ofertas no se muestra nada: una sección vacía solo ocupa espacio
    if (offers.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeader onSeeAll={offers.length > 3 ? onSeeAll : undefined} />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { paddingVertical: spacing.lg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: { ...type.subheading },
    seeAll: { ...type.smallStrong, textDecorationLine: 'underline' },
    scroll: { paddingHorizontal: spacing.lg },
    state: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
    },
    stateText: { ...type.small, textAlign: 'center' },
    link: { ...type.smallStrong, textDecorationLine: 'underline' },
});