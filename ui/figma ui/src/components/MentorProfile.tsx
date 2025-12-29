import { useState } from 'react';
import { ChevronLeft, Star, Calendar, Award, Users, Clock, Video, Share2, Heart, IndianRupee, CheckCircle, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MentorProfileProps {
  onNavigate: (page: string, data?: any) => void;
  mentorData?: any;
}

export function MentorProfile({ onNavigate, mentorData }: MentorProfileProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Default mentor data with comprehensive information
  const mentor = mentorData || {
    id: 1,
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    experience: '15+ years',
    rating: 4.9,
    sessions: 340,
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    available: true,
    price: 1999,
    responseTime: '2 hours',
    languages: ['English', 'Hindi', 'Marathi'],
    qualifications: [
      'MSc Nursing - Critical Care',
      'BSc Nursing - Delhi University',
      'ICU Certification - AIIMS',
    ],
    expertise: [
      'Critical Care Management',
      'Emergency Response',
      'Ventilator Management',
      'Patient Safety Protocols',
      'Clinical Leadership',
    ],
    bio: 'With over 15 years of experience in critical care nursing, I have worked in top hospitals across India including AIIMS and Apollo. I specialize in helping nurses advance their careers in emergency and critical care settings. My mentorship focuses on practical skills, clinical decision-making, and professional growth.',
    reviews: [
      {
        id: 1,
        name: 'Neha Sharma',
        rating: 5,
        date: 'Oct 2024',
        comment: 'Dr. Verma provided excellent guidance on my ICU rotation. Her practical tips and real-world scenarios helped me gain confidence.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      {
        id: 2,
        name: 'Amit Patel',
        rating: 5,
        date: 'Sep 2024',
        comment: 'Very knowledgeable and patient. She answered all my questions about critical care protocols thoroughly.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      {
        id: 3,
        name: 'Priya Reddy',
        rating: 4,
        date: 'Sep 2024',
        comment: 'Great session on ventilator management. Would definitely book again!',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
    ],
    achievements: [
      { icon: 'award', label: 'Top Rated Mentor' },
      { icon: 'users', label: '340+ Sessions' },
      { icon: 'star', label: '4.9 Rating' },
      { icon: 'clock', label: 'Quick Response' },
    ],
    availability: [
      'Monday - Friday: 3:00 PM - 8:00 PM',
      'Saturday: 10:00 AM - 6:00 PM',
      'Sunday: By appointment',
    ],
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mentor.name} - NUON Mentor`,
        text: `Check out ${mentor.name}'s profile on NUON`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-20 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => onNavigate('mentorship')} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Heart 
                className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
          </div>
        </div>
        <h2 className="text-white">Mentor Profile</h2>
      </div>

      {/* Profile Card - Overlapping Header */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <Card className="shadow-2xl border-2 border-purple-100 bg-white">
          <CardContent className="p-6">
            {/* Profile Info */}
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-purple-200 shadow-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  {mentor.image ? (
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-3xl">
                      {mentor.name?.charAt(0) || 'M'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-gray-900">{mentor.name}</h2>
                <p className="text-gray-600 mb-2">{mentor.specialization}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1 text-gray-900">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{mentor.rating}</span>
                  </span>
                  <span>•</span>
                  <span className="text-gray-600">{mentor.sessions} sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-none">
                    {mentor.available ? 'Available' : 'Busy'}
                  </Badge>
                  <Badge variant="outline" className="text-gray-700 border-gray-300">
                    {mentor.experience}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {mentor.achievements.map((achievement: any, index: number) => (
                <div key={index} className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  {achievement.icon === 'award' && <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />}
                  {achievement.icon === 'users' && <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />}
                  {achievement.icon === 'star' && <Star className="h-5 w-5 text-purple-600 mx-auto mb-1" />}
                  {achievement.icon === 'clock' && <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />}
                  <p className="text-xs text-gray-600">{achievement.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 mb-6">
              <div className="text-center">
                <p className="text-2xl mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mentor.rating}
                </p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-2xl mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mentor.sessions}+
                </p>
                <p className="text-xs text-gray-600">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mentor.responseTime}
                </p>
                <p className="text-xs text-gray-600">Response</p>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Button
                onClick={() => onNavigate('booking-slots', mentor)}
                disabled={!mentor.available}
                className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg disabled:opacity-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </div>

            {/* Pricing Info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 mt-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-700">45-minute video session</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5 text-purple-600" />
                <span className="text-lg text-purple-600">{mentor.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <div className="px-6">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Qualifications
                </h3>
                <ul className="space-y-2">
                  {mentor.qualifications.map((qual: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Availability
                </h3>
                <ul className="space-y-2">
                  {mentor.availability.map((time: string, index: number) => (
                    <li key={index} className="text-gray-700 text-sm">
                      {time}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((lang: string, index: number) => (
                    <Badge key={index} variant="outline" className="rounded-full">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Areas of Expertise
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {mentor.expertise.map((skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4">Session Focus</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  My mentorship sessions are designed to provide practical, actionable guidance for nurses looking to excel in critical care environments. I focus on:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-2"></div>
                    <span>Real-world clinical scenarios and problem-solving</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-2"></div>
                    <span>Career advancement strategies in critical care</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-2"></div>
                    <span>Building confidence in high-pressure situations</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-2"></div>
                    <span>Best practices and latest protocols</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {/* Rating Summary */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {mentor.rating}
                    </p>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{mentor.sessions} sessions</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-8">{rating} ★</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{
                              width: rating === 5 ? '85%' : rating === 4 ? '12%' : '3%',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            {mentor.reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm">{review.name}</h4>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <p className="text-center text-sm text-gray-500 py-4">
              Showing {mentor.reviews.length} of {mentor.sessions} reviews
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-600">Session Fee</p>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-5 w-5 text-purple-600" />
              <span className="text-xl text-purple-600">{mentor.price}</span>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('booking-slots', mentor)}
            disabled={!mentor.available}
            className="flex-1 rounded-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg disabled:opacity-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
