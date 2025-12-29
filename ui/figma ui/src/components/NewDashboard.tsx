import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Calendar, BookOpen, Users, Award, TrendingUp, Sparkles, Play, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '../api';

interface NewDashboardProps {
  onNavigate: (page: string) => void;
  userName?: string;
  userExperience?: number; // years of experience
  profileIncomplete?: boolean;
}

export function NewDashboard({ onNavigate, userName = 'Priya', userExperience = 6, profileIncomplete = false }: NewDashboardProps) {
   const [displayName, setDisplayName] = useState(userName);
   const [stats, setStats] = useState({
     courses: 0,
     events: 0,
     workshops: 0,
   });
   const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Load name from localStorage
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) {
        // Extract first name
        const firstName = parsed.fullName.split(' ')[0];
        setDisplayName(firstName);
      }
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const statsData = await apiService.getDashboardStats();
        setStats({
          courses: statsData.courses,
          events: statsData.events,
          workshops: statsData.workshops,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep default values
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    return 'Hello Nurse';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/30 shadow-lg ring-2 ring-white/20 hover:ring-white/40 transition-all">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h2 className="text-white">{getGreeting()} {displayName} 👋</h2>
              {profileIncomplete && (
                <p className="text-xs text-white/80 mt-0.5">Tap to complete profile</p>
              )}
            </div>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/30 transition-all"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
             <BookOpen className="h-5 w-5 mx-auto mb-1" />
             <p className="text-xs text-blue-100">Courses</p>
             <p className="text-lg">{loadingStats ? '...' : stats.courses}</p>
           </div>
           <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
             <Calendar className="h-5 w-5 mx-auto mb-1" />
             <p className="text-xs text-blue-100">Events</p>
             <p className="text-lg">{loadingStats ? '...' : stats.events}</p>
           </div>
           <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
             <Users className="h-5 w-5 mx-auto mb-1" />
             <p className="text-xs text-blue-100">Workshops</p>
             <p className="text-lg">{loadingStats ? '...' : stats.workshops}</p>
           </div>
         </div>
      </div>

      <div className="px-6 space-y-6 mt-2">
        {/* Profile Incomplete Banner */}
        {profileIncomplete && (
          <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-0.5">Complete Your Profile</h4>
                  <p className="text-xs text-gray-600">Add professional details to unlock personalized features</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    // Navigate to profile completion - this will be handled in App.tsx
                    onNavigate('complete-profile');
                  }}
                  className="rounded-full bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1 h-auto"
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Learning - Priority Section */}
        <Card
          className="shadow-lg border-none cursor-pointer hover:shadow-xl transition-all overflow-hidden relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"
          onClick={() => onNavigate('my-learning')}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-0.5">My Learning</h4>
                <p className="text-xs text-white/90">Continue your courses, events & workshops</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* News & Announcements Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3>Latest News</h3>
            <Button
              onClick={() => onNavigate('news')}
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
            >
              See All
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {[
              {
                title: 'New Healthcare Guidelines 2024',
                category: 'Guidelines',
                date: 'Oct 15',
                image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbmV3cyUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                type: 'video',
              },
              {
                title: 'Breakthrough in Nursing Education',
                category: 'Education',
                date: 'Oct 12',
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uZmVyZW5jZSUyMHVwZGF0ZXxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                type: 'article',
              },
              {
                title: 'Champion Mentors Success Stories',
                category: 'Stories',
                date: 'Oct 8',
                image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwYWNoaWV2ZW1lbnQlMjBhd2FyZHxlbnwxfHx8fDE3NjA0Mjg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                type: 'article',
              },
            ].map((news, index) => (
              <Card 
                key={index}
                className="flex-shrink-0 w-48 shadow-md border-none overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={() => onNavigate('news')}
              >
                <CardContent className="p-0">
                  <div className="relative h-28">
                    <ImageWithFallback
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    {news.type === 'video' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-3 w-3 text-purple-600 ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <Badge className="mb-1 bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                        {news.category}
                      </Badge>
                      <p className="text-white text-xs line-clamp-2">{news.title}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {news.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nightingale Programme Banner - First Priority */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">Nightingale Programme</h3>
                <p className="text-sm text-white/90 mb-3">Become a Champion Mentor and light the way</p>
                <Button 
                  onClick={() => onNavigate('champion')}
                  size="sm" 
                  className="rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                >
                  Begin Journey
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Become a Mentor Banner - Only for 5+ years experience */}
        {userExperience >= 5 && (
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-teal-500 to-green-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-1">Want to Become a Mentor?</h3>
                  <p className="text-sm text-white/90 mb-3">Share your expertise with fellow nurses</p>
                  <Button 
                    onClick={() => onNavigate('direct-registration')}
                    size="sm" 
                    className="rounded-full bg-white text-cyan-600 hover:bg-white/90 shadow-lg"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Progress - Modern Card */}
        <Card className="shadow-lg border-none overflow-hidden bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-0">
            <div className="relative h-40 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmclMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYwMzQ1MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Course"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  In Progress
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-white mb-2">Advanced Patient Care</h4>
                <div className="relative h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Your Progress</span>
                <span className="text-sm font-medium text-purple-600">65% Complete</span>
              </div>
              <Button
                onClick={() => onNavigate('my-learning')}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Engage: Wellness & Events */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3>New Activities</h3>
            <Button
              onClick={() => onNavigate('my-learning')}
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {/* Active Course */}
            <Card 
              className="shadow-lg border-none hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              onClick={() => onNavigate('my-learning')}
            >
              <CardContent className="p-0">
                <div className="flex gap-0">
                  <div className="flex-shrink-0 w-24 h-24 relative overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmclMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYwMzQ1MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Advanced Patient Care"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Badge className="mb-2 bg-purple-100 text-purple-700 border-none text-xs">Course</Badge>
                        <h4 className="text-sm mb-1">Advanced Patient Care</h4>
                        <p className="text-xs text-gray-600 mb-2">Continue learning</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-purple-600">65%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Event */}
            <Card 
              className="shadow-lg border-none hover:shadow-xl transition-all cursor-pointer"
              onClick={() => onNavigate('my-learning')}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-medium">Oct</span>
                      <span className="text-xl">18</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-cyan-100 text-cyan-700 border-none text-xs">Event</Badge>
                    <h4 className="text-sm mb-1">Healthcare Summit 2024</h4>
                    <p className="text-xs text-gray-600">3-Day Conference • 2 days left</p>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Workshop */}
            <Card 
              className="shadow-lg border-none hover:shadow-xl transition-all cursor-pointer"
              onClick={() => onNavigate('my-learning')}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-medium">Oct</span>
                      <span className="text-xl">20</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-purple-100 text-purple-700 border-none text-xs">Workshop</Badge>
                    <h4 className="text-sm mb-1">Wound Care Management</h4>
                    <p className="text-xs text-gray-600">Live Workshop • 4 days left</p>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}