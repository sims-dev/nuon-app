import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { ChevronLeft, Calendar, Clock, MapPin, Users, BookOpen, IndianRupee, Gift, GraduationCap, Award, Briefcase, Video as VideoIcon, Download } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import { NeonCard } from './NeonCard';
import { NeonButton } from './NeonButton';
import { ProfileCompletionPrompt } from './ProfileCompletionPrompt';
import { IP_ADDRESS } from '../../config/ipConfig';

const BASE_URL = `http://${IP_ADDRESS}:5000`;

const ImageWithFallback = ({ src, alt, style }) => {
  const [imageError, setImageError] = useState(false);

  const img = src && src.startsWith('/uploads') ? `${BASE_URL}${src}` : src;

  if (!img || imageError) {
    return (
      <Image
        source={{ uri: 'https://via.placeholder.com/300x200/cccccc/000000?text=No+Image' }}
        style={style}
        resizeMode="contain"
      />
    );
  }

  return (
    <Image
      source={{ uri: img }}
      style={style}
      resizeMode="contain"
      onError={() => setImageError(true)}
    />
  );
};

const Badge = ({ children, style, variant }) => (
  <View style={[
    styles.badge,
    variant === 'outline' && styles.badgeOutline,
    style
  ]}>
    {children}
  </View>
);

const Card = ({ children, style }) => (
  <NeonCard style={style}>
    {children}
  </NeonCard>
);

const CardContent = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

const Button = ({ children, onPress, style, disabled }) => (
  <NeonButton
    title={children}
    onPress={onPress}
    style={style}
    disabled={disabled}
  />
);

