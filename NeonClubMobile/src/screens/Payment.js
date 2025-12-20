import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import BookingPromptModal from '../components/BookingPromptModal';
import { checkProfileCompletion } from '../utils/profileUtils';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const creditCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const tagSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
const alertCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="m12 7 5-5 5 5"/><path d="m12 7-5-5-5 5"/></svg>`;

const Payment = ({ route, navigation }) => {
  const { mentor, bookingDetails } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    const checkProfile = async () => {
      const { isComplete, missingFields: fields } = await checkProfileCompletion();
      if (!isComplete) {
        setMissingFields(fields);
        setShowProfilePrompt(true);
      }
    };
    checkProfile();
  }, []);

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

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

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
              You're all set for Mentorship Session with {mentor.name}
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
                <TouchableOpacity style={styles.buttonInner} onPress={() => navigation.navigate('MyLearning')}>
                  <Text style={styles.primaryButtonText}>Go to My Learning</Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Dashboard')}>
                <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
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
            <Text style={styles.sessionTitle}>Mentorship Session with {mentor.name}</Text>
            <Text style={styles.sessionSubtitle}>
              {bookingDetails.date} • {bookingDetails.time}
            </Text>
            <Text style={styles.sessionPrice}>₹{bookingDetails.price}</Text>
          </View>
        </View>

        {/* Apply Coupon Card */}
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
            <View style={styles.appliedCoupon}>
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
      </ScrollView>

      {/* Bottom Card (Amount and Pay Now Button) */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomContent}>
          <View style={styles.amountSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{bookingDetails.price - (appliedCoupon?.discount || 0)}</Text>
          </View>
          <LinearGradient
            colors={['#EC4899', '#8B5CF6', '#F97316']}
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
  appliedCoupon: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 12,
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
  bottomCard: {
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
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
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
  successIcon: {
    marginBottom: 16,
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
});

export default Payment;