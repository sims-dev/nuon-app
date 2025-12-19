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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import Video from 'react-native-video';
import { courseAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const rupeeSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M7 12h7c3 0 4.5 2 4.5 4s-1.5 4-4.5 4L7 20"/></svg>`;

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const CourseDetailScreen = ({ route, navigation }) => {
  const { course, hasPurchased } = route.params;
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Learning');
    }
  };

  const handlePurchase = async () => {
    if (course.price === 0) {
      // Free course - direct enrollment
      try {
        setLoading(true);
        await courseAPI.purchaseCourse(course._id, true);
        setSuccessVisible(true);
      } catch (error) {
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

  const getWhatYouWillLearn = () => [
    'Comprehensive curriculum covering essential concepts',
    'Real-world case studies and practical applications',
    'Interactive assessments and quizzes',
    'Expert-led video lectures and tutorials',
    'Downloadable resources and study materials',
    'Professional certificate upon completion',
    'Lifetime access to course materials',
    'Community forum for peer discussion',
  ];

  const getModules = () => [
    { title: 'Introduction & Fundamentals', duration: '2 hours', lessons: 4 },
    { title: 'Core Concepts & Theory', duration: '4 hours', lessons: 6 },
    { title: 'Practical Applications', duration: '5 hours', lessons: 8 },
    { title: 'Advanced Techniques', duration: '3 hours', lessons: 4 },
    { title: 'Case Studies & Analysis', duration: '2 hours', lessons: 3 },
  ];

  const image = getFullUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600';

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        title="Payment Successful!"
        message="You're enrolled in Advanced Patient Care & Management"
        buttonText="Awesome!"
        onClose={() => {
          setSuccessVisible(false);
          navigation.navigate('MyLearning');
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#111827" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image source={{ uri: image }} style={styles.heroImg} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroOverlay}
          />
          {hasPurchased && course.lessons && course.lessons[0] && course.lessons[0].videoUrl && !showVideo && (
            <TouchableOpacity style={styles.playOverlay} onPress={() => setShowVideo(true)} activeOpacity={0.7}>
              <View style={styles.playBtn}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Player (if enrolled and playing) */}
        {hasPurchased && course.lessons && course.lessons[0] && course.lessons[0].videoUrl && showVideo && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: getFullUrl(course.lessons[0].videoUrl) }}
              style={styles.video}
              controls
              resizeMode="contain"
              fullscreen={true}
              poster={getFullUrl(course.lessons[0].thumbnail)}
              posterResizeMode="cover"
              onFullscreenPlayerWillDismiss={() => setShowVideo(false)}
            />
          </View>
        )}

        <View style={styles.content}>
          {/* Title and Badge */}
          <View style={styles.titleSection}>
            <View style={styles.badgeBlue}>
              <SvgXml xml={bookOpenSvg} width={12} height={12} color="#fff" />
              <Text style={styles.badgeText}>Course</Text>
            </View>
            <Text style={styles.title}>{course.title}</Text>
            {course.instructor && (
              <Text style={styles.instructor}>
                by {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Expert Instructor'}
              </Text>
            )}
            {course.level && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{course.level}</Text>
              </View>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.card}>
            {course.duration && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#6366F1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{course.duration}</Text>
                </View>
              </View>
            )}
            {course.modules && (
              <View style={styles.infoRow}>
                <SvgXml xml={bookOpenSvg} width={20} height={20} color="#6366F1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Modules</Text>
                  <Text style={styles.infoValue}>{course.modules} comprehensive modules</Text>
                </View>
              </View>
            )}
            {course.enrolledCount && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#6366F1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Enrolled</Text>
                  <Text style={styles.infoValue}>{course.enrolledCount} students</Text>
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <SvgXml xml={awardSvg} width={20} height={20} color="#6366F1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Certificate</Text>
                <Text style={styles.infoValue}>Yes, upon completion</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <SvgXml xml={downloadSvg} width={20} height={20} color="#6366F1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Materials</Text>
                <Text style={styles.infoValue}>Downloadable resources included</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About This Course</Text>
            <Text style={styles.description}>
              {course.description ||
                'Enhance your professional skills with this comprehensive course designed specifically for nurses. Led by experienced healthcare professionals and industry experts, this program provides in-depth knowledge, practical applications, and real-world case studies to help you excel in your nursing career. Earn a certificate upon completion to showcase your expertise.'}
            </Text>
          </View>

          {/* What You'll Learn */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You'll Learn</Text>
            <View style={styles.bulletList}>
              {getWhatYouWillLearn().map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Topics */}
          {course.topics && course.topics.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Topics Covered</Text>
              <View style={styles.bulletList}>
                {course.topics.map((topic, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Course Curriculum */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Course Curriculum</Text>
            <View style={styles.moduleList}>
              {getModules().map((module, index) => (
                <View key={index} style={styles.moduleItem}>
                  <View style={styles.moduleLeft}>
                    <Text style={styles.moduleNumber}>Module {index + 1}</Text>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                  </View>
                  <View style={styles.moduleRight}>
                    <Text style={styles.moduleMeta}>{module.lessons} lessons</Text>
                    <Text style={styles.moduleMeta}>{module.duration}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Why Take This Course */}
          <View style={styles.cardHighlight}>
            <Text style={styles.cardTitleHighlight}>Why Take This Course?</Text>
            <Text style={styles.descriptionHighlight}>
              Continuous learning is essential for providing excellent patient care and advancing your nursing career. This course offers evidence-based content, practical skills, and professional recognition that will enhance your capabilities and open new opportunities in healthcare.
            </Text>
          </View>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Requirements</Text>
              <View style={styles.bulletList}>
                {course.requirements.map((req, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{req}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            {course.price === 0 ? (
              <Text style={styles.priceFree}>Free</Text>
            ) : (
              <View style={styles.priceRow}>
                <SvgXml xml={rupeeSymbol} width={20} height={20} color="#111827" />
                <Text style={styles.priceValue}>{course.price}</Text>
              </View>
            )}
          </View>
          {course.points && (
            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>You'll Earn</Text>
              <View style={styles.pointsRow}>
                <SvgXml xml={giftSvg} width={18} height={18} color="#EAB308" />
                <Text style={styles.pointsValue}>+{course.points} points</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.enrollBtn} onPress={handlePurchase} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.enrollBtnText}>{course.price === 0 ? 'Enroll Free' : 'Enroll Now'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 52 : 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  hero: {
    height: 256,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#E5E7EB',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 4,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgeBlue: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 32,
  },
  instructor: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  moduleList: {
    gap: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  moduleLeft: {
    flex: 1,
  },
  moduleNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  moduleRight: {
    alignItems: 'flex-end',
  },
  moduleMeta: {
    fontSize: 11,
    color: '#6B7280',
  },
  cardHighlight: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitleHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 12,
  },
  descriptionHighlight: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceFree: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EAB308',
  },
  enrollBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  enrollBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CourseDetailScreen;