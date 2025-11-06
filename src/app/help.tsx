import PrimaryButton from "@/components/PrimaryButton";
import SearchBar from "@/components/SearchBar";
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface ContactOption {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  action: () => void;
  color: string;
}

export default function HelpScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: '¿Cómo busco negocios cerca de mí?',
      answer: 'Ve a la pestaña "Explorar" y usa la barra de búsqueda. La app automáticamente muestra los negocios más cercanos a tu ubicación actual. También puedes filtrar por categoría.',
      category: 'Uso de la app',
    },
    {
      id: 2,
      question: '¿Cómo agrego un negocio a favoritos?',
      answer: 'En la página de detalle de cualquier negocio, toca el ícono de corazón en la esquina superior derecha. Puedes ver todos tus favoritos en tu perfil.',
      category: 'Favoritos',
    },
    {
      id: 3,
      question: '¿Cómo elimino un favorito?',
      answer: 'Ve a tu perfil, sección "Mis Favoritos", y toca el ícono de corazón roto junto al negocio que deseas eliminar. Confirma la acción en el mensaje que aparece.',
      category: 'Favoritos',
    },
    {
      id: 4,
      question: '¿Cómo cambio mi foto de perfil?',
      answer: 'Ve a tu perfil y toca el ícono de cámara en tu avatar. Podrás elegir una foto de tu galería o tomar una nueva.',
      category: 'Cuenta',
    },
    {
      id: 5,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a tu perfil > Editar perfil > Cambiar contraseña. Necesitarás ingresar tu contraseña actual y la nueva contraseña dos veces.',
      category: 'Cuenta',
    },
    {
      id: 6,
      question: '¿Cómo dejo una reseña?',
      answer: 'En la página de detalle del negocio, desplázate hasta la sección de "Opiniones" y toca el botón "Escribir reseña". Califica con estrellas y escribe tu comentario.',
      category: 'Reseñas',
    },
    {
      id: 7,
      question: '¿Puedo editar mi reseña?',
      answer: 'Sí, ve a tu perfil > Mis Reseñas, selecciona la reseña que deseas editar y toca el ícono de lápiz.',
      category: 'Reseñas',
    },
    {
      id: 8,
      question: '¿Cómo activo/desactivo las notificaciones?',
      answer: 'Ve a tu perfil > Notificaciones. Ahí podrás personalizar qué tipo de notificaciones deseas recibir.',
      category: 'Configuración',
    },
    {
      id: 9,
      question: '¿Cómo cierro mi sesión?',
      answer: 'Ve a tu perfil, desplázate hasta el final y toca "Cerrar sesión". Confirma la acción.',
      category: 'Cuenta',
    },
    {
      id: 10,
      question: '¿La app es gratuita?',
      answer: 'Sí, NeerYou es completamente gratuita para todos los usuarios. No hay cargos ocultos ni suscripciones.',
      category: 'General',
    },
    {
      id: 11,
      question: '¿Cómo reporto un problema con un negocio?',
      answer: 'En la página de detalle del negocio, toca el ícono de tres puntos en la esquina superior derecha y selecciona "Reportar problema". Describe el issue y lo revisaremos.',
      category: 'Reportes',
    },
    {
      id: 12,
      question: '¿Cómo elimino mi cuenta?',
      answer: 'Ve a tu perfil > Privacidad > Eliminar cuenta. Esta acción es permanente y no se puede deshacer.',
      category: 'Cuenta',
    },
  ];

  const contactOptions: ContactOption[] = [
    {
      icon: 'mail',
      title: 'Email',
      description: 'soporte@neeryou.com',
      color: Colors.primary,
      action: () => Linking.openURL('mailto:soporte@neeryou.com'),
    },
    {
      icon: 'call',
      title: 'Teléfono',
      description: '+52 33 1234 5678',
      color: Colors.success,
      action: () => Linking.openURL('tel:+523312345678'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      description: 'Chatea con nosotros',
      color: '#25D366',
      action: () => Linking.openURL('https://wa.me/523312345678'),
    },
    {
      icon: 'chatbubbles',
      title: 'Chat en vivo',
      description: 'Lun-Vie 9am-6pm',
      color: Colors.accent,
      action: () => Alert.alert('Chat', 'Función de chat próximamente disponible'),
    },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
          <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Welcome Message */}
          <View style={styles.welcomeCard}>
            <Ionicons name="help-circle" size={48} color={Colors.primary} />
            <Text style={styles.welcomeTitle}>¿En qué podemos ayudarte?</Text>
            <Text style={styles.welcomeText}>
              Encuentra respuestas rápidas o contáctanos directamente
            </Text>
          </View>

          {/* Search FAQs */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar en preguntas frecuentes..."
            style={styles.searchBar}
          />

          {/* Contact Options */}
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color={Colors.white} />
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQs */}
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          
          {filteredFAQs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={Colors.gray} />
              <Text style={styles.emptyText}>No se encontraron preguntas</Text>
              <Text style={styles.emptySubtext}>Intenta con otros términos</Text>
            </View>
          ) : (
            filteredFAQs.map((faq) => (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View style={styles.faqLeft}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{faq.category}</Text>
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))
          )}

          {/* Report Issue */}
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>¿No encontraste lo que buscabas?</Text>
            <Text style={styles.reportText}>
              Envíanos un reporte detallado y te responderemos lo antes posible.
            </Text>
            <PrimaryButton
              title="Reportar un problema"
              icon="alert-circle"
              onPress={() => Linking.openURL('mailto:soporte@neeryou.com?subject=Reporte de Problema')}
              style={styles.reportButton}
            />
          </View>

          {/* Quick Links */}
          <View style={styles.quickLinksCard}>
            <Text style={styles.quickLinksTitle}>Enlaces útiles</Text>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => router.push('/about')}
            >
              <Ionicons name="information-circle" size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Acerca de NeerYou</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => Linking.openURL('https://neeryou.com/terms')}
            >
              <Ionicons name="document-text" size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Términos y Condiciones</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => Linking.openURL('https://neeryou.com/privacy')}
            >
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Política de Privacidad</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
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
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...Colors.shadow,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    ...Colors.shadow,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Colors.shadow,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  faqLeft: {
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  answerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  reportSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    ...Colors.shadow,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  reportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  reportButton: {
    minWidth: 200,
  },
  quickLinksCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    ...Colors.shadow,
  },
  quickLinksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  quickLinkText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
});