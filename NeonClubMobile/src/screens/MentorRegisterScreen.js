import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Modal, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ImageBackground } from 'react-native';
import { MENTOR_HERO } from '../assets/heroImages';
import { mentorAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { NEON_COLORS } from '../utils/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { SvgXml } from 'react-native-svg';

const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const building2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
const fileTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
const sendSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;

const Field = ({ label, value, onChangeText, placeholder, keyboardType }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      style={styles.input}
    />
  </View>
);

const MentorRegisterScreen = ({ navigation }) => {
  // Personal Information
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Professional Details
  const [currentHospital, setCurrentHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Additional
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [expPickerOpen, setExpPickerOpen] = useState(false);
  const [specPickerOpen, setSpecPickerOpen] = useState(false);

  const experienceOptions = ['5–7 years', '7–10 years', '10–15 years', '15+ years'];
  const specializationOptions = ['Critical Care', 'Emergency', 'Pediatric', 'Oncology', 'Cardiac', 'Other'];

  const onSubmit = async () => {
    // Client-side validation
    const errs = [];
    const phoneNorm = (phone || '').replace(/\s|-/g, '');
    const emailNorm = (email || '').trim();
    if (!name.trim()) errs.push('Full Name is required');
    if (!phoneNorm || !/^\+?\d{10,15}$/.test(phoneNorm)) errs.push('Valid Phone Number is required');
    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) errs.push('Valid Email is required');
    if (!currentHospital.trim()) errs.push('Current Hospital/Clinic is required');
    if (!experience) errs.push('Years of Experience is required');
    if (!specialization) errs.push('Specialization is required');
    if (!registrationNumber.trim()) errs.push('Registration Number is required');
    if (!bio.trim() || bio.trim().length < 20) errs.push('Tell us more in the “Additional Information” (min 20 characters)');
    if (errs.length) { Alert.alert('Please fix the following', errs.join('\n')); return; }
    setSubmitting(true);
    try {
      // Build FormData if photo selected
      const hasPhoto = !!photo;
      if (hasPhoto) {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('phone', phone);
        fd.append('email', email);
        fd.append('specialization', specialization);
        fd.append('experience', experience);
        fd.append('currentHospital', currentHospital);
        fd.append('registrationNumber', registrationNumber);
        fd.append('bio', bio);
        // RN requires file object with uri, type, name
        fd.append('photo', { uri: photo.uri, type: photo.type || 'image/jpeg', name: photo.fileName || 'mentor.jpg' });
        await mentorAPI.apply(fd);
      } else {
        await mentorAPI.apply({
          name,
          phone: phoneNorm,
          email: emailNorm,
          specialization,
          experience,
          currentHospital,
          registrationNumber,
          bio,
        });
      }
      setSuccessVisible(true);
    } catch (e) {
      Alert.alert('Failed', 'Could not submit right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickPhoto = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.9, includeBase64: false });
      if (res?.assets && res.assets.length) {
        const asset = res.assets[0];
        setPhoto(asset);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SuccessModal
        visible={successVisible}
        title="Application submitted"
        message="Thanks! Our team will review your application and get back to you."
        buttonText="Explore Mentors"
        onClose={() => { setSuccessVisible(false); navigation.replace('Mentors'); }}
      />
      
      {/* Header - Fixed at top */}
      <LinearGradient colors={['#9333EA', '#EC4899', '#F97316']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main'))} style={{ padding: 8 }}>
            <Text style={{ color:'#fff', fontSize: 24 }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Direct Registration</Text>
        </View>
        <Text style={styles.headerSub}>For experienced nurses (5+ years)</Text>
      </LinearGradient>

      {/* Scrollable Form Content */}
      <ScrollView contentContainerStyle={styles.container}>

        {/* Section: Express Your Interest */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Express Your Interest</Text>
          <Text style={styles.noticeSub}>Submit your details and our team will review your profile for direct enrollment in premium programmes and exclusive opportunities.</Text>
        </View>

        {/* Section: Personal Information */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <SvgXml xml={userSvg} width={20} height={20} color="#9333EA" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          <Field label="Full Name *" value={name} onChangeText={setName} placeholder="Enter your full name" />
          <View style={{ flexDirection:'row', gap: 12 }}>
            <View style={{ flex:1 }}>
              <Field label="Phone Number *" value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
            </View>
            <View style={{ flex:1 }}>
              <Field label="Email *" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
            </View>
          </View>
        </View>

        {/* Section: Professional Details */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <SvgXml xml={building2Svg} width={20} height={20} color="#9333EA" />
            <Text style={styles.cardTitle}>Professional Details</Text>
          </View>
          <Field label="Current Hospital/Clinic *" value={currentHospital} onChangeText={setCurrentHospital} placeholder="Your workplace" />
          <View style={{ flexDirection:'row', gap: 12 }}>
            <View style={{ flex:1 }}>
              <Text style={styles.label}>Years of Experience *</Text>
              <TouchableOpacity style={styles.select} onPress={() => setExpPickerOpen(true)}>
                <Text style={{ color: experience ? '#111827' : '#9CA3AF' }}>{experience || 'Select'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.label}>Specialization *</Text>
              <TouchableOpacity style={styles.select} onPress={() => setSpecPickerOpen(true)}>
                <Text style={{ color: specialization ? '#111827' : '#9CA3AF' }}>{specialization || 'Select'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Field label="Nursing Registration Number *" value={registrationNumber} onChangeText={setRegistrationNumber} placeholder="Registration number" />
        </View>

        {/* Section: Additional Information */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <SvgXml xml={fileTextSvg} width={20} height={20} color="#9333EA" />
            <Text style={styles.cardTitle}>Additional Information</Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>What interests you most about Neon Club? *</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your professional goals and why you’d like direct access..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
            />
          </View>
        </View>

        {/* Availability removed per request */}

        <LinearGradient colors={['#9333EA', '#EC4899', '#F97316']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.submitBtn, submitting && { opacity: 0.6 }]}>
          <TouchableOpacity onPress={onSubmit} disabled={submitting} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <SvgXml xml={sendSvg} width={20} height={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.submitText}>{submitting ? 'Submitting…' : 'Submit Application'}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.disclaimer}>
          By submitting, you agree to our verification process and communication via phone/email
        </Text>
      </ScrollView>

      {/* Experience Picker Modal */}
      <Modal visible={expPickerOpen} transparent animationType="fade" onRequestClose={() => setExpPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Experience</Text>
            {experienceOptions.map((opt) => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setExperience(opt); setExpPickerOpen(false); }}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setExpPickerOpen(false)} style={[styles.modalOption, { marginTop: 8 }]}>
              <Text style={[styles.modalOptionText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Specialization Picker Modal */}
      <Modal visible={specPickerOpen} transparent animationType="fade" onRequestClose={() => setSpecPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Specialization</Text>
            {specializationOptions.map((opt) => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setSpecialization(opt); setSpecPickerOpen(false); }}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setSpecPickerOpen(false)} style={[styles.modalOption, { marginTop: 8 }]}>
              <Text style={[styles.modalOptionText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 48, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  headerTitle: { color:'#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color:'rgba(255,255,255,0.90)', fontSize: 14, lineHeight: 20 },
  container: { padding: 24, paddingBottom: 40 },
  card: { backgroundColor:'#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  noticeCard: { backgroundColor:'#F9FAFB', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#E9D5FF', marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  noticeTitle: { color:'#6D28D9', fontWeight:'700', marginBottom: 8, fontSize: 16 },
  noticeSub: { color:'#374151', fontSize: 14, lineHeight: 21 },
  cardTitle: { color:'#111827', fontWeight:'700', fontSize: 16 },
  label: { color: '#111827', fontWeight: '600', marginBottom: 6, fontSize: 14 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS==='ios'?14:12, color:'#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  select: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS==='ios'?14:12, justifyContent:'center', borderWidth: 1, borderColor: '#E5E7EB' },
  submitBtn: { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  disclaimer: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 16, lineHeight: 18 },
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor:'#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontWeight:'700', color:'#0F172A', marginBottom: 12, fontSize: 16 },
  modalOption: { paddingVertical: 14, borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  modalOptionText: { color:'#111827', fontSize: 15 },
});

export default MentorRegisterScreen;
