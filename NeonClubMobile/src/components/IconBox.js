import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function IconBox({ size = 110, children, style }) {
  const radius = Math.round(size * 0.18);
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: radius },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
