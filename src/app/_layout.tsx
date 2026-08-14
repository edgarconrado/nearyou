import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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

/**
 * Tema claro fijo. La dirección visual es fondo blanco siempre:
 * un modo oscuro a medias rompería el sistema de hairlines.
 */
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
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    if (!isLoaded || !splashFinished) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, isLoaded, splashFinished, segments]);

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
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
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