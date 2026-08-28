/**
 * NearYou — Sistema de diseño
 * Dirección visual: minimalismo tipo Airbnb.
 *
 * Reglas del sistema:
 *  1. El fondo siempre es blanco. El color vive en las fotos, no en la UI.
 *  2. Solo dos colores de texto: ink (#222222) y muted (#717171).
 *  3. Separación por hairlines (1px #DDDDDD), no por tarjetas con sombra.
 *  4. El acento (#FF385C) se usa con restricción: acciones primarias y favoritos.
 *  5. Los radios son generosos (12/16) y las fotos siempre 12.
 */

import { Platform, StyleSheet } from 'react-native';

export const palette = {
  // Neutros — la base de toda la interfaz
  white: '#FFFFFF',
  ink: '#222222',          // Texto principal, iconos activos, botón oscuro
  muted: '#717171',        // Texto secundario, iconos inactivos, placeholders
  faint: '#B0B0B0',        // Texto terciario, estados deshabilitados
  border: '#DDDDDD',       // Hairline estándar
  borderSoft: '#EBEBEB',   // Hairline interno, separadores de lista
  surface: '#F7F7F7',      // Fondo de inputs y chips inactivos
  skeleton: '#EFEFEF',     // Placeholder de imágenes

  // Acento — usar con restricción
  accent: '#FF385C',
  accentDark: '#E31C5F',
  accentSoft: '#FFF0F3',

  // Semánticos
  success: '#008A05',
  danger: '#C13515',

  // Sobre foto
  scrim: 'rgba(0, 0, 0, 0.18)',
  scrimStrong: 'rgba(0, 0, 0, 0.45)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** Grosor real de 1px en cualquier densidad. */
export const hairline = StyleSheet.hairlineWidth;

const family = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const familyMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

/**
 * Escala tipográfica. Airbnb usa pocos tamaños y muchos pesos:
 * el contraste lo da el peso y el color, no el tamaño.
 */
export const type = StyleSheet.create({
  display: {
    fontFamily: familyMedium,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: palette.ink,
  },
  title: {
    fontFamily: familyMedium,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: palette.ink,
  },
  heading: {
    fontFamily: familyMedium,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: palette.ink,
  },
  subheading: {
    fontFamily: familyMedium,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: palette.ink,
  },
  body: {
    fontFamily: family,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: palette.ink,
  },
  bodyStrong: {
    fontFamily: familyMedium,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: palette.ink,
  },
  small: {
    fontFamily: family,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400',
    color: palette.muted,
  },
  smallStrong: {
    fontFamily: familyMedium,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: palette.ink,
  },
  caption: {
    fontFamily: family,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: palette.muted,
  },
  captionStrong: {
    fontFamily: familyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: palette.ink,
  },
});

/**
 * Una sola sombra en todo el sistema, reservada para elementos que
 * flotan sobre contenido (botón fijo, badge sobre mapa). El resto usa hairlines.
 */
export const elevation = {
  float: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }) as object,
};

export const layout = {
  screenPadding: spacing.lg,
  imageAspect: 1, // Fotos cuadradas en grid, tipo Airbnb
  imageAspectWide: 4 / 3,
  tabBarHeight: 58,
};

export default { palette, spacing, radius, type, elevation, layout, hairline };
