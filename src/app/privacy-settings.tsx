import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettingsScreen() {
    const router = useRouter();

    const [profilePublic, setProfilePublic] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [allowMessages, setAllowMessages] = useState(true);
    const [shareLocation, setShareLocation] = useState(true);
    const [showActivity, setShowActivity] = useState(true);

    const handleDeleteAccount = () => {
        Alert.alert(
            'Eliminar cuenta',
            '¿Estás seguro? Esta acción no se puede deshacer y perderás toda tu información.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada'),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacidad y seguridad</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visibilidad del perfil</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="eye" size={22} color="#003D7A" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Perfil público</Text>
                                <Text style={styles.settingDescription}>
                                    Otros usuarios pueden ver tu perfil
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={profilePublic}
                            onValueChange={setProfilePublic}
                            trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail" size={22} color="#FF9800" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Mostrar email</Text>
                                <Text style={styles.settingDescription}>
                                    Tu correo será visible en tu perfil
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={showEmail}
                            onValueChange={setShowEmail}
                            trackColor={{ false: '#D0D0D0', true: '#FF9800' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="call" size={22} color="#4CAF50" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Mostrar teléfono</Text>
                                <Text style={styles.settingDescription}>
                                    Tu número será visible en tu perfil
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={showPhone}
                            onValueChange={setShowPhone}
                            trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interacciones</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbubbles" size={22} color="#2196F3" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Permitir mensajes</Text>
                                <Text style={styles.settingDescription}>
                                    Otros usuarios pueden enviarte mensajes
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={allowMessages}
                            onValueChange={setAllowMessages}
                            trackColor={{ false: '#D0D0D0', true: '#2196F3' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="flame" size={22} color="#9C27B0" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Mostrar actividad</Text>
                                <Text style={styles.settingDescription}>
                                    Muestra tus reseñas y lugares visitados
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={showActivity}
                            onValueChange={setShowActivity}
                            trackColor={{ false: '#D0D0D0', true: '#9C27B0' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ubicación</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="location" size={22} color="#FF3B30" />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingText}>Compartir ubicación</Text>
                                <Text style={styles.settingDescription}>
                                    Permite encontrar lugares cercanos
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={shareLocation}
                            onValueChange={setShareLocation}
                            trackColor={{ false: '#D0D0D0', true: '#FF3B30' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos y seguridad</Text>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="download-outline" size={22} color="#003D7A" />
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionText}>Descargar mis datos</Text>
                            <Text style={styles.actionDescription}>
                                Solicita una copia de tu información
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="document-text-outline" size={22} color="#003D7A" />
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionText}>Política de privacidad</Text>
                            <Text style={styles.actionDescription}>
                                Lee nuestra política de privacidad
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#003D7A" />
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionText}>Términos de servicio</Text>
                            <Text style={styles.actionDescription}>
                                Consulta nuestros términos
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerSection}>
                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={handleDeleteAccount}
                    >
                        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                        <View style={styles.dangerTextContainer}>
                            <Text style={styles.dangerText}>Eliminar mi cuenta</Text>
                            <Text style={styles.dangerDescription}>
                                Esta acción es permanente y no se puede deshacer
                            </Text>
                        </View>
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
        marginBottom: 16,
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
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    actionDescription: {
        fontSize: 12,
        color: '#999',
        lineHeight: 16,
    },
    dangerSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 12,
    },
    dangerTextContainer: {
        flex: 1,
    },
    dangerText: {
        fontSize: 15,
        color: '#FF3B30',
        fontWeight: '600',
        marginBottom: 2,
    },
    dangerDescription: {
        fontSize: 12,
        color: '#999',
        lineHeight: 16,
    },
});