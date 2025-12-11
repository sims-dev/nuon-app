import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

// SVG Icons
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const MyLearningScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('courses');

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Patient Care',
      instructor: 'Dr. Sarah Johnson',
      progress: 65,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Medication Management Basics',
      instructor: 'Nurse Priya Singh',
      progress: 100,
      status: 'Completed',
    },
  ];

  const enrolledWellness = [
    {
      id: 1,
      title: 'Stress Management for Healthcare Workers',
      type: 'Mental Wellness',
      progress: 40,
      status: 'Active',
    },
  ];

  const registeredEvents = [
    {
      id: 1,
      title: 'Healthcare Summit 2024',
      date: '2024-10-18',
      status: 'upcoming',
    },
  ];

  const registeredWorkshops = [
    {
      id: 1,
      title: 'Wound Care Management Workshop',
      date: '2024-10-20',
      status: 'upcoming',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#9333EA', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Learning</Text>

        {/* Quick Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <SvgXml xml={bookOpenSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabel}>Courses</Text>
            <Text style={styles.statValue}>{enrolledCourses.length}</Text>
          </View>
          <View style={styles.stat}>
            <SvgXml xml={heartSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabel}>Wellness</Text>
            <Text style={styles.statValue}>{enrolledWellness.length}</Text>
          </View>
          <View style={styles.stat}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabel}>Events</Text>
            <Text style={styles.statValue}>{registeredEvents.length}</Text>
          </View>
          <View style={styles.stat}>
            <SvgXml xml={usersSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabel}>Workshops</Text>
            <Text style={styles.statValue}>{registeredWorkshops.length}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'courses' && styles.tabActive]}
            onPress={() => setActiveTab('courses')}
          >
            <Text style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'wellness' && styles.tabActive]}
            onPress={() => setActiveTab('wellness')}
          >
            <Text style={[styles.tabText, activeTab === 'wellness' && styles.tabTextActive]}>Wellness</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'workshops' && styles.tabActive]}
            onPress={() => setActiveTab('workshops')}
          >
            <Text style={[styles.tabText, activeTab === 'workshops' && styles.tabTextActive]}>Workshops</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>My Courses</Text>
              {enrolledCourses.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => navigation.navigate('CourseViewer', { course: item })}
                >
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>by {item.instructor}</Text>
                  <Text style={styles.itemStatus}>{item.status} - {item.progress}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Wellness Tab */}
          {activeTab === 'wellness' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Wellness Programs</Text>
              {enrolledWellness.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => navigation.navigate('WellnessViewer', { program: item })}
                >
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.type}</Text>
                  <Text style={styles.itemStatus}>{item.status} - {item.progress}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>My Events</Text>
              {registeredEvents.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => navigation.navigate('EventViewer', { event: item })}
                >
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.date}</Text>
                  <Text style={styles.itemStatus}>{item.status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Workshops Tab */}
          {activeTab === 'workshops' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>My Workshops</Text>
              {registeredWorkshops.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => navigation.navigate('WorkshopViewer', { workshop: item })}
                >
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.date}</Text>
                  <Text style={styles.itemStatus}>{item.status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    margin: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default MyLearningScreen;