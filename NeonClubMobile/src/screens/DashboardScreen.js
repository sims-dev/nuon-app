import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NEON_COLORS } from '../utils/colors';

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Home Button */}
      <TouchableOpacity
        style={[styles.button, styles.homeButton]}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Activity Button */}
      <TouchableOpacity
        style={[styles.button, styles.activityButton]}
        onPress={() => navigation.navigate('ActivityScreen')}
      >
        <Text style={styles.buttonText}>Activity</Text>
      </TouchableOpacity>

      {/* Mentors Button */}
      <TouchableOpacity
        style={[styles.button, styles.mentorsButton]}
        onPress={() => navigation.navigate('MentorshipScreen')}
      >
        <Text style={styles.buttonText}>Mentors</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        style={[styles.button, styles.profileButton]}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEON_COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    marginBottom: 40,
  },
  button: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: NEON_COLORS.neonBlue,
    shadowColor: NEON_COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  activityButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  mentorsButton: {
    backgroundColor: NEON_COLORS.neonPink,
    shadowColor: NEON_COLORS.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  profileButton: {
    backgroundColor: NEON_COLORS.neonCyan,
    shadowColor: NEON_COLORS.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: NEON_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;