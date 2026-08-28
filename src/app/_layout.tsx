import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from '@/components/SplashScreen';
import { palette } from '@/constants/design';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SelectedZoneProvider } from '@/contexts/SelectedZoneContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

const NearYouTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.ink,
    background: palette.white,
    card: palette.white,
    text: palette.ink,
    border: palette.border,
  },
};

function InitialLayout() {
  const { isLoaded } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  /**
   * Navegación libre sin sesión — guía 5.1.1(v) de App Store.
   *
   * Explorar zonas, ver negocios y leer reseñas NO requieren cuenta, así que
   * la app arranca directo en las pestañas. El login solo se pide cuando el
   * usuario intenta algo propio de su cuenta: guardar favoritos, escribir una
   * reseña o abrir el perfil.
   *
   * Antes se redirigía a /(auth)/sign-in cuando no había sesión, lo que
   * bloqueaba toda la app tras un muro de registro.
   */
  if (!splashFinished || !isLoaded) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <LocationProvider>
      <ThemeProvider value={NearYouTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.white },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(auth)"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="detail" />
          <Stack.Screen name="my-reviews" />
          <Stack.Screen name="my-visits" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="privacy-settings" />
          <Stack.Screen name="notifications-settings" />
          <Stack.Screen name="language" />
          <Stack.Screen name="help-support" />
          <Stack.Screen name="about" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </LocationProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <SelectedZoneProvider>
            <FavoritesProvider>
              <InitialLayout />
            </FavoritesProvider>
          </SelectedZoneProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}