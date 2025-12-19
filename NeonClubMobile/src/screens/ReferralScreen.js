import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Clipboard,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

const { width } = Dimensions.get('window');

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const share2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`;
const messageCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
const facebookSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`;
const twitterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`;
const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

const ReferralScreen = ({ navigation }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'PRIYA2024';
  const referralLink = 'https://neonclub.app/join/PRIYA2024';

  const handleCopy = async (text) => {
    await Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform) => {
    const message = `Join me on Neon Club! Use my referral code ${referralCode} to get started. ${referralLink}`;
    try {
      if (platform === 'whatsapp') {
        // For WhatsApp, you might need to use Linking
        // But for simplicity, use general share
        await Share.share({
          message,
        });
      } else {
        await Share.share({
          message,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share');
    }
  };

  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    pointsEarned: 2400,
    pendingPoints: 600,
  };

  const referralHistory = [
    {
      name: 'Anjali K.',
      status: 'active',
      date: '2024-10-10',
      points: 200,
    },
    {
      name: 'Rahul M.',
      status: 'active',
      date: '2024-10-08',
      points: 200,
    },
    {
      name: 'Neha S.',
      status: 'pending',
      date: '2024-10-15',
      points: 200,
    },
    {
      name: 'Vikram P.',
      status: 'active',
      date: '2024-09-28',
      points: 200,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <SvgXml xml={usersSvg} width={20} height={20} color="#FFFFFF" />
            <Text style={styles.statLabel}>Total Referrals</Text>
            <Text style={styles.statNumber}>{referralStats.totalReferrals}</Text>
          </View>
          <View style={styles.statCard}>
            <SvgXml xml={giftSvg} width={20} height={20} color="#FFFFFF" />
            <Text style={styles.statLabel}>Points Earned</Text>
            <Text style={styles.statNumber}>{referralStats.pointsEarned}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* How it Works */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How Referral Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>Send your unique referral code to friends</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Signs Up</Text>
                <Text style={styles.stepDescription}>They join using your code and get 100 bonus points</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Both Earn Rewards</Text>
                <Text style={styles.stepDescription}>You get 200 points when they complete their first purchase</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Code */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCodeText}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.referralCodeCopyButton}
              onPress={() => handleCopy(referralCode)}
            >
              {copied ? (
                <>
                  <SvgXml xml={checkCircleSvg} width={16} height={16} color="#10B981" />
                  <Text style={styles.copyButtonTextSuccess}>Copied!</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={copySvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.copyButtonText}>Copy Code</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View>
            <Text style={styles.shareLinkLabel}>Or share your referral link</Text>
            <View style={styles.shareLinkInputContainer}>
              <Text style={styles.shareLinkInput} numberOfLines={1}>{referralLink}</Text>
              <TouchableOpacity
                style={styles.shareLinkInputCopyButton}
                onPress={() => handleCopy(referralLink)}
              >
                <SvgXml xml={copySvg} width={16} height={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Options */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Share via</Text>
          <View style={styles.shareGrid}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('whatsapp')}
            >
              <View style={[styles.shareIcon, { backgroundColor: '#dfe9f0ff' }]}>
                <SvgXml xml={messageCircleSvg} width={20} height={20} color="#67c6e8ff" />
              </View>
              <Text style={styles.shareText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('facebook')}
            >
              <View style={[styles.shareIcon, { backgroundColor: '#dfe9f0ff' }]}>
                <SvgXml xml={facebookSvg} width={20} height={20} color="#67c6e8ff" />
              </View>
              <Text style={styles.shareText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('twitter')}
            >
              <View style={[styles.shareIcon, { backgroundColor: '#dfe9f0ff' }]}>
                <SvgXml xml={twitterSvg} width={20} height={20} color="#67c6e8ff" />
              </View>
              <Text style={styles.shareText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('email')}
            >
              <View style={[styles.shareIcon, { backgroundColor: '#f5f7fbff' }]}>
                <SvgXml xml={mailSvg} width={20} height={20} color="#8d8888ff" />
              </View>
              <Text style={styles.shareText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Referral History</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{referralStats.totalReferrals} referrals</Text>
            </View>
          </View>

          <View style={styles.historyList}>
            {referralHistory.map((referral, index) => (
              <View key={index}>
                <View style={styles.historyItem}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{referral.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{referral.name}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(referral.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.historyStatus}>
                    {referral.status === 'active' ? (
                      <>
                        <View style={styles.statusBadgeActive}>
                          <SvgXml xml={checkCircleSvg} width={12} height={12} color="#10B981" />
                          <Text style={styles.statusTextActive}>Active</Text>
                        </View>
                        <Text style={styles.pointsText}>+{referral.points} pts</Text>
                      </>
                    ) : (
                      <>
                        <View style={styles.statusBadgePending}>
                          <Text style={styles.statusTextPending}>Pending</Text>
                        </View>
                        <Text style={styles.pointsTextPending}>Awaiting purchase</Text>
                      </>
                    )}
                  </View>
                </View>
                {index < referralHistory.length - 1 && <View style={styles.historySeparator} />}
              </View>
            ))}
          </View>
        </View>

        {/* Pending Rewards */}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(191,219,254,1)',
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  codeContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    letterSpacing: 2,
    marginBottom: 8,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  copyButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  copyButtonTextSuccess: {
    marginLeft: 4,
    fontSize: 14,
    color: '#10B981',
  },
  referralCodeContainer: {
    backgroundColor: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  referralCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    letterSpacing: 2,
    marginBottom: 8,
  },
  referralCodeCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareLinkLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  shareLinkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareLinkInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1E293B',
  },
  shareLinkInputCopyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  referralLink: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
  },
  linkCopyButton: {
    marginLeft: 8,
  },
  shareLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  shareLinkText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    marginRight: 12,
  },
  shareLinkCopyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareOption: {
    alignItems: 'center',
    gap: 8,
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyStatus: {
    alignItems: 'flex-end',
  },
  statusBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  statusTextActive: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 2,
  },
  statusBadgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  statusTextPending: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  pointsText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  pointsTextPending: {
    fontSize: 12,
    color: '#6B7280',
  },
  historySeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  pendingCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  pendingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 2,
  },
  pendingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  pendingPoints: {
    alignItems: 'flex-end',
  },
  pendingPointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  pendingPointsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ReferralScreen;