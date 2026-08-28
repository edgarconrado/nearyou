import { Logo } from '@/components/shared/logo';
import { hairline, palette, spacing, type } from '@/constants/design';
import { openExternalLink, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL } from '@/constants/links';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.1.3r1';

/**
 * Acerca de.
 *
 * Se quitó la sección «Síguenos» (no hay redes sociales todavía) y el enlace
 * a licencias de código abierto, que no llevaba a ninguna parte. Todo lo que
 * el usuario puede tocar aquí hace algo real.
 */
export default function AboutScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    const features = [
        { icon: 'search-outline', title: t('about.advancedSearch'), desc: t('about.advancedSearchDesc') },
        { icon: 'star-outline', title: t('about.verifiedReviews'), desc: t('about.verifiedReviewsDesc') },
        { icon: 'map-outline', title: t('about.interactiveMaps'), desc: t('about.interactiveMapsDesc') },
        { icon: 'heart-outline', title: t('about.customLists'), desc: t('about.customListsDesc') },
    ];

    const openMail = async () => {
        try {
            await Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
        } catch {
            Alert.alert('Escríbenos a', SUPPORT_EMAIL);
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('about.title')}</Text>
                <View style={styles.back} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.brand}>
                    <Logo version={APP_VERSION} slogan={t('about.slogan')} />
                </View>

                <Text style={styles.sectionTitle}>{t('about.ourMission')}</Text>
                <Text style={styles.paragraph}>{t('about.missionText1')}</Text>
                <Text style={styles.paragraph}>{t('about.missionText2')}</Text>

                <Text style={styles.sectionTitle}>{t('about.mainFeatures')}</Text>
                {features.map((feature, i) => (
                    <View key={feature.title} style={[styles.feature, i < features.length - 1 && styles.divider]}>
                        <Ionicons name={feature.icon as any} size={22} color={palette.ink} />
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDesc}>{feature.desc}</Text>
                        </View>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>{t('about.contact')}</Text>
                <Pressable
                    onPress={openMail}
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                    <Ionicons name="mail-outline" size={22} color={palette.ink} />
                    <Text style={styles.rowLabel}>{SUPPORT_EMAIL}</Text>
                    <Ionicons name="chevron-forward" size={18} color={palette.faint} />
                </Pressable>

                <Text style={styles.sectionTitle}>{t('about.legal')}</Text>
                <Pressable
                    onPress={() => openExternalLink(TERMS_URL)}
                    style={({ pressed }) => [styles.row, styles.divider, pressed && styles.pressed]}
                >
                    <Text style={styles.legalLabel}>{t('about.termsConditions')}</Text>
                    <Ionicons name="open-outline" size={18} color={palette.faint} />
                </Pressable>
                <Pressable
                    onPress={() => openExternalLink(PRIVACY_URL)}
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                    <Text style={styles.legalLabel}>{t('about.privacyPolicy')}</Text>
                    <Ionicons name="open-outline" size={18} color={palette.faint} />
                </Pressable>

                <Text style={styles.copyright}>{t('about.copyright')}</Text>
                <Text style={styles.madeWith}>{t('about.madeWith')}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: palette.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: hairline,
        borderBottomColor: palette.border,
    },
    back: { width: 32 },
    headerTitle: { ...type.subheading },

    content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
    brand: { alignItems: 'center', paddingVertical: spacing.xl, gap: 2 },
    appName: { ...type.title, marginTop: spacing.md },
    version: { ...type.small },
    slogan: { ...type.small, textAlign: 'center', marginTop: spacing.xs },

    sectionTitle: {
        ...type.captionStrong,
        color: palette.muted,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
    },
    paragraph: { ...type.body, color: palette.muted, marginBottom: spacing.md },

    feature: { flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
    divider: { borderBottomWidth: hairline, borderBottomColor: palette.borderSoft },
    featureText: { flex: 1, gap: 2 },
    featureTitle: { ...type.bodyStrong },
    featureDesc: { ...type.small },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        paddingVertical: spacing.lg,
    },
    pressed: { opacity: 0.55 },
    rowLabel: { ...type.body, flex: 1 },
    legalLabel: { ...type.body, flex: 1 },

    copyright: { ...type.caption, textAlign: 'center', marginTop: spacing.xxl },
    madeWith: { ...type.caption, textAlign: 'center', marginTop: spacing.xs },
});