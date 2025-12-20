import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { BookOpen, Calendar, Clock, Play, CheckCircle, Users, Heart, Download, ChevronRight, Video } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { courseAPI, eventAPI, workshopAPI, conferenceAPI } from '../services/api';
import { IP_ADDRESS } from '../config/ipConfig';

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const MyLearningScreen = ({ navigation }) => {
    const [displayName, setDisplayName] = useState('Priya');
    const [activeTab, setActiveTab] = useState('courses');
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
    const [enrolledWellness, setEnrolledWellness] = useState([]);

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

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        setLoading(true);
        const [coursesRes, eventsRes, workshopsRes] = await Promise.all([
          courseAPI.getMyCourses().catch(() => ({ data: { courses: [] } })),
          eventAPI.getMyEvents().catch(() => ({ data: { events: [] } })),
          workshopAPI.getMyWorkshops().catch(() => ({ data: { workshops: [] } })),
        ]);
        let courses = Array.isArray(coursesRes?.data?.courses) ? coursesRes.data.courses : [];
        let events = Array.isArray(eventsRes?.data?.events) ? eventsRes.data.events : [];
        let workshops = Array.isArray(workshopsRes?.data?.workshops) ? workshopsRes.data.workshops : [];

        // If no real data, show demo data
        if (courses.length === 0) {
          courses = [
            {
              id: 'demo-course-1',
              title: 'Advanced Nursing Care Techniques',
              instructor: 'Dr. Sarah Johnson',
              image: 'https://via.placeholder.com/300x160/4F46E5/FFFFFF?text=Course+1',
              progress: 75,
              totalLessons: 12,
              completedLessons: 9,
              duration: '8 hours',
              nextLesson: 'Patient Monitoring Systems'
            },
            {
              id: 'demo-course-2',
              title: 'Mental Health Nursing',
              instructor: 'Prof. Michael Chen',
              image: 'https://via.placeholder.com/300x160/059669/FFFFFF?text=Course+2',
              progress: 45,
              totalLessons: 10,
              completedLessons: 4,
              duration: '6 hours',
              nextLesson: 'Crisis Intervention'
            }
          ];
        }

        if (events.length === 0) {
          events = [
            {
              id: 'demo-event-1',
              title: 'Nursing Leadership Summit 2024',
              type: 'Conference',
              image: 'https://via.placeholder.com/300x160/EC4899/FFFFFF?text=Event+1',
              date: '2024-12-15',
              time: '9:00 AM',
              location: 'Virtual',
              status: 'upcoming'
            },
            {
              id: 'demo-event-2',
              title: 'Healthcare Innovation Workshop',
              type: 'Workshop',
              image: 'https://via.placeholder.com/300x160/7C3AED/FFFFFF?text=Event+2',
              date: '2024-11-20',
              time: '2:00 PM',
              location: 'Mumbai',
              status: 'completed'
            }
          ];
        }

        if (workshops.length === 0) {
          workshops = [
            {
              id: 'demo-workshop-1',
              title: 'Emergency Response Training',
              instructor: 'Dr. Robert Davis',
              image: 'https://via.placeholder.com/300x160/DC2626/FFFFFF?text=Workshop+1',
              date: '2024-12-20',
              time: '10:00 AM',
              location: 'Virtual',
              duration: '4 hours',
              status: 'upcoming'
            },
            {
              id: 'demo-workshop-2',
              title: 'Patient Care Excellence',
              instructor: 'Ms. Lisa Wong',
              image: 'https://via.placeholder.com/300x160/EA580C/FFFFFF?text=Workshop+2',
              date: '2024-11-10',
              time: '1:00 PM',
              location: 'Delhi',
              duration: '3 hours',
              status: 'completed'
            }
          ];
        }

        setEnrolledCourses(courses);
        setRegisteredEvents(events);
        setRegisteredWorkshops(workshops);
        setEnrolledWellness([]); // TODO: Add wellness API if available
      } catch (error) {
        console.error('Error fetching learning data:', error);
        // Set demo data on error
        setEnrolledCourses([
          {
            id: 'demo-course-1',
            title: 'Advanced Nursing Care Techniques',
            instructor: 'Dr. Sarah Johnson',
            image: 'https://via.placeholder.com/300x160/4F46E5/FFFFFF?text=Course+1',
            progress: 75,
            totalLessons: 12,
            completedLessons: 9,
            duration: '8 hours',
            nextLesson: 'Patient Monitoring Systems'
          }
        ]);
        setRegisteredEvents([
          {
            id: 'demo-event-1',
            title: 'Nursing Leadership Summit 2024',
            type: 'Conference',
            image: 'https://via.placeholder.com/300x160/EC4899/FFFFFF?text=Event+1',
            date: '2024-12-15',
            time: '9:00 AM',
            location: 'Virtual',
            status: 'upcoming'
          }
        ]);
        setRegisteredWorkshops([
          {
            id: 'demo-workshop-1',
            title: 'Emergency Response Training',
            instructor: 'Dr. Robert Davis',
            image: 'https://via.placeholder.com/300x160/DC2626/FFFFFF?text=Workshop+1',
            date: '2024-12-20',
            time: '10:00 AM',
            location: 'Virtual',
            duration: '4 hours',
            status: 'upcoming'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLearningData();
  }, []);





  const upcomingEvents = useMemo(() => (registeredEvents || []).filter(e => e.status === 'upcoming'), [registeredEvents]);
  const completedEvents = useMemo(() => (registeredEvents || []).filter(e => e.status === 'completed'), [registeredEvents]);
  const upcomingWorkshops = useMemo(() => (registeredWorkshops || []).filter(w => w.status === 'upcoming'), [registeredWorkshops]);
  const completedWorkshops = useMemo(() => (registeredWorkshops || []).filter(w => w.status === 'completed'), [registeredWorkshops]);
  const inProgressCourses = useMemo(() => (enrolledCourses || []).filter(c => c.progress < 100), [enrolledCourses]);
  const completedCourses = useMemo(() => (enrolledCourses || []).filter(c => c.progress === 100), [enrolledCourses]);
  const activeWellness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'active'), [enrolledWellness]);
  const completedWellness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'completed'), [enrolledWellness]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading your learning data...</Text>
      </View>
    );
  }

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
                      <Image
                        source={{ uri: getFullUrl(course.image) }}
                        style={styles.cardImage}
                        onError={() => console.log('Image load error for course:', course.id)}
                      />
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
                          <Text>{course.completedLessons || 0}/{course.totalLessons || course.lessons?.length || 0} lessons</Text>
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
                    <Image
                      source={{ uri: getFullUrl(course.image) }}
                      style={styles.completedImage}
                      onError={() => console.log('Image load error for completed course:', course.id)}
                    />
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
                    <Image
                      source={{ uri: getFullUrl(event.image) }}
                      style={styles.eventImage}
                      onError={() => console.log('Image load error for event:', event.id)}
                    />
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
                    <Image
                      source={{ uri: getFullUrl(event.image) }}
                      style={[styles.eventImage, styles.grayscale]}
                      onError={() => console.log('Image load error for completed event:', event.id)}
                    />
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
                    <Image
                      source={{ uri: getFullUrl(workshop.image) }}
                      style={styles.workshopImage}
                      onError={() => console.log('Image load error for workshop:', workshop.id)}
                    />
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
                    <Image
                      source={{ uri: getFullUrl(workshop.image) }}
                      style={[styles.workshopImage, styles.grayscale]}
                      onError={() => console.log('Image load error for completed workshop:', workshop.id)}
                    />
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