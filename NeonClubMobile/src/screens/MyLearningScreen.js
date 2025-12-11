// Helper to get full URL for uploads (always keep at the top, outside the component)
import React, { useState, useEffect } from 'react';
const BASE_URL = 'http://192.168.0.7:5000'; // Updated to correct IP
const getFullUrl = (path) => path && typeof path === 'string' && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { courseAPI, eventAPI, workshopAPI, activitiesAPI, mentorAPI } from '../services/api';
import { LEARNING_HERO } from '../assets/heroImages';

const MyLearningScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, eventsRes, workshopsRes, sessionsRes] = await Promise.all([
        courseAPI.getMyCourses().catch(() => ({ data: {} })),
        eventAPI.getMyEvents().catch(() => ({ data: {} })),
        workshopAPI.getMyWorkshops().catch(() => ({ data: {} })),
        mentorAPI.getMyBookings().catch(() => ({ data: {} })),
      ]);
      const cRaw = coursesRes?.data?.courses ?? coursesRes?.data ?? [];
      const eRaw = eventsRes?.data?.events ?? eventsRes?.data ?? [];
      const wRaw = workshopsRes?.data?.workshops ?? workshopsRes?.data ?? [];
      const sRaw = sessionsRes?.data?.bookings ?? sessionsRes?.data ?? [];
      setCourses(Array.isArray(cRaw) ? cRaw : []);
      setEvents(Array.isArray(eRaw) ? eRaw : []);
      setWorkshops(Array.isArray(wRaw) ? wRaw : []);
      setSessions(Array.isArray(sRaw) ? sRaw : []);
    } catch (error) {
      console.error('Error loading learning data:', error);
    }
    setLoading(false);
  };

  const getStatusText = (item) => {
    if (item.completed) return 'Completed';
    if (item.progress >= 100) return 'Completed';
    if (item.status) return item.status;
    return 'In Progress';
  };

  const formatDateTime = (date, duration) => {
    try {
      const d = new Date(date);
      const day = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      if (!duration) return day;
      return `${day} • ${duration}`;
    } catch {
      return date;
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.heroCard}
      activeOpacity={0.9}
      onPress={() => {
        try { activitiesAPI.create({ type: 'course-open', title: item.title, ref: item._id }); } catch {}
        navigation.navigate('CourseViewer', { course: item });
      }}
    >
      <View style={styles.heroImageWrap}>
        <Image source={{ uri: getFullUrl(item.thumbnail) || getFullUrl(item.image) || LEARNING_HERO || 'https://via.placeholder.com/400x300/667eea/ffffff?text=Course' }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.statusPill}><Text style={styles.statusPillText}>{getStatusText(item)}</Text></View>
        <Text style={styles.heroTitle} numberOfLines={1}>{item.title || 'Untitled'}</Text>
      </View>
      <View style={styles.heroProgressRow}>
        <Text style={styles.progressLabel}>Your Progress</Text>
        <Text style={styles.progressPct}>{(item.progress && typeof item.progress === 'number' ? item.progress : 0)}% Complete</Text>
      </View>
      <View style={styles.progressBarRich}><View style={[styles.progressFillRich, { width: `${item.progress && typeof item.progress === 'number' ? item.progress : 0}%` }]} /></View>
      <View style={styles.nextLessonCard}>
        <Text style={styles.nextLessonLabel}>Next Lesson</Text>
        <Text style={styles.nextLessonTitle} numberOfLines={1}>{item.nextLesson || 'Lesson 16: Emergency Response'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderWorkshopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.heroCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('WorkshopViewer', { workshop: { ...item, hasRegistered: true } })}
    >
      <View style={styles.heroImageWrap}>
        <Image source={{ uri: getFullUrl(item.thumbnail) || getFullUrl(item.coverImage) || getFullUrl(item.imageUrl) || LEARNING_HERO || 'https://via.placeholder.com/400x300/667eea/ffffff?text=Session' }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.statusPill}><Text style={styles.statusPillText}>{getStatusText(item)}</Text></View>
        <Text style={styles.heroTitle} numberOfLines={1}>{item.title || 'Untitled Session'}</Text>
      </View>
      <View style={styles.heroProgressRow}>
        <Text style={styles.progressLabel}>Status</Text>
        <Text style={styles.progressPct}>{getStatusText(item)}</Text>
      </View>
      <View style={styles.nextLessonCard}>
        <Text style={styles.nextLessonLabel}>Date</Text>
        <Text style={styles.nextLessonTitle} numberOfLines={1}>{formatDateTime(item.startDate || item.date, item.duration)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.heroCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventViewer', { event: { ...item, hasRegistered: true } })}
    >
      <View style={styles.heroImageWrap}>
        <Image source={{ uri: getFullUrl(item.thumbnail) || getFullUrl(item.coverImage) || getFullUrl(item.imageUrl) || LEARNING_HERO || 'https://via.placeholder.com/400x300/667eea/ffffff?text=Workshop' }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.statusPill}><Text style={styles.statusPillText}>{getStatusText(item)}</Text></View>
        <Text style={styles.heroTitle} numberOfLines={1}>{item.title || 'Untitled Workshop'}</Text>
      </View>
      <View style={styles.heroProgressRow}>
        <Text style={styles.progressLabel}>Status</Text>
        <Text style={styles.progressPct}>{getStatusText(item)}</Text>
      </View>
      <View style={styles.nextLessonCard}>
        <Text style={styles.nextLessonLabel}>Date</Text>
        <Text style={styles.nextLessonTitle} numberOfLines={1}>{formatDateTime(item.date, item.duration)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.heroCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('VideoSession', { session: item })}
    >
      <View style={styles.heroImageWrap}>
        <Image source={{ uri: getFullUrl(item.thumbnail) || getFullUrl(item.coverImage) || getFullUrl(item.imageUrl) || LEARNING_HERO || 'https://via.placeholder.com/400x300/667eea/ffffff?text=Event' }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.statusPill}><Text style={styles.statusPillText}>{getStatusText(item)}</Text></View>
        <Text style={styles.heroTitle} numberOfLines={1}>{item.title || 'Untitled Event'}</Text>
      </View>
      <View style={styles.heroProgressRow}>
        <Text style={styles.progressLabel}>Status</Text>
        <Text style={styles.progressPct}>{getStatusText(item)}</Text>
      </View>
      <View style={styles.nextLessonCard}>
        <Text style={styles.nextLessonLabel}>Date</Text>
        <Text style={styles.nextLessonTitle} numberOfLines={1}>{formatDateTime(item.date, item.duration)}</Text>
      </View>
    </TouchableOpacity>
  );

  const tabs = [
    { key: 'courses', label: 'Courses' },
    { key: 'workshops', label: 'Workshops' },
    { key: 'events', label: 'Events' },
    { key: 'sessions', label: 'Sessions' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Tab Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={{ paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: activeTab === tab.key ? '#6366F1' : 'transparent', flex: 1 }}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={{ textAlign: 'center', color: activeTab === tab.key ? '#6366F1' : '#6B7280', fontWeight: '700' }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {loading && <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 32 }} />}

        {activeTab === 'courses' && (
          (Array.isArray(courses) ? courses.filter(Boolean) : []).length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 32 }}>No courses enrolled yet.</Text>
          ) : (
            (Array.isArray(courses) ? courses.filter(Boolean) : []).map((item, idx) => (
              <View key={item._id || item.id || idx}>{renderCourseItem({ item })}</View>
            ))
          )
        )}

        {activeTab === 'workshops' && (
          (Array.isArray(workshops) ? workshops.filter(Boolean) : []).length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 32 }}>No workshops enrolled yet.</Text>
          ) : (
            (Array.isArray(workshops) ? workshops : []).filter(Boolean).map((item, idx) => {
              // Defensive: ensure videoUrl is available at top-level or in metadata
              if (!item.videoUrl && item.metadata && item.metadata.videoUrl) {
                item.videoUrl = item.metadata.videoUrl;
              }
              return <View key={item._id || item.id || idx}>{renderWorkshopItem({ item })}</View>;
            })
          )
        )}

        {activeTab === 'events' && (
          (Array.isArray(events) ? events.filter(Boolean) : []).length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 32 }}>No events booked yet.</Text>
          ) : (
            (Array.isArray(events) ? events.filter(Boolean) : []).map((item, idx) => (
              <View key={item._id || item.id || idx}>{renderEventItem({ item })}</View>
            ))
          )
        )}

        {activeTab === 'sessions' && (
          (Array.isArray(sessions) ? sessions.filter(Boolean) : []).length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 32 }}>No sessions booked yet.</Text>
          ) : (
            (Array.isArray(sessions) ? sessions.filter(Boolean) : []).map((item, idx) => (
              <View key={item._id || item.id || idx}>{renderSessionItem({ item })}</View>
            ))
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heroImageWrap: { position: 'relative', height: 140, backgroundColor: '#E0E7FF' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  statusPill: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, elevation: 1 },
  statusPillText: { color: '#6366F1', fontWeight: '700', fontSize: 12 },
  heroTitle: { position: 'absolute', left: 16, bottom: 12, color: '#fff', fontWeight: '800', fontSize: 18, textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  heroProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  progressLabel: { color: '#6B7280', fontSize: 13 },
  progressPct: { color: '#6366F1', fontWeight: '700', fontSize: 13 },
  progressBarRich: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 6, marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  progressFillRich: { height: 6, backgroundColor: '#6366F1', borderRadius: 6 },
  nextLessonCard: { backgroundColor: '#F3F4F6', borderRadius: 8, margin: 12, padding: 10 },
  nextLessonLabel: { color: '#6B7280', fontSize: 12 },
  nextLessonTitle: { color: '#111827', fontWeight: '700', fontSize: 14 },
});

export default MyLearningScreen;