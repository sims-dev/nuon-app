import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ children, style, className, variant }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'blue':
        return { backgroundColor: '#3B82F6' };
      case 'green':
        return { backgroundColor: '#10B981' };
      case 'orange':
        return { backgroundColor: '#F97316' };
      case 'purple':
        return { backgroundColor: '#8B5CF6' };
      case 'gray':
        return { backgroundColor: '#6B7280' };
      default:
        return { backgroundColor: '#F3F4F6' };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'blue':
      case 'green':
      case 'orange':
      case 'purple':
      case 'gray':
        return { color: '#FFFFFF' };
      default:
        return { color: '#374151' };
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, getTextStyle()]}>{children}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});