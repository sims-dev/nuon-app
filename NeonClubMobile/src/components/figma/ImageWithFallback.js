import React, { useState } from 'react';
import { Image, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ImageWithFallback = ({ src, alt, style, fallbackStyle }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <View style={[style, fallbackStyle]}>
        <LinearGradient
          colors={['#7c3aed', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: style?.borderRadius || 16 }}
        >
          <Text style={{ fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' }}>
            {alt ? alt.charAt(0).toUpperCase() : 'M'}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={style}
      onError={() => setHasError(true)}
      resizeMode="cover"
    />
  );
};

export { ImageWithFallback };