import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingPromptModal from '../components/BookingPromptModal';
import { checkProfileCompletion } from '../utils/profileUtils';
import { mentorAPI } from '../services/api';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const creditCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const tagSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
const alertCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="m12 7 5-5 5 5"/><path d="m12 7-5-5-5 5"/></svg>`;
const indianRupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>`;

const Payment = ({ route, navigation }) => {
  const { mentor, bookingDetails, paymentData } = route.params;
  const { type, data } = paymentData || {};

  // Determine if this is a mentorship or learning payment
  const isMentorship = mentor && bookingDetails;
  const isLearning = type && data;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const checkProfile = async () => {
      const { isComplete, missingFields: fields } = await checkProfileCompletion();
      if (!isComplete) {
        setMissingFields(fields);
        setShowProfilePrompt(true);
      }
    };
    checkProfile();

    // Auto-complete payment for free sessions
       const mentorPrice = mentor?.hourlyRate || 0;
       if (mentorPrice === 0) {
         setTimeout(() => {
           setShowSuccessPrompt(true);
         }, 1000); // Short delay for UX
       }
  }, [bookingDetails?.price]);

  // Guard against missing data
  if (isMentorship && (!mentor || !mentor.name || !bookingDetails)) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
          Error: Missing mentor information or booking details. Please go back and try again.
        </Text>
      </View>
    );
  }

  if (isLearning && (!type || !data || !data.title)) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
          Error: Missing learning content information. Please go back and try again.
        </Text>
      </View>
    );
  }

  // Valid coupons
  const validCoupons = {
    'PRIYA2024': 200,
    'ANJALI2024': 200,
    'RAHUL2024': 200,
    'WELCOME100': 100,
    'SAVE50': 50,
    'FIRSTTIME': 150,
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (validCoupons[code]) {
      setAppliedCoupon({
        code: code,
        discount: validCoupons[code]
      });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handlePayment = async () => {
    const mentorPrice = mentor?.hourlyRate || 0;
    const totalAmount = (isMentorship ? mentorPrice : (data?.price || 0)) - (appliedCoupon?.discount || 0);

    if (totalAmount <= 0) {
      // Free or fully discounted, complete immediately
      await processPaymentSuccess();
      return;
    }

    // For paid sessions, mock payment since no real gateway
    Alert.alert(
      'Payment Processing',
      'Simulating payment process...',
      [{ text: 'OK' }]
    );

    // Simulate payment delay
    setTimeout(async () => {
      try {
        await processPaymentSuccess();
      } catch (error) {
        console.error('Payment processing failed:', error);
        Alert.alert('Payment Failed', 'Payment processing failed. Please try again.');
      }
    }, 2000);
  };

  const processPaymentSuccess = async () => {
    try {
      if (isMentorship) {
        const mentorPrice = mentor?.hourlyRate || 0;
        if (mentorPrice > 0) {
          // Confirm the paid mentorship booking
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication required');
          }

          await mentorAPI.confirmBooking(bookingDetails.booking.id, token);
          console.log('Paid mentorship booking confirmed successfully');
        } else {
          console.log('Free mentorship booking request sent');
        }
      }
      // For learning content, the enrollment is handled elsewhere
      setShowSuccessPrompt(true);
    } catch (error) {
      console.error('Error processing payment success:', error);
      Alert.alert('Error', 'Payment was successful but there was an issue processing your request. Please contact support.');
    }
  };

  if (showSuccessPrompt) {
    const mentorPrice = mentor?.hourlyRate || 0;
    const isFree = mentorPrice === 0;
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <SvgXml xml={checkCircleSvg} width={48} height={48} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>🎉 Payment Successful!</Text>
            <Text style={styles.successMessage}>
              {isMentorship
                ? `You're enrolled in Mentorship Session with ${mentor?.name || 'Mentor'}.`
                : `You're all set for ${type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop'}: ${data?.title || 'Content'}`
              }
            </Text>
            <Text style={styles.successMessage}>
              {isMentorship && isFree
                ? 'Your request has been sent to the mentor for confirmation.'
                : isMentorship
                ? 'Your session has been confirmed!'
                : ''
              }
            </Text>

            <LinearGradient
              colors={['#EC4899', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.awesomeButton}
            >
              <TouchableOpacity
                style={styles.buttonInner}
                onPress={() => {
                  setShowSuccessPrompt(false);
                  setPaymentComplete(true);
                }}
              >
                <Text style={styles.primaryButtonText}>Awesome!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  }

  if (paymentComplete) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <SvgXml xml={checkCircleSvg} width={48} height={48} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              {isMentorship
                ? `Your mentorship session request with ${mentor?.name || 'Mentor'} has been sent! The mentor will review and confirm your session.`
                : `You're all set for ${type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop'}: ${data?.title || 'Content'}`
              }
            </Text>

            <View style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <SvgXml xml={giftSvg} width={20} height={20} color="#F59E0B" />
                <Text style={styles.rewardLabel}>You earned</Text>
              </View>
              <Text style={styles.rewardPoints}>+200 points</Text>
            </View>

            {appliedCoupon && (
              <View style={styles.couponSavingsCard}>
                <Text style={styles.couponSavingsText}>
                  💰 You saved ₹{appliedCoupon.discount} with code {appliedCoupon.code}!
                </Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              <LinearGradient
                colors={['#EC4899', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <TouchableOpacity style={styles.buttonInner} onPress={() => {
                  if (isMentorship) {
                    navigation.navigate('MySessions');
                  } else {
                    const activeTab = isLearning && data?.category === 'wellness' ? 'wellness' :
                                      isLearning && data?.category === 'fitness' ? 'fitness' :
                                      type === 'course' ? 'courses' :
                                      type === 'event' ? 'events' :
                                      type === 'conference' ? 'conferences' :
                                      type === 'workshop' ? 'workshops' : undefined;
                    navigation.navigate('MyLearning', activeTab ? { activeTab } : undefined);
                  }
                }}>
                  <Text style={styles.primaryButtonText}>
                    {isMentorship ? 'Go to My Sessions' : 'Go to My Learning'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Main')}>
                <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#EC4899', '#8B5CF6', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.orderContent}>
            <Text style={styles.itemTitle}>
              {isMentorship
                ? `Mentorship Session with ${mentor?.name || 'Mentor'}`
                : `${data?.title || 'Content'}`
              }
            </Text>
            <View style={styles.itemBadge}>
              <Text style={styles.badgeText}>
                {isMentorship ? 'Mentorship' : (type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop')}
              </Text>
            </View>

            <View style={styles.priceBreakdown}>
               <View style={styles.priceRow}>
                 <Text style={styles.priceLabel}>Subtotal</Text>
                 <View style={styles.priceValue}>
                   <SvgXml xml={indianRupeeSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.priceText}>
                     {isMentorship ? (mentor?.hourlyRate || 0) : (data?.price || 0)}
                   </Text>
                 </View>
               </View>

               {appliedCoupon && (
                 <View style={styles.priceRow}>
                   <Text style={styles.discountLabel}>Coupon Discount ({appliedCoupon.code})</Text>
                   <View style={styles.discountValue}>
                     <Text style={styles.discountText}>- ₹{appliedCoupon.discount}</Text>
                   </View>
                 </View>
               )}

               <View style={styles.priceRow}>
                 <Text style={styles.priceLabel}>Processing Fee</Text>
                 <View style={styles.priceValue}>
                   <SvgXml xml={indianRupeeSvg} width={14} height={14} color="#6B7280" />
                   <Text style={styles.priceText}>0</Text>
                 </View>
               </View>

               <View style={styles.separator} />

               <View style={styles.totalRow}>
                 <Text style={styles.totalLabel}>Total</Text>
                 <View style={styles.totalValue}>
                   <SvgXml xml={indianRupeeSvg} width={20} height={20} color="#111827" />
                   <Text style={styles.totalText}>
                     {isMentorship ? (mentor?.hourlyRate || 0) - (appliedCoupon?.discount || 0) : (data?.price || 0) - (appliedCoupon?.discount || 0)}
                   </Text>
                 </View>
               </View>
             </View>

            <View style={styles.pointsCard}>
              <View style={styles.pointsHeader}>
                <SvgXml xml={giftSvg} width={16} height={16} color="#D97706" />
                <Text style={styles.pointsLabel}>You'll earn {data?.points || 200} reward points</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Coupon Code Section */}
        <View style={styles.couponCard}>
          <View style={styles.cardHeader}>
            <SvgXml xml={tagSvg} width={20} height={20} color="#8B5CF6" />
            <Text style={styles.cardTitle}>Apply Coupon Code</Text>
          </View>
          {!appliedCoupon ? (
            <View style={styles.couponContent}>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon or referral code"
                  value={couponCode}
                  onChangeText={(text) => {
                    setCouponCode(text.toUpperCase());
                    setCouponError('');
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <View style={styles.errorContainer}>
                  <SvgXml xml={alertCircleSvg} width={16} height={16} color="#DC2626" />
                  <Text style={styles.errorText}>{couponError}</Text>
                </View>
              ) : null}
              <View style={styles.couponHint}>
                <Text style={styles.hintText}>
                  💡 <Text style={styles.hintBold}>Have a referral code?</Text> Enter it here to get instant discount!
                </Text>
                <Text style={styles.hintSubtext}>Try: PRIYA2024, WELCOME100, SAVE50</Text>
              </View>
            </View>
          ) : (
            <View style={styles.appliedCouponCard}>
              <View style={styles.appliedCouponHeader}>
                <View style={styles.appliedCouponLeft}>
                  <View style={styles.checkIcon}>
                    <SvgXml xml={checkSvg} width={16} height={16} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.appliedCouponCode}>{appliedCoupon.code}</Text>
                    <Text style={styles.appliedCouponText}>Coupon applied successfully!</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <SvgXml xml={xSvg} width={16} height={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
              <View style={styles.savingsRow}>
                <Text style={styles.savingsLabel}>You're saving</Text>
                <Text style={styles.savingsAmount}>₹{appliedCoupon.discount}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method Card */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'card' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <View style={styles.methodInfo}>
                <SvgXml xml={creditCardSvg} width={24} height={24} color={selectedPaymentMethod === 'card' ? '#8B5CF6' : '#6B7280'} />
                <Text style={[
                  styles.methodName,
                  selectedPaymentMethod === 'card' && styles.selectedMethodName
                ]}>
                  Credit Card
                </Text>
              </View>
              {selectedPaymentMethod === 'card' && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'upi' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('upi')}
            >
              <View style={styles.methodInfo}>
                <SvgXml xml={creditCardSvg} width={24} height={24} color={selectedPaymentMethod === 'upi' ? '#8B5CF6' : '#6B7280'} />
                <Text style={[
                  styles.methodName,
                  selectedPaymentMethod === 'upi' && styles.selectedMethodName
                ]}>
                  UPI
                </Text>
              </View>
              {selectedPaymentMethod === 'upi' && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'netbanking' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('netbanking')}
            >
              <View style={styles.methodInfo}>
                <SvgXml xml={creditCardSvg} width={24} height={24} color={selectedPaymentMethod === 'netbanking' ? '#8B5CF6' : '#6B7280'} />
                <Text style={[
                  styles.methodName,
                  selectedPaymentMethod === 'netbanking' && styles.selectedMethodName
                ]}>
                  Net Banking
                </Text>
              </View>
              {selectedPaymentMethod === 'netbanking' && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Payment Form */}
        {selectedPaymentMethod === 'card' && (
          <View style={styles.paymentFormCard}>
            <View style={styles.formHeader}>
              <SvgXml xml={creditCardSvg} width={20} height={20} color="#8B5CF6" />
              <Text style={styles.formTitle}>Card Details</Text>
            </View>
            <View style={styles.formContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.cardInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\s/g, '');
                    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
                      setCardNumber(cleaned.replace(/(\d{4})/g, '$1 ').trim());
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.cardInput}
                  placeholder="Name on card"
                  value={cardName}
                  onChangeText={(text) => setCardName(text.toUpperCase())}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.cardRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      if (cleaned.length <= 4) {
                        if (cleaned.length >= 2) {
                          setCardExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
                        } else {
                          setCardExpiry(cleaned);
                        }
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="123"
                    value={cardCvv}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      if (cleaned.length <= 3) {
                        setCardCvv(cleaned);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.securityNote}>
                <SvgXml xml={alertCircleSvg} width={16} height={16} color="#3B82F6" />
                <Text style={styles.securityText}>Your card details are secure and encrypted</Text>
              </View>
            </View>
          </View>
        )}

        {/* UPI Payment Form */}
        {selectedPaymentMethod === 'upi' && (
          <View style={styles.paymentFormCard}>
            <View style={styles.formHeader}>
              <SvgXml xml={creditCardSvg} width={20} height={20} color="#8B5CF6" />
              <Text style={styles.formTitle}>Pay with UPI</Text>
            </View>
            <View style={styles.formContent}>
              {/* UPI Apps */}
              <Text style={styles.upiLabel}>Choose UPI App</Text>
              <View style={styles.upiAppsGrid}>
                {[
                  { name: 'PhonePe', color: '#5F259F' },
                  { name: 'Google Pay', color: '#4285F4' },
                  { name: 'Paytm', color: '#00BAF2' },
                  { name: 'BHIM UPI', color: '#FF9933' }
                ].map((app, index) => (
                  <TouchableOpacity key={index} style={styles.upiAppButton}>
                    <View style={[styles.upiAppIcon, { backgroundColor: app.color }]}>
                      <Text style={styles.upiAppInitial}>{app.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.upiAppName}>{app.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.upiNote}>Tap to open your UPI app and complete payment</Text>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or pay with UPI ID</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Enter UPI ID</Text>
                <TextInput
                  style={styles.cardInput}
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChangeText={(text) => setUpiId(text.toLowerCase())}
                  autoCapitalize="none"
                />
                <Text style={styles.upiHint}>E.g., 9876543210@paytm, name@oksbi, mobile@ybl</Text>
              </View>

              <View style={styles.successNote}>
                <SvgXml xml={checkCircleSvg} width={16} height={16} color="#10B981" />
                <Text style={styles.successText}>Instant payment confirmation • Secure & encrypted</Text>
              </View>
            </View>
          </View>
        )}

        {/* Net Banking Form */}
        {selectedPaymentMethod === 'netbanking' && (
          <View style={styles.paymentFormCard}>
            <View style={styles.formHeader}>
              <SvgXml xml={creditCardSvg} width={20} height={20} color="#8B5CF6" />
              <Text style={styles.formTitle}>Select Your Bank</Text>
            </View>
            <View style={styles.formContent}>
              {[
                'SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
                'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Other Banks'
              ].map((bank, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.bankOption,
                    selectedBank === bank && styles.selectedBankOption
                  ]}
                  onPress={() => setSelectedBank(bank)}
                >
                  <Text style={[
                    styles.bankText,
                    selectedBank === bank && styles.selectedBankText
                  ]}>
                    {bank}
                  </Text>
                  {selectedBank === bank && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {selectedBank && (
                <View style={styles.redirectNote}>
                  <SvgXml xml={alertCircleSvg} width={16} height={16} color="#3B82F6" />
                  <Text style={styles.redirectText}>You'll be redirected to {selectedBank} secure login page</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.amountSection}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <View style={styles.totalAmountContainer}>
              <SvgXml xml={indianRupeeSvg} width={24} height={24} color="#111827" />
              <Text style={styles.totalAmount}>
                {(isMentorship ? (mentor?.hourlyRate || 0) : (data?.price || 0)) - (appliedCoupon?.discount || 0)}
              </Text>
              {appliedCoupon && (
                <Text style={styles.originalAmount}>
                  ₹{isMentorship ? (mentor?.hourlyRate || 0) : (data?.price || 0)}
                </Text>
              )}
            </View>
          </View>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payNowButton}
          >
            <TouchableOpacity style={styles.payNowButtonInner} onPress={handlePayment}>
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBFF' },
  successContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  rewardCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  rewardLabel: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
  },
  rewardPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
  },
  couponSavingsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  couponSavingsText: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  awesomeButton: {
    borderRadius: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 24,
    width: '80%',
    alignSelf: 'center',
  },
  buttonInner: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  priceBreakdown: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 2,
  },
  discountLabel: {
    fontSize: 14,
    color: '#10B981',
  },
  discountValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  },
  pointsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  orderContent: {
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponContent: {
    // Styles for coupon content
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginLeft: 8,
  },
  couponHint: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  hintBold: {
    fontWeight: '600',
  },
  hintSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  appliedCouponCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 16,
    padding: 16,
  },
  appliedCouponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appliedCouponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appliedCouponCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 2,
  },
  appliedCouponText: {
    fontSize: 14,
    color: '#6B7280',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  savingsAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16A34A',
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  selectedPaymentMethod: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  selectedMethodName: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountSection: {
    flex: 1,
  },
  totalAmountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 4,
  },
  originalAmount: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  payNowButton: {
    borderRadius: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  payNowButtonInner: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  pointsText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  formContent: {
    // Container for form content
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  securityText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
  },
  upiLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  upiAppButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  upiAppIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  upiAppInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upiAppName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  upiNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
  },
  upiHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  successNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
  },
  bankOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedBankOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  bankText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedBankText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  redirectNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 16,
  },
  redirectText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
  },
});

export default Payment;