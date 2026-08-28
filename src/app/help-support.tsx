import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { openExternalLink, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL } from '@/constants/links';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUPPORT_PHONE = '+523531730317';

/**
 * Ayuda y soporte.
 *
 * Se quitaron el formulario de contacto, los enlaces útiles (centro de ayuda,
 * tutoriales, comunidad) y los accesos a WhatsApp y Facebook: ninguno estaba
 * conectado a nada real. Una función que no hace nada es motivo de rechazo
 * bajo la guía 2.1 de App Store, así que solo queda lo que sí funciona:
 * correo, teléfono y las preguntas frecuentes.
 */
export default function HelpSupportScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
        q: t(`helpSupport.faq${n}q`),
        a: t(`helpSupport.faq${n}a`),
    }));

    const openMail = async () => {
        const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Soporte NearYou')}`;
        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert('Escríbenos a', SUPPORT_EMAIL);
        }
    };

    const openPhone = async () => {
        try {
            await Linking.openURL(`tel:${SUPPORT_PHONE}`);
        } catch {
            Alert.alert('Llámanos al', SUPPORT_PHONE);
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('helpSupport.title')}</Text>
                <View style={styles.back} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.intro}>{t('helpSupport.subtitle')}</Text>

                {/* Contacto */}
                <Text style={styles.sectionTitle}>{t('helpSupport.contactUs')}</Text>

                <Pressable
                    onPress={openMail}
                    style={({ pressed }) => [styles.row, styles.divider, pressed && styles.pressed]}
                >
                    <Ionicons name="mail-outline" size={22} color={palette.ink} />
                    <View style={styles.rowText}>
                        <Text style={styles.rowLabel}>{t('helpSupport.email')}</Text>
                        <Text style={styles.rowValue}>{SUPPORT_EMAIL}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={palette.faint} />
                </Pressable>

                <Pressable
                    onPress={openPhone}
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                    <Ionicons name="call-outline" size={22} color={palette.ink} />
                    <View style={styles.rowText}>
                        <Text style={styles.rowLabel}>{t('helpSupport.phone')}</Text>
                        <Text style={styles.rowValue}>+52 353 173 0317</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={palette.faint} />
                </Pressable>

                <View style={styles.schedule}>
                    <Text style={styles.scheduleTitle}>{t('helpSupport.scheduleTitle')}</Text>
                    <Text style={styles.scheduleLine}>{t('helpSupport.scheduleWeekdays')}</Text>
                    <Text style={styles.scheduleLine}>{t('helpSupport.scheduleWeekend')}</Text>
                    <Text style={styles.scheduleLine}>{t('helpSupport.scheduleSunday')}</Text>
                </View>

                {/* Preguntas frecuentes */}
                <Text style={styles.sectionTitle}>{t('helpSupport.commonQuestions')}</Text>

                {faqs.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                        <Pressable
                            key={i}
                            onPress={() => setOpenFaq(isOpen ? null : i)}
                            style={({ pressed }) => [
                                styles.faq,
                                i < faqs.length - 1 && styles.divider,
                                pressed && styles.pressed,
                            ]}
                        >
                            <View style={styles.faqHead}>
                                <Text style={styles.faqQuestion}>{faq.q}</Text>
                                <Ionicons
                                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={palette.faint}
                                />
                            </View>
                            {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                        </Pressable>
                    );
                })}

                {/* Legal */}
                <Text style={styles.sectionTitle}>Legal</Text>

                <Pressable
                    onPress={() => openExternalLink(TERMS_URL)}
                    style={({ pressed }) => [styles.row, styles.divider, pressed && styles.pressed]}
                >
                    <Ionicons name="document-text-outline" size={22} color={palette.ink} />
                    <Text style={styles.legalLabel}>{t('helpSupport.termsConditions')}</Text>
                    <Ionicons name="open-outline" size={18} color={palette.faint} />
                </Pressable>

                <Pressable
                    onPress={() => openExternalLink(PRIVACY_URL)}
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                    <Ionicons name="lock-closed-outline" size={22} color={palette.ink} />
                    <Text style={styles.legalLabel}>{t('helpSupport.privacyPolicy')}</Text>
                    <Ionicons name="open-outline" size={18} color={palette.faint} />
                </Pressable>
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
    intro: { ...type.body, color: palette.muted, marginBottom: spacing.xl },

    sectionTitle: {
        ...type.captionStrong,
        color: palette.muted,
        marginTop: spacing.xl,
        marginBottom: spacing.xs,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        paddingVertical: spacing.lg,
    },
    divider: { borderBottomWidth: hairline, borderBottomColor: palette.borderSoft },
    pressed: { opacity: 0.55 },
    rowText: { flex: 1 },
    rowLabel: { ...type.body },
    rowValue: { ...type.caption },
    legalLabel: { ...type.body, flex: 1 },

    schedule: {
        marginTop: spacing.lg,
        padding: spacing.lg,
        borderWidth: hairline,
        borderColor: palette.border,
        borderRadius: radius.md,
        gap: 2,
    },
    scheduleTitle: { ...type.smallStrong, marginBottom: spacing.xs },
    scheduleLine: { ...type.small },

    faq: { paddingVertical: spacing.lg },
    faqHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    faqQuestion: { ...type.bodyStrong, flex: 1 },
    faqAnswer: { ...type.small, marginTop: spacing.sm },
});