import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface LocationPermissionScreenProps {
  /** Debe lanzar la solicitud de permiso del sistema. */
  onRequestPermission: () => void | Promise<void>;
}

/**
 * Pantalla previa a la solicitud de ubicación.
 *
 * Guía 5.1.1(iv) de App Store: un mensaje personalizado antes del permiso
 * está permitido, pero debe llevar SIEMPRE al diálogo del sistema. Por eso:
 *
 *   · El botón dice «Continuar», no «Activar ubicación». Apple considera que
 *     un texto que promociona el permiso presiona al usuario.
 *   · Se quitó el botón «Continuar sin ubicación». No debe existir forma de
 *     saltarse la solicitud: quien no quiera dar el permiso lo rechaza en el
 *     diálogo del sistema, que es donde corresponde decidir.
 */
export function LocationPermissionScreen({
  onRequestPermission,
}: LocationPermissionScreenProps) {
  const { t } = useLanguage();
  const [requesting, setRequesting] = useState(false);

  const handleContinue = async () => {
    if (requesting) return;
    setRequesting(true);
    await onRequestPermission();
    setRequesting(false);
  };

  const features = [
    t('locationPermission.feature1'),
    t('locationPermission.feature2'),
    t('locationPermission.feature3'),
    t('locationPermission.feature4'),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="location-outline" size={40} color={palette.ink} />
      </View>

      <Text style={styles.title}>{t('locationPermission.title')}</Text>
      <Text style={styles.description}>{t('locationPermission.description')}</Text>

      <View style={styles.features}>
        {features.map((feature) => (
          <View key={feature} style={styles.feature}>
            <Ionicons name="checkmark" size={18} color={palette.ink} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.privacy}>{t('locationPermission.privacyNote')}</Text>

      <Pressable
        onPress={handleContinue}
        disabled={requesting}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        {requesting ? (
          <ActivityIndicator color={palette.white} />
        ) : (
          <Text style={styles.buttonText}>{t('common.continue')}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: palette.white,
  },
  icon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: hairline,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...type.title, textAlign: 'center' },
  description: {
    ...type.body,
    color: palette.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  features: { marginTop: spacing.xl, gap: spacing.md },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureText: { ...type.small, color: palette.ink, flex: 1 },
  privacy: {
    ...type.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  button: {
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  pressed: { opacity: 0.85 },
  buttonText: { ...type.smallStrong, color: palette.white, fontSize: 15 },
});