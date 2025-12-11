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
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import api from '../services/api';
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

const Learning = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('Priya');

  useEffect(() => {
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) {
        const firstName = parsed.fullName.split(' ')[0];
        setDisplayName(firstName);
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: "Advanced Patient Care & Management",
      description: "Master advanced patient care techniques with comprehensive training on critical care management, emergency response, and patient monitoring systems.",
      instructor: "Dr. Sarah Johnson",
      type: "Professional Development",
      duration: "8 weeks",
      price: 2999,
      points: 500,
      enrolled: 234,
      image: "https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Clinical Skills",
      level: "Advanced",
      modules: 24,
      certificate: true,
    },
    {
      id: 2,
      title: "Medication Management Fundamentals",
      description: "Learn essential medication administration, dosage calculations, drug interactions, and safety protocols for effective patient care.",
      instructor: "Nurse Priya Singh",
      type: "Clinical Skills",
      duration: "4 weeks",
      price: 1999,
      points: 300,
      enrolled: 567,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Medication Safety",
      level: "Intermediate",
      modules: 12,
      certificate: true,
    },
    {
      id: 3,
      title: "Emergency Response & Critical Care",
      description: "Comprehensive training in emergency response protocols, critical care management, and life-saving interventions for acute patient conditions.",
      instructor: "Dr. Rajesh Kumar",
      type: "Emergency Care",
      duration: "6 weeks",
      price: 3499,
      points: 600,
      enrolled: 189,
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Critical Care",
      level: "Advanced",
      modules: 18,
      certificate: true,
    },
    {
      id: 4,
      title: "Nursing Documentation Essentials",
      description: "Master accurate and comprehensive patient documentation, charting techniques, and legal requirements for nursing practice.",
      instructor: "Nurse Kavita Sharma",
      type: "Professional Development",
      duration: "3 weeks",
      price: 0,
      points: 150,
      enrolled: 891,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Documentation",
      level: "Beginner",
      modules: 8,
      certificate: true,
    },
    {
      id: 5,
      title: "Pediatric Nursing Specialization",
      description: "Specialized training in pediatric care, child development, family-centered care, and age-specific nursing interventions.",
      instructor: "Dr. Meera Patel",
      type: "Specialization",
      duration: "10 weeks",
      price: 4999,
      points: 800,
      enrolled: 145,
      image: "https://images.unsplash.com/photo-1614964157925-8fd859e6d3b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Pediatrics",
      level: "Advanced",
      modules: 30,
      certificate: true,
    },
    {
      id: 6,
      title: "Infection Control & Prevention",
      description: "Essential training on infection prevention protocols, sterilization techniques, and maintaining a safe healthcare environment.",
      instructor: "Dr. Anjali Reddy",
      type: "Clinical Skills",
      duration: "2 weeks",
      price: 0,
      points: 100,
      enrolled: 1234,
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Safety",
      level: "Beginner",
      modules: 6,
      certificate: true,
    },
  ];

  const events = [
    {
      id: 1,
      title: "National Nursing Conference 2024",
      description: "Join the premier gathering of nursing professionals featuring keynote speeches, workshops, and networking opportunities to advance your career.",
      type: "Conference",
      date: "Dec 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "India Habitat Centre, Delhi",
      price: 3500,
      points: 600,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 150,
      category: "Conference",
      speakers: "15+ Healthcare Leaders",
    },
    {
      id: 2,
      title: "Future of Healthcare Webinar",
      description: "Explore emerging trends in healthcare technology, digital transformation, and innovative nursing practices with industry experts.",
      type: "Webinar",
      date: "Nov 25, 2024",
      time: "4:00 PM - 6:00 PM",
      location: "Online (Zoom)",
      price: 0,
      points: 100,
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 500,
      category: "Professional Growth",
      speakers: "Dr. Sharma & Team",
    },
    {
      id: 3,
      title: "Clinical Excellence Summit",
      description: "A comprehensive summit focusing on clinical best practices, patient safety, and excellence in nursing care delivery.",
      type: "Summit",
      date: "Jan 15-16, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Mumbai Convention Center",
      price: 2500,
      points: 400,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 200,
      category: "Clinical Excellence",
      speakers: "20+ Industry Experts",
    },
    {
      id: 4,
      title: "Nurse Leadership Forum 2024",
      description: "Develop leadership skills and network with nursing leaders to advance your career in healthcare management and administration.",
      type: "Forum",
      date: "Dec 5, 2024",
      time: "2:00 PM - 7:00 PM",
      location: "Bangalore International Centre",
      price: 1500,
      points: 250,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 100,
      category: "Leadership",
      speakers: "10+ Nursing Leaders",
    },
  ];

  const workshops = [
    {
      id: 1,
      title: "Advanced Wound Care Management",
      description: "Learn advanced wound assessment, dressing techniques, infection prevention, and evidence-based wound care management protocols.",
      instructor: "Dr. Anjali Reddy",
      type: "Hands-on Workshop",
      date: "Nov 28, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "AIIMS Training Center, Delhi",
      price: 2500,
      points: 350,
      enrolled: 45,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 30,
      category: "Clinical Skills",
      duration: "6 hours",
      materials: "Provided",
    },
    {
      id: 2,
      title: "IV Therapy & Venipuncture Techniques",
      description: "Master intravenous therapy, venipuncture procedures, catheter insertion, and maintenance of IV access devices.",
      instructor: "Nurse Kumar Patel",
      type: "Practical Training",
      date: "Dec 2, 2024",
      time: "9:00 AM - 2:00 PM",
      location: "Medical Training Institute, Mumbai",
      price: 1999,
      points: 280,
      enrolled: 67,
      image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 25,
      category: "Technical Skills",
      duration: "5 hours",
      materials: "Provided",
    },
    {
      id: 3,
      title: "ECG Interpretation Workshop",
      description: "Develop skills in electrocardiogram interpretation, arrhythmia recognition, and emergency cardiac care interventions.",
      instructor: "Dr. Meera Singh",
      type: "Live Workshop",
      date: "Dec 8, 2024",
      time: "11:00 AM - 5:00 PM",
      location: "Virtual (Zoom)",
      price: 1499,
      points: 200,
      enrolled: 189,
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 100,
      category: "Diagnostic Skills",
      duration: "6 hours",
      materials: "Digital Resources",
    },
    {
      id: 4,
      title: "Patient Communication Skills",
      description: "Enhance therapeutic communication, patient education, and interpersonal skills for effective nurse-patient relationships.",
      instructor: "Dr. Sarah Johnson",
      type: "Interactive Workshop",
      date: "Nov 30, 2024",
      time: "3:00 PM - 6:00 PM",
      location: "Online",
      price: 0,
      points: 120,
      enrolled: 423,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 200,
      category: "Soft Skills",
      duration: "3 hours",
      materials: "Free PDF Guide",
    },
    {
      id: 5,
      title: "Neonatal Care Basics",
      description: "Comprehensive training in newborn assessment, neonatal resuscitation, and specialized care for premature and ill infants.",
      instructor: "Dr. Priya Sharma",
      type: "Hands-on Workshop",
      date: "Dec 15, 2024",
      time: "10:00 AM - 5:00 PM",
      location: "Apollo Hospital Training Center, Bangalore",
      price: 3500,
      points: 450,
      enrolled: 34,
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 20,
      category: "Neonatal Care",
      duration: "7 hours",
      materials: "Equipment Provided",
    },
  ];

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    let data = [];
    if (activeTab === 'courses') data = courses;
    else if (activeTab === 'events') data = events;
    else if (activeTab === 'workshops') data = workshops;

    return data.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.instructor?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  };

  const renderItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('LearningDetails', {
        type: activeTab === 'courses' ? 'course' : activeTab === 'events' ? 'event' : 'workshop',
        data: item
      });
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
            style={styles.cardImageOverlay}
          />
          {item.level && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{item.level}</Text>
            </View>
          )}
          {item.price === 0 && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          )}
          {item.certificate && (
            <View style={styles.certificateBadge}>
              <SvgXml xml={awardSvg} width={12} height={12} color="#fff" />
              <Text style={styles.certificateBadgeText}>Certificate</Text>
            </View>
          )}
          {item.seats && item.seats < 30 && activeTab === 'workshops' && (
            <View style={styles.seatsBadge}>
              <Text style={styles.seatsBadgeText}>{item.seats} seats left</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
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

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardInstructor}>by {item.instructor}</Text>

          {/* Description */}
          {item.description && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.cardMeta}>
            {item.modules && (
              <View style={styles.metaItem}>
                <SvgXml xml={bookOpenSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.modules} modules</Text>
              </View>
            )}
            {item.duration && (
              <View style={styles.metaItem}>
                <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
            )}
            {item.enrolled && (
              <View style={styles.metaItem}>
                <SvgXml xml={usersSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.enrolled}</Text>
              </View>
            )}
            {item.date && (
              <View style={styles.metaItem}>
                <SvgXml xml={calendarSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
            )}
            {item.time && (
              <View style={styles.metaItem}>
                <SvgXml xml={clockSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            )}
            {item.location && (
              <View style={styles.metaItem}>
                <SvgXml xml={mapPinSvg} width={14} height={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              {item.price === 0 ? (
                <Text style={styles.freePrice}>Free</Text>
              ) : (
                <View style={styles.priceWrapper}>
                  <SvgXml xml={indianRupeeSvg} width={16} height={16} color="#111827" />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              )}
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>+{item.points} pts</Text>
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

      <View style={styles.content}>
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
              color={activeTab === 'courses' ? '#fff' : '#6B7280'}
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
              color={activeTab === 'events' ? '#fff' : '#6B7280'}
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
              color={activeTab === 'workshops' ? '#fff' : '#6B7280'}
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
        <FlatList
          data={filteredData()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeTab} available</Text>
            </View>
          }
        />
      </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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