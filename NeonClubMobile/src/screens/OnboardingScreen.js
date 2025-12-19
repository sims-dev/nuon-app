import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../contexts/AuthContext';
import { SvgXml } from 'react-native-svg';

const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const trendingUpSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;
const arrowRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 5 19 12 7 19"/></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'learn',
    title: 'Learn & Grow',
    description:
      'Access exclusive courses, workshops, and training programs designed specifically for nursing professionals.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={graduationCapSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(168,85,247,0.86)', 'rgba(255,106,61,0.7)'],
  },
  {
    key: 'events',
    title: 'Events & Workshops',
    description:
      'Participate in live events, webinars, and hands-on workshops with industry experts and peers.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={calendarSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(236,72,153,0.85)', 'rgba(139,92,246,0.8)'],
  },
  {
    key: 'mentor',
    title: 'Expert Mentorship',
    description: 'Connect with experienced mentors for personalized guidance and career development support.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={usersSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(3,169,244,0.85)', 'rgba(6,182,212,0.7)'],
  },
  {
    key: 'champ',
    title: 'Become a Champion',
    description: 'Complete the Nightingale Programme and earn certification as a Neon Club Champion Mentor.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={awardSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(249,115,22,0.86)', 'rgba(236,72,153,0.7)'],
  },
  {
    key: 'rewards',
    title: 'Earn Rewards',
    description: 'Get reward points for every activity, course completion, and engagement. Redeem for exclusive benefits!',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={giftSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(255,153,0,0.86)', 'rgba(255,94,0,0.7)'],
  },
  {
    key: 'career',
    title: 'Advance Your Career',
    description: 'Build your professional profile, track your growth, and unlock new opportunities in healthcare.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={trendingUpSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(16,185,129,0.86)', 'rgba(5,150,105,0.75)'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);

  const onMomentum = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(idx);
  };

  const { user } = useContext(AuthContext);

  const goNext = () => {
    if (current < slides.length - 1) {
      scrollRef.current.scrollTo({ x: (current + 1) * width, animated: true });
    } else {
      // final action: always navigate to OTP
      navigation.replace('OTPAuth');
    }
  };

  const skip = () => {
    navigation.replace('OTPAuth');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentum}
        style={{ flex: 1 }}
      >
        {slides.map((s, i) => (
          <View key={s.key} style={styles.slide}>
            {/* gradient-only slide (no image) */}
            <LinearGradient
              colors={s.colors || ['rgba(124,58,237,0.85)', 'rgba(37,99,235,0.7)']}
              style={styles.overlay}
            />

            <View style={styles.topContent}>
              <View style={styles.iconContainer}>
                {s.Icon ? <s.Icon /> : null}
              </View>

              <Text style={styles.smallTitle}>{s.title}</Text>

              {/* Description shown under the title */}
              <Text style={styles.description}>{s.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomSheet}>
        <View style={styles.dotsRowCentered}>
          {slides.map((_, idx) => (
            idx === current ? (
              <LinearGradient
                key={idx}
                colors={[ '#A855F7', '#FF6A3D' ]}
                style={styles.activePill}
              />
            ) : (
              <View key={idx} style={styles.dot} />
            )
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.9}>
          <LinearGradient colors={[ '#A855F7', '#FF6A3D' ]} style={styles.nextGradient}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.nextText}>{current === slides.length -1 ? 'Get Started' : 'Next'}</Text>
              {current !== slides.length -1 && <SvgXml xml={chevronRightSvg} width={16} height={16} color="#fff" style={{marginLeft: 8}} />}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={skip} style={styles.skipLink}>
          <Text style={styles.skipLinkText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  topContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 50,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  topSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  smallTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 16,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    borderRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
  dotsRowCentered: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 6,
    justifyContent: 'center',
    width: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#A855F7',
  },
  activePill: {
    width: 48,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  nextBtn: {
    width: '100%',
  },
  nextGradient: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  skipLink: {
    marginTop: 12,
  },
  skipLinkText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
});

export default OnboardingScreen;