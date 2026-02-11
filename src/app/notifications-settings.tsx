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

    const handleToggle = async (key: keyof typeof settings, value: boolean) => {
        if (!settings) return;
        await updateSetting(key as any, value);
    };

    const handleResetDefaults = () => {
        Alert.alert(
            'Restaurar valores por defecto',
            '¿Estás seguro de que deseas restaurar las notificaciones a sus valores por defecto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    style: 'destructive',
                    onPress: resetToDefaults,
                },
            ]
        );
    };

    const handleTestNotification = () => {
        Alert.alert(
            'Notificación de prueba',
            'Se enviará una notificación de prueba a tu dispositivo.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Enviar',
                    onPress: () => {
                        // TODO: Implementar envío de notificación de prueba
                        Alert.alert(
                            '📬 Notificación enviada',
                            'Deberías recibir una notificación de prueba en unos segundos.'
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
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003D7A" />
                    <Text style={styles.loadingText}>Cargando configuración...</Text>
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
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Notificaciones Push */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones push</Text>
                    <Text style={styles.sectionDescription}>
                        Recibe alertas en tiempo real sobre actividades importantes
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications" size={22} color="#003D7A" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Activar notificaciones push</Text>
                                <Text style={styles.settingDescription}>
                                    Recibir notificaciones en tu dispositivo
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
                            <Text style={styles.testButtonText}>Enviar notificación de prueba</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Notificaciones por Email */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones por email</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail" size={22} color="#003D7A" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Recibir emails</Text>
                                <Text style={styles.settingDescription}>
                                    Recibir actualizaciones por correo electrónico
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
                                Todas las notificaciones desactivadas
                            </Text>
                            <Text style={styles.warningText}>
                                No recibirás ninguna notificación. Activa al menos push o email para recibir actualizaciones.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Preferencias de Contenido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferencias de contenido</Text>
                    <Text style={styles.sectionDescription}>
                        Selecciona qué tipo de notificaciones deseas recibir
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="location" size={22} color="#34C759" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Nuevos lugares</Text>
                                <Text style={styles.settingDescription}>
                                    Notificar sobre lugares nuevos cerca de ti
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
                                <Text style={styles.settingText}>Ofertas y promociones</Text>
                                <Text style={styles.settingDescription}>
                                    Descuentos especiales y ofertas destacadas
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
                                <Text style={styles.settingText}>Reseñas y comentarios</Text>
                                <Text style={styles.settingDescription}>
                                    Cuando alguien responda a tus reseñas
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
                                <Text style={styles.settingText}>Mensajes</Text>
                                <Text style={styles.settingDescription}>
                                    Mensajes directos de otros usuarios
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
                                <Text style={styles.settingText}>Actualizaciones de la app</Text>
                                <Text style={styles.settingDescription}>
                                    Nuevas funciones y mejoras
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
                                Notificaciones configuradas
                            </Text>
                            <Text style={styles.summaryText}>
                                {settings.push_enabled && settings.email_enabled && 'Recibirás notificaciones por push y email'}
                                {settings.push_enabled && !settings.email_enabled && 'Recibirás notificaciones push'}
                                {!settings.push_enabled && settings.email_enabled && 'Recibirás notificaciones por email'}
                                {' • '}
                                {[
                                    settings.notify_new_places && 'Lugares',
                                    settings.notify_offers && 'Ofertas',
                                    settings.notify_reviews && 'Reseñas',
                                    settings.notify_messages && 'Mensajes',
                                    settings.notify_updates && 'Actualizaciones',
                                ].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Información */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#003D7A" />
                    <Text style={styles.infoText}>
                        Todas las configuraciones se guardan automáticamente. Puedes cambiar estas preferencias en cualquier momento.
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
                            Restaurar valores por defecto
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