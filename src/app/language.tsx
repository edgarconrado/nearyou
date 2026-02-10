import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isPopular?: boolean;
}

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  const languages: Language[] = [
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇲🇽',
      isPopular: true,
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isPopular: true,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      isPopular: true,
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      flag: '🇮🇹',
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      isPopular: true,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
    },
  ];

  const popularLanguages = languages.filter(lang => lang.isPopular);
  const otherLanguages = languages.filter(lang => !lang.isPopular);

  const handleLanguageSelect = (languageCode: string) => {
    Alert.alert(
      'Cambiar idioma',
      `¿Deseas cambiar el idioma de la aplicación a ${languages.find(l => l.code === languageCode)?.nativeName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cambiar',
          onPress: () => {
            setSelectedLanguage(languageCode);
            // Aquí irá la lógica para cambiar el idioma real de la app
            
            // Mostrar mensaje de éxito
            setTimeout(() => {
              Alert.alert(
                'Idioma actualizado',
                'El idioma de la aplicación ha sido actualizado. Algunos cambios se aplicarán al reiniciar la app.',
                [
                  {
                    text: 'Entendido',
                    onPress: () => router.back(),
                  },
                ]
              );
            }, 300);
          },
        },
      ]
    );
  };

  const renderLanguageItem = (language: Language) => {
    const isSelected = selectedLanguage === language.code;

    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageCard,
          isSelected && styles.languageCardSelected,
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageLeft}>
          <Text style={styles.flag}>{language.flag}</Text>
          <View style={styles.languageText}>
            <Text style={[
              styles.languageName,
              isSelected && styles.languageNameSelected,
            ]}>
              {language.nativeName}
            </Text>
            <Text style={styles.languageNameEn}>{language.name}</Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
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
          <Text style={styles.headerTitle}>Idioma</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="language" size={40} color={Colors.primary} />
            <Text style={styles.infoTitle}>Elige tu idioma</Text>
            <Text style={styles.infoText}>
              Selecciona el idioma en el que deseas ver la aplicación
            </Text>
          </View>

          {/* Current Language */}
          <View style={styles.currentLanguageCard}>
            <View style={styles.currentLanguageHeader}>
              <Ionicons name="globe" size={20} color={Colors.primary} />
              <Text style={styles.currentLanguageLabel}>Idioma actual</Text>
            </View>
            <View style={styles.currentLanguageContent}>
              <Text style={styles.currentFlag}>
                {languages.find(l => l.code === selectedLanguage)?.flag}
              </Text>
              <Text style={styles.currentLanguageName}>
                {languages.find(l => l.code === selectedLanguage)?.nativeName}
              </Text>
            </View>
          </View>

          {/* Popular Languages */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Idiomas populares</Text>
            </View>
            {popularLanguages.map(renderLanguageItem)}
          </View>

          {/* Other Languages */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={18} color={Colors.textSecondary} />
              <Text style={styles.sectionTitle}>Otros idiomas</Text>
            </View>
            {otherLanguages.map(renderLanguageItem)}
          </View>

          {/* Help Text */}
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
            <Text style={styles.helpText}>
              ¿No encuentras tu idioma? Envíanos una sugerencia a soporte@neeryou.com
            </Text>
          </View>

          {/* Language Coverage Info */}
          <View style={styles.coverageCard}>
            <Text style={styles.coverageTitle}>Cobertura de traducción</Text>
            <View style={styles.coverageBar}>
              <View style={styles.coverageProgress} />
            </View>
            <Text style={styles.coverageText}>
              La interfaz está traducida al 100% en español e inglés. 
              Otros idiomas están en progreso.
            </Text>
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
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...Colors.shadow,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  currentLanguageCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Colors.shadow,
  },
  currentLanguageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currentLanguageLabel: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currentLanguageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentFlag: {
    fontSize: 32,
  },
  currentLanguageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  languageCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Colors.shadow,
  },
  languageCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryVeryLight,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  languageNameEn: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  checkmark: {
    marginLeft: 12,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  coverageCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    ...Colors.shadow,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  coverageBar: {
    height: 8,
    backgroundColor: Colors.grayLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  coverageProgress: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.primary,
  },
  coverageText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});