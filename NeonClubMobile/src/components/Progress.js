import React from 'react';
import { View, StyleSheet } from 'react-native';

const Progress = ({ value, style, className }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${value}%` }]} />
    </View>
  );
};

export default Progress;

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
    borderRadius: 4,
  },
});