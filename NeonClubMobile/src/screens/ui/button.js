import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ children, onPress, onClick, variant, size, className, ...props }) => {
  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.outline,
    variant === 'ghost' && styles.ghost,
    size === 'sm' && styles.small,
    // Add more styles as needed
  ];

  const textStyle = [
    styles.text,
    variant === 'outline' && styles.outlineText,
    variant === 'ghost' && styles.ghostText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress || onClick} {...props}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB', // blue-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  outlineText: {
    color: '#7C3AED',
  },
  ghostText: {
    color: '#6B7280',
  },
});

export default Button;