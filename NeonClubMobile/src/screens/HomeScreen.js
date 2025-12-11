import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { activitiesAPI, newsAPI, courseAPI, eventAPI, workshopAPI, mentorAPI, notificationsAPI, newsAPI as mainNewsAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import QuickActionCard from '../components/QuickActionCard';
import { palette, typography, shadow } from '../theme/tokens';
import { NEON_COLORS } from '../utils/colors';
import GradientCard from '../components/GradientCard';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import EngageScreen from './EngageScreen';

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 4h18M3 10h18M8 4v2M16 4v2M3 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
  </Svg>
);

const PlayIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 3l14 9-14 9V3z" />
  </Svg>
);

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]); // State for courses
  // Preseed with demo so UI is never blank; replaced when API returns
  const [news, setNews] = useState([]);
  const [activities, setActivities] = useState([]); // merged events/workshops
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [featuredNews, setFeaturedNews] = useState([]);
  // Catalog removed from dashboard
  const { user: authUser, signOut } = useContext(AuthContext);

  useEffect(() => {
    if (authUser) setUser(authUser);
  }, [authUser]);

  // helper to (re)load activities/courses/news
  const fetchAdditionalData = async () => {
      try {
        const [coursesResponse, latestRes, featuredRes] = await Promise.all([
          courseAPI.getMyCourses(),
          newsAPI.getLatest(),
          newsAPI.getFeatured(),
        ]);

        const my = coursesResponse?.data?.courses || coursesResponse?.data || [];
        setCourses(Array.isArray(my) ? my : []);
        let latest = latestRes?.data || [];
        if (!Array.isArray(latest)) latest = [];
        setNews(latest);
        setFeaturedNews(Array.isArray(featuredRes?.data) ? featuredRes.data : []);
        // Fetch public events & workshops and merge as "New Activities"
        try {
          const [eventsRes, workshopsRes, publicCoursesRes] = await Promise.all([
            eventAPI.getEvents(),
            workshopAPI.getWorkshops(),
            courseAPI.getCourses().catch(() => ({ data: [] })),
          ]);
          const rawEvents = eventsRes?.data?.events || eventsRes?.data || [];
          const rawWorkshops = workshopsRes?.data?.workshops || workshopsRes?.data || [];
          const rawCourses = publicCoursesRes?.data?.courses || publicCoursesRes?.data || [];
          setFeaturedCourses(Array.isArray(rawCourses) ? rawCourses.slice(0, 8) : []);
          setEventsCount(Array.isArray(rawEvents) ? rawEvents.length : 0);
          setWorkshopsCount(Array.isArray(rawWorkshops) ? rawWorkshops.length : 0);

          const events = (rawEvents || []).map((e) => ({
            id: e._id,
            title: e.title,
            date: e.date || e.startsAt,
            kind: 'Event',
            payload: e,
          }));
          const workshops = (rawWorkshops || []).map((w) => ({
            id: w._id,
            title: w.title,
            date: w.createdAt || w.startsAt,
            kind: 'Workshop',
            payload: w,
          }));
          const coursesNew = (rawCourses || []).map((c) => ({
            id: c._id,
            title: c.title,
            date: c.createdAt || c.publishedAt,
            kind: 'Course',
            payload: c,
          }));
          const merged = [...events, ...workshops, ...coursesNew]
            .filter(Boolean)
            .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
            .slice(0, 5);
          setActivities(merged);
        } catch (e) {
          console.log('Activities fetch failed', e?.message || e);
          try { activitiesAPI.create({ type:'error', title:'home-activities-fetch-failed', meta:{ message: String(e?.message||e) } }); } catch {}
        }
      } catch (error) {
        console.error('Error fetching additional data:', error);
        try { activitiesAPI.create({ type:'error', title:'home-fetch-failed', meta:{ message: String(error?.message||error) } }); } catch {}
      }
    };

  // Initial load + socket wiring for real-time updates
  useEffect(() => {
    fetchAdditionalData();
    const sock = connectSocket();
    const off1 = onSocket('new_event', fetchAdditionalData);
    const off2 = onSocket('event_update', fetchAdditionalData);
    const off3 = onSocket('new_workshop', fetchAdditionalData);
    const off4 = onSocket('workshop_update', fetchAdditionalData);
    const off5 = onSocket('new_course', fetchAdditionalData);
    const off6 = onSocket('course_update', fetchAdditionalData);
    const off7 = onSocket('new_news', fetchAdditionalData);
    const off8 = onSocket('news_update', fetchAdditionalData);
    return () => {
      try { off1 && off1(); off2 && off2(); off3 && off3(); off4 && off4(); off5 && off5(); off6 && off6(); off7 && off7(); off8 && off8(); } catch {}
      disconnectSocket();
    };
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
            // Let AppNavigator switch to unauth flow; send to splash for a clean reset
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Splash' }] })
            );
          },
        },
      ]
    );
  };

  // Quick actions (NCC removed as requested)
  const quickActions = [
    {
      title: 'Assessments',
      subtitle: 'Take assessments',
      onPress: () => navigation.navigate('Assessment'),
      color: NEON_COLORS.neonPurple,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome banner with profile and notification icons */}
      <LinearGradient colors={[NEON_COLORS.neonPurple, NEON_COLORS.neonBlue]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.welcomeBanner}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 32, color: '#fff' }}>👤</Text>
            </TouchableOpacity>
            <Text style={[styles.welcomeHeading]} numberOfLines={1} ellipsizeMode="tail">Hello{user?.name ? ` Nurse ${user.name}` : ''} <Text style={{ fontSize: 20 }}>👋</Text></Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={{ fontSize: 28, color: '#fff' }}>🔔</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeSub}>Continue your courses, events & workshops</Text>
      </LinearGradient>


      {/* Top 'My Learning' gradient pill */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <GradientCard
          title="My Learning"
          subtitle="Continue your courses, events & workshops"
          colors={[NEON_COLORS.neonBlue, NEON_COLORS.neonPurple]}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          chevron
          onPress={() => navigation.navigate('MyLearning')}
          height={100}
        />
      </View>

      {/* Latest News (immediately after My Learning) */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewsList')}>
            <Text style={styles.linkText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12, paddingLeft: 6 }}>
          {news.map((item, index) => (
            <TouchableOpacity key={index} style={styles.newsCardH} activeOpacity={0.9} onPress={() => {
              if (item.externalUrl) {
                try { Linking.openURL(item.externalUrl); } catch {}
              } else if (item.videos && item.videos.length > 0) {
                // Navigate to video player for news with videos
                navigation.navigate('VideoPlayer', {
                  videoUrl: item.videos[0].url,
                  title: item.title,
                  newsId: item._id
                });
              } else {
                navigation.navigate('NewsViewer', { item });
              }
            }}>
              <View style={styles.newsImagePlaceholder}>
                {(item.imageUrl || item.thumbnail || (item.videos && item.videos[0]?.thumbnail)) ? (
                  <Image source={{ uri: item.imageUrl || item.thumbnail || item.videos[0]?.thumbnail }} style={styles.newsImage} />
                ) : null}
                {/* gradient overlay */}
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.newsGradient} />
                {/* category badge */}
                <View style={styles.newsBadgeWrap}><View style={styles.newsBadge}><Text style={styles.newsBadgeText}>{item.category || (item.type || 'Guidelines')}</Text></View></View>
                {/* video indicator */}
                {(item.type||'').toLowerCase()==='video' || item.externalUrl || (item.videos && item.videos.length > 0) ? <View style={styles.videoBadge}><Text style={{ color:'#9333EA' }}>▶</Text></View> : null}
                {/* bottom overlay content */}
                <View style={styles.newsOverlayBottom}>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.newsDate}><CalendarIcon /> {new Date(item.publishedAt || item.createdAt || Date.now()).toLocaleString('en-US',{ month:'short', day:'2-digit' })}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Nightingale Programme card */}
      {/* Featured Courses section removed as per requirements */}

      {/* Nightingale Programme card */}
      <View style={{ paddingHorizontal: 20 }}>
        <GradientCard
          title="Nightingale Programme"
          subtitle="Become a Champion Mentor and light the way"
          colors={[NEON_COLORS.neonPink, NEON_COLORS.neonOrange || '#F59E0B']}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          ctaLabel="Begin Journey"
          onPress={() => navigation.navigate('NCC')}
          height={140}
          stacked
        />
      </View>

      {/* Mentor card */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <GradientCard
          title="Want to Become a Mentor?"
          subtitle="Share your expertise with fellow nurses"
          colors={[NEON_COLORS.neonCyan, NEON_COLORS.neonGreen]}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          ctaLabel="Apply Now"
          onPress={() => navigation.navigate('MentorRegister')}
          height={140}
          stacked
        />
      </View>

      {/* New Activities list - small cards that route to Activities page */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>New Activities</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Learning')}>
            <Text style={styles.linkText}>See All</Text>
          </TouchableOpacity>
        </View>
        {activities.map((item, idx) => {
          const d = new Date(item.date || Date.now());
          const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const day = String(d.getDate()).padStart(2, '0');
          const type = item.kind || 'Event';
          return (
            <TouchableOpacity
              key={item.id || idx}
              activeOpacity={0.8}
              style={styles.activityCard}
              onPress={() => {
                try { activitiesAPI.create({ type:'activity-tap', title: item.title, ref: item.id, meta: { kind: item.kind } }); } catch {}
                navigation.navigate('Learning');
              }}
            >
              <View style={styles.datePill}>
                <Text style={styles.dateMonth}>{month}</Text>
                <Text style={styles.dateDay}>{day}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}><Text style={styles.badgeText}>{type}</Text></View>
                <Text style={styles.activityTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.activitySub}>Open Activities to explore</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Engage Section */}
      <View>
        <EngageScreen />
      </View>

      {/* Quick Actions at the end */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((item, index) => (
          <QuickActionCard
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            color={item.color}
            onPress={item.onPress}
          />
        ))}
      </View>

      {/* Catalog section intentionally removed from dashboard */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeBanner: {
    paddingTop: 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeHeading: { color: '#fff', fontSize: 20, fontWeight: '800' },
  welcomeSub: { color: '#E5E7EB', marginTop: 6 },
  bellBtn: { padding: 6, backgroundColor:'rgba(255,255,255,0.15)', borderRadius: 999 },
  bellIcon: { fontSize: 16, color:'#fff' },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  headerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerStatBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 90,
  },
  headerStatLabel: { color: '#F3F4F6', fontSize: 12 },
  headerStatNum: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: palette.surface,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    // QuickActionCard handles its own styles
    shadowColor: '#FF073A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseCardH: { width: 220, marginRight: 12 },
  courseThumb: { height: 120, borderRadius: 12, overflow:'hidden', backgroundColor:'#E5E7EB' },
  courseThumbImg: { width:'100%', height:'100%' },
  courseGrad: { position:'absolute', left:0, right:0, top:0, bottom:0 },
  courseBadge: { position:'absolute', top:8, left:8, backgroundColor:'rgba(255,255,255,0.9)', paddingHorizontal:8, paddingVertical:4, borderRadius:999 },
  courseBadgeText: { fontSize:12, fontWeight:'700', color:'#4F46E5' },
  courseOverlay: { position:'absolute', bottom:8, left:8, right:8 },
  courseTitleH: { color:'#fff', fontWeight:'800' },
  // removed old stats + banner; replaced by gradient header and gradient card
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NEON_COLORS.neonPurple,
    marginBottom: 15,
  },
  section: {
    padding: 20,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { color: NEON_COLORS.neonPurple, fontWeight: '600' },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: palette.border,
  },
  datePill: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    marginRight: 12,
  },
  dateMonth: { fontSize: 12, color: '#6B7280' },
  dateDay: { fontSize: 16, fontWeight: '700', color: '#111827' },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: { fontSize: 11, color: '#111827' },
  activityTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  activitySub: { color: '#6B7280', marginTop: 2, fontSize: 12 },
  chev: { color: '#9CA3AF', fontSize: 18, paddingHorizontal: 8 },
  // Unified Activities card (same layout as Activities screen)
  actCard: { backgroundColor:'#fff', borderRadius:16, padding:12, marginBottom:12, ...shadow.soft, borderWidth:1, borderColor: palette.border },
  actHero: { height:160, backgroundColor:'#E5E7EB', borderRadius:12, overflow:'hidden', marginBottom:10 },
  actHeroImg: { position:'absolute', left:0, right:0, top:0, bottom:0, width:'100%', height:'100%' },
  actHeroOverlay: { position:'absolute', left:0, right:0, top:0, bottom:0 },
  actChip: { alignSelf:'flex-start', paddingHorizontal:8, paddingVertical:4, borderRadius:10 },
  actChipText: { color:'#fff', fontWeight:'700', fontSize:12 },
  // My Learning card (image + content)
  learningCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: palette.border,
  },
  learningImagePlaceholder: {
    height: 120,
    backgroundColor: '#11182720',
  },
  learningContent: {
    padding: 16,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFg: {
    height: 6,
    borderRadius: 6,
    backgroundColor: NEON_COLORS.neonPink,
  },
  learningFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // News card style
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: palette.border,
  },
  newsCardH: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: palette.border,
    width: 192,
    marginRight: 12,
  },
  featuredCard: { width: 280, height: 140, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.35)' },
  featuredTextWrap: { position: 'absolute', left: 12, right: 12, bottom: 10 },
  featuredBadge: { alignSelf:'flex-start', backgroundColor:'#111827', color:'#fff', paddingHorizontal:8, paddingVertical:4, borderRadius:999, fontSize:12, marginBottom:6 },
  featuredTitle: { color:'#fff', fontWeight:'700', fontSize:16 },
  newsImagePlaceholder: {
    height: 112,
    backgroundColor: '#0F172A20',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position:'relative'
  },
  newsImage: { position:'absolute', left:0, right:0, top:0, bottom:0, width:'100%', height:'100%' },
  newsGradient: { position:'absolute', left:0, right:0, top:0, bottom:0 },
  newsBadgeWrap: { position:'absolute', left:8, top:8 },
  newsContent: { padding: 12 },
  newsBadge: { backgroundColor:'rgba(255,255,255,0.2)', borderWidth:1, borderColor:'rgba(255,255,255,0.3)', paddingHorizontal:10, paddingVertical:4, borderRadius:999 },
  newsBadgeText: { color: '#fff', fontSize: 12, fontWeight:'700' },
  newsOverlayBottom: { position:'absolute', left:8, right:8, bottom:8 },
  newsTitle: { color: '#fff', fontWeight: '700', fontSize: 13 },
  newsDate: { color: '#D1D5DB', marginTop: 6, fontSize: 11 },
  videoBadge: { position:'absolute', right:8, top:8, backgroundColor:'rgba(255,255,255,0.9)', width:24, height:24, borderRadius:12, alignItems:'center', justifyContent:'center' },
  videoPlayIcon: { position:'absolute', top:'50%', left:'50%', marginLeft:-15, marginTop:-15, width:30, height:30, borderRadius:15, backgroundColor:'rgba(0,0,0,0.7)', alignItems:'center', justifyContent:'center' },
  videoPlayText: { color:'#fff', fontSize:16 },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Catalog-specific styles removed
});

export default HomeScreen;