export default function LearningDetails({ navigation, route }) {
  const { type, data } = route.params || { type: 'course', data: {} };
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  // Add safety check for data
  if (!data || !data.title) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>Content not available</Text>
        </View>
      </View>
    );
  }

  const handlePurchase = async () => {
    try {
      // Check if profile is incomplete
      const profileIncomplete = await AsyncStorage.getItem('profileIncomplete');
      if (profileIncomplete === 'true') {
        Alert.alert(
          'Complete Your Profile',
          'Please complete your professional information to book learning programs. This helps us provide you with the best experience.\n\nMissing information:\n\n• Current Workplace\n• Nursing Registration Number\n• Highest Qualification',
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Complete Profile Now', onPress: () => navigation.navigate('ProfileSetup') }
          ]
        );
        return;
      }

      // Additional check for profile completion status
      const userProfile = await AsyncStorage.getItem('nurseProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        const requiredFields = ['organization', 'registrationNumber', 'highestQualification'];
        const missingFields = requiredFields.filter(field => !profile[field]);

        if (missingFields.length > 0) {
          const missingLabels = {
            organization: 'Current Workplace',
            registrationNumber: 'Nursing Registration Number',
            highestQualification: 'Highest Qualification'
          };
          const missingText = missingFields.map(field => `• ${missingLabels[field] || field}`).join('\n');

          Alert.alert(
            'Complete Your Profile',
            `Please complete your professional information to book learning programs. This helps us provide you with the best experience.\n\nMissing information:\n\n${missingText}`,
            [
              { text: 'Maybe Later', style: 'cancel' },
              { text: 'Complete Profile Now', onPress: () => navigation.navigate('ProfileSetup') }
            ]
          );
          return;
        }
      }

      if (data.price === 0) {
        // For free items, register directly and navigate to MyLearning
        navigation.navigate('MyLearning');
      } else {
        // For paid items, navigate to payment screen
        navigation.navigate('Payment', { type, data });
      }
    } catch (error) {
      console.log('Purchase error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const getDescriptionByType = () => {
    if (type === 'course') {
      return 'Enhance your professional skills with this comprehensive course designed specifically for nurses. Led by experienced healthcare professionals and industry experts, this program provides in-depth knowledge, practical applications, and real-world case studies to help you excel in your nursing career. Earn a certificate upon completion to showcase your expertise.';
    } else if (type === 'event') {
      return 'Join healthcare professionals from across the country for this enriching event featuring keynote speakers, panel discussions, and networking opportunities. Gain insights from industry leaders, learn about the latest trends and innovations in healthcare, and connect with peers who share your passion for nursing excellence. This event offers valuable knowledge and professional connections that will benefit your career.';
    } else if (type === 'workshop') {
      return 'Develop practical skills through this hands-on workshop led by experienced practitioners. This interactive session combines theoretical knowledge with practical application, providing you with techniques and tools you can immediately apply in your clinical practice. Limited seats ensure personalized attention and ample opportunity for practice and feedback.';
    }
    return '';
  };

  const getWhatYouWillLearn = () => {
    if (type === 'course') {
      return [
        'Comprehensive curriculum covering essential concepts',
        'Real-world case studies and practical applications',
        'Interactive assessments and quizzes',
        'Expert-led video lectures and tutorials',
        'Downloadable resources and study materials',
        'Professional certificate upon completion',
        'Lifetime access to course materials',
        'Community forum for peer discussion',
      ];
    } else if (type === 'event') {
      return [
        'Keynote presentations from industry leaders',
        'Interactive panel discussions and Q&A sessions',
        'Networking opportunities with healthcare professionals',
        'Latest trends and innovations in healthcare',
        'Access to event recordings and materials',
        'Certificate of attendance',
        'Continuing education credits (where applicable)',
        'Exclusive resources and takeaways',
      ];
    } else {
      return [
        'Hands-on practice with equipment and techniques',
        'Step-by-step instruction from expert trainers',
        'Small group setting for personalized learning',
        'Real-world scenarios and case discussions',
        'All materials and equipment provided',
        'Certificate of completion',
        'Practice workbook and reference guides',
        'Post-workshop support and resources',
      ];
    }
  };

  const getCourseModules = () => {
    if (type === 'course' && data.lessons && Array.isArray(data.lessons)) {
      return data.lessons.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration ? `${lesson.duration} min` : 'N/A',
        lessons: 1, // Each lesson is one
        videoUrl: lesson.videoUrl,
        assessment: lesson.assessment
      }));
    } else if (type === 'course' && data.modules) {
      return [
        { title: 'Introduction & Fundamentals', duration: '2 hours', lessons: 4 },
        { title: 'Core Concepts & Theory', duration: '4 hours', lessons: 6 },
        { title: 'Practical Applications', duration: '5 hours', lessons: 8 },
        { title: 'Advanced Techniques', duration: '3 hours', lessons: 4 },
        { title: 'Case Studies & Analysis', duration: '2 hours', lessons: 3 },
      ];
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <ImageWithFallback
            src={data.thumbnail || data.image || ''}
            alt={data.title}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
        </View>

        {/* Video Section for Purchased Courses */}
        {type === 'course' && data.hasPurchased && data.videoUrl && (
          <View style={styles.videoSection}>
            <Text style={styles.videoTitle}>{data.videoTitle || 'Course Video'}</Text>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: getFullUrl(data.videoUrl) }}
                style={styles.videoPlayer}
                controls={true}
                resizeMode="contain"
              />
            </View>
            {data.videoDuration && (
              <Text style={styles.videoDuration}>Duration: {data.videoDuration} minutes</Text>
            )}
            {data.videoQuality && (
              <Text style={styles.videoQuality}>Quality: {data.videoQuality}</Text>
            )}
          </View>
        )}

        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.titleSection}>
            {type === 'course' && (
              <Badge style={styles.courseBadge}>
                <GraduationCap size={12} color="#fff" />
                <Text style={styles.badgeText}> Course</Text>
              </Badge>
            )}
            {type === 'event' && (
              <Badge style={styles.eventBadge}>
                <Calendar size={12} color="#fff" />
                <Text style={styles.badgeText}> Event</Text>
              </Badge>
            )}
            {type === 'workshop' && (
              <Badge style={styles.workshopBadge}>
                <Briefcase size={12} color="#fff" />
                <Text style={styles.badgeText}> Workshop</Text>
              </Badge>
            )}
            <Text style={styles.title}>{data.title}</Text>
            {data.instructor && (
              <Text style={styles.instructor}>by {data.instructor?.name || 'Unknown Instructor'}</Text>
            )}
            {data.speakers && (
              <Text style={styles.instructor}>{data.speakers}</Text>
            )}
            {data.category && (
              <Text style={styles.category}>{data.category}</Text>
            )}
            {data.level && (
              <Badge variant="outline" style={styles.levelBadge}>
                <Text style={styles.levelText}>{data.level}</Text>
              </Badge>
            )}
          </View>

          {/* Key Info Card */}
          <Card>
            <CardContent>
              {type === 'course' && (
                <>
                  <View style={styles.infoRow}>
                    <Clock size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Duration</Text>
                      <Text style={styles.infoValue}>{data.duration || '8 weeks'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <BookOpen size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Modules</Text>
                      <Text style={styles.infoValue}>{data.modules ? `${data.modules} comprehensive modules` : '24 comprehensive modules'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Users size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Enrolled</Text>
                      <Text style={styles.infoValue}>{(data.enrolled || data.enrolledCount) ? `${data.enrolled || data.enrolledCount} students` : '234 students'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Award size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Certificate</Text>
                      <Text style={styles.infoValue}>Yes, upon completion</Text>
                    </View>
                  </View>
                </>
              )}
              {type === 'event' && (
                <>
                  {data.date && (
                    <View style={styles.infoRow}>
                      <Calendar size={20} color="#2563EB" style={{ marginRight: 8 }} />
                      <View>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>{data.date}</Text>
                      </View>
                    </View>
                  )}
                  {data.time && (
                    <View style={styles.infoRow}>
                      <Clock size={20} color="#2563EB" style={{ marginRight: 8 }} />
                      <View>
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>{data.time}</Text>
                      </View>
                    </View>
                  )}
                  {data.location && (
                    <View style={styles.infoRow}>
                      <MapPin size={20} color="#2563EB" style={{ marginRight: 8 }} />
                      <View>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue}>{data.location}</Text>
                      </View>
                    </View>
                  )}
                  {data.capacity && (data.registeredCount !== undefined || data.enrolled !== undefined || data.enrolledCount !== undefined) && (
                    <View style={styles.infoRow}>
                      <Users size={20} color="#2563EB" />
                      <View>
                        <Text style={styles.infoLabel}>Availability</Text>
                        <Text style={styles.infoValue}>{data.capacity - (data.registeredCount || data.enrolled || data.enrolledCount || 0)} seats remaining</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
              {type === 'workshop' && (
                <>
                  <View style={styles.infoRow}>
                    <Calendar size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Date</Text>
                      <Text style={styles.infoValue}>{data.date || 'Nov 28, 2024'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Time</Text>
                      <Text style={styles.infoValue}>{data.time || '10:00 AM - 4:00 PM'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Duration</Text>
                      <Text style={styles.infoValue}>{data.duration || '6 hours'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Users size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Enrolled</Text>
                      <Text style={styles.infoValue}>{data.enrolled ? `${data.enrolled} students` : '45 students'}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Users size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Availability</Text>
                      <Text style={styles.infoValue}>30 seats remaining</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Download size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.infoLabel}>Materials</Text>
                      <Text style={styles.infoValue}>Provided</Text>
                    </View>
                  </View>
                </>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent>
              <Text style={styles.sectionTitle}>About This {type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop'}</Text>
              <Text style={styles.description}>
                {getDescriptionByType()}
              </Text>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card>
            <CardContent>
              <Text style={styles.sectionTitle}>What You'll {type === 'course' ? 'Learn' : 'Get'}</Text>
              <View style={styles.list}>
                {getWhatYouWillLearn().map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Course Modules */}
          {type === 'course' && getCourseModules().length > 0 && (
            <Card>
              <CardContent>
                <Text style={styles.sectionTitle}>Course Curriculum</Text>
                <View style={styles.modules}>
                  {getCourseModules().map((module, index) => (
                    <View key={index} style={styles.moduleItem}>
                      <View style={styles.moduleContent}>
                        <Text style={styles.moduleNumber}>Module {index + 1}</Text>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                      </View>
                      <View style={styles.moduleDetails}>
                        <Text style={styles.moduleLessons}>{module.lessons} lessons</Text>
                        <Text style={styles.moduleDuration}>{module.duration}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {type === 'course' && (
            <Card style={styles.benefitsCard}>
              <CardContent>
                <Text style={styles.benefitsTitle}>Why Take This Course?</Text>
                <Text style={styles.benefitsText}>
                  Continuous learning is essential for providing excellent patient care and advancing your nursing career. This course offers evidence-based content, practical skills, and professional recognition that will enhance your capabilities and open new opportunities in healthcare.
                </Text>
              </CardContent>
            </Card>
          )}

          {type === 'workshop' && (
            <Card style={styles.workshopBenefitsCard}>
              <CardContent>
                <Text style={styles.workshopBenefitsTitle}>Why Attend This Workshop?</Text>
                <Text style={styles.workshopBenefitsText}>
                  Hands-on training is invaluable for developing clinical skills and building confidence. This workshop provides a safe learning environment where you can practice techniques, ask questions, and receive expert guidance—helping you deliver better patient care with increased competence.
                </Text>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            {data.price === 0 ? (
              <Text style={styles.freePrice}>Free</Text>
            ) : (
              <View style={styles.priceContainer}>
                <IndianRupee size={20} color="#000" />
                <Text style={styles.price}>{data.price}</Text>
              </View>
            )}
          </View>
          <View style={styles.pointsSection}>
            <Text style={styles.pointsLabel}>You'll Earn</Text>
            <View style={styles.pointsContainer}>
              <Gift size={20} color="#D97706" />
              <Text style={styles.points}>+{data.points || 0} points</Text>
            </View>
          </View>
        </View>
        <Button onPress={handlePurchase} style={styles.enrollButton}>
          {data.price === 0 ? 'Enroll Free' : type === 'event' ? 'Register Now' : type === 'workshop' ? 'Book Your Seat' : 'Enroll Now'}
        </Button>
      </View>

      {/* Profile Completion Prompt */}
      {showCompletionPrompt && (
        <ProfileCompletionPrompt
          feature={type === 'course' ? 'courses' : type === 'event' ? 'events' : 'workshops'}
          onComplete={() => navigation.navigate('ProfileSetup')}
          onCancel={() => setShowCompletionPrompt(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
  heroContainer: {
    aspectRatio: 16/9,
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#E5E7EB',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  videoSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  videoQuality: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  courseBadge: {
    backgroundColor: '#3B82F6',
  },
  eventBadge: {
    backgroundColor: '#8B5CF6',
  },
  workshopBadge: {
    backgroundColor: '#F97316',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  levelBadge: {
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#374151',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  instructor: {
    color: '#6B7280',
    fontSize: 16,
  },
  category: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardContent: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginTop: 6,
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  modules: {
    marginTop: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  moduleContent: {
    flex: 1,
  },
  moduleNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  moduleTitle: {
    fontSize: 14,
    color: '#111827',
  },
  moduleDetails: {
    alignItems: 'flex-end',
  },
  moduleLessons: {
    fontSize: 12,
    color: '#6B7280',
  },
  moduleDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  benefitsCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  benefitsTitle: {
    color: '#1e40af',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitsText: {
    color: '#1e40af',
    fontSize: 14,
    lineHeight: 20,
  },
  workshopBenefitsCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
  },
  workshopBenefitsTitle: {
    color: '#9a3412',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  workshopBenefitsText: {
    color: '#9a3412',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  freePrice: {
    fontSize: 20,
    color: '#059669',
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 4,
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    color: '#D97706',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  enrollButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});