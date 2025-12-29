import { useState, useEffect } from 'react';
import { ChevronRight, User, Bell, Lock, HelpCircle, FileText, LogOut, Edit, Mail, Phone, MapPin, Award, GraduationCap, Receipt, Share2, Gift as GiftIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileProps {
  onNavigate: (page: string) => void;
  profileIncomplete?: boolean;
}

export function Profile({ onNavigate, profileIncomplete = false }: ProfileProps) {
  const [profileData, setProfileData] = useState({
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    city: 'Delhi',
    state: 'Delhi',
    currentWorkplace: 'Apollo Hospital',
    specialization: 'Critical Care'
  });

  useEffect(() => {
    // Load profile data from localStorage
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProfileData({
        fullName: parsed.fullName || 'Priya Sharma',
        email: parsed.email || 'priya.sharma@email.com',
        phone: parsed.phone || '+91 98765 43210',
        city: parsed.city || 'Delhi',
        state: parsed.state || 'Delhi',
        currentWorkplace: parsed.currentWorkplace || 'Apollo Hospital',
        specialization: parsed.specialization || 'Critical Care'
      });
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-6 pt-12 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white">Profile</h2>
          <Button 
            onClick={() => onNavigate('profile-edit')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        {profileIncomplete && (
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl p-3 mt-4">
            <p className="text-sm text-white">
              ⚠️ Complete your professional information to unlock all features
            </p>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-12 mb-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{profileData.fullName}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {profileData.specialization}{profileData.city ? `, ${profileData.city}` : ''}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => onNavigate('order-history')}
                >
                  <Receipt className="h-3 w-3 mr-1" />
                  Order History
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              {profileData.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.email}</span>
                </div>
              )}
              {profileData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.phone}</span>
                </div>
              )}
              {(profileData.city || profileData.state) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {profileData.city}{profileData.state ? `, ${profileData.state}` : ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats - Modern Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl mb-1 text-purple-600">12</p>
              <p className="text-xs text-gray-600">Courses</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-none bg-gradient-to-br from-pink-50 to-pink-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl mb-1 text-pink-600">8</p>
              <p className="text-xs text-gray-600">Sessions</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-none bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl mb-1 text-orange-600">5</p>
              <p className="text-xs text-gray-600">Workshops</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 space-y-2">
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <button 
              onClick={() => onNavigate('order-history')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <span>Order History</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <Separator />
            <button 
              onClick={() => onNavigate('certifications')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-500" />
                </div>
                <span>Certifications & Awards</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <Separator />
            <button 
              onClick={() => onNavigate('referral')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-green-500" />
                </div>
                <span>Refer & Earn</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <Separator />
            <button 
              onClick={() => onNavigate('notifications')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-pink-500" />
                </div>
                <span>Notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <Separator />
            <button 
              onClick={() => alert('Privacy & Security settings - Coming soon')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-orange-500" />
                </div>
                <span>Privacy & Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <button
              onClick={() => onNavigate('help')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-orange-500" />
                </div>
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <Separator />
            <button 
              onClick={() => alert('Terms & Conditions - Coming soon')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <span>Terms & Conditions</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full flex items-center justify-between text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span>Logout</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* App Version */}
      <div className="text-center py-6 text-sm text-gray-500">
        <p>NUON v2.0.0</p>
      </div>
    </div>
  );
}
