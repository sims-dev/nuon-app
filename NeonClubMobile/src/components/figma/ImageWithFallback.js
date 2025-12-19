import React, { useState } from 'react';
import { Image, View, Text } from 'react-native';

const ImageWithFallback = ({ src, alt, style, fallbackStyle }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <View style={[style, fallbackStyle, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 24, color: '#9CA3AF' }}>
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </Text>
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