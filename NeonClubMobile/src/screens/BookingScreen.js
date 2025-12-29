import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mentorAPI } from '../api/mentorAPI';
import { AuthContext } from '../contexts/AuthContext';
import { checkProfileCompletion } from '../utils/profileUtils';
import RazorpayCheckout from 'react-native-razorpay';
import api from '../services/api';

// SVG Icons
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

const BookingScreen = ({ route, navigation }) => {
  const { mentor } = route.params || {};
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

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
    const fetchAvailability = async () => {
      try {
        const availabilityData = await mentorAPI.fetchMentorAvailability(mentor.id);
        setAvailability(availabilityData.slots || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('nurseProfile');
        if (profile) {
          setUserProfile(JSON.parse(profile));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (mentor) {
      fetchAvailability();
      setDates(generateDates());
      loadUserProfile();
    }
  }, [mentor]);

  // Get available time slots for selected date
  const getTimeSlotsForDate = (dateString) => {
    if (mentor.price == 0) {
      // For free mentors, return default time slots
      return [
        { id: 'free1', time: '10:00 AM', status: 'available', slot: { duration: 45, price: 0, startDateTime: new Date(`${dateString}T10:00:00`).toISOString() } },
        { id: 'free2', time: '10:45 AM', status: 'available', slot: { duration: 45, price: 0, startDateTime: new Date(`${dateString}T10:45:00`).toISOString() } },
      ];
    }

    const slotsForDate = availability.filter(slot => {
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

  const handleDateSelect = (date) => {
    setSelectedDate(date.fullDate);
    setSelectedTime(null);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot.time);
    setSelectedSlot(slot.slot);
  };

  const handleProceedToPayment = async () => {
    if (!selectedSlot) {
      Alert.alert('Selection Required', 'Please select a time slot for your session.');
      return;
    }

    const isFreeMentor = mentor.price == 0 || mentor.price == '0';

    try {
      // Check if user is logged in
      if (!user) {
        Alert.alert('Login Required', 'Please login to book a session.');
        navigation.navigate('Login');
        return;
      }

      // Check profile completion
      const profileStatus = await checkProfileCompletion();
      if (profileStatus.profileIncomplete) {
        Alert.alert('Profile Incomplete', 'Please complete your profile to book a session.');
        navigation.navigate('ProfileSetupScreen');
        return;
      }

      setBookingLoading(true);
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
        if (isFreeMentor) {
          // For free mentors, show success and navigate back
          Alert.alert('Request Sent', 'Your session request has been sent to the mentor. You will be notified once accepted.', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } else {
          // For paid mentors, navigate to payment page
          navigation.navigate('Payment', {
            mentor,
            bookingDetails: {
              price: selectedSlot.price || mentor.price,
              dateTime: selectedSlot.startDateTime,
              duration: selectedSlot.duration,
              booking: bookingResult.booking
            }
          });
        }
      } else {
        Alert.alert('Booking Failed', bookingResult.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const processPayment = async (booking) => {
    try {
      // Create order on backend
      const orderResponse = await api.post('/payments/create-order', {
        amount: (selectedSlot.price || mentor.price) * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        itemType: 'mentorship',
        itemId: booking.id,
      });

      const orderData = orderResponse.data;

      // Razorpay checkout options
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Neon Club',
        description: `Payment for Mentorship Session with ${mentor.name}`,
        order_id: orderData.id,
        prefill: {
          email: user?.email || '',
          contact: user?.phoneNumber || '',
          name: user?.name || '',
        },
        theme: {
          color: '#7c3aed',
        },
      };

      // Open Razorpay checkout
      const paymentResponse = await RazorpayCheckout.open(options);

      // Payment successful
      await verifyPayment(paymentResponse, orderData);

    } catch (error) {
      console.error('Payment error:', error);
      if (error.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Failed', error.description || 'Something went wrong with the payment');
      }
    }
  };

  const verifyPayment = async (paymentResponse, orderData) => {
    try {
      // Verify payment on backend
      await api.post('/payments/verify', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        itemType: 'mentorship',
        itemId: orderData.itemId,
      });

      // Payment successful
      Alert.alert('Payment Successful', 'Your mentorship session has been booked and paid for!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Payment verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: '#fff', marginTop: 16 }}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#faf5ff', '#fdf2f8', '#fff']}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer]}
      >
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
              <SvgXml
                xml={chevronLeftSvg}
                width={24}
                height={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Book Session</Text>
        </LinearGradient>

        {/* Profile Section */}
        {userProfile && (
          <View style={styles.profileSection}>
            <View style={styles.sectionHeader}>
              <SvgXml xml={userSvg} width={20} height={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Your Profile</Text>
            </View>
            <View style={styles.profileCard}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.fullName || user?.name || 'User'}</Text>
                <View style={styles.profileDetails}>
                  {userProfile.email && (
                    <View style={styles.profileDetail}>
                      <SvgXml xml={mailSvg} width={16} height={16} color="#6B7280" />
                      <Text style={styles.profileDetailText}>{userProfile.email}</Text>
                    </View>
                  )}
                  {userProfile.phoneNumber && (
                    <View style={styles.profileDetail}>
                      <SvgXml xml={phoneSvg} width={16} height={16} color="#6B7280" />
                      <Text style={styles.profileDetailText}>{userProfile.phoneNumber}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Booking Section */}
        <View style={styles.bookingSection}>
          <Text style={styles.bookingTitle}>Select Date & Time</Text>

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
                const hasAvailableSlots = getTimeSlotsForDate(date.fullDate).length > 0;
                const isFreeMentor = mentor.price == 0;
                const isEnabled = !date.isPast && (isFreeMentor || hasAvailableSlots);
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
                        {selectedTime === slot.time && (
                          <View style={styles.checkIcon}>
                            <SvgXml xml={checkSvg} width={12} height={12} color="#8B5CF6" />
                          </View>
                        )}
                        <Text style={[
                          styles.timeText,
                          selectedTime === slot.time && styles.selectedTimeText,
                          isPast && styles.pastTimeText
                        ]}>
                          {slot.time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.noSlotsContainer}>
                    <Text style={styles.noSlotsText}>No available slots for this date</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Summary Section */}
          {selectedDate && selectedTime && selectedSlot && (
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={checkSvg} width={20} height={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Booking Summary</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mentor:</Text>
                  <Text style={styles.summaryValue}>{mentor.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>{new Date(selectedDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{selectedTime}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration:</Text>
                  <Text style={styles.summaryValue}>{selectedSlot.duration} minutes</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Price:</Text>
                  <Text style={styles.summaryValue}>₹{selectedSlot.price || mentor.price}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Payment Section - Only for paid mentors */}
          {selectedDate && selectedTime && selectedSlot && (mentor.price > 0) && (
            <View style={styles.paymentSection}>
              <View style={styles.sectionHeader}>
                <SvgXml xml={checkSvg} width={20} height={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>

              {/* Card Payment */}
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedOption]}
                onPress={() => setPaymentMethod('card')}
              >
                <View style={styles.optionLeft}>
                  <Text style={[styles.optionText, paymentMethod === 'card' && styles.selectedText]}>
                    Credit/Debit Card
                  </Text>
                </View>
                <View style={[styles.radio, paymentMethod === 'card' && styles.radioSelected]} />
              </TouchableOpacity>

              {/* UPI Payment */}
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'upi' && styles.selectedOption]}
                onPress={() => setPaymentMethod('upi')}
              >
                <View style={styles.optionLeft}>
                  <Text style={[styles.optionText, paymentMethod === 'upi' && styles.selectedText]}>
                    UPI
                  </Text>
                </View>
                <View style={[styles.radio, paymentMethod === 'upi' && styles.radioSelected]} />
              </TouchableOpacity>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <View style={styles.formCard}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(text.replace(/\s+/g, '').replace(/[^0-9]/gi, '').match(/\d{1,4}/g)?.join(' ').substr(0, 19) || '')}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Name on card"
                      value={cardName}
                      onChangeText={(text) => setCardName(text.toUpperCase())}
                      autoCapitalize="characters"
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, {flex: 1, marginRight: 12}]}>
                      <Text style={styles.inputLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChangeText={(text) => setCardExpiry(text.replace(/\D+/g, '').substring(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2'))}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>

                    <View style={[styles.inputGroup, {flex: 1}]}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="123"
                        value={cardCvv}
                        onChangeText={(text) => setCardCvv(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <View style={styles.formCard}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Enter UPI ID</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChangeText={(text) => setUpiId(text.toLowerCase())}
                      autoCapitalize="none"
                    />
                    <Text style={styles.upiHint}>
                      E.g., 9876543210@paytm, name@oksbi, mobile@ybl
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Proceed Button */}
          {selectedDate && selectedSlot && (
            <View style={styles.proceedSection}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.proceedBtn}
              >
                <TouchableOpacity
                  style={styles.proceedBtnInner}
                  onPress={handleProceedToPayment}
                  disabled={bookingLoading}
                >
                  <Text style={styles.proceedText}>
                    {bookingLoading ? 'Processing...' : (mentor.price > 0 ? 'Book & Pay' : 'Book Session')}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 120 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  bookingSection: {
    padding: 20,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
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
  timeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedTimeText: { color: '#8B5CF6', fontWeight: '600' },
  pastTimeText: { color: '#9CA3AF' },
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
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noSlotsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  proceedSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  proceedBtn: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  proceedBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  proceedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  profileDetails: {
    marginTop: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#1F2937',
    fontWeight: '500',
  },
  paymentSection: {
    padding: 20,
  },
  paymentOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
  },
  upiHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default BookingScreen;