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
import BookingPromptModal from '../components/BookingPromptModal';
import { checkProfileCompletion } from '../utils/profileUtils';
import { mentorAPI } from '../api/mentorAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

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
        fullDate: date.toISOString().split('T')[0],
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }
    return dates;
  };

  useEffect(() => {
    if (!route.params?.skipProfileCheck) {
      const checkProfile = async () => {
        const { isComplete, missingFields: fields } = await checkProfileCompletion();
        if (!isComplete) {
          setMissingFields(fields);
          setShowProfilePrompt(true);
        }
      };
      checkProfile();
    }
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const slots = await mentorAPI.fetchMentorAvailability(mentor.id);
        if (slots && Array.isArray(slots)) {
          setAvailabilitySlots(slots);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        Alert.alert('Error', 'Failed to load availability slots');
      } finally {
        setLoading(false);
      }
    };

    if (mentor && mentor.id) {
      fetchAvailability();
    }

    // Generate dates
    setDates(generateDates());
  }, [mentor]);

  // Get available time slots for selected date
  const getTimeSlotsForDate = (dateString) => {
    const slotsForDate = availabilitySlots.filter(slot => {
      const slotDate = new Date(slot.startDateTime).toISOString().split('T')[0];
      return slotDate === dateString && slot.isActive && slot.currentBookings < slot.maxBookings;
    });

    return slotsForDate.map(slot => ({
      id: slot.id,
      time: new Date(slot.startDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: 'available',
      slot: slot
    }));
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
        navigation.navigate('Payment', {
          mentor,
          bookingDetails: {
            slot: selectedSlot,
            booking: bookingResult.booking,
            price: selectedSlot.price || mentor.price
          }
        });
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
        colors={['#EC4899', '#8B5CF6', '#F97316']}
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
                <Text style={styles.sessionDuration}>45 min</Text>
                <Text style={styles.sessionPrice}>₹{mentor.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date, index) => {
               const hasAvailableSlots = getTimeSlotsForDate(date.fullDate).length > 0;
               return (
                 <TouchableOpacity
                   key={index}
                   style={[
                     styles.dateCard,
                     selectedDate === date.fullDate && styles.selectedDateCard,
                     date.isPast && styles.pastDateCard,
                     !hasAvailableSlots && !date.isPast && styles.noSlotsDateCard
                   ]}
                   onPress={() => !date.isPast && hasAvailableSlots && handleDateSelect(date)}
                   disabled={date.isPast || !hasAvailableSlots}
                 >
                <Text style={[
                  styles.dateDay,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  (date.isPast || !hasAvailableSlots) && styles.disabledDateText
                ]}>
                  {date.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  (date.isPast || !hasAvailableSlots) && styles.disabledDateText
                ]}>
                  {date.date}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate === date.fullDate && styles.selectedDateText,
                  (date.isPast || !hasAvailableSlots) && styles.disabledDateText
                ]}>
                  {date.month}
                </Text>
              </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
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

                     return (
                       <TouchableOpacity
                         key={index}
                         style={[
                           styles.timeSlot,
                           selectedTime === slot.time && styles.selectedTimeSlot,
                           isPast && styles.pastTimeSlot
                         ]}
                         onPress={() => !isPast && handleTimeSelect(slot)}
                         disabled={isPast}
                       >
                         <Text style={[
                           styles.timeText,
                           selectedTime === slot.time && styles.selectedTimeText,
                           isPast && styles.pastTimeText
                         ]}>
                           {slot.time}
                         </Text>
                         {selectedTime === slot.time && (
                           <View style={styles.checkIcon}>
                             <SvgXml xml={checkSvg} width={12} height={12} color="#8B5CF6" />
                           </View>
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

        {/* Booking Summary */}
        {selectedSlot && (
           <View style={styles.summaryCard}>
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
                 {selectedTime} – {addMinutesToTime(selectedTime, selectedSlot.duration || 45)}
               </Text>
             </View>
             <View style={styles.summaryRow}>
               <Text style={styles.summaryLabel}>Session Fee</Text>
               <Text style={styles.summaryPrice}>₹{selectedSlot.price || mentor.price}</Text>
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
          style={styles.proceedBtn}
        >
          <TouchableOpacity
             style={styles.proceedBtnInner}
             onPress={handleProceedToPayment}
             disabled={!selectedSlot}
           >
            <SvgXml xml={calendarSvg} width={20} height={20} color="white" />
            <Text style={styles.proceedText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <BookingPromptModal
        visible={showProfilePrompt}
        onCompleteNow={() => {
          setShowProfilePrompt(false);
          navigation.navigate('Profile', { screen: 'ProfileEdit' });
        }}
        onMaybeLater={() => setShowProfilePrompt(false)}
        missingFields={missingFields}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBFF' },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorImageContainer: { marginRight: 16 },
  mentorImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionPrice: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
  },
  section: { marginBottom: 20 },
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
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedDateCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#8B5CF6',
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDateText: { color: '#7C3AED' },
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
    width: '30%',
    aspectRatio: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedTimeSlot: {
    backgroundColor: '#F5F3FF',
    borderColor: '#8B5CF6',
  },
  bookedTimeSlot: {
    backgroundColor: '#F3F4F6',
  },
  pastTimeSlot: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedTimeText: { color: '#7C3AED' },
  bookedTimeText: { color: '#9CA3AF' },
  pastTimeText: { color: '#9CA3AF' },
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
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#DDD6FE',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontSize: 14,
    color: '#7C3AED',
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
  proceedBtn: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  proceedBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  proceedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingSlots;