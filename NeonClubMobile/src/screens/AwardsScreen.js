import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Trophy, Award, Star, Gift, ChevronRight } from 'lucide-react-native';
import NEON_COLORS from '../utils/colors';

const { width, height } = Dimensions.get('window');

const trophySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H2v10c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9h-4"/><path d="M10 5h4"/><path d="M12 3v6"/><path d="M8 9v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9"/><path d="M4 9v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/></svg>`;
const medalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M12 3v6"/><path d="M9 9h6"/><path d="M12 15v6"/><path d="M9 15h6"/></svg>`;
const certificateSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="4" rx="2"/><path d="M7 9h10"/><path d="M7 13h10"/><path d="M9 4v2"/><path d="M15 4v2"/></svg>`;

const AwardsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, data, fromPayment } = route.params || {};

  const [awards, setAwards] = useState([]);

  useEffect(() => {
    // Generate awards based on the activity type
    const generatedAwards = generateAwards(type, data);
    setAwards(generatedAwards);
  }, [type, data]);

  const generateAwards = (activityType, activityData) => {
    const baseAwards = [
      {
        id: 'completion',
        title: 'Course Completion',
        description: 'Successfully completed the course',
        icon: 'trophy',
        color: NEON_COLORS.neonGold,
        unlocked: true,
      },
      {
        id: 'certificate',
        title: 'Certificate Earned',
        description: 'Download your completion certificate',
        icon: 'certificate',
        color: NEON_COLORS.neonBlue,
        unlocked: true,
      },
      {
        id: 'points',
        title: 'Reward Points',
        description: `Earned ${activityData?.points || 100} points`,
        icon: 'star',
        color: NEON_COLORS.neonPurple,
        unlocked: true,
      },
    ];

    // Add activity-specific awards
    if (activityType === 'course') {
      baseAwards.push({
        id: 'specialization',
        title: 'Specialization Badge',
        description: 'Earned specialization in this field',
        icon: 'medal',
        color: NEON_COLORS.neonGreen,
        unlocked: true,
      });
    } else if (activityType === 'engage-activity') {
      baseAwards.push({
        id: 'engagement',
        title: 'Engagement Champion',
        description: 'Active participation in wellness activities',
        icon: 'award',
        color: NEON_COLORS.neonPink,
        unlocked: true,
      });
    }

    return baseAwards;
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy size={32} color="#FFFFFF" />;
      case 'certificate':
        return <Award size={32} color="#FFFFFF" />;
      case 'star':
        return <Star size={32} color="#FFFFFF" />;
      case 'medal':
        return <Gift size={32} color="#FFFFFF" />;
      case 'award':
        return <Award size={32} color="#FFFFFF" />;
      default:
        return <Trophy size={32} color="#FFFFFF" />;
    }
  };

  const handleContinue = () => {
    // Navigate to appropriate screen based on activity type
    if (type === 'course') {
      navigation.navigate('MyLearning');
    } else if (type === 'engage-activity') {
      navigation.navigate('Engage');
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[NEON_COLORS.neonPurple, NEON_COLORS.neonBlue]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Trophy size={48} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Congratulations!</Text>
          <Text style={styles.headerSubtitle}>
            You've unlocked new achievements
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Activity Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Activity Completed</Text>
          <Text style={styles.activityName}>{data?.title || 'Activity'}</Text>
          <Text style={styles.activityType}>
            {type === 'course' ? 'Course' :
             type === 'engage-activity' ? 'Wellness Activity' :
             type === 'event' ? 'Event' : 'Activity'}
          </Text>
        </View>

        {/* Awards Grid */}
        <View style={styles.awardsSection}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <View style={styles.awardsGrid}>
            {awards.map((award) => (
              <View key={award.id} style={styles.awardCard}>
                <LinearGradient
                  colors={[award.color, award.color + '80']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.awardGradient}
                >
                  <View style={styles.awardIcon}>
                    {getIcon(award.icon)}
                  </View>
                  <Text style={styles.awardTitle}>{award.title}</Text>
                  <Text style={styles.awardDescription}>{award.description}</Text>
                  {award.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ Unlocked</Text>
                    </View>
                  )}
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.nextStepsList}>
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Continue learning with more courses</Text>
            </View>
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Share your achievement on social media</Text>
            </View>
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Earn more points and unlock badges</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <LinearGradient
            colors={[NEON_COLORS.neonPurple, NEON_COLORS.neonBlue]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue Learning</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </LinearGradient>
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 14,
    color: NEON_COLORS.neonPurple,
    fontWeight: '500',
  },
  awardsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  awardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  awardCard: {
    width: (width - 40 - 16) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  awardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
  },
  awardIcon: {
    marginBottom: 12,
  },
  awardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  awardDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nextStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 12,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: NEON_COLORS.neonPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default AwardsScreen;