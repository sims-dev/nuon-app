import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { conferenceAPI } from '../services/api';
import { IP_ADDRESS } from '../../config/ipConfig';

// Always use full URL for local uploads
const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const ConferenceViewerScreen = ({ route, navigation }) => {
  const { conference } = route.params;
  const [registering, setRegistering] = useState(false);

  const onBack = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MyLearning'));

  const handleRegister = async () => {
    if (conference.price > 0) {
      navigation.navigate('Payment', { item: conference, type: 'conference', amount: conference.price });
    } else {
      try {
        setRegistering(true);
        await conferenceAPI.registerForConference(conference._id, { paymentId: 'free', paymentMethod: 'free' });
        // After successful registration, redirect to My Learning and reload data
        Alert.alert('Application Submitted!', 'You are registered for this conference.', [
          {
            text: 'Go to My Learning',
            onPress: () => {
              navigation.navigate('MyLearning', { reload: true });
            }
          }
        ]);
      } catch (error) {
        // Show backend error message if available
        let msg = 'Failed to register for conference';
        if (error?.response?.data?.message) {
          msg = error.response.data.message;
        }
        Alert.alert('Error', msg);
      } finally {
        setRegistering(false);
      }
    }
  };

  const handleGetDirections = () => {
    if (conference.venue?.coordinates) {
      const { lat, lng } = conference.venue.coordinates;
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    } else if (conference.venue?.address) {
      const address = encodeURIComponent(conference.venue.address);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    } else {
      Alert.alert('Error', 'Venue location not available');
    }
  };

  const isUpcoming = conference.date ? new Date(conference.date) > new Date() : true;
  // Always treat as registered if hasRegistered is true (from My Learning)
  const isRegistered = !!conference.hasRegistered;
  const image = getFullUrl(conference.thumbnail) || getFullUrl(conference.imageUrl) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <TouchableOpacity onPress={onBack} style={{ padding: 6 }}><Text style={{ fontSize: 16 }}>‹ Back</Text></TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}> 
        <Image source={{ uri: image }} style={styles.heroImg} />
        <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
        <View style={styles.heroText}> 
          <View style={styles.typeChip}><Text style={styles.typeChipText}>Conference</Text></View>
          <Text style={styles.title}>{conference.title}</Text>
        </View>
      </View>

      <View style={styles.content}> 
        {/* Status */}
        {isRegistered ? (
          <View style={[styles.statusCard, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
            <Text style={{ color:'#065F46', fontWeight:'700' }}>✓ Registered</Text>
            <Text style={{ color:'#065F46', marginTop:4 }}>We'll remind you before the conference.</Text>
          </View>
        ) : null}

        {/* Details */}
        <View style={styles.card}> 
          <Text style={styles.cardTitle}>Conference Details</Text>
          <View style={styles.row}><Text style={styles.icon}>📅</Text><Text style={styles.meta}>{conference.date ? new Date(conference.date).toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', year:'numeric' }) : 'TBA'}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>⏰</Text><Text style={styles.meta}>{conference.time || conference.duration || 'TBA'}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>📍</Text><Text style={styles.meta}>{conference.venue?.name || conference.location || 'Online / TBA'}</Text></View>
          <View style={styles.row}><Text style={styles.icon}>💰</Text><Text style={styles.meta}>{conference.price > 0 ? `₹${conference.price}` : 'Free'}</Text></View>
        </View>

        {/* About */}
        <View style={styles.card}> 
          <Text style={styles.cardTitle}>About This Conference</Text>
          <Text style={styles.desc}>{conference.description || 'Join us for a professional development conference designed to enhance your knowledge and networking.'}</Text>
        </View>

        {/* Important info (optional) */}
        {conference.importantInfo ? (
          <View style={[styles.card,{ backgroundColor:'#EFF6FF', borderColor:'#3B82F6' }]}>
            <Text style={[styles.cardTitle,{ color:'#1E40AF' }]}>Important Information</Text>
            {conference.importantInfo.arriveEarly && <Text style={[styles.meta,{ color:'#1E40AF' }]}>• Arrive {conference.importantInfo.arriveEarly} minutes early</Text>}
            {conference.importantInfo.idRequired && <Text style={[styles.meta,{ color:'#1E40AF' }]}>• Valid ID required</Text>}
            {conference.importantInfo.dressCode && <Text style={[styles.meta,{ color:'#1E40AF' }]}>• Dress code: {conference.importantInfo.dressCode}</Text>}
          </View>
        ) : null}

        {/* Actions */}
        <View style={{ height: 80 }} />
      </View>

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>{conference.price > 0 ? `₹${conference.price}` : 'Free'}</Text>
        </View>
        {/* If registered, show encouragement. If not, show Register button. */}
        {isRegistered ? (
          <View style={styles.encouragementCardSoft}>
            <Text style={styles.encouragementTextSoft}>
              🎉 You're all set!
            </Text>
            <Text style={styles.encouragementSubtextSoft}>
              Thanks for taking the initiative to join this conference. We hope you have a <Text style={{ fontWeight: 'bold', color: '#111827' }}>great experience!</Text>
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={registering}><Text style={styles.primaryBtnText}>{registering ? 'Registering…' : 'Register Now'}</Text></TouchableOpacity>
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
  typeChip: { alignSelf:'flex-start', backgroundColor:'#3B82F6', paddingHorizontal:10, paddingVertical:6, borderRadius:999, marginBottom:8 },
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
  bottomBar: { position:'absolute', left:0, right:0, bottom:0, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#E5E7EB', paddingHorizontal:16, paddingVertical:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  primaryBtn: { backgroundColor:'#6366F1', paddingHorizontal:18, paddingVertical:12, borderRadius:999 },
  primaryBtnText: { color:'#fff', fontWeight:'800' },
  totalLabel: { color:'#6B7280', fontSize:12 },
  totalVal: { color:'#111827', fontWeight:'800', fontSize:18 },
});

export default ConferenceViewerScreen;
