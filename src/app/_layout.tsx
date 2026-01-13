import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LocationProvider } from '@/contexts/LocationContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LocationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
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
