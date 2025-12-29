import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Label = ({ children, htmlFor, className, ...props }) => {
  return (
    <Text style={styles.label} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
});

export default Label;