import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Users, Star, BookOpen, IndianRupee, Gift, Heart, Dumbbell, Activity } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProfileCompletionPrompt } from './ProfileCompletionPrompt';

interface EngageDetailsProps {
  onNavigate: (page: string, data?: any) => void;
  engageData?: any;
}

export function EngageDetails({ onNavigate, engageData }: EngageDetailsProps) {
  const { type, data } = engageData || { type: 'wellness', data: {} };
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  const handlePurchase = () => {
    // Check if profile is incomplete
    const profileIncomplete = localStorage.getItem('profileIncomplete') === 'true';
    if (profileIncomplete) {
      setShowCompletionPrompt(true);
      return;
    }
    
    onNavigate('payment', { type, data });
  };

  const getDescriptionByType = () => {
    if (type === 'wellness') {
      return 'Prioritize your mental health and well-being with this carefully designed wellness program. Led by certified wellness coaches and mental health professionals, this session provides practical tools and techniques to manage stress, prevent burnout, and maintain emotional balance in your demanding healthcare career.';
    } else if (type === 'fitness') {
      return 'Stay physically active and healthy with this fitness program designed specifically for nurses and healthcare professionals. Whether you have 10 minutes or an hour, these exercises are tailored to fit your schedule and address the unique physical demands of nursing. Build strength, improve flexibility, and boost your energy levels.';
    } else if (type === 'event') {
      return 'Join us for this enriching event that brings together healthcare professionals for learning, networking, and professional growth. Connect with peers, learn from industry leaders, and discover new opportunities to advance your nursing career. This event offers valuable insights and practical takeaways you can apply immediately.';
    }
    return '';
  };

  const getWhatYouWillGet = () => {
    if (type === 'wellness') {
      return [
        'Stress management techniques for healthcare workers',
        'Mindfulness and meditation practices',
        'Tools to prevent burnout and compassion fatigue',
        'Self-care strategies for busy schedules',
        'Community support and peer connection',
        'Certificate of participation',
      ];
    } else if (type === 'fitness') {
      return [
        'Customized workout plans for nurses',
        'Exercises you can do anywhere, anytime',
        'Nutrition guidance for shift workers',
        'Progress tracking and accountability',
        'Expert coaching and support',
        'Certificate of completion',
      ];
    } else {
      return [
        'Comprehensive knowledge from industry experts',
        'Networking opportunities with peers',
        'Practical skills and techniques',
        'Certificate of attendance',
        'Access to exclusive resources and recordings',
        'Professional development credits',
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <button onClick={() => onNavigate('engage')} className="flex items-center gap-2">
            <ChevronLeft className="h-6 w-6" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64">
        <ImageWithFallback
          src={data.image || ''}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Title and Type */}
        <div>
          {type === 'wellness' && (
            <Badge className="mb-3 bg-purple-500">
              <Heart className="h-3 w-3 mr-1" />
              Wellness
            </Badge>
          )}
          {type === 'fitness' && (
            <Badge className="mb-3 bg-orange-500">
              <Dumbbell className="h-3 w-3 mr-1" />
              Fitness
            </Badge>
          )}
          {type === 'event' && (
            <Badge className="mb-3 bg-blue-500">
              <Activity className="h-3 w-3 mr-1" />
              Event
            </Badge>
          )}
          <h1 className="mb-2">{data.title}</h1>
          {data.instructor && (
            <p className="text-gray-600">by {data.instructor}</p>
          )}
          {data.category && (
            <p className="text-sm text-gray-500 mt-1">{data.category}</p>
          )}
        </div>

        {/* Key Info Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            {data.date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-sm">{data.date}</p>
                </div>
              </div>
            )}
            {data.time && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-sm">{data.time}</p>
                </div>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-sm">{data.location}</p>
                </div>
              </div>
            )}
            {data.duration && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-sm">{data.duration}</p>
                </div>
              </div>
            )}
            {data.enrolled && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="text-sm">{data.enrolled} participants</p>
                </div>
              </div>
            )}
            {data.seats && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Availability</p>
                  <p className="text-sm">{data.seats} seats remaining</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3">About This {type === 'wellness' ? 'Program' : type === 'fitness' ? 'Program' : 'Event'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getDescriptionByType()}
            </p>
          </CardContent>
        </Card>

        {/* What You'll Get/Learn */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3">What You'll Get</h3>
            <div className="space-y-2">
              {getWhatYouWillGet().map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        {type === 'wellness' && (
          <Card className="shadow-sm bg-purple-50 border-purple-100">
            <CardContent className="p-4">
              <h3 className="mb-3 text-purple-900">Why Wellness Matters</h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                Healthcare professionals face unique stressors that can lead to burnout, compassion fatigue, and emotional exhaustion. Prioritizing your mental health isn't just beneficial—it's essential for providing quality patient care and maintaining your own well-being.
              </p>
            </CardContent>
          </Card>
        )}

        {type === 'fitness' && (
          <Card className="shadow-sm bg-orange-50 border-orange-100">
            <CardContent className="p-4">
              <h3 className="mb-3 text-orange-900">Why Fitness Matters</h3>
              <p className="text-sm text-orange-800 leading-relaxed">
                Nursing is physically demanding. Long shifts, lifting patients, and constant movement take a toll on your body. Regular fitness activities help prevent injuries, reduce fatigue, and increase your stamina—allowing you to perform at your best throughout your shifts.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              {data.price === 0 ? (
                <p className="text-xl text-green-600">Free</p>
              ) : (
                <p className="flex items-center gap-1 text-xl">
                  <IndianRupee className="h-5 w-5" />
                  {data.price}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">You'll Earn</p>
              <p className="flex items-center gap-1 text-yellow-600 justify-end">
                <Gift className="h-5 w-5" />
                +{data.points} points
              </p>
            </div>
          </div>
          <Button onClick={handlePurchase} className="w-full rounded-full h-12">
            {data.price === 0 ? 'Register Free' : type === 'event' ? 'Register Now' : 'Join Program'}
          </Button>
        </div>
      </div>

      {/* Profile Completion Prompt */}
      {showCompletionPrompt && (
        <ProfileCompletionPrompt
          feature={type === 'wellness' ? 'wellness programs' : type === 'fitness' ? 'fitness programs' : 'events'}
          onComplete={() => onNavigate('profile-edit')}
          onCancel={() => setShowCompletionPrompt(false)}
        />
      )}
    </div>
  );
}
