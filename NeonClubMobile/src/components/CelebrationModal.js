import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { Sparkles, Award, Gift, Star } from 'lucide-react-native';
import NEON_COLORS from '../utils/colors';

const { width, height } = Dimensions.get('window');

const CelebrationModal = ({
  isVisible,
  onClose,
  title,
  message,
  icon = 'award',
  points = 0,
  showOptions = false,
  onGoToMyLearning,
  onBackToDashboard,
  transactionId,
  amount,
  dateTime,
}) => {
  const [confetti, setConfetti] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    if (isVisible) {
      // Generate confetti
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * width,
        delay: Math.random() * 2000,
        color: ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#FBBF24'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5,
      }));
      setConfetti(newConfetti);

      // Animate modal entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
    }
  }, [isVisible]);

  const IconComponent = icon === 'gift' ? Gift : icon === 'star' ? Star : Award;

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {confetti.map((piece) => (
          <Animated.View
            key={piece.id}
            style={[
              styles.confetti,
              {
                left: piece.left,
                top: -20,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, height + 20],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}

        {/* Modal */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Animated Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <IconComponent size={48} color="#FFFFFF" />
              </View>
              <View style={styles.sparkle1}>
                <Sparkles size={16} color="#FBBF24" />
              </View>
              <View style={styles.sparkle2}>
                <Sparkles size={12} color="#EC4899" />
              </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {(transactionId || amount || dateTime) && (
              <View style={styles.detailsContainer}>
                {transactionId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValue}>{transactionId}</Text>
                  </View>
                )}
                {amount && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount Paid</Text>
                    <Text style={styles.detailValue}>₹{amount}</Text>
                  </View>
                )}
                {dateTime && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>{dateTime}</Text>
                  </View>
                )}
              </View>
            )}

            {points > 0 && (
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsLabel}>You earned</Text>
                <Text style={styles.pointsValue}>+{points} points</Text>
              </View>
            )}

            {showOptions ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.optionButton]} onPress={onGoToMyLearning}>
                  <Text style={styles.buttonText}>Go to My Learning</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.optionButton]} onPress={onBackToDashboard}>
                  <Text style={styles.buttonText}>Back to Dashboard</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Awesome!</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: NEON_COLORS.neonPurple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -6,
    left: -6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  pointsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400E',
  },
  button: {
    backgroundColor: NEON_COLORS.neonPurple,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CelebrationModal;