import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

// Alert circle icon SVG (orange warning)
const alertCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

const ProfileCompletionPrompt = ({ feature = 'this service', onComplete, onCancel }) => {
  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Alert Icon with Orange Background */}
          <View style={styles.iconContainer}>
            <SvgXml xml={alertCircleSvg} width={32} height={32} color="#ea580c" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Complete Your Profile</Text>

          {/* Message */}
          <Text style={styles.message}>
            Please complete your professional information to book {feature}. This helps us provide you with the best experience.
          </Text>

          {/* Missing Information Box */}
          <View style={styles.missingInfoBox}>
            <Text style={styles.missingInfoTitle}>Missing information:</Text>
            <View style={styles.missingInfoList}>
              <Text style={styles.missingInfoItem}>• Current Workplace</Text>
              <Text style={styles.missingInfoItem}>• Nursing Registration Number</Text>
              <Text style={styles.missingInfoItem}>• Highest Qualification</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Maybe Later</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.completeButtonContainer} onPress={onComplete} activeOpacity={0.8}>
              <LinearGradient
                colors={['#2563eb', '#9333ea']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completeButton}
              >
                <Text style={styles.completeText}>Complete Profile Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fed7aa',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  missingInfoBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  missingInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  missingInfoList: {
    // No specific styles
  },
  missingInfoItem: {
    fontSize: 14,
    color: '#78350f',
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButtonContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ProfileCompletionPrompt;