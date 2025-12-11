import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import api from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const activitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const EngageScreen = ({ navigation }) => {
  const [tab, setTab] = useState('wellness');
  const [query, setQuery] = useState('');

  // Wellness activities (mental health, stress management, meditation)
  const [wellness, setWellness] = useState([
    {
      title: 'Stress Management for Healthcare Workers',
      type: 'Mental Wellness',
      date: 'Nov 15, 2024',
      time: '6:00 PM - 7:30 PM',
      location: 'Online',
      price: 0,
      points: 100,
      category: 'Mental Health',
      _id: 'wellness_1',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      capacity: 50,
      enrolled: 12
    },
    {
      title: 'Mindfulness & Meditation for Nurses',
      type: 'Wellness Workshop',
      date: 'Nov 18, 2024',
      time: '7:00 AM - 8:00 AM',
      location: 'Online',
      price: 299,
      points: 150,
      category: 'Mindfulness',
      _id: 'wellness_2',
      thumbnail: 'https://images.unsplash.com/photo-1545389336-cf090694435e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      capacity: 30,
      enrolled: 8
    },
    {
      title: 'Self-Care Sunday: Yoga & Breathwork',
      type: 'Wellness Session',
      date: 'Nov 17, 2024',
      time: '8:00 AM - 9:30 AM',
      location: 'Mumbai Community Center',
      price: 199,
      points: 120,
      category: 'Self-Care',
      _id: 'wellness_3',
      thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      capacity: 25,
      enrolled: 15
    },
    {
      title: 'Burnout Prevention Workshop',
      type: 'Mental Wellness',
      date: 'Nov 22, 2024',
      time: '3:00 PM - 5:00 PM',
      location: 'Online',
      price: 0,
      points: 200,
      category: 'Burnout Prevention',
      _id: 'wellness_4',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      capacity: 100,
      enrolled: 45
    }
  ]);

  // Fitness activities (physical health, yoga, exercise)
  const [fitness, setFitness] = useState([
    {
      title: '30-Day Nurse Fitness Challenge',
      instructor: 'Fitness Coach Priya',
      duration: '30 days',
      type: 'Challenge',
      price: 499,
      points: 300,
      enrolled: 156,
      category: 'Fitness Challenge',
      _id: 'fitness_1',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      title: 'Desk Stretches for Long Shifts',
      instructor: 'Dr. Anita Sharma',
      duration: '2 weeks',
      type: 'Video Series',
      price: 0,
      points: 80,
      enrolled: 423,
      category: 'Workplace Wellness',
      _id: 'fitness_2',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      title: 'Strength Training for Nurses',
      instructor: 'Coach Rajesh Kumar',
      duration: '6 weeks',
      type: 'Fitness Program',
      price: 999,
      points: 400,
      enrolled: 89,
      category: 'Strength Training',
      _id: 'fitness_3',
      thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      title: 'Healthy Eating for Healthcare Heroes',
      instructor: 'Nutritionist Kavita',
      duration: '4 weeks',
      type: 'Nutrition Program',
      price: 799,
      points: 250,
      enrolled: 234,
      category: 'Nutrition',
      _id: 'fitness_4',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    }
  ]);

  // Community events (networking, social activities)
  const [events, setEvents] = useState([
    {
      title: 'Healthcare Wellness Summit 2024',
      type: 'Conference',
      date: 'Dec 5-7, 2024',
      time: '9:00 AM onwards',
      location: 'Delhi Convention Center',
      price: 2500,
      points: 500,
      category: 'Conference',
      _id: 'event_1',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      seats: 45
    },
    {
      title: 'Community Health Camp - Volunteer',
      type: 'Volunteering',
      date: 'Nov 25, 2024',
      time: '8:00 AM - 2:00 PM',
      location: 'Local Community Center',
      price: 0,
      points: 300,
      category: 'Volunteering',
      _id: 'event_2',
      thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      seats: 20
    },
    {
      title: 'Nurse Career Growth Webinar',
      type: 'Webinar',
      date: 'Nov 20, 2024',
      time: '5:00 PM - 6:30 PM',
      location: 'Online',
      price: 0,
      points: 100,
      category: 'Professional Growth',
      _id: 'event_3',
      thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      seats: 200
    },
    {
      title: 'Nursing Leadership Workshop',
      type: 'Workshop',
      date: 'Dec 1, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Mumbai Training Center',
      price: 1500,
      points: 350,
      category: 'Leadership',
      _id: 'event_4',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      seats: 30
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes] = await Promise.all([
          api.get('/engage/activities').catch(() => ({ data: [] })),
        ]);

        let aList = activitiesRes?.data || [];
        if (!Array.isArray(aList)) aList = [];

        // Separate activities by category
        const wellnessList = aList.filter(a => a.category === 'wellness' || a.type === 'wellness');
        const fitnessList = aList.filter(a => a.category === 'fitness' || a.type === 'fitness');
        const eventsList = aList.filter(a => a.category === 'event' || a.type === 'event');

        // Always set the data - use backend data if available, otherwise keep existing
        if (wellnessList.length > 0) {
          setWellness(wellnessList);
        }
        if (fitnessList.length > 0) {
          setFitness(fitnessList);
        }
        if (eventsList.length > 0) {
          setEvents(eventsList);
        }
      } catch (err) {
        console.log('Engage fetch error:', err);
      }
    };

    fetchData();

    const sock = connectSocket();
    const unsubs = [
      onSocket('activityUpdate', (data) => {
        if (data.category === 'wellness') setWellness((prev) => [...prev.filter((e) => e._id !== data._id), data]);
        else if (data.category === 'fitness') setFitness((prev) => [...prev.filter((e) => e._id !== data._id), data]);
        else setEvents((prev) => [...prev.filter((e) => e._id !== data._id), data]);
      }),
    ];

    return () => { unsubs.forEach((fn) => fn && fn()); disconnectSocket(); };
  }, []);

  const filtered = useMemo(() => {
    const lq = query.toLowerCase().trim();
    if (!lq) return { wellness, fitness, events };
    const filterFn = (arr) => arr.filter((x) => x.title.toLowerCase().includes(lq));
    return {
      wellness: filterFn(wellness),
      fitness: filterFn(fitness),
      events: filterFn(events),
    };
  }, [query, wellness, fitness, events]);

  const renderWellnessItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('EngageDetails', { item, type: 'wellness' });
    };

    const img = item.thumbnail && item.thumbnail.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${item.thumbnail}` : item.thumbnail;

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
        {/* Hero Image */}
        <View style={styles.hero}>
          {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />

          {/* Spots Available Badge */}
          <View style={styles.badgeRight}>
            <Text style={styles.badgeRightText}>{item.capacity - (item.enrolled || 0)} spots available</Text>
          </View>

          {/* FREE Badge */}
          {item.price === 0 && (
            <View style={styles.badgeLeft}>
              <Text style={styles.badgeLeftText}>FREE</Text>
            </View>
          )}
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: '#FCE7F3' }]}>
            <SvgXml xml={heartSvg} width={14} height={14} color="#EC4899" />
            <Text style={[styles.categoryText, { color: '#EC4899' }]}>
              {item.category}
            </Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

          {/* Meta Information */}
          <View style={styles.metaSpace}>
            <View style={styles.metaItem}>
              <SvgXml xml={calendarSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <SvgXml xml={mapPinSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          </View>

          {/* Price and Points */}
          <View style={styles.priceRow}>
            <View>
              {item.price === 0 ? (
                <Text style={styles.freeText}>Free</Text>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              )}
            </View>

            <Text style={styles.pointsText}>+{item.points} pts</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFitnessItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('EngageDetails', { item, type: 'fitness' });
    };

    const img = item.thumbnail && item.thumbnail.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${item.thumbnail}` : item.thumbnail;

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
        {/* Hero Image */}
        <View style={styles.hero}>
          {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />

          {/* Type Badge */}
          <View style={styles.badgeRight}>
            <Text style={styles.badgeRightText}>{item.type}</Text>
          </View>

          {/* FREE Badge */}
          {item.price === 0 && (
            <View style={styles.badgeLeft}>
              <Text style={styles.badgeLeftText}>FREE</Text>
            </View>
          )}
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: '#FFEDD5' }]}>
            <SvgXml xml={activitySvg} width={14} height={14} color="#F97316" />
            <Text style={[styles.categoryText, { color: '#F97316' }]}>
              {item.category}
            </Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

          <Text style={styles.instructorText}>by {item.instructor}</Text>

          {/* Meta Information */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <SvgXml xml={usersSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.enrolled} enrolled</Text>
            </View>
          </View>

          {/* Price and Points */}
          <View style={styles.priceRow}>
            <View>
              {item.price === 0 ? (
                <Text style={styles.freeText}>Free</Text>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              )}
            </View>

            <Text style={styles.pointsText}>+{item.points} pts</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('EngageDetails', { item, type: 'event' });
    };

    const img = item.thumbnail && item.thumbnail.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${item.thumbnail}` : item.thumbnail;

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
        {/* Hero Image */}
        <View style={styles.hero}>
          {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />

          {/* Seats Left Badge */}
          <View style={styles.badgeRight}>
            <Text style={styles.badgeRightText}>{item.seats} seats left</Text>
          </View>

          {/* FREE Badge */}
          {item.price === 0 && (
            <View style={styles.badgeLeft}>
              <Text style={styles.badgeLeftText}>FREE</Text>
            </View>
          )}
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: '#DBEAFE' }]}>
            <SvgXml xml={activitySvg} width={14} height={14} color="#1D4ED8" />
            <Text style={[styles.categoryText, { color: '#1D4ED8' }]}>
              {item.category}
            </Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

          {/* Meta Information */}
          <View style={styles.metaSpace}>
            <View style={styles.metaItem}>
              <SvgXml xml={calendarSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <SvgXml xml={mapPinSvg} width={16} height={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          </View>

          {/* Price and Points */}
          <View style={styles.priceRow}>
            <View>
              {item.price === 0 ? (
                <Text style={styles.freeText}>Free</Text>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              )}
            </View>

            <Text style={styles.pointsText}>+{item.points} pts</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const currentData = tab === 'wellness' ? filtered.wellness : tab === 'fitness' ? filtered.fitness : filtered.events;
  const renderItem = tab === 'wellness' ? renderWellnessItem : tab === 'fitness' ? renderFitnessItem : renderEventItem;

  return (
    <View style={styles.safe}>
      {/* Fixed Header */}
      <LinearGradient
        colors={['#9333EA', '#EC4899', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fixedHeader}
      >
        <Text style={styles.headerTitle}>Engage</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SvgXml xml={searchSvg} width={20} height={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wellness, fitness, events..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Tabs with Icons */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'wellness' && styles.tabBtnActive]}
              onPress={() => setTab('wellness')}
            >
              <SvgXml xml={heartSvg} width={16} height={16} color={tab === 'wellness' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'wellness' && styles.tabTextActive]}>Wellness</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'fitness' && styles.tabBtnActive]}
              onPress={() => setTab('fitness')}
            >
              <SvgXml xml={activitySvg} width={16} height={16} color={tab === 'fitness' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'fitness' && styles.tabTextActive]}>Fitness</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'events' && styles.tabBtnActive]}
              onPress={() => setTab('events')}
            >
              <SvgXml xml={calendarSvg} width={16} height={16} color={tab === 'events' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'events' && styles.tabTextActive]}>Events</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {tab === 'wellness' && 'Prioritize your mental health and well-being with our wellness programs'}
            {tab === 'fitness' && 'Stay active and healthy with fitness programs designed for nurses'}
            {tab === 'events' && 'Join conferences, workshops, and community events for professional growth'}
          </Text>

          {/* List */}
          <View style={styles.list}>
            {currentData.map((item, index) => (
              <View key={item._id || index}>
                {renderItem({ item })}
              </View>
            ))}
            {currentData.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {tab === 'wellness' && 'No wellness activities available'}
                  {tab === 'fitness' && 'No fitness activities available'}
                  {tab === 'events' && 'No community events available'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: { flex: 1 },
  fixedHeader: {
    paddingTop: Platform.OS === 'ios' ? 48 : 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    gap: 0,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#111827' },
  description: { color: '#6B7280', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  hero: { height: 160, position: 'relative' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover', backgroundColor: '#E5E7EB' },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badgeRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeRightText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  badgeLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeLeftText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardBody: { padding: 16 },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  categoryText: { fontSize: 12, fontWeight: '600' },
  cardTitle: { color: '#111827', fontSize: 17, fontWeight: '700', marginBottom: 4, lineHeight: 24 },
  instructorText: { color: '#6B7280', fontSize: 14, marginBottom: 12 },
  metaSpace: { marginTop: 8, marginBottom: 12, gap: 8 },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 8, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#6B7280', fontSize: 13 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsText: { color: '#EAB308', fontSize: 15, fontWeight: '600' },
  freeText: { color: '#10B981', fontSize: 15, fontWeight: '600' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  rupeeSymbol: { color: '#111827', fontSize: 15, fontWeight: '600' },
  priceText: { color: '#111827', fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 15 },
});

export default EngageScreen;
