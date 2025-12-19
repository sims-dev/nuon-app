import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NEON_COLORS } from '../utils/colors';

const { width, height } = Dimensions.get('window');

const ValuePropositionScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Learn & Grow',
      description: 'Access comprehensive courses, workshops, and training programs designed specifically for nursing professionals.',
      icon: '🎓',
      gradient: NEON_COLORS.gradientPurpleToBlue,
      overlayOpacity: 0.9,
    },
    {
      id: 2,
      title: 'Events & Workshops',
      description: 'Join live events, webinars, and interactive workshops to enhance your clinical skills and knowledge.',
      icon: '📅',
      gradient: NEON_COLORS.gradientPinkToPurple,
      overlayOpacity: 0.9,
    },
    {
      id: 3,
      title: 'Expert Mentorship',
      description: 'Connect with experienced mentors for personalized guidance and career development support.',
      icon: '👥',
      gradient: NEON_COLORS.gradientBlueToCyan,
      overlayOpacity: 0.9,
    },
    {
      id: 4,
      title: 'Become a Champion',
      description: 'Join the Nightingale Programme and become a certified mentor, recognized for your expertise.',
      icon: '🏆',
      gradient: NEON_COLORS.gradientGreenToYellow,
      overlayOpacity: 0.9,
    },
    {
      id: 5,
      title: 'Earn Rewards',
      description: 'Earn points through learning activities and redeem them for exclusive benefits and opportunities.',
      icon: '🎁',
      gradient: NEON_COLORS.gradientYellowToOrange,
      overlayOpacity: 0.9,
    },
    {
      id: 6,
      title: 'Advance Your Career',
      description: 'Accelerate your professional growth with industry-recognized certifications and networking opportunities.',
      icon: '📈',
      gradient: NEON_COLORS.gradientCyanToGreen,
      overlayOpacity: 0.9,
    },
  ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentSlide(roundIndex);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    navigation.replace('OTPAuth');
  };

  const renderSlide = (slide, index) => (
    <LinearGradient key={slide.id} colors={slide.gradient} style={[styles.slide, { width }]}>
      {/* Background overlay for better text readability */}
      <View style={[styles.overlay, { opacity: slide.overlayOpacity }]} />

      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        <View style={styles.dotsContainer}>
          {slides.map((_, dotIndex) => (
            <TouchableOpacity
              key={dotIndex}
              style={[
                styles.dot,
                currentSlide === dotIndex && styles.activeDot,
              ]}
              onPress={() => goToSlide(dotIndex)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {index < slides.length - 1 ? (
            <>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.container}
    >
      {slides.map((slide, index) => renderSlide(slide, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEON_COLORS.darkBg,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: NEON_COLORS.darkBg,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: NEON_COLORS.glassBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: NEON_COLORS.glassBorder,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: NEON_COLORS.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 18,
    color: NEON_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: NEON_COLORS.neonPurple,
    width: 20,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  skipButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: NEON_COLORS.textSecondary,
  },
  skipButtonText: {
    color: NEON_COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButtonText: {
    color: NEON_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  getStartedButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  getStartedButtonText: {
    color: NEON_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ValuePropositionScreen;