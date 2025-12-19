import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, className, onClick, ...props }) => {
  return (
    <View style={styles.card} {...props}>
      {children}
    </View>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <View style={styles.content} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
});

export { Card, CardContent };
export default Card;