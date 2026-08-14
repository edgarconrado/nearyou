// app/(auth)/sign-in.tsx
import { SocialButton } from '@/components/auth/SocialButton';
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { PRIVACY_URL, TERMS_URL } from '@/constants/links';
import { isAppleAuthAvailable, isCancelled, useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Provider = 'google' | 'apple';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [busy, setBusy] = useState<Provider | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    isAppleAuthAvailable().then(setAppleAvailable);
  }, []);

  const run = async (provider: Provider) => {
    if (busy) return;
    setBusy(provider);

    const { error } =
      provider === 'google' ? await signInWithGoogle() : await signInWithApple();

    setBusy(null);

    if (error && !isCancelled(error)) {
      Alert.alert('No pudimos iniciar sesión', error.message);
    }
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('No pudimos abrir el enlace', url);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <Image
          source={require('../../../assets/images/logo_nearyou.png')}
          style={styles.heroImage}
          contentFit="contain"
          transition={200}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Descubre lo que tienes cerca</Text>
        <Text style={styles.subtitle}>
          Lugares, reseñas y ofertas de tu zona. Entra para guardar favoritos y
          dejar tus propias reseñas.
        </Text>

        <View style={styles.actions}>
          <SocialButton
            label="Continuar con Google"
            icon="logo-google"
            onPress={() => run('google')}
            loading={busy === 'google'}
            disabled={!!busy}
          />

          {appleAvailable && (
            <SocialButton
              label="Continuar con Apple"
              icon="logo-apple"
              onPress={() => run('apple')}
              loading={busy === 'apple'}
              disabled={!!busy}
            />
          )}
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Sin contraseñas</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.reassurance}>
          <Ionicons name="lock-closed-outline" size={16} color={palette.muted} />
          <Text style={styles.reassuranceText}>
            Nunca publicamos nada en tu nombre.
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.legal}>
          Al continuar aceptas los{' '}
          <Text
            style={styles.legalLink}
            accessibilityRole="link"
            onPress={() => openLink(TERMS_URL)}
          >
            Términos y Condiciones
          </Text>{' '}
          y el{' '}
          <Text
            style={styles.legalLink}
            accessibilityRole="link"
            onPress={() => openLink(PRIVACY_URL)}
          >
            Aviso de Privacidad
          </Text>{' '}
          de NearYou.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  hero: {
    flex: 1,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heroImage: { width: 132, height: 132, borderRadius: radius.lg },
  content: { paddingHorizontal: spacing.xl },
  title: { ...type.title, marginBottom: spacing.sm },
  subtitle: { ...type.body, color: palette.muted, marginBottom: spacing.xl },
  actions: { gap: spacing.md },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  line: { flex: 1, height: hairline, backgroundColor: palette.border },
  dividerText: { ...type.caption },
  reassurance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  reassuranceText: { ...type.caption },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  legal: { ...type.caption, textAlign: 'center', lineHeight: 18 },
  legalLink: {
    color: palette.ink,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});