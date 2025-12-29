import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ children, className, onClick, ...props }) => {
  return (
    <View style={styles.card} {...props}>
      {children}
    </View>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <View style={styles.header} {...props}>
      {children}
    </View>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <View style={styles.titleContainer} {...props}>
      {React.Children.map(children, child =>
        typeof child === 'string' ? <Text style={styles.title}>{child}</Text> : child
      )}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 16,
    gap: 16, // space-y-4 equivalent
  },
});

export { Card, CardContent, CardHeader, CardTitle };
export default Card;