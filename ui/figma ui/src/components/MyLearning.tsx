import { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Calendar, Clock, Play, CheckCircle, Users, Award, Download, ChevronRight, Video, ExternalLink, ShoppingCart, Bell, Heart, Dumbbell } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MyLearningProps {
  onNavigate: (page: string, data?: any) => void;
}

export function MyLearning({ onNavigate }: MyLearningProps) {
  const [displayName, setDisplayName] = useState('Priya');

  useEffect(() => {
    // Load name from localStorage
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) {
        const firstName = parsed.fullName.split(' ')[0];
        setDisplayName(firstName);
      }
    }
  }, []);

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Patient Care',
      instructor: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmclMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYwMzQ1MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 65,
      totalLessons: 24,
      completedLessons: 15,
      duration: '8 weeks',
      enrolled: '2024-09-15',
      nextLesson: 'Lesson 16: Emergency Response',
      certificate: false,
    },
    {
      id: 2,
      title: 'Medication Management Basics',
      instructor: 'Nurse Priya Singh',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2F0aW9uJTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjA0NTM2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 100,
      totalLessons: 12,
      completedLessons: 12,
      duration: '4 weeks',
      enrolled: '2024-08-20',
      nextLesson: null,
      certificate: true,
    },
  ];

  const registeredEvents = [
    {
      id: 1,
      title: 'Healthcare Summit 2024',
      type: 'Conference',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NjA0NTM2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-10-18',
      time: '9:00 AM - 5:00 PM',
      location: 'India Expo Centre, Delhi',
      venue: 'Hall 5, India Expo Centre',
      status: 'upcoming',
      daysUntil: 2,
      hasJoinLink: false,
    },
    {
      id: 2,
      title: 'Nursing Excellence Awards',
      type: 'Event',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwYXdhcmR8ZW58MXx8fHwxNzYwNDUzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-09-25',
      time: '6:00 PM - 9:00 PM',
      location: 'Hotel Taj Palace, Delhi',
      venue: 'Grand Ballroom, Taj Palace',
      status: 'completed',
      daysUntil: null,
      hasJoinLink: false,
    },
  ];

  const registeredWorkshops = [
    {
      id: 1,
      title: 'Wound Care Management Workshop',
      instructor: 'Dr. Anjali Reddy',
      type: 'Live Workshop',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYwNDUzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-10-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Virtual (Zoom)',
      joinLink: 'https://zoom.us/j/123456789',
      status: 'upcoming',
      daysUntil: 4,
      duration: '3 hours',
    },
    {
      id: 2,
      title: 'IV Therapy Techniques',
      instructor: 'Nurse Kumar',
      type: 'Hands-on Workshop',
      image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzYwNDUzNjc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2024-09-18',
      time: '10:00 AM - 1:00 PM',
      location: 'Training Center, AIIMS Delhi',
      joinLink: null,
      status: 'completed',
      daysUntil: null,
      duration: '3 hours',
    },
  ];

  // Wellness & Fitness programs from Engage section
  const enrolledWellness = [
    {
      id: 1,
      title: 'Stress Management for Healthcare Workers',
      type: 'Mental Wellness',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 40,
      totalSessions: 8,
      completedSessions: 3,
      nextSession: 'Session 4: Breathing Techniques',
      status: 'active',
      enrolled: '2024-09-01',
    },
    {
      id: 2,
      title: '30-Day Nurse Fitness Challenge',
      instructor: 'Fitness Coach Priya',
      type: 'Fitness Challenge',
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 75,
      totalDays: 30,
      completedDays: 22,
      nextActivity: 'Day 23: Core Strength Training',
      status: 'active',
      enrolled: '2024-08-15',
    },
    {
      id: 3,
      title: 'Mindfulness & Meditation for Nurses',
      type: 'Wellness Workshop',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      progress: 100,
      totalSessions: 6,
      completedSessions: 6,
      status: 'completed',
      enrolled: '2024-07-20',
      certificate: true,
    },
  ];

  const upcomingEvents = registeredEvents.filter(e => e.status === 'upcoming');
  const completedEvents = registeredEvents.filter(e => e.status === 'completed');
  const upcomingWorkshops = registeredWorkshops.filter(w => w.status === 'upcoming');
  const completedWorkshops = registeredWorkshops.filter(w => w.status === 'completed');
  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const activeWellness = enrolledWellness.filter(w => w.status === 'active');
  const completedWellness = enrolledWellness.filter(w => w.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <h2 className="text-white mb-6">My Learning</h2>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
            <BookOpen className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xs text-white/90">Courses</p>
            <p className="text-lg">{enrolledCourses.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
            <Heart className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xs text-white/90">Wellness</p>
            <p className="text-lg">{enrolledWellness.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
            <Calendar className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xs text-white/90">Events</p>
            <p className="text-lg">{registeredEvents.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 text-center shadow-lg">
            <Users className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xs text-white/90">Workshops</p>
            <p className="text-lg">{registeredWorkshops.length}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* In Progress */}
            {inProgressCourses.length > 0 && (
              <div>
                <h3 className="mb-3">In Progress</h3>
                <div className="space-y-3">
                  {inProgressCourses.map((course) => (
                    <Card 
                      key={course.id} 
                      className="shadow-lg border-none overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('course-viewer', course)}
                    >
                      <CardContent className="p-0">
                        <div className="relative h-40">
                          <ImageWithFallback
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-500 text-white border-none">
                              In Progress
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white mb-2">{course.title}</h4>
                            <Progress value={course.progress} className="h-2 bg-white/20" />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">by {course.instructor}</p>
                            <p className="text-sm font-medium text-purple-600">{course.progress}% Complete</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          {course.nextLesson && (
                            <div className="bg-purple-50 rounded-lg p-3 mb-3">
                              <p className="text-xs text-gray-600 mb-1">Next Lesson</p>
                              <p className="text-sm font-medium text-purple-900">{course.nextLesson}</p>
                            </div>
                          )}
                          <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                            <Play className="mr-2 h-4 w-4" />
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedCourses.length > 0 && (
              <div>
                <h3 className="mb-3">Completed</h3>
                <div className="space-y-3">
                  {completedCourses.map((course) => (
                    <Card 
                      key={course.id} 
                      className="shadow-lg border-none cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('course-viewer', course)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{course.title}</h4>
                                <p className="text-xs text-gray-600">by {course.instructor}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-none">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                              <span>{course.totalLessons} lessons</span>
                              <span>•</span>
                              <span>{course.duration}</span>
                            </div>
                            {course.certificate && (
                              <Button variant="outline" size="sm" className="rounded-full">
                                <Download className="h-3 w-3 mr-1" />
                                Download Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6">
            {/* Active Wellness Programs */}
            {activeWellness.length > 0 && (
              <div>
                <h3 className="mb-3">Active Programs</h3>
                <div className="space-y-3">
                  {activeWellness.map((program) => (
                    <Card 
                      key={program.id} 
                      className="shadow-lg border-none cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('wellness-viewer', program)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={program.image}
                              alt={program.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{program.title}</h4>
                                <p className="text-xs text-gray-600">{program.type}</p>
                              </div>
                              <Badge className="bg-blue-500 text-white border-none">
                                In Progress
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                              <span>{program.completedSessions}/{program.totalSessions} sessions</span>
                              <span>•</span>
                              <span>{program.nextSession}</span>
                            </div>
                            <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                              <Play className="mr-2 h-4 w-4" />
                              Continue
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Wellness Programs */}
            {completedWellness.length > 0 && (
              <div>
                <h3 className="mb-3">Completed Programs</h3>
                <div className="space-y-3">
                  {completedWellness.map((program) => (
                    <Card 
                      key={program.id} 
                      className="shadow-lg border-none cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('wellness-viewer', program)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 grayscale">
                            <ImageWithFallback
                              src={program.image}
                              alt={program.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{program.title}</h4>
                                <p className="text-xs text-gray-600">{program.type}</p>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700 border-none">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                              <span>{program.totalSessions} sessions</span>
                              <span>•</span>
                              <span>{program.nextSession}</span>
                            </div>
                            {program.certificate && (
                              <Button variant="outline" size="sm" className="rounded-full">
                                <Download className="h-3 w-3 mr-1" />
                                Download Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="mb-3">Upcoming</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <Card 
                      key={event.id} 
                      className="shadow-lg border-none border-l-4 border-l-green-500 cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('event-viewer', event)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{event.title}</h4>
                                <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                                  {event.type}
                                </Badge>
                              </div>
                              {event.daysUntil && event.daysUntil <= 3 && (
                                <Badge className="bg-orange-100 text-orange-700 border-none">
                                  {event.daysUntil}d left
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full rounded-full">
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div>
                <h3 className="mb-3">Past Events</h3>
                <div className="space-y-3">
                  {completedEvents.map((event) => (
                    <Card 
                      key={event.id} 
                      className="shadow-lg border-none opacity-75 cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('event-viewer', event)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 grayscale">
                            <ImageWithFallback
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm mb-1">{event.title}</h4>
                              <Badge className="bg-gray-100 text-gray-700 border-none">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Attended
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Workshops Tab */}
          <TabsContent value="workshops" className="space-y-6">
            {/* Upcoming Workshops */}
            {upcomingWorkshops.length > 0 && (
              <div>
                <h3 className="mb-3">Upcoming</h3>
                <div className="space-y-3">
                  {upcomingWorkshops.map((workshop) => (
                    <Card 
                      key={workshop.id} 
                      className="shadow-lg border-none border-l-4 border-l-orange-500 cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('workshop-viewer', workshop)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{workshop.title}</h4>
                                <p className="text-xs text-gray-600">by {workshop.instructor}</p>
                              </div>
                              {workshop.daysUntil && workshop.daysUntil <= 5 && (
                                <Badge className="bg-orange-100 text-orange-700 border-none">
                                  {workshop.daysUntil}d left
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{workshop.time} • {workshop.duration}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {workshop.location.includes('Virtual') ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <Users className="h-3 w-3" />
                                )}
                                <span>{workshop.location}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full rounded-full"
                            >
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Workshops */}
            {completedWorkshops.length > 0 && (
              <div>
                <h3 className="mb-3">Past Workshops</h3>
                <div className="space-y-3">
                  {completedWorkshops.map((workshop) => (
                    <Card 
                      key={workshop.id} 
                      className="shadow-lg border-none opacity-75 cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => onNavigate('workshop-viewer', workshop)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 grayscale">
                            <ImageWithFallback
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm mb-1">{workshop.title}</h4>
                                <p className="text-xs text-gray-600">by {workshop.instructor}</p>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700 border-none">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}