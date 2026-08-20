// app/(auth)/sign-in.tsx
import { SocialButton } from '@/components/auth/SocialButton';
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { openExternalLink, PRIVACY_URL, TERMS_URL } from '@/constants/links';
import { isCancelled, useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Provider = 'google' | 'apple';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [busy, setBusy] = useState<Provider | null>(null);

  /**
   * En iOS el botón de Apple se muestra SIEMPRE — guía 4.8 de App Store.
   *
   * Antes se ocultaba según `isAppleAuthAvailable()`. Si esa comprobación
   * fallaba (por detección del módulo nativo, por ejemplo), el botón
   * desaparecía y Apple rechazaba la app por no ofrecer Sign in with Apple.
   * Es preferible mostrarlo y manejar el error al pulsarlo, que esconderlo.
   */
  const showApple = Platform.OS === 'ios';

  const run = async (provider: Provider) => {
    if (busy) return;
    setBusy(provider);

    const { error } =
      provider === 'google' ? await signInWithGoogle() : await signInWithApple();

    setBusy(null);

    if (error) {
      if (!isCancelled(error)) {
        Alert.alert('No pudimos iniciar sesión', error.message);
      }
      return;
    }

    // Sesión iniciada: volver a donde estaba el usuario
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
        style={styles.close}
      >
        <Ionicons name="close" size={26} color={palette.ink} />
      </Pressable>

      <View style={styles.hero}>
        <Image
          source={require('../../../assets/images/logo_nearyou.png')}
          style={styles.heroImage}
          contentFit="contain"
          transition={200}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>
          Guarda tus lugares favoritos y comparte reseñas. Puedes seguir
          explorando sin cuenta cuando quieras.
        </Text>

        <View style={styles.actions}>
          {showApple && (
            <SocialButton
              label="Continuar con Apple"
              icon="logo-apple"
              onPress={() => run('apple')}
              loading={busy === 'apple'}
              disabled={!!busy}
            />
          )}

          <SocialButton
            label="Continuar con Google"
            icon="logo-google"
            onPress={() => run('google')}
            loading={busy === 'google'}
            disabled={!!busy}
          />
        </View>

        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          style={({ pressed }) => [styles.skip, pressed && styles.skipPressed]}
        >
          <Text style={styles.skipText}>Seguir explorando sin cuenta</Text>
        </Pressable>

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
            onPress={() => openExternalLink(TERMS_URL)}
          >
            Términos y Condiciones
          </Text>{' '}
          y el{' '}
          <Text
            style={styles.legalLink}
            accessibilityRole="link"
            onPress={() => openExternalLink(PRIVACY_URL)}
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
  close: { position: 'absolute', top: 0, left: spacing.lg, zIndex: 10, padding: spacing.md },
  hero: {
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heroImage: { width: 120, height: 120, borderRadius: radius.lg },
  content: { paddingHorizontal: spacing.xl },
  title: { ...type.title, marginBottom: spacing.sm },
  subtitle: { ...type.body, color: palette.muted, marginBottom: spacing.xl },
  actions: { gap: spacing.md },
  skip: {
    marginTop: spacing.lg,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipPressed: { opacity: 0.6 },
  skipText: { ...type.smallStrong, textDecorationLine: 'underline' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
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
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  legal: { ...type.caption, textAlign: 'center', lineHeight: 18 },
  legalLink: {
    color: palette.ink,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
