import { useState } from 'react';
import { ChevronLeft, CreditCard, Wallet, Building2, CheckCircle2, IndianRupee, Gift, Tag, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface PaymentProps {
  onNavigate: (page: string) => void;
  paymentData?: any;
  onCelebrate?: (data: any) => void;
}

export function Payment({ onNavigate, paymentData, onCelebrate }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI payment field
  const [upiId, setUpiId] = useState('');
  
  // Net Banking field
  const [selectedBank, setSelectedBank] = useState('');

  const { type, data } = paymentData || { type: 'course', data: { title: 'Activity', price: 1999, points: 300 } };
  
  const originalPrice = data.price || 1999;
  const points = data.points || 300;
  
  // Valid coupons (in real app, this would be from backend)
  const validCoupons: Record<string, number> = {
    'PRIYA2024': 200,      // Referral codes give 200 off
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

  // Calculate discount and final price
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = originalPrice - discount;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
      if (onCelebrate) {
        onCelebrate({
          title: '🎉 Payment Successful!',
          message: `You're enrolled in ${data.title}`,
          points: points,
          icon: 'gift'
        });
      }
    }, 1500);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <Card className="shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              You're all set for {data.title}
            </p>

            <Card className="bg-yellow-50 border-yellow-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm">You earned</span>
                </div>
                <p className="text-2xl text-yellow-600">+{points} points</p>
              </CardContent>
            </Card>

            {appliedCoupon && (
              <Card className="bg-green-50 border-green-200 mb-6">
                <CardContent className="p-4">
                  <p className="text-sm text-green-700">
                    💰 You saved ₹{discount} with code {appliedCoupon.code}!
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('my-learning')}
                className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Go to My Learning
              </Button>
              <Button 
                onClick={() => onNavigate('dashboard')}
                variant="outline"
                className="w-full rounded-full h-12"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <button onClick={() => onNavigate('activity-details', paymentData)} className="flex items-center gap-2">
            <ChevronLeft className="h-6 w-6" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Order Summary */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-1">{data.title}</h4>
              <Badge variant="secondary" className="text-xs">
                {type === 'course' ? 'Course' : type === 'event' ? 'Event' : type === 'workshop' ? 'Workshop' : 'Mentorship'}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="flex items-center gap-0.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {originalPrice}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="flex items-center gap-0.5">
                    - <IndianRupee className="h-3.5 w-3.5" />
                    {discount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Fee</span>
                <span className="flex items-center gap-0.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  0
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="flex items-center gap-0.5 text-xl">
                  <IndianRupee className="h-5 w-5" />
                  {finalPrice}
                </span>
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Gift className="h-4 w-4" />
                  <span>You'll earn {points} reward points</span>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Coupon Code Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              Apply Coupon Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!appliedCoupon ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon or referral code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 rounded-lg uppercase"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    className="rounded-lg px-6 bg-purple-600 hover:bg-purple-700"
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {couponError}
                  </div>
                )}
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-2">
                    💡 <strong>Have a referral code?</strong> Enter it here to get instant discount!
                  </p>
                  <p className="text-xs text-gray-500">
                    Try: PRIYA2024, WELCOME100, SAVE50
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{appliedCoupon.code}</p>
                      <p className="text-xs text-gray-600">Coupon applied successfully!</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">You're saving</span>
                  <span className="text-green-600 flex items-center gap-1 font-medium">
                    <IndianRupee className="h-4 w-4" />
                    {discount}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-xl hover:border-primary cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-xl hover:border-primary cursor-pointer">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span>UPI</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-xl hover:border-primary cursor-pointer">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <span>Net Banking</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim());
                    }
                  }}
                  maxLength={19}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="Name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="rounded-lg uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        if (value.length >= 2) {
                          setCardExpiry(value.slice(0, 2) + '/' + value.slice(2));
                        } else {
                          setCardExpiry(value);
                        }
                      }
                    }}
                    maxLength={5}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    type="password"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setCardCvv(value);
                      }
                    }}
                    maxLength={3}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Your card details are secure and encrypted</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* UPI Payment Form */}
        {paymentMethod === 'upi' && (
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                Pay with UPI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Pay with UPI Apps */}
              <div>
                <Label className="mb-3 block">Choose UPI App</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-purple-500 hover:bg-purple-50"
                    onClick={() => {
                      // In production, this would trigger UPI intent
                      alert('Opening PhonePe... (Demo: Would redirect to PhonePe app)');
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Pe</span>
                    </div>
                    <span className="text-sm">PhonePe</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-purple-500 hover:bg-purple-50"
                    onClick={() => {
                      alert('Opening Google Pay... (Demo: Would redirect to Google Pay app)');
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">G</span>
                    </div>
                    <span className="text-sm">Google Pay</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-purple-500 hover:bg-purple-50"
                    onClick={() => {
                      alert('Opening Paytm... (Demo: Would redirect to Paytm app)');
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-sm">Paytm</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-purple-500 hover:bg-purple-50"
                    onClick={() => {
                      alert('Opening BHIM... (Demo: Would redirect to BHIM app)');
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <span className="text-sm">BHIM UPI</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Tap to open your UPI app and complete payment
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or pay with UPI ID</span>
                </div>
              </div>

              {/* UPI ID Input */}
              <div>
                <Label htmlFor="upiId">Enter UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                  className="rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E.g., 9876543210@paytm, name@oksbi, mobile@ybl
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Instant payment confirmation • Secure & encrypted</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Net Banking Form */}
        {paymentMethod === 'netbanking' && (
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Select Your Bank
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                <div className="space-y-2">
                  {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Other Banks'].map((bank) => (
                    <div key={bank} className={`flex items-center space-x-3 p-3 border-2 rounded-lg hover:border-purple-300 cursor-pointer transition-all ${selectedBank === bank ? 'border-purple-500 bg-purple-50' : ''}`}>
                      <RadioGroupItem value={bank} id={bank} />
                      <Label htmlFor={bank} className="flex-1 cursor-pointer">
                        {bank}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {selectedBank && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-4">
                  <p className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>You'll be redirected to {selectedBank} secure login page</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="flex items-center gap-1 text-2xl">
                <IndianRupee className="h-6 w-6" />
                {finalPrice}
                {appliedCoupon && (
                  <span className="text-sm text-gray-400 line-through ml-2">₹{originalPrice}</span>
                )}
              </p>
            </div>
            <Button onClick={handlePayment} className="rounded-full h-12 px-8 bg-gradient-to-r from-green-600 to-green-700">
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
