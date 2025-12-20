import React, { useState, useEffect } from 'react';
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
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api, { courseAPI, nccAPI } from '../services/api';
import { SvgXml } from 'react-native-svg';
import { checkProfileCompletion } from '../utils/profileUtils';

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const trophySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;
const receiptSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h4"/><path d="M16 12h4"/><path d="M16 16h4"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.174 0l-3.58 2.687a.5.5 0 0 1-.81-.47l1.515-8.526"/><circle cx="12" cy="8" r="6"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const share2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
const bellSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
const helpCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`;
const fileTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
const logOutSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`;
const editSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const cameraSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.828 14.828a4 4 0 0 1-5.656 0"/><path d="M9 9a3 3 0 1 1 6 0"/><circle cx="12" cy="12" r="10"/><path d="m21 3-3 3"/><path d="M3 21l3-3"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const certifications = [
  {
    id: 1,
    type: 'degree',
    title: 'B.Sc Nursing',
    institution: 'AIIMS Delhi',
    year: '2020',
    icon: briefcaseSvg,
    gradient: ['#A855F7', '#EC4899'],
    iconColor: '#FFFFFF',
  },
  {
    id: 2,
    type: 'certification',
    title: 'Critical Care Certification',
    institution: 'Indian Nursing Council',
    year: '2022',
    icon: awardSvg,
    gradient: ['#3B82F6', '#1D4ED8'],
    iconColor: '#FFFFFF',
  },
  {
    id: 3,
    type: 'certification',
    title: 'ACLS Certification',
    institution: 'American Heart Association',
    year: '2023',
    icon: awardSvg,
    gradient: ['#10B981', '#059669'],
    iconColor: '#FFFFFF',
  },
];

