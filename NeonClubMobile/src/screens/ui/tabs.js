import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const Tabs = ({ defaultValue, value, onValueChange, children }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalActiveTab;
  const setActiveTab = onValueChange || setInternalActiveTab;

  const tabsList = children.find(child => child.type === TabsList);
  const tabContents = children.filter(child => child.type === TabsContent);

  return (
    <View style={styles.container}>
      {tabsList && React.cloneElement(tabsList, { activeTab, setActiveTab })}
      {tabContents.map(content =>
        content.props.value === activeTab ? content : null
      )}
    </View>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabsList}>
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
      style={[styles.tabTrigger, isActive && styles.activeTab]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeText]}>{children}</Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({ value, children }) => {
  return <View style={styles.tabContent}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeText: {
    color: '#111827',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };