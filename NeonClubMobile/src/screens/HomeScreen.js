import React, { useState, useEffect, useMemo } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api, { activitiesAPI, newsAPI, dashboardAPI, engageAPI, conferenceAPI, assessmentAPI, mentorAPI, getCurrentBaseURL, getFullMediaUrl } from '../services/api';
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
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const BASE_URL = getCurrentBaseURL().replace('/api', '');
const getFullUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http')) return path.replace('localhost', IP_ADDRESS);
  if (path.startsWith('/uploads') || path.startsWith('uploads')) return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  return path;
};

const bellSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const arrowRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

// CalendarIcon and PlayIcon are provided by wrapper components in src/components

const HomeScreen = ({ navigation }) => {
    const [courses, setCourses] = useState([]); // State for courses

    // Mock courses for offline mode
    const mockCourses = [
      {
        _id: 'course1',
        title: 'Advanced Nursing Care',
        description: 'Comprehensive course on advanced nursing techniques',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080&auto=format&fit=crop',
        duration: '4 weeks',
        price: 0,
        isFree: true
      },
      {
        _id: 'course2',
        title: 'Patient Care Fundamentals',
        description: 'Essential skills for patient care',
        thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1080&auto=format&fit=crop',
        duration: '2 weeks',
        price: 0,
        isFree: true
      }
    ];

    // Mock news for demo scrolling
    const mockNews = [
      {
        _id: 'news1',
        title: 'New Healthcare Guidelines 2024',
        category: 'Guidelines',
        publishedAt: '2024-10-15T00:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbmV3cyUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        type: 'article',
      },
      {
        _id: 'news2',
        title: 'Breakthrough in Nursing Education',
        category: 'Education',
        publishedAt: '2024-10-12T00:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uZmVyZW5jZSUyMHVwZGF0ZXxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        type: 'article',
      },
      {
        _id: 'news3',
        title: 'Champion Mentors Success Stories',
        category: 'Stories',
        publishedAt: '2024-10-08T00:00:00Z',
        videos: [{ url: 'https://example.com/video.mp4', thumbnail: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwYWNoaWV2ZW1lbnQlMjBhd2FyZHxlbnwxfHx8fDE3NjA0Mjg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080' }],
        type: 'video',
      },
    ];

    // Mock mentor for featured mentor card

    const mockMentor = {

      id: 'mentor1',

      name: 'Dr. Sarah Johnson',

      specialization: 'Critical Care Nursing',

      experience: 12,

      rating: 4.8,

      sessions: 150,

      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1080&auto=format&fit=crop',

      price: 2500,

      available: true,

    };


    // Navigation wrapper
    const goToProfile = () => navigation.navigate('Profile');
   const [news, setNews] = useState([]);
   const [activities, setActivities] = useState([]); // merged events/workshops
   const [featuredCourses, setFeaturedCourses] = useState([]);
   const [eventsCount, setEventsCount] = useState(0);
   const [workshopsCount, setWorkshopsCount] = useState(0);
   const [coursesCount, setCoursesCount] = useState(0);
   const [featuredNews, setFeaturedNews] = useState([]);
   const [registeredCount, setRegisteredCount] = useState(0);
   const [enrolledCount, setEnrolledCount] = useState(0);
   const [conferenceCount, setConferenceCount] = useState(0);
   const [mentorsCount, setMentorsCount] = useState(0);
   const [assessmentsCount, setAssessmentsCount] = useState(0);
   // Catalog removed from dashboard
   const [profileIncomplete, setProfileIncomplete] = useState(false);
   const [localUser, setLocalUser] = useState(null);
   const { user: user, signOut } = useContext(AuthContext);
   const displayUser = localUser || user;

  // helper to (re)load activities/courses/news
  const fetchAdditionalData = async () => {
      // Skip API calls for test tokens to prevent 401 errors
      if (user?.token?.startsWith('test_')) {
        return;
      }

      try {
        const [coursesResponse, myEventsRes, myWorkshopsRes, latestRes, featuredRes, statsRes, myConferencesRes, mentorsRes, assessmentsRes] = await Promise.all([
          api.get('/courses/my/courses').catch(() => ({ data: { courses: [] } })),
          api.get('/events/my/events').catch(() => ({ data: [] })),
          api.get('/workshops/my/workshops').catch(() => ({ data: [] })),
          newsAPI.getLatest().catch(() => ({ data: [] })),
          newsAPI.getFeatured().catch(() => ({ data: [] })),
          dashboardAPI.getStats().catch(() => ({ data: { registered: 0, enrolled: 0 } })),
          conferenceAPI.getMyConferences().catch(() => ({ data: [] })),
          mentorAPI.getMentors().catch(() => ({ data: [] })),
          assessmentAPI.getAssessments().catch(() => ({ data: [] })),
        ]);

        const myCourses = coursesResponse?.data?.courses || coursesResponse?.data || [];
        const coursesToSet = Array.isArray(myCourses) ? myCourses : [];
        setCourses(coursesToSet);

        const myEvents = myEventsRes?.data?.events || myEventsRes?.data || [];
        setEventsCount(Array.isArray(myEvents) ? myEvents.length : 0);

        const myWorkshops = myWorkshopsRes?.data?.workshops || myWorkshopsRes?.data || [];
        setWorkshopsCount(Array.isArray(myWorkshops) ? myWorkshops.length : 0);

        const myConferences = myConferencesRes?.data?.conferences || myConferencesRes?.data || [];
        setConferenceCount(Array.isArray(myConferences) ? myConferences.length : 0);

        const mentors = mentorsRes?.data?.mentors || mentorsRes?.data || [];
        setMentorsCount(Array.isArray(mentors) ? mentors.length : 0);
        const assessments = assessmentsRes?.data || [];
        setAssessmentsCount(Array.isArray(assessments) ? assessments.length : 0);

        // News fetching moved to separate function


        // STATS API
        const stats = statsRes?.data || {};
        setRegisteredCount(stats.registered || 0);
        setEnrolledCount(stats.enrolled || 0);
        setCoursesCount(stats.courses || 0);
        setEventsCount(stats.events || 0);
        setWorkshopsCount(stats.workshops || 0);

        // ENGAGE ACTIVITIES (Public Activities) - Removed

        // Fetch public events & workshops and merge as "New Activities"
        try {
          const [eventsRes, workshopsRes, publicCoursesRes] = await Promise.all([
            api.get('/events'),
            api.get('/workshops'),
            api.get('/courses').catch(() => ({ data: [] })),
          ]);
          let eventsData = eventsRes?.data;
          if (eventsData?.data?.events) eventsData = eventsData.data;
          const rawEvents = Array.isArray(eventsData?.events) ? eventsData.events : (Array.isArray(eventsData) ? eventsData : []);
          let workshopsData = workshopsRes?.data;
          if (workshopsData?.data?.workshops) workshopsData = workshopsData.data;
          const rawWorkshops = Array.isArray(workshopsData?.workshops) ? workshopsData.workshops : (Array.isArray(workshopsData) ? workshopsData : []);
          let coursesData = publicCoursesRes?.data;
          if (coursesData?.data?.courses) coursesData = coursesData.data;
          const rawCourses = Array.isArray(coursesData?.courses) ? coursesData.courses : (Array.isArray(coursesData) ? coursesData : []);
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
           // Silent error handling for better UX
           try { activitiesAPI.create({ type:'error', title:'home-activities-fetch-failed', meta:{ message: String(e?.message||e) } }); } catch {}
         }
      } catch (error) {
        console.error('Error fetching additional data:', error);
        try { activitiesAPI.create({ type:'error', title:'home-fetch-failed', meta:{ message: String(error?.message||error) } }); } catch {}
      }
    };

  // Fetch news always, even without user
  const fetchNews = async () => {
    try {
      const latestRes = await newsAPI.getLatest();
      let latest = latestRes?.data || [];
      if (!Array.isArray(latest)) latest = [];
      setNews(latest);
      const featuredRes = await newsAPI.getFeatured();
      setFeaturedNews(Array.isArray(featuredRes?.data) ? featuredRes.data : []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Initial load + socket wiring for real-time updates
  useEffect(() => {
    fetchNews(); // Always fetch news
    if (user) { // Wait for user to be loaded
      fetchAdditionalData();
      const sock = connectSocket();
      const off1 = onSocket('new_event', fetchAdditionalData);
      const off2 = onSocket('event_update', fetchAdditionalData);
      const off3 = onSocket('new_workshop', fetchAdditionalData);
      const off4 = onSocket('workshop_update', fetchAdditionalData);
      const off5 = onSocket('new_course', fetchAdditionalData);
      const off6 = onSocket('course_update', fetchAdditionalData);
      const off7 = onSocket('new_news', () => { fetchAdditionalData(); fetchNews(); });
      const off8 = onSocket('news_update', () => { fetchAdditionalData(); fetchNews(); });
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
        colors={['#2563EB', '#7C3AED']}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.profileSection}
            activeOpacity={1.0}
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
              {displayUser?.experience && (
                <Text style={styles.experienceTextWhite}>{displayUser.experience} years experience</Text>
              )}
              {user?.profileIncomplete && (
                <Text style={styles.tapToComplete}>Tap to complete profile</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButtonWhite}
            activeOpacity={1.0}
            onPress={() => navigation.navigate('Notifications')}
          >
            <SvgXml xml={bellSvg} width={20} height={20} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats with Glass Morphism - Matching Figma - 6 Cards Scrollable */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainerGlass}>
          <View style={styles.statCardGlass}>
            <SvgXml xml={bookOpenSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Courses</Text>
            <Text style={styles.statNumberWhite}>{coursesCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Events</Text>
            <Text style={styles.statNumberWhite}>{eventsCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={calendarSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Conferences</Text>
            <Text style={styles.statNumberWhite}>{conferenceCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={usersSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Workshops</Text>
            <Text style={styles.statNumberWhite}>{workshopsCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={usersSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Mentors</Text>
            <Text style={styles.statNumberWhite}>{mentorsCount}</Text>
          </View>
          <View style={styles.statCardGlass}>
            <SvgXml xml={bookOpenSvg} width={20} height={20} color="#fff" />
            <Text style={styles.statLabelWhite}>Assessments</Text>
            <Text style={styles.statNumberWhite}>{assessmentsCount}</Text>
          </View>
        </ScrollView>
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

        {/* My Learning - Priority Section - Matching Figma */}
        <TouchableOpacity
          style={styles.myLearningCard}
          activeOpacity={1.0}
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
                Continue your learning right now
              </Text>
            </View>
            <SvgXml xml={chevronRightSvg} width={24} height={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

      {/* Latest News (immediately after My Learning) */}
    <View style={styles.newsSection}>
      <View style={styles.rowBetween}>
         <Text style={styles.newsSectionTitle}>Latest News</Text>
         <TouchableOpacity activeOpacity={1.0} onPress={() => navigation.navigate('NewsList')}>
           <Text style={styles.newsLinkText}>See All</Text>
         </TouchableOpacity>
       </View>
       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8 }}>
         {news.slice(0, 3).map((item, index) => (
           <TouchableOpacity key={index} style={styles.newsCardFigma} activeOpacity={1.0} onPress={() => {
             // Fast navigation without loading states
             if (item.externalUrl) {
               Linking.openURL(item.externalUrl);
             } else if (item.videos && item.videos.length > 0) {
               // If it's a video, play directly
               navigation.navigate('VideoPlayer', {
                 videoUrl: item.videos[0].url,
                 title: item.videos[0].title || item.title,
                 thumbnail: item.videos[0].thumbnail
               });
             } else {
               navigation.navigate('NewsDetail', { item });
             }
           }}>
             <View style={styles.newsImageContainer}>
               <ImageWithFallback
                 src={getFullMediaUrl(item.imageUrl || item.thumbnail || (item.videos && item.videos[0]?.thumbnail) || (item.images && item.images[0]?.url))}
                 alt={item.title}
                 style={styles.newsImageFigma}
               />
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
 
       {/* Nightingale Programme Banner - First Priority - Matching Figma */}
      <View style={styles.nightingaleBanner}>
        <LinearGradient
          colors={['#9333EA', '#EC4899', '#F97316']}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          style={styles.nightingaleGradient}
        >
          <View style={styles.nightingaleContent}>
            <View style={styles.nightingaleIconContainer}>
              <SparklesIcon width={32} height={32} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nightingaleTitle}>Nightingale Programme</Text>
              <Text style={styles.nightingaleSubtitle}>Become a Champion Mentor and light the way</Text>
              <TouchableOpacity
                style={styles.nightingaleButton}
                activeOpacity={1.0}
                onPress={() => navigation.navigate('NCC')}
              >
                <Text style={styles.nightingaleButtonText}>Begin Journey</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Become a Mentor Banner - Always visible for testing - Matching Figma */}
      <View style={styles.mentorBanner}>
        <LinearGradient
          colors={['#06B6D4', '#10B981']}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          style={styles.mentorGradient}
        >
          <View style={styles.mentorContent}>
            <View style={styles.mentorIconContainer}>
              <UsersIcon width={32} height={32} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mentorTitle}>Want to Become a Mentor?</Text>
              <Text style={styles.mentorSubtitle}>Share your expertise with fellow nurses</Text>
              <TouchableOpacity
                style={styles.mentorButton}
                activeOpacity={1.0}
                onPress={() => navigation.navigate('MentorRegister')}
              >
                <Text style={styles.mentorButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>


      </View>
      {/* End contentContainer */}

      {/* Engage: Wellness & Events - Matching Figma */}
      <View style={styles.newActivitiesSection}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>New Activities</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('MyLearning')} style={{ marginRight: 8 }}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesContainer}>
           {activities.slice(0, 2).map((activity, index) => {
             const isCourse = activity.kind === 'Course';
             const date = new Date(activity.date);
             const now = new Date();
             const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
             const month = date.toLocaleString('en-US', { month: 'short' });
             const day = date.getDate();

             return (
               <TouchableOpacity key={`${activity.kind}-${activity.id || index}`} style={styles.activityCardModern} activeOpacity={1.0} onPress={() => navigation.navigate('MyLearning')}>
                <View style={styles.activityCardContent}>
                  <View style={styles.activityDatePill}>
                    <Text style={styles.activityDateMonth}>{month}</Text>
                    <Text style={styles.activityDateDay}>{day}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>{activity.kind}</Text>
                    </View>
                    <Text style={styles.activityTitleSmall}>{activity.title}</Text>
                    <Text style={styles.activitySubSmall}>
                      {isCourse ? 'Continue learning' : `${activity.kind === 'Event' ? 'Conference' : 'Live Workshop'} • ${daysLeft > 0 ? `${daysLeft} days left` : 'Ongoing'}`}
                    </Text>
                   
                  </View>
                  {!isCourse && <SvgXml xml={chevronRightSvg} width={20} height={20} color="#9CA3AF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} activeOpacity={1.0} onPress={handleLogout}>
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
  // NEW: Glass Morphism Stats Cards - Simplified (Figma Match) - Now Scrollable
  statsContainerGlass: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  statCardGlass: {
    width: 120,
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
  // NEW: Profile Summary Card
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadow.soft,
  },
  profileSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  profileSummaryContent: {
    // Container for fields
  },
  profileField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  profileFieldLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileFieldValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
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
  // NEW: Nightingale Programme Banner - Matching Figma
  nightingaleBanner: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  nightingaleGradient: {
    padding: 20,
  },
  nightingaleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  nightingaleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nightingaleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nightingaleSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  nightingaleButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nightingaleButtonText: {
    color: '#9333EA',
    fontSize: 14,
    fontWeight: '600',
  },
  // NEW: Become a Mentor Banner - Matching Figma
  mentorBanner: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mentorGradient: {
    padding: 20,
  },
  mentorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mentorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mentorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mentorSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  mentorButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mentorButtonText: {
    color: '#06B6D4',
    fontSize: 14,
    fontWeight: '600',
  },
  // NEW: Course Progress Card - Matching Figma
  courseProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseProgressImageContainer: {
    height: 160,
    position: 'relative',
  },
  courseProgressImage: {
    width: '100%',
    height: '100%',
  },
  courseProgressOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  courseProgressBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseProgressBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  courseProgressContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  courseProgressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  courseProgressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
  },
  courseProgressBarFg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  courseProgressFooter: {
    padding: 16,
  },
  courseProgressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseProgressStatsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  courseProgressStatsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  courseProgressButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  courseProgressButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // NEW: New Activities Section - Matching Figma
  newActivitiesSection: {
    marginBottom: 24,
  },
  activitiesContainer: {
    gap: 12,
  },
  activityCardModern: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityThumbnailSmall: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  activityThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  activityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  activityBadgeText: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '600',
  },
  activityTitleSmall: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activitySubSmall: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  activityProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityProgressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityProgressValue: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  activityProgressBar: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  activityProgressFill: {
    height: 3,
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  activityDatePill: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDateMonth: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  activityDateDay: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
});

export default HomeScreen;
