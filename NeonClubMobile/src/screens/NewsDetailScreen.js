import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { activitiesAPI, getCurrentBaseURL, getFullMediaUrl } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const BASE_URL = getCurrentBaseURL().replace('/api', '');

const Row = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Text style={{ fontSize: 14 }}>{icon}</Text>
    <Text style={{ color: '#64748B' }}>{label}</Text>
  </View>
);

const NewsDetailScreen = ({ route, navigation }) => {
   const { item } = route.params || {};
   const [playing, setPlaying] = useState(false);
   const [videoError, setVideoError] = useState(false);
   const [videoLoading, setVideoLoading] = useState(true);

  // Get image from images array or fallback
  let image = null;
  if (item?.images && item.images.length > 0) {
    image = getFullMediaUrl(item.images[0].url);
  } else if (item?.imageUrl) {
    image = getFullMediaUrl(item.imageUrl);
  } else if (item?.thumbnail) {
    image = getFullMediaUrl(item.thumbnail);
  }

  // Get video from videos array
  const video = item?.videos && item.videos.length > 0 ? item.videos[0] : null;

  const getFullUrl = (url) => {
    return getFullMediaUrl(url);
  };

  const type = item?.category || 'News';
  const date = new Date(item?.publishedAt || item?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const readingTime = item?.readingTime || Math.max(3, Math.min(10, Math.round((item?.content || '').length / 600)));

  const openExternal = () => {
    const url = item?.externalUrl || item?.link || item?.url;
    if (url) {
      try { activitiesAPI.create({ type: 'news-open', title: item?.title, ref: item?._id, meta: { url } }); } catch {}
      try { Linking.openURL(url); } catch {}
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient colors={['#6366F1', '#F43F5E']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack()? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}><Text style={{ color:'#fff', fontSize:18 }}>‹</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Latest News</Text>
        </View>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        {/* Featured badge */}
        {item?.featured && (
          <View style={styles.featuredBanner}>
            <Text style={styles.featuredBannerText}>⭐ Featured Article</Text>
          </View>
        )}

        {/* Cover image/video */}
        {image || video ? (
          <View style={styles.coverWrap}>
            {video && !videoError ? (
              <>
                {videoLoading && (
                  <View style={styles.videoLoading}>
                    <Text style={styles.loadingText}>Loading video...</Text>
                  </View>
                )}
                <Video
                  source={{ uri: getFullUrl(video.url) }}
                  poster={getFullUrl(video.thumbnail) || getFullUrl(image)}
                  paused={!playing}
                  style={styles.cover}
                  resizeMode="cover"
                  onLoadStart={() => setVideoLoading(true)}
                  onLoad={() => {
                    setVideoLoading(false);
                    console.log('Video loaded successfully');
                  }}
                  onEnd={() => setPlaying(false)}
                  onError={(error) => {
                    console.error('Video error:', error);
                    setVideoError(true);
                    setVideoLoading(false);
                  }}
                  controls={playing}
                  playInBackground={false}
                  playWhenInactive={false}
                  bufferConfig={{
                    minBufferMs: 15000,
                    maxBufferMs: 50000,
                    bufferForPlaybackMs: 2500,
                    bufferForPlaybackAfterRebufferMs: 5000,
                  }}
                  maxBitRate={2000000}
                  selectedVideoTrack={{
                    type: "resolution",
                    value: 480
                  }}
                />
                {!playing && !videoLoading && (
                  <TouchableOpacity onPress={() => setPlaying(true)} style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.videoDuration}>
                  <Text style={styles.durationText}>{video.duration || '00:00'}</Text>
                </View>
              </>
            ) : video && videoError ? (
              <View style={styles.videoError}>
                <Text style={styles.errorText}>Video unavailable</Text>
                <TouchableOpacity style={styles.fallbackButton} onPress={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                }}>
                  <Text style={styles.fallbackText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ImageWithFallback src={getFullUrl(image)} alt={item.title} style={styles.cover} />
            )}
            <View style={styles.badge}><Text style={styles.badgeText}>{type}</Text></View>
          </View>
        ) : null}

        <Text style={styles.title}>{item?.title}</Text>
        <View style={{ flexDirection:'row', alignItems:'center', gap: 12, marginBottom: 12 }}>
          <Row icon="📅" label={date} />
          <Row icon="⏱️" label={`${readingTime} min read`} />
          {item?.viewCount > 0 && <Row icon="👁️" label={`${item.viewCount} views`} />}
        </View>

        {/* Tags */}
        {item?.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {item?.excerpt ? <Text style={styles.excerpt}>{item.excerpt}</Text> : null}

        {/* Rich content rendering */}
        {item?.content ? (
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        ) : null}

        {/* Additional images in content */}
        {item?.images && item.images.length > 1 && (
          <View style={styles.galleryContainer}>
            {item.images.slice(1).map((img, index) => (
              <ImageWithFallback key={index} src={getFullUrl(img.url)} alt={item.title} style={styles.galleryImage} />
            ))}
          </View>
        )}

        {/* Multiple videos */}
        {item?.videos && item.videos.length > 1 && (
          <View style={styles.videosContainer}>
            {item.videos.slice(1).map((vid, index) => (
              <TouchableOpacity key={index} style={styles.videoCard} onPress={() => {
                if (vid.url) {
                  navigation.navigate('VideoPlayer', {
                    videoUrl: getFullUrl(vid.url),
                    title: vid.title || item.title,
                    thumbnail: getFullUrl(vid.thumbnail)
                  });
                }
              }}>
                <ImageWithFallback src={getFullUrl(vid.thumbnail)} alt={vid.title || item.title} style={styles.videoThumbnail} />
                <View style={styles.videoOverlay}>
                  <Text style={styles.playIconSmall}>▶</Text>
                </View>
                <Text style={styles.videoTitle} numberOfLines={1}>{vid.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Video play button for news with videos */}
         {video && !videoError && !playing ? (
           <TouchableOpacity style={styles.primaryBtn} onPress={() => setPlaying(true)}>
             <Text style={styles.primaryText}>▶ Play Video</Text>
           </TouchableOpacity>
         ) : (item?.externalUrl || item?.link || item?.url) ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={openExternal}>
            <Text style={styles.primaryText}>Open Article</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 36, paddingBottom: 12, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  featuredBanner: { backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 12 },
  featuredBannerText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  coverWrap: { height: 180, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  cover: { width: '100%', height: '100%' },
  badge: { position:'absolute', left: 12, top: 12, backgroundColor:'#111827', paddingHorizontal:10, paddingVertical:4, borderRadius: 999 },
  badgeText: { color:'#fff', fontWeight:'700', fontSize: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  excerpt: { color: '#475569', marginBottom: 8, fontSize: 16, lineHeight: 24 },
  contentContainer: { marginBottom: 16 },
  content: { color: '#111827', lineHeight: 24, fontSize: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { color: '#6366F1', fontSize: 12, fontWeight: '600' },
  galleryContainer: { marginBottom: 16 },
  galleryImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
  videosContainer: { marginBottom: 16 },
  videoCard: { marginBottom: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  videoThumbnail: { width: '100%', height: 120 },
  videoOverlay: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  playIconSmall: { color: '#fff', fontSize: 16 },
  videoTitle: { padding: 8, fontSize: 14, fontWeight: '600', color: '#111827' },
  videoDuration: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  durationText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  videoLoading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  loadingText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  videoError: { width: '100%', height: '100%', backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#6B7280', fontSize: 16, marginBottom: 12 },
  fallbackButton: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  fallbackText: { color: '#fff', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#7C3AED', borderRadius: 999, paddingVertical: 12, alignItems:'center', marginTop: 16 },
  primaryText: { color:'#fff', fontWeight:'800' },
  playButton: { position:'absolute', top:'50%', left:'50%', marginLeft:-25, marginTop:-25, width:50, height:50, borderRadius:25, backgroundColor:'rgba(0,0,0,0.7)', alignItems:'center', justifyContent:'center' },
  playIcon: { color:'#fff', fontSize:20 },
});

export default NewsDetailScreen;