import { useState } from 'react';
import { ChevronLeft, Send, CheckCircle2, User, Building2, Phone, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DirectRegistrationProps {
  onNavigate: (page: string) => void;
  onCelebrate?: (data: any) => void;
}

export function DirectRegistration({ onNavigate, onCelebrate }: DirectRegistrationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentHospital: '',
    yearsOfExperience: '',
    specialization: '',
    registrationNumber: '',
    motivation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission to admin dashboard
    setTimeout(() => {
      setSubmitted(true);
      if (onCelebrate) {
        onCelebrate({
          title: 'Application Submitted! 🎉',
          message: 'Your direct registration request has been sent to our admin team. We\'ll review and get back to you within 48 hours.',
          points: 100,
          icon: 'star'
        });
      }
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-6">
        <Card className="shadow-2xl max-w-md w-full border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-gray-900 mb-3">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest! Our admin team will review your application and contact you within 48 hours.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                📧 Check your email for confirmation<br />
                📱 We'll call you for next steps
              </p>
            </div>
            <Button 
              onClick={() => onNavigate('dashboard')}
              className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Direct Registration</h2>
        </div>
        <p className="text-white/90 text-sm">For experienced nurses (5+ years)</p>
      </div>

      <div className="px-6 py-6">
        {/* Info Banner */}
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
          <CardContent className="p-6">
            <h3 className="mb-2 text-purple-900">Express Your Interest</h3>
            <p className="text-sm text-gray-700">
              Submit your details and our team will review your profile for direct enrollment in premium programmes and exclusive opportunities.
            </p>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="rounded-xl h-12"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="rounded-xl h-12"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-xl h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentHospital">Current Hospital/Clinic *</Label>
                <Input
                  id="currentHospital"
                  type="text"
                  placeholder="Your workplace"
                  className="rounded-xl h-12"
                  value={formData.currentHospital}
                  onChange={(e) => setFormData({ ...formData, currentHospital: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select
                    value={formData.yearsOfExperience}
                    onValueChange={(value) => setFormData({ ...formData, yearsOfExperience: value })}
                    required
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-7">5-7 years</SelectItem>
                      <SelectItem value="7-10">7-10 years</SelectItem>
                      <SelectItem value="10-15">10-15 years</SelectItem>
                      <SelectItem value="15+">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                    required
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical-care">Critical Care</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="pediatric">Pediatric</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="cardiac">Cardiac</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration">Nursing Registration Number *</Label>
                <Input
                  id="registration"
                  type="text"
                  placeholder="Registration number"
                  className="rounded-xl h-12"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">What interests you most about Neon Club? *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Tell us about your professional goals and why you'd like direct access..."
                  className="rounded-xl min-h-[100px]"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit"
            className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg"
          >
            <Send className="mr-2 h-5 w-5" />
            Submit Application
          </Button>

          <p className="text-xs text-center text-gray-500">
            By submitting, you agree to our verification process and communication via phone/email
          </p>
        </form>
      </div>
    </div>
  );
}
