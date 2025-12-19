import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Mic, MicOff, Camera, CameraOff, PhoneOff, MessageCircle, Users, Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const VideoSession = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params;
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Start session timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Simulate connection after 2 seconds
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(connectionTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => navigation.navigate('SessionFeedback', {
            mentorId: mentor.id,
            sessionId: sessionDetails.id
          })
        }
      ]
    );
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Here you would integrate with actual video SDK
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // Here you would integrate with actual video SDK
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTopic}>{sessionDetails.topic}</Text>
          <Text style={styles.headerMentor}>{mentor.name}</Text>
        </View>
        <Text style={styles.headerTimer}>{formatTime(sessionTime)}</Text>
      </View>
      {/* Video Container */}
      <View style={styles.videoContainer}>
        {/* Main Video */}
        <View style={styles.mainVideo}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>
              {mentor.name}'s Video
            </Text>
            {!isCameraOn && <Text style={styles.cameraOffText}>Camera Off</Text>}
          </View>
        </View>

        {/* Mentor Name Overlay */}
        <View style={styles.mentorNameOverlay}>
          <Text style={styles.mentorNameText}>{mentor.name}</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionStatusText}>Connected</Text>
        </View>

        {/* Self Video */}
        <View style={styles.selfVideo}>
          <View style={styles.selfVideoPlaceholder}>
            <Text style={styles.selfVideoText}>You</Text>
            {!isCameraOn && <Text style={styles.selfCameraOffText}>Off</Text>}
          </View>
          <View style={styles.selfVideoLabel}>
            <Text style={styles.selfVideoLabelText}>You</Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isMicOn ? '#374151' : '#dc2626' }]}
          onPress={toggleMic}
        >
          {isMicOn ? (
            <Mic size={24} color="#fff" />
          ) : (
            <MicOff size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isCameraOn ? '#374151' : '#dc2626' }]}
          onPress={toggleCamera}
        >
          {isCameraOn ? (
            <Camera size={24} color="#fff" />
          ) : (
            <CameraOff size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#374151' }]}>
          <MessageCircle size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#374151' }]}>
          <Users size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndSession}
        >
          <PhoneOff size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      {!isConnected && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>Connecting to session...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTopic: {
    color: 'white',
    fontSize: 14,
  },
  headerMentor: {
    color: '#9ca3af',
    fontSize: 12,
  },
  headerTimer: {
    color: 'white',
    fontSize: 14,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  mainVideo: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#581c87', // gradient start
  },
  mentorNameOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mentorNameText: {
    color: 'white',
    fontSize: 12,
  },
  connectionStatus: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  connectionStatusText: {
    color: 'white',
    fontSize: 12,
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  connectingIndicator: {
    alignItems: 'center',
  },
  connectingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  mainVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraOffText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
  },
  selfVideo: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 128,
    height: 160,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfVideoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    paddingVertical: 4,
    alignItems: 'center',
  },
  selfVideoLabelText: {
    color: 'white',
    fontSize: 12,
  },
  selfVideoPlaceholder: {
    alignItems: 'center',
  },
  selfVideoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selfCameraOffText: {
    color: '#ff6b6b',
    fontSize: 10,
    marginTop: 4,
  },
  sessionInfo: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 140,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  controls: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default VideoSession;