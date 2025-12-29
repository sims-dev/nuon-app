import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft, Calendar, Filter, Play, FileText, ImageIcon } from 'lucide-react-native';
import { newsAPI } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';

const BASE_URL = `http://${IP_ADDRESS}:5000`;

const NewsViewerScreen = ({ navigation }) => {
  const [filterDate, setFilterDate] = useState('all');
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getLatest();
      const items = response?.data || [];
      setNewsItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Play size={16} color="#DC2626" />;
      case 'article':
        return <FileText size={16} color="#2563EB" />;
      default:
        return <ImageIcon size={16} color="#7C3AED" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#DC2626' };
      case 'article':
        return { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', textColor: '#2563EB' };
      default:
        return { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF', textColor: '#7C3AED' };
    }
  };

  const filteredNews = filterDate === 'all'
    ? newsItems
    : newsItems.filter(item => {
        const itemDate = new Date(item.publishedAt || item.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

        if (filterDate === 'week') return diffDays <= 7;
        if (filterDate === 'month') return diffDays <= 30;
        return true;
      });

  const handleNewsPress = (item) => {
    navigation.navigate('NewsDetail', { item });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#7C3AED', '#EC4899', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News & Announcements</Text>
        <Text style={styles.headerSubtitle}>Stay updated with latest healthcare insights</Text>
      </LinearGradient>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <Filter size={20} color="#6B7280" />
          <TouchableOpacity
            style={[styles.filterButton, filterDate === 'all' && styles.activeFilter]}
            onPress={() => setFilterDate('all')}
          >
            <Text style={[styles.filterText, filterDate === 'all' && styles.activeFilterText]}>All Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterDate === 'week' && styles.activeFilter]}
            onPress={() => setFilterDate('week')}
          >
            <Text style={[styles.filterText, filterDate === 'week' && styles.activeFilterText]}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterDate === 'month' && styles.activeFilter]}
            onPress={() => setFilterDate('month')}
          >
            <Text style={[styles.filterText, filterDate === 'month' && styles.activeFilterText]}>This Month</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.articleCount}>{filteredNews.length} articles</Text>
      </View>

      {/* News Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.newsGrid}>
          {filteredNews.map((item) => {
            const type = item.type || item.category || 'article';
            const colors = getTypeColor(type);

            // Get thumbnail from images array, videos array, or fallback
            let imageUrl = null;
            if (item.images && item.images.length > 0 && item.images[0].url) {
              imageUrl = item.images[0].url;
            } else if (item.videos && item.videos.length > 0 && item.videos[0].thumbnail) {
              imageUrl = item.videos[0].thumbnail;
            } else if (item.imageUrl) {
              imageUrl = item.imageUrl;
            } else if (item.thumbnail) {
              imageUrl = item.thumbnail;
            }

            const fullImageUrl = imageUrl && imageUrl.startsWith('/uploads') ? `${BASE_URL}${imageUrl}` : imageUrl;

            return (
              <TouchableOpacity
                key={item._id || item.id}
                style={styles.newsCard}
                onPress={() => handleNewsPress(item)}
                activeOpacity={0.9}
              >
                {/* Image */}
                <View style={styles.imageContainer}>
                  {fullImageUrl ? (
                    <Image source={{ uri: fullImageUrl }} style={styles.newsImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <ImageIcon size={32} color="#9CA3AF" />
                    </View>
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)']}
                    style={styles.imageOverlay}
                  />
                  {type === 'video' && (
                    <View style={styles.playButton}>
                      <Play size={20} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.badgesRow}>
                    <View style={[styles.typeBadge, { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor }]}>
                      <Text style={[styles.typeBadgeText, { color: colors.textColor }]}>
                        {type}
                      </Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category || 'News'}</Text>
                    </View>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.newsDescription} numberOfLines={2}>{item.description || item.excerpt || item.content?.substring(0, 100)}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Calendar size={12} color="#6B7280" />
                      <Text style={styles.metaText}>
                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                    <Text style={styles.readTime}>
                      {item.readingTime || Math.max(1, Math.min(10, Math.round((item.content || '').length / 600)))} min read
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredNews.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <FileText size={40} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No articles found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 48,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  articleCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  newsGrid: {
    gap: 16,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    height: 128,
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  newsDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  readTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default NewsViewerScreen;
