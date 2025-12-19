// Neon Color Palette for Neon Club App
export const NEON_COLORS = {
  // Primary Neon Colors
  neonPurple: '#A855F7', // rgba(168, 85, 247, 1)
  neonPink: '#EC4899',   // rgba(236, 72, 153, 1)
  neonBlue: '#3B82F6',   // rgba(59, 130, 246, 1)
  neonCyan: '#06B6D4',   // rgba(6, 182, 212, 1)
  neonGreen: '#10B981',  // rgba(16, 185, 129, 1)
  neonYellow: '#FBBF24', // rgba(251, 191, 36, 1)
  neonOrange: '#F59E0B', // rgba(245, 158, 11, 1)

  // Glow Effects (with opacity)
  neonPurpleGlow: 'rgba(168, 85, 247, 0.5)',
  neonPinkGlow: 'rgba(236, 72, 153, 0.5)',
  neonBlueGlow: 'rgba(59, 130, 246, 0.5)',
  neonCyanGlow: 'rgba(6, 182, 212, 0.5)',
  neonGreenGlow: 'rgba(16, 185, 129, 0.5)',
  neonYellowGlow: 'rgba(251, 191, 36, 0.5)',

  // Background Colors
  darkBg: '#0A0A0A',
  darkBgSecondary: '#1A1A1A',
  darkBgTertiary: '#2A2A2A',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#666666',

  // Gradients
  gradientPurpleToBlue: ['#A855F7', '#3B82F6'],
  gradientPinkToPurple: ['#EC4899', '#A855F7'],
  gradientBlueToCyan: ['#3B82F6', '#06B6D4'],
  gradientCyanToGreen: ['#06B6D4', '#10B981'],
  gradientGreenToYellow: ['#10B981', '#FBBF24'],
  gradientYellowToOrange: ['#FBBF24', '#EA580C'],

  // Glassmorphism
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBackdropBlur: 'blur(10px)',
};

// Legacy colors for backward compatibility
export const COLORS = {
  primary: '#A855F7',
  secondary: '#EC4899',
  accent: '#3B82F6',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
};

// Global color scheme mapped from the provided design tokens
export const COLOR_SCHEME = {
  primaryPurple: '#7C3AED', // purple-600
  primaryPink: '#EC4899',   // pink-600
  primaryBlue: '#2563EB',   // blue-600
  secondaryGray: '#F9FAFB', // gray-50
  textPrimary: '#111827',   // gray-900
  textSecondary: '#6B7280', // gray-600
  successGreen: '#059669',  // green-600
  warningOrange: '#EA580C', // orange-600
  errorRed: '#DC2626',      // red-600
};

export default NEON_COLORS;