const awards = [
  {
    id: 1,
    type: 'award',
    title: 'Excellence in Patient Care',
    awardingBody: 'Max Healthcare',
    year: '2021',
    icon: trophySvg,
    gradient: ['#F59E0B', '#D97706'],
    iconColor: '#FFFFFF',
  },
  {
    id: 2,
    type: 'award',
    title: 'Outstanding Nurse Award',
    awardingBody: 'Nursing Excellence Society',
    year: '2022',
    icon: trophySvg,
    gradient: ['#EF4444', '#DC2626'],
    iconColor: '#FFFFFF',
  },
];

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [nccStatus, setNccStatus] = useState(null);
    const [loading, setLoading] = useState(false); // Start with false to show profile immediately
    const { user: authUser, signOut, updateUser } = useContext(AuthContext);

    // Define safeGoToPrivacy if not exists
    navigation.safeGoToPrivacy = navigation.safeGoToPrivacy || ((screen) => navigation.navigate(screen));

   useEffect(() => {
      console.log('[ProfileScreen] useEffect triggered, authUser:', authUser);
      // Set user immediately from context to reduce loading time
      if (authUser) {
        console.log('[ProfileScreen] Setting user from auth context:', authUser);
        setUser(authUser);
      } else {
        console.log('[ProfileScreen] No authUser in context');
      }

      // Fetch additional data in background only if user is available
      const fetchAdditionalData = async () => {
        if (!authUser) return;
        try {
          console.log('[ProfileScreen] Starting fetchAdditionalData');
          const [coursesSettled, nccSettled, profileSettled] = await Promise.allSettled([
            api.get('/courses/my/courses', { timeout: 6000 }).catch(() => ({ data: [] })),
            api.get('/ncc', { timeout: 6000 }).catch(() => ({ data: null })),
            api.get('/profile', { timeout: 6000 })
          ]);

          console.log('[ProfileScreen] API calls settled:', {
            courses: coursesSettled.status,
            ncc: nccSettled.status,
            profile: profileSettled.status
          });

          if (coursesSettled.status === 'fulfilled') {
            const list = (coursesSettled.value?.data?.courses || coursesSettled.value?.data || []);
            setMyCourses(Array.isArray(list) ? list : []);
          } else {
            setMyCourses([]);
          }

          if (nccSettled.status === 'fulfilled') {
            setNccStatus(nccSettled.value?.data || null);
          } else {
            setNccStatus(null);
          }

          if (profileSettled.status === 'fulfilled') {
            console.log('[ProfileScreen] Profile API success:', profileSettled.value?.data);
            const profileData = profileSettled.value?.data?.profile || authUser;
            setUser(profileData);
            // Update auth context if profile data changed
            if (profileData && JSON.stringify(profileData) !== JSON.stringify(authUser)) {
              updateUser(profileData);
            }
          } else {
            console.log('[ProfileScreen] Profile API failed:', profileSettled.reason);
            // Don't set user to null on API failure - keep the authUser if available
            // This prevents showing login prompt when user is actually authenticated
            console.log('[ProfileScreen] Keeping existing user data despite API failure');
          }
        } catch (error) {
          console.error('[ProfileScreen] Profile error:', error);
          setUser(authUser || null);
        }
      };

      fetchAdditionalData();
    }, [authUser, updateUser]);

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



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Don't show login prompt - always show profile UI
  // User data will be loaded from context or API

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: '#f9fafb'}}>
      {/* Profile Header with primary color gradient */}
      <LinearGradient colors={['#9333EA', '#7C3AED', '#4F46E5']} style={styles.profileHeader}>
        <View style={styles.headerRow}>
           <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
             <SvgXml xml={chevronLeftSvg} width={20} height={20} color="#FFFFFF" />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Profile</Text>
           <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')} style={styles.editButton}>
             <SvgXml xml={editSvg} width={16} height={16} color="#FFFFFF" />
             <Text style={styles.editButtonText}>Edit</Text>
           </TouchableOpacity>
        </View>
         <View style={styles.contactCard}>
           <View style={styles.profileCardContent}>
             <View style={styles.avatarContainer}>
               <Image
                 source={{ uri: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }}
                 style={styles.avatarImage}
                 onError={() => {
                   // Fallback to initial
                 }}
               />
               <TouchableOpacity style={styles.avatarEditButton}>
                 <SvgXml xml={editSvg} width={12} height={12} color="#FFFFFF" />
               </TouchableOpacity>
             </View>
             <View style={styles.profileDetails}>
               <Text style={styles.userName}>{user?.name || 'Nurse'}</Text>
               <Text style={styles.userCity}>{[user?.city, user?.state].filter(Boolean).join(', ') || 'City, State'}</Text>
                  </View>
           </View>
           <View style={styles.separator} />
           <View style={styles.contactDetails}>
             <View style={styles.contactRow}><SvgXml xml={mailSvg} width={16} height={16} color="#6B7280" style={styles.contactIconSvg} /><Text style={styles.contactText}>{user?.email || '—'}</Text></View>
             <View style={styles.contactRow}><SvgXml xml={phoneSvg} width={16} height={16} color="#6B7280" style={styles.contactIconSvg} /><Text style={styles.contactText}>{user?.phoneNumber || '—'}</Text></View>
             <View style={styles.contactRow}><SvgXml xml={mapPinSvg} width={16} height={16} color="#6B7280" style={styles.contactIconSvg} /><Text style={styles.contactText}>{user?.location || [user?.city, user?.state].filter(Boolean).join(', ') || '—'}</Text></View>
                </View>
         </View>
      </LinearGradient>

    

      {/* Stats - Modern Cards with Gradients */}
      <View style={styles.statsContainer}>
        <LinearGradient colors={['#F3E8FF', '#E9D5FF']} style={[styles.statTile, styles.coursesCard]}>
          <Text style={[styles.statNumber, { color: '#7C3AED' }]}>{myCourses.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </LinearGradient>
        <LinearGradient colors={['#FCE7F3', '#FBCFE8']} style={[styles.statTile, styles.sessionsCard]}>
          <Text style={[styles.statNumber, { color: '#DB2777' }]}>{user?.mentorshipSessions || 0}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </LinearGradient>
        <LinearGradient colors={['#FFF7ED', '#FED7AA']} style={[styles.statTile, styles.workshopsCard]}>
          <Text style={[styles.statNumber, { color: '#EA580C' }]}>{user?.workshopsCount || 0}</Text>
          <Text style={styles.statLabel}>Workshops</Text>
        </LinearGradient>
      
      </View>

      {/* Divider */}
      <View style={{ height: 8 }} />

      <View style={styles.card}>
        <ActionItem iconSvg={receiptSvg} label="Order History" onPress={() => navigation.navigate('OrderHistory')} iconColor="#2563EB" />
        <ActionItem iconSvg={awardSvg} label="Certifications & Awards" onPress={() => navigation.navigate('Certifications')} iconColor="#A855F7" />
        <ActionItem iconSvg={share2Svg} label="Refer & Earn" onPress={() => navigation.navigate('Referral')} iconColor="#10B981" />
        <ActionItem iconSvg={bellSvg} label="Notifications" onPress={() => navigation.navigate('Notifications')} iconColor="#F9A8D4" />
        <ActionItem iconSvg={lockSvg} label="Privacy & Security" onPress={() => navigation.navigate('PrivacyPolicy')} iconColor="#F97316" />
      </View>

      <View style={styles.card}>
        <ActionItem iconSvg={helpCircleSvg} label="Help & Support" onPress={() => navigation.navigate('Help')} iconColor="#F97316" />
        <ActionItem iconSvg={fileTextSvg} label="Terms & Conditions" onPress={() => navigation.navigate('PrivacyPolicy')} iconColor="#6B7280" />
      </View>

      <View style={styles.card}>
        <LogoutCard onPress={handleLogout} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Neon Club v2.0.0</Text>
      </View>
    </ScrollView>
  );
};

