import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Skeleton = ({ width = '100%', height = 16, radius = 8, style }) => (
  <View style={[styles.skeleton, { width, height, borderRadius: radius }, style]} />
);

export const SkeletonList = ({ count = 6, itemHeight = 64, gap = 12 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ marginBottom: gap }}>
        <Skeleton height={itemHeight} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
});

export default Skeleton;
