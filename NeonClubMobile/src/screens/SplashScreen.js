import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { InteractionManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NEON_COLORS } from '../utils/colors';
import { AuthContext } from '../contexts/AuthContext';
import { NuonLogo } from '../components/NuonLogo';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { user, token, loading } = useContext(AuthContext);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const logoAnim = new Animated.Value(0);
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const [hasNavigated, setHasNavigated] = useState(false);

  console.log('Rendering SplashScreen');
  console.log('User Context in SplashScreen:', user);
  console.log('Token in SplashScreen:', !!token);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Start bouncing dots
    const startBounce = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(() => startBounce(dot1Anim, 0), 500);
    setTimeout(() => startBounce(dot2Anim, 100), 600);
    setTimeout(() => startBounce(dot3Anim, 200), 700);

    // Navigate based on auth state
    if (loading) return;

    if (token && user) {
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Main',
          state: {
            routes: [{
              name: 'Home'
            }]
          }
        }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  }, [user, token, loading, navigation, dot1Anim, dot2Anim, dot3Anim]);

  const collaborators = [
    'Ozone Hospital',
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9333EA", "#2563EB", "#0891B2"]} // Updated to match Figma: purple-600, blue-600, cyan-600
        style={styles.gradientBackground}
      >
        {/* Animated background elements */}
        <Animated.View
          style={[
            styles.floatingCircle1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.05, 0.2],
              }),
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.2, 0.8],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle3,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.03, 0.1],
              }),
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1.1],
                  }),
                },
              ],
            },
          ]}
        />

        <View style={styles.content}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <NuonLogo variant="black" showTagline={true} taglineColor="#FFFFFF" style={{ transform: [{ scale: 1.2 }] }} />
          </Animated.View>

          {/* Collaborators */}
          <Animated.View
            style={[
              styles.collaboratorsContainer,
              { opacity: logoAnim }
            ]}
          >
            <Text style={styles.collabText}>In collaboration with</Text>
            <View style={styles.collaboratorsList}>
              {collaborators.map((collab, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.collaboratorText,
                    {
                      opacity: logoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [{
                        translateY: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  {collab}
                </Animated.Text>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.loadingDot, { transform: [{ translateY: dot1Anim }] }]} />
            <Animated.View style={[styles.loadingDot, { transform: [{ translateY: dot2Anim }] }]} />
            <Animated.View style={[styles.loadingDot, { transform: [{ translateY: dot3Anim }] }]} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingCircle1: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.25,
    width: 384, // 96 * 4 for RN
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: height * 0.25,
    right: width * 0.25,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(255, 153, 255, 0.2)',
  },
  floatingCircle3: {
    position: 'absolute',
    top: height * 0.5,
    left: width * 0.5,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    transform: [{ translateX: -128 }, { translateY: -128 }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 64,
  },
  collaboratorsContainer: {
    marginTop: 64,
  },
  collabText: {
    color: '#BFDBFE', // blue-100
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  collaboratorsList: {
    alignItems: 'center',
  },
  collaboratorText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 48,
    left: '50%',
    transform: [{ translateX: -24 }],
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    // For bouncing animation, we can use Animated.loop with sequence
  },
});

export default SplashScreen;