import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { catalogAPI, courseAPI, workshopAPI, eventAPI, newsAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';

const getTypeBadgeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case 'course':
      return { backgroundColor: '#00FFFF' };
    case 'workshop':
      return { backgroundColor: '#FF1493' };
    case 'event':
      return { backgroundColor: '#39FF14' };
    case 'news':
      return { backgroundColor: '#FFD700' };
    default:
      return { backgroundColor: '#BF00FF' };
  }
};

const CatalogScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatalog();

    // Connect to socket and listen for real-time updates
    const socket = connectSocket();
    const unsubscribeCourseUpdate = onSocket('course_update', (data) => {
      console.log('Course update received:', data);
      // Refresh enrolled courses when a course is purchased
      courseAPI.getMyCourses().then(res => {
        setEnrolledCourses(res.data?.courses || []);
      }).catch(err => console.error('Error refreshing enrolled courses:', err));
    });

    return () => {
      // Cleanup socket listeners
      if (unsubscribeCourseUpdate) unsubscribeCourseUpdate();
      disconnectSocket();
    };
  }, []);

  const loadCatalog = async () => {
    try {
      // Load all content types and enrolled courses
      const [coursesRes, workshopsRes, eventsRes, newsRes, enrolledRes] = await Promise.all([
        catalogAPI.getCatalog().catch(() => ({ data: [] })),
        workshopAPI.getAllWorkshops().catch(() => ({ data: { workshops: [] } })),
        eventAPI.getAllEvents().catch(() => ({ data: { events: [] } })),
        newsAPI.getAllNews().catch(() => ({ data: [] })),
        courseAPI.getMyCourses().catch(() => ({ data: { courses: [] } }))
      ]);

      setCourses(coursesRes.data || []);
      setWorkshops(workshopsRes.data.workshops || []);
      setEvents(eventsRes.data.events || []);
      setNews(newsRes.data || []);
      setEnrolledCourses(enrolledRes.data?.courses || []);
    } catch (error) {
      setCourses([]);
      setWorkshops([]);
      setEvents([]);
      setNews([]);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => {
    const isEnrolled = enrolledCourses.some(enrolled => enrolled._id === item._id);
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => navigation.navigate('CourseDetail', { course: item, hasPurchased: isEnrolled })}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title || 'Course Title'}</Text>
          <View style={[styles.typeBadge, getTypeBadgeStyle(item.type)]}>
            <Text style={styles.typeBadgeText}>{item.type || 'Course'}</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>
            {(item.price && item.price > 0) ? `₹${item.price}` : 'Free'}
          </Text>
          <Text style={styles.courseDuration}>
            {item.duration || 'Self-paced'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWorkshopItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => navigation.navigate('WorkshopDetail', { workshop: item })}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title || 'Workshop Title'}</Text>
          <View style={[styles.typeBadge, getTypeBadgeStyle('workshop')]}>
            <Text style={styles.typeBadgeText}>Workshop</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>
            {(item.price && item.price > 0) ? `₹${item.price}` : 'Free'}
          </Text>
          <Text style={styles.courseDuration}>
            {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'TBD'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title || 'Event Title'}</Text>
          <View style={[styles.typeBadge, getTypeBadgeStyle('event')]}>
            <Text style={styles.typeBadgeText}>Event</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>
            {(item.price && item.price > 0) ? `₹${item.price}` : 'Free'}
          </Text>
          <Text style={styles.courseDuration}>
            {item.date ? new Date(item.date).toLocaleDateString() : 'TBD'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNewsItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => navigation.navigate('NewsDetail', { news: item })}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title || 'News Title'}</Text>
          <View style={[styles.typeBadge, getTypeBadgeStyle('news')]}>
            <Text style={styles.typeBadgeText}>News</Text>
          </View>
        </View>

        {item.imageUrl && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.mediaImage} resizeMode="cover" />
          </View>
        )}

        {item.externalUrl && (
          <View style={styles.mediaContainer}>
            <TouchableOpacity style={styles.videoContainer} onPress={() => {
              if (item.externalUrl) {
                Linking.openURL(item.externalUrl).catch(err => console.error('Failed to open URL:', err));
              }
            }}>
              <Text style={styles.videoText}>🎥 Tap to Play Video</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.content || item.excerpt || 'No content available'}
        </Text>

        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>
            {item.category || 'General'}
          </Text>
          <Text style={styles.courseDuration}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading catalog...</Text>
      </View>
    );
  }

  // Combine all content types into a single list
  const allItems = useMemo(() => [
    ...courses.map(item => ({ ...item, contentType: 'course' })),
    ...workshops.map(item => ({ ...item, contentType: 'workshop' })),
    ...events.map(item => ({ ...item, contentType: 'event' })),
    ...news.map(item => ({ ...item, contentType: 'news' }))
  ], [courses, workshops, events, news]);

  const renderItem = useCallback(({ item }) => {
    switch (item.contentType) {
      case 'course':
        return renderCourseItem({ item });
      case 'workshop':
        return renderWorkshopItem({ item });
      case 'event':
        return renderEventItem({ item });
      case 'news':
        return renderNewsItem({ item });
      default:
        return renderCourseItem({ item });
    }
  }, [enrolledCourses, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Catalog</Text>
        <Text style={styles.headerSubtitle}>
          {allItems.length} items available
        </Text>
      </View>

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadCatalog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00FFFF',
  },
  header: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00FFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  courseDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#39FF14',
  },
  courseDuration: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  videoText: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  videoContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
});

export default memo(CatalogScreen);