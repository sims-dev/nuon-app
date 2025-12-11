import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { courseAPI, nccAPI, authAPI } from '../services/api';
import { useSafePress } from '../hooks/useSafePress';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [nccStatus, setNCCStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: authUser, signOut, updateUser } = useContext(AuthContext);

  useEffect(() => {
    const run = async () => {
      try {
        if (authUser) setUser(authUser);
        setLoading(true);

        const [coursesSettled, nccSettled, profileSettled] = await Promise.allSettled([
          courseAPI.getMyCourses().catch(() => ({ data: [] })),
          nccAPI.getNCCStatus().catch(() => ({ data: null })),
          authAPI.getProfile()
        ]);

        if (coursesSettled.status === 'fulfilled') {
          const list = (coursesSettled.value?.data?.courses || coursesSettled.value?.data || []);
          setMyCourses(Array.isArray(list) ? list : []);
        } else {
          setMyCourses([]);
        }

        if (nccSettled.status === 'fulfilled') {
          setNCCStatus(nccSettled.value?.data || null);
        } else {
          setNCCStatus(null);
        }

        if (profileSettled.status === 'fulfilled') {
          const profileData = profileSettled.value?.data?.profile || authUser;
          setUser(profileData);
          // Update auth context if profile data changed
          if (profileData && JSON.stringify(profileData) !== JSON.stringify(authUser)) {
            updateUser(profileData);
          }
        } else if (profileSettled.reason?.response?.status === 401) {
          setUser(null);
        } else {
          setUser(authUser || null);
        }
      } catch (error) {
        console.error('Profile error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [authUser, updateUser]);

  // Force refresh when component mounts to ensure latest data
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try { await signOut(); } catch {}
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Splash' }] })
            );
          },
        },
      ]
    );
  };

  // Safe navigation wrappers to avoid duplicate taps
  const goTo = (route, params) => () => navigation.navigate(route, params);
  const safeGoToProfileSetup = useSafePress(goTo('ProfileSetup'));
  const safeGoToNotifications = useSafePress(goTo('Notifications'));
  const safeGoToNotificationSettings = useSafePress(goTo('NotificationSettings'));
  const safeGoToHelp = useSafePress(goTo('Help'));
  const safeGoToPrivacy = useSafePress(goTo('PrivacyPolicy'));
  // Catalog removed; direct users to MyLearning instead
  const safeGoToMyLearning = useSafePress(goTo('MyLearning'));


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Unable to load profile. Please login again.</Text>
        <TouchableOpacity style={styles.browseButton} onPress={handleLogout}>
          <Text style={styles.browseButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header with contact card, styled per design */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerTopRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'N'}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.userName}>{user?.name || 'Nurse'}</Text>
            <Text style={styles.userRole}>{[user?.specialization, (user?.location || [user?.city, user?.state].filter(Boolean).join(', '))].filter(Boolean).join(' • ')}</Text>
          </View>
        </View>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}><Text style={styles.contactIcon}>📧</Text><Text style={styles.contactText}>{user?.email || '—'}</Text></View>
          <View style={styles.contactRow}><Text style={styles.contactIcon}>📞</Text><Text style={styles.contactText}>{user?.phoneNumber || '—'}</Text></View>
          <View style={styles.contactRow}><Text style={styles.contactIcon}>📍</Text><Text style={styles.contactText}>{user?.location || [user?.city, user?.state].filter(Boolean).join(', ') || '—'}</Text></View>
        </View>
      </LinearGradient>

      {/* NCC Status */}
      {nccStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NCC Progress</Text>
          <View style={styles.nccCard}>
            {nccStatus.isChampion ? (
              <View style={styles.championStatus}>
                <Text style={styles.championText}>🏆 Nightingale Champion</Text>
                <Text style={styles.championSubtext}>Congratulations!</Text>
              </View>
            ) : (
              <View style={styles.progressStatus}>
                <Text style={styles.progressText}>
                  Step {nccStatus.currentStep} of 3
                </Text>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { width: `${((nccStatus.currentStep - 1) / 3) * 100}%` }
                  ]} />
                </View>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => navigation.navigate('NCC')}
                >
                  <Text style={styles.continueButtonText}>Continue NCC</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Stats row (soft tiles) */}
      <View style={styles.section}>
        <View style={styles.statsContainer}>
          <View style={[styles.statTile, { backgroundColor: '#F3E8FF' }]}> 
            <Text style={styles.statNumber}>{myCourses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={[styles.statTile, { backgroundColor: '#EDE9FE' }]}> 
            <Text style={styles.statNumber}>{user?.mentorshipSessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={[styles.statTile, { backgroundColor: '#FFEFD6' }]}> 
            <Text style={styles.statNumber}>{user?.workshopsCount || 0}</Text>
            <Text style={styles.statLabel}>Workshops</Text>
          </View>
        </View>
      </View>

      {/* My Courses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        {myCourses.length > 0 ? (
          myCourses.slice(0, 3).map((course, index) => (
            <View key={index} style={styles.courseItem}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseProgress}>
                {course.progress || 0}% Complete
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No courses enrolled yet</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={safeGoToMyLearning}
            >
              <Text style={styles.browseButtonText}>Go to My Learning</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {myCourses.length > 3 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={safeGoToMyLearning}
          >
            <Text style={styles.viewAllButtonText}>
              View All ({myCourses.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View style={{ height: 8 }} />

      {/* Account Actions */}
      <View style={styles.section}>
        {/* Action list matching reference with emojis */}
        <ActionItem icon="📜" label="Order History" onPress={goTo('Bookings')} />
        <ActionItem icon="🏅" label="Certifications & Awards" onPress={safeGoToMyLearning} />
        <ActionItem icon="🔗" label="Refer & Earn" onPress={safeGoToHelp} />
        <ActionItem icon="🔔" label="Notifications" onPress={safeGoToNotifications} />
        <ActionItem icon="🔒" label="Privacy & Security" onPress={safeGoToPrivacy} />
        <ActionItem icon="❓" label="Help & Support" onPress={safeGoToHelp} />
        <ActionItem icon="📄" label="Terms & Conditions" onPress={safeGoToPrivacy} />
        <LogoutCard onPress={handleLogout} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Neon Club v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const ActionItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionLeft}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Text style={styles.actionArrow}>›</Text>
  </TouchableOpacity>
);

