import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { Star, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const rewardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;

const SessionFeedback = ({ route, navigation }) => {
  const { session, mentor, userName, userId } = route.params;
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const feedbackOptions = [
    'Excellent session!',
    'Very helpful mentor',
    'Great communication',
    'Learned a lot',
    'Would recommend',
    'Good experience',
    'Helpful guidance',
    'Clear explanations'
  ];

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a star rating for the session.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const feedbackData = {
        bookingId: session.id,
        rating: rating,
        comment: feedback,
        skills: feedbackOptions.filter(option => feedback.includes(option))
      };

      const response = await fetch(`http://192.168.1.100:5000/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const result = await response.json();

      // Show success modal with rewards
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('Mentorship', { activeTab: 'upcoming' });
  };

  return (
    <LinearGradient colors={['#faf5ff', '#fdf2f8', '#fff']} style={styles.container}>
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
          <Text style={styles.headerTitle}>Session Feedback</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Summary */}
        <View style={styles.sessionCard}>
          <Text style={styles.cardTitle}>Session Completed!</Text>
          <View style={styles.sessionInfo}>
            <Text style={styles.mentorName}>{mentor.name}</Text>
            <Text style={styles.sessionTopic}>{session.topic}</Text>
            <Text style={styles.sessionTime}>
              {session.date} at {session.time} • {session.duration}
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingCard}>
          <Text style={styles.sectionTitle}>How was your session?</Text>
          <Text style={styles.ratingSubtitle}>Rate your experience with {mentor.name}</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Star
                  size={40}
                  color={star <= rating ? '#fbbf24' : '#e5e7eb'}
                  fill={star <= rating ? '#fbbf24' : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        {/* Quick Feedback Options */}
        <View style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>What did you like? (Optional)</Text>
          <View style={styles.feedbackOptions}>
            {feedbackOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.feedbackOption,
                  feedback.includes(option) && styles.selectedFeedbackOption
                ]}
                onPress={() => {
                  if (feedback.includes(option)) {
                    setFeedback(feedback.replace(option + ', ', '').replace(option, ''));
                  } else {
                    setFeedback(prev => prev ? prev + ', ' + option : option);
                  }
                }}
              >
                <Text style={[
                  styles.feedbackOptionText,
                  feedback.includes(option) && styles.selectedFeedbackOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Comments */}
        <View style={styles.commentsCard}>
          <Text style={styles.sectionTitle}>Additional Comments (Optional)</Text>
          <TouchableOpacity style={styles.commentInput}>
            <Text style={styles.commentPlaceholder}>
              Share your thoughts about the session...
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['#7c3aed', '#ec4899', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitBtn}
        >
          <TouchableOpacity
            style={styles.submitBtnInner}
            onPress={handleSubmitFeedback}
          >
            <Text style={styles.submitText}>Submit Feedback</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Post-Feedback Cards Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {/* Session Summary Card */}
            <View style={styles.postFeedbackCard}>
              <View style={styles.sessionSummaryHeader}>
                <View style={styles.checkIconContainer}>
                  <CheckCircle size={24} color="#10b981" />
                </View>
                <Text style={styles.sessionSummaryTitle}>Session Completed!</Text>
              </View>
              <View style={styles.sessionSummaryContent}>
                <Text style={styles.sessionSummaryMentor}>{mentor.name}</Text>
                <Text style={styles.sessionSummaryTopic}>{session.topic}</Text>
                <Text style={styles.sessionSummaryDuration}>{session.duration} minutes</Text>
              </View>
            </View>

            {/* Reward Points Card */}
            <View style={styles.rewardCard}>
              <View style={styles.rewardIconContainer}>
                <SvgXml xml={rewardSvg} width={32} height={32} />
              </View>
              <Text style={styles.rewardTitle}>Reward Earned!</Text>
              <Text style={styles.rewardPoints}>+200 Points</Text>
              <Text style={styles.rewardDescription}>
                Great job completing your mentorship session! Keep learning to earn more rewards.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButtonPrimary}
                onPress={() => {
                  handleSuccessClose();
                  navigation.navigate('MyLearning');
                }}
              >
                <Text style={styles.actionButtonPrimaryText}>Go to My Learning</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonSecondary}
                onPress={() => {
                  handleSuccessClose();
                  navigation.navigate('Mentorship');
                }}
              >
                <Text style={styles.actionButtonSecondaryText}>Back to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 8,
  },
  sessionTopic: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starBtn: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedFeedbackOption: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  feedbackOptionText: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedFeedbackOptionText: {
    color: 'white',
  },
  commentsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  commentPlaceholder: {
    color: '#9ca3af',
    fontSize: 14,
  },
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
  },
  submitBtn: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  submitBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  postFeedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIconContainer: {
    marginRight: 12,
  },
  sessionSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
  },
  sessionSummaryContent: {
    alignItems: 'center',
  },
  sessionSummaryMentor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  sessionSummaryTopic: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  sessionSummaryDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  rewardCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardIconContainer: {
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  rewardPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  actionButtonPrimary: {
    backgroundColor: '#7c3aed',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionFeedback;