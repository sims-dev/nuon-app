import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const fullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
const volumeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

const { width: screenWidth } = Dimensions.get('window');

const VideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title,
  duration,
  onProgress,
  onComplete,
  style,
  controls = true,
  autoplay = false,
}) => {
  const [playing, setPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef(null);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
    if (onProgress) {
      onProgress(data);
    }
  };

  const handleLoad = (data) => {
    setVideoDuration(data.duration);
    setLoading(false);
  };

  const handleError = (error) => {
    console.error('Video error:', error);
    setError('Failed to load video');
    setLoading(false);
  };

  const handleEnd = () => {
    setPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercentage = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  if (!videoUrl) {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.placeholder}
        >
          <Text style={styles.errorText}>No video available</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.videoWrapper}>
        {/* Thumbnail Background */}
        {thumbnailUrl && !playing && (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            blurRadius={5}
          />
        )}

        {/* Video Player */}
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          controls={false}
          playing={playing}
          onProgress={handleProgress}
          onLoad={handleLoad}
          onError={handleError}
          onEnd={handleEnd}
          muted={isMuted}
          resizeMode="contain"
          progressUpdateInterval={500}
        />

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#EC4899" />
          </View>
        )}

        {/* Error Overlay */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                videoRef.current?.seek(0);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Custom Controls */}
        {controls && (
          <TouchableOpacity
            style={styles.controlsContainer}
            activeOpacity={0.8}
            onPress={() => setShowControls(!showControls)}
          >
            {showControls && (
              <>
                {/* Top gradient */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'transparent']}
                  style={styles.topGradient}
                >
                  <Text style={styles.title} numberOfLines={1}>
                    {title || 'Video'}
                  </Text>
                </LinearGradient>

                {/* Center play/pause button */}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlayPause}
                  activeOpacity={0.7}
                >
                  <SvgXml
                    xml={playing ? pauseIcon : playIcon}
                    color="#FFFFFF"
                    width={64}
                    height={64}
                  />
                </TouchableOpacity>

                {/* Bottom gradient with controls */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.bottomGradient}
                >
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>

                  {/* Control Buttons */}
                  <View style={styles.controlButtons}>
                    {/* Play/Pause */}
                    <TouchableOpacity
                      onPress={togglePlayPause}
                      style={styles.controlButton}
                    >
                      <SvgXml
                        xml={playing ? pauseIcon : playIcon}
                        color="#FFFFFF"
                        width={24}
                        height={24}
                      />
                    </TouchableOpacity>

                    {/* Time Display */}
                    <View style={styles.timeDisplay}>
                      <Text style={styles.timeText}>
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </Text>
                    </View>

                    {/* Mute Button */}
                    <TouchableOpacity
                      onPress={toggleMute}
                      style={styles.controlButton}
                    >
                      <SvgXml
                        xml={volumeIcon}
                        color={isMuted ? '#9CA3AF' : '#FFFFFF'}
                        width={24}
                        height={24}
                      />
                    </TouchableOpacity>

                    {/* Fullscreen Button */}
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={() => {
                        // Implement fullscreen logic
                        console.log('Fullscreen not yet implemented');
                      }}
                    >
                      <SvgXml
                        xml={fullscreenIcon}
                        color="#FFFFFF"
                        width={24}
                        height={24}
                      />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topGradient: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(236, 72, 153, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#EC4899',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    padding: 8,
  },
  timeDisplay: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
