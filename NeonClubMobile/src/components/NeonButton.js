import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette, radius, shadow, spacing, typography } from '../theme/tokens';

export const NeonButton = ({ title, onPress, color = palette.neonCyan, style, textStyle, disabled }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: color, opacity: disabled ? 0.6 : 1 }, style]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.neon,
  },
  text: {
    ...typography.button,
    color: '#0A0A0A',
  },
});

export default NeonButton;
