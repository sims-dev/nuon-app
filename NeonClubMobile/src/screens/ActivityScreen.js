import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NEON_COLORS } from '../utils/colors';
import { activitiesAPI } from '../services/api';

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activitiesAPI.getMy();
        setActivities(response.data.activities || []);
      } catch (error) {
        console.error('Error fetching activities:', error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity =>
    filter === 'All' || activity.type === filter
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={NEON_COLORS.neonPurple} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activities</Text>
      <View style={styles.filterContainer}>
        {['All', 'course_purchased', 'session_booked', 'event_registered', 'assessment_submitted', 'feedback_submitted'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.activeFilterButton]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.filterButtonText}>{type === 'All' ? 'All' : type.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {filteredActivities.map((a, index) => (
        <View key={index} style={styles.activityCard}>
          <Text style={styles.activityTitle}>{a.title || a.type}</Text>
          <Text style={styles.activityMeta}>{new Date(a.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: NEON_COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEON_COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: NEON_COLORS.glassBg,
  },
  activeFilterButton: {
    backgroundColor: NEON_COLORS.neonPurple,
  },
  filterButtonText: {
    color: NEON_COLORS.textPrimary,
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: NEON_COLORS.glassBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    color: NEON_COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 12,
    color: '#9aa0aa'
  },
  activityText: {
    fontSize: 16,
    color: NEON_COLORS.textPrimary,
  },
});

export default ActivityScreen;