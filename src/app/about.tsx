import { Logo } from '@/components/shared/logo';
import { hairline, palette, spacing } from '@/constants/design';
import { PRIVACY_URL, TERMS_URL } from '@/constants/links';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    const openLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert('No pudimos abrir el enlace', url);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('about.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Logo y nombre de la app */}
                <Logo
                    version={`${t('about.version')} 1.1.2r1`}
                    slogan={t('about.slogan')}
                />


                {/* Acerca de nosotros */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.ourMission')}</Text>
                    <Text style={styles.paragraph}>
                        {t('about.missionText1')}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('about.missionText2')}
                    </Text>
                </View>

                {/* Características principales */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.mainFeatures')}</Text>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="search" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{t('about.advancedSearch')}</Text>
                            <Text style={styles.featureDescription}>
                                {t('about.advancedSearchDesc')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="star" size={24} color="#FF9800" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{t('about.verifiedReviews')}</Text>
                            <Text style={styles.featureDescription}>
                                {t('about.verifiedReviewsDesc')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="map" size={24} color={palette.success} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{t('about.interactiveMaps')}</Text>
                            <Text style={styles.featureDescription}>
                                {t('about.interactiveMapsDesc')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#FCE4EC' }]}>
                            <Ionicons name="heart" size={24} color="#E91E63" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{t('about.customLists')}</Text>
                            <Text style={styles.featureDescription}>
                                {t('about.customListsDesc')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Equipo */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.ourTeam')}</Text>
                    <Text style={styles.paragraph}>
                        {t('about.teamDescription')}
                    </Text>
                </View>

                {/* Redes sociales */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.followUs')}</Text>

                    <View style={styles.socialLinks}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => Linking.openURL('https://www.facebook.com/nearyou')}
                        >
                            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => Linking.openURL('https://www.instagram.com/nearyou')}
                        >
                            <Ionicons name="logo-instagram" size={28} color="#E4405F" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => Linking.openURL('https://twitter.com/nearyou')}
                        >
                            <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => Linking.openURL('https://www.youtube.com/nearyou')}
                        >
                            <Ionicons name="logo-youtube" size={28} color="#FF0000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Contacto */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.contact')}</Text>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('mailto:contacto@nearyou.com')}
                    >
                        <Ionicons name="mail-outline" size={22} color={palette.muted} />
                        <Text style={styles.contactText}>contacto@nearyou.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('https://www.nearyou.com')}
                    >
                        <Ionicons name="globe-outline" size={22} color={palette.muted} />
                        <Text style={styles.contactText}>www.nearyou.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('tel:+523531730317')}
                    >
                        <Ionicons name="call-outline" size={22} color={palette.muted} />
                        <Text style={styles.contactText}>+52 (353) 173-0317</Text>
                    </TouchableOpacity>
                </View>

                {/* Legal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about.legal')}</Text>

                    <TouchableOpacity
                        style={styles.legalLink}
                        accessibilityRole="link"
                        onPress={() => openLink(TERMS_URL)}
                    >
                        <Text style={styles.legalText}>{t('about.termsConditions')}</Text>
                        <Ionicons name="open-outline" size={18} color={palette.faint} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.legalLink}
                        accessibilityRole="link"
                        onPress={() => openLink(PRIVACY_URL)}
                    >
                        <Text style={styles.legalText}>{t('about.privacyPolicy')}</Text>
                        <Ionicons name="open-outline" size={18} color={palette.faint} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {t('about.copyright')}
                    </Text>
                    <Text style={styles.footerText}>
                        {t('about.madeWith')}
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: palette.white,
        borderBottomWidth: hairline,
        borderBottomColor: palette.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette.ink,
    },
    content: {
        flex: 1,
    },
    logoSection: {
        backgroundColor: palette.white,
        alignItems: 'center',
        paddingVertical: 40,
        marginBottom: 8,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        color: palette.muted,
        marginBottom: 12,
    },
    appTagline: {
        fontSize: 15,
        color: palette.muted,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    section: {
        backgroundColor: palette.white,
        padding: 20,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        color: palette.muted,
        lineHeight: 22,
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 12,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: palette.ink,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: palette.muted,
        lineHeight: 20,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 8,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    contactText: {
        fontSize: 15,
        color: palette.ink,
    },
    legalLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    legalText: {
        fontSize: 15,
        color: palette.ink,
    },
    footer: {
        backgroundColor: palette.white,
        alignItems: 'center',
        paddingVertical: 24,
        marginTop: 8,
    },
    footerText: {
        fontSize: 13,
        color: palette.muted,
        marginBottom: 4,
    },
});