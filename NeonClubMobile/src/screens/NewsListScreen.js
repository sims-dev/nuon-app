import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Platform, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import api, { activitiesAPI, newsAPI, getCurrentBaseURL, getFullMediaUrl } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { COLOR_SCHEME } from '../utils/colors';
import { IP_ADDRESS } from '../config/ipConfig';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const Badge = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color || '#EEF2FF' }]}>
    <Text style={[styles.badgeText, { color: color ? '#fff' : COLOR_SCHEME.primaryPurple }]}>{label}</Text>
  </View>
);

const NewsCard = ({ item, onPress }) => {
  const date = item.publishedAt || item.createdAt;
  const d = date ? new Date(date) : new Date();
  const when = d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const read = item.readingTime || item.readMinutes || Math.max(3, Math.min(10, Math.round((item.content || '').length / 600)));

  // Get thumbnail from images array or videos array with fallback
  let image = null;
  if (item.images && item.images.length > 0 && item.images[0].url) {
    image = getFullMediaUrl(item.images[0].url);
  } else if (item.videos && item.videos.length > 0 && item.videos[0].thumbnail) {
    image = getFullMediaUrl(item.videos[0].thumbnail);
  } else if (item.imageUrl) {
    image = getFullMediaUrl(item.imageUrl);
  } else if (item.thumbnail) {
    image = getFullMediaUrl(item.thumbnail);
  } else {
    // Fallback placeholder
    image = `https://via.placeholder.com/300x160/6B7280/FFFFFF?text=${item.title?.substring(0, 10) || 'News'}`;
  }

  const hasVideo = item.videos && item.videos.length > 0;
  const type = hasVideo ? 'video' : 'article';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.thumb}>
        <ImageWithFallback
          src={image}
          alt={item.title}
          style={{ width: '100%', height: '100%' }}
        />
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}
        {hasVideo && (
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
          <Badge label={type} color={hasVideo ? '#F43F5E' : '#6366F1'} />
          {item.category && <Badge label={item.category} />}
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.excerpt ? <Text style={styles.excerpt} numberOfLines={2}>{item.excerpt}</Text> : null}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {when}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{read} min read</Text>
          {item.viewCount > 0 && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>👁️ {item.viewCount}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewsListScreen = ({ navigation }) => {
   const [news, setNews] = useState([]);
   const BASE_URL = getCurrentBaseURL().replace('/api', '');

  const fetchNews = async () => {
    try {
          const res = await newsAPI.getLatest();
          let list = res?.data || [];
          if (!Array.isArray(list)) list = [];
          setNews(list);
    } catch (e) {
      console.log('[NewsListScreen] Error fetching news:', e);
      try { await activitiesAPI.create({ type:'error', title:'news-fetch-failed', meta:{ message: String(e?.message||e) } }); } catch {}
    }
  };

  useEffect(() => {
    fetchNews();
    const sock = connectSocket();
    const off1 = onSocket('new_news', fetchNews);
    const off2 = onSocket('news_update', fetchNews);
    return () => { try { off1 && off1(); off2 && off2(); } catch {} disconnectSocket(); };
  }, []);

  const filtered = news;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Gradient header */}
      <LinearGradient colors={['#6366F1', '#F43F5E']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}><Text style={{ color:'#fff', fontSize: 24 }}>‹</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>News & Announcements</Text>
        </View>
        <Text style={styles.headerSub}>Stay updated with latest healthcare insights</Text>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            onPress={() => {
              navigation.navigate('NewsDetail', { item });
            }}
          />
        )}
        initialNumToRender={6}
        windowSize={7}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  headerSub: { color: '#F1F5F9', marginTop: 8 },
  filtersRow: { flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIconGray: {
    fontSize: 20,
    color: '#6B7280',
  },
  filterDropdown: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: 140,
  },
  filterDropdownText: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  dropdownArrow: { 
    fontSize: 10, 
    color: '#6B7280',
  },
  countText: { 
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 66,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    paddingVertical: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 6,
    marginVertical: 1,
    borderRadius: 6,
  },
  dropdownItemSelected: {
    backgroundColor: '#EDE9FE',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemActiveText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  card: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } } }) },
  thumb: { width: 96, height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  featuredBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  featuredText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  playButton: { position: 'absolute', top: '50%', left: '50%', marginLeft: -15, marginTop: -15, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: '#fff', fontSize: 16 },
  title: { fontWeight: '800', fontSize: 15, color: COLOR_SCHEME.textPrimary, marginBottom: 4 },
  excerpt: { color: COLOR_SCHEME.textSecondary, marginBottom: 8, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: COLOR_SCHEME.textSecondary },
  dot: { color: '#CBD5E1' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});

export default NewsListScreen;
