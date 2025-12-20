import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import api, { courseAPI, eventAPI, workshopAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { COLOR_SCHEME } from '../utils/colors';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
const indianRupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>`;

const formatEventDate = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleString('en-US', { month: 'short' });
  const endMonth = end.toLocaleString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = start.getFullYear();
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
};

const formatSingleDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toLowerCase(); // "nov 28, 2024"
  } catch {
    return dateString;
  }
};

const Learning = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('Priya');

  useEffect(() => {
    const getSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('nurseProfile');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.fullName) {
            const firstName = parsed.fullName.split(' ')[0];
            setDisplayName(firstName);
          }
        }
      } catch (error) {
        console.error('Error loading saved profile data:', error);
      }
    };
    getSavedData();
  }, []);

  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [coursesRes, eventsRes, workshopsRes] = await Promise.all([
          courseAPI.getCourses().catch(() => ({ data: { courses: [] } })),
          eventAPI.getEvents().catch(() => ({ data: { events: [] } })),
          workshopAPI.getWorkshops().catch(() => ({ data: { workshops: [] } }))
        ]);

        setCourses(coursesRes.data?.courses || coursesRes.data || []);
        setEvents(eventsRes.data?.events || eventsRes.data || []);
        setWorkshops(workshopsRes.data?.workshops || workshopsRes.data || []);
      } catch (err) {
        console.error('Error fetching learning data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Socket connection for real-time updates
  useEffect(() => {
    let socketCleanup = [];

    const setupSocket = async () => {
      try {
        const socket = await connectSocket();
        if (socket) {
          // Listen for course events
          socketCleanup.push(onSocket('content:course:created', (data) => {
            console.log('New course created:', data);
            // Refresh courses data
            courseAPI.getCourses().then(res => {
              setCourses(res.data?.courses || res.data || []);
            }).catch(err => console.error('Error refreshing courses:', err));
          }));

          socketCleanup.push(onSocket('content:course:updated', (data) => {
            console.log('Course updated:', data);
            // Refresh courses data
            courseAPI.getCourses().then(res => {
              setCourses(res.data?.courses || res.data || []);
            }).catch(err => console.error('Error refreshing courses:', err));
          }));

          socketCleanup.push(onSocket('content:course:deleted', (data) => {
            console.log('Course deleted:', data);
            // Refresh courses data
            courseAPI.getCourses().then(res => {
              setCourses(res.data?.courses || res.data || []);
            }).catch(err => console.error('Error refreshing courses:', err));
          }));

          // Listen for workshop events
          socketCleanup.push(onSocket('content:workshop:created', (data) => {
            console.log('New workshop created:', data);
            // Refresh workshops data
            workshopAPI.getWorkshops().then(res => {
              setWorkshops(res.data?.workshops || res.data || []);
            }).catch(err => console.error('Error refreshing workshops:', err));
          }));

          socketCleanup.push(onSocket('content:workshop:updated', (data) => {
            console.log('Workshop updated:', data);
            // Refresh workshops data
            workshopAPI.getWorkshops().then(res => {
              setWorkshops(res.data?.workshops || res.data || []);
            }).catch(err => console.error('Error refreshing workshops:', err));
          }));

          socketCleanup.push(onSocket('content:workshop:deleted', (data) => {
            console.log('Workshop deleted:', data);
            // Refresh workshops data
            workshopAPI.getWorkshops().then(res => {
              setWorkshops(res.data?.workshops || res.data || []);
            }).catch(err => console.error('Error refreshing workshops:', err));
          }));

          // Listen for engage events (events)
          socketCleanup.push(onSocket('content:engage:created', (data) => {
            console.log('New engage activity created:', data);
            // Refresh events data
            eventAPI.getEvents().then(res => {
              setEvents(res.data?.events || res.data || []);
            }).catch(err => console.error('Error refreshing events:', err));
          }));

          socketCleanup.push(onSocket('content:engage:updated', (data) => {
            console.log('Engage activity updated:', data);
            // Refresh events data
            eventAPI.getEvents().then(res => {
              setEvents(res.data?.events || res.data || []);
            }).catch(err => console.error('Error refreshing events:', err));
          }));

          socketCleanup.push(onSocket('content:engage:deleted', (data) => {
            console.log('Engage activity deleted:', data);
            // Refresh events data
            eventAPI.getEvents().then(res => {
              setEvents(res.data?.events || res.data || []);
            }).catch(err => console.error('Error refreshing events:', err));
          }));
        }
      } catch (error) {
        console.error('Socket connection failed:', error);
      }
    };

    setupSocket();

    return () => {
      socketCleanup.forEach(cleanup => cleanup && cleanup());
      disconnectSocket();
    };
  }, []);

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    let data = [];
    if (activeTab === 'courses') data = courses || [];
    else if (activeTab === 'events') data = events || [];
    else if (activeTab === 'workshops') data = workshops || [];

    if (!Array.isArray(data)) data = [];

    return data.filter(item =>
      item && item.title && item.title.toLowerCase().includes(query) ||
      (item.instructor && item.instructor.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  };

  const renderItem = ({ item, index }) => {
    const handlePress = () => {
      navigation.navigate('LearningDetails', {
        type: activeTab === 'courses' ? 'course' : activeTab === 'events' ? 'event' : 'workshop',
        data: item
      });
    };

    // Handle image URL construction with fallback
    const getImageUri = (item) => {
      if (item.thumbnail) {
        if (item.thumbnail.startsWith('/uploads')) {
          return `http://${IP_ADDRESS}:5000${item.thumbnail}`;
        } else if (item.thumbnail.startsWith('http')) {
          return item.thumbnail;
        }
      }
      if (item.image) {
        if (item.image.startsWith('/uploads')) {
          return `http://${IP_ADDRESS}:5000${item.image}`;
        } else if (item.image.startsWith('http')) {
          return item.image;
        }
      }
      // Fallback to placeholder based on type
      const colors = {
        courses: '4F46E5',
        events: 'EC4899',
        workshops: '059669'
      };
      const color = colors[activeTab] || '6B7280';
      return `https://via.placeholder.com/300x160/${color}/FFFFFF?text=${item.title?.substring(0, 10) || 'Content'}`;
    };

    const imgUri = getImageUri(item);

    return (
      <TouchableOpacity
        key={item.id || index}
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: imgUri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
            style={styles.cardImageOverlay}
          />
          {item.level && item.level !== '' && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{item.level}</Text>
            </View>
          )}
          {item.price === 0 && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          )}
          {item.certificate === true && (
            <View style={styles.certificateBadge}>
              <SvgXml xml={awardSvg} width={12} height={12} color="#fff" />
              <Text style={styles.certificateBadgeText}>Certificate</Text>
            </View>
          )}
          {item.seats && item.seats > 0 && item.seats < 30 && activeTab === 'workshops' && (
            <View style={styles.seatsBadge}>
              <Text style={styles.seatsBadgeText}>{item.seats} seats left</Text>
            </View>
          )}
          {item.seats === 0 && activeTab === 'workshops' && (
            <View style={styles.seatsBadge}>
              <Text style={styles.seatsBadgeText}>No seats</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          {item.category && item.category.trim() !== '' && (
            <View style={styles.categoryBadge}>
              <SvgXml
                xml={
                  activeTab === 'courses' ? graduationCapSvg :
                  activeTab === 'events' ? calendarSvg : briefcaseSvg
                }
                width={12}
                height={12}
                color={
                  activeTab === 'courses' ? '#1E40AF' :
                  activeTab === 'events' ? '#7C3AED' : '#C2410C'
                }
              />
              <Text style={[styles.categoryText, {
                color: activeTab === 'courses' ? '#1E40AF' :
                       activeTab === 'events' ? '#7C3AED' : '#C2410C'
              }]}>
                {item.category}
              </Text>
            </View>
          )}

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          {item.instructor && (
            <Text style={styles.cardInstructor}>by {item.instructor?.name || 'Unknown Instructor'}</Text>
          )}

          {/* Description */}
          {item.description && item.description.trim() !== '' && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.cardMeta}>
           {activeTab === 'courses' && (
             <>
               <View style={styles.metaItem}>
                 <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Duration: {item.duration || 'N/A'}</Text>
               </View>
               <View style={styles.metaItem}>
                 <SvgXml xml={bookOpenSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Modules: {item.modules || 0} comprehensive modules</Text>
               </View>
               <View style={styles.metaItem}>
                 <SvgXml xml={usersSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Enrolled: {item.enrolled || item.enrolledCount || 0} students</Text>
               </View>
             </>
           )}
           {activeTab === 'events' && (
             <>
               {item.startDate && item.endDate ? (
                 <View style={styles.metaItem}>
                   <SvgXml xml={calendarSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.metaText}>Date: {formatEventDate(item.startDate, item.endDate)}</Text>
                 </View>
               ) : item.date ? (
                 <View style={styles.metaItem}>
                   <SvgXml xml={calendarSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.metaText}>Date: {item.date}</Text>
                 </View>
               ) : null}
               {item.time && (
                 <View style={styles.metaItem}>
                   <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.metaText}>Time: {item.time}</Text>
                 </View>
               )}
               {item.location && (
                 <View style={styles.metaItem}>
                   <SvgXml xml={mapPinSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.metaText}>Location: {item.location}</Text>
                 </View>
               )}
             </>
           )}
           {activeTab === 'workshops' && (
             <>
               <View style={styles.metaItem}>
                 <SvgXml xml={calendarSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Date: {item.date ? formatSingleDate(item.date) : 'N/A'}</Text>
               </View>
               <View style={styles.metaItem}>
                 <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Time: {item.time || 'N/A'}</Text>
               </View>
               <View style={styles.metaItem}>
                 <SvgXml xml={mapPinSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Location: {item.location || 'N/A'}</Text>
               </View>
               <View style={styles.metaItem}>
                 <SvgXml xml={usersSvg} width={14} height={14} color="#6B7280" />
                 <Text style={styles.metaText}>Enrolled: {item.enrolled || 0} students</Text>
               </View>
             </>
           )}
          </View>

          <View style={styles.cardFooter}>
           <View style={styles.priceContainer}>
             {item.price === 0 ? (
               <Text style={styles.freePrice}>Free</Text>
             ) : item.price ? (
               <View style={styles.priceWrapper}>
                 <SvgXml xml={indianRupeeSvg} width={16} height={16} color="#111827" />
                 <Text style={styles.priceText}>{item.price}</Text>
               </View>
             ) : (
               <Text style={styles.freePrice}>Price N/A</Text>
             )}
           </View>
           <View style={styles.pointsContainer}>
             {item.points && item.points > 0 ? (
               <Text style={styles.pointsText}>+{item.points} pts</Text>
             ) : (
               <Text style={styles.pointsText}>No points</Text>
             )}
           </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#9333EA', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Learning</Text>
          <TouchableOpacity
            style={styles.myLearningButton}
            onPress={() => navigation.navigate('MyLearning')}
          >
            <SvgXml xml={bookOpenSvg} width={16} height={16} color="#fff" />
            <Text style={styles.myLearningText}>My Learning</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SvgXml xml={searchSvg} width={20} height={20} color="rgba(255,255,255,0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, events, workshops..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'courses' && styles.tabActive]}
            onPress={() => setActiveTab('courses')}
          >
            <SvgXml
              xml={graduationCapSvg}
              width={16}
              height={16}
              color={'#000000'}
            />
            <Text style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>
              Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <SvgXml
              xml={calendarSvg}
              width={16}
              height={16}
              color={'#000000'}
            />
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'workshops' && styles.tabActive]}
            onPress={() => setActiveTab('workshops')}
          >
            <SvgXml
              xml={briefcaseSvg}
              width={16}
              height={16}
              color={'#000000'}
            />
            <Text style={[styles.tabText, activeTab === 'workshops' && styles.tabTextActive]}>
              Workshops
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {activeTab === 'courses' && 'Advance your nursing career with professional development courses'}
          {activeTab === 'events' && 'Join professional conferences, webinars, and networking events'}
          {activeTab === 'workshops' && 'Build practical skills with hands-on workshops and training'}
        </Text>

        {/* List */}
        <View style={styles.listContainer}>
          {filteredData().length > 0 ? (
            filteredData().map((item, index) => renderItem({ item, index }))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeTab} available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  myLearningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  myLearningText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  description: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageContainer: {
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  freeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  certificateBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#9333EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificateBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  seatsBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seatsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  cardInstructor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flex: 1,
  },
  freePrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#10B981',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EAB308',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
});

export default Learning;