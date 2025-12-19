import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking, ActivityIndicator, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { workshopAPI } from '../services/api';
import { CONFIG } from '../utils/config';
import { IP_ADDRESS } from '../config/ipConfig';

const WorkshopViewerScreen = ({ route, navigation }) => {
  const { workshop } = route.params;
  const [registering, setRegistering] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const isUpcoming = workshop.startDate && new Date(workshop.startDate) > new Date();
  const isVirtual = workshop.metadata?.type === 'virtual' || workshop.metadata?.location === 'Virtual';
  const daysLeft = isUpcoming ? Math.ceil((new Date(workshop.startDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const isRegistered = !!workshop.hasRegistered;
  // Always use full URL for local uploads (derive from CONFIG.API_BASE_URL)
  const BASE_URL = (CONFIG.API_BASE_URL || '').replace(/\/api\/?$/i, '') || `http://${IP_ADDRESS}:5000`;
  const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;
  const image = getFullUrl(workshop.coverImage) || getFullUrl(workshop.imageUrl) || getFullUrl(workshop.thumbnail) || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop';

  useEffect(() => { if (isRegistered) loadMaterials(); }, []);

  const loadMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const response = await workshopAPI.getWorkshopMaterials(workshop._id);
      setMaterials(response.data.materials || []);
    } catch (error) {
      // noop
    } finally { setLoadingMaterials(false); }
  };

  const onBack = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MyLearning'));

  const handleRegister = async () => {
    if (workshop.price && workshop.price > 0) {
      navigation.navigate('Payment', { item: workshop, type: 'workshop', amount: workshop.price });
      return;
    }
    try {
      setRegistering(true);
      await workshopAPI.registerForWorkshop(workshop._id, { paymentId: 'free', paymentMethod: 'free' });
      Alert.alert(
        'Awesome! You are registered successfully',
        'You have been enrolled in this workshop.',
        [
          {
            text: 'Go to My Learning',
            onPress: () => {
              navigation.navigate('MyLearning');
            },
            style: 'default',
          },
        ]
      );
    } catch (error) {
      // If already enrolled, show a friendly message and redirect
      if (error?.response?.data?.message?.toLowerCase().includes('already')) {
        Alert.alert(
          'Already Enrolled',
          'You have already enrolled in this workshop.',
          [
            {
              text: 'Go to My Learning',
              onPress: () => navigation.navigate('MyLearning'),
              style: 'default',
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to register for workshop');
      }
    } finally { setRegistering(false); }
  };

  const handleJoinWorkshop = () => {
    if (isVirtual && workshop.metadata?.zoomLink) { Linking.openURL(workshop.metadata.zoomLink); }
    else { Alert.alert('Join Workshop', 'Zoom link not available yet.'); }
  };

  const handleGetDirections = () => {
    if (!isVirtual && workshop.metadata?.venue?.coordinates) {
      const { lat, lng } = workshop.metadata.venue.coordinates; Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    } else if (!isVirtual && workshop.metadata?.venue?.address) { const address = encodeURIComponent(workshop.metadata.venue.address); Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`); }
    else { Alert.alert('Error', 'Venue location not available'); }
  };

  // Helper to open video player
  const handleWatchVideo = () => {
    if (workshop.videoUrl) {
      navigation.navigate('VideoPlayer', {
        videoUrl: getFullUrl(workshop.videoUrl),
        title: workshop.title,
        workshopId: workshop._id
      });
    } else {
      Alert.alert('No Video', 'No video is available for this workshop.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}><TouchableOpacity onPress={onBack} style={{ padding: 6 }}><Text style={{ fontSize: 16 }}>‹ Back</Text></TouchableOpacity></View>

      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: image }} style={styles.heroImg} />
        <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
        <View style={styles.heroText}>
          <View style={[styles.typeChip,{ backgroundColor:'#8B5CF6' }]}><Text style={styles.typeChipText}>Workshop</Text></View>
          <Text style={styles.title}>{workshop.title}</Text>
        </View>
      </View>

      {/* Watch Video Button (if videoUrl present and user is registered) */}
      {isRegistered && !!workshop.videoUrl && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <TouchableOpacity style={{ backgroundColor: '#6366F1', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999 }} onPress={handleWatchVideo}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>▶ Watch Video</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {isRegistered && isUpcoming && (
          <View style={[styles.statusCard,{ backgroundColor:'#FFF7ED', borderColor:'#FB923C' }]}>...
            <Text style={{ color:'#7C2D12', fontWeight:'800' }}>{daysLeft} days left</Text>
            <Text style={{ color:'#7C2D12', marginTop:4 }}>{isVirtual ? 'Virtual workshop' : 'In-person workshop'}</Text>
          </View>
        )}

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workshop Details</Text>
          <View style={styles.row}><Text style={styles.icon}>📅</Text><Text style={styles.meta}>{workshop.startDate ? new Date(workshop.startDate).toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', year:'numeric' }) : 'TBA'}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>⏰</Text><Text style={styles.meta}>{workshop.metadata?.startTime || 'TBA'}{workshop.metadata?.endTime ? ` - ${workshop.metadata.endTime}` : ''}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>📍</Text><Text style={styles.meta}>{isVirtual ? 'Virtual (Zoom)' : (workshop.metadata?.venue?.name || 'TBA')}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>👩‍🏫</Text><Text style={styles.meta}>{workshop.mentors?.[0]?.name || 'TBA'}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>💰</Text><Text style={styles.meta}>{workshop.price ? `₹${workshop.price}` : 'Free'}</Text></View>
        </View>

        {/* About & Learning outcomes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Workshop</Text>
          <Text style={styles.desc}>{workshop.description || 'Hands-on session to sharpen your skills with guidance from experts.'}</Text>
          {Array.isArray(workshop.metadata?.learningOutcomes) && workshop.metadata.learningOutcomes.length > 0 && (
            <View style={{ marginTop:12 }}>
              <Text style={[styles.cardTitle,{ marginBottom:8 }]}>What You’ll Learn</Text>
              {workshop.metadata.learningOutcomes.map((o, i) => (<Text key={i} style={styles.meta}>• {o}</Text>))}
            </View>
          )}
        </View>

        {/* Materials for registered users */}
        {isRegistered && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Materials</Text>
            {loadingMaterials ? <ActivityIndicator color="#6366F1" /> : (
              materials.length > 0 ? materials.map((m, i) => (
                <TouchableOpacity key={i} style={styles.materialRow} onPress={() => (m.url ? Linking.openURL(m.url) : Alert.alert('Download', `Downloading: ${m.title}`))}>
                  <Text style={{ fontSize:18 }}>⬇️</Text>
                  <View style={{ marginLeft:10, flex:1 }}>
                    <Text style={{ fontWeight:'700', color:'#111827' }}>{m.title}</Text>
                    {m.description ? <Text style={{ color:'#4B5563' }}>{m.description}</Text> : null}
                  </View>
                </TouchableOpacity>
              )) : <Text style={styles.meta}>No materials available yet.</Text>
            )}
          </View>
        )}

        {/* Requirements */}
        {isRegistered && (
          <View style={[styles.card,{ backgroundColor:'#EFF6FF', borderColor:'#93C5FD' }]}>
            <Text style={[styles.cardTitle,{ color:'#1E3A8A' }]}>Requirements</Text>
            {isVirtual ? (
              <>
                <Text style={[styles.meta,{ color:'#1E3A8A' }]}>• Stable internet connection</Text>
                <Text style={[styles.meta,{ color:'#1E3A8A' }]}>• Zoom installed</Text>
                <Text style={[styles.meta,{ color:'#1E3A8A' }]}>• Webcam & microphone</Text>
              </>
            ) : (
              <>
                <Text style={[styles.meta,{ color:'#1E3A8A' }]}>• Valid ID proof</Text>
                <Text style={[styles.meta,{ color:'#1E3A8A' }]}>• Notebook & pen</Text>
                <Text style={[styles.meta,{ color:'#1E3A8' }]}>• Arrive 15 minutes early</Text>
              </>
            )}
          </View>
        )}

        <View style={{ height: 80 }} />
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>{workshop.price ? `₹${workshop.price}` : 'Free'}</Text>
        </View>
        {isRegistered ? (
          <View style={styles.encouragementCardSoft}>
            <Text style={styles.encouragementTextSoft}>
              🚀 You’re registered!
            </Text>
            <Text style={styles.encouragementSubtextSoft}>
              Thanks for joining this workshop. Dive in, learn, and make the most of this <Text style={{ fontWeight: 'bold', color: '#111827' }}>opportunity!</Text>
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={registering}><Text style={styles.primaryBtnText}>{registering ? 'Booking…' : 'Book Now'}</Text></TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  encouragementCardSoft: {
    backgroundColor: '#e0fcff',
    borderRadius: 14,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0ff1ce',
  },
  encouragementTextSoft: {
    color: '#0bbfcf',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  encouragementSubtextSoft: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  container: { flex:1, backgroundColor:'#F9FAFB' },
  header: { backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#E5E7EB', paddingHorizontal:16, paddingVertical:12 },
  hero: { height:256, position:'relative' },
  heroImg: { position:'absolute', left:0, right:0, top:0, bottom:0, width:'100%', height:'100%' },
  heroOverlay: { position:'absolute', left:0, right:0, top:0, bottom:0 },
  heroText: { position:'absolute', left:16, right:16, bottom:16 },
  typeChip: { alignSelf:'flex-start', paddingHorizontal:10, paddingVertical:6, borderRadius:999, marginBottom:8 },
  typeChipText: { color:'#fff', fontWeight:'800', fontSize:12 },
  title: { color:'#fff', fontWeight:'800', fontSize:22 },
  content: { padding:16 },
  statusCard: { borderWidth:1, borderRadius:12, padding:12, marginBottom:12 },
  card: { backgroundColor:'#fff', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:16, marginBottom:12 },
  cardTitle: { fontWeight:'800', color:'#111827', marginBottom:10, fontSize:16 },
  row: { flexDirection:'row', alignItems:'center', marginBottom:8, gap:8 },
  icon: { fontSize:16 },
  meta: { color:'#4B5563' },
  desc: { color:'#4B5563', lineHeight:20 },
  materialRow: { flexDirection:'row', alignItems:'center', paddingVertical:10 },
  bottomBar: { position:'absolute', left:0, right:0, bottom:0, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#E5E7EB', paddingHorizontal:16, paddingVertical:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  primaryBtn: { backgroundColor:'#F97316', paddingHorizontal:18, paddingVertical:12, borderRadius:999 },
  primaryBtnText: { color:'#fff', fontWeight:'800' },
  totalLabel: { color:'#6B7280', fontSize:12 },
  totalVal: { color:'#111827', fontWeight:'800', fontSize:18 },
});

export default WorkshopViewerScreen;