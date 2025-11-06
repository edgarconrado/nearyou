import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface InfoItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}

interface LinkItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    url: string;
}

export default function AboutScreen() {
    const appInfo: InfoItem[] = [
        {
            icon: 'information-circle',
            label: 'Versión',
            value: '1.0.0',
        },
        {
            icon: 'code-slash',
            label: 'Build',
            value: '2025.01.001',
        },
        {
            icon: 'calendar',
            label: 'Última actualización',
            value: 'Noviembre 2025',
        },
    ];

    const socialLinks: LinkItem[] = [
        {
            icon: 'globe',
            label: 'Sitio web',
            url: 'https://neeryou.com',
        },
        {
            icon: 'logo-facebook',
            label: 'Facebook',
            url: 'https://facebook.com/neeryou',
        },
        {
            icon: 'logo-instagram',
            label: 'Instagram',
            url: 'https://instagram.com/neeryou',
        },
        {
            icon: 'logo-x',
            label: 'X',
            url: 'https://twitter.com/neeryou',
        },
        {
            icon: 'mail',
            label: 'Contacto',
            url: 'mailto:contacto@neeryou.com',
        },
    ];

    const legalLinks: LinkItem[] = [
        {
            icon: 'document-text',
            label: 'Términos y Condiciones',
            url: 'https://neeryou.com/terms',
        },
        {
            icon: 'shield-checkmark',
            label: 'Política de Privacidad',
            url: 'https://neeryou.com/privacy',
        },
        {
            icon: 'receipt',
            label: 'Licencias',
            url: 'https://neeryou.com/licenses',
        },
    ];

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Acerca de</Text>
                    <View style={styles.backButton} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoCircle}>
                <Image
                  source={require("@assets/images/logo.png")}
                  style={styles.logo}
                />
                        </View>
                        <Text style={styles.appName}>NeerYou</Text>
                        <Text style={styles.tagline}>Todo a tu alcance</Text>
                    </View>

                    {/* Description */}
                    <View style={styles.card}>
                        <Text style={styles.descriptionTitle}>Sobre NeerYou</Text>
                        <Text style={styles.description}>
                            NeerYou es tu compañero perfecto para descubrir y explorar los mejores
                            lugares de tu comunidad. Desde restaurantes y hoteles hasta tiendas y
                            atracciones locales, te ayudamos a encontrar todo lo que necesitas cerca de ti.
                        </Text>
                        <Text style={styles.description}>
                            Nuestra misión es conectar a las personas con los negocios locales,
                            promoviendo el turismo y el comercio en tu comunidad.
                        </Text>
                    </View>

                    {/* App Info */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Información de la App</Text>
                        {appInfo.map((item, index) => (
                            <View key={index} style={styles.infoRow}>
                                <View style={styles.infoLeft}>
                                    <Ionicons name={item.icon} size={20} color={Colors.primary} />
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                </View>
                                <Text style={styles.infoValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Social Links */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Síguenos</Text>
                        {socialLinks.map((link, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.linkRow}
                                onPress={() => handleOpenLink(link.url)}
                            >
                                <View style={styles.linkLeft}>
                                    <Ionicons name={link.icon} size={20} color={Colors.primary} />
                                    <Text style={styles.linkLabel}>{link.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Legal Links */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Legal</Text>
                        {legalLinks.map((link, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.linkRow}
                                onPress={() => handleOpenLink(link.url)}
                            >
                                <View style={styles.linkLeft}>
                                    <Ionicons name={link.icon} size={20} color={Colors.primary} />
                                    <Text style={styles.linkLabel}>{link.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Team Section */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Desarrollado con ❤️</Text>
                        <Text style={styles.teamText}>
                            Hecho con pasión en Jiquilpan, Michoacán, México
                        </Text>
                        <Text style={styles.copyrightText}>
                            © 2025 NeerYou. Todos los derechos reservados.
                        </Text>
                    </View>

                    {/* Credits */}
                    <View style={styles.creditsSection}>
                        <Text style={styles.creditsTitle}>Tecnologías Utilizadas</Text>
                        <View style={styles.creditsRow}>
                            <View style={styles.creditBadge}>
                                <Text style={styles.creditText}>React Native</Text>
                            </View>
                            <View style={styles.creditBadge}>
                                <Text style={styles.creditText}>Expo</Text>
                            </View>
                            <View style={styles.creditBadge}>
                                <Text style={styles.creditText}>TypeScript</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.darkBg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    content: {
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.darkBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...Colors.shadowLarge,
        position: 'relative',
    },
    chevronIcon: {
        position: 'absolute',
        bottom: 24,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        ...Colors.shadow,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textPrimary,
    },
    infoValue: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
    },
    linkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    linkLabel: {
        fontSize: 14,
        color: Colors.textPrimary,
    },
    teamText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    copyrightText: {
        fontSize: 12,
        color: Colors.gray,
        textAlign: 'center',
    },
    creditsSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    creditsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    creditsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    creditBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    creditText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    logo: {
        width: 80,
        height: 80,
    },
});