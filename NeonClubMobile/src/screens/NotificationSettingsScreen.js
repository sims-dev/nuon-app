import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { settingsAPI } from '../services/api';

const NotificationSettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await settingsAPI.getNotificationSettings();
        const s = res?.data || {};
        if (typeof s.emailNotifications === 'boolean') setEmail(s.emailNotifications);
        if (typeof s.pushNotifications === 'boolean') setPush(s.pushNotifications);
        if (typeof s.smsNotifications === 'boolean') setSms(s.smsNotifications);
      } catch (e) {
        Alert.alert('Error', 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      await settingsAPI.updateNotificationSettings({
        emailNotifications: email,
        pushNotifications: push,
        smsNotifications: sms,
      });
      Alert.alert('Saved', 'Notification settings updated');
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Email Notifications</Text>
            <Text style={styles.hint}>Receive updates via email</Text>
          </View>
          <Switch value={email} onValueChange={setEmail} />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Push Notifications</Text>
            <Text style={styles.hint}>Get alerts on your device</Text>
          </View>
          <Switch value={push} onValueChange={setPush} />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>SMS Notifications</Text>
            <Text style={styles.hint}>Receive SMS for important updates</Text>
          </View>
          <Switch value={sms} onValueChange={setSms} />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={save} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  col: { flex: 1, paddingRight: 12 },
  label: { fontSize: 16, color: '#1e293b', fontWeight: 'bold' },
  hint: { fontSize: 12, color: '#64748b', marginTop: 4 },
  saveButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default NotificationSettingsScreen;
