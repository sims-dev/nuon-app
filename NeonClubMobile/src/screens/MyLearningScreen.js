import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { BookOpen, Calendar, Clock, Play, CheckCircle, Users, Heart, Download, ChevronRight, Video } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const MyLearningScreen = ({ navigation }) => {
   const [displayName, setDisplayName] = useState('Priya');
   const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const loadName = async () => {
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
        console.error('Error loading name:', error);
      }
    };
    loadName();
  }, []);

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Patient Care',
      instructor: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmclMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYwMzQ1MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 65,
      totalLessons: 24,
      completedLessons: 15,
      duration: '8 weeks',
      enrolled: '2024-09-15',
      nextLesson: 'Lesson 16: Emergency Response',
      certificate: false,
    },
    {
      id: 2,
      title: 'Medication Management Basics',
      instructor: 'Nurse Priya Singh',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2F0aW9uJTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjA0NTM2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 100,
      totalLessons: 12,
      completedLessons: 12,
      duration: '4 weeks',
      enrolled: '2024-08-20',
      nextLesson: null,
      certificate: true,
    },
  ];

  const registeredEvents = [
    {
      id: 1,
      title: 'Healthcare Summit 2024',
      type: 'Conference',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NjA0NTM2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-10-18',
      time: '9:00 AM - 5:00 PM',
      location: 'India Expo Centre, Delhi',
      venue: 'Hall 5, India Expo Centre',
      status: 'upcoming',
      daysUntil: 2,
      hasJoinLink: false,
    },
    {
      id: 2,
      title: 'Nursing Excellence Awards',
      type: 'Event',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwYXdhcmR8ZW58MXx8fHwxNzYwNDUzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-09-25',
      time: '6:00 PM - 9:00 PM',
      location: 'Hotel Taj Palace, Delhi',
      venue: 'Grand Ballroom, Taj Palace',
      status: 'completed',
      daysUntil: null,
      hasJoinLink: false,
    },
  ];

  const registeredWorkshops = [
    {
      id: 1,
      title: 'Wound Care Management Workshop',
      instructor: 'Dr. Anjali Reddy',
      type: 'Live Workshop',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYwNDUzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-10-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Virtual (Zoom)',
      joinLink: 'https://zoom.us/j/123456789',
      status: 'upcoming',
      daysUntil: 4,
      duration: '3 hours',
    },
    {
      id: 2,
      title: 'IV Therapy Techniques',
      instructor: 'Nurse Kumar',
      type: 'Hands-on Workshop',
      image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzYwNDUzNjc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-09-18',
      time: '10:00 AM - 1:00 PM',
      location: 'Training Center, AIIMS Delhi',
      joinLink: null,
      status: 'completed',
      daysUntil: null,
      duration: '3 hours',
    },
  ];

  const enrolledWellness = [
    {
      id: 1,
      title: 'Stress Management for Healthcare Workers',
      type: 'Mental Wellness',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 40,
      totalSessions: 8,
      completedSessions: 3,
      nextSession: 'Session 4: Breathing Techniques',
      status: 'active',
      enrolled: '2024-09-01',
    },
    {
      id: 2,
      title: '30-Day Nurse Fitness Challenge',
      instructor: 'Fitness Coach Priya',
      type: 'Fitness Challenge',
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 75,
      totalDays: 30,
      completedDays: 22,
      nextActivity: 'Day 23: Core Strength Training',
      status: 'active',
      enrolled: '2024-08-15',
    },
    {
      id: 3,
      title: 'Mindfulness & Meditation for Nurses',
      type: 'Wellness Workshop',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 100,
      totalSessions: 6,
      completedSessions: 6,
      status: 'completed',
      enrolled: '2024-07-20',
      certificate: true,
    },
  ];

  const upcomingEvents = registeredEvents.filter(e => e.status === 'upcoming');
  const completedEvents = registeredEvents.filter(e => e.status === 'completed');
  const upcomingWorkshops = registeredWorkshops.filter(w => w.status === 'upcoming');
  const completedWorkshops = registeredWorkshops.filter(w => w.status === 'completed');
  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const activeWellness = enrolledWellness.filter(w => w.status === 'active');
  const completedWellness = enrolledWellness.filter(w => w.status === 'completed');

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <LinearGradient
          colors={['#2563eb', '#7c3aed', '#ec4899']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>My Learning</Text>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <BookOpen style={styles.statIcon} />
              <Text style={styles.statLabel}>Courses</Text>
              <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart style={styles.statIcon} />
              <Text style={styles.statLabel}>Wellness</Text>
              <Text style={styles.statValue}>{enrolledWellness.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar style={styles.statIcon} />
              <Text style={styles.statLabel}>Events</Text>
              <Text style={styles.statValue}>{registeredEvents.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Users style={styles.statIcon} />
              <Text style={styles.statLabel}>Workshops</Text>
              <Text style={styles.statValue}>{registeredWorkshops.length}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['courses', 'wellness', 'events', 'workshops'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentContainer}>
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <View>
            {inProgressCourses.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>In Progress</Text>
                {inProgressCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('CourseViewer', { course })}
                  >
                    <View style={styles.cardImageContainer}>
                      <Image source={{ uri: course.image }} style={styles.cardImage} />
                      <View style={styles.cardOverlay} />
                      <View style={styles.statusPill}>
                        <Text style={styles.statusPillText}>In Progress</Text>
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={1}>{course.title}</Text>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardRow}>
                        <Text style={styles.cardSubtitle}>by {course.instructor}</Text>
                        <Text style={styles.progressText}>{course.progress}% Complete</Text>
                      </View>
                      <View style={styles.cardRow}>
                        <View style={styles.iconText}>
                          <BookOpen style={styles.icon} />
                          <Text>{course.completedLessons}/{course.totalLessons} lessons</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Clock style={styles.icon} />
                          <Text>{course.duration}</Text>
                        </View>
                      </View>
                      {course.nextLesson && (
                        <View style={styles.nextLesson}>
                          <Text style={styles.nextLessonLabel}>Next Lesson</Text>
                          <Text style={styles.nextLessonTitle}>{course.nextLesson}</Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.continueButton}>
                        <Play style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Continue Learning</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {completedCourses.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Completed</Text>
                  <View style={styles.completedBadge}>
                        <CheckCircle style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>Done</Text>
                      </View>
                </View>
                {completedCourses.map((course) => (
                  <View key={course.id} style={styles.completedCard}>
                    <Image source={{ uri: course.image }} style={styles.completedImage} />
                    <View style={styles.completedContent}>
                    <View style={styles.completedHeader}>
                     
                      <View>
                        <Text style={styles.completedTitle} numberOfLines={2}>{course.title}</Text>
                        <Text style={styles.completedSubtitle}>by {course.instructor}</Text>
                      </View>
                    </View>
                      <View style={styles.completedRow}>
                        <Text>{course.totalLessons} lessons</Text>
                        <Text>•</Text>
                        <Text>{course.duration}</Text>
                      </View>
                      {course.certificate && (
                        <TouchableOpacity style={styles.downloadButton}>
                          <Download style={styles.downloadIcon} />
                          <Text style={styles.downloadText}>Download Certificate</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Wellness Tab */}
        {activeTab === 'wellness' && (
          <View>
            {activeWellness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Active Programs</Text>
                {activeWellness.map((program) => (
                  <TouchableOpacity
                    key={program.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('WellnessViewer', { program })}
                  >
                    <Image source={{ uri: program.image }} style={styles.wellnessImage} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardRow}>
                        <View>
                          <Text style={styles.cardTitle}>{program.title}</Text>
                          <Text style={styles.cardSubtitle}>{program.type}</Text>
                        </View>
                        <Text style={styles.statusText}>In Progress</Text>
                      </View>
                      <View style={styles.cardRow}>
                        <Text>{program.completedSessions}/{program.totalSessions} sessions</Text>
                        <Text>•</Text>
                        <Text>{program.nextSession}</Text>
                      </View>
                      <TouchableOpacity style={styles.continueButton}>
                        <Play style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Continue</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {completedWellness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Completed Programs</Text>
                 <View style={styles.completedBadge}>
                          <CheckCircle style={styles.badgeIcon} />
                          <Text style={styles.badgeText}>Done</Text>
                        </View>
                {completedWellness.map((program) => (
                  <View key={program.id} style={styles.completedCard}>
                    <Image source={{ uri: program.image }} style={[styles.completedImage, styles.grayscale]} />
                    <View style={styles.completedContent}>
                      <View style={styles.completedHeader}>
                        <View>
                          <Text style={styles.completedTitle} numberOfLines={1}>{program.title}</Text>
                          <Text style={styles.completedSubtitle}>{program.type}</Text>
                        </View>
                       
                      </View>
                      <View style={styles.completedRow}>
                        <Text>{program.totalSessions} sessions</Text>
                        <Text>•</Text>
                        <Text>{program.nextSession}</Text>
                      </View>
                      {program.certificate && (
                        <TouchableOpacity style={styles.downloadButton}>
                          <Download style={styles.downloadIcon} />
                          <Text style={styles.downloadText}>Download Certificate</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <View>
            {upcomingEvents.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcomingEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => navigation.navigate('EventViewer', { event })}
                  >
                    <Image source={{ uri: event.image }} style={styles.eventImage} />
                    <View style={styles.eventContent}>
                      <View style={styles.eventHeader}>
                        <View>
                          <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                          <Text style={styles.eventType}>{event.type}</Text>
                        </View>
                        {event.daysUntil && event.daysUntil <= 3 && (
                          <Text style={styles.daysLeft}>{event.daysUntil}d left</Text>
                        )}
                      </View>
                      <View style={styles.eventDetails}>
                        <View style={styles.iconText}>
                          <Calendar style={styles.icon} />
                          <Text>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Clock style={styles.icon} />
                          <Text>{event.time}</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Users style={styles.icon} />
                          <Text>{event.location}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ChevronRight style={styles.chevronIcon} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {completedEvents.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Past Events</Text>
                {completedEvents.map((event) => (
                  <View key={event.id} style={[styles.eventCard, styles.pastEvent]}>
                    <Image source={{ uri: event.image }} style={[styles.eventImage, styles.grayscale]} />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                      <Text style={styles.pastDate}>
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                      <View style={styles.completedBadge}>
                        <CheckCircle style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>Attended</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Workshops Tab */}
        {activeTab === 'workshops' && (
          <View>
            {upcomingWorkshops.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcomingWorkshops.map((workshop) => (
                  <TouchableOpacity
                    key={workshop.id}
                    style={styles.workshopCard}
                    onPress={() => navigation.navigate('WorkshopViewer', { workshop })}
                  >
                    <Image source={{ uri: workshop.image }} style={styles.workshopImage} />
                    <View style={styles.workshopContent}>
                      <View style={styles.workshopHeader}>
                        <View>
                          <Text style={styles.workshopTitle} numberOfLines={1}>{workshop.title}</Text>
                          <Text style={styles.workshopSubtitle}>by {workshop.instructor}</Text>
                        </View>
                        {workshop.daysUntil && workshop.daysUntil <= 5 && (
                          <Text style={styles.daysLeft}>{workshop.daysUntil}d left</Text>
                        )}
                      </View>
                      <View style={styles.workshopDetails}>
                        <View style={styles.iconText}>
                          <Calendar style={styles.icon} />
                          <Text>{new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Clock style={styles.icon} />
                          <Text>{workshop.time} • {workshop.duration}</Text>
                        </View>
                        <View style={styles.iconText}>
                          {workshop.location.includes('Virtual') ? (
                            <Video style={styles.icon} />
                          ) : (
                            <Users style={styles.icon} />
                          )}
                          <Text>{workshop.location}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ChevronRight style={styles.chevronIcon} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {completedWorkshops.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Past Workshops</Text>
                {completedWorkshops.map((workshop) => (
                  <View key={workshop.id} style={[styles.workshopCard, styles.pastWorkshop]}>
                    <Image source={{ uri: workshop.image }} style={[styles.workshopImage, styles.grayscale]} />
                    <View style={styles.workshopContent}>
                      <View style={styles.workshopHeader}>
                        <View>
                          <Text style={styles.workshopTitle} numberOfLines={1}>{workshop.title}</Text>
                          <Text style={styles.workshopSubtitle}>by {workshop.instructor}</Text>
                        </View>
                        <View style={styles.completedBadge}>
                          <CheckCircle style={styles.badgeIcon} />
                          <Text style={styles.badgeText}>Done</Text>
                        </View>
                      </View>
                      <Text style={styles.pastDate}>
                        {new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
    flex: 1,
    marginHorizontal: 2,
  },
  statIcon: {
    width: 24,
    height: 24,
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1f2937',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    position: 'relative',
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  statusPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPillText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 12,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    numberOfLines: 1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 14,
    height: 14,
    color: '#6b7280',
    marginRight: 4,
  },
  nextLesson: {
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  nextLessonLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  nextLessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    color: 'white',
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  completedCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  completedContent: {
    flex: 1,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  completedSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  badgeIcon: {
    width: 10,
    height: 10,
    color: '#166534',
    marginRight: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  downloadIcon: {
    width: 14,
    height: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  downloadText: {
    fontSize: 12,
    color: '#6b7280',
  },
  wellnessImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  grayscale: {
    opacity: 0.6,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 16,
  },
  eventContent: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  daysLeft: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '600',
  },
  eventDetails: {
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 4,
  },
  chevronIcon: {
    width: 14,
    height: 14,
    color: '#6b7280',
  },
  pastEvent: {
    opacity: 0.75,
  },
  pastDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  workshopCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workshopImage: {
    width: '100%',
    height: 120,
  },
  workshopContent: {
    padding: 16,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workshopTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  workshopSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  workshopDetails: {
    marginBottom: 12,
  },
  pastWorkshop: {
    opacity: 0.75,
  },
});

export default MyLearningScreen;