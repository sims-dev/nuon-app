import { useState } from 'react';
import { ChevronLeft, Bell, BookOpen, Users, Award, CheckCircle2, Settings } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

export function Notifications({ onNavigate }: NotificationsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    sessions: true,
    achievements: true,
    courses: true,
    tasks: true,
    announcements: true,
    email: false,
  });

  const notifications = [
    {
      id: 1,
      type: 'session',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Upcoming Session Reminder',
      message: 'Your mentorship session with Dr. Anjali Reddy starts in 1 hour',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 2,
      type: 'achievement',
      icon: Award,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'New Badge Earned! 🎉',
      message: 'Congratulations! You earned the "Week Warrior" badge',
      time: '3 hours ago',
      unread: true,
    },
    {
      id: 3,
      type: 'course',
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'New Course Available',
      message: 'Check out "Advanced Medication Management" - Perfect for you!',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 4,
      type: 'task',
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Task Reminder',
      message: 'Don\'t forget to submit your case study assignment by tomorrow',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 5,
      type: 'course',
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Course Progress',
      message: 'You\'re 65% through Patient Care Basics. Keep it up!',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 6,
      type: 'session',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Session Completed',
      message: 'Great session with Nurse Priya Singh! Don\'t forget to rate',
      time: '3 days ago',
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter(n => n.unread);
  const readNotifications = notifications.filter(n => !n.unread);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('dashboard')}>
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2>Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              {unreadNotifications.length > 0 && (
                <Badge className="bg-primary">
                  {unreadNotifications.length} new
                </Badge>
              )}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b shadow-sm">
          <div className="px-6 py-4">
            <h3 className="mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Session Reminders</p>
                  <p className="text-xs text-gray-600">Get notified about upcoming sessions</p>
                </div>
                <Switch 
                  checked={notificationSettings.sessions}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, sessions: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Achievement Alerts</p>
                  <p className="text-xs text-gray-600">Celebrate your milestones and badges</p>
                </div>
                <Switch 
                  checked={notificationSettings.achievements}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, achievements: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Course Updates</p>
                  <p className="text-xs text-gray-600">New courses and recommendations</p>
                </div>
                <Switch 
                  checked={notificationSettings.courses}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, courses: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Task Reminders</p>
                  <p className="text-xs text-gray-600">Assignment and deadline alerts</p>
                </div>
                <Switch 
                  checked={notificationSettings.tasks}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, tasks: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Announcements</p>
                  <p className="text-xs text-gray-600">Important updates and news</p>
                </div>
                <Switch 
                  checked={notificationSettings.announcements}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, announcements: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`shadow-sm ${notification.unread ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${notification.iconColor}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm">{notification.title}</h4>
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className="shadow-sm border-l-4 border-l-primary"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center`}>
                            <Icon className={`h-6 w-6 ${notification.iconColor}`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm">{notification.title}</h4>
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2 mt-1"></div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">You have no unread notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