const ActionItem = ({ iconSvg, label, onPress, iconColor }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionLeft}>
      <View style={styles.iconContainer}>
        <SvgXml xml={iconSvg} width={20} height={20} color={iconColor || "#6366F1"} />
      </View>
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Text style={styles.actionArrow}>›</Text>
  </TouchableOpacity>
);

const LogoutCard = ({ onPress }) => (
  <TouchableOpacity style={styles.logoutCard} onPress={onPress}>
    <View style={styles.actionLeft}>
      <SvgXml xml={logOutSvg} width={20} height={20} color="#DC2626" />
      <Text style={[styles.actionText, { color: '#DC2626' }]}>Logout</Text>
    </View>
    <Text style={[styles.actionArrow, { color: '#DC2626' }]}>›</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: 300,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  userCity: { color: '#000000', marginTop: 7 },
  userCompleted: { color: '#000000', marginTop: 4, fontSize: 12 },
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
  contactIconSvg: { marginRight: 6 },
  contactText: { color: '#1F2937' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
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
    marginTop: 8,
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
    paddingHorizontal: 14,
    marginBottom: 27,
  },
  statTile: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 8,
    height: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0,
  },
  coursesCard: {
    flex: 1,
  },
  sessionsCard: {
    flex: 1,
  },
  workshopsCard: {
    flex: 1,
  },
  certificationsCard: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  purpleText: {
    color: '#7C3AED',
  },
  pinkText: {
    color: '#DB2777',
  },
  orangeText: {
    color: '#EA580C',
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
    paddingVertical:14,
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
  logoutCard: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  orderHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  orderHistoryButtonText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  contactDetails: {
    // No specific styles, uses existing contactRow
  },
  iconContainer: {
    // Default, no background
  },
  iconContainerLight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  orderHistoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginTop: 8,
  },
  orderHistoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderHistoryCardText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  profileIncompleteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FED7AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  bannerButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProfileScreen;