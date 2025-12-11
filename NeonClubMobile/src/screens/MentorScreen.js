import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

const MentorScreen = () => {
  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Mentors</Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Connect with experienced mentors to guide your learning journey</Text>
          <Image
            source={{ uri: 'https://example.com/mentor-image.jpg' }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
          />
          <Text style={{ fontSize: 14, marginTop: 8 }}>Dr. Sarah Johnson</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>Expert in Clinical Skills | 10+ years experience</Text>
        </View>
        <View>
          <Image
            source={{ uri: 'https://example.com/mentor-image2.jpg' }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
          />
          <Text style={{ fontSize: 14, marginTop: 8 }}>Dr. John Doe</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>Specialist in Nursing Education | 8+ years experience</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MentorScreen;