import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { mentorAPI } from '../api/mentorAPI';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const rupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6H2l4-6z"/><path d="M6 9v12l8-6V9"/><path d="M6 9H2"/><path d="M6 15H2"/></svg>`;

const BookingSlots = ({ route, navigation }) => {
  const { mentor } = route.params || {};
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fallback mentor data
  const defaultMentor = {
    id: 1,
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    experience: '15+ years',
    rating: 4.9,
    sessions: 340,
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    available: true,
    price: 1999,
    responseTime: '2 hours',
  };

  const mentorData = mentor || defaultMentor;

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockSlots = [
        { id: 1, startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), price: 1999 },
        { id: 2, startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), price: 1999 },
        { id: 3, startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), endDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), price: 1999 },
      ];
      setAvailableSlots(mockSlots);
      // Set first date as selected if available
      if (mockSlots.length > 0) {
        const firstDate = new Date(mockSlots[0].startDateTime).toDateString();
        setSelectedDate(firstDate);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      Alert.alert('Error', 'Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = new Date(slot.startDateTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(slotsByDate);
  const slotsForDate = selectedDate ? slotsByDate[selectedDate] : [];

  const handleProceedToPayment = () => {
    if (!selectedSlot) return;
    navigation.navigate('Payment', { mentor: mentorData, selectedDate, selectedSlot });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading available slots...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#faf5ff', '#fff']} style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#ec4899', '#ea580c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Book Session</Text>
      </LinearGradient>

      {/* Mentor Info Card */}
      <View style={styles.mentorCard}>
        <View style={styles.mentorInfo}>
          <View style={styles.mentorImageContainer}>
            <Image source={{ uri: mentorData.image }} style={styles.mentorImage} />
          </View>
          <View style={styles.mentorDetails}>
            <Text style={styles.mentorName}>{mentorData.name}</Text>
            <Text style={styles.mentorSpecialty}>{mentorData.specialization}</Text>
            <View style={styles.mentorStats}>
              <SvgXml xml={starSvg} width={16} height={16} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{mentorData.rating}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.sessionsText}>{mentorData.sessions} sessions</Text>
            </View>
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionBadgeText}>45-minute video session</Text>
            </View>
            <View style={styles.priceContainer}>
              <SvgXml xml={rupeeSvg} width={20} height={20} color="#7c3aed" />
              <Text style={styles.priceText}>{mentorData.price}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SvgXml xml={calendarSvg} width={20} height={20} color="#7c3aed" />
          <Text style={styles.sectionTitle}>Select Date</Text>
        </View>
        <View style={styles.dateGrid}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dayText, selectedDate === date && styles.selectedDayText]}>
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dateNumber, selectedDate === date && styles.selectedDateNumber]}>
                {new Date(date).getDate()}
              </Text>
              <Text style={[styles.monthText, selectedDate === date && styles.selectedMonthText]}>
                {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Time Slot Selection */}
      {selectedDate && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SvgXml xml={clockSvg} width={20} height={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>
          <View style={styles.timeGrid}>
            {slotsForDate.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[styles.timeButton, selectedSlot?.id === slot.id && styles.selectedTimeButton]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.timeText, selectedSlot?.id === slot.id && styles.selectedTimeText]}>
                  {new Date(slot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {selectedSlot?.id === slot.id && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Booking Summary */}
      {selectedSlot && (
        <LinearGradient colors={['#faf5ff', '#fdf2f8']} style={styles.bookingSummary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mentor:</Text>
            <Text style={styles.summaryValue}>{mentorData.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{new Date(selectedDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>
              {new Date(selectedSlot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>45 mins</Text>
          </View>
        </LinearGradient>
      )}

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <View style={styles.priceAmount}>
            <SvgXml xml={rupeeSvg} width={20} height={20} color="#7c3aed" />
            <Text style={styles.priceValue}>{mentorData.price}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.proceedButton, !selectedSlot && styles.disabledProceedButton]}
          onPress={handleProceedToPayment}
          disabled={!selectedSlot}
        >
          <LinearGradient
            colors={['#7c3aed', '#ec4899', '#ea580c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proceedButtonGradient}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    minHeight: '100%',
    paddingBottom: 120, // For bottom bar
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
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
    color: 'white',
    textAlign: 'center',
  },
  mentorCard: {
    marginHorizontal: 24,
    marginTop: -30,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
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
    marginRight: 16,
  },
  mentorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9d5ff',
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
  mentorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 4,
  },
  dot: {
    marginHorizontal: 8,
    color: '#6b7280',
  },
  sessionsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sessionBadge: {
    backgroundColor: '#faf5ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sessionBadgeText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateButton: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  selectedDateNumber: {
    color: '#7c3aed',
  },
  monthText: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedMonthText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    minWidth: 100,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTimeButton: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingSummary: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581c87',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceValue: {
    fontSize: 20,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  proceedButton: {
    borderRadius: 50,
    overflow: 'hidden',
    height: 56,
  },
  proceedButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledProceedButton: {
    opacity: 0.5,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingSlots;