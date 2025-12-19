import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ children, onPress, style, variant, size, className }) => {
  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.outline,
    size === 'sm' && styles.small,
    style
  ];

  const textStyle = [
    styles.text,
    variant === 'outline' && styles.outlineText,
    size === 'sm' && styles.smallText
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  outlineText: {
    color: '#7C3AED',
  },
  smallText: {
    fontSize: 12,
  },
});