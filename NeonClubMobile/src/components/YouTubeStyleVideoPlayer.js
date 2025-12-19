import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const YouTubeStyleVideoPlayer = ({ videoUrl, videoTitle, onClose, videoThumbnail, videoDuration: initialDuration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const qualityOptions = ['auto', '720p', '480p', '360p'];
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const PlayerControls = () => (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.controlsGradient}
      pointerEvents={showControls ? 'auto' : 'none'}
    >
      {/* Progress Bar */}
      <TouchableOpacity
        style={styles.progressContainer}
        onPress={(e) => {
          const newPosition = (e.nativeEvent.locationX / screenWidth) * duration;
          handleSeek(newPosition);
        }}
        activeOpacity={1}
      >
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFilled,
              { width: `${progressPercentage}%` }
            ]}
          />
          <View
            style={[
              styles.progressDot,
              { left: `${progressPercentage}%` }
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Bottom Control Bar */}
      <View style={styles.controlBar}>
        {/* Left Controls */}
        <View style={styles.leftControls}>
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.controlButton}
          >
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsMuted(!isMuted)}
            style={styles.controlButton}
          >
            <MaterialCommunityIcons
              name={isMuted ? 'volume-off' : 'volume-high'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {/* Volume Slider */}
          {!isMuted && (
            <View style={styles.volumeSlider}>
              {/* Simple volume indicator */}
              <View
                style={[
                  styles.volumeFilled,
                  { width: `${volume * 100}%` }
                ]}
              />
            </View>
          )}

          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Right Controls */}
        <View style={styles.rightControls}>
          {/* Speed Selection */}
          <TouchableOpacity
            onPress={() => setShowSpeedMenu(!showSpeedMenu)}
            style={styles.controlButton}
          >
            <Text style={styles.speedText}>{selectedSpeed}x</Text>
          </TouchableOpacity>

          {showSpeedMenu && (
            <View style={styles.menuDropdown}>
              {speedOptions.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  onPress={() => {
                    setSelectedSpeed(speed);
                    setShowSpeedMenu(false);
                    // Note: react-native-video rate changes may not work on all platforms
                  }}
                  style={[
                    styles.menuItem,
                    selectedSpeed === speed && styles.menuItemSelected
                  ]}
                >
                  <Text style={styles.menuItemText}>
                    {speed === 1 ? 'Normal' : `${speed}x`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quality Selection */}
          <TouchableOpacity
            onPress={() => setShowQualityMenu(!showQualityMenu)}
            style={styles.controlButton}
          >
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color="white"
            />
            <Text style={styles.qualityText}>HD</Text>
          </TouchableOpacity>

          {showQualityMenu && (
            <View style={styles.menuDropdown}>
              {qualityOptions.map((quality) => (
                <TouchableOpacity
                  key={quality}
                  onPress={() => {
                    setSelectedQuality(quality);
                    setShowQualityMenu(false);
                  }}
                  style={[
                    styles.menuItem,
                    selectedQuality === quality && styles.menuItemSelected
                  ]}
                >
                  <Text style={styles.menuItemText}>
                    {quality.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Fullscreen Button */}
          <TouchableOpacity
            onPress={() => setIsFullScreen(!isFullScreen)}
            style={styles.controlButton}
          >
            <MaterialCommunityIcons
              name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  if (isFullScreen) {
    return (
      <View style={styles.fullscreenContainer}>
        <StatusBar hidden />
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.fullscreenVideo}
          onProgress={handleProgress}
          onLoad={handleLoad}
          paused={!isPlaying}
          repeat={false}
          controls={false}
          resizeMode="cover"
          rate={selectedSpeed}
          volume={isMuted ? 0 : volume}
        />
        <TouchableOpacity
          style={styles.fullscreenCloseButton}
          onPress={() => setIsFullScreen(false)}
        >
          <MaterialCommunityIcons name="close" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerPlayButton}
          onPress={handlePlayPause}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={80}
            color="white"
            opacity={0.7}
          />
        </TouchableOpacity>
        <PlayerControls />
      </View>
    );
  }

  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="chevron-down" size={32} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {videoTitle}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <TouchableOpacity
          style={styles.videoContainer}
          onPress={() => setShowControls(!showControls)}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            onProgress={handleProgress}
            onLoad={handleLoad}
            paused={!isPlaying}
            repeat={false}
            controls={false}
            resizeMode="cover"
            rate={selectedSpeed}
            volume={isMuted ? 0 : volume}
          />
          {showControls && <PlayerControls />}
          {!isPlaying && (
            <TouchableOpacity
              style={styles.playButtonOverlay}
              onPress={handlePlayPause}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={80}
                color="white"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Video Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.videoTitleText}>{videoTitle}</Text>
          <Text style={styles.qualityInfo}>
            Quality: {selectedQuality.toUpperCase()} | Speed: {selectedSpeed}x | Duration: {formatTime(duration)}
          </Text>
          <Text style={styles.descriptionText}>
            Enjoy watching! Use the player controls to adjust speed, quality, and more.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#333',
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth * 0.5625, // 16:9 aspect ratio
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullscreenVideo: {
    width: screenHeight,
    height: screenWidth,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    padding: 8,
  },
  centerPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 50,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 10,
  },
  controlsGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  progressContainer: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFilled: {
    height: '100%',
    backgroundColor: '#FF0000',
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    top: -4,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  volumeSlider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  volumeFilled: {
    height: '100%',
    backgroundColor: '#FF0000',
    borderRadius: 1,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  qualityText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  menuDropdown: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 8,
    minWidth: 100,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuItemSelected: {
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  menuItemText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  videoTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  qualityInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
});

export default YouTubeStyleVideoPlayer;
