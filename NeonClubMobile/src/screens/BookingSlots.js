import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { mentorAPI } from '../api/mentorAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, on } from '../utils/socket';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

const BookingSlots = ({ route, navigation }) => {
  const { mentor } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await mentorAPI.fetchMentorAvailability(mentor.id);
      if (response && response.success && Array.isArray(response.slots)) {
        setAvailabilitySlots(response.slots);
      } else {
        setAvailabilitySlots([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      Alert.alert('Error', 'Failed to load availability slots');
      setAvailabilitySlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate dates for current week and next few weeks
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 1); // Show dates till next month

    for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date.toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }
    return dates;
  };


  useEffect(() => {
    if (mentor && mentor.id) {
      fetchAvailability();
    }

    // Generate dates
    setDates(generateDates());
  }, [mentor]);

  // Socket.IO real-time updates
  useEffect(() => {
    let socketCleanup = [];

    const initializeSocket = async () => {
      try {
        const socket = connectSocket();

        // Listen for mentor availability updates
        socketCleanup.push(on('mentor_availability_update', (data) => {
          console.log('Mentor availability updated:', data);
          if (data.mentorId === mentor.id) {
            // Refresh availability slots
            fetchAvailability();
          }
        }));

        // Listen for new mentor availability
        socketCleanup.push(on('new_mentor_availability', (data) => {
          console.log('New mentor availability added:', data);
          if (data.mentorId === mentor.id) {
            fetchAvailability();
          }
        }));

        // Listen for availability deleted
        socketCleanup.push(on('availability-deleted', (data) => {
          console.log('Availability deleted:', data);
          if (data.mentorId === mentor.id) {
            fetchAvailability();
          }
        }));

        // Listen for booking updates
        socketCleanup.push(on('booking_update', (data) => {
          console.log('Booking update:', data);
          if (data.mentorId === mentor.id) {
            fetchAvailability();
          }
        }));

      } catch (error) {
        console.error('Socket initialization failed:', error);
      }
    };

    if (mentor && mentor.id) {
      initializeSocket();
    }

    return () => {
      socketCleanup.forEach(cleanup => cleanup && cleanup());
    };
  }, [mentor]);

  // Get available time slots for selected date
  const getTimeSlotsForDate = (dateString) => {
    // Filter slots for the selected date that are active
    const slotsForDate = availabilitySlots.filter(slot => {
      const slotDate = new Date(slot.startDateTime).toLocaleDateString('en-CA');
      return slotDate === dateString && slot.isActive;
    });

    return slotsForDate.map(slot => {
      const startTime = new Date(slot.startDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(' ', '');
      const endTime = new Date(slot.endDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(' ', '');
      const isBooked = slot.currentBookings >= slot.maxBookings;
      return {
        id: slot.id,
        time: `${startTime}-${endTime}`,
        status: isBooked ? 'booked' : 'available',
        slot: slot
      };
    });
  };

  const addMinutesToTime = (time, minutes) => {
    const [timePart, period] = time.split(' ');
    const [hours, mins] = timePart.split(':').map(Number);
    const date = new Date();
    date.setHours(hours + (period === 'PM' && hours !== 12 ? 12 : 0), mins + minutes);
    const newHours = date.getHours() % 12 || 12;
    const newMins = date.getMinutes();
    const newPeriod = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${newHours}:${newMins.toString().padStart(2, '0')} ${newPeriod}`;
  };

  const handleProceedToPayment = async () => {
    if (!selectedSlot) {
      Alert.alert('Selection Required', 'Please select a time slot for your session.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Required', 'Please login to book a session.');
        return;
      }

      // Book the session
      const bookingResult = await mentorAPI.bookSession({
        availabilityId: selectedSlot.id
      }, token);

      if (bookingResult.success) {
        const isFreeMentor = mentor.price == 0;
        if (isFreeMentor) {
          // For free mentors, show success and navigate back or to sessions
          Alert.alert('Request Sent', 'Your session request has been sent to the mentor. You will be notified once accepted.', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } else {
          navigation.navigate('Payment', {
            mentor,
            bookingDetails: {
              slot: selectedSlot,
              booking: bookingResult.booking,
              price: selectedSlot.price || mentor.price
            }
          });
        }
      } else {
        Alert.alert('Booking Failed', bookingResult.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Failed to book session. Please try again.');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.fullDate);
    setSelectedTime(null);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot.time);
    setSelectedSlot(slot.slot);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F97316']}
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
          <Text style={styles.headerTitle}>Book Session</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Mentor Info Card */}
        <View style={styles.mentorCard}>
          <View style={styles.mentorCardContent}>
            <View style={styles.mentorInfo}>
              <View style={styles.mentorImageContainer}>
                <View style={styles.mentorImage}>
                  <Text style={styles.mentorInitial}>{mentor.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.mentorDetails}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorSpecialty}>{mentor.specialization}</Text>
                <View style={styles.sessionInfo}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>45 min session</Text>
                  </View>
                  <Text style={styles.sessionPrice}>₹{mentor.price}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dates.map((date, index) => {
                const availableSlots = getTimeSlotsForDate(date.fullDate);
                const hasAvailableSlots = availableSlots.length > 0;
                const isEnabled = !date.isPast && hasAvailableSlots;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCard,
                      selectedDate === date.fullDate && styles.selectedDateCard,
                      date.isPast && styles.pastDateCard,
                      !isEnabled && !date.isPast && styles.noSlotsDateCard
                    ]}
                    onPress={() => isEnabled && handleDateSelect(date)}
                    disabled={!isEnabled}
                  >
                <Text style={[
                  styles.dateDay,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  !isEnabled && styles.disabledDateText
                ]}>
                  {date.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  !isEnabled && styles.disabledDateText
                ]}>
                  {date.date}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  !isEnabled && styles.disabledDateText
                ]}>
                  {date.month}
                </Text>
              </TouchableOpacity>
              );
           })}
          </ScrollView>
        </View>

        {/* Select Time Slot */}
        {selectedDate && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={clockSvg} width={20} height={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Select Time Slot</Text>
              </View>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text style={styles.loadingText}>Loading available slots...</Text>
                </View>
              ) : (
                <View style={styles.timeGrid}>
                  {getTimeSlotsForDate(selectedDate).length > 0 ? (
                    getTimeSlotsForDate(selectedDate).map((slot, index) => {
                      const slotTime = new Date(slot.slot.startDateTime);
                      const now = new Date();
                      const isPast = slotTime <= now;
                      const isBooked = slot.status === 'booked';

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.timeSlot,
                            selectedTime === slot.time && styles.selectedTimeSlot,
                            isPast && styles.pastTimeSlot,
                            isBooked && styles.bookedTimeSlot
                          ]}
                          onPress={() => !isPast && !isBooked && handleTimeSelect(slot)}
                          disabled={isPast || isBooked}
                        >
                          {selectedTime === slot.time && (
                            <View style={styles.checkIcon}>
                              <SvgXml xml={checkSvg} width={12} height={12} color="#8B5CF6" />
                            </View>
                          )}
                          <Text style={[
                            styles.timeText,
                            selectedTime === slot.time && styles.selectedTimeText,
                            isPast && styles.pastTimeText,
                            isBooked && styles.bookedTimeText
                          ]}>
                            {slot.time}
                          </Text>
                          {isBooked && (
                            <Text style={styles.bookedLabel}>Booked</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View style={styles.noSlotsContainer}>
                      <Text style={styles.noSlotsText}>No available slots for this date</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

        {/* Summary */}
        {selectedDate && selectedSlot && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardContent}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mentor</Text>
                  <Text style={styles.summaryValue}>{mentor.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>
                    {dates.find(d => d.fullDate === selectedDate)?.day}, {dates.find(d => d.fullDate === selectedDate)?.date} {dates.find(d => d.fullDate === selectedDate)?.month}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedTime}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Session Fee</Text>
                  <Text style={styles.summaryPrice}>₹{selectedSlot.price || mentor.price}</Text>
                </View>
              </View>
            </View>
          )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bookBtn}
        >
          <TouchableOpacity
              style={styles.bookBtnInner}
              onPress={handleProceedToPayment}
              disabled={!selectedSlot}
            >
            <Text style={styles.bookText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
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
  mentorCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  mentorCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorImageContainer: { marginRight: 16 },
  mentorImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  mentorInitial: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  mentorDetails: { flex: 1 },
  mentorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mentorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  sessionPrice: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  dateScroll: { marginBottom: 16 },
  dateScrollContent: { paddingHorizontal: 0 },
  dateCard: {
    width: 80,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDateText: { color: '#8B5CF6' },
  disabledDateText: { color: '#9CA3AF' },
  pastDateCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  noSlotsDateCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '48%',
    aspectRatio: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTimeSlot: {
    backgroundColor: '#F5F3FF',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pastTimeSlot: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  bookedTimeSlot: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    opacity: 0.8,
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedTimeText: { color: '#8B5CF6', fontWeight: '600' },
  pastTimeText: { color: '#9CA3AF' },
  bookedTimeText: { color: '#DC2626' },
  bookedLabel: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noSlotsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 100,
  },
  summaryCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
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
  bookBtn: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  bookBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bookText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingSlots;