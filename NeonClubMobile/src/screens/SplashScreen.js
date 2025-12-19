import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NEON_COLORS } from '../utils/colors';
import { AuthContext } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Use the app's bundled logo image
const nuonLogo = require('../assets/logo.png');

const SplashScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const logoAnim = new Animated.Value(0);
  const [hasNavigated, setHasNavigated] = useState(false);

  console.log('Rendering SplashScreen');
  console.log('User Context in SplashScreen:', user);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
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

    // Always navigate to Onboarding after splash
    if (!hasNavigated) {
      const timer = setTimeout(() => {
        if (!hasNavigated) {
          setHasNavigated(true);
          console.log('Navigating to Onboarding');
          navigation.navigate('Onboarding');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigation, hasNavigated]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#7C3AED", "#2563EB", "#06B6D4"]}
        style={styles.gradientBackground}
      >
      {/* Animated floating circles */}
      <Animated.View
        style={[
          styles.floatingCircle1,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
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
              outputRange: [0.2, 0.5],
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
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* NUON icon shown above center */}
        <Image source={nuonLogo} style={styles.iconOnly} resizeMode="contain" />

        <Animated.View style={{ opacity: logoAnim }}>
          <Text style={styles.splashLine1}>In collaboration with</Text>
          <Text style={styles.splashLine2}>Ozone Hospital</Text>
        </Animated.View>
      </Animated.View>

      {/* (No footer or dots — splash is a clean logo + collaborator view) */}
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
  },
  floatingCircle1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: NEON_COLORS.neonPurpleGlow,
    blurRadius: 64,
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.1,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: NEON_COLORS.neonBlueGlow,
    blurRadius: 64,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: -80,
  },
  iconOnly: {
    width: 200,
    height: 110,
    marginBottom: 20,
  },
  splashLine1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  splashLine2: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.95,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: NEON_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  collabText: {
    color: 'rgba(230,247,255,0.95)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SplashScreen;