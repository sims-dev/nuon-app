import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NCC_HERO } from '../assets/heroImages';
import { nccAPI } from '../services/api';
import { SvgXml } from 'react-native-svg';

const lampSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="m15.09 14 .12-.12a5 5 0 0 0 0-7.07L12 3.6 8.79 6.81a5 5 0 0 0 0 7.07l.12.12"/></svg>`;
const sparklesSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
const fileTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
const trophySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

const NCCScreen = ({ navigation }) => {
  const [uiNumber, setUiNumber] = useState(null);

  // Optional: load and sync status with backend, not blocking UI
  useEffect(() => {
    (async () => {
      try {
        await nccAPI.getNCCStatus().catch(() => {});
        // Fetch latest UI number (admin-configured)
        try {
          const res = await nccAPI.getUiNumber();
          const n = res?.data?.uiNumber;
          if (n) setUiNumber(n);
        } catch {}
      } catch {}
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#9333EA", "#EC4899", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack()? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:24 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flexDirection:'row', alignItems:'center', gap:6, flex:1 }}>
            <SvgXml xml={lampSvg} width={24} height={24} color="#FDE047" />
            <Text style={styles.headerTitle}>Nightingale Programme</Text>
          </View>
          {uiNumber ? (
            <View style={styles.uiPill}><Text style={styles.uiPillText}>UI No: {String(uiNumber)}</Text></View>
          ) : null}
        </View>
        <Text style={styles.headerSub}>Champion Mentor Certification</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 }}>
        {/* Hero Card with Coming Soon */}
        <ImageBackground source={{ uri: NCC_HERO }} style={styles.heroCard} imageStyle={{ borderRadius:24 }}>
          <LinearGradient 
            colors={['rgba(147,51,234,0.8)', 'rgba(236,72,153,0.8)', 'rgba(249,115,22,0.8)']} 
            start={{x:0,y:0}} 
            end={{x:1,y:1}} 
            style={styles.heroOverlay}
          >
            <View style={styles.heroIcon}>
              <SvgXml xml={lampSvg} width={48} height={48} color="#FDE047" />
            </View>
            <Text style={styles.heroTitle}>The Nightingale Programme</Text>
            <Text style={styles.heroDesc}>
              Follow in the footsteps of Florence Nightingale. Become a certified Champion Mentor and light the way for the next generation of nurses.
            </Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon in Phase 2</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Thank You Message */}
        <LinearGradient 
          colors={['#FAF5FF', '#FCE7F3', '#FFF7ED']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#E9D5FF' }]}
        >
          <View style={[styles.sparkleIcon, { alignSelf:'center', marginBottom:12 }]}>
            <SvgXml xml={sparklesSvg} width={40} height={40} color="#9333EA" />
          </View>
          <Text style={[styles.cardTitle, { textAlign:'center', marginBottom:12 }]}>Thank You for Your Interest!</Text>
          <Text style={[styles.cardDesc, { textAlign:'center', marginBottom:8 }]}>
            We're excited about your enthusiasm to become a Champion Mentor. The Nightingale Programme will be launched soon as part of Phase 2 of NUON.
          </Text>
          <Text style={[styles.cardDescSmall, { textAlign:'center' }]}>
            We'll notify you as soon as enrollments open. Stay tuned! 🎉
          </Text>
        </LinearGradient>

        {/* Nightingale Values */}
        <LinearGradient 
          colors={['#FAF5FF', '#FCE7F3']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#F3E8FF' }]}
        >
          <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 }}>
            <SvgXml xml={heartSvg} width={20} height={20} color="#9333EA" />
            <Text style={styles.cardTitle}>The Nightingale Values</Text>
          </View>
          {[
            { title: 'Compassionate Leadership', desc: 'Lead with empathy and understanding', color:'#9333EA' },
            { title: 'Knowledge Sharing', desc: 'Illuminate others with your wisdom', color:'#EC4899' },
            { title: 'Professional Excellence', desc: 'Maintain the highest standards', color:'#F97316' },
            { title: 'Continuous Growth', desc: 'Never stop learning and improving', color:'#F59E0B' },
          ].map((item, idx) => (
            <View key={idx} style={styles.valueRow}>
              <View style={[styles.valueDot, { backgroundColor:item.color }]} />
              <View style={{ flex:1 }}>
                <Text style={styles.valueTitle}>{item.title}</Text>
                <Text style={styles.valueDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* Champion Mentor Benefits */}
        <LinearGradient 
          colors={['#FFFBEB', '#FEF3C7']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#FDE68A' }]}
        >
          <Text style={[styles.cardTitle, { marginBottom:12 }]}>Champion Mentor Benefits</Text>
          {[
            { title: 'Official Certification', desc: 'Recognized Nightingale Champion Mentor status', icon: lampSvg, color:'#EAB308' },
            { title: 'Guide Future Nurses', desc: 'Mentor and inspire the next generation', icon: usersSvg, color:'#9333EA' },
            { title: 'Earn While You Mentor', desc: 'Get paid for sessions + 2x reward points', icon: trophySvg, color:'#F97316' },
            { title: 'Elite Network Access', desc: 'Join the community of healthcare leaders', icon: sparklesSvg, color:'#EC4899' },
          ].map((item, idx) => (
            <View key={idx} style={styles.benefitRow}>
              <SvgXml xml={item.icon} width={20} height={20} color={item.color} />
              <View style={{ flex:1 }}>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* The Nightingale Journey - 3 Steps */}
        <View style={styles.cardSoft}>
          <Text style={[styles.cardTitle, { marginBottom:4 }]}>The Nightingale Journey</Text>
          <Text style={[styles.cardDesc, { marginBottom:16 }]}>3 transformative steps to mentorship</Text>
          
          {/* Step 1 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#9333EA', '#A855F7']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <SvgXml xml={fileTextSvg} width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 1</Text>
              </View>
              <Text style={styles.stepTitle}>Assessment Questionnaire</Text>
              <Text style={styles.stepDesc}>Evaluate your expertise and readiness</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Step 2 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#EC4899', '#F472B6']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <SvgXml xml={usersSvg} width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 2</Text>
              </View>
              <Text style={styles.stepTitle}>Workshop & Interview</Text>
              <Text style={styles.stepDesc}>Live evaluation with expert panel</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Step 3 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#F97316', '#FB923C']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <SvgXml xml={graduationCapSvg} width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 3</Text>
              </View>
              <Text style={styles.stepTitle}>Leadership Programme</Text>
              <Text style={styles.stepDesc}>4-week intensive mentoring training</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Final */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#F59E0B', '#FBBF24']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <SvgXml xml={lampSvg} width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#FEF3C7' }]}>
                <Text style={[styles.stepBadgeText, { color:'#92400E' }]}>Final</Text>
              </View>
              <Text style={styles.stepTitle}>Nightingale Certification</Text>
              <Text style={styles.stepDesc}>Receive your Champion Mentor certificate</Text>
            </View>
          </View>
        </View>

        {/* Return to Dashboard Button */}
        <LinearGradient 
          colors={['#6D28D9', '#EC4899', '#F97316']} 
          start={{x:0,y:0}} 
          end={{x:1,y:0}} 
          style={styles.ctaButton}
        >
          <TouchableOpacity 
            style={{ paddingVertical:18, width:'100%', alignItems:'center' }}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.ctaText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.footerNote}>
          Want to be notified when we launch? Make sure your notification preferences are enabled in your profile.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: { 
    paddingTop: 48, 
    paddingBottom: 24, 
    paddingHorizontal: 24, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
  },
  backBtn: { 
    marginRight: 8,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800',
  },
  uiPill: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 999,
    marginLeft: 8,
  },
  uiPillText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 12,
  },
  headerSub: { 
    color: 'rgba(255,255,255,0.90)', 
    marginLeft: 50,
    fontSize: 14,
  },
  
  // Hero Card
  heroCard: {
    minHeight: 320,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroOverlay: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  comingSoonBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 0,
  },
  comingSoonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 13,
  },
  
  // Cards
  cardSoft: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  cardDescSmall: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  
  sparkleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(147,51,234,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  // Values Section
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  valueDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  
  // Benefits Section
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  
  // Journey Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  stepConnector: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginLeft: 23,
    marginVertical: 8,
  },
  
  // CTA Button
  ctaButton: {
    borderRadius: 999,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  
  footerNote: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});

export default NCCScreen;