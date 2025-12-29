import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ children, variant, className, ...props }) => {
  const badgeStyle = [
    styles.badge,
    variant === 'blue' && styles.blue,
    variant === 'secondary' && styles.secondary,
    // Add more variants
  ];

  const textStyle = [
    styles.text,
    variant === 'secondary' && styles.secondaryText,
  ];

  return (
    <View style={badgeStyle} {...props}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blue: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  secondaryText: {
    color: '#92400E',
  },
});

export default Badge;