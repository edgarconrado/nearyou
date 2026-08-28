// hooks/use-require-auth.ts
//
// Puerta de acceso para acciones que sí necesitan cuenta: favoritos, reseñas
// y perfil. Las demás pantallas se navegan libremente — guía 5.1.1(v).

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export function useRequireAuth() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  /**
   * Ejecuta `action` si hay sesión. Si no, ofrece iniciarla y regresa false
   * para que quien llama pueda detenerse.
   */
  const requireAuth = useCallback(
    (action: () => void, message = 'Inicia sesión para usar esta función.') => {
      if (isSignedIn) {
        action();
        return true;
      }

      Alert.alert('Necesitas una cuenta', message, [
        { text: 'Ahora no', style: 'cancel' },
        { text: 'Iniciar sesión', onPress: () => router.push('/(auth)/sign-in') },
      ]);
      return false;
    },
    [isSignedIn, router]
  );

  return { isSignedIn, requireAuth };
}
