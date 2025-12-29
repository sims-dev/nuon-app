import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, ActivityIndicator, Alert, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Clock, Video, Search, Filter, Award, Timer } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { IP_ADDRESS } from '../config/ipConfig';
import { mentorAPI } from '../api/mentorAPI';
import socketService from '../services/socket';
import ProfileCompletionPrompt from '../components/ProfileCompletionPrompt';
import { getFullMediaUrl } from '../services/api';
import { checkProfileCompletion } from '../utils/profileUtils';


const getFullUrl = (path) => {
   if (!path || path === 'null' || path === 'undefined') return 'https://via.placeholder.com/96x96?text=No+Image';
   return getFullMediaUrl(path);
 };

const MentorshipScreen = ({ navigation, route }) => {
  const [displayName, setDisplayName] = useState('Priya');
  const [activeTab, setActiveTab] = useState('browse');
  const [availableMentors, setAvailableMentors] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Join Session state - removed since moved to separate screen

  useEffect(() => {
    const getProfile = async () => {
      try {
        const savedData = await AsyncStorage.getItem('nurseProfile');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.fullName) {
            const firstName = parsed.fullName.split(' ')[0];
            setDisplayName(firstName);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  useEffect(() => {
    fetchMentors();
    fetchMySessions();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    let socketCleanup = [];

    const initializeSocket = async () => {
      try {
        await socketService.connect();

        // Listen for mentor availability updates
        socketCleanup.push(socketService.on('mentor_availability_update', (data) => {
          console.log('Mentor availability updated:', data);
          fetchMentors(); // Refresh mentor list
        }));

        // Listen for new mentor availability
        socketCleanup.push(socketService.on('new_mentor_availability', (data) => {
          console.log('New mentor availability added:', data);
          fetchMentors(); // Refresh mentor list
        }));

        // Listen for availability deleted
        socketCleanup.push(socketService.on('availability-deleted', (data) => {
          console.log('Availability deleted:', data);
          fetchMentors(); // Refresh mentor list
        }));

        // Listen for booking updates
        socketCleanup.push(socketService.on('booking_update', (data) => {
          console.log('Booking update:', data);
          fetchMySessions(); // Refresh user's sessions
        }));

        // Listen for booking accepted
        socketCleanup.push(socketService.on('booking_accepted', (data) => {
          console.log('Booking accepted:', data);
          fetchMySessions(); // Refresh user's sessions
        }));

        // Listen for booking rejected
        socketCleanup.push(socketService.on('booking_rejected', (data) => {
          console.log('Booking rejected:', data);
          fetchMySessions(); // Refresh user's sessions
        }));

        // Listen for booking rescheduled
        socketCleanup.push(socketService.on('booking_rescheduled', (data) => {
          console.log('Booking rescheduled:', data);
          fetchMySessions(); // Refresh user's sessions
        }));

        // Listen for meeting started notifications from mentor
        socketCleanup.push(socketService.on('meeting_started', (data) => {
          console.log('Meeting started notification:', data);
          // Update the session with the meeting link
          setMySessions(prev => prev.map(session =>
            session.id === data.bookingId
              ? { ...session, zoomLink: data.meetingLink, status: 'ready' }
              : session
          ));
        }));

        // Listen for user joined session notifications
        socketCleanup.push(socketService.on('user_joined_session', (data) => {
          console.log('User joined session:', data);
          // Update session status if mentor joined
          if (data.userType === 'mentor') {
            setMySessions(prev => prev.map(session =>
              session.id === data.bookingId
                ? { ...session, status: 'in_progress' }
                : session
            ));
          }
        }));

        // Listen for new mentor notifications
        socketCleanup.push(socketService.on('mentor_created', (data) => {
          console.log('New mentor created:', data);
          fetchMentors(); // Refresh mentor list
        }));

        // Listen for mentor updated
        socketCleanup.push(socketService.on('mentor-updated', (data) => {
          console.log('Mentor updated:', data);
          fetchMentors(); // Refresh mentor list
        }));

        // Listen for mentor deleted
        socketCleanup.push(socketService.on('mentor-deleted', (data) => {
          console.log('Mentor deleted:', data);
          fetchMentors(); // Refresh mentor list
        }));

      } catch (error) {
        console.error('Socket initialization failed:', error);
      }
    };

    initializeSocket();

    return () => {
      socketCleanup.forEach(cleanup => cleanup && cleanup());
    };
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const mentors = await mentorAPI.getAllMentors();
      setAvailableMentors(mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setAvailableMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySessions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const sessions = await mentorAPI.getMyBookings(token);
        setMySessions(sessions);
      } else {
        setMySessions([]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setMySessions([]);
    }
  };

  const handleBookSession = async (mentor) => {
    try {
      // Check if mentor is free (price = 0)
      const isFreeMentor = mentor.hourlyRate === 0 || mentor.hourlyRate === '0' || mentor.price === 0 || mentor.price === '0';

      if (isFreeMentor) {
        // Free mentors don't require profile completion
        navigation.navigate('BookingSlots', { mentor });
        return;
      }

      // For paid mentors, check profile completion using centralized utility
      const profileStatus = await checkProfileCompletion();
      if (profileStatus.profileIncomplete) {
        setShowProfileModal(true);
        return;
      }
      // Proceed to booking slots screen
      navigation.navigate('BookingSlots', { mentor });
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };


  const filteredMentors = availableMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinSession = (session) => {
    navigation.navigate('JoinSession', { session });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0891b2', '#0e7490', '#0369a1']} style={styles.header} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <Text style={styles.headerTitle}>Find Mentors</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search style={styles.searchIcon} />
          <TextInput
            placeholder="Search mentors..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('browse')}
            style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          >
            <Text style={styles.tabText}>Browse Mentors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('upcoming')}
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          >
            <Text style={styles.tabText}>My Sessions</Text>
          </TouchableOpacity>
        </View>

          {/* Browse Mentors Tab */}
          {activeTab === 'browse' && (
            <View style={styles.mentorList}>
              {loading ? (
                <ActivityIndicator size="large" color="#0891b2" />
              ) : (
                filteredMentors.map((mentor) => (
                <View key={mentor._id || mentor.id} style={styles.mentorCard}>
                  <View style={styles.mentorInfo}>
                    <View style={styles.mentorImageContainer}>
                      <Image
                        source={{ uri: getFullUrl(mentor.profilePicture || mentor.image) }}
                        style={styles.mentorImage}
                        onError={() => console.log('Image load error for mentor:', mentor.id)}
                      />
                    </View>
                    <View style={styles.mentorDetails}>
                      <View style={styles.mentorHeader}>
                        <Text style={styles.mentorName}>{mentor.name}</Text>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.star}>★</Text>
                          <Text style={styles.ratingText}>{mentor.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.mentorSpecialty}>{mentor.specialization}</Text>
                      <View style={styles.mentorStats}>
                        <Text style={styles.statText}>{mentor.experience}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.statText}>{mentor.sessions} sessions</Text>
                        {mentor.phoneNumber && (
                          <>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.statText}>{mentor.phoneNumber}</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() => navigation.navigate('MentorProfile', { mentor })}
                    >
                      <View style={styles.viewProfileContent}>
                       
                        <Text style={styles.viewProfileText}>View Profile</Text>
                     
                      </View>
                    </TouchableOpacity>
                    <LinearGradient colors={['#7c3aed', '#ec4899']} style={[styles.bookSessionButton, !mentor.available && styles.disabledButton]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                      <TouchableOpacity
                        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                        disabled={!mentor.available}
                        onPress={() => mentor.available && handleBookSession(mentor)}
                      >
                        <Text style={styles.bookSessionText}>
                          {mentor.available ? 'Book Session' : 'Unavailable'}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
                ))
              )}
            </View>
          )}

          {/* My Sessions Tab */}
          {activeTab === 'upcoming' && (
            <View style={styles.sessionList}>
              {mySessions.length > 0 ? (
                mySessions.map((session) => (
                  <View key={session._id || session.id}>
                    <View style={styles.sessionCard}>
                      <View style={styles.sessionInfo}>
                        <View style={styles.sessionImageContainer}>
                          <Image
                            source={{ uri: getFullUrl(session.mentor?.profilePicture || session.image) }}
                            style={styles.sessionImage}
                            onError={() => console.log('Image load error for session:', session.id)}
                          />
                        </View>
                        <View style={styles.sessionDetails}>
                          <Text style={styles.sessionMentor}>{session.mentor}</Text>
                          <Text style={styles.sessionTopic}>{session.topic}</Text>
                          <View style={styles.sessionMeta}>
                            <View style={styles.sessionTime}>
                              <Calendar style={styles.icon} />
                              <Text style={styles.timeText}>{session.date}</Text>
                              <Clock style={[styles.icon, styles.clockIcon]} />
                              <Text style={styles.timeText}>{session.time}</Text>
                            </View>
                            <View style={styles.sessionType}>
                              <View style={styles.typeBadge}>
                                <Video style={styles.videoIcon} />
                                <Text style={styles.typeText}>{session.type}</Text>
                              </View>
                              <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>{session.duration}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.sessionButtons}>
                        <TouchableOpacity
                          style={styles.rescheduleButton}
                          onPress={() => navigation.navigate('RescheduleSession', { session })}
                        >
                          <Text style={styles.rescheduleText}>Reschedule</Text>
                        </TouchableOpacity>
                        <LinearGradient
                          colors={session.status === 'ready' ? ['#10b981', '#059669'] : ['#10b981', '#10b981']}
                          style={styles.joinButton}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                        >
                          <TouchableOpacity
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => handleJoinSession(session)}
                          >
                            <Text style={styles.joinText}>
                              {session.status === 'ready' ? 'Join Now' : 'Join Session'}
                            </Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>

                      {/* Meeting Ready Status */}
                      {session.status === 'ready' && (
                        <View style={styles.meetingReadyBadge}>
                          <Text style={styles.meetingReadyText}>🎥 Meeting Ready - Click Join Now!</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Calendar style={styles.emptyCalendar} />
                  </View>
                  <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
                  <Text style={styles.emptyText}>Book a session with a mentor to get started</Text>
                  <TouchableOpacity style={styles.browseButton}>
                    <Text style={styles.browseText}>Browse Mentors</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Profile Completion Prompt */}
        {showProfileModal && (
          <ProfileCompletionPrompt
            feature="mentorship sessions"
            onComplete={() => {
              setShowProfileModal(false);
              navigation.navigate('Profile', { screen: 'ProfileEdit' });
            }}
            onCancel={() => setShowProfileModal(false)}
          />
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingBottom: 80,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  headerTitle: {
    color: 'white',
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
    marginTop: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    height: 20,
    width: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    paddingLeft: 40,
    paddingRight: 48,
    borderRadius: 16,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    fontSize: 16,
  },
  filterButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  filterIcon: {
    height: 20,
    width: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  content: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mentorCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mentorInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mentorImageContainer: {
    marginRight: 16,
  },
  mentorImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  mentorDetails: {
    flex: 1,
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  star: {
    color: '#f59e0b',
    fontSize: 12,
  },
  ratingText: {
    fontWeight: '500',
    marginLeft: 4,
  },
  mentorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
  },
  dot: {
    marginHorizontal: 8,
    color: '#6b7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewProfileButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
    borderRadius: 16, // Updated to match curved design
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  viewProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileIcon: {
    marginHorizontal: 4,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  bookSessionButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  bookSessionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderRadius: 16, // Updated to match curved design
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb', // Added light background color
  },
  sessionInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionImageContainer: {
    marginRight: 16,
  },
  sessionImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionMentor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionTopic: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  sessionMeta: {
    gap: 8,
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 16,
    width: 16,
    color: '#6b7280',
  },
  clockIcon: {
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  sessionType: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  videoIcon: {
    height: 12,
    width: 12,
    marginRight: 4,
  },
  typeText: {
    fontSize: 12,
  },
  durationBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  durationText: {
    fontSize: 12,
  },
  sessionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rescheduleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyCalendar: {
    height: 40,
    width: 40,
    color: '#d1d5db',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  browseText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#7c3aed',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  meetingReadyBadge: {
    marginTop: 12,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  meetingReadyText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MentorshipScreen;