import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, Platform, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { conferenceAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const rupeeSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M7 12h7c3 0 4.5 2 4.5 4s-1.5 4-4.5 4L7 20"/></svg>`;

// Always use full URL for local uploads
const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const ConferenceDetailScreen = ({ route, navigation }) => {
  const { conference } = route.params;
  const [registering, setRegistering] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Learning');
    }
  };

  const handleRegister = async () => {
    if (conference.price > 0) {
      navigation.navigate('Payment', { item: conference, type: 'conference', amount: conference.price });
    } else {
      try {
        setRegistering(true);
        await conferenceAPI.registerForConference(conference._id, { paymentId: 'free', paymentMethod: 'free' });
        setSuccessVisible(true);
      } catch (error) {
        let msg = 'Failed to register for conference';
        if (error?.response?.data?.message) {
          msg = error.response.data.message;
        }
        Alert.alert('Error', msg);
      } finally {
        setRegistering(false);
      }
    }
  };

  const getWhatYouWillGet = () => [
    'Keynote presentations from industry leaders',
    'Interactive panel discussions and Q&A sessions',
    'Networking opportunities with healthcare professionals',
    'Latest trends and innovations in healthcare',
    'Access to conference recordings and materials',
    'Certificate of attendance',
    'Continuing education credits (where applicable)',
    'Exclusive resources and takeaways',
  ];

  const image = getFullUrl(conference.thumbnail) || getFullUrl(conference.imageUrl) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop';
  const seats = conference.capacity && conference.registeredCount != null ? conference.capacity - conference.registeredCount : null;

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        title="Payment Successful!"
        message={`You're registered for ${conference.title}`}
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
          {/* Title and Badge */}
          <View style={styles.titleSection}>
            <View style={styles.badgePurple}>
              <SvgXml xml={graduationCapSvg} width={12} height={12} color="#fff" />
              <Text style={styles.badgeText}>Conference</Text>
            </View>
            <Text style={styles.title}>{conference.title}</Text>
            {conference.instructor && (
              <Text style={styles.instructor}>
                by {typeof conference.instructor === 'string' ? conference.instructor : conference.instructor?.name || 'Expert Speakers'}
              </Text>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.card}>
            {conference.date && (
              <View style={styles.infoRow}>
                <SvgXml xml={calendarSvg} width={20} height={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>
                    {new Date(conference.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
            {(conference.time || conference.duration) && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{conference.time || conference.duration || 'TBA'}</Text>
                </View>
              </View>
            )}
            {(conference.venue?.name || conference.location) && (
              <View style={styles.infoRow}>
                <SvgXml xml={mapPinSvg} width={20} height={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{conference.venue?.name || conference.location || 'Online / TBA'}</Text>
                </View>
              </View>
            )}
            {conference.capacity && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Capacity</Text>
                  <Text style={styles.infoValue}>
                    {conference.registeredCount || 0}/{conference.capacity} registered
                  </Text>
                </View>
              </View>
            )}
            {seats != null && seats > 0 && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Availability</Text>
                  <Text style={styles.infoValue}>{seats} seats remaining</Text>
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <SvgXml xml={awardSvg} width={20} height={20} color="#8B5CF6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Certificate</Text>
                <Text style={styles.infoValue}>Yes, upon attendance</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About This Conference</Text>
            <Text style={styles.description}>
              {conference.description ||
                'Join healthcare professionals from across the country for this enriching conference featuring keynote speakers, panel discussions, and networking opportunities. Gain insights from industry leaders, learn about the latest trends and innovations in healthcare, and connect with peers who share your passion for nursing excellence. This conference offers valuable knowledge and professional connections that will benefit your career.'}
            </Text>
          </View>

          {/* What You'll Get */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You'll Get</Text>
            <View style={styles.bulletList}>
              {getWhatYouWillGet().map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Important Information */}
          {conference.importantInfo && (
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitleInfo}>Important Information</Text>
              <View style={styles.bulletList}>
                {conference.importantInfo.arriveEarly && (
                  <View style={styles.bulletItem}>
                    <View style={styles.bulletInfo} />
                    <Text style={styles.bulletTextInfo}>Arrive {conference.importantInfo.arriveEarly} minutes early</Text>
                  </View>
                )}
                {conference.importantInfo.idRequired && (
                  <View style={styles.bulletItem}>
                    <View style={styles.bulletInfo} />
                    <Text style={styles.bulletTextInfo}>Valid ID required</Text>
                  </View>
                )}
                {conference.importantInfo.dressCode && (
                  <View style={styles.bulletItem}>
                    <View style={styles.bulletInfo} />
                    <Text style={styles.bulletTextInfo}>Dress code: {conference.importantInfo.dressCode}</Text>
                  </View>
                )}
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
            {conference.price === 0 ? (
              <Text style={styles.priceFree}>Free</Text>
            ) : (
              <View style={styles.priceRow}>
                <SvgXml xml={rupeeSymbol} width={20} height={20} color="#111827" />
                <Text style={styles.priceValue}>{conference.price}</Text>
              </View>
            )}
          </View>
          {conference.points && (
            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>You'll Earn</Text>
              <View style={styles.pointsRow}>
                <SvgXml xml={giftSvg} width={18} height={18} color="#EAB308" />
                <Text style={styles.pointsValue}>+{conference.points} points</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={registering} activeOpacity={0.8}>
          {registering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Register Now</Text>
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
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgePurple: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardInfo: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitleInfo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 12,
  },
  bulletInfo: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E40AF',
    marginTop: 7,
  },
  bulletTextInfo: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
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
  registerBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ConferenceDetailScreen;
