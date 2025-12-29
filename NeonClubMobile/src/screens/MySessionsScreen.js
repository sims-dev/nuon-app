import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { connectSocket, on } from '../utils/socket';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
const refreshSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const filterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`;

const MySessionsScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useFocusEffect(
    React.useCallback(() => {
      fetchSessions();
    }, [])
  );

  // Socket.IO real-time updates
  useEffect(() => {
    let socketCleanup = [];

    const initializeSocket = async () => {
      try {
        const socket = connectSocket();

        // Listen for booking updates
        socketCleanup.push(on('booking_update', (data) => {
          console.log('Booking update:', data);
          fetchSessions();
        }));

        // Listen for booking accepted
        socketCleanup.push(on('booking_accepted', (data) => {
          console.log('Booking accepted:', data);
          fetchSessions();
        }));

        // Listen for booking rejected
        socketCleanup.push(on('booking_rejected', (data) => {
          console.log('Booking rejected:', data);
          fetchSessions();
        }));

        // Listen for booking rescheduled
        socketCleanup.push(on('booking_rescheduled', (data) => {
          console.log('Booking rescheduled:', data);
          fetchSessions();
        }));

        // Listen for meeting started notifications
        socketCleanup.push(on('meeting_started', (data) => {
          console.log('Meeting started notification:', data);
          fetchSessions();
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

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      if (response.data?.success) {
        setSessions(response.data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to load sessions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  const handleJoinSession = (session) => {
    const sessionDateTime = new Date(session.dateTime);
    const now = new Date();
    const timeDiff = sessionDateTime - now;

    // Allow joining 15 minutes before session
    if (timeDiff > 15 * 60 * 1000) {
      Alert.alert(
        'Session Not Started',
        'You can join the session 15 minutes before the scheduled time.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Allow joining up to 1 hour after session start
    if (timeDiff < -60 * 60 * 1000) {
      Alert.alert(
        'Session Expired',
        'This session has already ended.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('VideoSession', {
      sessionId: session.id,
      bookingId: session.id,
      mentorName: session.mentor?.name || 'Mentor',
      sessionType: session.sessionType || 'mentoring',
    });
  };

  const handleReschedule = (session) => {
    Alert.alert(
      'Reschedule Session',
      'Are you sure you want to reschedule this session? You will need to select a new time slot.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reschedule',
          onPress: () => {
            // Navigate to reschedule screen
            navigation.navigate('RescheduleSession', {
              session: session,
            });
          }
        }
      ]
    );
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      day: date.toLocaleDateString('en-IN', { weekday: 'long' })
    };
  };

  const getSessionStatus = (session) => {
    const sessionDateTime = new Date(session.dateTime);
    const now = new Date();

    if (session.status === 'completed') return 'completed';
    if (session.status === 'cancelled') return 'cancelled';
    if (session.status === 'rejected') return 'rejected';

    if (sessionDateTime < now) return 'completed';
    return 'upcoming';
  };

  const upcomingSessions = sessions.filter(session => {
    const status = getSessionStatus(session);
    return status === 'upcoming' || session.status === 'pending' || session.status === 'confirmed' || session.status === 'accepted' || session.status === 'rejected';
  });
  const completedSessions = sessions.filter(session => getSessionStatus(session) === 'completed');

  const renderSessionCard = (session) => {
    const { date, time, day } = formatDateTime(session.dateTime);
    const status = getSessionStatus(session);
    const isUpcoming = status === 'upcoming';
    const isConfirmed = session.status === 'confirmed' || session.status === 'accepted';
    const isPending = session.status === 'pending';
    const isRejected = session.status === 'rejected';

    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionCardContent}>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionImageContainer}>
              <View style={styles.sessionImage}>
                <Text style={styles.sessionInitial}>
                  {session.mentor?.name?.charAt(0)?.toUpperCase() || 'M'}
                </Text>
              </View>
            </View>
            <View style={styles.sessionDetails}>
              <Text style={styles.sessionMentorName}>{session.mentor?.name || 'Mentor'}</Text>
              <Text style={styles.sessionTopic}>Advanced Wound Care</Text>
              <View style={styles.sessionMeta}>
                <View style={styles.metaItem}>
                  <SvgXml xml={calendarSvg} width={14} height={14} color="#6B7280" />
                  <Text style={styles.metaText}>{day}, {date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                  <Text style={styles.metaText}>{time}</Text>
                </View>
              </View>
              <View style={styles.sessionBadges}>
                <View style={styles.badge}>
                  <SvgXml xml={videoSvg} width={12} height={12} color="#6B7280" />
                  <Text style={styles.badgeText}>Video Call</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{session.duration || 45} mins</Text>
                </View>
                {isPending && (
                  <View style={[styles.badge, styles.pendingBadge]}>
                    <Text style={styles.pendingBadgeText}>Waiting for confirmation</Text>
                  </View>
                )}
                {isRejected && (
                  <View style={[styles.badge, styles.rejectedBadge]}>
                    <Text style={styles.rejectedBadgeText}>Rejected</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          {isConfirmed && (
            <View style={styles.sessionActions}>
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={() => handleReschedule(session)}
              >
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinSession(session)}
              >
                <Text style={styles.joinText}>Join Session</Text>
              </TouchableOpacity>
            </View>
          )}
          {isPending && (
            <View style={styles.pendingActions}>
              <Text style={styles.pendingText}>Waiting for mentor to confirm your session request</Text>
            </View>
          )}
          {isRejected && (
            <View style={styles.rejectedActions}>
              <Text style={styles.rejectedText}>This session request was not accepted</Text>
              <TouchableOpacity
                style={styles.bookAgainButton}
                onPress={() => navigation.navigate('MentorProfile', { mentor: session.mentor })}
              >
                <Text style={styles.bookAgainText}>Book Another Session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#EC4899', '#8B5CF6']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Sessions</Text>
        </LinearGradient>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading your sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#06B6D4', '#0891B2', '#0E7490']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Sessions</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SvgXml xml={searchSvg} width={20} height={20} color="#FFFFFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value=""
            onChangeText={() => {}}
          />
          <TouchableOpacity style={styles.filterButton}>
            <SvgXml xml={filterSvg} width={20} height={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Mentors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            All Sessions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'browse' ? (
          <View style={styles.mentorsList}>
            {/* Sample mentors - in real app this would come from API */}
            {[
              {
                id: 1,
                name: 'Dr. Sunita Verma',
                specialization: 'Critical Care',
                experience: '15+ years',
                rating: 4.9,
                sessions: 340,
                price: 1999,
                available: true,
              },
              {
                id: 2,
                name: 'Dr. Rajesh Kumar',
                specialization: 'Emergency Medicine',
                experience: '12+ years',
                rating: 4.8,
                sessions: 280,
                price: 1799,
                available: true,
              },
            ].map((mentor) => (
              <View key={mentor.id} style={styles.mentorCard}>
                <View style={styles.mentorCardContent}>
                  <View style={styles.mentorInfo}>
                    <View style={styles.mentorImageContainer}>
                      <View style={styles.mentorImage}>
                        <Text style={styles.mentorInitial}>{mentor.name.charAt(0)}</Text>
                      </View>
                    </View>
                    <View style={styles.mentorDetails}>
                      <View style={styles.mentorHeader}>
                        <Text style={styles.mentorName}>{mentor.name}</Text>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.starIcon}>★</Text>
                          <Text style={styles.ratingText}>{mentor.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.mentorSpecialty}>{mentor.specialization}</Text>
                      <View style={styles.mentorStats}>
                        <Text style={styles.statText}>{mentor.experience}</Text>
                        <Text style={styles.statSeparator}>•</Text>
                        <Text style={styles.statText}>{mentor.sessions} sessions</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.mentorActions}>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() => navigation.navigate('MentorProfile', { mentor })}
                    >
                      <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.bookSessionButton, !mentor.available && styles.unavailableButton]}
                      onPress={() => mentor.available && navigation.navigate('MentorAvailability', { mentor })}
                      disabled={!mentor.available}
                    >
                      <Text style={[styles.bookSessionText, !mentor.available && styles.unavailableText]}>
                        {mentor.available ? 'Book Session' : 'Unavailable'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          upcomingSessions.length > 0 ? (
            <View style={styles.sessionsList}>
              {upcomingSessions.map(renderSessionCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <SvgXml xml={calendarSvg} width={48} height={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Sessions</Text>
              <Text style={styles.emptyText}>
                You don't have any mentoring sessions scheduled or in progress.
              </Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => setActiveTab('browse')}
              >
                <Text style={styles.bookButtonText}>Browse Mentors</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    marginTop: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    backdropFilter: 'blur(10px)',
  },
  filterButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mentorsList: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  mentorCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  mentorCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mentorImageContainer: { marginRight: 16 },
  mentorImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  mentorInitial: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  mentorDetails: { flex: 1 },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  mentorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statSeparator: {
    marginHorizontal: 8,
    color: '#6B7280',
  },
  mentorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bookSessionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
  },
  bookSessionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  unavailableButton: {
    backgroundColor: '#F3F4F6',
  },
  unavailableText: {
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  sessionsList: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  sessionCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  sessionCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sessionInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionImageContainer: { marginRight: 16 },
  sessionImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  sessionInitial: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  sessionDetails: { flex: 1 },
  sessionMentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sessionTopic: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  sessionMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  sessionBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8, // 0.5rem gap
    marginTop: 16, // 1rem from session content
  },
  rescheduleButton: {
    flex: 1,
    paddingVertical: 8, // 0.5rem
    paddingHorizontal: 16, // 1rem
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9999, // fully rounded
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  joinButton: {
    flex: 1,
    paddingVertical: 8, // 0.5rem
    paddingHorizontal: 16, // 1rem
    borderRadius: 9999, // fully rounded
    alignItems: 'center',
    backgroundColor: '#10b981', // solid green as specified
  },
  joinText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },
  rejectedBadge: {
    backgroundColor: '#FEE2E2',
  },
  rejectedBadgeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  pendingActions: {
    paddingTop: 16,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
    textAlign: 'center',
  },
  rejectedActions: {
    paddingTop: 16,
    alignItems: 'center',
  },
  rejectedText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  bookAgainButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookAgainText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MySessionsScreen;