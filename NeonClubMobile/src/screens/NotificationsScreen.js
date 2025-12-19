import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { NEON_COLORS } from '../utils/colors';

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const bellSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
const settingsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.174 0l-3.58 2.687a.5.5 0 0 1-.81-.47l1.515-8.526"/><circle cx="12" cy="8" r="6"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

const NotificationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    sessions: true,
    achievements: true,
    courses: true,
    tasks: true,
    announcements: true,
    email: false,
  });

  const notifications = [
    {
      id: 1,
      type: 'session',
      icon: usersSvg,
      iconBg: '#F3E8FF',
      iconColor: '#A855F7',
      title: 'Upcoming Session Reminder',
      message: 'Your mentorship session with Dr. Anjali Reddy starts in 1 hour',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 2,
      type: 'achievement',
      icon: awardSvg,
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
      title: 'New Badge Earned! 🎉',
      message: 'Congratulations! You earned the "Week Warrior" badge',
      time: '3 hours ago',
      unread: true,
    },
    {
      id: 3,
      type: 'course',
      icon: bookOpenSvg,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
      title: 'New Course Available',
      message: 'Check out "Advanced Medication Management" - Perfect for you!',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 4,
      type: 'task',
      icon: checkCircleSvg,
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      title: 'Task Reminder',
      message: 'Don\'t forget to submit your case study assignment by tomorrow',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 5,
      type: 'course',
      icon: bookOpenSvg,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
      title: 'Course Progress',
      message: 'You\'re 65% through Patient Care Basics. Keep it up!',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 6,
      type: 'session',
      icon: usersSvg,
      iconBg: '#F3E8FF',
      iconColor: '#A855F7',
      title: 'Session Completed',
      message: 'Great session with Nurse Priya Singh! Don\'t forget to rate',
      time: '3 days ago',
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter(n => n.unread);
  const readNotifications = notifications.filter(n => !n.unread);

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications.slice(0, 3);
      default:
        return notifications;
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read if unread
    if (notification.unread) {
      // In real app, update backend
      Alert.alert('Notification', notification.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.settingsButton}>
            <SvgXml xml={settingsSvg} width={24} height={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Notification Preferences</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Session Reminders</Text>
                <Text style={styles.settingDescription}>Get notified about upcoming sessions</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.sessions && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, sessions: !prev.sessions }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.sessions && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Achievement Alerts</Text>
                <Text style={styles.settingDescription}>Celebrate your milestones and badges</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.achievements && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, achievements: !prev.achievements }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.achievements && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Course Updates</Text>
                <Text style={styles.settingDescription}>New courses and recommendations</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.courses && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, courses: !prev.courses }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.courses && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Task Reminders</Text>
                <Text style={styles.settingDescription}>Assignment and deadline alerts</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.tasks && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, tasks: !prev.tasks }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.tasks && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Announcements</Text>
                <Text style={styles.settingDescription}>Important updates and news</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.announcements && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, announcements: !prev.announcements }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.announcements && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications via email</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, notificationSettings.email && styles.toggleActive]}
                onPress={() => setNotificationSettings(prev => ({ ...prev, email: !prev.email }))}
              >
                <View style={[styles.toggleKnob, notificationSettings.email && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread ({unreadNotifications.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsContainer}>
        {getFilteredNotifications().map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationCard, notification.unread && styles.unreadCard]}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.notificationHeader}>
              <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
                <SvgXml xml={notification.icon} width={20} height={20} color={notification.iconColor} />
              </View>
              <View style={styles.notificationInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  {notification.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {getFilteredNotifications().length === 0 && (
          <View style={styles.emptyState}>
            <SvgXml xml={bellSvg} width={48} height={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyMessage}>You have no {activeTab === 'unread' ? 'unread' : ''} notifications</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 2,
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsList: {
    // No gap, using separators
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#A855F7',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
  },
  notificationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7',
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A855F7',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default NotificationsScreen;
