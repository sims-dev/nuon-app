import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import CelebrationModal from '../components/CelebrationModal';
import NEON_COLORS from '../utils/colors';
import {
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  IndianRupee,
  Gift,
  Tag,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react-native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useContext(AuthContext);

  console.log('[PaymentScreen] Route params:', route.params);
  const { paymentData, mentor, bookingDetails } = route.params || {};
  console.log('[PaymentScreen] Payment data:', paymentData, 'Mentor:', mentor, 'Booking details:', bookingDetails);

  // Check if this is a mentorship booking
  const isMentorshipBooking = mentor && bookingDetails;

  let type, data, initialMode;
  if (isMentorshipBooking) {
    type = 'mentorship';
    data = {
      title: `Mentorship Session with ${mentor.name}`,
      price: bookingDetails.price || mentor.price,
      points: 100, // Default points for mentorship
      mentor: mentor,
      bookingDetails: bookingDetails
    };
    initialMode = 'orderSummary';
  } else {
    const pd = paymentData || { type: 'course', data: { title: 'Activity', price: 1999, points: 300 } };
    type = pd.type;
    data = pd.data;
    initialMode = pd.mode;
  }

  console.log('[PaymentScreen] Type:', type, 'Data:', data, 'Initial mode:', initialMode, 'Is mentorship:', isMentorshipBooking);
  const [mode, setMode] = useState(initialMode || 'orderSummary');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [successOptionsVisible, setSuccessOptionsVisible] = useState(false);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI payment field
  const [upiId, setUpiId] = useState('');

  // Net Banking field
  const [selectedBank, setSelectedBank] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Valid coupons (in production, this would be from backend)
  const validCoupons = {
    'PRIYA2024': 200,
    'ANJALI2024': 200,
    'RAHUL2024': 200,
    'WELCOME100': 100,
    'SAVE50': 50,
    'FIRSTTIME': 150,
  };

  const originalPrice = data.price || 1999;
  const points = data.points || 300;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, originalPrice - discount);

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

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = cleaned.match(/\d{1,4}/g);
    const formatted = match ? match.join(' ').substr(0, 19) : '';
    setCardNumber(formatted);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D+/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (mode === 'orderSummary') {
      // For free mentorship, skip payment mode
      if (isMentorshipBooking && finalPrice === 0) {
        await processFreeMentorshipBooking();
        return;
      }
      // Go to payment mode
      setMode('payment');
      return;
    }

    if (finalPrice > 0 && !paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (finalPrice === 0) {
      // Free purchase
      if (isMentorshipBooking) {
        await processFreeMentorshipBooking();
      } else {
        await processFreePurchase();
      }
      return;
    }

    // Validate payment method specific fields
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        Alert.alert('Error', 'Please enter UPI ID');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        Alert.alert('Error', 'Please select a bank');
        return;
      }
    }

    setLoading(true);

    try {
      // Create order on backend
      const orderResponse = await api.post('/payments/create-order', {
        amount: finalPrice * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        itemType: type,
        itemId: data._id || data.id || data.bookingDetails?.booking?.id,
        couponCode: appliedCoupon?.code,
      });

      const orderData = orderResponse.data;

      // Razorpay checkout options
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Neon Club',
        description: `Payment for ${data.title}`,
        order_id: orderData.id,
        prefill: {
          email: user?.email || '',
          contact: user?.phoneNumber || '',
          name: user?.name || '',
        },
        theme: {
          color: NEON_COLORS.neonPurple,
        },
      };

      // Open Razorpay checkout
      const paymentResponse = await RazorpayCheckout.open(options);

      // Payment successful
      await processSuccessfulPayment(paymentResponse, orderData);

    } catch (error) {
      console.error('Payment error:', error);
      if (error.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Failed', error.description || 'Something went wrong with the payment');
      }
    } finally {
      setLoading(false);
    }
  };

  const processFreePurchase = async () => {
    setLoading(true);
    try {
      // Process free purchase
      const purchaseResponse = await api.post('/payments/free-purchase', {
        itemType: type,
        itemId: data._id || data.id,
        couponCode: appliedCoupon?.code,
      });

      // Show celebration
      setCelebrationVisible(true);

    } catch (error) {
      console.error('Free purchase error:', error);
      Alert.alert('Error', 'Failed to process free purchase');
    } finally {
      setLoading(false);
    }
  };

  const processFreeMentorshipBooking = async () => {
    setLoading(true);
    try {
      // For free mentorship, the booking is already created in BookingScreen
      // Just show success and navigate to MySessions
      setCelebrationVisible(true);

    } catch (error) {
      console.error('Free mentorship booking error:', error);
      Alert.alert('Error', 'Failed to process free mentorship booking');
    } finally {
      setLoading(false);
    }
  };

  const processSuccessfulPayment = async (paymentResponse, orderData) => {
    try {
      // Verify payment on backend
      const verifyResponse = await api.post('/payments/verify', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        itemType: type,
        itemId: data._id || data.id,
        couponCode: appliedCoupon?.code,
      });

      // Show celebration
      setCelebrationVisible(true);

    } catch (error) {
      console.error('Payment verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
    }
  };

  const handleCelebrationClose = () => {
    setCelebrationVisible(false);
    setSuccessOptionsVisible(true);
  };

  // Generate transaction details
  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleGoToMyLearning = () => {
    setSuccessOptionsVisible(false);
    if (isMentorshipBooking) {
      navigation.navigate('MySessions');
    } else {
      navigation.navigate('MyLearning', {
        type,
        data,
        fromPayment: true
      });
    }
  };

  const handleBackToDashboard = () => {
    setSuccessOptionsVisible(false);
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
  };

  const banks = [
    'SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra',
    'Punjab National Bank', 'Bank of Baroda', 'Other Banks'
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[NEON_COLORS.neonPurple, NEON_COLORS.neonBlue]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{data.title}</Text>
                <Text style={styles.itemType}>
                  {type === 'course' ? 'Course' :
                   type === 'event' ? 'Event' :
                   type === 'workshop' ? 'Workshop' :
                   type === 'mentorship' ? 'Mentorship Session' : 'Activity'}
                </Text>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal</Text>
                  <View style={styles.priceValue}>
                    <IndianRupee size={14} color="#374151" />
                    <Text style={styles.priceText}>{originalPrice}</Text>
                  </View>
                </View>

                {appliedCoupon && (
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, styles.discountText]}>
                      Coupon ({appliedCoupon.code})
                    </Text>
                    <View style={[styles.priceValue, styles.discountValue]}>
                      <Text style={styles.discountSymbol}>-</Text>
                      <IndianRupee size={14} color="#059669" />
                      <Text style={styles.discountAmount}>{discount}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <View style={styles.totalValue}>
                    <IndianRupee size={16} color="#1F2937" />
                    <Text style={styles.totalAmount}>{finalPrice}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.pointsCard}>
                <Gift size={16} color="#059669" />
                <Text style={styles.pointsText}>You'll earn {points} reward points</Text>
              </View>
            </View>
          </View>

          {/* Coupon Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apply Coupon</Text>
            <View style={styles.couponCard}>
              {!appliedCoupon ? (
                <View>
                  <View style={styles.couponInputRow}>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter coupon or referral code"
                      value={couponCode}
                      onChangeText={(text) => {
                        setCouponCode(text.toUpperCase());
                        setCouponError('');
                      }}
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={handleApplyCoupon}
                    >
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  </View>

                  {couponError ? (
                    <View style={styles.errorRow}>
                      <AlertCircle size={16} color="#DC2626" />
                      <Text style={styles.errorText}>{couponError}</Text>
                    </View>
                  ) : null}

                  <Text style={styles.couponHint}>
                    💡 Have a referral code? Enter it here to get instant discount!
                  </Text>
                  <Text style={styles.couponExamples}>
                    Try: PRIYA2024, WELCOME100, SAVE50
                  </Text>
                </View>
              ) : (
                <View style={styles.appliedCouponCard}>
                  <View style={styles.couponHeader}>
                    <View style={styles.couponCheck}>
                      <CheckCircle2 size={20} color="#FFFFFF" />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.appliedCode}>{appliedCoupon.code}</Text>
                      <Text style={styles.appliedText}>Coupon applied successfully!</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={handleRemoveCoupon}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.savingsText}>
                    You're saving ₹{discount}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Payment Method - Only show in payment mode and if not free */}
          {mode === 'payment' && finalPrice > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>

              {/* Card Payment */}
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedOption]}
                onPress={() => setPaymentMethod('card')}
              >
                <View style={styles.optionLeft}>
                  <CreditCard size={20} color={paymentMethod === 'card' ? NEON_COLORS.neonPurple : '#6B7280'} />
                  <Text style={[styles.optionText, paymentMethod === 'card' && styles.selectedText]}>
                    Credit/Debit Card
                  </Text>
                </View>
                <View style={[styles.radio, paymentMethod === 'card' && styles.radioSelected]} />
              </TouchableOpacity>

              {/* UPI Payment */}
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'upi' && styles.selectedOption]}
                onPress={() => setPaymentMethod('upi')}
              >
                <View style={styles.optionLeft}>
                  <Smartphone size={20} color={paymentMethod === 'upi' ? NEON_COLORS.neonPurple : '#6B7280'} />
                  <Text style={[styles.optionText, paymentMethod === 'upi' && styles.selectedText]}>
                    UPI
                  </Text>
                </View>
                <View style={[styles.radio, paymentMethod === 'upi' && styles.radioSelected]} />
              </TouchableOpacity>

              {/* Net Banking */}
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'netbanking' && styles.selectedOption]}
                onPress={() => setPaymentMethod('netbanking')}
              >
                <View style={styles.optionLeft}>
                  <Building2 size={20} color={paymentMethod === 'netbanking' ? NEON_COLORS.neonPurple : '#6B7280'} />
                  <Text style={[styles.optionText, paymentMethod === 'netbanking' && styles.selectedText]}>
                    Net Banking
                  </Text>
                </View>
                <View style={[styles.radio, paymentMethod === 'netbanking' && styles.radioSelected]} />
              </TouchableOpacity>
            </View>
          )}

          {/* Card Details Form */}
          {mode === 'payment' && paymentMethod === 'card' && finalPrice > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={formatCardNumber}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cardholder Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name on card"
                    value={cardName}
                    onChangeText={(text) => setCardName(text.toUpperCase())}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, {flex: 1, marginRight: 12}]}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.inputGroup, {flex: 1}]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      value={cardCvv}
                      onChangeText={(text) => setCardCvv(text.replace(/[^0-9]/g, ''))}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.securityNote}>
                  <AlertCircle size={16} color="#059669" />
                  <Text style={styles.securityText}>
                    Your card details are secure and encrypted
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* UPI Form */}
          {mode === 'payment' && paymentMethod === 'upi' && finalPrice > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pay with UPI</Text>
              <View style={styles.formCard}>
                <Text style={styles.upiTitle}>Choose UPI App</Text>
                <View style={styles.upiApps}>
                  <TouchableOpacity style={styles.upiApp}>
                    <View style={[styles.upiIcon, {backgroundColor: '#DC2626'}]}>
                      <Text style={styles.upiIconText}>GP</Text>
                    </View>
                    <Text style={styles.upiAppText}>Google Pay</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.upiApp}>
                    <View style={[styles.upiIcon, {backgroundColor: '#7C3AED'}]}>
                      <Text style={styles.upiIconText}>Pe</Text>
                    </View>
                    <Text style={styles.upiAppText}>PhonePe</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.upiApp}>
                    <View style={[styles.upiIcon, {backgroundColor: '#2563EB'}]}>
                      <Text style={styles.upiIconText}>P</Text>
                    </View>
                    <Text style={styles.upiAppText}>Paytm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.upiApp}>
                    <View style={[styles.upiIcon, {backgroundColor: '#EA580C'}]}>
                      <Text style={styles.upiIconText}>B</Text>
                    </View>
                    <Text style={styles.upiAppText}>BHIM UPI</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.orText}>Or pay with UPI ID</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Enter UPI ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChangeText={(text) => setUpiId(text.toLowerCase())}
                    autoCapitalize="none"
                  />
                  <Text style={styles.upiHint}>
                    E.g., 9876543210@paytm, name@oksbi, mobile@ybl
                  </Text>
                </View>

                <View style={styles.securityNote}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.securityText}>
                    Instant payment confirmation • Secure & encrypted
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Net Banking Form */}
          {mode === 'payment' && paymentMethod === 'netbanking' && finalPrice > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Your Bank</Text>
              <View style={styles.formCard}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedBank}
                    onValueChange={(value) => setSelectedBank(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Choose your bank" value="" />
                    {banks.map((bank) => (
                      <Picker.Item key={bank} label={bank} value={bank} />
                    ))}
                  </Picker>
                </View>

                {selectedBank && (
                  <View style={styles.securityNote}>
                    <AlertCircle size={16} color="#059669" />
                    <Text style={styles.securityText}>
                      You'll be redirected to {selectedBank} secure login page
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <View style={styles.finalPrice}>
              <IndianRupee size={20} color="#1F2937" />
              <Text style={styles.finalAmount}>{finalPrice}</Text>
              {appliedCoupon && (
                <Text style={styles.originalPrice}>₹{originalPrice}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>
                {mode === 'orderSummary' ? (finalPrice === 0 ? 'Get Free' : 'Pay Now') : (finalPrice === 0 ? 'Get Free' : 'Pay Now')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Celebration Modal */}
      <CelebrationModal
        isVisible={celebrationVisible}
        onClose={handleCelebrationClose}
        title={isMentorshipBooking ? "🎉 Booking Confirmed!" : "🎉 Payment Successful!"}
        message={isMentorshipBooking ? `Your mentorship session with ${data.mentor.name} is confirmed!` : `You're enrolled in ${data.title}`}
        icon="gift"
        points={points}
        transactionId={generateTransactionId()}
        amount={finalPrice}
        dateTime={getCurrentDateTime()}
      />

      {/* Success Options Modal */}
      <CelebrationModal
        isVisible={successOptionsVisible}
        title={isMentorshipBooking ? "🎉 Booking Confirmed!" : "🎉 Payment Successful!"}
        message={isMentorshipBooking ? `Your mentorship session with ${data.mentor.name} is confirmed!` : `You're enrolled in ${data.title}`}
        icon="gift"
        points={points}
        showOptions={true}
        onGoToMyLearning={handleGoToMyLearning}
        onBackToDashboard={handleBackToDashboard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemInfo: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceBreakdown: {
    marginBottom: 20,
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
    color: '#374151',
    fontWeight: '500',
  },
  discountText: {
    color: '#059669',
  },
  discountValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountSymbol: {
    fontSize: 14,
    color: '#059669',
    marginRight: 2,
  },
  discountAmount: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pointsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textTransform: 'uppercase',
  },
  applyButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
  },
  couponHint: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  couponExamples: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  appliedCouponCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appliedCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
  appliedText: {
    fontSize: 14,
    color: '#059669',
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  savingsText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  paymentOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: NEON_COLORS.neonPurple,
    backgroundColor: '#F3F4F6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    color: NEON_COLORS.neonPurple,
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioSelected: {
    borderColor: NEON_COLORS.neonPurple,
    backgroundColor: NEON_COLORS.neonPurple,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
  },
  securityNote: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#065F46',
    flex: 1,
  },
  upiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  upiApps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  upiApp: {
    alignItems: 'center',
    gap: 8,
  },
  upiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upiIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upiAppText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 16,
  },
  upiHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    color: '#1F2937',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSection: {
    flex: 1,
  },
  finalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  finalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;