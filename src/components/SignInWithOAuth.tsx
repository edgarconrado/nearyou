// components/SignInWithOAuth.tsx
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type SignInWithOAuthProps = {
  mode: 'signin' | 'signup';
};

export default function SignInWithOAuth({ mode }: SignInWithOAuthProps) {
  const router = useRouter();
  const { startOAuthFlow: googleOAuth } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signUp, signIn } = await googleOAuth();

      if (createdSessionId) {
        // Activar la sesión
        await setActive!({ session: createdSessionId });
        
        // IMPORTANTE: Esperar un momento para que Clerk actualice el estado
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Detectar si es un nuevo usuario
        const isNewUser = !!signUp;
        
        if (isNewUser) {
          console.log('🆕 Nuevo usuario detectado');
          console.log('Session ID:', createdSessionId);
          
          // Obtener el usuario completo desde Clerk
          // Nota: En este punto, useUser() en useAuthSync debería tener el usuario
          console.log('✅ El hook useAuthSync se encargará de la sincronización');
        } else {
          console.log('🔄 Usuario existente - Login exitoso');
        }

        // Redirigir al home
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('❌ OAuth error:', err);
      Alert.alert(
        'Error',
        err.errors?.[0]?.longMessage || 'No se pudo iniciar sesión. Inténtalo de nuevo.'
      );
    }
  }, [googleOAuth, router]);

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.button} 
        onPress={handleGoogleSignIn}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.icon}>G</Text>
          <Text style={styles.buttonText}>
            {mode === 'signin' ? 'Continuar con Google' : 'Registrarse con Google'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#4285F4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});