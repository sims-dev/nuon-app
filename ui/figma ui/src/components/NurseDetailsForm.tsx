import { useState } from 'react';
import { User, Briefcase, Building2, MapPin, Calendar, Award, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { apiService } from '../api';

interface NurseDetailsFormProps {
  onComplete: (data: any, isSkipped?: boolean) => void;
}

export function NurseDetailsForm({ onComplete }: NurseDetailsFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    city: '',
    state: '',
    registrationNumber: '',
    highestQualification: '',
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    // Validation for Step 1 - Personal Information
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.specialization || !formData.experience) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
    }

    // Validation for Step 2 - Professional Information
    if (step === 2) {
      if (!formData.currentWorkplace || !formData.registrationNumber || !formData.highestQualification) {
        alert('Please fill in all professional information fields');
        return;
      }
    }

    // Validation for Step 3 - Location
    if (step === 3) {
      if (!formData.city || !formData.state) {
        alert('Please fill in city and state');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete profile - call backend API
      try {
        const payload = {
          name: formData.fullName,
          email: formData.email,
          phoneNumber: '',
          specialization: formData.specialization,
          experience: parseInt(formData.experience) || 0,
          organization: formData.currentWorkplace,
          city: formData.city,
          state: formData.state,
          registrationNumber: formData.registrationNumber,
          highestQualification: formData.highestQualification,
          location: [formData.city, formData.state].filter(Boolean).join(', '),
        };

        const response = await apiService.register(payload);

        if (response.success) {
          // Store tokens in localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          alert('Profile completed successfully! Welcome to Neon Club.');
          onComplete(formData);
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Profile completion error:', error);
        alert('Failed to complete profile. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white px-6 pt-12 pb-8">
        <h2 className="text-white mb-2">Complete Your Profile</h2>
        <p className="text-blue-100 mb-6">Help us personalize your experience</p>
        <Progress value={progress} className="h-2 bg-blue-400" />
        <p className="text-sm text-blue-100 mt-2">Step {step} of {totalSteps}</p>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
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
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="rounded-xl h-12"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => updateFormData('specialization', value)}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Nursing</SelectItem>
                    <SelectItem value="critical-care">Critical Care</SelectItem>
                    <SelectItem value="pediatric">Pediatric Nursing</SelectItem>
                    <SelectItem value="emergency">Emergency Nursing</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="cardiac">Cardiac Care</SelectItem>
                    <SelectItem value="neonatal">Neonatal Care</SelectItem>
                    <SelectItem value="psychiatric">Psychiatric Nursing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => updateFormData('experience', value)}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional Information */}
        {step === 2 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentWorkplace">Current Workplace *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="currentWorkplace"
                    type="text"
                    placeholder="Hospital/Clinic name"
                    className="pl-10 rounded-xl h-12"
                    value={formData.currentWorkplace}
                    onChange={(e) => updateFormData('currentWorkplace', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Nursing Registration Number *</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter registration number"
                    className="pl-10 rounded-xl h-12"
                    value={formData.registrationNumber}
                    onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification *</Label>
                <Select
                  value={formData.highestQualification}
                  onValueChange={(value) => updateFormData('highestQualification', value)}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gnm">GNM (General Nursing & Midwifery)</SelectItem>
                    <SelectItem value="bsc">B.Sc Nursing</SelectItem>
                    <SelectItem value="post-bsc">Post B.Sc Nursing</SelectItem>
                    <SelectItem value="msc">M.Sc Nursing</SelectItem>
                    <SelectItem value="phd">Ph.D in Nursing</SelectItem>
                    <SelectItem value="diploma">Diploma in Nursing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  className="rounded-xl h-12"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData('state', value)}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
                <p className="text-sm text-blue-900">
                  🎉 You're almost there! Complete your profile to unlock exclusive courses, events, and rewards.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="px-6 pb-8 pt-4 bg-white border-t space-y-3">
        <Button onClick={handleNext} className="w-full rounded-full h-12">
          {step < totalSteps ? (
            <>
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
        
        {step === 2 && (
          <Button 
            onClick={() => {
              // Save partial profile data to localStorage
              localStorage.setItem('nurseProfile', JSON.stringify(formData));
              onComplete(formData, true);
            }} 
            variant="ghost" 
            className="w-full rounded-full h-12 text-gray-600"
          >
            Skip for now
          </Button>
        )}
        
        {step > 1 && (
          <Button onClick={handleBack} variant="outline" className="w-full rounded-full h-12">
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
