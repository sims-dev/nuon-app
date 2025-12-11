import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { NEON_COLORS } from '../utils/colors';
import { mentorAPI } from '../services/api';
import useAsync from '../hooks/useAsync';
import { SkeletonList } from '../components/Skeleton';
import socketService from '../services/socket';

const MentorsScreen = ({ navigation }) => {
  const [mentors, setMentors] = useState([
    {
      id: '1',
      name: 'Dr. Sunita Verma',
      specialization: 'Critical Care',
      experience: '15+ years',
      rating: 4.9,
      sessionsCompleted: 340,
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Emergency Medicine',
      experience: '12+ years',
      rating: 4.8,
      sessionsCompleted: 280,
    },
    {
      id: '3',
      name: 'Nurse Kavita Sharma',
      specialization: 'Pediatric Care',
      experience: '10+ years',
      rating: 4.9,
      sessionsCompleted: 300,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const { run: loadMentors } = useAsync(async () => {
    console.log('Loading mentors...'); // Debugging log
    const list = await loadMentors(true); // Use updated loadMentors function
    console.log('Fetched mentors:', list); // Debugging log
    setMentors(list);
    setLoading(false);
    return list;
  }, [], { immediate: false });

  // Ensure dynamic fetching of updated mentor data
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorsRes = await mentorAPI.getMentors();
        console.log('Mentors fetched from API:', mentorsRes.data);
        setMentors(mentorsRes.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentors();
  }, []); // Fetch mentors on component mount

  const list = useMemo(() => {
    console.log('Displaying all mentors without filters.');
    return mentors; // Directly return all mentors without filtering
  }, [mentors]);

  // Add debugging log to inspect the list variable
  console.log('Mentor list to render:', list);

  // Socket connection and real-time updates
  useEffect(() => {
    let cleanupFunctions = [];

    const setupSocket = async () => {
      try {
        await socketService.connect();

        // Listen for mentor availability updates
        const availabilityCleanup = socketService.on('mentor_availability_update', (data) => {
          console.log('Mentor availability update received:', data);
          setMentors(prevMentors =>
            prevMentors.map(mentor =>
              mentor._id === data.mentorId
                ? { ...mentor, available: data.available }
                : mentor
            )
          );
        });
        cleanupFunctions.push(availabilityCleanup);

        // Listen for new mentor availability
        const newAvailabilityCleanup = socketService.on('new_mentor_availability', (data) => {
          console.log('New mentor availability received:', data);
          // Refresh mentors list to include new availability
          loadMentors();
        });
        cleanupFunctions.push(newAvailabilityCleanup);

        // Listen for booking updates
        const bookingCleanup = socketService.on('booking_update', (data) => {
          console.log('Booking update received:', data);
          // Refresh mentors list on booking update
          loadMentors();
        });
        cleanupFunctions.push(bookingCleanup);
      } catch (error) {
        console.error('Socket setup failed:', error);
      }
    };

    setupSocket();

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    };
  }, [loadMentors]);

  // Updated UI to match the mentor dashboard design
  return (
    <View style={{ flex: 1, backgroundColor: NEON_COLORS.background }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Mentors</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={NEON_COLORS.neonBlue} />
            <Text style={styles.loadingText}>Loading mentors...</Text>
          </View>
        ) : list.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No mentors available at the moment</Text>
            <Text style={styles.emptySubtext}>Check back later for new mentors</Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id?.toString() || item._id?.toString()}
            renderItem={({ item }) => (
              <View style={styles.mentorCard}>
                {item.profilePicture && (
                  <Image source={{ uri: item.profilePicture }} style={styles.mentorImage} />
                )}
                <View style={styles.mentorDetails}>
                  <Text style={styles.mentorName}>{item.name || 'Mentor'}</Text>
                  <Text style={styles.mentorSpecialization}>
                    {item.specialization || 'Nursing Professional'}
                  </Text>
                  <Text style={styles.mentorExperience}>
                    {item.experience ? `${item.experience} years` : 'Experienced Professional'}
                  </Text>
                  <Text style={styles.mentorRating}>
                    ⭐ {item.rating || 4.5} | {item.sessionsCompleted || 0} sessions
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('MentorProfile', { mentor: item })}
                    >
                      <Text style={styles.buttonText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.bookButton]}
                      onPress={() => navigation.navigate('MentorAvailability', { mentor: item })}
                    >
                      <Text style={styles.buttonText}>Book Session</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(90deg, #3B82F6, #6366F1)', // Gradient background
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E0E7FF', // Light neon text
  },
  searchContainer: {
    padding: 8,
    backgroundColor: '#1E293B', // Dark background for search
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3B82F6', // Neon blue border
    flex: 1,
  },
  searchInput: {
    height: 40,
    color: '#E0E7FF', // Light neon text
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3B82F6', // Neon blue border
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981', // Neon green for active tab
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E0E7FF', // Light neon text
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B', // Original dark card background
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#3B82F6', // Original neon blue border
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
  },
  infoContainer: {
    flex: 1,
    padding: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E7FF', // Light neon text
  },
  specialization: {
    fontSize: 14,
    color: '#94A3B8', // Muted neon text
    marginVertical: 4,
  },
  details: {
    fontSize: 12,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noSessionsText: {
    textAlign: 'center',
    color: '#94A3B8',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MentorsScreen;