import React, { useState, useEffect } from 'react';
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
import socketService from '../services/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mentorAPI } from '../api/mentorAPI';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

const RescheduleSessionScreen = ({ route, navigation }) => {
  const { session } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Generate next 5 dates
  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  };

  const dates = getNextDates();

  // Socket.IO initialization
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await socketService.connect();
        console.log('Reschedule screen connected to socket');
      } catch (error) {
        console.error('Socket initialization failed:', error);
      }
    };

    initializeSocket();

    return () => {
      // Cleanup will be handled by navigation
    };
  }, []);

  // Time slots for selected date
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const handleConfirmReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Selection Required', 'Please select both new date and time for your session.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      // Convert selected time to proper format
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      const hour24 = period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : period === 'AM' && hours === '12' ? 0 : parseInt(hours);
      const newDateTime = new Date(`${selectedDate}T${hour24.toString().padStart(2, '0')}:${minutes}:00`);

      // Use mentorAPI to reschedule
      const result = await mentorAPI.rescheduleBooking(session.id, newDateTime.toISOString(), token);

      // Emit real-time notification
      socketService.emit('booking_rescheduled', {
        bookingId: session.id,
        newDateTime: newDateTime.toISOString(),
        mentorId: session.mentorId,
        userId: session.userId
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Reschedule error:', error);
      Alert.alert('Error', error.message || 'Failed to reschedule session. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('MySessions');
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
          <Text style={styles.headerTitle}>Reschedule Session</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Booking Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Current Booking</Text>
          <View style={styles.currentBooking}>
            <Text style={styles.currentMentor}>{session.mentor}</Text>
            <Text style={styles.currentTopic}>{session.topic}</Text>
            <Text style={styles.currentDateTime}>{session.date} at {session.time}</Text>
          </View>
          <Text style={styles.warningText}>
            Note: No charges for rescheduling. You can reschedule up to 2 hours before the session.
          </Text>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate === date.fullDate && styles.selectedDateCard
                ]}
                onPress={() => setSelectedDate(date.fullDate)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === date.fullDate && styles.selectedDateText
                ]}>
                  {date.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === date.fullDate && styles.selectedDateText
                ]}>
                  {date.date}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate === date.fullDate && styles.selectedDateText
                ]}>
                  {date.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select New Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText
                  ]}>
                    {time}
                  </Text>
                  {selectedTime === time && (
                    <View style={styles.checkIcon}>
                      <SvgXml xml={checkSvg} width={12} height={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* New Schedule Summary */}
        {(selectedDate && selectedTime) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>New Schedule Summary</Text>
            <View style={styles.newBooking}>
              <Text style={styles.newMentor}>{session.mentor}</Text>
              <Text style={styles.newTopic}>{session.topic}</Text>
              <Text style={styles.newDateTime}>
                {dates.find(d => d.fullDate === selectedDate)?.day} {dates.find(d => d.fullDate === selectedDate)?.date} {dates.find(d => d.fullDate === selectedDate)?.month} at {selectedTime}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['#7c3aed', '#ec4899', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.confirmBtn}
        >
          <TouchableOpacity
            style={styles.confirmBtnInner}
            onPress={handleConfirmReschedule}
            disabled={!selectedDate || !selectedTime}
          >
            <SvgXml xml={calendarSvg} width={20} height={20} color="white" />
            <Text style={styles.confirmText}>Confirm Reschedule</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <SvgXml xml={checkCircleSvg} width={48} height={48} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>Session Rescheduled!</Text>
            <Text style={styles.modalMessage}>
              Your mentorship session has been successfully rescheduled to the new date and time.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
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
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  currentBooking: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  currentMentor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentTopic: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentDateTime: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  dateScroll: { marginBottom: 16 },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDateCard: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  dateDay: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedDateText: { color: 'white' },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '30%',
    aspectRatio: 2.5,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedTimeSlot: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedTimeText: { color: 'white' },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: '#d1fae5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 16,
  },
  newBooking: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  newMentor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  newTopic: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  newDateTime: {
    fontSize: 14,
    color: '#065f46',
    fontWeight: '500',
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
  confirmBtn: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  confirmBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmText: {
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
  successIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
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
  modalButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RescheduleSessionScreen;