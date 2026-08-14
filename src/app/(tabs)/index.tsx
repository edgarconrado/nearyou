import { Header } from '@/components/home/Header';
import { ZoneGrid } from '@/components/home/ZoneGrid';
import { palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelectedZone } from '@/contexts/SelectedZoneContext';
import { useZones } from '@/hooks/use-zones';
import type { Zone } from '@/services/zones.service';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { selectZone } = useSelectedZone();
    const { zones, loading, error, refetch } = useZones();

    const handleZonePress = (zone: Zone) => {
        selectZone({
            id: zone.id,
            name: zone.name,
            location: zone.state,
            image: zone.image_url || undefined,
        });

        router.push({
            pathname: '/explore',
            params: {
                zoneId: zone.id,
                zoneName: zone.name,
                zoneLocation: zone.state,
                zoneImage: zone.image_url || '',
            },
        });
    };

    return (
        <View style={styles.screen}>
            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && zones.length > 0}
                        onRefresh={refetch}
                        tintColor={palette.muted}
                    />
                }
            >
                <View style={styles.intro}>
                    <Text style={styles.title}>{t('home.exploreByZone')}</Text>
                    <Text style={styles.subtitle}>{t('home.discoverExperiences')}</Text>
                </View>

                {loading && zones.length === 0 ? (
                    <View style={styles.state}>
                        <ActivityIndicator color={palette.ink} />
                    </View>
                ) : error ? (
                    <View style={styles.state}>
                        <Text style={styles.stateTitle}>No pudimos cargar las zonas</Text>
                        <Text style={styles.stateBody}>{error}</Text>
                        <Pressable
                            onPress={refetch}
                            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        >
                            <Text style={styles.buttonText}>{t('home.retry')}</Text>
                        </Pressable>
                    </View>
                ) : zones.length === 0 ? (
                    <View style={styles.state}>
                        <Text style={styles.stateTitle}>{t('home.noZones')}</Text>
                        <Text style={styles.stateBody}>{t('home.noZonesDescription')}</Text>
                    </View>
                ) : (
                    <ZoneGrid zones={zones} onZonePress={handleZonePress} />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.white,
    },
    scroll: {
        flexGrow: 1,
    },
    intro: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    title: {
        ...type.title,
    },
    subtitle: {
        ...type.body,
        color: palette.muted,
        marginTop: spacing.xs,
    },
    state: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxxl,
        alignItems: 'center',
        gap: spacing.sm,
    },
    stateTitle: {
        ...type.subheading,
        textAlign: 'center',
    },
    stateBody: {
        ...type.small,
        textAlign: 'center',
    },
    button: {
        marginTop: spacing.lg,
        height: 48,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.sm,
        backgroundColor: palette.ink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        ...type.smallStrong,
        color: palette.white,
        fontSize: 15,
    },
});