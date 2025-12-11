import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { mentorAPI } from '../services/api';
import MentorProfile from './MentorProfile';

const Stack = createStackNavigator();

const MentorList = ({ navigation }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await mentorAPI.getMentors();
      setMentors(response.data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMentor = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MentorProfileScreen', { mentor: { ...item, avatarUrl: item.profileImage } })}
      style={styles.cardTouchable}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.profileImage || item.image || 'https://via.placeholder.com/100' }}
            style={styles.image}
            defaultSource={require('../assets/mentor1.png')}
          />
          <View style={styles.availabilityBadge}>
            <Text style={styles.availabilityText}>Available</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {item.rating || 5.0}</Text>
            </View>
          </View>

          <Text style={styles.specialization} numberOfLines={1}>
            {item.specialization || item.expertise || 'Healthcare Professional'}
          </Text>

          <Text style={styles.experience}>
            {item.experience ? `${item.experience} years experience` : 'Experienced Professional'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.sessionsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{item.hourlyRate || 500}</Text>
              <Text style={styles.statLabel}>/hour</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.tag}>Verified</Text>
            <Text style={styles.tag}>Top Rated</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading mentors...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mentors}
      keyExtractor={(item) => item._id || item.id}
      renderItem={renderMentor}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No mentors available</Text>
        </View>
      }
    />
  );
};

const BrowseMentors = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mentor List" component={MentorList} />
      <Stack.Screen name="Mentor Profile" component={MentorProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  cardTouchable: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  availabilityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  specialization: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  experience: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#888',
  },
  availability: {
    fontSize: 12,
    marginTop: 5,
  },
  available: {
    color: 'green',
  },
  busy: {
    color: 'red',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default BrowseMentors;