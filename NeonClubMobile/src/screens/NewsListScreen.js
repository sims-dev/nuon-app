import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { activitiesAPI, newsAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { COLOR_SCHEME } from '../utils/colors';

const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

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

  // Get thumbnail from images array or videos array
  let image = null;
  if (item.images && item.images.length > 0) {
    image = item.images[0].url;
  } else if (item.videos && item.videos.length > 0) {
    image = item.videos[0].thumbnail;
  } else {
    image = item.imageUrl || item.thumbnail;
  }

  const hasVideo = item.videos && item.videos.length > 0;
  const type = hasVideo ? 'video' : 'article';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.thumb}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#9CA3AF', fontSize: 24 }}>📰</Text>
          </View>
        )}
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
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
  const [news, setNews] = useState([
    { title: 'New Healthcare Guidelines 2024', category: 'Guidelines', type: 'video', readMinutes: 5, createdAt: new Date().toISOString(), thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1080&auto=format&fit=crop' },
    { title: 'Breakthrough in Nursing Education', category: 'Education', type: 'article', readMinutes: 8, createdAt: new Date().toISOString(), thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1080&auto=format&fit=crop' },
  ]);
  const [range, setRange] = useState('All Time');

  const fetchNews = async () => {
    try {
      const res = await newsAPI.getLatest();
      let list = res?.data || [];
      if (!Array.isArray(list)) list = [];
      if (list.length === 0) {
        list = [
          { title: 'New Healthcare Guidelines 2024', category: 'Guidelines', type: 'video', readMinutes: 5, createdAt: new Date().toISOString() },
          { title: 'Breakthrough in Nursing Education', category: 'Education', type: 'article', readMinutes: 8, createdAt: new Date().toISOString() },
        ];
      }
      setNews(list);
    } catch (e) {
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

  const filtered = useMemo(() => {
    if (range === 'All Time') return news;
    const now = Date.now();
    const days = range === 'This Month' ? 30 : range === 'This Week' ? 7 : 365;
    return news.filter(n => now - new Date(n.publishedAt || n.createdAt || now).getTime() < days*86400000);
  }, [range, news]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Gradient header */}
      <LinearGradient colors={['#6366F1', '#F43F5E']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}><Text style={{ color:'#fff', fontSize: 18 }}>‹</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>News & Announcements</Text>
        </View>
        <Text style={styles.headerSub}>Stay updated with latest healthcare insights</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.filterLeft}> 
          <Text style={styles.filterIcon}>🔎</Text>
          <Chip label="All Time" active={range==='All Time'} onPress={() => setRange('All Time')} />
          <Chip label="This Month" active={range==='This Month'} onPress={() => setRange('This Month')} />
          <Chip label="This Week" active={range==='This Week'} onPress={() => setRange('This Week')} />
        </View>
        <Text style={styles.countText}>{filtered.length} articles</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            onPress={() => navigation.navigate('NewsViewer', { item })}
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
  header: { paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#F1F5F9', marginTop: 8 },
  filtersRow: { flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', padding: 12 },
  filterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterIcon: { fontSize: 16, color: COLOR_SCHEME.textSecondary },
  countText: { color: COLOR_SCHEME.textSecondary },
  chip: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  chipActive: { backgroundColor: '#EEF2FF' },
  chipText: { color: COLOR_SCHEME.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLOR_SCHEME.primaryPurple },
  card: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } } }) },
  thumb: { width: 96, height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  featuredBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  featuredText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  title: { fontWeight: '800', fontSize: 15, color: COLOR_SCHEME.textPrimary, marginBottom: 4 },
  excerpt: { color: COLOR_SCHEME.textSecondary, marginBottom: 8, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: COLOR_SCHEME.textSecondary },
  dot: { color: '#CBD5E1' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});

export default NewsListScreen;
