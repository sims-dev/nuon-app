import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Linking } from 'react-native';
import { CheckCircle, XCircle, Wifi, Mic, Camera, Clock, Lightbulb, ExternalLink } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import socketService from '../services/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionPreparation = ({ route, navigation }) => {
  const { session } = route.params;
  const mentor = { name: session.mentor, image: session.image };
  const sessionDetails = {
    topic: session.topic,
    date: session.date,
    time: session.time,
    duration: session.duration
  };
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [systemChecks, setSystemChecks] = useState({
    microphone: false,
    camera: false,
    internet: false,
  });
  const [isReady, setIsReady] = useState(false);
  const [meetingLink, setMeetingLink] = useState(null);
  const [meetingStatus, setMeetingStatus] = useState('waiting'); // waiting, ready, joined
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user info
    getUserInfo();

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Perform system checks
    performSystemChecks();

    // Connect to socket and listen for real-time updates
    initializeSocketConnection();

    return () => {
      clearInterval(timer);
      // Cleanup socket listeners
      if (socketService.isSocketConnected()) {
        socketService.off('meeting_ready', handleMeetingReady);
        socketService.off('mentor_joined', handleMentorJoined);
        socketService.off('meeting_started', handleMeetingStarted);
      }
    };
  }, []);

  useEffect(() => {
    // Check if all systems are ready
    const allChecksPassed = Object.values(systemChecks).every(check => check);
    setIsReady(allChecksPassed && countdown > 0);
  }, [systemChecks, countdown]);

  const performSystemChecks = async () => {
    // Simulate system checks
    setTimeout(() => setSystemChecks(prev => ({ ...prev, microphone: true })), 1000);
    setTimeout(() => setSystemChecks(prev => ({ ...prev, camera: true })), 2000);
    setTimeout(() => setSystemChecks(prev => ({ ...prev, internet: true })), 3000);
  };

  const getUserInfo = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('nurseProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        setUserId(profile.id);
        setUserName(profile.fullName || profile.name || 'User');
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  const initializeSocketConnection = async () => {
    try {
      // Connect to socket
      await socketService.connect();

      // Listen for meeting ready event (when mentor creates Zoom meeting)
      const cleanup1 = socketService.on('meeting_ready', handleMeetingReady);

      // Listen for mentor joined event
      const cleanup2 = socketService.on('mentor_joined', handleMentorJoined);

      // Listen for meeting started event
      const cleanup3 = socketService.on('meeting_started', handleMeetingStarted);

      // Join session room for real-time updates
      socketService.emit('join_session', {
        sessionId: session.id,
        userId: userId,
        userType: 'nurse'
      });

    } catch (error) {
      console.error('Socket connection error:', error);
    }
  };

  const handleMeetingReady = (data) => {
    console.log('Meeting ready:', data);
    if (data.sessionId === session.id) {
      setMeetingLink(data.meetingLink);
      setMeetingStatus('ready');
      Alert.alert(
        'Meeting Ready!',
        'Your mentor has started the Zoom meeting. You can now join the session.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMentorJoined = (data) => {
    console.log('Mentor joined:', data);
    if (data.sessionId === session.id) {
      Alert.alert(
        'Mentor Joined!',
        'Your mentor is now in the meeting. Click "Join Now" to start your session.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMeetingStarted = (data) => {
    console.log('Meeting started:', data);
    if (data.sessionId === session.id) {
      setMeetingStatus('joined');
    }
  };

  const handleJoinSession = async () => {
    if (!isReady) return;

    try {
      // Notify mentor that user is joining
      socketService.emit('user_joining', {
        sessionId: session.id,
        userId: userId,
        userName: userName,
        mentorId: session.mentorId || session.id // Assuming mentor ID is available
      });

      if (meetingLink && meetingStatus === 'ready') {
        // Open Zoom meeting link
        await Linking.openURL(meetingLink);
        // Navigate to feedback screen after some time (simulating call end)
        setTimeout(() => {
          navigation.navigate('SessionFeedback', {
            session,
            mentor,
            userName,
            userId
          });
        }, 30000); // 30 seconds for demo, in real app this would be detected
      } else {
        // Fallback to video session screen
        navigation.navigate('VideoSession', { mentor, sessionDetails });
      }
    } catch (error) {
      console.error('Error joining session:', error);
      Alert.alert('Error', 'Failed to join session. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionTips = [
    "Ensure you're in a quiet environment",
    "Test your microphone and camera before joining",
    "Have your questions ready for the session",
    "Close other applications for better performance",
  ];

  return (
    <LinearGradient colors={['#faf5ff', '#fff']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#7c3aed', '#ec4899', '#ea580c']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>Join Session</Text>
        </LinearGradient>

        {/* Session Info Card */}
        <LinearGradient colors={['#faf5ff', '#fdf2f8']} style={styles.sessionCard}>
          <View style={styles.sessionIcon}>
            <Text style={styles.sessionIconText}>V</Text>
          </View>
          <Text style={styles.sessionTitle}>{sessionDetails.topic}</Text>
          <Text style={styles.sessionSubtitle}>with {mentor.name}</Text>
          <View style={styles.sessionGrid}>
            <View style={styles.sessionGridItem}>
              <Text style={styles.sessionLabel}>Date</Text>
              <Text style={styles.sessionValue}>{sessionDetails.date}</Text>
            </View>
            <View style={styles.sessionGridItem}>
              <Text style={styles.sessionLabel}>Time</Text>
              <Text style={styles.sessionValue}>{sessionDetails.time}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Countdown Timer */}
        <LinearGradient colors={['#dcfce7', '#ecfdf5']} style={styles.countdownCard}>
          <Text style={styles.countdownLabel}>Session starts in</Text>
          <Text style={styles.timerText}>{formatTime(countdown)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Ready</Text>
          </View>
        </LinearGradient>

        {/* Meeting Link Display */}
        {meetingLink && (
          <View style={styles.meetingCard}>
            <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.meetingCardGradient}>
              <View style={styles.meetingIcon}>
                <ExternalLink size={24} color="white" />
              </View>
              <View style={styles.meetingInfo}>
                <Text style={styles.meetingTitle}>Zoom Meeting Ready!</Text>
                <Text style={styles.meetingSubtitle}>Your mentor has started the meeting</Text>
              </View>
              <TouchableOpacity
                style={styles.meetingLinkBtn}
                onPress={() => Linking.openURL(meetingLink)}
              >
                <Text style={styles.meetingLinkText}>Open Zoom</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        <View style={styles.checksCard}>
          <Text style={styles.cardTitle}>System Check</Text>
          <View style={styles.checkItem}>
            <View style={[styles.checkIcon, { backgroundColor: systemChecks.microphone ? '#10b981' : '#6b7280' }]}>
              <Mic size={20} color="white" />
            </View>
            <Text style={styles.checkText}>Microphone</Text>
            <Text style={styles.checkStatus}>
              {systemChecks.microphone ? 'Working' : 'Checking...'}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <View style={[styles.checkIcon, { backgroundColor: systemChecks.camera ? '#10b981' : '#6b7280' }]}>
              <Camera size={20} color="white" />
            </View>
            <Text style={styles.checkText}>Camera</Text>
            <Text style={styles.checkStatus}>
              {systemChecks.camera ? 'Working' : 'Checking...'}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <View style={[styles.checkIcon, { backgroundColor: systemChecks.internet ? '#10b981' : '#6b7280' }]}>
              <Wifi size={20} color="white" />
            </View>
            <Text style={styles.checkText}>Internet</Text>
            <Text style={styles.checkStatus}>
              {systemChecks.internet ? 'Connected' : 'Checking...'}
            </Text>
          </View>
        </View>

        <LinearGradient colors={['#eff6ff', '#faf5ff']} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Session Tips</Text>
          {sessionTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </LinearGradient>
      </ScrollView>

      {/* Fixed Action Buttons at Bottom */}
      <View style={styles.actionButtons}>
        <LinearGradient
          colors={['#16a34a', '#059669']}
          style={styles.joinButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => handleJoinSession()}
            disabled={!isReady || meetingStatus === 'waiting'}
          >
            <Text style={styles.joinButtonText}>
              {meetingStatus === 'waiting' ? 'Waiting for Meeting...' :
               meetingStatus === 'ready' ? 'Join Zoom Meeting' :
               isReady ? 'Join Session Now' : 'Preparing...'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for fixed buttons
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sessionCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  sessionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  sessionIconText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  sessionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sessionGridItem: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  sessionValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  countdownCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 24,
    borderWidth: 2,
    borderColor: '#16a34a',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
  },
  meetingCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  meetingCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  meetingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  meetingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  meetingLinkBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  meetingLinkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  checksCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 8,
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  checkStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  tipsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#374151',
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  joinButton: {
    borderRadius: 50,
    height: 56,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    borderRadius: 50,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionPreparation;