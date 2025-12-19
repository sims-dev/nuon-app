import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const logoImage = require('../assets/logo.png');

/**
 * Full NUON Logo with optional tagline
 * Usage: <NuonLogo showTagline={true} variant="white" />
 */
export const NuonLogo = ({ 
  variant = 'default',
  showTagline = false,
  style = {}
}) => {
  return (
    <View style={[styles.logoContainer, style]}>
      <Image 
        source={logoImage}
        style={[
          styles.logoFull,
          variant === 'white' && styles.whiteVariant
        ]}
        resizeMode="contain"
      />
      {showTagline && (
        <Text style={[
          styles.tagline,
          variant === 'white' && styles.whiteText
        ]}>
          Nurses United, Opportunities Nourished
        </Text>
      )}
    </View>
  );
};

/**
 * Horizontal compact version for headers
 * Usage: <NuonLogoHorizontal height={40} variant="white" />
 */
export const NuonLogoHorizontal = ({ 
  variant = 'default',
  height = 40,
  style = {}
}) => {
  return (
    <View style={[styles.logoHorizontalContainer, { height }, style]}>
      <Image 
        source={logoImage}
        style={[
          { height: height, width: height * 3 },
          variant === 'white' && styles.whiteVariant
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

/**
 * Icon-only version (compact)
 * Usage: <NuonIcon size={48} variant="white" />
 */
export const NuonIcon = ({ 
  size = 48,
  variant = 'default',
  style = {}
}) => {
  return (
    <Image 
      source={logoImage}
      style={[
        { width: size, height: size },
        variant === 'white' && styles.whiteVariant,
        style
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFull: {
    width: 200,
    height: 80,
  },
  logoHorizontalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  whiteVariant: {
    tintColor: '#FFFFFF',
  },
  whiteText: {
    color: '#FFFFFF',
  },
});

export default NuonLogo;
