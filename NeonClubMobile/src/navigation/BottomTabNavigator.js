import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import EngageScreen from '../screens/EngageScreen';
import MentorScreen from '../screens/MentorScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  let iconText;
  switch (name) {
    case 'Home':
      iconText = '🏠';
      break;
    case 'Learning':
      iconText = '📚';
      break;
    case 'Engage':
      iconText = '❤️';
      break;
    case 'Mentor':
      iconText = '🎓';
      break;
    case 'Profile':
      iconText = '👤';
      break;
    default:
      iconText = '•';
  }
  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 84 }}>
      <Text style={{ fontSize: 20, color: focused ? '#00FFFF' : '#666666' }}>{iconText}</Text>
      <Text style={{
        marginTop: 2,
        fontSize: 12,
        color: focused ? '#00FFFF' : '#666666',
        fontWeight: focused ? '700' : '600',
        textAlign: 'center'
      }}>
        {name}
      </Text>
    </View>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 2,
          borderTopColor: '#00FFFF',
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#00FFFF',
        tabBarInactiveTintColor: '#666666',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learning" component={LearningScreen} />
      <Tab.Screen name="Engage" component={EngageScreen} />
      <Tab.Screen name="Mentor" component={MentorScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;