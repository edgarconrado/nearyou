import { hairline, palette, spacing } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
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
  code: 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar' | 'hi';
  name: string;
  nativeName: string;
  flag: string;
  isPopular?: boolean;
}

export default function LanguageScreen() {
  const { language: selectedLanguage, setLanguage, t } = useLanguage();

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

  const handleLanguageSelect = (languageCode: typeof languages[number]['code']) => {
    const selectedLang = languages.find(l => l.code === languageCode);

    Alert.alert(
      t('language.changeLanguage'),
      t('language.changeLanguageConfirm').replace('{{language}}', selectedLang?.nativeName || ''),
      [
        {
          text: t('language.cancel'),
          style: 'cancel',
        },
        {
          text: t('language.change'),
          onPress: async () => {
            await setLanguage(languageCode);

            // Mostrar mensaje de éxito
            setTimeout(() => {
              Alert.alert(
                t('language.languageUpdated'),
                t('language.languageUpdatedMessage'),
                [
                  {
                    text: t('language.understood'),
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
            <Ionicons name="checkmark-circle" size={24} color={palette.ink} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={palette.ink} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('language.title')}</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="language" size={40} color={palette.ink} />
            <Text style={styles.infoTitle}>{t('language.chooseLanguage')}</Text>
            <Text style={styles.infoText}>
              {t('language.selectLanguageDescription')}
            </Text>
          </View>

          {/* Current Language */}
          <View style={styles.currentLanguageCard}>
            <View style={styles.currentLanguageHeader}>
              <Ionicons name="globe" size={20} color={palette.white} />
              <Text style={styles.currentLanguageLabel}>{t('language.currentLanguage')}</Text>
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
              <Ionicons name="star" size={18} color="#FF9800" />
              <Text style={styles.sectionTitle}>{t('language.popularLanguages')}</Text>
            </View>
            {popularLanguages.map(renderLanguageItem)}
          </View>

          {/* Other Languages */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={18} color={palette.muted} />
              <Text style={styles.sectionTitle}>{t('language.otherLanguages')}</Text>
            </View>
            {otherLanguages.map(renderLanguageItem)}
          </View>

          {/* Help Text */}
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color={palette.ink} />
            <Text style={styles.helpText}>
              {t('language.notFoundLanguage')}
            </Text>
          </View>

          {/* Language Coverage Info */}
          <View style={styles.coverageCard}>
            <Text style={styles.coverageTitle}>{t('language.translationCoverage')}</Text>
            <View style={styles.coverageBar}>
              <View style={styles.coverageProgress} />
            </View>
            <Text style={styles.coverageText}>
              {t('language.translationCoverageDescription')}
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </View>
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
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
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
    color: palette.ink,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.ink,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  currentLanguageCard: {
    backgroundColor: palette.ink,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLanguageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currentLanguageLabel: {
    fontSize: 12,
    color: palette.white,
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
    color: palette.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.ink,
  },
  languageCard: {
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  languageCardSelected: {
    borderColor: palette.ink,
    backgroundColor: '#E3F2FD',
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
    color: palette.ink,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: palette.ink,
    fontWeight: 'bold',
  },
  languageNameEn: {
    fontSize: 13,
    color: palette.muted,
  },
  checkmark: {
    marginLeft: 12,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: palette.ink,
    lineHeight: 18,
  },
  coverageCard: {
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
    marginBottom: 12,
  },
  coverageBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  coverageProgress: {
    height: '100%',
    width: '100%',
    backgroundColor: palette.ink,
  },
  coverageText: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 18,
  },
});