import React from 'react';
import { View, StyleSheet } from 'react-native';

const Progress = ({ value, className, height = 8, color = '#7C3AED', ...props }) => {
  return (
    <View style={[styles.container, { height }]} {...props}>
      <View style={[styles.bar, { width: `${value}%`, backgroundColor: color }]} />
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