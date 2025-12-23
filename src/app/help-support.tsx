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
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            id: 1,
            question: '¿Cómo puedo agregar un lugar a favoritos?',
            answer: 'Para agregar un lugar a favoritos, simplemente toca el ícono de corazón en la parte superior derecha de la página del negocio. El lugar aparecerá en tu sección "Mis favoritos".',
        },
        {
            id: 2,
            question: '¿Cómo escribo una reseña?',
            answer: 'Ve a la página del negocio, baja hasta la sección de opiniones y presiona el botón "Escribir una opinión". Selecciona tu calificación, escribe tu comentario y opcionalmente agrega fotos.',
        },
        {
            id: 3,
            question: '¿Puedo editar o eliminar mi reseña?',
            answer: 'Sí, ve a tu perfil > Mis reseñas. Toca los tres puntos en tu reseña y selecciona "Editar" o "Eliminar".',
        },
        {
            id: 4,
            question: '¿Cómo cambio mi foto de perfil?',
            answer: 'Ve a tu perfil, toca tu foto actual y selecciona "Cambiar foto". Puedes tomar una foto nueva o elegir una de tu galería.',
        },
        {
            id: 5,
            question: '¿Cómo desactivo las notificaciones?',
            answer: 'Ve a tu perfil > Configuración > Notificaciones. Desde ahí puedes personalizar qué tipo de notificaciones deseas recibir.',
        },
        {
            id: 6,
            question: '¿Los negocios pueden responder a mis reseñas?',
            answer: 'Sí, los propietarios de negocios pueden responder a las reseñas. Recibirás una notificación cuando respondan a tu reseña.',
        },
        {
            id: 7,
            question: '¿Cómo reporto contenido inapropiado?',
            answer: 'Puedes reportar reseñas o contenido inapropiado tocando el ícono de tres puntos y seleccionando "Reportar". Nuestro equipo revisará el reporte.',
        },
        {
            id: 8,
            question: '¿Puedo eliminar mi cuenta?',
            answer: 'Sí, ve a Perfil > Configuración > Privacidad y seguridad > Eliminar mi cuenta. Ten en cuenta que esta acción es permanente.',
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
            Alert.alert('Mensaje muy corto', 'Por favor escribe al menos 10 caracteres');
            return;
        }

        Alert.alert(
            'Mensaje enviado',
            'Gracias por contactarnos. Responderemos a la brevedad.',
            [
                {
                    text: 'OK',
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
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayuda y soporte</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Contacto rápido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contacto rápido</Text>

                    <View style={styles.quickContactGrid}>
                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleCallSupport}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="call" size={28} color="#2196F3" />
                            </View>
                            <Text style={styles.quickContactLabel}>Llamar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleEmailSupport}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="mail" size={28} color="#FF9800" />
                            </View>
                            <Text style={styles.quickContactLabel}>Email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={handleWhatsApp}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="logo-whatsapp" size={28} color="#4CAF50" />
                            </View>
                            <Text style={styles.quickContactLabel}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickContactCard}
                            onPress={() => Linking.openURL('https://www.facebook.com/tuapp')}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                            </View>
                            <Text style={styles.quickContactLabel}>Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Horario de atención */}
                <View style={styles.infoBox}>
                    <Ionicons name="time-outline" size={20} color="#003D7A" />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Horario de atención</Text>
                        <Text style={styles.infoText}>
                            Lunes a Viernes: 9:00 AM - 6:00 PM{'\n'}
                            Sábados: 10:00 AM - 2:00 PM
                        </Text>
                    </View>
                </View>

                {/* Preguntas frecuentes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>

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
                                        color="#666"
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
                    <Text style={styles.sectionTitle}>Envíanos un mensaje</Text>
                    <Text style={styles.sectionDescription}>
                        ¿No encontraste respuesta a tu pregunta? Escríbenos y te responderemos pronto.
                    </Text>

                    <View style={styles.messageForm}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Describe tu problema o pregunta..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={6}
                            value={message}
                            onChangeText={setMessage}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>
                            {message.length} / 500 caracteres
                        </Text>

                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSubmitMessage}
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                            <Text style={styles.sendButtonText}>Enviar mensaje</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Enlaces útiles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enlaces útiles</Text>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="document-text-outline" size={22} color="#003D7A" />
                        <Text style={styles.linkText}>Centro de ayuda completo</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="book-outline" size={22} color="#003D7A" />
                        <Text style={styles.linkText}>Guía de usuario</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="videocam-outline" size={22} color="#003D7A" />
                        <Text style={styles.linkText}>Tutoriales en video</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="chatbubbles-outline" size={22} color="#003D7A" />
                        <Text style={styles.linkText}>Comunidad y foros</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
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
        color: '#666',
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
        color: '#003D7A',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#003D7A',
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
        color: '#333',
        marginRight: 12,
    },
    faqAnswer: {
        paddingBottom: 16,
        paddingRight: 32,
    },
    faqAnswerText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    messageForm: {
        marginTop: 8,
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#333',
        minHeight: 120,
        backgroundColor: '#F9F9F9',
    },
    charCount: {
        fontSize: 13,
        color: '#999',
        marginTop: 8,
        textAlign: 'right',
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#003D7A',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
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
        color: '#333',
    },
});