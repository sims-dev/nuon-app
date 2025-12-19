import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette, radius, shadow, spacing } from '../theme/tokens';

export const NeonCard = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
});

export default NeonCard;