const LogoutCard = ({ onPress }) => (
  <TouchableOpacity style={styles.logoutCard} onPress={onPress}>
    <View style={styles.actionLeft}>
      <Text style={styles.actionIcon}>🚪</Text>
      <Text style={[styles.actionText, { color: '#DC2626' }]}>Logout</Text>
    </View>
    <Text style={[styles.actionArrow, { color: '#DC2626' }]}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: { color: '#E5E7EB', marginTop: 2 },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  orderHistoryPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderHistoryText: { color: '#1F2937', fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  contactIcon: { width: 22, textAlign: 'center', color: '#6B7280', marginRight: 6 },
  contactText: { color: '#1F2937' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  nccCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
  },
  championStatus: {
    alignItems: 'center',
  },
  championText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  championSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  progressStatus: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  courseTitle: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  courseProgress: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 10,
  },
  browseButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingTop: 12,
  },
  viewAllButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statTile: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionIcon: { width: 28, textAlign: 'center', fontSize: 16 },
  actionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  actionArrow: {
    fontSize: 16,
    color: '#64748b',
  },
  logoutCard: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop: 12, paddingVertical: 14, paddingHorizontal: 2, borderWidth: 1, borderColor:'#FEE2E2', backgroundColor:'#FEF2F2', borderRadius: 12 },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  role: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 16,
  },
  detailsContainer: {
    alignItems: 'flex-start',
  },
  details: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ProfileScreen;