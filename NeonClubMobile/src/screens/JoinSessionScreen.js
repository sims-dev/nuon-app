import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import NetInfo from '@react-native-community/netinfo';
import { PermissionsAndroid, Platform } from 'react-native';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
const micSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
const cameraSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
const wifiSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const xCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

const JoinSessionScreen = ({ route, navigation }) => {
  const { session } = route.params;
  const [timeLeft, setTimeLeft] = useState(0);
  const [systemChecks, setSystemChecks] = useState({
    microphone: { status: 'checking', label: 'Checking...' },
    camera: { status: 'checking', label: 'Checking...' },
    internet: { status: 'checking', label: 'Checking...' },
  });
  const [isReadyToJoin, setIsReadyToJoin] = useState(false);

  useEffect(() => {
    // Mock session time - in real app, calculate from actual session datetime
    const sessionTime = new Date();
    sessionTime.setMinutes(sessionTime.getMinutes() + 30); // 30 minutes from now for demo
    const diff = sessionTime - new Date();
    setTimeLeft(Math.max(0, Math.floor(diff / 1000)));

    // Start system checks
    checkSystemPermissions();
    checkInternetConnection();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  // Check if ready to join
  useEffect(() => {
    const isWithin5Minutes = timeLeft <= 300; // 5 minutes = 300 seconds
    const allChecksPass = Object.values(systemChecks).every(check => check.status === 'working');
    setIsReadyToJoin(isWithin5Minutes && allChecksPass);
  }, [timeLeft, systemChecks]);

  const checkSystemPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const micGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        setSystemChecks(prev => ({
          ...prev,
          microphone: micGranted
            ? { status: 'working', label: 'Working' }
            : { status: 'not_accessible', label: 'Not accessible' }
        }));

        const cameraGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        setSystemChecks(prev => ({
          ...prev,
          camera: cameraGranted
            ? { status: 'working', label: 'Working' }
            : { status: 'not_accessible', label: 'Not accessible' }
        }));
      } else {
        setSystemChecks(prev => ({
          ...prev,
          microphone: { status: 'working', label: 'Working' },
          camera: { status: 'working', label: 'Working' }
        }));
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setSystemChecks(prev => ({
        ...prev,
        microphone: { status: 'not_accessible', label: 'Error checking' },
        camera: { status: 'not_accessible', label: 'Error checking' }
      }));
    }
  };

  const checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      setSystemChecks(prev => ({
        ...prev,
        internet: state.isConnected && state.isInternetReachable
          ? { status: 'working', label: 'Working' }
          : { status: 'not_accessible', label: 'Not accessible' }
      }));
    } catch (error) {
      console.error('Internet check error:', error);
      setSystemChecks(prev => ({
        ...prev,
        internet: { status: 'not_accessible', label: 'Error checking' }
      }));
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinNow = () => {
    if (!isReadyToJoin) return;

    navigation.navigate('VideoSession', {
      mentor: { name: session.mentor },
      sessionDetails: {
        topic: session.topic,
        zoomLink: session.zoomLink || 'https://zoom.us/j/123456789'
      }
    });
  };

  const getStatusIcon = (status) => {
    return status === 'working' ? checkCircleSvg : xCircleSvg;
  };

  const getStatusColor = (status) => {
    return status === 'working' ? '#10b981' : '#ef4444';
  };

  return (
    <LinearGradient colors={['#faf5ff', '#fdf2f8', '#fff']} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#ec4899', '#ea580c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Session</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Info Card */}
        <View style={styles.joinSessionInfoCard}>
          <View style={styles.sessionInfoContent}>
            <View style={styles.sessionBadge}>
              <SvgXml xml={videoSvg} width={24} height={24} color="white" />
            </View>
            <View style={styles.sessionDetailsContent}>
              <Text style={styles.sessionTopicText}>{session.topic}</Text>
              <Text style={styles.sessionMentorText}>with {session.mentor}</Text>
              <View style={styles.sessionMetaInfo}>
                <Text style={styles.sessionDateTimeText}>
                  {session.date} at {session.time}
                </Text>
                <Text style={styles.sessionDurationText}>{session.duration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownLabel}>Session starts in</Text>
          <Text style={styles.countdownTimer}>{formatTime(timeLeft)}</Text>
          {timeLeft <= 300 && (
            <View style={styles.readyBadge}>
              <Text style={styles.readyText}>Ready to Join</Text>
            </View>
          )}
        </View>

        {/* System Check Card */}
        <View style={styles.systemCheckCard}>
          <Text style={styles.systemCheckTitle}>System Check</Text>
          <View style={styles.checksContainer}>
            {/* Microphone Check */}
            <View style={styles.checkItem}>
              <View style={styles.checkIcon}>
                <SvgXml xml={micSvg} width={20} height={20} color="#6b7280" />
              </View>
              <View style={styles.checkDetails}>
                <Text style={styles.checkLabel}>Microphone</Text>
                <View style={styles.checkStatus}>
                  <SvgXml
                    xml={getStatusIcon(systemChecks.microphone.status)}
                    width={16}
                    height={16}
                    color={getStatusColor(systemChecks.microphone.status)}
                  />
                  <Text style={[styles.checkStatusText, { color: getStatusColor(systemChecks.microphone.status) }]}>
                    {systemChecks.microphone.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* Camera Check */}
            <View style={styles.checkItem}>
              <View style={styles.checkIcon}>
                <SvgXml xml={cameraSvg} width={20} height={20} color="#6b7280" />
              </View>
              <View style={styles.checkDetails}>
                <Text style={styles.checkLabel}>Camera</Text>
                <View style={styles.checkStatus}>
                  <SvgXml
                    xml={getStatusIcon(systemChecks.camera.status)}
                    width={16}
                    height={16}
                    color={getStatusColor(systemChecks.camera.status)}
                  />
                  <Text style={[styles.checkStatusText, { color: getStatusColor(systemChecks.camera.status) }]}>
                    {systemChecks.camera.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* Internet Check */}
            <View style={styles.checkItem}>
              <View style={styles.checkIcon}>
                <SvgXml xml={wifiSvg} width={20} height={20} color="#6b7280" />
              </View>
              <View style={styles.checkDetails}>
                <Text style={styles.checkLabel}>Internet</Text>
                <View style={styles.checkStatus}>
                  <SvgXml
                    xml={getStatusIcon(systemChecks.internet.status)}
                    width={16}
                    height={16}
                    color={getStatusColor(systemChecks.internet.status)}
                  />
                  <Text style={[styles.checkStatusText, { color: getStatusColor(systemChecks.internet.status) }]}>
                    {systemChecks.internet.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Join Now Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={isReadyToJoin ? ['#10b981', '#059669'] : ['#d1d5db', '#9ca3af']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.joinNowButton}
        >
          <TouchableOpacity
            style={styles.joinNowButtonInner}
            onPress={handleJoinNow}
            disabled={!isReadyToJoin}
          >
            <Text style={[styles.joinNowButtonText, { color: isReadyToJoin ? 'white' : '#6b7280' }]}>
              Join Now
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  joinSessionInfoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sessionInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sessionDetailsContent: { flex: 1 },
  sessionTopicText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  sessionMentorText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  sessionMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDateTimeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sessionDurationText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  countdownCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  countdownTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 16,
  },
  readyBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readyText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 14,
  },
  systemCheckCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 100,
  },
  systemCheckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  checksContainer: { gap: 16 },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkDetails: { flex: 1 },
  checkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  checkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkStatusText: {
    fontSize: 14,
    marginLeft: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  joinNowButton: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  joinNowButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  joinNowButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JoinSessionScreen;