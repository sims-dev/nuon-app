import { useState } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { NuonIcon } from './NuonLogo';

interface PhoneOTPAuthProps {
  onAuth: () => void;
}

export function PhoneOTPAuth({ onAuth }: PhoneOTPAuthProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending OTP
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification
    if (otp.length === 6) {
      // Save phone number to localStorage for later use in profile
      const existingProfile = localStorage.getItem('nurseProfile');
      if (existingProfile) {
        const profile = JSON.parse(existingProfile);
        profile.phone = phoneNumber;
        localStorage.setItem('nurseProfile', JSON.stringify(profile));
      } else {
        localStorage.setItem('nurseProfile', JSON.stringify({ phone: phoneNumber }));
      }
      onAuth();
    }
  };

  const handleResendOTP = () => {
    // Simulate resending OTP
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-6 inline-block neon-glow-purple">
            <NuonIcon size={96} variant="white" />
          </div>
          <h1 className="text-white mb-2">Welcome to NUON</h1>
          <p className="text-purple-100">Nurse United, Opportunities Nourished</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-gray-900 mb-2">Login / Sign Up</h2>
                <p className="text-gray-600 text-sm">Enter your phone number to continue</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-10 rounded-xl h-14 text-lg border-2 border-gray-200 focus:border-purple-500"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send you a 6-digit OTP to verify your number
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                disabled={phoneNumber.length < 10}
              >
                Send OTP <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to<br />
                  <span className="font-medium text-gray-900">{phoneNumber}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg border-2" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg border-2" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg border-2" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg border-2" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg border-2" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg border-2" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Didn't receive? <span className="underline">Resend OTP</span>
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                disabled={otp.length < 6}
              >
                Verify & Continue
              </Button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-purple-100 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
