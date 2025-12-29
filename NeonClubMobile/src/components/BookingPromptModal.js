import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const alertCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

const BookingPromptModal = ({
  visible,
  onCompleteNow,
  onMaybeLater,
  missingFields = [],
  title = "Complete Your Profile",
  description = "Please complete your professional information to book mentorship sessions. This helps us provide you with the best experience.",
  buttonText = "Complete Profile Now →"
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onMaybeLater}
    >
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileModalContent}>
            {/* Alert Icon */}
            <View style={styles.alertIconContainer}>
              <SvgXml xml={alertCircleSvg} width={24} height={24} color="#EA580C" />
            </View>

            {/* Title */}
            <Text style={styles.profileModalTitle}>{title}</Text>

            {/* Description */}
            <Text style={styles.profileModalDescription}>
              {description}
            </Text>

            {/* Missing Information Box */}
            {missingFields.length > 0 && (
              <View style={styles.missingInfoBox}>
                <Text style={styles.missingInfoLabel}>Missing information:</Text>
                <View style={styles.bulletList}>
                  {missingFields.map((field, index) => (
                    <Text key={index} style={styles.bulletItem}>• {field}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Complete Profile Button */}
            <LinearGradient
              colors={['#3b82f6', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeProfileBtn}
            >
              <TouchableOpacity
                style={styles.completeProfileBtnInner}
                onPress={onCompleteNow}
              >
                <Text style={styles.completeProfileBtnText}>{buttonText}</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* Maybe Later */}
            <TouchableOpacity
              onPress={onMaybeLater}
            >
              <Text style={styles.maybeLaterText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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

export default BookingPromptModal;