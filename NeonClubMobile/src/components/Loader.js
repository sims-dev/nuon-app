import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Loader = ({ size = 'large', color = '#6366f1', message }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
});

export default Loader;
