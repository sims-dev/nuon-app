import React, { useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

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

const { width } = Dimensions.get('window');

const MentorProfileScreen = ({ route, navigation }) => {
  const { mentor } = route.params || {};
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCompleteLaterModal, setShowCompleteLaterModal] = useState(false);

  const availableMentors = [
    {
      id: 1,
      name: 'Dr. Sunita Verma',
      specialization: 'Critical Care',
      experience: '15+ years',
      rating: 4.9,
      sessions: 340,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
      price: 1999,
      responseTime: '2 hours',
      languages: ['English', 'Hindi', 'Marathi'],
      qualifications: [
        'MSc Nursing - Critical Care',
        'BSc Nursing - Delhi University',
        'ICU Certification - AIIMS',
      ],
      expertise: [
        'Critical Care Management',
        'Emergency Response',
        'Ventilator Management',
        'Patient Safety Protocols',
        'Clinical Leadership',
      ],
      bio: 'With over 15 years of experience in critical care nursing, I have worked in top hospitals across India including AIIMS and Apollo. I specialize in helping nurses advance their careers in emergency and critical care settings.',
      reviews: [
        {
          id: 1,
          name: 'Neha Sharma',
          rating: 5,
          date: 'Oct 2024',
          comment: 'Dr. Verma provided excellent guidance on my ICU rotation. Her practical tips helped me gain confidence.',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Top Rated Mentor' },
        { icon: 'users', label: '340+ Sessions' },
        { icon: 'star', label: '4.9 Rating' },
        { icon: 'clock', label: 'Quick Response' },
      ],
      availability: [
        'Monday - Friday: 3:00 PM - 8:00 PM',
        'Saturday: 10:00 AM - 6:00 PM',
        'Sunday: By appointment',
      ],
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Emergency Medicine',
      experience: '12+ years',
      rating: 4.8,
      sessions: 280,
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
      price: 1799,
      responseTime: '3 hours',
      languages: ['English', 'Hindi', 'Tamil'],
      qualifications: [
        'MSc Emergency Medicine',
        'Trauma Care Certification',
        'Advanced Cardiac Life Support',
      ],
      expertise: [
        'Emergency Triage',
        'Trauma Management',
        'Critical Decision Making',
        'Disaster Response',
      ],
      bio: 'Emergency medicine specialist with 12+ years of experience in high-pressure healthcare environments. I focus on helping nurses build confidence and expertise in emergency situations.',
      reviews: [
        {
          id: 1,
          name: 'Amit Patel',
          rating: 5,
          date: 'Sep 2024',
          comment: 'Very knowledgeable and patient. Answered all my questions thoroughly.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Expert Mentor' },
        { icon: 'users', label: '280+ Sessions' },
        { icon: 'star', label: '4.8 Rating' },
        { icon: 'clock', label: 'Responsive' },
      ],
      availability: [
        'Tuesday - Saturday: 4:00 PM - 9:00 PM',
        'Sunday: 11:00 AM - 5:00 PM',
      ],
    },
    {
      id: 3,
      name: 'Nurse Kavita Sharma',
      specialization: 'Pediatric Care',
      experience: '10+ years',
      rating: 4.9,
      sessions: 420,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false,
      price: 1899,
      responseTime: '1 hour',
      languages: ['English', 'Hindi', 'Punjabi'],
      qualifications: [
        'MSc Pediatric Nursing',
        'NICU Specialization',
        'Child Psychology Certification',
      ],
      expertise: [
        'Pediatric Assessment',
        'Neonatal Care',
        'Family-Centered Care',
        'Child Development',
      ],
      bio: 'Passionate about pediatric nursing with extensive NICU and pediatric ward experience. I mentor nurses who want to specialize in caring for children and families.',
      reviews: [
        {
          id: 1,
          name: 'Priya Reddy',
          rating: 5,
          date: 'Sep 2024',
          comment: 'Amazing mentor! Her pediatric insights were invaluable.',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Top Mentor' },
        { icon: 'users', label: '420+ Sessions' },
        { icon: 'star', label: '4.9 Rating' },
        { icon: 'clock', label: 'Very Fast' },
      ],
      availability: [
        'Monday - Friday: 2:00 PM - 7:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
      ],
    },
  ];

  if (!mentor) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Mentor not found.</Text>
      </View>
    );
  }

  // Default mentor data with comprehensive information
  const defaultMentor = {
    id: 1,
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    experience: '15+ years',
    rating: 4.9,
    sessions: 340,
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    available: true,
    price: 1999,
    responseTime: '2 hours',
    languages: ['English', 'Hindi', 'Marathi'],
    qualifications: [
      'MSc Nursing - Critical Care',
      'BSc Nursing - Delhi University',
      'ICU Certification - AIIMS',
    ],
    expertise: [
      'Critical Care Management',
      'Emergency Response',
      'Ventilator Management',
      'Patient Safety Protocols',
      'Clinical Leadership',
    ],
    bio: 'With over 15 years of experience in critical care nursing, I have worked in top hospitals across India including AIIMS and Apollo. I specialize in helping nurses advance their careers in emergency and critical care settings. My mentorship focuses on practical skills, clinical decision-making, and professional growth.',
    reviews: [
      {
        id: 1,
        name: 'Neha Sharma',
        rating: 5,
        date: 'Oct 2024',
        comment: 'Dr. Verma provided excellent guidance on my ICU rotation. Her practical tips and real-world scenarios helped me gain confidence.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      {
        id: 2,
        name: 'Amit Patel',
        rating: 5,
        date: 'Sep 2024',
        comment: 'Very knowledgeable and patient. She answered all my questions about critical care protocols thoroughly.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      {
        id: 3,
        name: 'Priya Reddy',
        rating: 4,
        date: 'Sep 2024',
        comment: 'Great session on ventilator management. Would definitely book again!',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
    ],
    achievements: [
      { icon: 'award', label: 'Top Rated Mentor' },
      { icon: 'users', label: '340+ Sessions' },
      { icon: 'star', label: '4.9 Rating' },
      { icon: 'clock', label: 'Quick Response' },
    ],
    availability: [
      'Monday - Friday: 3:00 PM - 8:00 PM',
      'Saturday: 10:00 AM - 6:00 PM',
      'Sunday: By appointment',
    ],
  };

  const mentorData = { ...defaultMentor, ...mentor };

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
      if (!profile || !JSON.parse(profile).fullName || !JSON.parse(profile).email) {
        setShowProfileModal(true);
        return;
      }
      // Show complete later modal
      setShowCompleteLaterModal(true);
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={usersSvg} width={20} height={20} color="#7c3aed" />
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text style={styles.bioText}>{mentorData.bio}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={awardSvg} width={20} height={20} color="#7c3aed" />
                <Text style={styles.sectionTitle}>Qualifications</Text>
              </View>
              {mentorData.qualifications.map((qual, index) => (
                <View key={index} style={styles.qualification}>
                  <SvgXml xml={checkCircleSvg} width={20} height={20} color="#10b981" />
                  <Text style={styles.qualificationText}>{qual}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#7c3aed" />
                <Text style={styles.sectionTitle}>Availability</Text>
              </View>
              {mentorData.availability.map((time, index) => (
                <Text key={index} style={styles.availabilityText}>{time}</Text>
              ))}
            </View>

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
            <View style={styles.ratingSummary}>
              <View style={styles.ratingOverview}>
                <Text style={styles.overallRating}>{mentorData.rating} ({mentorData.reviews.length} reviews)</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SvgXml key={star} xml={starSvg} width={16} height={16} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.totalSessions}>{mentorData.sessions} sessions</Text>
              </View>
            </View>

            {mentorData.reviews.map((review) => (
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
                    <View>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                  <View style={styles.reviewStars}>
                    {[...Array(review.rating)].map((_, i) => (
                      <SvgXml key={i} xml={starSvg} width={14} height={14} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </View>
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
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.feeLabel}>Session Fee</Text>
            <View style={styles.feeAmount}>
              <Text style={styles.feeText}>₹{mentorData.price}</Text>
            </View>
          </View>
          <LinearGradient
            colors={['#7c3aed', '#ec4899', '#ea580c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.bookNowBtn, !mentorData.available && styles.disabledBtn]}
          >
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
              onPress={() => mentorData.available && handleBookSession(mentorData)}
              disabled={!mentorData.available}
            >
              <SvgXml xml={calendarSvg} width={16} height={16} color="white" />
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contentContainer, {paddingTop: 80}]}>
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
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
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
            {mentorData.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                {achievement.icon === 'award' && <SvgXml xml={awardSvg} width={20} height={20} color="#7c3aed" />}
                {achievement.icon === 'users' && <SvgXml xml={usersSvg} width={20} height={20} color="#7c3aed" />}
                {achievement.icon === 'star' && <SvgXml xml={starSvg} width={20} height={20} color="#7c3aed" />}
                {achievement.icon === 'clock' && <SvgXml xml={clockSvg} width={20} height={20} color="#7c3aed" />}
                <Text style={styles.achievementText}>{achievement.label}</Text>
              </View>
            ))}
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
                colors={['#7c3aed', '#ec4899', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bookSessionBtn}
              >
                <TouchableOpacity
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => handleBookSession(mentorData)}
                >
                  <SvgXml xml={calendarSvg} width={16} height={16} color="white" />
                  <Text style={styles.bookSessionText}>Book Session</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={styles.sessionCard}>
              <SvgXml xml={videoSvg} width={20} height={20} color="#7c3aed" />
              <Text style={styles.sessionText}>45-minute video session</Text>
              <Text style={styles.sessionPrice}>1999</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Your Profile</Text>
            <Text style={styles.modalMessage}>
              To book a mentorship session, please complete your profile with your full name and email address.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowProfileModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.completeButton]}
                onPress={() => {
                  setShowProfileModal(false);
                  navigation.navigate('ProfileSetupScreen');
                }}
              >
                <Text style={styles.completeButtonText}>Complete Profile</Text>
              </TouchableOpacity>
            </View>
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
                  navigation.navigate('BookingSlots', { mentor: mentorData });
                }}
              >
                <Text style={styles.completeButtonText}>Complete Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 120 }, // Space for bottom bar
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 20,
    paddingBottom: 80,
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
  profileCardContainer: { paddingHorizontal: 20, marginTop: -80, marginBottom: 20 },
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
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    textAlign: 'left',
  },
  section: {
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
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  achievement: {
    alignItems: 'center',
    flex: 1,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 16,
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
  ratingSummary: {
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
  ratingOverview: { alignItems: 'center' },
  overallRating: { fontSize: 36, fontWeight: 'bold', color: '#7C3AED', marginBottom: 8 },
  starsContainer: { flexDirection: 'row', marginBottom: 8 },
  star: { fontSize: 16, color: '#F59E0B', marginHorizontal: 1 },
  totalSessions: { fontSize: 14, color: '#6B7280' },
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
  reviewerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
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
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 6,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default MentorProfileScreen;


