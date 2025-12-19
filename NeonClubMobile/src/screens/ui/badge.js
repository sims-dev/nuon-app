import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ children, variant, className, ...props }) => {
  const badgeStyle = [
    styles.badge,
    variant === 'blue' && styles.blue,
    // Add more variants
  ];

  return (
    <View style={badgeStyle} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  blue: {
    backgroundColor: '#3B82F6',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default Badge;