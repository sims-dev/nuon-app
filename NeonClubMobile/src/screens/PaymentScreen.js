
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
// Using text-based icons instead of vector icons to avoid dependency issues
import { paymentAPI, bookingAPI } from '../services/api';
import api from '../services/api';
import GiftIcon from '../components/GiftIcon';
import IconBox from '../components/IconBox';


const PaymentScreen = ({ route, navigation }) => {
   // Check if this is for engage activity or mentorship session
   const { type, item } = route.params || {};

   // Engage activity payment params
   if (type === 'engage-activity' && item) {
     const engageItem = item;
     const engagePrice = engageItem.price || 0;
     const engageName = engageItem.title || 'Engage Activity';
     const engageType = engageItem.category === 'wellness' ? 'Wellness' :
                       engageItem.category === 'fitness' ? 'Fitness' : 'Event';

     // Use engage-specific variables
     const [loading, setLoading] = useState(false);
     const [successVisible, setSuccessVisible] = useState(false);
     const [selectedMethod, setSelectedMethod] = useState('card');
     const [coupon, setCoupon] = useState('');
     const [appliedCoupon, setAppliedCoupon] = useState(null);
     const [couponError, setCouponError] = useState('');

     const paymentMethods = [
       { id: 'card', name: 'Credit/Debit Card' },
       { id: 'upi', name: 'UPI' },
       { id: 'netbanking', name: 'Net Banking' },
     ];

     const discounts = useMemo(() => ({
       'ENGAGE2024': 100,
       'WELCOME50': 50,
       'SAVE25': 25,
     }), []);
     const normalizedCoupon = (c) => (c || '').toUpperCase().trim();
     const discountAmount = useMemo(() => (appliedCoupon ? (discounts[appliedCoupon] || 0) : 0), [appliedCoupon, discounts]);
     const finalAmount = Math.max(0, engagePrice - discountAmount);
     const rewardPoints = Math.floor(finalAmount / 10) * 2;

     const applyCoupon = () => {
       setCouponError('');
       const code = normalizedCoupon(coupon);
       if (!code) {
         setCouponError('Enter a coupon code');
         return;
       }
       if (!discounts[code]) {
         setCouponError('Invalid or expired coupon');
         return;
       }
       setAppliedCoupon(code);
     };

     const removeCoupon = () => {
       setAppliedCoupon(null);
       setCoupon('');
       setCouponError('');
     };

     const handlePayment = async () => {
       setLoading(true);
       try {
         // For free items, skip payment processing and directly register
         if (finalAmount === 0) {
           await api.post(`/engage/activities/${engageItem._id}/register`, {
             paymentId: 'free_' + Date.now(),
             paymentMethod: 'free',
             coupon: appliedCoupon || undefined,
           });
           setLoading(false);
           setSuccessVisible(true);
           return;
         }

         // Create engage activity registration with payment
         const paymentData = {
           activityId: engageItem._id,
           amount: finalAmount,
           originalAmount: engagePrice,
           coupon: appliedCoupon || undefined,
           paymentMethod: selectedMethod,
           type: 'engage-activity'
         };

         // Simulate payment processing
         await new Promise(resolve => setTimeout(resolve, 2000));

         // Register for the activity
         await api.post(`/engage/activities/${engageItem._id}/register`, {
           paymentId: 'simulated_' + Date.now(),
           paymentMethod: selectedMethod,
           coupon: appliedCoupon || undefined,
         });

         setLoading(false);
         setSuccessVisible(true);
       } catch (error) {
         setLoading(false);
         Alert.alert('Payment Failed', error.response?.data?.message || 'Something went wrong');
       }
     };

     return (
       <View style={styles.container}>
         {/* Success Modal */}
         {successVisible && (
           <View style={styles.successModalBackdrop}>
             <View style={styles.successModalCard}>
               <IconBox size={64} style={styles.successIconBox}>
                 <GiftIcon width={36} height={36} color="#FFFFFF" />
               </IconBox>
               <Text style={styles.successTitle}>Payment Successful!</Text>
               <Text style={styles.successMsg}>You're enrolled in {engageName}.</Text>
               <TouchableOpacity style={styles.successBtn} onPress={() => { setSuccessVisible(false); navigation.navigate('Engage'); }}>
                 <Text style={styles.successBtnText}>Awesome!</Text>
               </TouchableOpacity>
             </View>
           </View>
         )}
         {/* Loader */}
         {loading && (
           <View style={styles.loaderBackdrop}><ActivityIndicator size="large" color="#7C3AED" /></View>
         )}
         <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
           {/* Order Summary */}
           <View style={styles.orderSummary}>
             <Text style={styles.sectionTitle}>Order Summary</Text>
             <View style={styles.orderItem}>
               <Text style={styles.itemName}>{engageName}</Text>
               <Text style={styles.itemType}>{engageType} Activity</Text>
             </View>
             <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{engagePrice}</Text></View>
             <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Processing Fee</Text><Text style={styles.summaryValue}>₹0</Text></View>
             <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total</Text><Text style={styles.summaryValue}>₹{finalAmount}</Text></View>
             <View style={styles.rewardBox}><Text style={{ fontSize: 18, color: '#059669' }}>🎁</Text><Text style={styles.rewardText}>You'll earn {rewardPoints} reward points</Text></View>
           </View>
           {/* Coupon Code */}
           <View style={styles.couponCard}>
             <Text style={styles.couponLabel}>Apply Coupon Code</Text>
             <View style={styles.couponRow}>
               <TextInput
                 placeholder="ENTER COUPON OR REFERRAL CODE"
                 placeholderTextColor="#94a3b8"
                 autoCapitalize="characters"
                 value={coupon}
                 onChangeText={(t) => setCoupon((t || '').toUpperCase())}
                 style={styles.couponEditable}
               />
               {!appliedCoupon ? (
                 <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}><Text style={styles.applyBtnText}>Apply</Text></TouchableOpacity>
               ) : (
                 <TouchableOpacity onPress={removeCoupon}><Text style={styles.removeCoupon}>✕</Text></TouchableOpacity>
               )}
             </View>
             {!!couponError && <Text style={styles.couponError}>{couponError}</Text>}
             <Text style={styles.couponHint}>Try: ENGAGE2024, WELCOME50, SAVE25</Text>
           </View>
           {/* Payment Methods */}
           <View style={styles.paymentMethods}>
             <Text style={styles.sectionTitle}>Payment Method</Text>
             {paymentMethods.map((method) => (
               <TouchableOpacity
                 key={method.id}
                 style={[styles.methodCard, selectedMethod === method.id && styles.selectedMethod]}
                 onPress={() => setSelectedMethod(method.id)}
               >
                 <Text style={styles.methodName}>{method.name}</Text>
                 <View style={[styles.radioButton, selectedMethod === method.id && styles.radioButtonSelected]} />
               </TouchableOpacity>
             ))}
           </View>
         </ScrollView>
         {/* Pay Now Button */}
         <View style={styles.footer}>
           <TouchableOpacity
             style={[styles.payButton, loading && { opacity: 0.5 }]}
             onPress={handlePayment}
             disabled={loading}
           >
             {loading ? (
               <ActivityIndicator color="#fff" />
             ) : (
               <Text style={styles.payButtonText}>Pay Now</Text>
             )}
           </TouchableOpacity>
         </View>
       </View>
     );
   }

   // Mentorship session payment params (original logic)
   const {
     mentorId, mentorName, mentorAvatar, mentorSpecialty, mentorPrice = 1999, mentorDuration = '45 min session',
     date, time, dateTime, isReschedule, bookingId
   } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'upi', name: 'UPI' },
    { id: 'netbanking', name: 'Net Banking' },
  ];

  const discounts = useMemo(() => ({
    'PRIYA2024': 200,
    'WELCOME100': 100,
    'SAVE50': 50,
  }), []);
  const normalizedCoupon = (c) => (c || '').toUpperCase().trim();
  const discountAmount = useMemo(() => (appliedCoupon ? (discounts[appliedCoupon] || 0) : 0), [appliedCoupon, discounts]);
  const finalAmount = Math.max(0, (Number(mentorPrice) || 0) - discountAmount);
  const rewardPoints = Math.floor(finalAmount / 10) * 2; // Example: 2% of price as points

  const applyCoupon = () => {
    setCouponError('');
    const code = normalizedCoupon(coupon);
    if (!code) {
      setCouponError('Enter a coupon code');
      return;
    }
    if (!discounts[code]) {
      setCouponError('Invalid or expired coupon');
      return;
    }
    setAppliedCoupon(code);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
    setCouponError('');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create payment record
      const paymentData = {
        mentorId,
        amount: finalAmount,
        originalAmount: mentorPrice,
        coupon: appliedCoupon || undefined,
        paymentMethod: selectedMethod,
        dateTime,
      };
      const response = await paymentAPI.initiateMentorshipPayment(paymentData);
      // 2. Create booking
      await bookingAPI.createBooking({
        mentorId,
        dateTime,
        paymentId: response?.data?.paymentId || 'simulated',
        paymentMethod: selectedMethod,
        coupon: appliedCoupon || undefined,
      });
      setLoading(false);
      setSuccessVisible(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Payment Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Success Modal */}
      {successVisible && (
        <View style={styles.successModalBackdrop}>
          <View style={styles.successModalCard}>
            <IconBox size={64} style={styles.successIconBox}>
              <GiftIcon width={36} height={36} color="#FFFFFF" />
            </IconBox>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMsg}>You're enrolled in {mentorName ? mentorName : 'the session'}.</Text>
            <TouchableOpacity style={styles.successBtn} onPress={() => { setSuccessVisible(false); navigation.navigate('MySessions'); }}>
              <Text style={styles.successBtnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Loader */}
      {loading && (
        <View style={styles.loaderBackdrop}><ActivityIndicator size="large" color="#7C3AED" /></View>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderItem}><Text style={styles.itemName}>Mentorship Session with {mentorName}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{mentorPrice}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Processing Fee</Text><Text style={styles.summaryValue}>₹0</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total</Text><Text style={styles.summaryValue}>₹{finalAmount}</Text></View>
          <View style={styles.rewardBox}><Text style={{ fontSize: 18, color: '#059669' }}>🎁</Text><Text style={styles.rewardText}>You'll earn {rewardPoints} reward points</Text></View>
        </View>
        {/* Coupon Code */}
        <View style={styles.couponCard}>
          <Text style={styles.couponLabel}>Apply Coupon Code</Text>
          <View style={styles.couponRow}>
            <TextInput
              placeholder="ENTER COUPON OR REFERRAL CODE"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
              value={coupon}
              onChangeText={(t) => setCoupon((t || '').toUpperCase())}
              style={styles.couponEditable}
            />
            {!appliedCoupon ? (
              <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}><Text style={styles.applyBtnText}>Apply</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={removeCoupon}><Text style={styles.removeCoupon}>✕</Text></TouchableOpacity>
            )}
          </View>
          {!!couponError && <Text style={styles.couponError}>{couponError}</Text>}
          <Text style={styles.couponHint}>Try: PRIYA2024, WELCOME100, SAVE50</Text>
        </View>
        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.selectedMethod]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Text style={styles.methodName}>{method.name}</Text>
              <View style={[styles.radioButton, selectedMethod === method.id && styles.radioButtonSelected]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Pay Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && { opacity: 0.5 }]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  orderSummary: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  couponRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  couponLabel: { color: '#1e293b', fontWeight: '600', marginBottom: 6 },
  couponInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  couponPrefix: { marginRight: 8 },
  couponEditable: { color: '#1e293b' },
  applyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  applyBtn: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  applyBtnText: { color: '#fff', fontWeight: 'bold' },
  couponError: { color: '#ef4444', marginLeft: 12 },
  appliedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ecfdf5', borderColor: '#34d399', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  appliedText: { color: '#065f46', fontWeight: '700' },
  removeCoupon: { color: '#065f46', fontSize: 18, paddingHorizontal: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  orderItem: {
    marginBottom: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  itemType: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  paymentMethods: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, marginBottom: 8, justifyContent: 'space-between' },
  selectedMethod: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
  methodName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db' },
  radioButtonSelected: { borderColor: '#7C3AED', backgroundColor: '#7C3AED' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { color: '#64748b', fontSize: 14 },
  summaryValue: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  rewardBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 10 },
  rewardText: { color: '#059669', fontWeight: 'bold', marginLeft: 6 },
  couponCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 0, marginBottom: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 1 },
  couponLabel: { color: '#1e293b', fontWeight: '600', marginBottom: 6 },
  couponRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  couponEditable: { color: '#1e293b', flex: 1, fontSize: 15, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  applyBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginLeft: 8 },
  applyBtnText: { color: '#fff', fontWeight: 'bold' },
  removeCoupon: { color: '#7C3AED', fontSize: 18, paddingHorizontal: 8 },
  couponError: { color: '#ef4444', marginLeft: 12 },
  couponHint: { color: '#64748b', fontSize: 12, marginTop: 2 },
  successModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 },
  successModalCard: { width: '82%', backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  successIconBox: { marginBottom: 10 },
  successTitle: { fontSize: 18, fontWeight: '800', color: '#7C3AED', marginTop: 6 },
  successMsg: { color: '#475569', textAlign: 'center', marginTop: 4 },
  successBtn: { marginTop: 14, width: '86%', borderRadius: 999, paddingVertical: 12, alignItems: 'center', backgroundColor: '#7C3AED' },
  successBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 16 },
  loaderBackdrop: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  payButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;