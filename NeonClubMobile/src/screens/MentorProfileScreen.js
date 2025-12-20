import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Share,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { mentorAPI } from '../api/mentorAPI';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
const shareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const rupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6H2l4-6z"/><path d="M6 9v12l8-6V9"/><path d="M6 9H2"/><path d="M6 15H2"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const alertCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

const { width } = Dimensions.get('window');

const MentorProfileScreen = ({ route, navigation }) => {
   const { mentor } = route.params || {};
   const [isFavorited, setIsFavorited] = useState(false);
   const [activeTab, setActiveTab] = useState('about');
   const [showProfileModal, setShowProfileModal] = useState(false);
   const [showCompleteLaterModal, setShowCompleteLaterModal] = useState(false);
   const [fetchedMentor, setFetchedMentor] = useState(null);
   const [loading, setLoading] = useState(true);
   const [profileComplete, setProfileComplete] = useState(true);
   const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const data = await mentorAPI.getMentorById(mentor.id);
        setFetchedMentor(data.mentor);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      } finally {
        setLoading(false);
      }
    };
    if (mentor) {
      fetchMentor();
    }
  }, [mentor]);

  if (!mentor || loading || !fetchedMentor) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>{!mentor ? 'Mentor not found.' : 'Loading...'}</Text>
      </View>
    );
  }

  // Construct mentor data from real API data
  const mentorData = {
    id: fetchedMentor.id,
    name: fetchedMentor.name || 'Unknown Mentor',
    specialization: fetchedMentor.specialization || 'General Nursing',
    experience: `${fetchedMentor.experience || 0} years`,
    rating: fetchedMentor.rating || 0,
    sessions: fetchedMentor.totalSessions || 0,
    image: fetchedMentor.profilePicture || 'https://via.placeholder.com/150',
    available: mentor.available || false, // Use actual availability from mentor data
    price: fetchedMentor.hourlyRate || 0,
    responseTime: 'Within 24 hours', // Default
    languages: ['English'], // Default
    qualifications: fetchedMentor.qualification ? [fetchedMentor.qualification] : [],
    expertise: [], // Not available in schema
    bio: fetchedMentor.bio || 'Experienced nursing professional ready to mentor.',
    reviews: [], // Not available in basic API
    achievements: [
      { icon: 'users', label: `${fetchedMentor.totalSessions || 0} Sessions` },
      { icon: 'star', label: `${fetchedMentor.rating || 0} Rating` },
    ],
    availability: fetchedMentor.availability ? [fetchedMentor.availability] : ['By appointment'],
    currentWorkplace: fetchedMentor.hospital || '',
    city: fetchedMentor.city || '',
    state: fetchedMentor.state || '',
    registrationNumber: fetchedMentor.registrationNumber || '',
    highestQualification: fetchedMentor.qualification || '',
    organization: fetchedMentor.organization || '',
    department: fetchedMentor.department || '',
    hospital: fetchedMentor.hospital || '',
    phoneNumber: fetchedMentor.phoneNumber || '',
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${mentorData.name}'s profile on NUON`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookSession = async (mentor) => {
    try {
      const profile = await AsyncStorage.getItem('nurseProfile');
      const profileData = profile ? JSON.parse(profile) : null;

      // Check if profile is incomplete
      if (!profileData ||
          !profileData.fullName ||
          !profileData.email ||
          !profileData.workplace ||
          !profileData.registrationNumber ||
          !profileData.qualification) {
        setShowProfileModal(true);
        return;
      }

      // Profile is complete, go directly to booking
      navigation.navigate('BookingSlots', { mentor });
    } catch (error) {
      console.error('Error checking profile:', error);
      setShowProfileModal(true); // Show modal on error
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <SvgXml xml={usersSvg} width={20} height={20} color="#7c3aed" />
                  <Text style={styles.sectionTitle}>About</Text>
                </View>
                <Text style={styles.bioText}>{mentorData.bio}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <SvgXml xml={awardSvg} width={20} height={20} color="#7c3aed" />
                  <Text style={styles.sectionTitle}>Qualifications</Text>
                </View>
                {mentorData.qualifications.length > 0 && (
                  <>
                    {mentorData.qualifications.map((qual, index) => (
                      <View key={index} style={styles.qualification}>
                        <SvgXml xml={checkCircleSvg} width={20} height={20} color="#10b981" />
                        <Text style={styles.qualificationText}>{qual}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <SvgXml xml={clockSvg} width={20} height={20} color="#7c3aed" />
                  <Text style={styles.sectionTitle}>Availability</Text>
                </View>
                {mentorData.availability.map((time, index) => (
                  <Text key={index} style={styles.availabilityText}>{time}</Text>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.languagesContainer}>
                  {mentorData.languages.map((lang, index) => (
                    <View key={index} style={styles.languageBadge}>
                      <Text style={styles.languageText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <SvgXml xml={rupeeSvg} width={20} height={20} color="#7c3aed" />
                  <Text style={styles.sectionTitle}>Professional Details</Text>
                </View>
                {mentorData.currentWorkplace && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Workplace:</Text>
                    <Text style={styles.detailValue}>{mentorData.currentWorkplace}</Text>
                  </View>
                )}
                {mentorData.organization && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Organization:</Text>
                    <Text style={styles.detailValue}>{mentorData.organization}</Text>
                  </View>
                )}
                {mentorData.hospital && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hospital:</Text>
                    <Text style={styles.detailValue}>{mentorData.hospital}</Text>
                  </View>
                )}
                {mentorData.department && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Department:</Text>
                    <Text style={styles.detailValue}>{mentorData.department}</Text>
                  </View>
                )}
                {mentorData.city && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>City:</Text>
                    <Text style={styles.detailValue}>{mentorData.city}</Text>
                  </View>
                )}
                {mentorData.state && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>State:</Text>
                    <Text style={styles.detailValue}>{mentorData.state}</Text>
                  </View>
                )}
                {mentorData.registrationNumber && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registration Number:</Text>
                    <Text style={styles.detailValue}>{mentorData.registrationNumber}</Text>
                  </View>
                )}
                {mentorData.highestQualification && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Highest Qualification:</Text>
                    <Text style={styles.detailValue}>{mentorData.highestQualification}</Text>
                  </View>
                )}
                {mentorData.phoneNumber && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone Number:</Text>
                    <Text style={styles.detailValue}>{mentorData.phoneNumber}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      case 'expertise':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Areas of Expertise</Text>
              {mentorData.expertise.map((skill, index) => (
                <View key={index} style={styles.expertiseItem}>
                  <View style={styles.expertiseIcon}>
                    <SvgXml xml={checkCircleSvg} width={16} height={16} color="white" />
                  </View>
                  <Text style={styles.expertiseText}>{skill}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Session Focus</Text>
              <Text style={styles.sectionText}>
                My mentorship sessions are designed to provide practical, actionable guidance for nurses looking to excel in critical care environments. I focus on:
              </Text>
              <View style={styles.focusList}>
                <Text style={styles.focusItem}>• Real-world clinical scenarios and problem-solving</Text>
                <Text style={styles.focusItem}>• Career advancement strategies in critical care</Text>
                <Text style={styles.focusItem}>• Building confidence in high-pressure situations</Text>
                <Text style={styles.focusItem}>• Best practices and latest protocols</Text>
              </View>
            </View>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {/* Overall Rating Summary Card */}
            <View style={styles.ratingSummaryCard}>
              <View style={styles.ratingOverview}>
                <View style={styles.leftRating}>
                  <Text style={styles.overallRating}>{mentorData.rating}</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <SvgXml key={star} xml={starSvg} width={20} height={20} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </View>
                  <View style={styles.iconContainer}>
                    <SvgXml xml={calendarSvg} width={20} height={20} color="#7c3aed" />
                    <SvgXml xml={calendarSvg} width={20} height={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.totalSessions}>{mentorData.sessions} sessions</Text>
                </View>
                <View style={styles.rightRating}>
                  <Text style={styles.ratingBreakdownTitle}>Rating Breakdown</Text>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <View key={rating} style={styles.ratingBar}>
                      <Text style={styles.ratingLabel}>{rating}★</Text>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, {
                          width: `${rating === 5 ? 80 : rating === 4 ? 15 : rating === 3 ? 3 : rating === 2 ? 1 : 0}%`,
                          backgroundColor: rating >= 4 ? '#10b981' : rating >= 3 ? '#f59e0b' : '#ef4444'
                        }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Individual Review Cards */}
            {mentorData.reviews.map((review, index) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    {review.image ? (
                      <Image source={{ uri: review.image }} style={styles.reviewerImage} />
                    ) : (
                      <View style={styles.reviewerPlaceholder}>
                        <Text style={styles.reviewerInitial}>{review.name.charAt(0)}</Text>
                      </View>
                    )}
                    <View style={styles.reviewerDetails}>
                      <View style={styles.nameDateRow}>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <Text style={styles.reviewDateInline}>{review.date}</Text>
                      </View>
                      {index === 0 && (
                        // First review (Neha Sharma) - stars below name and date
                        <View style={styles.firstReviewStars}>
                          {[...Array(review.rating)].map((_, i) => (
                            <SvgXml key={i} xml={starSvg} width={12} height={12} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  {index !== 0 && (
                    <View style={styles.reviewStars}>
                      {[...Array(review.rating)].map((_, i) => (
                        <SvgXml key={i} xml={starSvg} width={14} height={14} color="#F59E0B" fill="#F59E0B" />
                      ))}
                    </View>
                  )}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#faf5ff', '#fdf2f8', '#fff']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contentContainer, {paddingTop: 0}]}>
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#ec4899', '#ea580c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionBtn}
            >
              <SvgXml xml={shareSvg} width={20} height={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFavorited(!isFavorited)}
              style={styles.actionBtn}
            >
              <SvgXml xml={heartSvg} width={20} height={20} color={isFavorited ? '#dc2626' : 'white'} fill={isFavorited ? '#dc2626' : 'none'} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerTitle}>Mentor Profile</Text>
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.profileCardContainer}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              <ImageWithFallback
                src={mentorData.image}
                alt={mentorData.name}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{mentorData.name}</Text>
              <Text style={styles.profileSpecialty}>{mentorData.specialization}</Text>
              <View style={styles.profileStats}>
                <SvgXml xml={starSvg} width={16} height={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.ratingText}>{mentorData.rating}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.sessionsText}>{mentorData.sessions} sessions</Text>
              </View>
             
              <View style={styles.availabilityContainer}>
                <View style={styles.availabilityBadge}>
                  <Text style={styles.availabilityText}>Available</Text>
                </View>
                <View style={styles.experienceBadge}>
                  <Text style={styles.experienceText}>15+ years</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.achievements}>
            <View style={styles.achievementIconContainer}>
              <SvgXml xml={awardSvg} width={16} height={16} color="#7c3aed" />
            </View>
            <View style={styles.achievementIconContainer}>
              <SvgXml xml={clockSvg} width={16} height={16} color="#7c3aed" />
            </View>
            <View style={styles.achievementIconContainer}>
              <SvgXml xml={starSvg} width={16} height={16} color="#7c3aed" />
            </View>

            <View style={styles.achievementIconContainer}>
              <SvgXml xml={usersSvg} width={16} height={16} color="#7c3aed" />
            </View>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mentorData.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mentorData.sessions}+</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mentorData.responseTime}</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>
          
          <View style={styles.additionalInfo}>
            <View style={styles.bookSessionContainer}>
              <LinearGradient
                colors={mentorData.available ? ['#7c3aed', '#ec4899', '#ea580c'] : ['#9ca3af', '#6b7280']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.bookSessionBtn, !mentorData.available && styles.disabledBtn]}
              >
                <TouchableOpacity
                  style={styles.bookSessionBtnInner}
                  onPress={() => mentorData.available && handleBookSession(mentorData)}
                  disabled={!mentorData.available}
                >
                  <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
                  <Text style={styles.bookSessionText}>
                    {mentorData.available ? 'Book Session' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={styles.sessionCard}>
              <SvgXml xml={videoSvg} width={20} height={20} color="#7c3aed" />
              <Text style={styles.sessionText}>45-minute video session</Text>
              <Text style={styles.sessionPrice}>₹{mentorData.price}</Text>
            </View>
          </View>


        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expertise' && styles.activeTab]}
          onPress={() => setActiveTab('expertise')}
        >
          <Text style={[styles.tabText, activeTab === 'expertise' && styles.activeTabText]}>
            Expertise
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>


      {renderTabContent()}


      {/* Profile Incomplete Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* Alert Icon */}
            <View style={styles.alertIconContainer}>
              <SvgXml xml={alertCircleSvg} width={24} height={24} color="#EA580C" />
            </View>

            {/* Title */}
            <Text style={styles.profileModalTitle}>Complete Your Profile</Text>

            {/* Description */}
            <Text style={styles.profileModalDescription}>
              Please complete your professional information to book mentorship sessions.
              This helps us provide you with the best experience.
            </Text>

            {/* Missing Information Box */}
            <View style={styles.missingInfoBox}>
              <Text style={styles.missingInfoLabel}>Missing information:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Current Workplace</Text>
                <Text style={styles.bulletItem}>• Nursing Registration Number</Text>
                <Text style={styles.bulletItem}>• Highest Qualification</Text>
              </View>
            </View>

            {/* Complete Profile Button */}
            <LinearGradient
              colors={['#3b82f6', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeProfileBtn}
            >
              <TouchableOpacity
                style={styles.completeProfileBtnInner}
                onPress={() => {
                  setShowProfileModal(false);
                  navigation.navigate('ProfileSetupScreen');
                }}
              >
                <Text style={styles.completeProfileBtnText}>Complete Profile Now →</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* Maybe Later */}
            <TouchableOpacity
              onPress={() => {
                setShowProfileModal(false);
                navigation.navigate('BookingSlots', { mentor: mentorData, skipProfileCheck: true });
              }}
            >
              <Text style={styles.maybeLaterText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Complete Later Modal */}
      <Modal
        visible={showCompleteLaterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompleteLaterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Later</Text>
            <Text style={styles.modalMessage}>
              You can complete the booking process later. Click below to proceed to select your preferred date and time for the session.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCompleteLaterModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.completeButton]}
                onPress={() => {
                  setShowCompleteLaterModal(false);
                  navigation.navigate('BookingSlots', { mentor: mentorData, skipProfileCheck: true });
                }}
              >
                <Text style={styles.completeButtonText}>Complete Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.feeLabel}>Session Fee</Text>
            <View style={styles.feeAmount}>
              <Text style={styles.feeText}>₹{mentorData.price}</Text>
            </View>
          </View>
          <LinearGradient
            colors={mentorData.available ? ['#7c3aed', '#ec4899', '#ea580c'] : ['#9ca3af', '#6b7280']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.bookNowBtn, !mentorData.available && styles.disabledBtn]}
          >
            <TouchableOpacity
              style={styles.bookNowBtnInner}
              onPress={() => mentorData.available && handleBookSession(mentorData)}
              disabled={!mentorData.available}
            >
              <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
              <Text style={styles.bookNowText}>
                {mentorData.available ? 'Book Now' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 120 }, // Space for bottom bar
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: { fontSize: 24, color: '#fff' },
  headerActions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionIcon: { fontSize: 18 },
  favorited: { color: '#FF6B6B' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  profileCardContainer: { paddingHorizontal: 20, marginTop: -20, marginBottom: 20 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  profileInfo: { flexDirection: 'row', marginBottom: 10 },
  profileImageContainer: { marginRight: 16 },
  profileImage: { width: 96, height: 96, borderRadius: 16, borderWidth: 4, borderColor: '#e9d5ff', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 3 },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: { fontSize: 32, fontWeight: 'bold', color: '#6B7280' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  profileSpecialty: { fontSize: 16, color: '#6b7280', marginBottom: 8 },
  profileStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sessionFeeContainer: { marginBottom: 8 },
  additionalInfo: { marginBottom: 20 },
  bookSessionContainer: { marginBottom: 16 },
  bookSessionBtn: {
    borderRadius: 50,
    height: 48,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  bookSessionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sessionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  sessionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  rating: { fontSize: 14, color: '#F59E0B', fontWeight: 'bold' },
  statsText: { fontSize: 14, color: '#6B7280', marginHorizontal: 4 },
  availabilityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  availabilityBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: { fontSize: 12, color: '#166534', fontWeight: 'bold' },
  experienceBadge: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  experienceText: { fontSize: 12, color: '#7c3aed', fontWeight: 'bold' },
  achievementsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  achievementItem: { alignItems: 'center', flex: 1 },
  achievementIcon: { fontSize: 20, marginBottom: 4 },
  achievementLabel: { fontSize: 10, color: '#6B7280', textAlign: 'center' },
  achievementCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 12,
    numberOfLines: 2,
  },
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 17,
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#7C3AED', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280' },
  statDivider: { width: 1, backgroundColor: '#D1D5DB', marginHorizontal: 10 },
  bookBtn: { borderRadius: 50, marginBottom: 16, height: 48, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 3 },
  bookBtnInner: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  findMoreButton: {
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
  },
  findMoreText: { color: '#7c3aed', fontWeight: 'bold', fontSize: 16 },
  mentorList: {
    gap: 16,
  },
  mentorCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mentorInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mentorImageContainer: {
    marginRight: 16,
  },
  mentorImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  mentorDetails: {
    flex: 1,
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  star: {
    color: '#f59e0b',
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  mentorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
  },
  dot: {
    marginHorizontal: 8,
    color: '#6b7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewProfileButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookSessionButton: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#7c3aed',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  bookSessionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  pricingLeft: { flexDirection: 'row', alignItems: 'center' },
  videoIcon: { fontSize: 18, marginRight: 8 },
  pricingText: { fontSize: 14, color: '#374151' },
  pricingRight: { flexDirection: 'row', alignItems: 'center' },
  priceSymbol: { fontSize: 16, color: '#7C3AED', marginRight: 2 },
  priceAmount: { fontSize: 18, fontWeight: 'bold', color: '#7C3AED' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  activeTabText: { color: '#7C3AED' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  tabContent: { padding: 20, borderRadius: 8, backgroundColor: 'white', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bioText: { fontSize: 14, color: '#374151', lineHeight: 26 },
  qualification: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  availabilityText: { fontSize: 14, color: '#374151', marginBottom: 4 },
  languagesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  languageBadge: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  languageText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  expertiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  expertiseIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expertiseText: { fontSize: 14, color: '#1F2937', flex: 1 },
  focusList: { marginTop: 8 },
  focusItem: { fontSize: 14, color: '#374151', marginBottom: 4, paddingLeft: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  detailValue: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  ratingSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftRating: {
    flex: 1,
    alignItems: 'center',
  },
  rightRating: {
    flex: 1,
    paddingLeft: 20,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 8
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center'
  },
  totalSessions: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  ratingBreakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 24,
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewerInfo: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  reviewerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewerPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerInitial: { fontSize: 16, fontWeight: 'bold', color: '#6B7280' },
  reviewerDetails: { flex: 1 },
  nameDateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  reviewDateInline: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
  reviewDateAlt: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  firstReviewStars: { flexDirection: 'row', marginTop: 2 },
  reviewStars: { flexDirection: 'row' },
  starFilled: { fontSize: 14, color: '#F59E0B' },
  reviewComment: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 5,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  feeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeText: {
    fontSize: 20,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  bookNowBtn: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  bookNowBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bookSessionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#7c3aed',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  profileModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFE9D6',
    padding: 12,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    color: '#1f2937',
  },
  profileModalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  missingInfoBox: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  missingInfoLabel: {
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  bulletList: {
    gap: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  completeProfileBtn: {
    borderRadius: 30,
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completeProfileBtnInner: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeProfileBtnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  maybeLaterText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 14,
    fontSize: 14,
  },
});

export default MentorProfileScreen;


