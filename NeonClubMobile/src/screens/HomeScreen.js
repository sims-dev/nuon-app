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
import api, { activitiesAPI, newsAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import QuickActionCard from '../components/QuickActionCard';
import { palette, typography, shadow } from '../theme/tokens';
import { NEON_COLORS } from '../utils/colors';
import GradientCard from '../components/GradientCard';
import LinearGradient from 'react-native-linear-gradient';
import CalendarIcon from '../components/CalendarIcon';
import PlayIcon from '../components/PlayIcon';
import { SvgXml } from 'react-native-svg';
import BookOpenSvg from '../assets/icons/book-open.svg';
import SparklesIcon from '../components/SparklesIcon';
import UsersIcon from '../components/UsersIcon';
import UserIcon from '../components/UserIcon';
import { IP_ADDRESS } from '../config/ipConfig';

const bellSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const arrowRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

// CalendarIcon and PlayIcon are provided by wrapper components in src/components

const HomeScreen = ({ navigation }) => {
    const [courses, setCourses] = useState([]); // State for courses

    // Navigation wrapper
    const goToProfile = () => navigation.navigate('Profile');
   // Preseed with demo so UI is never blank; replaced when API returns
   const [news, setNews] = useState([
     {
       _id: 'demo1',
       title: 'New Healthcare Guidelines 2024',
       category: 'Guidelines',
       type: 'video',
       thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1080&auto=format&fit=crop',
       publishedAt: '2024-10-15',
       videos: [{ url: '', thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1080&auto=format&fit=crop' }]
     },
     {
       _id: 'demo2',
       title: 'Breakthrough in Nursing Education',
       category: 'Education',
       thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1080&auto=format&fit=crop',
       publishedAt: '2024-10-12'
     },
     {
       _id: 'demo3',
       title: 'Champion Mentors Success Stories',
       category: 'Stories',
       thumbnail: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1080&auto=format&fit=crop',
       publishedAt: '2024-10-08'
     }
   ]);
   const [activities, setActivities] = useState([]); // merged events/workshops
   const [featuredCourses, setFeaturedCourses] = useState([]);
   const [eventsCount, setEventsCount] = useState(0);
   const [workshopsCount, setWorkshopsCount] = useState(0);
   const [publicCoursesCount, setPublicCoursesCount] = useState(0);
   const [featuredNews, setFeaturedNews] = useState([]);
   // Catalog removed from dashboard
   const { user: user, signOut } = useContext(AuthContext);

  // helper to (re)load activities/courses/news
  const fetchAdditionalData = async () => {
      try {
        const [coursesResponse, myEventsRes, myWorkshopsRes, latestRes, featuredRes] = await Promise.all([
          api.get('/courses/my/courses'),
          api.get('/events/my/events').catch(() => ({ data: [] })),
          api.get('/workshops/my/workshops').catch(() => ({ data: [] })),
          newsAPI.getLatest(),
          newsAPI.getFeatured(),
        ]);

        const myCourses = coursesResponse?.data?.courses || coursesResponse?.data || [];
        setCourses(Array.isArray(myCourses) ? myCourses : []);
        setPublicCoursesCount(Array.isArray(myCourses) ? myCourses.length : 0);

        const myEvents = myEventsRes?.data?.events || myEventsRes?.data || [];
        setEventsCount(Array.isArray(myEvents) ? myEvents.length : 0);

        const myWorkshops = myWorkshopsRes?.data?.workshops || myWorkshopsRes?.data || [];
        setWorkshopsCount(Array.isArray(myWorkshops) ? myWorkshops.length : 0);

        // NEWS API INTEGRATION - Ready for backend
        // API Endpoint: GET /news
        // Expected Response: { data: [{ _id, title, category, type, imageUrl, thumbnail, videos, publishedAt, createdAt }] }
        let latest = latestRes?.data || [];
        if (!Array.isArray(latest)) latest = [];
        // Replace demo data with real API data when available
        if (latest.length > 0) {
          setNews(latest);
        }
        // If API returns empty, demo data is preserved for UI testing

        // FEATURED NEWS API - Ready for backend
        setFeaturedNews(Array.isArray(featuredRes?.data) ? featuredRes.data : []);
        // Fetch public events & workshops and merge as "New Activities"
        try {
          const [eventsRes, workshopsRes, publicCoursesRes] = await Promise.all([
            api.get('/events'),
            api.get('/workshops'),
            api.get('/courses').catch(() => ({ data: [] })),
          ]);
          const rawEvents = eventsRes?.data?.events || eventsRes?.data || [];
          const rawWorkshops = workshopsRes?.data?.workshops || workshopsRes?.data || [];
          const rawCourses = publicCoursesRes?.data?.courses || publicCoursesRes?.data || [];
          setFeaturedCourses(Array.isArray(rawCourses) ? rawCourses.slice(0, 8) : []);

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
          const merged = [...coursesNew, ...events, ...workshops]
            .filter(Boolean)
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 2);
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
    if (user) { // Wait for user to be loaded
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
    }
  }, [user]); // Depend on user

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


  return (
    <ScrollView style={styles.container}>
      {/* Header with Blue to Purple Gradient - Matching Figma */}
      <LinearGradient 
        colors={['#2563EB', '#7C3AED', '#9333EA']} 
        start={{x:0,y:0}} 
        end={{x:1,y:1}} 
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.profileSection}
            onPress={goToProfile}
          >
            <View style={styles.profilePhotoContainer}>
              {user?.profilePhoto ? (
                <Image source={{ uri: user.profilePhoto }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  {user?.name ? (
                    <Text style={styles.profilePhotoText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  ) : (
                    <UserIcon width={24} height={24} color="#FFFFFF" />
                  )}
                </View>
              )}
            </View>
            <View>
              <Text style={styles.greetingTextWhite}>Hello Nurse {user?.name?.split(' ')[0] || ''} 👋</Text>
              <Text style={styles.welcomeMessageWhite}>Welcome back, {user?.name || 'Nurse'}!</Text>
              {user?.profileIncomplete && (
                <Text style={styles.tapToComplete}></Text>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.notificationButtonWhite}
            onPress={() => navigation.navigate('Notifications')}
          >
            <SvgXml xml={bellSvg} width={20} height={20} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats with Glass Morphism - Matching Figma */}
        <View style={styles.statsContainerGlass}>
          <View style={styles.statCardGlass}>
            <SvgXml xml={bookOpenSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Courses</Text>
            <Text style={styles.statNumberWhite}>{publicCoursesCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Events</Text>
            <Text style={styles.statNumberWhite}>{eventsCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={usersSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Workshops</Text>
            <Text style={styles.statNumberWhite}>{workshopsCount}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Profile Incomplete Banner - Matching Figma */}
        {user?.profileIncomplete && (
          <View style={styles.profileIncompleteBannerNew}>
            <View style={styles.profileIconCircle}>
              <UserIcon width={20} height={20} color="#F97316" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.bannerTitleNew}>Complete Your Profile</Text>
              <Text style={styles.bannerSubtitleNew}>
                Add professional details to unlock personalized features
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bannerButtonNew}
              onPress={() => navigation.navigate('ProfileSetup')}
            >
              <Text style={styles.bannerButtonTextNew}>Complete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* My Learning Card - Matching Figma */}
        <TouchableOpacity
          style={styles.myLearningCard}
          onPress={() => navigation.navigate('MyLearning')}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6', '#EC4899']}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            style={styles.myLearningGradient}
          >
            <View style={styles.myLearningIconContainer}>
              <BookOpenSvg width={24} height={24} fill="none" stroke="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.myLearningTitle}>My Learning</Text>
              <Text style={styles.myLearningSubtitle}>
                Continue your courses, events & workshops
              </Text>
            </View>
            <SvgXml xml={chevronRightSvg} width={24} height={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

      {/* Latest News (immediately after My Learning) */}
      {news.length > 0 && (
      <View style={styles.newsSection}>
        <View style={styles.rowBetween}>
          <Text style={styles.newsSectionTitle}>Latest News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewsList')}>
            <Text style={styles.newsLinkText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24, paddingLeft: 0 }}>
          {news.map((item, index) => (
            <TouchableOpacity key={index} style={styles.newsCardFigma} activeOpacity={0.9} onPress={() => {
              if (item.externalUrl) {
                try { Linking.openURL(item.externalUrl); } catch {}
              } else if (item.videos && item.videos.length > 0) {
                navigation.navigate('VideoPlayer', {
                  videoUrl: item.videos[0].url,
                  title: item.title,
                  newsId: item._id
                });
              } else {
                navigation.navigate('NewsViewer', { item });
              }
            }}>
              <View style={styles.newsImageContainer}>
                {(item.imageUrl || item.thumbnail || (item.videos && item.videos[0]?.thumbnail)) ? (
                  <Image source={{ uri: item.imageUrl || item.thumbnail || item.videos[0]?.thumbnail }} style={styles.newsImageFigma} />
                ) : null}
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.newsGradientOverlay} />
                
                {/* Video indicator - top right */}
                {((item.type||'').toLowerCase()==='video' || item.externalUrl || (item.videos && item.videos.length > 0)) && (
                  <View style={styles.videoIndicator}>
                    <SvgXml xml={playSvg} width={10} height={10} color="#9333EA" />
                  </View>
                )}
                
                {/* Category badge and title - bottom overlay */}
                <View style={styles.newsContentOverlay}>
                  <View style={styles.newsCategoryBadge}>
                    <Text style={styles.newsCategoryText}>{item.category || item.type || 'Guidelines'}</Text>
                  </View>
                  <Text style={styles.newsTitleFigma} numberOfLines={2}>{item.title}</Text>
                </View>
              </View>
              
              {/* Date below image */}
              <View style={styles.newsDateContainer}>
                <Text style={styles.newsDateText}>📅 {new Date(item.publishedAt || item.createdAt || Date.now()).toLocaleString('en-US',{ month:'short', day:'numeric' })}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      )}

      {/* Nightingale Programme card */}
      <GradientCard
          title="Nightingale Programme"
          subtitle="Become a Champion Mentor"
          description="and light the way"
          colors={[NEON_COLORS.neonPink, NEON_COLORS.neonOrange || '#F59E0B']}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          ctaLabel="Begin Journey"
          ctaColor="#7C3AED"
          onPress={() => navigation.navigate('NCC')}
          height={160}
          iconComponent={<SparklesIcon width={32} height={32} color="#FDE047" />}
        />

      {/* Mentor card */}
      <View style={{ marginTop: 24 }}>
        <GradientCard
          title="Want to Become a Mentor?"
          subtitle="Share your expertise with fellow nurses"
          colors={[NEON_COLORS.neonCyan, NEON_COLORS.neonGreen]}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          ctaLabel="Apply Now"
          ctaColor="#06B6D4"
          onPress={() => navigation.navigate('MentorRegister')}
          height={160}
          iconComponent={<UserIcon width={32} height={32} color="#fff" />}
        />
      </View>

      </View>
      {/* End contentContainer */}

      {/* Wellness & Events list */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>New Activities</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyLearning')}>
            <Text style={styles.linkText}>See All</Text>
          </TouchableOpacity>
        </View>
        {activities.map((item, idx) => {
          const d = new Date(item.date || Date.now());
          const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const day = String(d.getDate()).padStart(2, '0');
          const type = item.kind || 'Event';
          const thumbnail = item.payload?.thumbnail || item.payload?.image;
          const imgUri = thumbnail ? (thumbnail.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${thumbnail}` : thumbnail) : null;
          return (
            <TouchableOpacity
              key={`${item.kind}-${item.id || idx}`}
              activeOpacity={0.8}
              style={styles.activityCard}
              onPress={() => {
                try { activitiesAPI.create({ type:'activity-tap', title: item.title, ref: item.id, meta: { kind: item.kind } }); } catch {}
                navigation.navigate('MyLearning', { initialTab: item.kind.toLowerCase() + 's' });
              }}
            >
              {imgUri ? (
                <Image source={{ uri: imgUri }} style={styles.activityThumbnail} />
              ) : (
                <View style={styles.activityThumbnailPlaceholder} />
              )}
              <View style={styles.datePill}>
                <Text style={styles.dateMonth}>{month}</Text>
                <Text style={styles.dateDay}>{day}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}><Text style={styles.badgeText}>{type}</Text></View>
                <Text style={styles.activityTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.activitySub}>Open Activities to explore</Text>
              </View>
              <SvgXml xml={chevronRightSvg} width={18} height={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: '#F9FAFB',
  },
  // NEW: Header Gradient (Blue to Purple - Matching Figma)
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePhotoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  greetingTextWhite: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  welcomeMessageWhite: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 2,
  },
  tapToComplete: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  notificationButtonWhite: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIconWhite: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  // NEW: Glass Morphism Stats Cards - Simplified (Figma Match)
  statsContainerGlass: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardGlass: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statIconWhite: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabelWhite: {
    fontSize: 10,
    color: 'rgba(191,219,254,1)',
    marginBottom: 2,
  },
  statNumberWhite: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // NEW: Content Container
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  // NEW: Profile Incomplete Banner (Figma Style)
  profileIncompleteBannerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FED7AA',
    ...shadow.soft,
  },
  bannerTitleNew: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  bannerSubtitleNew: {
    fontSize: 12,
    color: '#64748B',
  },
  bannerButtonNew: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
  },
  bannerButtonTextNew: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  profileIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // NEW: My Learning Card (Figma Style)
  myLearningCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadow.soft,
  },
  myLearningGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  myLearningIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  myLearningIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  myLearningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  myLearningSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  chevronWhite: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  // EXISTING: All original styles preserved below
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
    color: '#111827',
    marginBottom: 15,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  // NEW: Figma-style Latest News
  newsSection: {
    marginBottom: 24,
    marginTop: 24,
  },
  newsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  newsLinkText: {
    color: '#9333EA',
    fontWeight: '600',
    fontSize: 14,
  },
  newsCardFigma: {
    width: 192,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImageContainer: {
    height: 112,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  newsImageFigma: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  newsGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayIconText: {
    color: '#9333EA',
    fontSize: 10,
    marginLeft: 2,
  },
  newsContentOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  newsCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  newsCategoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  newsTitleFigma: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  newsDateContainer: {
    padding: 8,
  },
  newsDateText: {
    fontSize: 11,
    color: '#6B7280',
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
  activityThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  activityThumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
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
