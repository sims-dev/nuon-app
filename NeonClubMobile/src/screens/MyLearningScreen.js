import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { BookOpen, Calendar, Clock, Play, CheckCircle, Users, Heart, Download, ChevronRight, Video, ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { CommonActions } from '@react-navigation/native';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';

import api, { courseAPI, eventAPI, workshopAPI, conferenceAPI, assessmentAPI, mentorAPI, getFullMediaUrl } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';

const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

const TabIcon = ({ name, focused, onPress }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return homeSvg;
      case 'Learning':
        return bookOpenSvg;
      case 'Engage':
        return heartSvg;
      case 'Mentors':
        return usersSvg;
      default:
        return homeSvg;
    }
  };

  return (
    <TouchableOpacity
      style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 84, paddingVertical: 6 }}
      onPress={onPress}
      activeOpacity={1.0}
    >
      {focused && (
        <LinearGradient
          colors={['#EC4899', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 40, height: 3, borderRadius: 1.5, marginBottom: 4 }}
        />
      )}
      <SvgXml
        xml={getIcon()}
        width={20}
        height={20}
        color={focused ? '#7C3AED' : '#9CA3AF'}
      />
      <Text style={{
        marginTop: 2,
        fontSize: 12,
        color: focused ? '#7C3AED' : '#9CA3AF',
        fontWeight: focused ? '700' : '600',
        textAlign: 'center'
      }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const MyLearningScreen = ({ navigation, route }) => {
    const [displayName, setDisplayName] = useState('Priya');
    const [activeTab, setActiveTab] = useState('courses');
    const [loading, setLoading] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [registeredConferences, setRegisteredConferences] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
    const [enrolledWellness, setEnrolledWellness] = useState([]);
    const [conferenceCount, setConferenceCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [mentorsCount, setMentorsCount] = useState(0);
    const [assessmentsCount, setAssessmentsCount] = useState(0);
    const [fitnessCount, setFitnessCount] = useState(0);
    const [playingVideoId, setPlayingVideoId] = useState(null);

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

    // Connect to socket and listen for real-time updates
    const socket = connectSocket();
    const unsubscribeCourseUpdate = onSocket('course_update', (data) => {
      console.log('Course update received in MyLearning:', data);
      // Refresh learning data when a course is purchased
      fetchLearningData();
    });

    return () => {
      // Cleanup socket listeners
      if (unsubscribeCourseUpdate) unsubscribeCourseUpdate();
      disconnectSocket();
    };
  }, []);

  // Handle activeTab from route params (e.g., after payment navigation)
  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
    // Force refresh when navigating to this screen
    if (route.params?.refresh || route.params?.enrolled) {
      fetchLearningData();
    }
  }, [route.params]);

  const fetchLearningData = async () => {
    try {
      // Use Promise.allSettled for better error handling and performance
      const [coursesRes, conferencesRes, eventsRes, workshopsRes, wellnessRes, mentorsRes, assessmentsRes] = await Promise.allSettled([
        courseAPI.getMyCourses().catch(() => ({ data: { courses: [] } })),
        conferenceAPI.getMyConferences().catch(() => ({ data: { conferences: [] } })),
        eventAPI.getMyEvents().catch(() => ({ data: { events: [] } })),
        mentorAPI.getMentors().catch(() => ({ data: [] })),
        assessmentAPI.getAssessments().catch(() => ({ data: [] })),
        workshopAPI.getMyWorkshops().catch(() => ({ data: { workshops: [] } })),
        api.get('/engage/my-registrations').catch(() => ({ data: { registrations: [] } })),
      ]);

      let courses = [];
      let conferences = [];
      let events = [];
      let workshops = [];
      let wellness = [];

      // Extract successful results
      if (coursesRes.status === 'fulfilled') {
        courses = Array.isArray(coursesRes.value?.data?.courses) ? coursesRes.value.data.courses : [];
      }
      if (conferencesRes.status === 'fulfilled') {
        conferences = Array.isArray(conferencesRes.value?.data?.conferences) ? conferencesRes.value.data.conferences : [];
      }
      if (eventsRes.status === 'fulfilled') {
        events = Array.isArray(eventsRes.value?.data?.events) ? eventsRes.value.data.events : [];
      }
      if (workshopsRes.status === 'fulfilled') {
        workshops = Array.isArray(workshopsRes.value?.data?.workshops) ? workshopsRes.value.data.workshops : [];
      }
      if (wellnessRes.status === 'fulfilled') {
        wellness = Array.isArray(wellnessRes.value?.data?.registrations) ? wellnessRes.value.data.registrations : [];
      }

      // Cache the results for faster subsequent loads
      setEnrolledCourses(courses);
      setRegisteredConferences(conferences);
      setRegisteredEvents(events);
      setConferenceCount(conferences.length);
      setEventCount(events.length);
      const mentors = mentorsRes?.data?.mentors || mentorsRes?.data || [];
      setMentorsCount(Array.isArray(mentors) ? mentors.length : 0);
      const assessments = assessmentsRes?.data || [];
      setAssessmentsCount(Array.isArray(assessments) ? assessments.length : 0);
      setRegisteredWorkshops(workshops);
      setEnrolledWellness(wellness);
      const fitnessRegistrations = wellness.filter(w => w.activity?.category === 'fitness');
      setFitnessCount(fitnessRegistrations.length);
    } catch (error) {
        console.error('Error fetching learning data:', error);
        // No demo data on error - show empty state
      }
  };

  useEffect(() => {
    fetchLearningData();
  }, []);

  // Refresh data when screen comes into focus (e.g., after payment)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLearningData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const addRegisteredContent = async () => {
      try {
        const registeredContent = await AsyncStorage.getItem('registeredContent');
        if (registeredContent) {
          const parsedContent = JSON.parse(registeredContent);
          setEnrolledCourses((prev) => [...prev, ...parsedContent.courses || []]);
          setRegisteredConferences((prev) => [...prev, ...parsedContent.conferences || []]);
          setRegisteredEvents((prev) => [...prev, ...parsedContent.events || []]);
          setRegisteredWorkshops((prev) => [...prev, ...parsedContent.workshops || []]);
        }
      } catch (error) {
        console.error('Error adding registered content:', error);
      }
    };
    addRegisteredContent();
  }, []);

  const upcomingConferences = useMemo(() => (registeredConferences || []).filter(e => e.status === 'upcoming'), [registeredConferences]);
  const completedConferences = useMemo(() => (registeredConferences || []).filter(e => e.status === 'completed'), [registeredConferences]);
  const upcomingEvents = useMemo(() => (registeredEvents || []).filter(e => e.status === 'upcoming'), [registeredEvents]);
  const completedEvents = useMemo(() => (registeredEvents || []).filter(e => e.status === 'completed'), [registeredEvents]);
  const upcomingWorkshops = useMemo(() => (registeredWorkshops || []).filter(w => w.status === 'upcoming'), [registeredWorkshops]);
  const completedWorkshops = useMemo(() => (registeredWorkshops || []).filter(w => w.status === 'completed'), [registeredWorkshops]);
  const inProgressCourses = useMemo(() => (enrolledCourses || []).filter(c => c.progress < 100), [enrolledCourses]);
  const completedCourses = useMemo(() => (enrolledCourses || []).filter(c => c.progress === 100), [enrolledCourses]);
  const activeWellness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'registered' && w.activity?.isActive && w.activity?.category === 'wellness'), [enrolledWellness]);
  const completedWellness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'completed' && w.activity?.category === 'wellness'), [enrolledWellness]);
  const activeFitness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'registered' && w.activity?.isActive && w.activity?.category === 'fitness'), [enrolledWellness]);
  const completedFitness = useMemo(() => (enrolledWellness || []).filter(w => w.status === 'completed' && w.activity?.category === 'fitness'), [enrolledWellness]);


  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <LinearGradient
          colors={['#2563eb', '#7c3aed', '#ec4899']}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Main')}
              activeOpacity={1.0}
            >
              <ChevronLeft style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Learning</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Quick Stats */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
            <View style={styles.statItem}>
              <BookOpen style={styles.statIcon} />
              <Text style={styles.statLabel}>Courses</Text>
              <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart style={styles.statIcon} />
              <Text style={styles.statLabel}>Wellness</Text>
              <Text style={styles.statValue}>{activeWellness.length + completedWellness.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart style={styles.statIcon} />
              <Text style={styles.statLabel}>Fitness</Text>
              <Text style={styles.statValue}>{fitnessCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar style={styles.statIcon} />
              <Text style={styles.statLabel}>Events</Text>
              <Text style={styles.statValue}>{eventCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar style={styles.statIcon} />
              <Text style={styles.statLabel}>Conferences</Text>
              <Text style={styles.statValue}>{conferenceCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Users style={styles.statIcon} />
              <Text style={styles.statLabel}>Workshops</Text>
              <Text style={styles.statValue}>{registeredWorkshops.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Users style={styles.statIcon} />
              <Text style={styles.statLabel}>Mentors</Text>
              <Text style={styles.statValue}>{mentorsCount}</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen style={styles.statIcon} />
              <Text style={styles.statLabel}>Assessments</Text>
              <Text style={styles.statValue}>{assessmentsCount}</Text>
            </View>
          </ScrollView>
        </LinearGradient>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {['courses', 'wellness', 'fitness', 'events', 'conferences', 'workshops'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={1.0}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.contentContainer}>
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <View>
            {inProgressCourses.length === 0 && completedCourses.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No courses enrolled yet.</Text>
                <Text style={styles.emptyStateSubText}>Browse and enroll in courses to start learning.</Text>
              </View>
            )}
            {inProgressCourses.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>In Progress</Text>
                {inProgressCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('CourseViewer', { course })}
                    activeOpacity={1.0}
                  >
                    <View style={styles.cardImageContainer}>
                      {playingVideoId === course.id && course.lessons && course.lessons[0] && course.lessons[0].videoUrl ? (
                        <Video
                          source={{ uri: getFullUrl(course.lessons[0].videoUrl) }}
                          style={styles.cardImage}
                          controls
                          resizeMode="cover"
                          poster={getFullUrl(course.thumbnail)}
                          posterResizeMode="cover"
                          onFullscreenPlayerWillDismiss={() => setPlayingVideoId(null)}
                        />
                      ) : (
                        <>
                          <Image
                            source={{ uri: getFullUrl(course.thumbnail) }}
                            style={styles.cardImage}
                            onError={() => console.log('Image load error for course:', course.id)}
                          />
                          <View style={styles.cardOverlay} />
                          {course.lessons && course.lessons[0] && course.lessons[0].videoUrl && (
                            <TouchableOpacity
                              style={styles.playOverlay}
                              onPress={() => setPlayingVideoId(course.id)}
                              activeOpacity={0.7}
                            >
                              <View style={styles.playBtn}>
                                <Text style={styles.playIcon}>▶</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                      {course.price === 0 && (
                        <View style={styles.freeBadge}>
                          <Text style={styles.freeBadgeText}>FREE</Text>
                        </View>
                      )}
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
                        <Text style={styles.cardSubtitle}>by {course.instructor?.name || course.instructor}</Text>
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
                      <View style={styles.priceRow}>
                        <View>
                          {course.price === 0 ? (
                            <Text style={styles.freeText}>Free</Text>
                          ) : (
                            <View style={styles.priceContainer}>
                              <Text style={styles.rupeeIcon}>₹</Text>
                              <Text style={styles.priceText}>{course.price}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.pointsContainer}>
                          <Text style={styles.pointsText}>+{course.points || 0} pts</Text>
                        </View>
                      </View>
                      {course.nextLesson && (
                        <View style={styles.nextLesson}>
                          <Text style={styles.nextLessonLabel}>Next Lesson</Text>
                          <Text style={styles.nextLessonTitle}>{course.nextLesson}</Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.continueButton} activeOpacity={1.0}>
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
                    {playingVideoId === `completed-${course.id}` && course.lessons && course.lessons[0] && course.lessons[0].videoUrl ? (
                      <Video
                        source={{ uri: getFullUrl(course.lessons[0].videoUrl) }}
                        style={styles.completedImage}
                        controls
                        resizeMode="cover"
                        poster={getFullUrl(course.thumbnail)}
                        posterResizeMode="cover"
                        onFullscreenPlayerWillDismiss={() => setPlayingVideoId(null)}
                      />
                    ) : (
                      <TouchableOpacity onPress={() => course.lessons && course.lessons[0] && course.lessons[0].videoUrl && setPlayingVideoId(`completed-${course.id}`)}>
                        <Image
                          source={{ uri: getFullUrl(course.thumbnail) }}
                          style={styles.completedImage}
                          onError={() => console.log('Image load error for completed course:', course.id)}
                        />
                        {course.lessons && course.lessons[0] && course.lessons[0].videoUrl && (
                          <View style={styles.completedPlayOverlay}>
                            <View style={styles.completedPlayBtn}>
                              <Text style={styles.completedPlayIcon}>▶</Text>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                    <View style={styles.completedContent}>
                    <View style={styles.completedHeader}>

                      <View>
                        <Text style={styles.completedTitle} numberOfLines={2}>{course.title}</Text>
                        <Text style={styles.completedSubtitle}>by {course.instructor?.name || course.instructor}</Text>
                      </View>
                    </View>
                      <View style={styles.completedRow}>
                        <Text>{course.totalLessons} lessons</Text>
                        <Text>•</Text>
                        <Text>{course.duration}</Text>
                      </View>
                      <View style={styles.priceRow}>
                        <View>
                          {course.price === 0 ? (
                            <Text style={styles.freeText}>Free</Text>
                          ) : (
                            <View style={styles.priceContainer}>
                              <Text style={styles.rupeeIcon}>₹</Text>
                              <Text style={styles.priceText}>{course.price}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.pointsContainer}>
                          <Text style={styles.pointsText}>+{course.points || 0} pts</Text>
                        </View>
                      </View>
                      {course.certificate && (
                        <TouchableOpacity style={styles.downloadButton} activeOpacity={1.0}>
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
            {activeWellness.length === 0 && completedWellness.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No wellness programs enrolled yet.</Text>
                <Text style={styles.emptyStateSubText}>Explore wellness activities to maintain your well-being.</Text>
              </View>
            )}
            {activeWellness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Active Programs</Text>
                {activeWellness.map((registration) => {
                  const program = registration.activity;
                  return (
                    <TouchableOpacity
                      key={registration.id}
                      style={styles.card}
                      onPress={() => navigation.navigate('EngageDetails', { item: program })}
                      activeOpacity={1.0}
                    >
                      <Image source={{ uri: getFullUrl(program.thumbnail) }} style={styles.wellnessImage} />
                      <View style={styles.cardContent}>
                        <View style={styles.cardRow}>
                          <View>
                            <Text style={styles.cardTitle}>{program.title}</Text>
                            <Text style={styles.cardSubtitle}>{program.type}</Text>
                          </View>
                          <Text style={styles.statusText}>Enrolled</Text>
                        </View>
                        <View style={styles.cardRow}>
                          <Text>Registered on {new Date(registration.registeredAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.priceRow}>
                          <View>
                            {program.price === 0 ? (
                              <Text style={styles.freeText}>Free</Text>
                            ) : (
                              <View style={styles.priceContainer}>
                                <Text style={styles.rupeeIcon}>₹</Text>
                                <Text style={styles.priceText}>{program.price}</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText}>+{program.points || 0} pts</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.continueButton}
                          activeOpacity={1.0}
                          onPress={() => navigation.navigate('EngageDetails', { item: program })}
                        >
                          <Play style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Start Activity</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {completedWellness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Completed Programs</Text>
                 <View style={styles.completedBadge}>
                          <CheckCircle style={styles.badgeIcon} />
                          <Text style={styles.badgeText}>Done</Text>
                        </View>
                {completedWellness.map((registration) => {
                  const program = registration.activity;
                  return (
                    <View key={registration.id} style={styles.completedCard}>
                      <Image source={{ uri: getFullUrl(program.thumbnail) }} style={[styles.completedImage, styles.grayscale]} />
                      <View style={styles.completedContent}>
                        <View style={styles.completedHeader}>
                          <View>
                            <Text style={styles.completedTitle} numberOfLines={1}>{program.title}</Text>
                            <Text style={styles.completedSubtitle}>{program.type}</Text>
                          </View>
                        </View>
                        <View style={styles.completedRow}>
                          <Text>Completed on {new Date(registration.completedAt || registration.registeredAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.priceRow}>
                          <View>
                            {program.price === 0 ? (
                              <Text style={styles.freeText}>Free</Text>
                            ) : (
                              <View style={styles.priceContainer}>
                                <Text style={styles.rupeeIcon}>₹</Text>
                                <Text style={styles.priceText}>{program.price}</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText}>+{program.points || 0} pts</Text>
                          </View>
                        </View>
                        {program.certificate && (
                          <TouchableOpacity style={styles.downloadButton} activeOpacity={1.0}>
                            <Download style={styles.downloadIcon} />
                            <Text style={styles.downloadText}>Download Certificate</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Fitness Tab */}
        {activeTab === 'fitness' && (
          <View>
            {activeFitness.length === 0 && completedFitness.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No fitness programs enrolled yet.</Text>
                <Text style={styles.emptyStateSubText}>Explore fitness activities to stay active.</Text>
              </View>
            )}
            {activeFitness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Active Programs</Text>
                {activeFitness.map((registration) => {
                  const program = registration.activity;
                  return (
                    <TouchableOpacity
                      key={registration.id}
                      style={styles.card}
                      onPress={() => navigation.navigate('EngageDetails', { item: program })}
                      activeOpacity={1.0}
                    >
                      <Image source={{ uri: getFullUrl(program.thumbnail) }} style={styles.wellnessImage} />
                      <View style={styles.cardContent}>
                        <View style={styles.cardRow}>
                          <View>
                            <Text style={styles.cardTitle}>{program.title}</Text>
                            <Text style={styles.cardSubtitle}>{program.type}</Text>
                          </View>
                          <Text style={styles.statusText}>Enrolled</Text>
                        </View>
                        <View style={styles.cardRow}>
                          <Text>Registered on {new Date(registration.registeredAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.priceRow}>
                          <View>
                            {program.price === 0 ? (
                              <Text style={styles.freeText}>Free</Text>
                            ) : (
                              <View style={styles.priceContainer}>
                                <Text style={styles.rupeeIcon}>₹</Text>
                                <Text style={styles.priceText}>{program.price}</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText}>+{program.points || 0} pts</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.continueButton}
                          activeOpacity={1.0}
                          onPress={() => navigation.navigate('EngageDetails', { item: program })}
                        >
                          <Play style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Start Activity</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {completedFitness.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Completed Programs</Text>
                <View style={styles.completedBadge}>
                  <CheckCircle style={styles.badgeIcon} />
                  <Text style={styles.badgeText}>Done</Text>
                </View>
                {completedFitness.map((registration) => {
                  const program = registration.activity;
                  return (
                    <View key={registration.id} style={styles.completedCard}>
                      <Image source={{ uri: getFullUrl(program.thumbnail) }} style={[styles.completedImage, styles.grayscale]} />
                      <View style={styles.completedContent}>
                        <View style={styles.completedHeader}>
                          <View>
                            <Text style={styles.completedTitle} numberOfLines={1}>{program.title}</Text>
                            <Text style={styles.completedSubtitle}>{program.type}</Text>
                          </View>
                        </View>
                        <View style={styles.completedRow}>
                          <Text>Completed on {new Date(registration.completedAt || registration.registeredAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.priceRow}>
                          <View>
                            {program.price === 0 ? (
                              <Text style={styles.freeText}>Free</Text>
                            ) : (
                              <View style={styles.priceContainer}>
                                <Text style={styles.rupeeIcon}>₹</Text>
                                <Text style={styles.priceText}>{program.price}</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText}>+{program.points || 0} pts</Text>
                          </View>
                        </View>
                        {program.certificate && (
                          <TouchableOpacity style={styles.downloadButton} activeOpacity={1.0}>
                            <Download style={styles.downloadIcon} />
                            <Text style={styles.downloadText}>Download Certificate</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <View>
            {upcomingEvents.length === 0 && completedEvents.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No events registered yet.</Text>
                <Text style={styles.emptyStateSubText}>Register for events to expand your knowledge.</Text>
              </View>
            )}
            {upcomingEvents.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {upcomingEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => navigation.navigate('EventViewer', { event })}
                    activeOpacity={1.0}
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
                    <View style={styles.priceRow}>
                      <View>
                        {event.price === 0 ? (
                          <Text style={styles.freeText}>Free</Text>
                        ) : (
                          <View style={styles.priceContainer}>
                            <Text style={styles.rupeeIcon}>₹</Text>
                            <Text style={styles.priceText}>{event.price}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>+{event.points || 0} pts</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={1.0}>
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

        {/* Conferences Tab */}
        {activeTab === 'conferences' && (
          <View>
            {upcomingConferences.length === 0 && completedConferences.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No conferences registered yet.</Text>
                <Text style={styles.emptyStateSubText}>Register for conferences to expand your knowledge.</Text>
              </View>
            )}
            {upcomingConferences.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Upcoming Conferences</Text>
                {upcomingConferences.map((conference) => (
                  <TouchableOpacity
                    key={conference.id}
                    style={styles.eventCard}
                    onPress={() => navigation.navigate('ConferenceViewer', { conference })}
                    activeOpacity={1.0}
                  >
                    <Image
                      source={{ uri: getFullUrl(conference.image) }}
                      style={styles.eventImage}
                      onError={() => console.log('Image load error for conference:', conference.id)}
                    />
                    <View style={styles.eventContent}>
                      <View style={styles.eventHeader}>
                        <View>
                          <Text style={styles.eventTitle} numberOfLines={1}>{conference.title}</Text>
                          <Text style={styles.eventType}>{conference.type}</Text>
                        </View>
                        {conference.daysUntil && conference.daysUntil <= 3 && (
                          <Text style={styles.daysLeft}>{conference.daysUntil}d left</Text>
                        )}
                      </View>
                      <View style={styles.eventDetails}>
                        <View style={styles.iconText}>
                          <Calendar style={styles.icon} />
                          <Text>{new Date(conference.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Clock style={styles.icon} />
                          <Text>{conference.time}</Text>
                        </View>
                        <View style={styles.iconText}>
                          <Users style={styles.icon} />
                          <Text>{conference.location}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={1.0}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ChevronRight style={styles.chevronIcon} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {completedConferences.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Past Conferences</Text>
                {completedConferences.map((conference) => (
                  <View key={conference.id} style={[styles.eventCard, styles.pastEvent]}>
                    <Image
                      source={{ uri: getFullUrl(conference.image) }}
                      style={[styles.eventImage, styles.grayscale]}
                      onError={() => console.log('Image load error for completed conference:', conference.id)}
                    />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle} numberOfLines={1}>{conference.title}</Text>
                      <Text style={styles.pastDate}>
                        {new Date(conference.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
            {upcomingWorkshops.length === 0 && completedWorkshops.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No workshops registered yet.</Text>
                <Text style={styles.emptyStateSubText}>Join workshops to enhance your skills.</Text>
              </View>
            )}
            {upcomingWorkshops.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcomingWorkshops.map((workshop) => (
                  <TouchableOpacity
                    key={workshop.id}
                    style={styles.workshopCard}
                    onPress={() => navigation.navigate('WorkshopViewer', { workshop })}
                    activeOpacity={1.0}
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
                        <Text style={styles.workshopSubtitle}>by {workshop.instructor?.name || workshop.instructor}</Text>
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
                    <View style={styles.priceRow}>
                      <View>
                        {workshop.price === 0 ? (
                          <Text style={styles.freeText}>Free</Text>
                        ) : (
                          <View style={styles.priceContainer}>
                            <Text style={styles.rupeeIcon}>₹</Text>
                            <Text style={styles.priceText}>{workshop.price}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>+{workshop.points || 0} pts</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={1.0}>
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

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TabIcon name="Home" focused={false} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }))} />
        <TabIcon name="Learning" focused={true} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { initialTab: 'Learning' } }] }))} />
        <TabIcon name="Engage" focused={false} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { initialTab: 'Engage' } }] }))} />
        <TabIcon name="Mentors" focused={false} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { initialTab: 'Mentors' } }] }))} />
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 64,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
    width: 120,
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
  completedPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  completedPlayBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedPlayIcon: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 2,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  freeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freeBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  freeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
});

export default MyLearningScreen;