import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Platform, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { eventAPI, workshopAPI, courseAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { COLOR_SCHEME } from '../utils/colors';
import { useSafePress } from '../hooks/useSafePress';
import { IP_ADDRESS } from '../../config/ipConfig';

const Tab = ({ label, active, onPress }) => {
  const safeOnPress = useSafePress(onPress);
  return (
    <TouchableOpacity onPress={safeOnPress} style={[styles.tabTrigger, active && styles.tabTriggerActive]}>
      <Text style={[styles.tabTriggerText, active && styles.tabTriggerTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const Price = ({ amount }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={styles.priceRow}>
      <Text style={{ color: COLOR_SCHEME.textSecondary }}>₹</Text>
      <Text style={styles.priceText}>{amount}</Text>
    </View>
  </View>
);

const Card = ({ onPress, children, badge, image }) => {
  const safeOnPress = useSafePress(onPress);
  return (
    <TouchableOpacity onPress={safeOnPress} activeOpacity={0.9} style={styles.card}>
      {/* Image hero with black gradient overlay */}
      <View style={styles.hero}>
        {image ? <Image source={{ uri: image }} style={styles.heroImg} /> : null}
        <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
        {badge ? (
          <View style={styles.badgeRight}><Text style={styles.badgeRightText}>{badge}</Text></View>
        ) : null}
      </View>
      {children}
    </TouchableOpacity>
  );
};

const ActivitiesScreen = ({ navigation, route }) => {
  // Default to Events per spec; route can override via params.open
  const [tab, setTab] = useState('events');
  const [query, setQuery] = useState('');
  // Seed with lightweight defaults so the screen renders instantly while network fetch happens
  const [events, setEvents] = useState([
    { title: 'Basic Life Support Webinar', date: 'TBA', time: 'TBA', location: 'Online', price: 0, _id: 'prefill_e1' },
  ]);
  const [workshops, setWorkshops] = useState([
    { title: 'Neonatal Care Workshop', date: 'TBA', duration: '2h', location: 'City Hospital', price: 499, seats: 12, _id: 'prefill_w1' },
  ]);
  const [courses, setCourses] = useState([
    { title: 'Advanced Wound Care — Essentials and Best Practices for Clinical Outcomes', duration: '6h', price: 999, _id: 'prefill_c1' },
  ]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [e, w, c] = await Promise.all([
          eventAPI.getEvents().catch(() => ({ data: [] })),
          workshopAPI.getWorkshops().catch(() => ({ data: [] })),
          courseAPI.getCourses().catch(() => ({ data: [] })),
        ]);
        let eList = e?.data?.events || e?.data || [];
        let wList = w?.data?.workshops || w?.data || [];
        let cList = c?.data?.courses || c?.data || [];
        if (!Array.isArray(eList)) eList = [];
        if (!Array.isArray(wList)) wList = [];
        if (!Array.isArray(cList)) cList = [];
        if (eList.length === 0) {
          eList = [
            { title: 'Basic Life Support Webinar', date: '2025-11-05', time: '10:00 AM', location: 'Online', price: 0, points: 25, _id: 'demo_e1' },
            { title: 'Infection Control Update', date: '2025-11-12', time: '4:00 PM', location: 'Online', price: 0, points: 30, _id: 'demo_e2' },
          ];
        }
        if (wList.length === 0) {
          wList = [
            { title: 'Neonatal Care Workshop', date: '2025-11-20', duration: '2h', location: 'City Hospital', price: 499, points: 80, seats: 12, _id: 'demo_w1' },
          ];
        }
        if (cList.length === 0) {
          cList = [
            { title: 'Advanced Wound Care', duration: '6h', price: 999, points: 120, _id: 'demo_c1' },
          ];
        }
  setEvents(eList);
  setWorkshops(wList);
  setCourses(cList);
        // If request came with an 'open' param, select the tab and push viewer
        const open = route?.params?.open;
        if (open && open.type) {
          const t = open.type === 'events' || open.type === 'event' ? 'events' : open.type === 'workshops' || open.type === 'workshop' ? 'workshops' : 'courses';
          setTab(t);
          const list = t === 'events' ? (e?.data || e?.data?.events || []) : t === 'workshops' ? (w?.data || w?.data?.workshops || []) : (c?.data || c?.data?.courses || []);
          const item = list.find((i) => (i._id || i.id) === open.id);
          if (item) {
            setTimeout(() => {
              navigation.navigate(
                t === 'events' ? 'EventViewer' : t === 'workshops' ? 'WorkshopViewer' : 'CourseDetail',
                { [t === 'courses' ? 'course' : t.slice(0, -1)]: item }
              );
            }, 200);
          }
        }
      } catch (err) {
        try { const { activitiesAPI } = require('../services/api'); activitiesAPI.create({ type:'error', title:'activities-fetch-failed', meta:{ message: String(err?.message||err) } }); } catch {}
      }
    };
    fetchLists();
    const sock = connectSocket();
    const off1 = onSocket('new_event', fetchLists);
    const off2 = onSocket('event_update', fetchLists);
    const off3 = onSocket('new_workshop', fetchLists);
    const off4 = onSocket('workshop_update', fetchLists);
    const off5 = onSocket('new_course', fetchLists);
    const off6 = onSocket('course_update', fetchLists);
    return () => { try { off1 && off1(); off2 && off2(); off3 && off3(); off4 && off4(); off5 && off5(); off6 && off6(); } catch {} disconnectSocket(); };
  }, [route?.params?.open]);

  const list = useMemo(() => {
    const src = tab === 'events' ? events : tab === 'workshops' ? workshops : courses;
    if (!query.trim()) return src;
    const q = query.toLowerCase();
    return src.filter((i) =>
      (i.title || '').toLowerCase().includes(q) ||
      (i.instructor || '').toLowerCase().includes(q) ||
      (i.type || '').toLowerCase().includes(q)
    );
  }, [tab, events, workshops, courses, query]);

  // Always use full URL for local uploads
  const BASE_URL = `http://${IP_ADDRESS}:5000`;
  const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

  const renderItem = ({ item }) => {
    const type = tab === 'events' ? 'Event' : tab === 'workshops' ? 'Workshop' : 'Course';
    const seatsBadge = tab !== 'courses' && item.seats != null ? `${item.seats} seats left` : undefined;
    const points = item.points != null ? item.points : 50;
    // Always use thumbnail for the card image, robust for all types
    const img = getFullUrl(item.thumbnail) || getFullUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop';
    const chipBg = type === 'Event' ? '#10B981' : type === 'Workshop' ? '#8B5CF6' : '#3B82F6';
    return (
      <Card image={img} badge={seatsBadge} onPress={() => navigation.navigate(
        tab === 'events' ? 'EventViewer' : tab === 'workshops' ? 'WorkshopViewer' : 'CourseDetail',
        { [tab === 'courses' ? 'course' : tab.slice(0, -1)]: item }
      )}>
        {/* Body */}
        <View style={styles.bodyRow}>
          <View style={[styles.typeChip, { backgroundColor: chipBg }]}><Text style={styles.typeChipText}>{type}</Text></View>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}><Text style={styles.metaIcon}>📅</Text><Text style={styles.metaText}>{item.date || 'TBA'}</Text></View>
          <View style={styles.metaRow}><Text style={styles.metaIcon}>⏰</Text><Text style={styles.metaText}>{item.time || item.duration || 'Flexible'}</Text></View>
          <View style={styles.metaRow}><Text style={styles.metaIcon}>🎥</Text><Text style={styles.metaText}>{item.location || 'Online'}</Text></View>
        </View>
        <View style={styles.cardFooter}>
          <Price amount={item.price || 0} points={points} />
          <Text style={styles.cardCta}>View details →</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Sticky header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activities</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <View style={{ position:'relative' }}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search activities..."
            placeholderTextColor={COLOR_SCHEME.textSecondary}
            style={[styles.searchInput, { paddingLeft: 40 }]}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Tab label="Events" active={tab==='events'} onPress={() => setTab('events')} />
        <Tab label="Workshops" active={tab==='workshops'} onPress={() => setTab('workshops')} />
        <Tab label="Courses" active={tab==='courses'} onPress={() => setTab('courses')} />
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(item, idx) => item._id || item.id?.toString() || String(idx)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLOR_SCHEME.textPrimary },
  searchBox: { padding: 16 },
  searchInput: {
    backgroundColor: COLOR_SCHEME.secondaryGray,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: COLOR_SCHEME.textPrimary,
  },
  searchIcon: { position:'absolute', left: 12, top: 12, fontSize: 20, color: COLOR_SCHEME.textSecondary },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tabTrigger: {
    flex: 1,
    height: 38,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTriggerActive: {
    backgroundColor: COLOR_SCHEME.primaryPurple,
  },
  tabTriggerText: { color: COLOR_SCHEME.textSecondary, fontWeight: '600' },
  tabTriggerTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hero: { height: 160, backgroundColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden', marginBottom: 10 },
  heroImg: { position:'absolute', left:0, right:0, top:0, bottom:0, width:'100%', height:'100%' },
  heroOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  badgeRight: { position: 'absolute', right: 8, top: 8, backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeRightText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seatBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  seatText: { color: COLOR_SCHEME.primaryPurple, fontWeight: '700', fontSize: 12 },
  bodyRow: { gap: 6 },
  typeChip: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  typeChipText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLOR_SCHEME.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaIcon: { fontSize: 14 },
  metaText: { color: COLOR_SCHEME.textSecondary },
  cardFooter: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardCta: { color: COLOR_SCHEME.primaryPurple, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { color: COLOR_SCHEME.textPrimary, fontWeight: '700' },
  pointsPill: { backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  pointsText: { color: '#92400E', fontWeight: '700', fontSize: 12 },
});

export default ActivitiesScreen;
