import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const EngageScreen = () => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Engage</Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Search wellness, fitness, events...</Text>
        {/* Add search bar component here */}
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Prioritize your mental health and well-being with our wellness programs</Text>
        <Image
          source={{ uri: 'https://example.com/image1.jpg' }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
        />
        <Text style={{ fontSize: 14, marginTop: 8 }}>Stress Management for Healthcare Workers</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>Nov 15, 2024 | 6:00 PM - 7:30 PM | Online</Text>
      </View>
      <View>
        <Image
          source={{ uri: 'https://example.com/image2.jpg' }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
        />
        <Text style={{ fontSize: 14, marginTop: 8 }}>Yoga for Mental Health</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>Nov 20, 2024 | 5:00 PM - 6:30 PM | Online</Text>
      </View>
    </View>
  );
};

export default EngageScreen;