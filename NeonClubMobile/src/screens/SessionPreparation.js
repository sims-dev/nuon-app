import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Video, Mic, Camera, Check, AlertCircle, Calendar, Clock } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const SessionPreparation = ({ route, navigation }) => {
  const { session } = route.params || {};
  const [micPermission, setMicPermission] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [timeUntilSession, setTimeUntilSession] = useState(120); // 2 minutes countdown

  const sessionData = session || {
    mentor: 'Dr. Anjali Reddy',
    topic: 'Advanced Wound Care',
    date: 'Tomorrow',
    time: '3:00 PM',
    duration: '45 mins',
  };

  useEffect(() => {
    // Simulate permission checks
    const checkPermissions = async () => {
      setTimeout(() => setMicPermission(true), 500);
      setTimeout(() => setCameraPermission(true), 1000);
    };
    checkPermissions();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeUntilSession(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allPermissionsGranted = micPermission && cameraPermission;
  const canJoin = timeUntilSession <= 300; // Can join 5 minutes before

  const handleJoinSession = () => {
    navigation.navigate('VideoSession', { session: sessionData });
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
        <Text style={styles.headerTitle}>Join Session</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Session Info Card */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionCardGradient}>
            <View style={styles.sessionIcon}>
              <Video size={40} color="#FFFFFF" />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{sessionData.topic}</Text>
              <Text style={styles.sessionSubtitle}>with {sessionData.mentor}</Text>
            </View>
            <View style={styles.sessionMeta}>
              <View style={styles.metaItem}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.metaText}>{sessionData.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.metaText}>{sessionData.time}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer */}
        {canJoin && (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>Session starts in</Text>
            <Text style={styles.timerText}>{formatCountdown(timeUntilSession)}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Ready to Join</Text>
            </View>
          </View>
        )}

        {/* System Check */}
        <View style={styles.systemCheckCard}>
          <Text style={styles.cardTitle}>System Check</Text>
          <View style={styles.checksContainer}>
            {/* Microphone */}
            <View style={styles.checkItem}>
              <View style={[styles.checkIcon, {
                backgroundColor: micPermission === true ? '#DCFCE7' : micPermission === false ? '#FEF2F2' : '#F3F4F6'
              }]}>
                <Mic size={20} color={micPermission === true ? '#16A34A' : micPermission === false ? '#DC2626' : '#9CA3AF'} />
              </View>
              <View style={styles.checkInfo}>
                <Text style={styles.checkText}>Microphone</Text>
                <Text style={styles.checkStatus}>
                  {micPermission === true ? 'Working' : micPermission === false ? 'Not accessible' : 'Checking...'}
                </Text>
              </View>
              {micPermission === true && (
                <Check size={20} color="#16A34A" />
              )}
              {micPermission === false && (
                <AlertCircle size={20} color="#DC2626" />
              )}
            </View>

            {/* Camera */}
            <View style={styles.checkItem}>
              <View style={[styles.checkIcon, {
                backgroundColor: cameraPermission === true ? '#DCFCE7' : cameraPermission === false ? '#FEF2F2' : '#F3F4F6'
              }]}>
                <Camera size={20} color={cameraPermission === true ? '#16A34A' : cameraPermission === false ? '#DC2626' : '#9CA3AF'} />
              </View>
              <View style={styles.checkInfo}>
                <Text style={styles.checkText}>Camera</Text>
                <Text style={styles.checkStatus}>
                  {cameraPermission === true ? 'Working' : cameraPermission === false ? 'Not accessible' : 'Checking...'}
                </Text>
              </View>
              {cameraPermission === true && (
                <Check size={20} color="#16A34A" />
              )}
              {cameraPermission === false && (
                <AlertCircle size={20} color="#DC2626" />
              )}
            </View>

            {/* Internet Connection */}
            <View style={styles.checkItem}>
              <View style={styles.checkIconInternet}>
                <View style={styles.wifiBars}>
                  <View style={styles.wifiBar} />
                  <View style={styles.wifiBar} />
                  <View style={styles.wifiBar} />
                </View>
              </View>
              <View style={styles.checkInfo}>
                <Text style={styles.checkText}>Internet</Text>
                <Text style={styles.checkStatus}>Strong connection</Text>
              </View>
              <Check size={20} color="#16A34A" />
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Session Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.tipText}>Find a quiet space with good lighting</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.tipText}>Keep your camera at eye level</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.tipText}>Have your questions ready</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.tipText}>Test your audio before joining</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.joinButton, (!allPermissionsGranted || !canJoin) && styles.disabledButton]}
            onPress={handleJoinSession}
            disabled={!allPermissionsGranted || !canJoin}
          >
            <Video size={20} color="#FFFFFF" style={styles.joinIcon} />
            <Text style={styles.joinButtonText}>
              {canJoin ? 'Join Session Now' : 'Session Not Started Yet'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Sessions</Text>
          </TouchableOpacity>
        </View>

        {!allPermissionsGranted && (
          <Text style={styles.warningText}>
            ⚠️ Please allow camera and microphone access to join the session
          </Text>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  sessionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  sessionCardGradient: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderWidth: 2,
    borderColor: '#E9D5FF',
  },
  sessionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  countdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#16A34A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  systemCheckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  checksContainer: {
    gap: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconInternet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wifiBars: {
    flexDirection: 'row',
    gap: 1,
  },
  wifiBar: {
    width: 3,
    height: 6,
    backgroundColor: '#16A34A',
    borderRadius: 1,
  },
  checkInfo: {
    flex: 1,
    marginLeft: 12,
  },
  checkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  checkStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
  },
  joinButton: {
    backgroundColor: '#16A34A',
    borderRadius: 50,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  joinIcon: {
    marginRight: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    borderRadius: 50,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SessionPreparation;