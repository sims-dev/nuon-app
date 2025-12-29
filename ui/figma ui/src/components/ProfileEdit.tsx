import { useState, useEffect } from 'react';
import { ChevronLeft, User, Briefcase, Building2, MapPin, Award, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { apiService } from '../api';

interface ProfileEditProps {
  onNavigate: (page: string) => void;
  onSave: (data: any) => void;
  profileIncomplete?: boolean;
}

export function ProfileEdit({ onNavigate, onSave, profileIncomplete = false }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    city: '',
    state: '',
    registrationNumber: '',
    highestQualification: '',
  });

  useEffect(() => {
    // Load existing data from localStorage
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Ensure all fields are strings (never undefined)
      setFormData({
        fullName: parsed.fullName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        specialization: parsed.specialization || '',
        experience: parsed.experience || '',
        currentWorkplace: parsed.currentWorkplace || '',
        city: parsed.city || '',
        state: parsed.state || '',
        registrationNumber: parsed.registrationNumber || '',
        highestQualification: parsed.highestQualification || '',
      });
    }
  }, []);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value || '' });
  };

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'specialization', 'experience'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f === 'fullName' ? 'Name' : f === 'email' ? 'Email' : f === 'specialization' ? 'Specialization' : 'Experience').join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        currentWorkplace: formData.currentWorkplace,
        registrationNumber: formData.registrationNumber,
        highestQualification: formData.highestQualification,
        city: formData.city,
        state: formData.state,
        organization: formData.currentWorkplace,
        location: [formData.city, formData.state].filter(Boolean).join(', '),
      };

      const response = await apiService.updateProfile(payload);

      if (response.success) {
        alert('Profile updated successfully!');
        localStorage.setItem('nurseProfile', JSON.stringify(formData));

        if (formData.currentWorkplace && formData.registrationNumber && formData.highestQualification) {
          localStorage.removeItem('profileIncomplete');
        }

        onSave(formData);
        onNavigate('profile');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const isProfessionalInfoComplete = formData.currentWorkplace && 
                                     formData.registrationNumber && 
                                     formData.highestQualification;

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-primary text-white px-6 pt-12 pb-8 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => onNavigate('profile')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Edit Profile</h2>
        </div>
        {profileIncomplete && (
          <Badge className="bg-orange-500 border-none mt-2">
            Complete your professional information
          </Badge>
        )}
      </div>

      <div className="px-6 space-y-6 mt-6">
        {/* Personal Information */}
        <Card className="shadow-lg">
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="rounded-xl h-12"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
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

        {/* Professional Information */}
        <Card className={`shadow-lg ${!isProfessionalInfoComplete ? 'border-2 border-orange-200 bg-orange-50/30' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Information
              </CardTitle>
              {!isProfessionalInfoComplete && (
                <Badge className="bg-orange-500 border-none">Incomplete</Badge>
              )}
            </div>
            {!isProfessionalInfoComplete && (
              <p className="text-sm text-orange-700 mt-2">
                Complete this section to unlock all features and book sessions
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentWorkplace">Current Workplace</Label>
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
              <Label htmlFor="registrationNumber">Nursing Registration Number</Label>
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
              <Label htmlFor="qualification">Highest Qualification</Label>
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

        {/* Location */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
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
              <Label htmlFor="state">State</Label>
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
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
