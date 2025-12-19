import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <View style={styles.container}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </View>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className, style }) => {
  return (
    <View style={[styles.tabsList, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }, style]}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </View>
  );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => {
  const isActive = activeTab === value;
  return (
    <TouchableOpacity
      style={[styles.tabTrigger, isActive && styles.activeTabTrigger]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({ value, children, activeTab }) => {
  if (value !== activeTab) return null;
  return <View>{children}</View>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 2,
  },
  activeTabTrigger: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});