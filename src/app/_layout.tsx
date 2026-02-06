import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { useAuthSync } from '@/hooks/use-auth-sync';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// Token cache para Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Sincronizar usuario con Supabase cuando inicie sesión
  useAuthSync();

  // Redirección automática según el estado de autenticación
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // Usuario autenticado en pantalla de auth -> redirigir a tabs
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      // Usuario no autenticado fuera de auth -> redirigir a sign-in
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, segments, isLoaded]);

  return (
    <LocationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="detail" options={{ headerShown: false }} />
          <Stack.Screen name="my-reviews" options={{ headerShown: false }} />
          <Stack.Screen name="my-visits" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="privacy-settings" options={{ headerShown: false }} />
          <Stack.Screen name="help-support" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LocationProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}>
      <FavoritesProvider>
        <InitialLayout />
      </FavoritesProvider>
    </ClerkProvider>
  );
}