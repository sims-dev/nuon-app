import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const messageCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const fileTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const chevronDownSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const HelpScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, go to the Learning Modules section, browse available courses, and click "Enroll Now" on your desired course. You can start learning immediately after enrollment.',
    },
    {
      question: 'How do I book a mentorship session?',
      answer: 'Navigate to the Sessions tab, browse available mentors, and click "Book Session" on your chosen mentor\'s profile. You can then select a convenient time slot from their available schedule.',
    },
    {
      question: 'Can I reschedule a mentorship session?',
      answer: 'Yes, you can reschedule a session up to 24 hours before the scheduled time. Go to your upcoming sessions and click "Reschedule" to choose a new time slot.',
    },
    {
      question: 'How do I track my learning progress?',
      answer: 'Your progress is automatically tracked as you complete lessons. You can view your overall progress on the Dashboard and detailed course progress in the Learning Modules section.',
    },
    {
      question: 'What are badges and how do I earn them?',
      answer: 'Badges are achievements you earn by completing various activities like finishing courses, attending sessions, and completing tasks. Check the Achievements section to see all available badges and your progress.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'On the login screen, click "Forgot password?" and follow the instructions sent to your registered email address to reset your password.',
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Currently, all courses require an internet connection. We\'re working on adding offline access in future updates.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the contact options below. We typically respond within 24 hours during business days.',
    },
  ];

  const contactOptions = [
    {
      icon: messageCircleSvg,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      color: '#3B82F6',
      onPress: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
    {
      icon: phoneSvg,
      title: 'Phone Support',
      description: '+91 1800-123-4567',
      action: 'Call Now',
      color: '#10B981',
      onPress: () => Linking.openURL('tel:+9118001234567'),
    },
    {
      icon: mailSvg,
      title: 'Email Support',
      description: 'support@nurseconnect.in',
      action: 'Send Email',
      color: '#8B5CF6',
      onPress: () => Linking.openURL('mailto:support@nurseconnect.in'),
    },
  ];

  const resources = [
    {
      icon: fileTextSvg,
      title: 'User Guide',
      color: '#3B82F6',
      onPress: () => Alert.alert('User Guide', 'User guide feature coming soon!'),
    },
    {
      icon: fileTextSvg,
      title: 'Video Tutorials',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Video Tutorials', 'Video tutorials feature coming soon!'),
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SvgXml xml={searchSvg} width={20} height={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Help Banner */}
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quickHelpBanner}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerHeader}>
              <View style={styles.bannerIcon}>
                <SvgXml xml={messageCircleSvg} width={24} height={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.bannerTitle}>Need Quick Help?</Text>
                <Text style={styles.bannerSubtitle}>We're here to assist you</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Start Live Chat</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            <View style={styles.faqContainer}>
              {filteredFAQs.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFAQ(index)}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <SvgXml
                      xml={expandedFAQ === index ? chevronDownSvg : chevronRightSvg}
                      width={20}
                      height={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                  {expandedFAQ === index && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={option.onPress}
              >
                <View style={styles.contactContent}>
                  <View style={[styles.contactIcon, { backgroundColor: `${option.color}20` }]}>
                    <SvgXml xml={option.icon} width={24} height={24} color={option.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactDescription}>{option.description}</Text>
                  </View>
                  <SvgXml xml={chevronRightSvg} width={20} height={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourcesContainer}>
            {resources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resourceCard}
                onPress={resource.onPress}
              >
                <View style={styles.resourceContent}>
                  <View style={[styles.resourceIcon, { backgroundColor: `${resource.color}20` }]}>
                    <SvgXml xml={resource.icon} width={20} height={20} color={resource.color} />
                  </View>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <SvgXml xml={chevronRightSvg} width={20} height={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  quickHelpBanner: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerContent: {
    padding: 24,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  faqContainer: {
    padding: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
    paddingLeft: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  contactContainer: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  resourcesContainer: {
    gap: 12,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
});

export default HelpScreen;
