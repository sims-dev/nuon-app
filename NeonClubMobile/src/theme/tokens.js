// Central design tokens for Neon Club app
import { NEON_COLORS, COLOR_SCHEME } from '../utils/colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadow = {
  neon: {
    shadowColor: NEON_COLORS.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};

// Default palette now follows the requested global color scheme (light theme)
export const palette = {
  ...NEON_COLORS,
  ...COLOR_SCHEME,
  // Light surfaces
  background: COLOR_SCHEME.secondaryGray, // #F9FAFB
  surface: '#FFFFFF',
  border: '#E5E7EB', // gray-200
  accent: COLOR_SCHEME.primaryBlue,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR_SCHEME.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLOR_SCHEME.textSecondary,
  },
  body: {
    fontSize: 14,
    color: COLOR_SCHEME.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default {
  spacing,
  radius,
  shadow,
  palette,
  typography,
};
