import { useLanguage } from '@/contexts/LanguageContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsSettingsScreen() {
    const router = useRouter();
    const { userId } = useAuth();
    const { settings, loading, updateSetting, resetToDefaults } = useUserSettings(userId);
    const { t } = useLanguage();

    const handleToggle = async (key: keyof typeof settings, value: boolean) => {
        if (!settings) return;
        await updateSetting(key as any, value);
    };

    const handleResetDefaults = () => {
        Alert.alert(
            t('notifications.resetDefaultsTitle'),
            t('notifications.resetDefaultsDesc'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('notifications.restore'),
                    style: 'destructive',
                    onPress: resetToDefaults,
                },
            ]
        );
    };

    const handleTestNotification = () => {
        Alert.alert(
            t('notifications.testNotificationTitle'),
            t('notifications.testNotificationDesc'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.send'),
                    onPress: () => {
                        // TODO: Implementar envío de notificación de prueba
                        Alert.alert(
                            t('notifications.testNotificationSent'),
                            t('notifications.testNotificationSentDesc')
                        );
                    },
                },
            ]
        );
    };

    if (loading || !settings) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003D7A" />
                    <Text style={styles.loadingText}>{t('notifications.loading')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Verificar si al menos una notificación está habilitada
    const hasNotificationsEnabled = settings.push_enabled || settings.email_enabled;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Notificaciones Push */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('notifications.pushTitle')}</Text>
                    <Text style={styles.sectionDescription}>
                        {t('notifications.pushDesc')}
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications" size={22} color="#003D7A" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.enablePush')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.enablePushDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.push_enabled ?? true}
                            onValueChange={(value) => handleToggle('push_enabled', value)}
                            trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {settings.push_enabled && (
                        <TouchableOpacity
                            style={styles.testButton}
                            onPress={handleTestNotification}
                        >
                            <Ionicons name="send-outline" size={18} color="#003D7A" />
                            <Text style={styles.testButtonText}>{t('notifications.testNotification')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Notificaciones por Email */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('notifications.emailTitle')}</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail" size={22} color="#003D7A" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.receiveEmails')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.receiveEmailsDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.email_enabled ?? true}
                            onValueChange={(value) => handleToggle('email_enabled', value)}
                            trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* Advertencia si todas las notificaciones están desactivadas */}
                {!hasNotificationsEnabled && (
                    <View style={styles.warningBox}>
                        <Ionicons name="warning-outline" size={24} color="#FF9800" />
                        <View style={styles.warningTextContainer}>
                            <Text style={styles.warningTitle}>
                                {t('notifications.allDisabledTitle')}
                            </Text>
                            <Text style={styles.warningText}>
                                {t('notifications.allDisabledDesc')}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Preferencias de Contenido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('notifications.contentPreferences')}</Text>
                    <Text style={styles.sectionDescription}>
                        {t('notifications.contentPreferencesDesc')}
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="location" size={22} color="#34C759" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.newPlaces')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.newPlacesDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notify_new_places ?? true}
                            onValueChange={(value) => handleToggle('notify_new_places', value)}
                            trackColor={{ false: '#D0D0D0', true: '#34C759' }}
                            thumbColor="#FFFFFF"
                            disabled={!hasNotificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="pricetag" size={22} color="#FF9500" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.offers')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.offersDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notify_offers ?? true}
                            onValueChange={(value) => handleToggle('notify_offers', value)}
                            trackColor={{ false: '#D0D0D0', true: '#FF9500' }}
                            thumbColor="#FFFFFF"
                            disabled={!hasNotificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbox-ellipses" size={22} color="#007AFF" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.reviews')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.reviewsDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notify_reviews ?? true}
                            onValueChange={(value) => handleToggle('notify_reviews', value)}
                            trackColor={{ false: '#D0D0D0', true: '#007AFF' }}
                            thumbColor="#FFFFFF"
                            disabled={!hasNotificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail-open" size={22} color="#5856D6" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.messages')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.messagesDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notify_messages ?? false}
                            onValueChange={(value) => handleToggle('notify_messages', value)}
                            trackColor={{ false: '#D0D0D0', true: '#5856D6' }}
                            thumbColor="#FFFFFF"
                            disabled={!hasNotificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="information-circle" size={22} color="#8E8E93" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>{t('notifications.updates')}</Text>
                                <Text style={styles.settingDescription}>
                                    {t('notifications.updatesDesc')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notify_updates ?? true}
                            onValueChange={(value) => handleToggle('notify_updates', value)}
                            trackColor={{ false: '#D0D0D0', true: '#8E8E93' }}
                            thumbColor="#FFFFFF"
                            disabled={!hasNotificationsEnabled}
                        />
                    </View>
                </View>

                {/* Resumen de notificaciones activas */}
                {hasNotificationsEnabled && (
                    <View style={styles.summaryBox}>
                        <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                        <View style={styles.summaryTextContainer}>
                            <Text style={styles.summaryTitle}>
                                {t('notifications.notificationsSummary')}
                            </Text>
                            <Text style={styles.summaryText}>
                                {settings.push_enabled && settings.email_enabled && t('notifications.receiveNotificationsPushEmail')}
                                {settings.push_enabled && !settings.email_enabled && t('notifications.receiveNotificationsPush')}
                                {!settings.push_enabled && settings.email_enabled && t('notifications.receiveNotificationsEmail')}
                                {' • '}
                                {[
                                    settings.notify_new_places && t('notifications.places'),
                                    settings.notify_offers && t('notifications.offers'),
                                    settings.notify_reviews && t('notifications.reviews'),
                                    settings.notify_messages && t('notifications.messagesShort'),
                                    settings.notify_updates && t('notifications.updatesShort'),
                                ].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Información */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#003D7A" />
                    <Text style={styles.infoText}>
                        {t('notifications.infoText')}
                    </Text>
                </View>

                {/* Botón de restaurar valores por defecto */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={handleResetDefaults}
                    >
                        <Ionicons name="refresh-outline" size={22} color="#003D7A" />
                        <Text style={styles.resetButtonText}>
                            {t('notifications.resetDefaults')}
                        </Text>
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
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#003D7A',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 16,
        lineHeight: 18,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        color: '#999',
        lineHeight: 16,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    testButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#003D7A',
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF8E1',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F57C00',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 13,
        color: '#F57C00',
        lineHeight: 18,
    },
    summaryBox: {
        flexDirection: 'row',
        backgroundColor: '#F1F8E9',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#DCEDC8',
    },
    summaryTextContainer: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#558B2F',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 13,
        color: '#558B2F',
        lineHeight: 18,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#003D7A',
        lineHeight: 18,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        borderWidth: 1,
        borderColor: '#003D7A',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#003D7A',
    },
});