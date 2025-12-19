import React from 'react';
import { View, StyleSheet } from 'react-native';

const Progress = ({ value, className, ...props }) => {
  return (
    <View style={styles.container} {...props}>
      <View style={[styles.bar, { width: `${value}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
});

export default Progress;