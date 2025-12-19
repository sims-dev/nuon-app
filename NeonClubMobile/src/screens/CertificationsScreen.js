import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
const share2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="m6 12 4 2v4l4-2v-4"/><path d="M6 12v4c0 1.1.9 2 2 2h4"/><path d="M14 12v4c0 1.1.9 2 2 2h4v-4"/></svg>`;
const fileCheckSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><path d="m9 15 2 2 4-4"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.174 0l-3.58 2.687a.5.5 0 0 1-.81-.47l1.515-8.526"/><circle cx="12" cy="8" r="6"/></svg>`;

const certifications = [
  {
    id: 1,
    title: 'B.Sc Nursing',
    institution: 'University of Delhi',
    year: '2015',
    type: 'Degree',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwZGVncmVlJTIwY2VydGlmaWNhdGV8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#A855F7', '#A855F7'],
  },
  {
    id: 2,
    title: 'Critical Care Certification',
    institution: 'Indian Nursing Council',
    year: '2018',
    type: 'Certification',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMG1lZGljYWx8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#3B82F6', '#3B82F6'],
  },
  {
    id: 3,
    title: 'Advanced Cardiac Life Support',
    institution: 'ACLS India',
    year: '2020',
    type: 'Certification',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2VydGlmaWNhdGlvbnxlbnwxfHx8fDE3NjA0Mjg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#10B981', '#10B981'],
  },
  {
    id: 4,
    title: 'Excellence in Patient Care',
    institution: 'Apollo Hospitals',
    year: '2023',
    type: 'Award',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMGF3YXJkJTIwdHJvcGh5fGVufDF8fHx8MTc2MDQyODY1M3ww&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#F59E0B', '#D97706'],
  },
  {
    id: 5,
    title: 'Outstanding Nurse Award',
    institution: 'Delhi Nurses Association',
    year: '2022',
    type: 'Award',
    image: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeSUyMGdvbGR8ZW58MXx8fHwxNzYwNDI4NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#EF4444', '#EF4444'],
  },
  {
    id: 6,
    title: 'Infection Control Specialist',
    institution: 'National Healthcare Institute',
    year: '2021',
    type: 'Certification',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMG1lZGljYWx8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&auto=format&fit=crop',
    color: ['#06B6D4', '#06B6D4'],
  },
];

const CertificationsScreen = ({ navigation }) => {
  const degreesCount = certifications.filter(item => item.type === 'Degree').length;
  const certificationsCount = certifications.filter(item => item.type === 'Certification').length;
  const awardsCount = certifications.filter(item => item.type === 'Award').length;

  const handleDownload = (certId, title) => {
    Alert.alert('Download Certificate', `Downloading ${title} certificate`);
  };

  const handleShare = (certId, title) => {
    Alert.alert('Share Certificate', `Sharing ${title} certificate`);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Degree':
        return graduationCapSvg;
      case 'Award':
        return awardSvg;
      default:
        return fileCheckSvg;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#EC4899', '#F97316']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Certifications & Awards</Text>
            <Text style={styles.headerSubtitle}>Your professional credentials</Text>
          </View>
        </View>
      </LinearGradient>


      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <LinearGradient colors={['#F3E8FF', '#E9D5FF']} style={[styles.statCard, { flex: 0.7 }]}>
          <SvgXml xml={graduationCapSvg} width={36} height={36} color="#7C3AED" style={{ marginBottom: 8 }} />
          <Text style={styles.statLabel}>Degree</Text>
          <Text style={styles.statNumber}>{degreesCount}</Text>
        </LinearGradient>
        <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={[styles.statCard, { flex: 1 }]}>
          <SvgXml xml={fileCheckSvg} width={24} height={24} color="#3B82F6" />
          <Text style={styles.statLabel}>Certifications</Text>
          <Text style={styles.statNumber}>{certificationsCount}</Text>
        </LinearGradient>
        <LinearGradient colors={['#FFFBEB', '#FED7AA']} style={[styles.statCard, { flex: 1.3 }]}>
          <SvgXml xml={awardSvg} width={24} height={24} color="#F97316" />
          <Text style={styles.statLabel}>Awards</Text>
          <Text style={styles.statNumber}>{awardsCount}</Text>
        </LinearGradient>
      </View>

      {/* Certifications List */}
      <View style={styles.itemsContainer}>
        {certifications.map((cert) => {
          const IconComponent = getIcon(cert.type);

          return (
            <View key={cert.id} style={styles.itemCard}>
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: cert.image }} style={styles.itemImage} />
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay} />
                <View style={[styles.iconBadge, { backgroundColor: cert.color[0] }]}>
                  <SvgXml xml={IconComponent} width={16} height={16} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.itemContent}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{cert.type}</Text>
                </View>
                <Text style={styles.itemTitle}>{cert.title}</Text>
                <Text style={styles.itemSubtitle}>{cert.institution}</Text>
                <Text style={styles.itemYear}>Issued: {cert.year}</Text>

                <View style={styles.itemActions}>
                  <LinearGradient
                    colors={['#7C3AED', '#EC4899']}
                    style={[styles.actionButton, styles.downloadButton, { flex: 2 }]}
                  >
                    <TouchableOpacity
                      style={styles.gradientTouchable}
                      onPress={() => handleDownload(cert.id, cert.title)}
                    >
                      <SvgXml xml={downloadSvg} width={16} height={16} color="#FFFFFF" />
                      <Text style={[styles.actionText, styles.downloadText]}>Download</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <Pressable
                    style={[styles.actionButton, styles.shareButton, { flex: 1 }]}
                    onPress={() => handleShare(cert.id, cert.title)}
                  >
                    <SvgXml xml={share2Svg} width={16} height={16} color="#6B7280" />
                    <Text style={[styles.actionText, styles.shareText]}>Share</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 15,
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  itemsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  itemImageContainer: {
    width: 80,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  iconBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  itemContent: {
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 22,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemYear: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  downloadButton: {
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    backgroundColor: '#DBEAFE',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 2,
  },
  shareText: {
    color: '#6B7280',
  },
  shareTextPressed: {
    color: '#FFFFFF',
  },
  gradientTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CertificationsScreen;