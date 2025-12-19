import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { eventAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const activitySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const rupeeSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M7 12h7c3 0 4.5 2 4.5 4s-1.5 4-4.5 4L7 20"/></svg>`;

// Always use full URL for local uploads
const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const EventViewerScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [registering, setRegistering] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Engage');
    }
  };

  const handleRegister = async () => {
    if (event.price > 0) {
      navigation.navigate('Payment', { item: event, type: 'event', amount: event.price });
    } else {
      try {
        setRegistering(true);
        await eventAPI.registerForEvent(event._id, { paymentId: 'free', paymentMethod: 'free' });
        setSuccessVisible(true);
      } catch (error) {
        let msg = 'Failed to register for event';
        if (error?.response?.data?.message) {
          msg = error.response.data.message;
        }
        Alert.alert('Error', msg);
      } finally {
        setRegistering(false);
      }
    }
  };

  const getCategory = () => {
    const cat = event.category || event.type || 'event';
    if (cat === 'wellness') return 'wellness';
    if (cat === 'fitness') return 'fitness';
    return 'event';
  };

  const getWhatYouWillGet = () => {
    const category = getCategory();
    if (category === 'wellness') {
      return [
        'Stress management techniques for healthcare workers',
        'Mindfulness and meditation practices',
        'Tools to prevent burnout and compassion fatigue',
        'Self-care strategies for busy schedules',
        'Community support and peer connection',
        'Certificate of participation',
      ];
    } else if (category === 'fitness') {
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

  const getDescription = () => {
    const category = getCategory();
    if (event.description) return event.description;

    if (category === 'wellness') {
      return 'Prioritize your mental health and well-being with this carefully designed wellness program. Led by certified wellness coaches and mental health professionals, this session provides practical tools and techniques to manage stress, prevent burnout, and maintain emotional balance in your demanding healthcare career.';
    } else if (category === 'fitness') {
      return 'Stay physically active and healthy with this fitness program designed specifically for nurses and healthcare professionals. Whether you have 10 minutes or an hour, these exercises are tailored to fit your schedule and address the unique physical demands of nursing. Build strength, improve flexibility, and boost your energy levels.';
    } else {
      return 'Join us for this enriching event that brings together healthcare professionals for learning, networking, and professional growth. Connect with peers, learn from industry leaders, and discover new opportunities to advance your nursing career. This event offers valuable insights and practical takeaways you can apply immediately.';
    }
  };

  const getBadgeColor = () => {
    const category = getCategory();
    if (category === 'wellness') return '#EC4899';
    if (category === 'fitness') return '#F97316';
    return '#10B981';
  };

  const getBadgeIcon = () => {
    const category = getCategory();
    if (category === 'wellness') return heartSvg;
    if (category === 'fitness') return activitySvg;
    return calendarSvg;
  };

  const getBadgeLabel = () => {
    const category = getCategory();
    if (category === 'wellness') return 'Wellness';
    if (category === 'fitness') return 'Fitness';
    return 'Event';
  };

  const category = getCategory();
  const isRegistered = !!event.hasRegistered;
  const image = getFullUrl(event.thumbnail) || getFullUrl(event.imageUrl) || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600';

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        title="Payment Successful!"
        message={`You're enrolled in ${event.title}`}
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
        </View>

        <View style={styles.content}>
          {/* Registered Status */}
          {isRegistered && (
            <View style={styles.registeredCard}>
              <Text style={styles.registeredTitle}>✓ Registered</Text>
              <Text style={styles.registeredText}>We'll remind you before the event.</Text>
            </View>
          )}

          {/* Title and Badge */}
          <View style={styles.titleSection}>
            <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
              <SvgXml xml={getBadgeIcon()} width={12} height={12} color="#fff" />
              <Text style={styles.badgeText}>{getBadgeLabel()}</Text>
            </View>
            <Text style={styles.title}>{event.title}</Text>
            {event.instructor && (
              <Text style={styles.instructor}>
                by {typeof event.instructor === 'string' ? event.instructor : event.instructor?.name || 'Expert Facilitator'}
              </Text>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.card}>
            {event.date && (
              <View style={styles.infoRow}>
                <SvgXml xml={calendarSvg} width={20} height={20} color={getBadgeColor()} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
            {(event.time || event.duration) && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color={getBadgeColor()} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{event.time || event.duration || 'TBA'}</Text>
                </View>
              </View>
            )}
            {(event.venue?.name || event.location) && (
              <View style={styles.infoRow}>
                <SvgXml xml={mapPinSvg} width={20} height={20} color={getBadgeColor()} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.venue?.name || event.location || 'Online / TBA'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About This {getBadgeLabel()}</Text>
            <Text style={styles.description}>{getDescription()}</Text>
          </View>

          {/* What You'll Get */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You'll Get</Text>
            <View style={styles.bulletList}>
              {getWhatYouWillGet().map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: getBadgeColor() }]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar (only show if not registered) */}
      {!isRegistered && (
        <View style={styles.bottomBar}>
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              {event.price === 0 ? (
                <Text style={styles.priceFree}>Free</Text>
              ) : (
                <View style={styles.priceRow}>
                  <SvgXml xml={rupeeSymbol} width={20} height={20} color="#111827" />
                  <Text style={styles.priceValue}>{event.price}</Text>
                </View>
              )}
            </View>
            {event.points && (
              <View style={styles.pointsSection}>
                <Text style={styles.pointsLabel}>You'll Earn</Text>
                <View style={styles.pointsRow}>
                  <SvgXml xml={giftSvg} width={18} height={18} color="#EAB308" />
                  <Text style={styles.pointsValue}>+{event.points} points</Text>
                </View>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: getBadgeColor() }]}
            onPress={handleRegister}
            disabled={registering}
            activeOpacity={0.8}
          >
            {registering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerBtnText}>
                {category === 'event' ? 'Register Now' : 'Join Now'}
              </Text>
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
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
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    padding: 16,
  },
  registeredCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  registeredTitle: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 15,
  },
  registeredText: {
    color: '#065F46',
    marginTop: 4,
    fontSize: 13,
  },
  titleSection: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
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
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
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
    flexDirection: 'column',
    gap: 12,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EAB308',
  },
  registerBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default EventViewerScreen;
