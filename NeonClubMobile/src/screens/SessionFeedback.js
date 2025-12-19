import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const SessionFeedback = ({ route, navigation }) => {
  const { mentorId, sessionId } = route.params;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would submit the feedback to the backend
      // await submitFeedback({ sessionId, mentorId, rating, feedback });

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#faf5ff', '#fff']} style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#7c3aed', '#ec4899', '#ea580c']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>✓</Text>
        </View>
        <Text style={styles.headerTitle}>Session Complete!</Text>
        <Text style={styles.headerSubtitle}>Thank you for your feedback</Text>
      </LinearGradient>

      {/* Mentor Info Card */}
      <View style={styles.mentorCard}>
        <View style={styles.mentorInfo}>
          <View style={styles.mentorImageContainer}>
            <Text style={styles.mentorImageText}>M</Text>
          </View>
          <View style={styles.mentorDetails}>
            <Text style={styles.mentorName}>Dr. Sunita Verma</Text>
            <Text style={styles.mentorTopic}>Critical Care Session</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Rate Your Session</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
              style={styles.starButton}
            >
              <Star
                size={32}
                color={star <= (hoverRating || rating) ? '#fbbf24' : '#d1d5db'}
                fill={star <= (hoverRating || rating) ? '#fbbf24' : 'none'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>
          {rating === 0 ? 'Tap to rate' :
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What did you like? (Optional)</Text>
        <View style={styles.qualityButtons}>
          {['Helpful', 'Informative', 'Engaging', 'Professional'].map((tag) => (
            <TouchableOpacity key={tag} style={styles.qualityButton}>
              <Text style={styles.qualityButtonText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MessageSquare width={20} height={20} color="#7c3aed" />
          <Text style={styles.sectionTitle}>Share your thoughts</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Share your thoughts</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us about your experience, what you learned, or how we can improve..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={feedback}
          onChangeText={setFeedback}
          textAlignVertical="top"
        />
        <Text style={styles.helperText}>Your feedback helps us improve our mentorship program.</Text>
      </View>

      <LinearGradient colors={['#dcfce7', '#ecfdf5']} style={styles.bonusCard}>
        <View style={styles.bonusIcon}>
          <Text style={styles.bonusIconText}>★</Text>
        </View>
        <Text style={styles.bonusTitle}>Earn Bonus Points!</Text>
        <Text style={styles.bonusDescription}>Complete your feedback to earn 50 bonus points.</Text>
      </LinearGradient>

      <View style={styles.actionButtons}>
        <LinearGradient
          colors={['#7c3aed', '#ec4899', '#ea580c']}
          style={styles.submitButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  mentorCard: {
    marginHorizontal: 24,
    marginTop: -30,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  mentorInfo: {
    flexDirection: 'row',
  },
  mentorImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mentorImageText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  mentorDetails: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  mentorTopic: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  qualityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityButton: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  qualityButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#d1d5db',
    minHeight: 120,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  bonusCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bonusIconText: {
    fontSize: 24,
    color: 'white',
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 4,
  },
  bonusDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  submitButton: {
    borderRadius: 50,
    height: 56,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    borderRadius: 50,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionFeedback;