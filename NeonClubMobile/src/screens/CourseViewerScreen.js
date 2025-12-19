import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { courseAPI, progressAPI } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';

// Helper to get full URL for uploads
const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const CourseViewerScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await progressAPI.getUserProgress(course._id);
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Error loading progress:', error);
      // Initialize empty progress if not found
      setProgress({
        progress: 0,
        lessons: course.lessons?.map(lesson => ({
          lessonId: lesson._id,
          completed: false
        })) || [],
        currentLesson: course.lessons?.[0]?._id || null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = async (lesson) => {
    if (isLessonLocked(lesson)) return;

    // Mark lesson as current and navigate to lesson
    setProgress(prev => ({
      ...prev,
      currentLesson: lesson._id
    }));

    // Navigate to video player if video URL exists
    if (lesson.videoUrl) {
      navigation.navigate('VideoPlayer', {
        videoUrl: getFullUrl(lesson.videoUrl),
        title: lesson.title,
        courseId: course._id,
        lessonId: lesson._id
      });
    } else {
      Alert.alert(
        'Lesson Selected',
        `Playing: ${lesson.title}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleCompleteLesson = async (lesson) => {
    if (updatingProgress) return;

    try {
      setUpdatingProgress(true);
      await progressAPI.updateLessonProgress(
        course._id,
        lesson._id,
        { completed: true, timeSpent: 1800 } // 30 minutes
      );

      // Reload progress
      await loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await progressAPI.downloadCertificate(course._id);
      Alert.alert(
        'Success',
        'Certificate downloaded successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to download certificate');
    }
  };

  const isLessonLocked = (lesson) => {
    if (!progress?.lessons) return false;
    const lessonProgress = progress.lessons.find(l => l.lessonId === lesson._id);
    return lessonProgress?.completed === false && progress.currentLesson !== lesson._id;
  };

  const getLessonStatus = (lesson) => {
    if (!progress?.lessons) return 'locked';
    const lessonProgress = progress.lessons.find(l => l.lessonId === lesson._id);

    if (lessonProgress?.completed) return 'completed';
    if (progress.currentLesson === lesson._id) return 'current';
    return 'locked';
  };

  const renderLesson = (lesson, index) => {
    const status = getLessonStatus(lesson);
    const isLocked = status === 'locked';

    return (
      <TouchableOpacity
        key={lesson._id || index}
        style={[styles.lessonCard, isLocked && styles.lessonLocked]}
        onPress={() => handleLessonPress(lesson)}
        disabled={isLocked}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
              {lesson.title}
            </Text>
            <Text style={[styles.lessonDuration, isLocked && styles.lessonDurationLocked]}>
              {Math.floor(lesson.duration / 60)} min
            </Text>
          </View>
          <View style={[styles.lessonStatus, getStatusStyle(status)]}>
            {status === 'completed' && <Text style={styles.statusIcon}>✓</Text>}
            {status === 'current' && <Text style={styles.statusIcon}>▶</Text>}
            {status === 'locked' && <Text style={styles.statusIcon}>🔒</Text>}
          </View>
        </View>

        {status === 'current' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteLesson(lesson)}
            disabled={updatingProgress}
          >
            <Text style={styles.completeButtonText}>
              {updatingProgress ? 'Updating...' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { backgroundColor: '#39FF14' };
      case 'current': return { backgroundColor: '#00FFFF' };
      default: return { backgroundColor: '#666' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FFFF" />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  const currentProgress = progress?.progress || 0;
  const isCompleted = currentProgress === 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.banner}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentProgress}% Complete</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${currentProgress}%` }]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Lessons</Text>
              <Text style={styles.detailValue}>{course.lessons?.length || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {course.lessons?.reduce((total, lesson) => total + (lesson.duration || 0), 0) / 3600 || 0} hrs
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Enrolled</Text>
              <Text style={styles.detailValue}>
                {new Date(course.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          {course.lessons?.map((lesson, index) => renderLesson(lesson, index))}
        </View>

        {isCompleted && (
          <View style={styles.certificateSection}>
            <Text style={styles.certificateTitle}>🎉 Congratulations!</Text>
            <Text style={styles.certificateText}>
              You have completed this course. Download your certificate below.
            </Text>
            <TouchableOpacity
              style={styles.certificateButton}
              onPress={handleDownloadCertificate}
            >
              <Text style={styles.certificateButtonText}>Download Certificate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F9FAFB' },
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F9FAFB' },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00FFFF',
  },
  header: { backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  banner: { padding:20 },
  courseTitle: { fontSize:24, fontWeight:'bold', color:'#111827', marginBottom:16 },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: { fontSize:16, color:'#7C3AED', marginBottom:8 },
  progressBar: { height:8, backgroundColor:'#E5E7EB', borderRadius:4 },
  progressFill: { height:'100%', backgroundColor:'#7C3AED', borderRadius:4 },
  content: { padding:20 },
  section: {
    marginBottom: 24,
  },
  sectionTitle: { fontSize:20, fontWeight:'bold', color:'#111827', marginBottom:16 },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: { flex:1, alignItems:'center', padding:16, backgroundColor:'#fff', borderRadius:12, marginHorizontal:4, borderWidth:1, borderColor:'#E5E7EB' },
  detailLabel: { fontSize:12, color:'#6B7280', marginBottom:4 },
  detailValue: { fontSize:16, fontWeight:'bold', color:'#7C3AED' },
  lessonCard: { backgroundColor:'#fff', borderRadius:12, padding:16, marginBottom:12, borderWidth:1, borderColor:'#E5E7EB' },
  lessonLocked: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: { width:40, height:40, borderRadius:20, backgroundColor:'#7C3AED', justifyContent:'center', alignItems:'center', marginRight:12 },
  lessonNumberText: { color:'#fff', fontSize:16, fontWeight:'bold' },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: { fontSize:16, fontWeight:'bold', color:'#111827', marginBottom:4 },
  lessonTitleLocked: { color:'#9CA3AF' },
  lessonDuration: { fontSize:14, color:'#6B7280' },
  lessonDurationLocked: { color:'#9CA3AF' },
  lessonStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: { color:'#fff', fontSize:18, fontWeight:'bold' },
  completeButton: { backgroundColor:'#10B981', padding:12, borderRadius:8, alignItems:'center', marginTop:12 },
  completeButtonText: { color:'#fff', fontWeight:'bold' },
  certificateSection: { backgroundColor:'#ECFDF5', padding:20, borderRadius:12, alignItems:'center', borderWidth:1, borderColor:'#A7F3D0' },
  certificateTitle: { fontSize:20, fontWeight:'bold', color:'#065F46', marginBottom:8 },
  certificateText: { fontSize:14, color:'#065F46', textAlign:'center', marginBottom:16 },
  certificateButton: { backgroundColor:'#10B981', paddingHorizontal:24, paddingVertical:12, borderRadius:20 },
  certificateButtonText: { color:'#fff', fontWeight:'bold' },
});

export default CourseViewerScreen;