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
import { workshopAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const rupeeSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M7 12h7c3 0 4.5 2 4.5 4s-1.5 4-4.5 4L7 20"/></svg>`;

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const WorkshopDetailScreen = ({ route, navigation }) => {
  const { workshop } = route.params;
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Learning');
    }
  };

  const handleRegister = async () => {
    if (workshop.price > 0) {
      navigation.navigate('Payment', {
        item: workshop,
        type: 'workshop',
        amount: workshop.price,
      });
    } else {
      try {
        setLoading(true);
        await workshopAPI.registerForWorkshop(workshop._id, { paymentId: 'free', paymentMethod: 'free' });
        setSuccessVisible(true);
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg && msg.toLowerCase().includes('already registered')) {
          Alert.alert('Already Registered', 'You have already registered for this workshop.');
        } else {
          Alert.alert('Error', msg || 'Failed to register for workshop');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getWhatYouWillGet = () => [
    'Hands-on practice with equipment and techniques',
    'Step-by-step instruction from expert trainers',
    'Small group setting for personalized learning',
    'Real-world scenarios and case discussions',
    'All materials and equipment provided',
    'Certificate of completion',
    'Practice workbook and reference guides',
    'Post-workshop support and resources',
  ];

  const image = getFullUrl(workshop.thumbnail) || getFullUrl(workshop.imageUrl) || 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1600';
  const seats = workshop.capacity && workshop.registeredCount != null ? workshop.capacity - workshop.registeredCount : null;

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        title="Payment Successful!"
        message={`You're enrolled in ${workshop.title}`}
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
            <View style={styles.badgeOrange}>
              <SvgXml xml={briefcaseSvg} width={12} height={12} color="#fff" />
              <Text style={styles.badgeText}>Workshop</Text>
            </View>
            <Text style={styles.title}>{workshop.title}</Text>
            {workshop.instructor && (
              <Text style={styles.instructor}>
                by {typeof workshop.instructor === 'string' ? workshop.instructor : workshop.instructor?.name || 'Expert Instructor'}
              </Text>
            )}
          </View>

          {/* Key Info Card */}
          <View style={styles.card}>
            {workshop.date && (
              <View style={styles.infoRow}>
                <SvgXml xml={calendarSvg} width={20} height={20} color="#F97316" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>
                    {new Date(workshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
            {workshop.time && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#F97316" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{workshop.time}</Text>
                </View>
              </View>
            )}
            {workshop.location && (
              <View style={styles.infoRow}>
                <SvgXml xml={mapPinSvg} width={20} height={20} color="#F97316" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{workshop.location}</Text>
                </View>
              </View>
            )}
            {workshop.duration && (
              <View style={styles.infoRow}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#F97316" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{workshop.duration}</Text>
                </View>
              </View>
            )}
            {seats != null && seats > 0 && (
              <View style={styles.infoRow}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#F97316" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Availability</Text>
                  <Text style={styles.infoValue}>{seats} seats remaining</Text>
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <SvgXml xml={awardSvg} width={20} height={20} color="#F97316" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Certificate</Text>
                <Text style={styles.infoValue}>Yes, upon completion</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <SvgXml xml={downloadSvg} width={20} height={20} color="#F97316" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Materials</Text>
                <Text style={styles.infoValue}>All materials provided</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About This Workshop</Text>
            <Text style={styles.description}>
              {workshop.description ||
                'Develop practical skills through this hands-on workshop led by experienced practitioners. This interactive session combines theoretical knowledge with practical application, providing you with techniques and tools you can immediately apply in your clinical practice. Limited seats ensure personalized attention and ample opportunity for practice and feedback.'}
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

          {/* Topics */}
          {workshop.topics && workshop.topics.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Topics Covered</Text>
              <View style={styles.bulletList}>
                {workshop.topics.map((topic, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Why Attend */}
          <View style={styles.cardHighlight}>
            <Text style={styles.cardTitleHighlight}>Why Attend This Workshop?</Text>
            <Text style={styles.descriptionHighlight}>
              Hands-on training is invaluable for developing clinical skills and building confidence. This workshop provides a safe learning environment where you can practice techniques, ask questions, and receive expert guidance—helping you deliver better patient care with increased competence.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            {workshop.price === 0 ? (
              <Text style={styles.priceFree}>Free</Text>
            ) : (
              <View style={styles.priceRow}>
                <SvgXml xml={rupeeSymbol} width={20} height={20} color="#111827" />
                <Text style={styles.priceValue}>{workshop.price}</Text>
              </View>
            )}
          </View>
          {workshop.points && (
            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>You'll Earn</Text>
              <View style={styles.pointsRow}>
                <SvgXml xml={giftSvg} width={18} height={18} color="#EAB308" />
                <Text style={styles.pointsValue}>+{workshop.points} points</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Book Your Seat</Text>
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
  badgeOrange: {
    alignSelf: 'flex-start',
    backgroundColor: '#F97316',
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
    backgroundColor: '#F97316',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardHighlight: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitleHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9A3412',
    marginBottom: 12,
  },
  descriptionHighlight: {
    fontSize: 14,
    color: '#9A3412',
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
  registerBtn: {
    backgroundColor: '#F97316',
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

export default WorkshopDetailScreen;
