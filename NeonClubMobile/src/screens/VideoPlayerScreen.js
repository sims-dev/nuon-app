import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { progressAPI, getCurrentBaseURL, getFullMediaUrl } from '../services/api';
import { CONFIG } from '../utils/config';
import { IP_ADDRESS } from '../config/ipConfig';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {
  const { videoUrl, title, courseId, lessonId, thumbnail } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);

  // Process video URL to ensure it's a full URL
  const processedVideoUrl = useMemo(() => {
    if (!videoUrl) return null;
    const url = getFullMediaUrl(videoUrl);
    console.log('VideoPlayerScreen processedVideoUrl:', url, 'from:', videoUrl);
    return url;
  }, [videoUrl]);

  // Always use WebView for better format support and large file handling
  const isDirectVideo = false;

  useEffect(() => {
    // Auto-mark lesson as started when video loads
    if (courseId && lessonId) {
      markLessonStarted();
    }
  }, [courseId, lessonId]);

  const markLessonStarted = async () => {
    try {
      await progressAPI.updateLessonProgress(courseId, lessonId, {
        started: true,
        lastWatchedAt: new Date()
      });
    } catch (error) {
      console.error('Error marking lesson as started:', error);
    }
  };

  const handleVideoEnd = async () => {
    try {
      await progressAPI.updateLessonProgress(courseId, lessonId, {
        completed: true,
        timeSpent: 1800, // Assume 30 minutes for completion
        lastWatchedAt: new Date()
      });
      Alert.alert(
        'Lesson Completed!',
        'Great job! You have completed this lesson.',
        [{ text: 'Continue', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const videoPlayerHTML = useMemo(() => {
    // Extract video ID from YouTube URL
    const videoId = processedVideoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

    if (videoId) {
      // YouTube embed
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background: #000; }
            .video-container { position: relative; width: 100%; height: 100vh; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <script>
            // Notify React Native when video ends (approximate)
            setTimeout(() => {
              window.ReactNativeWebView.postMessage('VIDEO_ENDED');
            }, 1800000); // 30 minutes
          </script>
        </body>
        </html>
      `;
    } else if (processedVideoUrl.includes('vimeo.com')) {
      // Vimeo embed
      const vimeoId = processedVideoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; background: #000; }
              .video-container { position: relative; width: 100%; height: 100vh; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <div class="video-container">
              <iframe
                src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </body>
          </html>
        `;
      }
    } else {
      // Direct video file - use HTML5 video element
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <style>
            * { margin: 0; padding: 0; }
            html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
            video {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
              background: #000;
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              font-size: 18px;
              z-index: 10;
            }
          </style>
        </head>
        <body>
          <div class="loading">Loading video...</div>
          <video
            src="${processedVideoUrl}"
            controls
            playsinline
            poster="${thumbnail || ''}"
            preload="metadata"
            onloadeddata="document.querySelector('.loading').style.display='none'; console.log('Video loaded successfully');"
            onerror="console.error('Video load error:', event); window.ReactNativeWebView.postMessage('VIDEO_ERROR');"
            onloadstart="console.log('Video load started');"
            oncanplay="console.log('Video can play');"
            onprogress="console.log('Video progress');"
            onwaiting="console.log('Video buffering');"
            onplaying="console.log('Video playing');"
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
          <script>
            const video = document.querySelector('video');
            video.addEventListener('ended', () => {
              window.ReactNativeWebView.postMessage('VIDEO_ENDED');
            });
            video.addEventListener('error', (e) => {
              console.error('Video error:', e);
              window.ReactNativeWebView.postMessage('VIDEO_ERROR');
            });
            // Ensure video fills screen
            video.style.width = window.innerWidth + 'px';
            video.style.height = window.innerHeight + 'px';
          </script>
        </body>
        </html>
      `;
    }

    return '';
  }, [processedVideoUrl]);

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'VIDEO_ENDED') {
      handleVideoEnd();
    } else if (message === 'VIDEO_ERROR') {
      setError('Failed to load video');
      setLoading(false);
    }
  };

  const handleWebViewError = () => {
    setError('Failed to load video');
    setLoading(false);
  };

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.videoContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ html: videoPlayerHTML }}
          style={styles.webView}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayerScreen;