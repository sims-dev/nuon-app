import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { mentorAPI } from '../api/mentorAPI';
import Button from '../components/Button';
import { Card } from '../components/Card';
import BookingPromptModal from '../components/BookingPromptModal';

const MentorAvailabilityScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
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
      const message = err.response?.data?.message || err.message || 'Failed to load availability';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileComplete = async () => {
    try {
      const response = await mentorAPI.getMentorProfile(token);
      // Assuming the response has isProfileComplete or we check required fields
      const profile = response;
      const isComplete = profile.name && profile.email && profile.specialization && profile.experience && profile.hospital && profile.registrationNumber;
      setProfileComplete(isComplete);
      if (!isComplete) {
        setShowProfilePrompt(true);
      }
    } catch (err) {
      console.error('Error checking profile:', err);
      const message = err.response?.data?.message || err.message || 'Failed to check profile';
      // Assume profile is incomplete if we can't check
      setProfileComplete(false);
      setShowProfilePrompt(true);
      Alert.alert('Profile Check Error', message);
    }
  };

  useEffect(() => {
    fetchAvailability();
    checkProfileComplete();
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
      const message = err.response?.data?.message || err.message || 'Failed to add availability slot';
      Alert.alert('Error', message);
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
              const message = err.response?.data?.message || err.message || 'Failed to delete availability slot';
              Alert.alert('Error', message);
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

      <BookingPromptModal
        visible={showProfilePrompt}
        onCompleteNow={() => {
          setShowProfilePrompt(false);
          navigation.navigate('Profile'); // Assuming there's a Profile screen
        }}
        onMaybeLater={() => setShowProfilePrompt(false)}
        title="Complete Your Mentor Profile"
        description="Please complete your professional information to manage availability and provide mentorship sessions. This helps us match you with the right mentees."
        buttonText="Complete Profile Now →"
        missingFields={['Specialization', 'Experience', 'Hospital', 'Registration Number']}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 16,
    textShadowColor: '#EC4899',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    backdropFilter: 'blur(5px)',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
    borderRadius: 25,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    textShadowColor: '#EF4444',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  noSlotsText: {
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  slotInfo: {
    flex: 1,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  slotDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default MentorAvailabilityScreen;