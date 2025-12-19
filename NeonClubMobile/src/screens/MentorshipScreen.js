import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, ActivityIndicator, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Clock, Video, Search, Filter } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { mentorAPI } from '../api/mentorAPI';

const MentorshipScreen = ({ navigation, route }) => {
  const [displayName, setDisplayName] = useState('Priya');
  const [activeTab, setActiveTab] = useState('browse');
  const [availableMentors, setAvailableMentors] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const mentors = await mentorAPI.getAllMentors();
      setAvailableMentors(Array.isArray(mentors) && mentors.length > 0 ? mentors : [
        {
          id: 1,
          name: 'Dr. Sunita Verma',
          specialization: 'Critical Care',
          experience: '15+ years',
          rating: 4.9,
          sessions: 340,
          image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          available: true,
          price: 1999,
          responseTime: '2 hours',
          languages: ['English', 'Hindi', 'Marathi'],
          qualifications: [
            'MSc Nursing - Critical Care',
            'BSc Nursing - Delhi University',
            'ICU Certification - AIIMS',
          ],
          expertise: [
            'Critical Care Management',
            'Emergency Response',
            'Ventilator Management',
            'Patient Safety Protocols',
            'Clinical Leadership',
          ],
          bio: 'With over 15 years of experience in critical care nursing, I have worked in top hospitals across India including AIIMS and Apollo. I specialize in helping nurses advance their careers in emergency and critical care settings.',
          reviews: [
            {
              id: 1,
              name: 'Neha Sharma',
              rating: 5,
              date: 'Oct 2024',
              comment: 'Dr. Verma provided excellent guidance on my ICU rotation. Her practical tips helped me gain confidence.',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            },
          ],
          achievements: [
            { icon: 'award', label: 'Top Rated Mentor' },
            { icon: 'users', label: '340+ Sessions' },
            { icon: 'star', label: '4.9 Rating' },
            { icon: 'clock', label: 'Quick Response' },
          ],
          availability: [
            'Monday - Friday: 3:00 PM - 8:00 PM',
            'Saturday: 10:00 AM - 6:00 PM',
            'Sunday: By appointment',
          ],
        },
      ]);
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
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Keep static data as fallback
      setMySessions([
        {
          id: 1,
          mentor: 'Dr. Anjali Reddy',
          topic: 'Advanced Wound Care',
          date: 'Tomorrow',
          time: '3:00 PM',
          duration: '45 mins',
          image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          type: 'Video Call',
        },
      ]);
    }
  };

  const handleBookSession = async (mentor) => {
    try {
      const profile = await AsyncStorage.getItem('nurseProfile');
      if (!profile || !JSON.parse(profile).fullName || !JSON.parse(profile).email) {
        setShowProfileModal(true);
        return;
      }
      // Proceed to booking
      navigation.navigate('BookingSlots', { mentor });
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const upcomingSessions = [
    {
      id: 1,
      mentor: 'Dr. Anjali Reddy',
      topic: 'Advanced Wound Care',
      date: 'Tomorrow',
      time: '3:00 PM',
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Video Call',
    },
    {
      id: 2,
      mentor: 'Nurse Priya Singh',
      topic: 'Career Development Q&A',
      date: 'Oct 15',
      time: '5:00 PM',
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Video Call',
    },
  ];

  const filteredMentors = availableMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <View key={mentor.id} style={styles.mentorCard}>
                  <View style={styles.mentorInfo}>
                    <View style={styles.mentorImageContainer}>
                      <Image source={{ uri: mentor.image }} style={styles.mentorImage} />
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
                      </View>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() => navigation.navigate('MentorProfile', { mentor })}
                    >
                      <Text style={styles.viewProfileText}>View Profile</Text>
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
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionInfo}>
                      <View style={styles.sessionImageContainer}>
                        <Image source={{ uri: session.image }} style={styles.sessionImage} />
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
                      <LinearGradient colors={['#10b981', '#10b981']} style={styles.joinButton} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                        <TouchableOpacity
                          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                          onPress={() => navigation.navigate('SessionPreparation', { session })}
                        >
                          <Text style={styles.joinText}>Join Session</Text>
                        </TouchableOpacity>
                      </LinearGradient>
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

        {/* Profile Incomplete Modal */}
        <Modal
          visible={showProfileModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowProfileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Complete Your Profile</Text>
              <Text style={styles.modalMessage}>
                To book a mentorship session, please complete your profile with your full name and email address.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowProfileModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.completeButton]}
                  onPress={() => {
                    setShowProfileModal(false);
                    navigation.navigate('ProfileSetupScreen');
                  }}
                >
                  <Text style={styles.completeButtonText}>Complete Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
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
});

export default MentorshipScreen;