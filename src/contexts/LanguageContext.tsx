import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Importar traducciones estáticamente
import arTranslations from '../translations/ar.json';
import deTranslations from '../translations/de.json';
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import frTranslations from '../translations/fr.json';
import hiTranslations from '../translations/hi.json';
import itTranslations from '../translations/it.json';
import jaTranslations from '../translations/ja.json';
import koTranslations from '../translations/ko.json';
import ptTranslations from '../translations/pt.json';
import ruTranslations from '../translations/ru.json';
import zhTranslations from '../translations/zh.json';

type LanguageCode = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar' | 'hi';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@app_language';

// Mapeo de traducciones
const translationsMap: Record<string, any> = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  pt: ptTranslations,
  de: deTranslations,
  it: itTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  ru: ruTranslations,
  ar: arTranslations,
  hi: hiTranslations,
  ko: koTranslations,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('es');
  const [translations, setTranslations] = useState<any>(esTranslations);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar idioma guardado al iniciar
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage && savedLanguage in translationsMap) {
        setLanguageState(savedLanguage as LanguageCode);
        setTranslations(translationsMap[savedLanguage]);
      } else {
        // Si no hay idioma guardado, guardar español por defecto
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
        setTranslations(esTranslations);
      }
      setIsInitialized(true);
    } catch (error) {
      setTranslations(esTranslations);
      setIsInitialized(true);
    }
  };

  const setLanguage = async (lang: LanguageCode) => {
    try {
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      
      // Actualizar estado
      setLanguageState(lang);
      
      // Cargar traducciones
      const trans = translationsMap[lang];
      if (trans) {
        setTranslations(trans);
      } else {
        setTranslations(esTranslations);
      }
    } catch (error) {
    }
  };

  // Función para obtener traducciones con soporte para claves anidadas
  const t = (key: string): string => {
    if (!translations) {
      console.warn('⚠️ Translations not loaded yet');
      return key;
    }

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retorna la clave si no encuentra la traducción
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return null; // o puedes retornar un componente de loading
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook helper para debugging
export const useLanguageDebug = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
  }, [language]);
  
  return { language, t };
};