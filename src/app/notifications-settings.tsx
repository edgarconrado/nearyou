import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [newPlacesEnabled, setNewPlacesEnabled] = useState(true);
    const [offersEnabled, setOffersEnabled] = useState(true);
    const [reviewsEnabled, setReviewsEnabled] = useState(true);
    const [messagesEnabled, setMessagesEnabled] = useState(false);
    const [updatesEnabled, setUpdatesEnabled] = useState(true);

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
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones push</Text>
                    <Text style={styles.sectionDescription}>
                        Recibe alertas en tiempo real sobre actividades importantes
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications" size={22} color="#003D7A" />
                            <Text style={styles.settingText}>Activar notificaciones push</Text>
                        </View>
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones por email</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail" size={22} color="#003D7A" />
                            <Text style={styles.settingText}>Recibir emails</Text>
                        </View>
                        <Switch
                            value={emailEnabled}
                            onValueChange={setEmailEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferencias de contenido</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="location" size={22} color="#4CAF50" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Nuevos lugares</Text>
                                <Text style={styles.settingDescription}>
                                    Notificar sobre lugares nuevos cerca de ti
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={newPlacesEnabled}
                            onValueChange={setNewPlacesEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="pricetag" size={22} color="#FF9800" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Ofertas y promociones</Text>
                                <Text style={styles.settingDescription}>
                                    Descuentos especiales y ofertas destacadas
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={offersEnabled}
                            onValueChange={setOffersEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#FF9800' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbox-ellipses" size={22} color="#2196F3" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Reseñas y comentarios</Text>
                                <Text style={styles.settingDescription}>
                                    Cuando alguien responda a tus reseñas
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={reviewsEnabled}
                            onValueChange={setReviewsEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#2196F3' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail-open" size={22} color="#9C27B0" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Mensajes</Text>
                                <Text style={styles.settingDescription}>
                                    Mensajes directos de otros usuarios
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={messagesEnabled}
                            onValueChange={setMessagesEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#9C27B0' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="information-circle" size={22} color="#607D8B" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Actualizaciones de la app</Text>
                                <Text style={styles.settingDescription}>
                                    Nuevas funciones y mejoras
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={updatesEnabled}
                            onValueChange={setUpdatesEnabled}
                            trackColor={{ false: '#D0D0D0', true: '#607D8B' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#003D7A" />
                    <Text style={styles.infoText}>
                        Puedes cambiar estas preferencias en cualquier momento desde tu configuración
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#003D7A',
        lineHeight: 18,
    },
});