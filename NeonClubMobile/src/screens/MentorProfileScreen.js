import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, FlatList } from 'react-native';
const { width, height } = Dimensions.get('window');

const MentorshipSessions = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API calls
  const [availableMentors] = useState([
    {
      id: '1',
      name: 'Dr. Sunita Verma',
      specialization: 'Critical Care Nursing',
      experience: '15+ years',
      rating: 4.8,
      sessions: 340,
      image: 'https://via.placeholder.com/96x96',
      available: true,
      hourlyRate: 2000
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Emergency Medicine',
      experience: '12+ years',
      rating: 4.9,
      sessions: 280,
      image: 'https://via.placeholder.com/96x96',
      available: true,
      hourlyRate: 1800
    },
    {
      id: '3',
      name: 'Dr. Priya Sharma',
      specialization: 'Pediatric Care',
      experience: '10+ years',
      rating: 4.7,
      sessions: 220,
      image: 'https://via.placeholder.com/96x96',
      available: false,
      hourlyRate: 1600
    }
  ]);

  const [upcomingSessions] = useState([
    {
      id: '1',
      mentor: 'Dr. Sunita Verma',
      topic: 'Emergency Response Training',
      date: 'Dec 20, 2024',
      time: '2:00 PM',
      duration: '60 min',
      image: 'https://via.placeholder.com/80x80',
      type: 'Video Call'
    },
    {
      id: '2',
      mentor: 'Dr. Rajesh Kumar',
      topic: 'Patient Assessment Skills',
      date: 'Dec 22, 2024',
      time: '10:00 AM',
      duration: '45 min',
      image: 'https://via.placeholder.com/80x80',
      type: 'Video Call'
    }
  ]);

  const filteredMentors = availableMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MentorCard = ({ mentor }) => (
    <View style={styles.mentorCard}>
      <View style={styles.mentorCardContent}>
        <Image source={{ uri: mentor.image }} style={styles.mentorImage} />
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{mentor.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>{mentor.rating}</Text>
          </View>
          <Text style={styles.mentorSpecialization}>{mentor.specialization}</Text>
          <Text style={styles.mentorDetails}>{mentor.experience} • {mentor.sessions} sessions</Text>
        </View>
      </View>
      <View style={styles.mentorActions}>
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookSessionButton, !mentor.available && styles.bookSessionDisabled]}
          disabled={!mentor.available}
        >
          <Text style={[styles.bookSessionText, !mentor.available && styles.bookSessionDisabledText]}>
            {mentor.available ? 'Book Session' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SessionCard = ({ session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionCardContent}>
        <Image source={{ uri: session.image }} style={styles.sessionImage} />
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionMentor}>{session.mentor}</Text>
          <Text style={styles.sessionTopic}>{session.topic}</Text>
          <View style={styles.sessionDetails}>
            <View style={styles.sessionDetail}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>{session.date}</Text>
            </View>
            <View style={styles.sessionDetail}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{session.time}</Text>
            </View>
          </View>
          <View style={styles.sessionBadges}>
            <View style={styles.sessionBadge}>
              <Text style={styles.badgeIcon}>📹</Text>
              <Text style={styles.badgeText}>{session.type}</Text>
            </View>
            <View style={styles.sessionBadgeOutline}>
              <Text style={styles.badgeTextOutline}>{session.duration}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.sessionActions}>
        <TouchableOpacity style={styles.rescheduleButton}>
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinSessionButton}>
          <Text style={styles.joinSessionText}>Join Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptySessions = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📅</Text>
      </View>
      <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
      <Text style={styles.emptyDescription}>Book a session with a mentor to get started</Text>
      <TouchableOpacity style={styles.browseMentorsButton} onPress={() => setActiveTab('browse')}>
        <Text style={styles.browseMentorsText}>Browse Mentors</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentorship</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Mentors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
          onPress={() => setActiveTab('sessions')}
        >
          <Text style={[styles.tabText, activeTab === 'sessions' && styles.activeTabText]}>
            My Sessions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'browse' ? (
          <FlatList
            data={filteredMentors}
            renderItem={({ item }) => <MentorCard mentor={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mentorsList}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.sessionsContainer}>
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <EmptySessions />
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50 equivalent
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  mentorsList: {
    padding: 16,
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mentorCardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mentorImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  ratingStar: {
    fontSize: 12,
    color: '#F59E0B',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  mentorSpecialization: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  mentorDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  mentorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewProfileButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bookSessionButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookSessionDisabled: {
    backgroundColor: '#9CA3AF',
  },
  bookSessionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  bookSessionDisabledText: {
    color: '#FFFFFF',
  },
  sessionsContainer: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionCardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionImage: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMentor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sessionTopic: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  sessionDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    fontSize: 12,
    marginRight: 4,
    color: '#6B7280',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  sessionBadgeOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextOutline: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rescheduleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  joinSessionButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  joinSessionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseMentorsButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseMentorsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default MentorshipSessions;
