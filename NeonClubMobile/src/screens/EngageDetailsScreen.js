import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import Video from 'react-native-video';
import api, { getFullMediaUrl, engageAPI } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';
import BookingPromptModal from '../components/BookingPromptModal';
import CelebrationModal from '../components/CelebrationModal';
import { checkProfileCompletion } from '../utils/profileUtils';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const activitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="m12 7 5-5H7l5 5z"/></svg>`;

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('/uploads')) return `${BASE_URL}${path}`;
  if (path.includes('localhost')) return path.replace('localhost', IP_ADDRESS);
  return path;
};

const EngageDetailsScreen = ({ navigation, route }) => {
  const { item } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successOptionsVisible, setSuccessOptionsVisible] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState(item.enrolled || item.enrolledCount || 0);
  const [videoError, setVideoError] = useState(false);

  const checkRegistrationStatus = async () => {
    if (!item) return;
    try {
      const response = await api.get('/engage/my-registrations');
      const registrations = response.data.registrations || []; console.log('[EngageDetails] Registrations:', registrations);
      const isAlreadyRegistered = registrations.some(reg => reg.id === item.id || reg.activityId === item.id);
      setIsRegistered(isAlreadyRegistered);
    } catch (error) {
      console.log('Error checking registration status:', error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  useEffect(() => {
    if (!item) {
      navigation.goBack();
    }
  }, [item, navigation]);

  useEffect(() => {
    checkRegistrationStatus();
  }, [item]);

  // Refresh registration status when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (item) {
        setCheckingRegistration(true);
        checkRegistrationStatus();
      }
    });

    return unsubscribe;
  }, [navigation, item]);

  // Socket connection for real-time updates
   useEffect(() => {
     if (!item?.id) return;

     const sock = connectSocket();
     const unsubs = [
       onSocket('content:engage:updated', (updateData) => {
         if (updateData.activityId === item.id) {
           // Update enrolled count
           setEnrolledCount(prev => prev + 1);
           // Re-check registration status for real-time updates
           checkRegistrationStatus();
         }
       }),
     ];

     return () => {
       unsubs.forEach(fn => fn && fn());
       disconnectSocket();
     };
   }, [item?.id]);
  
  useEffect(() => {
    if (item) {
      console.log('[EngageDetails] Item loaded:', item);
      console.log('[EngageDetails] Video URL:', item.videoUrl || 'none');
      console.log('[EngageDetails] Thumbnail:', item.videoThumbnail || 'none');
    }
  }, [item]);

  const handlePurchase = async () => {
    console.log('[EngageDetails] handlePurchase called, isRegistered:', isRegistered, 'item:', item);
    if (isRegistered) {
      // Already registered, navigate to MyLearning
      console.log('[EngageDetails] Already registered, navigating to MyLearning');
      navigation.navigate('MyLearning');
      return;
    }

    try {
      console.log('[EngageDetails] Checking profile completion...');
      const { isComplete, missingFields: fields } = await checkProfileCompletion();
      console.log('[EngageDetails] Profile check result:', { isComplete, fields });
      if (!isComplete) {
        setMissingFields(fields);
        setShowProfilePrompt(true);
        console.log('[EngageDetails] Profile incomplete, showing prompt');
        return;
      }

      // Navigate to payment screen for both free and paid items
      console.log('[EngageDetails] Navigating to Payment');
      try {
        navigation.navigate('Payment', {
          paymentData: {
            type: 'engage-activity',
            data: item,
            mode: 'orderSummary'
          }
        });
        console.log('[EngageDetails] Navigation to Payment successful');
      } catch (navError) {
        console.error('[EngageDetails] Navigation to Payment failed:', navError);
        Alert.alert('Error', 'Something went wrong unable to open payment screen');
      }
    } catch (error) {
      console.log('[EngageDetails] Purchase error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const getDescriptionByType = () => {
    if (item.category === 'wellness') {
      return 'Prioritize your mental health and well-being with this carefully designed wellness program. Led by certified wellness coaches and mental health professionals, this session provides practical tools and techniques to manage stress, prevent burnout, and maintain emotional balance in your demanding healthcare career.';
    } else if (item.category === 'fitness') {
      return 'Stay physically active and healthy with this fitness program designed specifically for nurses and healthcare professionals. Whether you have 10 minutes or an hour, these exercises are tailored to fit your schedule and address the unique physical demands of nursing. Build strength, improve flexibility, and boost your energy levels.';
    } else {
      return 'Join us for this enriching event that brings together healthcare professionals for learning, networking, and professional growth. Connect with peers, learn from industry leaders, and discover new opportunities to advance your nursing career. This event offers valuable insights and practical takeaways you can apply immediately.';
    }
  };

  const getWhatYouWillGet = () => {
    if (item.category === 'wellness') {
      return [
        'Stress management techniques for healthcare workers',
        'Mindfulness and meditation practices',
        'Tools to prevent burnout and compassion fatigue',
        'Self-care strategies for busy schedules',
        'Community support and peer connection',
        'Certificate of participation',
      ];
    } else if (item.category === 'fitness') {
      return [
        'Customized workout plans for nurses',
        'Exercises you can do anywhere, anytime',
        'Nutrition guidance for shift workers',
        'Progress tracking and accountability',
        'Expert coaching and support',
        'Certificate of completion',
      ];
    } else {
      return [
        'Comprehensive knowledge from industry experts',
        'Networking opportunities with peers',
        'Practical skills and techniques',
        'Certificate of attendance',
        'Access to exclusive resources and recordings',
        'Professional development credits',
      ];
    }
  };

  if (!item || typeof item.title !== 'string') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const img = getFullMediaUrl(item.thumbnail);

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Modal */}
      <CelebrationModal
        isVisible={successVisible}
        onClose={() => { setSuccessVisible(false); setSuccessOptionsVisible(true); }}
        title="🎉 Payment Successful!"
        message={`You're enrolled in ${item.title}`}
        icon="gift"
        points={item.points || 0}
      />

      {/* Success Options Modal */}
      <CelebrationModal
        isVisible={successOptionsVisible}
        title="🎉 Payment Successful!"
        message={`You're enrolled in ${item.title}`}
        icon="gift"
        points={item.points || 0}
        showOptions={true}
        onGoToMyLearning={() => { setSuccessOptionsVisible(false); navigation.navigate('MyLearning'); }}
        onBackToDashboard={() => { setSuccessOptionsVisible(false); navigation.navigate('Main'); }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#111827" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image or Video */}
        <View style={styles.heroContainer}>
          {item.videoUrl && isRegistered && !videoError ? (
            // Show video player if registered
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: getFullMediaUrl(item.videoUrl) }}
                style={styles.videoPlayer}
                controls={true}
                resizeMode="cover"
                paused={false}
                onError={(e) => {
                  console.log('[EngageDetails] Video error:', e);
                  setVideoError(true);
                }}
                onLoad={() => console.log('[EngageDetails] Video loaded')}
                onLoadStart={() => console.log('[EngageDetails] Video load start')}
                bufferConfig={{
                  minBufferMs: 15000,
                  maxBufferMs: 50000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 5000,
                }}
                maxBitRate={2000000}
              />
            </View>
          ) : item.videoUrl && isRegistered && videoError ? (
            // Show error message if video failed to load
            <View style={styles.videoContainer}>
              <View style={styles.videoError}>
                <Text style={styles.errorText}>Video unavailable</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => setVideoError(false)}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : item.videoUrl ? (
            // Show thumbnail with play button if not registered
            <TouchableOpacity onPress={() => {
              if (isRegistered) {
                // If somehow registered, show video
                navigation.navigate('VideoPlayer', {
                  videoUrl: getFullMediaUrl(item.videoUrl),
                  title: item.videoTitle || item.title,
                  thumbnail: getFullMediaUrl(item.videoThumbnail)
                });
              } else {
                // Show preview or encourage registration
                Alert.alert('Preview Not Available', 'Register to access the full video content.');
              }
            }}>
              <Image source={{ uri: getFullMediaUrl(item.videoThumbnail) || img }} style={styles.heroImage} onError={() => console.log('[EngageDetails] Image error')} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              {item.video_duration && (
                <View style={styles.videoDuration}>
                  <Text style={styles.durationText}>{item.video_duration}</Text>
                </View>
              )}
              {!isRegistered && (
                <View style={styles.previewOverlay}>
                  <Text style={styles.previewText}>Register to Watch Full Video</Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <>
              {img ? (
                <Image source={{ uri: img }} style={styles.heroImage} />
              ) : (
                <View style={[styles.heroImage, { backgroundColor: '#E5E7EB' }]} />
              )}
            </>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            start={{x:0,y:0}}
            end={{x:0,y:1}}
            style={styles.heroOverlay}
          />
        </View>


        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.titleSection}>
            <View style={styles.categoryHeader}>
              {item.category === 'wellness' && (
                <SvgXml xml={heartSvg} width={20} height={20} color="#9333EA" />
              )}
              {item.category === 'fitness' && (
                <SvgXml xml={activitySvg} width={20} height={20} color="#F97316" />
              )}
              {(item.category === 'event' || item.category === 'conference') && (
                <SvgXml xml={calendarSvg} width={20} height={20} color="#3B82F6" />
              )}
              <Text style={[styles.categoryName, {
                color: item.category === 'wellness' ? '#9333EA' : item.category === 'fitness' ? '#F97316' : '#3B82F6'
              }]}>
                {item.category === 'wellness' ? 'Wellness' : item.category === 'fitness' ? 'Fitness' : item.category === 'conference' ? 'Conference' : 'Event'}
              </Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subcategory}>{item.type || item.category}</Text>
            {item.instructor && (
              <Text style={styles.instructor}>by {item.instructor}</Text>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.infoCard}>
            {item.date && (
              <View style={styles.infoRow}>
                <SvgXml xml={calendarSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{item.date ? String(item.date) : 'N/A'}</Text>
                </View>
              </View>
            )}

            {item.time && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{item.time}</Text>
                </View>
              </View>
            )}

            {item.location && (
              <View style={styles.infoRow}>
                <SvgXml xml={mapPinSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{item.location}</Text>
                </View>
              </View>
            )}

            {item.duration && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{item.duration}</Text>
                </View>
              </View>
            )}

            {item.enrolled && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Enrolled</Text>
                  <Text style={styles.infoValue}>{enrolledCount} participants</Text>
                </View>
              </View>
            )}

            {item.capacity && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#2563EB" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Availability</Text>
                  <Text style={styles.infoValue}>{item.capacity - enrolledCount} spots available</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This {item.category === 'wellness' ? 'Program' : item.category === 'fitness' ? 'Program' : 'Event'}</Text>
            <Text style={styles.description}>{getDescriptionByType()}</Text>
          </View>

          {/* What You'll Get */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What You'll Get</Text>
            <View style={styles.benefitsList}>
              {getWhatYouWillGet().map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Why Wellness Matters */}
          {item.category === 'wellness' && (
            <View style={[styles.section, { backgroundColor: '#FAF5FF', borderColor: '#D8B4FE', borderWidth: 1 }]}>
              <Text style={[styles.sectionTitle, { color: '#7C3AED' }]}>Why Wellness Matters</Text>
              <Text style={[styles.description, { color: '#6B21A8' }]}>
                Healthcare professionals face unique stressors that can lead to burnout, compassion fatigue, and emotional exhaustion. Prioritizing your mental health isn't just beneficial—it's essential for providing quality patient care and maintaining your own well-being.
              </Text>
            </View>
          )}

          {/* Why Fitness Matters */}
          {item.category === 'fitness' && (
            <View style={[styles.section, { backgroundColor: '#FFEDD5', borderColor: '#F97316', borderWidth: 1 }]}>
              <Text style={[styles.sectionTitle, { color: '#C2410C' }]}>Why Fitness Matters</Text>
              <Text style={[styles.description, { color: '#9A3412' }]}>
                Nursing is physically demanding. Long shifts, lifting patients, and constant movement take a toll on your body. Regular fitness activities help prevent injuries, reduce fatigue, and increase your stamina—allowing you to perform at your best throughout your shifts.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.fixedBottomBar}>
        <View style={styles.bottomBarContent}>
          <View style={styles.pricePointsSection}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price</Text>
              {item.price === 0 ? (
                <Text style={styles.freePrice}>Free</Text>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <Text style={styles.priceValue}>{item.price}</Text>
                </View>
              )}
            </View>

            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>You'll Earn</Text>
              <View style={styles.pointsContainer}>
                <SvgXml xml={giftSvg} width={20} height={20} color="#EAB308" />
                <Text style={styles.pointsValue}>+{item.points} points</Text>
              </View>
            </View>
          </View>

          {checkingRegistration ? (
            <View style={[styles.registerBtn, { backgroundColor: '#E5E7EB' }]}>
              <Text style={[styles.registerBtnText, { color: '#6B7280' }]}>Loading...</Text>
            </View>
          ) : isRegistered ? (
            <View style={styles.registeredContainer}>
              <View style={styles.registeredBadge}>
                <Text style={styles.registeredText}>✓ Already Registered</Text>
              </View>
              <TouchableOpacity
                style={styles.viewInLearningBtn}
                onPress={() => navigation.navigate('MyLearning')}
              >
                <Text style={styles.viewInLearningText}>View in My Learning</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              <LinearGradient
                colors={item.category === 'wellness' ? ['#9333EA', '#9333EA'] : item.category === 'fitness' ? ['#F97316', '#F97316'] : ['#3B82F6', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerBtnGradient}
              >
                <Text style={styles.registerBtnText}>
                  {isLoading ? 'Processing...' : (item.price === 0 ? 'Register Free' : item.category === 'event' ? 'Register Now' : 'Join Program')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <BookingPromptModal
        visible={showProfilePrompt}
        onCompleteNow={() => {
          setShowProfilePrompt(false);
          navigation.navigate('ProfileEdit');
        }}
        onMaybeLater={() => setShowProfilePrompt(false)}
        missingFields={missingFields}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  heroContainer: {
    height: 256,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  videoError: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  titleSection: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
  },
  subcategory: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 32,
  },
  instructor: {
    fontSize: 14,
    color: '#6B7280',
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
    marginTop: 6,
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  fixedBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  pricePointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  freePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EAB308',
  },
  registerBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 48,
  },
  registerBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnDisabled: {
    opacity: 0.6,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  successModalCard: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 6,
  },
  successMsg: {
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  successBtn: {
    marginTop: 14,
    width: '86%',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#7C3AED',
  },
  successBtnText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  registeredContainer: {
    gap: 12,
  },
  registeredBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  registeredText: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '700',
  },
  viewInLearningBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  viewInLearningText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EngageDetailsScreen;
