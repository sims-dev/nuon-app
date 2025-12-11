import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

const LearningScreen = () => {
  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Learning</Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Continue your courses, events, and workshops</Text>
          <Image
            source={{ uri: 'https://example.com/learning-image.jpg' }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
          />
          <Text style={{ fontSize: 14, marginTop: 8 }}>Advanced Nursing Techniques</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>Nov 25, 2024 | 10:00 AM - 12:00 PM | Online</Text>
        </View>
        <View>
          <Image
            source={{ uri: 'https://example.com/learning-image2.jpg' }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
          />
          <Text style={{ fontSize: 14, marginTop: 8 }}>Breakthroughs in Nursing Education</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>Dec 1, 2024 | 2:00 PM - 4:00 PM | Online</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LearningScreen;