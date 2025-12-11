import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`;
const indianRupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>`;

const LearningDetails = ({ navigation, route }) => {
  const { type, data } = route.params || { type: 'course', data: {} };
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  const handlePurchase = () => {
    // Check if profile is incomplete
    const profileIncomplete = localStorage.getItem('profileIncomplete') === 'true';
    if (profileIncomplete) {
      setShowCompletionPrompt(true);
      return;
    }

    navigation.navigate('Payment', { type, data });
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
    if (type === 'course' && data.modules) {
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

  const img = data.image && data.image.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${data.image}` : data.image;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {img ? (
            <Image source={{ uri: img }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroImage} />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
            style={styles.heroOverlay}
          />
        </View>

        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.titleSection}>
            {type === 'course' && (
              <View style={[styles.typeBadge, { backgroundColor: '#3B82F6' }]}>
                <SvgXml xml={graduationCapSvg} width={12} height={12} color="#fff" />
                <Text style={styles.typeBadgeText}>Course</Text>
              </View>
            )}
            {type === 'event' && (
              <View style={[styles.typeBadge, { backgroundColor: '#9333EA' }]}>
                <SvgXml xml={calendarSvg} width={12} height={12} color="#fff" />
                <Text style={styles.typeBadgeText}>Event</Text>
              </View>
            )}
            {type === 'workshop' && (
              <View style={[styles.typeBadge, { backgroundColor: '#F97316' }]}>
                <SvgXml xml={briefcaseSvg} width={12} height={12} color="#fff" />
                <Text style={styles.typeBadgeText}>Workshop</Text>
              </View>
            )}
            <Text style={styles.title}>{data.title}</Text>
            {data.instructor && (
              <Text style={styles.instructor}>by {data.instructor}</Text>
            )}
            {data.speakers && (
              <Text style={styles.instructor}>{data.speakers}</Text>
            )}
            {data.category && (
              <Text style={styles.category}>{data.category}</Text>
            )}
            {data.level && (
              <View style={[styles.levelBadge, { backgroundColor: '#6B7280' }]}>
                <Text style={styles.levelBadgeText}>{data.level}</Text>
              </View>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.infoCard}>
            {data.date && (
              <View style={styles.infoItem}>
                <SvgXml xml={calendarSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{data.date}</Text>
                </View>
              </View>
            )}
            {data.time && (
              <View style={styles.infoItem}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{data.time}</Text>
                </View>
              </View>
            )}
            {data.location && (
              <View style={styles.infoItem}>
                {data.location.includes('Online') || data.location.includes('Virtual') ? (
                  <SvgXml xml={videoSvg} width={20} height={20} color="#2563EB" />
                ) : (
                  <SvgXml xml={mapPinSvg} width={20} height={20} color="#2563EB" />
                )}
                <View>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{data.location}</Text>
                </View>
              </View>
            )}
            {data.duration && (
              <View style={styles.infoItem}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{data.duration}</Text>
                </View>
              </View>
            )}
            {data.modules && (
              <View style={styles.infoItem}>
                <SvgXml xml={bookOpenSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Modules</Text>
                  <Text style={styles.infoValue}>{data.modules} comprehensive modules</Text>
                </View>
              </View>
            )}
            {data.enrolled && (
              <View style={styles.infoItem}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Enrolled</Text>
                  <Text style={styles.infoValue}>{data.enrolled} students</Text>
                </View>
              </View>
            )}
            {data.seats && (
              <View style={styles.infoItem}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Availability</Text>
                  <Text style={styles.infoValue}>{data.seats} seats remaining</Text>
                </View>
              </View>
            )}
            {data.certificate && (
              <View style={styles.infoItem}>
                <SvgXml xml={awardSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Certificate</Text>
                  <Text style={styles.infoValue}>Yes, upon completion</Text>
                </View>
              </View>
            )}
            {data.materials && (
              <View style={styles.infoItem}>
                <SvgXml xml={downloadSvg} width={20} height={20} color="#2563EB" />
                <View>
                  <Text style={styles.infoLabel}>Materials</Text>
                  <Text style={styles.infoValue}>{data.materials}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              About This {type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop'}
            </Text>
            <Text style={styles.description}>
              {getDescriptionByType()}
            </Text>
          </View>

          {/* What You'll Learn */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              What You'll {type === 'course' ? 'Learn' : 'Get'}
            </Text>
            <View style={styles.list}>
              {getWhatYouWillLearn().map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Course Modules */}
          {type === 'course' && getCourseModules().length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Course Curriculum</Text>
              <View style={styles.modules}>
                {getCourseModules().map((module, index) => (
                  <View key={index} style={styles.module}>
                    <View style={styles.moduleContent}>
                      <Text style={styles.moduleTitle}>Module {index + 1}</Text>
                      <Text style={styles.moduleName}>{module.title}</Text>
                    </View>
                    <View style={styles.moduleMeta}>
                      <Text style={styles.moduleLessons}>{module.lessons} lessons</Text>
                      <Text style={styles.moduleDuration}>{module.duration}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Benefits */}
          {type === 'course' && (
            <View style={[styles.sectionCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.sectionTitle, { color: '#1E40AF' }]}>Why Take This Course?</Text>
              <Text style={[styles.description, { color: '#1E40AF' }]}>
                Continuous learning is essential for providing excellent patient care and advancing your nursing career. This course offers evidence-based content, practical skills, and professional recognition that will enhance your capabilities and open new opportunities in healthcare.
              </Text>
            </View>
          )}

          {type === 'workshop' && (
            <View style={[styles.sectionCard, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
              <Text style={[styles.sectionTitle, { color: '#C2410C' }]}>Why Attend This Workshop?</Text>
              <Text style={[styles.description, { color: '#C2410C' }]}>
                Hands-on training is invaluable for developing clinical skills and building confidence. This workshop provides a safe learning environment where you can practice techniques, ask questions, and receive expert guidance—helping you deliver better patient care with increased competence.
              </Text>
            </View>
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
                <SvgXml xml={indianRupeeSvg} width={16} height={16} color="#111827" />
                <Text style={styles.priceText}>{data.price}</Text>
              </View>
            )}
          </View>
          <View style={styles.pointsSection}>
            <Text style={styles.pointsLabel}>You'll Earn</Text>
            <View style={styles.pointsContainer}>
              <SvgXml xml={giftSvg} width={20} height={20} color="#EAB308" />
              <Text style={styles.pointsText}>+{data.points || 0} points</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseText}>
            {data.price === 0 ? 'Enroll Free' : type === 'event' ? 'Register Now' : type === 'workshop' ? 'Book Your Seat' : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Completion Prompt */}
      {showCompletionPrompt && (
        <View style={styles.promptOverlay}>
          <View style={styles.prompt}>
            <Text style={styles.promptTitle}>Complete Your Profile</Text>
            <Text style={styles.promptText}>
              Please complete your profile to enroll in {type === 'course' ? 'courses' : type === 'event' ? 'events' : 'workshops'}.
            </Text>
            <View style={styles.promptButtons}>
              <TouchableOpacity
                style={[styles.promptButton, styles.promptButtonSecondary]}
                onPress={() => setShowCompletionPrompt(false)}
              >
                <Text style={styles.promptButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.promptButton, styles.promptButtonPrimary]}
                onPress={() => navigation.navigate('ProfileEdit')}
              >
                <Text style={styles.promptButtonTextPrimary}>Complete Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  },
  headerContent: {
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 24,
    paddingBottom: 120, // Space for bottom bar
  },
  titleSection: {
    marginBottom: 24,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 32,
  },
  instructor: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginTop: 6,
    marginRight: 8,
    flexShrink: 0,
  },
  listText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  modules: {
    marginTop: 12,
  },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  moduleName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  moduleMeta: {
    alignItems: 'flex-end',
  },
  moduleLessons: {
    fontSize: 12,
    color: '#6B7280',
  },
  moduleDuration: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomContent: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  freePrice: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '800',
    marginLeft: 2,
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 15,
    color: '#EAB308',
    fontWeight: '600',
    marginLeft: 4,
  },
  purchaseButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#2563EB',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promptOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prompt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 24,
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  promptButtons: {
    flexDirection: 'row',
  },
  promptButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  promptButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  promptButtonPrimary: {
    backgroundColor: '#2563EB',
  },
  promptButtonTextSecondary: {
    color: '#374151',
    fontWeight: '500',
  },
  promptButtonTextPrimary: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default LearningDetails;