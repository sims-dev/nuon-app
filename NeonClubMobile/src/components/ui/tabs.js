import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const Tabs = ({ children, defaultValue, value, onValueChange }) => {
  return <View style={styles.tabs}>{children}</View>;
};

export const TabsList = ({ children }) => {
  return <View style={styles.tabsList}>{children}</View>;
};

export const TabsTrigger = ({ children, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.tabTrigger} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export const TabsContent = ({ children, value }) => {
  return <View style={styles.tabContent}>{children}</View>;
};

const styles = StyleSheet.create({
  tabs: {
    // Container styles
  },
  tabsList: {
    flexDirection: 'row',
    // Add your tab list styles
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    // Add your trigger styles
  },
  tabContent: {
    // Content container styles
  },
});