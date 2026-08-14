import { hairline, palette, spacing } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            id: 1,
            question: t('helpSupport.faq1q'),
            answer: t('helpSupport.faq1a'),
        },
        {
            id: 2,
            question: t('helpSupport.faq2q'),
            answer: t('helpSupport.faq2a'),
        },
        {
            id: 3,
            question: t('helpSupport.faq3q'),
            answer: t('helpSupport.faq3a'),
        },
        {
            id: 4,
            question: t('helpSupport.faq4q'),
            answer: t('helpSupport.faq4a'),
        },
        {
            id: 5,
            question: t('helpSupport.faq5q'),
            answer: t('helpSupport.faq5a'),
        },
        {
            id: 6,
            question: t('helpSupport.faq6q'),
            answer: t('helpSupport.faq6a'),
        },
        {
            id: 7,
            question: t('helpSupport.faq7q'),
            answer: t('helpSupport.faq7a'),
        },
        {
            id: 8,
            question: t('helpSupport.faq8q'),
            answer: t('helpSupport.faq8a'),
        },
    ];

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleCallSupport = () => {
        Linking.openURL('tel:+524341234567');
    };

    const handleEmailSupport = () => {
        Linking.openURL('mailto:soporte@tuapp.com');
    };

    const handleWhatsApp = () => {
        Linking.openURL('https://wa.me/524341234567');
    };

    const handleSubmitMessage = () => {
        if (message.trim().length < 10) {
            Alert.alert(t('common.error'), t('helpSupport.messageTooShort'));
            return;
        }

        Alert.alert(
            t('helpSupport.messageSent'),
            t('helpSupport.messageSentDesc'),
            [
                {
                    text: t('common.ok'),
                    onPress: () => {
                        setMessage('');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('helpSupport.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Contacto rápido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('helpSupport.quickContact')}</Text>

                    <View style={styles.quickContactGrid}>
                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleCallSupport}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="call" size={28} color="#2196F3" />
                            </View>
                            <Text style={styles.quickContactLabel}>{t('helpSupport.call')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleEmailSupport}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="mail" size={28} color="#FF9800" />
                            </View>
                            <Text style={styles.quickContactLabel}>{t('helpSupport.email')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleWhatsApp}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="logo-whatsapp" size={28} color={palette.success} />
                            </View>
                            <Text style={styles.quickContactLabel}>{t('helpSupport.whatsapp')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={() => Linking.openURL('https://www.facebook.com/tuapp')}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                            </View>
                            <Text style={styles.quickContactLabel}>{t('helpSupport.facebook')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Horario de atención */}
                <View style={styles.infoBox}>
                    <Ionicons name="time-outline" size={20} color={palette.ink} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>{t('helpSupport.scheduleTitle')}</Text>
                        <Text style={styles.infoText}>
                            {t('helpSupport.scheduleWeekdays')}{'\n'}
                            {t('helpSupport.scheduleWeekend')}{'\n'}
                            {t('helpSupport.scheduleSunday')}
                        </Text>
                    </View>
                </View>

                {/* Preguntas frecuentes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('helpSupport.commonQuestions')}</Text>

                    <View style={styles.faqContainer}>
                        {faqs.map((faq) => (
                            <View key={faq.id} style={styles.faqItem}>
                                <TouchableOpacity
                                    style={styles.faqQuestion}
                                    onPress={() => toggleFaq(faq.id)}
                                >
                                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                                    <Ionicons
                                        name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={palette.muted}
                                    />
                                </TouchableOpacity>

                                {expandedFaq === faq.id && (
                                    <View style={styles.faqAnswer}>
                                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Formulario de contacto */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('helpSupport.sendMessage')}</Text>
                    <Text style={styles.sectionDescription}>
                        {t('helpSupport.sendMessageDesc')}
                    </Text>

                    <View style={styles.messageForm}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder={t('helpSupport.messagePlaceholder')}
                            placeholderTextColor={palette.muted}
                            multiline
                            numberOfLines={6}
                            value={message}
                            onChangeText={setMessage}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>
                            {message.length} / 500
                        </Text>

                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSubmitMessage}
                        >
                            <Ionicons name="send" size={20} color={palette.white} />
                            <Text style={styles.sendButtonText}>{t('helpSupport.sendButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Enlaces útiles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('helpSupport.usefulLinks')}</Text>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="document-text-outline" size={22} color={palette.ink} />
                        <Text style={styles.linkText}>{t('helpSupport.helpCenter')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={palette.faint} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="book-outline" size={22} color={palette.ink} />
                        <Text style={styles.linkText}>{t('helpSupport.userGuide')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={palette.faint} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="videocam-outline" size={22} color={palette.ink} />
                        <Text style={styles.linkText}>{t('helpSupport.videoTutorials')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={palette.faint} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="chatbubbles-outline" size={22} color={palette.ink} />
                        <Text style={styles.linkText}>{t('helpSupport.community')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={palette.faint} />
                    </TouchableOpacity>
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
    section: {
        backgroundColor: palette.white,
        padding: 20,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 14,
        color: palette.muted,
        lineHeight: 20,
        marginBottom: 16,
    },
    quickContactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
    },
    quickContactCard: {
        width: '22%',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickContactLabel: {
        fontSize: 12,
        color: palette.muted,
        textAlign: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 16,
        margin: 16,
        marginBottom: 8,
        borderRadius: 12,
        gap: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: palette.ink,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: palette.ink,
        lineHeight: 18,
    },
    faqContainer: {
        marginTop: 8,
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: palette.ink,
        marginRight: 12,
    },
    faqAnswer: {
        paddingBottom: 16,
        paddingRight: 32,
    },
    faqAnswerText: {
        fontSize: 14,
        color: palette.muted,
        lineHeight: 20,
    },
    messageForm: {
        marginTop: 8,
    },
    messageInput: {
        borderWidth: 1,
        borderColor: palette.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: palette.ink,
        minHeight: 120,
        backgroundColor: '#F9F9F9',
    },
    charCount: {
        fontSize: 13,
        color: palette.muted,
        marginTop: 8,
        textAlign: 'right',
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: palette.ink,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: palette.white,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
    },
    linkText: {
        flex: 1,
        fontSize: 15,
        color: palette.ink,
    },
});