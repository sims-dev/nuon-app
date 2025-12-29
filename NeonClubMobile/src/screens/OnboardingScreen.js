import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
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
    Icon: () => <SvgXml xml={graduationCapSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(168,85,247,0.9)', 'rgba(59,130,246,0.9)'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGxlYXJuaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2MDM1MDEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    key: 'events',
    title: 'Events & Workshops',
    description:
      'Participate in live events, webinars, and hands-on workshops with industry experts and peers.',
    Icon: () => <SvgXml xml={calendarSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(236,72,153,0.9)', 'rgba(139,92,246,0.9)'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwd29ya3Nob3AlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MDM1MDEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    key: 'mentor',
    title: 'Expert Mentorship',
    description: 'Connect with experienced mentors for personalized guidance and career development support.',
    Icon: () => <SvgXml xml={usersSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(6,182,212,0.9)', 'rgba(59,130,246,0.9)'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZW50b3JzaGlwJTIwY29hY2hpbmd8ZW58MXx8fHwxNzYwMzUwMTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    key: 'champ',
    title: 'Become a Champion',
    description: 'Complete the Nightingale Programme and earn certification as a Neon Club Champion Mentor.',
    Icon: () => <SvgXml xml={awardSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(249,115,22,0.9)', 'rgba(236,72,153,0.9)'],
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHRyb3BoeSUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYwMzUwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    key: 'rewards',
    title: 'Earn Rewards',
    description: 'Get reward points for every activity, course completion, and engagement. Redeem for exclusive benefits!',
    Icon: () => <SvgXml xml={giftSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(255,193,7,0.9)', 'rgba(255,87,34,0.9)'],
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwcmV3YXJkcyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MDM1MDEyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    key: 'career',
    title: 'Advance Your Career',
    description: 'Build your professional profile, track your growth, and unlock new opportunities in healthcare.',
    Icon: () => <SvgXml xml={trendingUpSvg} width={64} height={64} color="#FFFFFF" />,
    colors: ['rgba(76,175,80,0.9)', 'rgba(0,150,136,0.9)'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBncm93dGglMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjAzNTAxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
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
      // final action: navigate to OTPAuth
      navigation.replace('OTPAuth');
    }
  };

  const skipOnboarding = () => {
    console.log('[Onboarding] Skip onboarding clicked');
    // Skip to OTPAuth directly
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
            <ImageBackground
              source={{ uri: s.image }}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={s.colors || ['rgba(124,58,237,0.9)', 'rgba(37,99,235,0.9)']}
                style={styles.overlay}
              />

              <View style={styles.centerContent}>
                <View style={styles.textContainer}>
                  <View style={styles.iconContainer}>
                    {s.Icon ? <s.Icon /> : null}
                  </View>

                  <Text style={styles.title}>{s.title}</Text>

                  <Text style={styles.description}>{s.description}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomSheet}>
        {console.log('[Onboarding] Current slide:', current, 'Show skip:', current !== slides.length - 1)}
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

{current !== slides.length - 1 && (
  <TouchableOpacity style={styles.skipLink} onPress={skipOnboarding} activeOpacity={0.7}>
    <Text style={styles.skipLinkText}>Skip</Text>
  </TouchableOpacity>
)}



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
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 16,
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
  dotsRowCentered: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 6,
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 6,
  },
  activePill: {
    width: 32,
    height: 6,
    borderRadius: 3,
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
