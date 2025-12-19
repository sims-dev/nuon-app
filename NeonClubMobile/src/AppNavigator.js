import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Auth Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import SplashScreen from './screens/SplashScreen';

// Main App Screens
import HomeScreen from './screens/HomeScreen';
import LearningScreen from './screens/LearningScreen';
import EngageScreen from './screens/EngageScreen';
import MentorScreen from './screens/MentorScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyLearningScreen from './screens/MyLearningScreen';

// Detail Screens
import CourseDetailScreen from './screens/CourseDetailScreen';
import CourseViewerScreen from './screens/CourseViewerScreen';
import EventViewerScreen from './screens/EventViewerScreen';
import MentorAvailabilityScreen from './screens/MentorAvailabilityScreen';
import CertificationsScreen from './screens/CertificationsScreen';
import BookingScreen from './screens/BookingScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import CatalogScreen from './screens/CatalogScreen';
import NewsListScreen from './screens/NewsListScreen';
import NewsViewerScreen from './screens/NewsViewerScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';

// Context
import { AuthContext, AuthProvider } from './contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// SVG Icons for tabs
const homeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const learningIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
const engageIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const mentorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const profileIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

// Auth Navigator Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

// Main App Tab Navigator
function AppTabs() {
   return (
     <Tab.Navigator
       screenOptions={({ route }) => ({
         headerShown: false,
         tabBarIcon: ({ focused, color, size }) => {
           let icon;
           switch (route.name) {
             case 'Home':
               icon = homeIcon;
               break;
             case 'Learning':
               icon = learningIcon;
               break;
             case 'MyLearning':
               icon = learningIcon; // Use same icon for now
               break;
             case 'Engage':
               icon = engageIcon;
               break;
             case 'Mentor':
               icon = mentorIcon;
               break;
             case 'Profile':
               icon = profileIcon;
               break;
             default:
               icon = homeIcon;
           }
           return <SvgXml xml={icon} width={size} height={size} color={color} />;
         },
         tabBarActiveTintColor: '#EC4899',
         tabBarInactiveTintColor: '#6B7280',
         tabBarStyle: {
           backgroundColor: '#1F2937',
           borderTopColor: '#374151',
           height: 60,
           paddingBottom: 8,
           paddingTop: 8,
         },
       })}
     >
       <Tab.Screen
         name="Home"
         component={HomeScreen}
         options={{ title: 'Home' }}
       />
       <Tab.Screen
         name="Learning"
         component={LearningScreen}
         options={{ title: 'Learning' }}
       />
       <Tab.Screen
         name="MyLearning"
         component={MyLearningScreen}
         options={{ title: 'My Learning' }}
       />
       <Tab.Screen
         name="Engage"
         component={EngageScreen}
         options={{ title: 'Engage' }}
       />
       <Tab.Screen
         name="Mentor"
         component={MentorScreen}
         options={{ title: 'Mentors' }}
       />
     </Tab.Navigator>
   );
 }

// App Stack with Modal screens (Course details, booking, etc.)
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="MainTabs"
          component={AppTabs}
          options={{ animationEnabled: false }}
        />
      </Stack.Group>

      {/* Detail Screens as Modal Stack */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourseViewer"
          component={CourseViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventViewer"
          component={EventViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MentorAvailability"
          component={MentorAvailabilityScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Certifications"
          component={CertificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Assessment"
          component={AssessmentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Catalog"
          component={CatalogScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsList"
          component={NewsListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsViewer"
          component={NewsViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main AppNavigator with Provider
export default function AppNavigator() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}