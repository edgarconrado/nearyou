// Paleta de colores en tonos ladrillo/naranja para TurismoLocal

export default {
  // Colores principales (naranja/ladrillo)
  primary: '#9A3412',           // Naranja oscuro - Botones principales
  primaryDark: '#7C2D12',       // Naranja muy oscuro - Hover states
  primaryMedium: '#C2410C',     // Naranja medio
  primaryLight: '#FED7AA',      // Naranja claro - Fondos, iconos
  primaryVeryLight: '#FFF7ED',  // Naranja muy claro - Background

  // Colores complementarios
  accent: '#FBBF24',            // Amarillo - Estrellas, medallas
  success: '#10B981',           // Verde - Estados positivos, "Abierto"
  error: '#EF4444',             // Rojo - Errores, alertas
  warning: '#F59E0B',           // Naranja advertencia

  // Colores de texto
  textPrimary: '#78350F',       // Marrón oscuro - Texto principal
  textSecondary: '#C2410C',     // Naranja medio - Texto secundario
  textTertiary: '#EA580C',      // Naranja claro - Metadatos
  textLight: '#FED7AA',         // Naranja muy claro - Texto en fondos oscuros

  // Colores neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  grayDark: '#1F2937',
  grayLight: '#F3F4F6',
  grayVeryLight: '#F9FAFB',

  // Fondos
  background: '#FFF7ED',
  backgroundWhite: '#FFFFFF',
  backgroundCard: '#FFFFFF',

  // Bordes
  border: '#FED7AA',
  borderLight: '#FEF3C7',

  // Estados
  open: '#10B981',              // Verde para "Abierto"
  closed: '#EF4444',            // Rojo para "Cerrado"
  confirmed: '#065F46',         // Verde oscuro para confirmado

  // Gradientes (para usar con LinearGradient)
  gradientPrimary: ['#9A3412', '#7C2D12'],
  gradientLight: ['#FED7AA', '#FDBA74'],
  gradientCard: ['#FDBA74', '#FB923C'],

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