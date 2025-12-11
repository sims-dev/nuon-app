import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ValuePropositionScreen from '../screens/ValuePropositionScreen';
import OTPAuthScreen from '../screens/OTPAuthScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import WorkshopDetailScreen from '../screens/WorkshopDetailScreen';
import CourseViewerScreen from '../screens/CourseViewerScreen';
import ConferenceDetailScreen from '../screens/ConferenceDetailScreen';
import ConferenceViewerScreen from '../screens/ConferenceViewerScreen';
import EventViewerScreen from '../screens/EventViewerScreen';
import WorkshopViewerScreen from '../screens/WorkshopViewerScreen';
import MyLearningScreen from '../screens/MyLearningScreen';
import LearningDetailsScreen from '../screens/LearningDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import NCCScreen from '../screens/NCCScreen';
import PaymentScreen from '../screens/PaymentScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import MentorAvailabilityScreen from '../screens/MentorAvailabilityScreen';
import MentorProfileScreen from '../screens/MentorProfileScreen';
import MentorRegisterScreen from '../screens/MentorRegisterScreen';
import MentorJoinScreen from '../screens/MentorJoinScreen';
import MentorFeedbackScreen from '../screens/MentorFeedbackScreen';
import NewsListScreen from '../screens/NewsListScreen';
import NewsViewerScreen from '../screens/NewsViewerScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import Mentorship from '../screens/Mentorship';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import CertificationsScreen from '../screens/CertificationsScreen';
import OrderHistory from '../screens/OrderHistory';
import ReferralScreen from '../screens/ReferralScreen';
import EngageDetailsScreen from '../screens/EngageDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  console.log('User Context:', user);
  console.log('Loading State:', loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
        <Text style={{ color: '#00FFFF', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#1A1A1A',
            borderBottomWidth: 2,
            borderBottomColor: '#00FFFF',
          },
          headerTintColor: '#00FFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            textShadowColor: '#00FFFF',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          },
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValueProposition"
          component={ValuePropositionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPAuth"
          component={OTPAuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ title: 'Course Details' }}
        />
        <Stack.Screen
          name="WorkshopDetail"
          component={WorkshopDetailScreen}
          options={{ title: 'Workshop Details' }}
        />
        <Stack.Screen
          name="CourseViewer"
          component={CourseViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConferenceDetail"
          component={ConferenceDetailScreen}
          options={{ title: 'Conference Details' }}
        />
        <Stack.Screen
          name="ConferenceViewer"
          component={ConferenceViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventViewer"
          component={EventViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WorkshopViewer"
          component={WorkshopViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyLearning"
          component={MyLearningScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LearningDetails"
          component={LearningDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Bookings"
          component={BookingScreen}
          options={{ title: 'My Bookings' }}
        />
        <Stack.Screen
          name="Assessment"
          component={AssessmentScreen}
          options={{ title: 'Assessments' }}
        />
        <Stack.Screen
          name="NCC"
          component={NCCScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
        <Stack.Screen
          name="MentorAvailability"
          component={MentorAvailabilityScreen}
          options={{ title: 'Pick a Slot' }}
        />
        <Stack.Screen
          name="MentorJoin"
          component={MentorJoinScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MentorFeedback"
          component={MentorFeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MentorRegister"
          component={MentorRegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MentorProfile"
          component={MentorProfileScreen}
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
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{ title: 'Notification Settings' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Help & Support' }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: 'Privacy Policy' }}
        />
        <Stack.Screen
          name="Mentorship"
          component={Mentorship}
          options={{ title: 'Mentorship' }}
        />
        <Stack.Screen
          name="Certifications"
          component={CertificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Referral"
          component={ReferralScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EngageDetails"
          component={EngageDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;