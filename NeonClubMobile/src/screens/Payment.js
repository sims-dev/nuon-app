import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mentorAPI } from '../api/mentorAPI';

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
const tagSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
const creditCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
const rupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6H2l4-6z"/><path d="M6 9v12l8-6V9"/><path d="M6 9H2"/><path d="M6 15H2"/></svg>`;

const Payment = ({ route, navigation }) => {
  const { mentor, selectedDate, selectedSlot } = route.params || {};
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [upiId, setUpiId] = useState('');

  // Fallback data
  const defaultMentor = { name: 'Dr. Sunita Verma', price: 1999 };
  const defaultSelectedDate = 'Tomorrow';
  const defaultSelectedSlot = '3:00 PM';

  const mentorData = mentor || defaultMentor;
  const date = selectedDate || defaultSelectedDate;
  const slot = selectedSlot || defaultSelectedSlot;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'NEON10') {
      setAppliedCoupon({ code: 'NEON10', discount: 10 });
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code.');
    }
  };

  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to proceed with payment');
        return;
      }

      // Mock booking and payment
      const bookingData = {
        availabilityId: selectedSlot?.id || 1,
        notes: '',
      };
      const bookingResult = await mentorAPI.bookSession(bookingData, token);

      Alert.alert('Success', 'Payment successful! Session booked.', [
        { text: 'OK', onPress: () => navigation.navigate('MentorshipScreen') }
      ]);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const totalAmount = appliedCoupon
    ? mentorData.price - (mentorData.price * appliedCoupon.discount / 100)
    : mentorData.price;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.itemTitle}>{mentorData.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Mentorship Session</Text>
              </View>
            </View>
            <View style={styles.summaryDetails}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{selectedDate}</Text>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{selectedSlot}</Text>
            </View>
          </View>
        </View>

        {/* Coupon Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SvgXml xml={tagSvg} width={20} height={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Have a Coupon?</Text>
          </View>
          {!appliedCoupon ? (
            <View style={styles.couponCard}>
              <TextInput
                placeholder="Enter coupon code"
                placeholderTextColor="#9ca3af"
                style={styles.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <LinearGradient colors={['#dcfce7', '#ecfdf5']} style={styles.appliedCouponCard}>
              <View style={styles.appliedCouponContent}>
                <Text style={styles.appliedCouponCode}>{appliedCoupon.code}</Text>
                <Text style={styles.appliedCouponText}>Coupon applied successfully!</Text>
                <Text style={styles.appliedCouponSavings}>You saved ₹{mentorData.price * appliedCoupon.discount / 100}</Text>
              </View>
            </LinearGradient>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[styles.paymentMethod, selectedPaymentMethod === 'card' && styles.selectedPaymentMethod]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <SvgXml xml={creditCardSvg} width={20} height={20} color={selectedPaymentMethod === 'card' ? '#7c3aed' : '#6b7280'} />
              <Text style={[styles.paymentMethodText, selectedPaymentMethod === 'card' && styles.selectedPaymentMethodText]}>
                Credit/Debit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentMethod, selectedPaymentMethod === 'upi' && styles.selectedPaymentMethod]}
              onPress={() => setSelectedPaymentMethod('upi')}
            >
              <Text style={[styles.paymentMethodText, selectedPaymentMethod === 'upi' && styles.selectedPaymentMethodText]}>
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Forms */}
        {selectedPaymentMethod === 'card' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SvgXml xml={creditCardSvg} width={20} height={20} color="#7c3aed" />
              <Text style={styles.sectionTitle}>Card Details</Text>
            </View>
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={cardDetails.number}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    placeholder="MM/YY"
                    placeholderTextColor="#9ca3af"
                    style={styles.input}
                    value={cardDetails.expiry}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    placeholder="123"
                    placeholderTextColor="#9ca3af"
                    style={styles.input}
                    value={cardDetails.cvv}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                    keyboardType="numeric"
                    secureTextEntry
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={cardDetails.name}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
                />
              </View>
            </View>
          </View>
        )}

        {selectedPaymentMethod === 'upi' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UPI Details</Text>
            <View style={styles.upiForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI ID</Text>
                <TextInput
                  placeholder="yourname@upi"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={upiId}
                  onChangeText={setUpiId}
                />
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Enter your UPI ID (e.g., yourname@paytm, yourname@ybl). Make sure your UPI app is installed and linked.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <View style={styles.bottomPriceAmount}>
            <SvgXml xml={rupeeSvg} width={20} height={20} color="#7c3aed" />
            <Text style={styles.bottomPriceValue}>{totalAmount}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payNowButton} onPress={handlePayment}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payNowButtonGradient}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceValue: {
    fontSize: 16,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  couponApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14532d',
  },
  couponSavings: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalValue: {
    fontSize: 20,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
    marginRight: 12,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  appliedCouponCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  appliedCouponContent: {
    alignItems: 'center',
  },
  appliedCouponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 4,
  },
  appliedCouponText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  appliedCouponSavings: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  paymentMethods: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedPaymentMethod: {
    backgroundColor: '#faf5ff',
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderRadius: 8,
    margin: 8,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 12,
  },
  selectedPaymentMethodText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  cardForm: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  upiForm: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomPriceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomPriceValue: {
    fontSize: 20,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  payNowButton: {
    borderRadius: 50,
    overflow: 'hidden',
    height: 48,
  },
  payNowButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Payment;