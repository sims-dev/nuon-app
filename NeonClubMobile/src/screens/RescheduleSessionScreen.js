import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

const availableDates = [
  { date: '2025-11-16', day: 'Sun', dateNum: '16', month: 'Nov' },
  { date: '2025-11-17', day: 'Mon', dateNum: '17', month: 'Nov' },
  { date: '2025-11-18', day: 'Tue', dateNum: '18', month: 'Nov' },
];

const timeSlots = {
  '2025-11-16': [
    { time: '2:00 PM - 2:45 PM', available: true },
    { time: '3:00 PM - 3:45 PM', available: false },
    { time: '5:00 PM - 5:45 PM', available: true },
  ],
  '2025-11-17': [
    { time: '10:00 AM - 10:45 AM', available: true },
    { time: '2:00 PM - 2:45 PM', available: true },
    { time: '4:00 PM - 4:45 PM', available: true },
  ],
  '2025-11-18': [
    { time: '11:00 AM - 11:45 AM', available: true },
    { time: '3:00 PM - 3:45 PM', available: true },
    { time: '6:00 PM - 6:45 PM', available: true },
  ],
};

const RescheduleSessionScreen = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const session = route?.params?.session || {
    mentor: 'Dr. Sunita Verma',
    topic: 'Advanced Wound Care',
    currentDate: 'Nov 16, 2025',
    currentTime: '2:00 PM - 2:45 PM',
  };

  const handleReschedule = () => {
    if (selectedDate && selectedSlot) {
      navigation.navigate('MentorshipScreen'); // Navigate back to mentors
    }
  };

  return (
    <LinearGradient colors={['#fff7ed', '#fff']} style={styles.container}>
      <ScrollView>
      {/* Header */}
      <LinearGradient
        colors={['#ea580c', '#ec4899', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#00FFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reschedule Session</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Current Session Card */}
        <LinearGradient colors={['#fff7ed', '#fef3c7']} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#ea580c" />
            <Text style={styles.cardTitle}>Current Booking</Text>
          </View>
          <Text style={styles.mentor}>{session.mentor}</Text>
          <Text style={styles.topic}>{session.topic}</Text>
          <View style={styles.currentTimeContainer}>
            <Text style={styles.currentLabel}>Current:</Text>
            <Text style={styles.currentTime}>{session.currentDate}, {session.currentTime}</Text>
          </View>
        </LinearGradient>

        {/* Select New Date */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Select New Date</Text>
          </View>
          <FlatList
            data={availableDates}
            horizontal
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dateBtn, selectedDate === item.date && styles.selectedDateBtn]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[styles.dateDay, selectedDate === item.date && styles.selectedDateText]}>{item.day}</Text>
                <Text style={[styles.dateNum, selectedDate === item.date && styles.selectedDateText]}>{item.dateNum}</Text>
                <Text style={[styles.dateMonth, selectedDate === item.date && styles.selectedDateText]}>{item.month}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            style={styles.dateList}
          />
        </View>

        {/* Select Time Slot */}
        {selectedDate && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SvgXml xml={clockSvg} width={20} height={20} color="#7c3aed" />
              <Text style={styles.sectionTitle}>Select Time Slot</Text>
            </View>
            <FlatList
              data={timeSlots[selectedDate] || []}
              keyExtractor={(item) => item.time}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.slotBtn,
                    selectedSlot === item.time && styles.selectedSlotBtn,
                    !item.available && styles.disabledSlotBtn
                  ]}
                  onPress={() => item.available && setSelectedSlot(item.time)}
                  disabled={!item.available}
                >
                  <Text style={[
                    styles.slotText,
                    selectedSlot === item.time && styles.selectedSlotText,
                    !item.available && styles.disabledSlotText
                  ]}>
                    {item.time}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.slotList}
            />
          </View>
        )}

        {/* New Schedule Summary */}
        {selectedDate && selectedSlot && (
          <LinearGradient colors={['#dcfce7', '#ecfdf5']} style={styles.newScheduleCard}>
            <Text style={styles.newScheduleTitle}>New Schedule</Text>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Date:</Text>
              <Text style={styles.scheduleValue}>{new Date(selectedDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Time:</Text>
              <Text style={styles.scheduleValue}>{selectedSlot}</Text>
            </View>
          </LinearGradient>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#7c3aed', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmBtn}
          >
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={handleReschedule}
              disabled={!(selectedDate && selectedSlot)}
            >
              <Text style={styles.confirmText}>Confirm Reschedule</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text style={styles.footerText}>Rescheduling is subject to mentor availability.</Text>
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
  },
  content: { padding: 20 },
  sessionCard: {
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#fed7aa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9a3412',
    marginLeft: 8,
  },
  mentor: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  topic: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  currentLabel: { fontSize: 14, color: '#9a3412', fontWeight: 'bold' },
  currentTime: { fontSize: 14, color: '#9a3412', marginLeft: 8 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  dateList: { marginBottom: 16 },
  dateBtn: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedDateBtn: {
    backgroundColor: '#faf5ff',
    borderColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dateDay: { fontSize: 12, color: '#6b7280' },
  dateNum: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  dateMonth: { fontSize: 12, color: '#6b7280' },
  selectedDateText: { color: '#7c3aed' },
  slotList: { marginBottom: 24 },
  slotBtn: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedSlotBtn: {
    backgroundColor: '#faf5ff',
    borderColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  disabledSlotBtn: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    opacity: 0.5,
  },
  slotText: { fontSize: 14, color: '#111827', textAlign: 'center', fontWeight: '500' },
  selectedSlotText: { color: '#7c3aed', fontWeight: '600' },
  disabledSlotText: { color: '#9ca3af' },
  newScheduleCard: {
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
  },
  newScheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  scheduleValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 50,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 50,
    height: 48,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280',
    marginHorizontal: 24,
    marginBottom: 24,
  },
});

export default RescheduleSessionScreen;
