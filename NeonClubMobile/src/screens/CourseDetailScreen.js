import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import { courseAPI, paymentAPI, getBaseURL } from '../services/api';
import SuccessModal from '../components/SuccessModal';

const BASE_URL = getBaseURL().replace('/api', ''); // Use centralized base URL
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const CourseDetailScreen = ({ route, navigation }) => {
  const { course, hasPurchased } = route.params;
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePurchase = async () => {
    if (course.price === 0) {
      // Free course - direct enrollment
      try {
        setLoading(true);
        await courseAPI.purchaseCourse(course._id, true);
        setSuccessVisible(true);
      } catch (error) {
        // Try to show a more specific error if already enrolled
        const msg = error?.response?.data?.message;
        if (msg && msg.toLowerCase().includes('already purchased')) {
          Alert.alert('Already Enrolled', 'You have already enrolled in this course.');
        } else {
          Alert.alert('Error', 'Failed to enroll in course');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Paid course - navigate to payment
      navigation.navigate('Payment', {
        item: course,
        type: 'course',
        amount: course.price,
      });
    }
  };

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        title="Awesome!"
        message="You have successfully enrolled in this course."
        buttonText="Go to My Learning"
        onClose={() => { setSuccessVisible(false); navigation.navigate('MyLearning'); }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, getTypeBadgeStyle(course.type)]}>
            <Text style={styles.typeBadgeText}>{course.type}</Text>
          </View>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.price}>
            {course.price > 0 ? `₹${course.price}` : 'Free'}
          </Text>
          {/* Always show the course thumbnail at the top */}
          <View style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 16, backgroundColor: '#eee', overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: getFullUrl(course.thumbnail) }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            {/* If enrolled and lesson video exists, show play button overlay */}
            {hasPurchased && course.lessons && course.lessons[0] && course.lessons[0].videoUrl && !showVideo ? (
              <TouchableOpacity
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setShowVideo(true)}
                activeOpacity={0.7}
              >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 32, padding: 16 }}>
                  <Text style={{ fontSize: 40, color: '#fff' }}>▶</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          {/* Show video player only if enrolled and user tapped play */}
          {hasPurchased && course.lessons && course.lessons[0] && course.lessons[0].videoUrl && showVideo ? (
            <View style={{ width: '100%', aspectRatio: 16/9, marginTop: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
              <Video
                source={{ uri: getFullUrl(course.lessons[0].videoUrl) }}
                style={{ width: '100%', height: '100%' }}
                controls
                resizeMode="contain"
                fullscreen={true}
                poster={getFullUrl(course.lessons[0].thumbnail)}
                posterResizeMode="cover"
                onFullscreenPlayerWillDismiss={() => setShowVideo(false)}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>

          {course.duration ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <Text style={styles.info}>{course.duration}</Text>
            </View>
          ) : null}

          {course.instructor ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructor</Text>
              <Text style={styles.info}>{typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown'}</Text>
            </View>
          ) : null}

          {course.level ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level</Text>
              <Text style={styles.info}>{course.level}</Text>
            </View>
          ) : null}

          {course.topics && course.topics.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Topics Covered</Text>
              {course.topics.map((topic, index) => (
                <Text key={index} style={styles.topic}>
                  • {topic}
                </Text>
              ))}
            </View>
          ) : null}

          {course.requirements && course.requirements.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {course.requirements.map((req, index) => (
                <Text key={index} style={styles.requirement}>
                  • {req}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.fixedBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {course.price > 0 ? `₹${course.price}` : 'Free'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.purchaseButton, { minWidth: 180 }]}
          onPress={handlePurchase}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              {course.price > 0 ? 'Enroll Now' : 'Enroll Now'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getTypeBadgeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case 'course':
      return { backgroundColor: '#3b82f6' };
    case 'workshop':
      return { backgroundColor: '#8b5cf6' };
    case 'event':
      return { backgroundColor: '#10b981' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  info: {
    fontSize: 16,
    color: '#475569',
  },
  topic: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    paddingLeft: 8,
  },
  requirement: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  purchaseButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fixedBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: { color: '#6B7280', fontSize: 12 },
  totalValue: { color: '#111827', fontSize: 18, fontWeight: 'bold' },
});

export default CourseDetailScreen;