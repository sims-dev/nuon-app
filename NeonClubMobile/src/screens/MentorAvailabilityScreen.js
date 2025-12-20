import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { mentorAPI } from '../api/mentorAPI';
import Button from '../components/Button';
import { Card } from '../components/Card';

const MentorAvailabilityScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSlot, setNewSlot] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    duration: '45',
    maxBookings: '1',
    price: '0'
  });

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await mentorAPI.getMentorAvailability(token);
      setSlots(response.availability || []);
      setError('');
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleChange = (field, value) => {
    setNewSlot({ ...newSlot, [field]: value });
  };

  const addSlot = async () => {
    if (!newSlot.startDateTime || !newSlot.endDateTime || !newSlot.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await mentorAPI.createAvailability(newSlot, token);
      if (response) {
        fetchAvailability();
        setNewSlot({
          title: '',
          description: '',
          startDateTime: '',
          endDateTime: '',
          duration: '45',
          maxBookings: '1',
          price: '0'
        });
        Alert.alert('Success', 'Availability slot added successfully');
      }
    } catch (err) {
      console.error('Error adding slot:', err);
      Alert.alert('Error', 'Failed to add availability slot');
    }
  };

  const removeSlot = async (slotId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this availability slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await mentorAPI.deleteAvailability(slotId, token);
              fetchAvailability();
              Alert.alert('Success', 'Availability slot deleted');
            } catch (err) {
              console.error('Error deleting slot:', err);
              Alert.alert('Error', 'Failed to delete availability slot');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Availability</Text>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Add New Slot</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newSlot.title}
          onChangeText={(value) => handleChange('title', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newSlot.description}
          onChangeText={(value) => handleChange('description', value)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Start Date & Time (YYYY-MM-DDTHH:MM)"
          value={newSlot.startDateTime}
          onChangeText={(value) => handleChange('startDateTime', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="End Date & Time (YYYY-MM-DDTHH:MM)"
          value={newSlot.endDateTime}
          onChangeText={(value) => handleChange('endDateTime', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          value={newSlot.duration}
          onChangeText={(value) => handleChange('duration', value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Max Bookings"
          value={newSlot.maxBookings}
          onChangeText={(value) => handleChange('maxBookings', value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Price (₹)"
          value={newSlot.price}
          onChangeText={(value) => handleChange('price', value)}
          keyboardType="numeric"
        />

        <Button onPress={addSlot} style={styles.addButton}>
          Add Slot
        </Button>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Your Slots</Text>

        {slots.length === 0 ? (
          <Text style={styles.noSlotsText}>No slots added yet.</Text>
        ) : (
          slots.map((slot) => (
            <View key={slot.id} style={styles.slotItem}>
              <View style={styles.slotInfo}>
                <Text style={styles.slotTitle}>{slot.title}</Text>
                <Text style={styles.slotDetails}>
                  {new Date(slot.startDateTime).toLocaleString()}
                </Text>
                <Text style={styles.slotDetails}>
                  Duration: {slot.duration} min, Price: ₹{slot.price}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeSlot(slot.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
  },
  noSlotsText: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  slotInfo: {
    flex: 1,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  slotDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#00FFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MentorAvailabilityScreen;