export default {
  // Colores principales (dorado/amarillo)
  primary: '#D4A24F',           // Dorado principal - Botones principales
  primaryDark: '#B8873D',       // Dorado oscuro - Hover states
  primaryMedium: '#E0B666',     // Dorado medio
  primaryLight: '#F5D89A',      // Dorado claro - Fondos, iconos
  primaryVeryLight: '#FFF9ED',  // Crema muy claro - Background

  // Colores complementarios
  accent: '#FFC107',            // Amarillo brillante - Estrellas
  success: '#10B981',           // Verde - Estados positivos, "Abierto"
  error: '#EF4444',             // Rojo - Errores, alertas
  warning: '#F59E0B',           // Naranja advertencia

  // Colores de texto
  textPrimary: '#1F2937',       // Gris muy oscuro - Texto principal
  textSecondary: '#4B5563',     // Gris oscuro - Texto secundario
  textTertiary: '#6B7280',      // Gris medio - Metadatos
  textLight: '#F5D89A',         // Dorado claro - Texto en fondos oscuros

  // Colores neutros
  white: '#FFFFFF',
  black: '#000000',
  darkBg: '#1F2937',            // Fondo oscuro del logo
  gray: '#6B7280',
  grayDark: '#374151',
  grayLight: '#F3F4F6',
  grayVeryLight: '#F9FAFB',

  // Fondos
  background: '#FFF9ED',
  backgroundWhite: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  backgroundDark: '#1F2937',    // Para header

  // Bordes
  border: '#F5D89A',
  borderLight: '#FEF3C7',

  // Estados
  open: '#10B981',              // Verde para "Abierto"
  closed: '#EF4444',            // Rojo para "Cerrado"
  confirmed: '#065F46',         // Verde oscuro para confirmado

  // Gradientes (para usar con LinearGradient)
  gradientPrimary: ['#1F2937', '#374151'],  // Gris oscuro
  gradientGold: ['#D4A24F', '#B8873D'],     // Dorado
  gradientLight: ['#F5D89A', '#E0B666'],
  gradientCard: ['#E0B666', '#D4A24F'],

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Sombras (para usar con shadow properties)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4, // Para Android
  },

  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
};