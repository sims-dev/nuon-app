import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Search,
  Calendar,
  Heart,
  Dumbbell,
  Users,
  Clock,
  MapPin,
  IndianRupee,
  Activity,
  Brain,
  Smile,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EngageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Engage({ onNavigate }: EngageProps) {
  const [displayName, setDisplayName] = useState('Priya');

  useEffect(() => {
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) {
        const firstName = parsed.fullName.split(' ')[0];
        setDisplayName(firstName);
      }
    }
  }, []);

  const wellnessPrograms = [
    {
      id: 1,
      title: "Stress Management for Healthcare Workers",
      type: "Mental Wellness",
      date: "Nov 15, 2024",
      time: "6:00 PM - 7:30 PM",
      location: "Online",
      price: 0,
      points: 100,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 50,
      category: "Mental Health",
    },
    {
      id: 2,
      title: "Mindfulness & Meditation for Nurses",
      type: "Wellness Workshop",
      date: "Nov 18, 2024",
      time: "7:00 AM - 8:00 AM",
      location: "Online",
      price: 299,
      points: 150,
      image:
        "https://images.unsplash.com/photo-1545389336-cf090694435e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 30,
      category: "Mindfulness",
    },
    {
      id: 3,
      title: "Self-Care Sunday: Yoga & Breathwork",
      type: "Wellness Session",
      date: "Nov 17, 2024",
      time: "8:00 AM - 9:30 AM",
      location: "Mumbai Community Center",
      price: 199,
      points: 120,
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 25,
      category: "Self-Care",
    },
    {
      id: 4,
      title: "Burnout Prevention Workshop",
      type: "Mental Wellness",
      date: "Nov 22, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "Online",
      price: 0,
      points: 200,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 100,
      category: "Burnout Prevention",
    },
  ];

  const fitnessActivities = [
    {
      id: 1,
      title: "30-Day Nurse Fitness Challenge",
      instructor: "Fitness Coach Priya",
      duration: "30 days",
      type: "Challenge",
      price: 499,
      points: 300,
      enrolled: 156,
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Fitness Challenge",
    },
    {
      id: 2,
      title: "Desk Stretches for Long Shifts",
      instructor: "Dr. Anita Sharma",
      duration: "2 weeks",
      type: "Video Series",
      price: 0,
      points: 80,
      enrolled: 423,
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Workplace Wellness",
    },
    {
      id: 3,
      title: "Strength Training for Nurses",
      instructor: "Coach Rajesh Kumar",
      duration: "6 weeks",
      type: "Fitness Program",
      price: 999,
      points: 400,
      enrolled: 89,
      image:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Strength Training",
    },
    {
      id: 4,
      title: "Healthy Eating for Healthcare Heroes",
      instructor: "Nutritionist Kavita",
      duration: "4 weeks",
      type: "Nutrition Program",
      price: 799,
      points: 250,
      enrolled: 234,
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Nutrition",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Healthcare Wellness Summit 2024",
      type: "Conference",
      date: "Dec 5-7, 2024",
      time: "9:00 AM onwards",
      location: "Delhi Convention Center",
      price: 2500,
      points: 500,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 45,
      category: "Conference",
    },
    {
      id: 2,
      title: "Community Health Camp - Volunteer",
      type: "Volunteering",
      date: "Nov 25, 2024",
      time: "8:00 AM - 2:00 PM",
      location: "Local Community Center",
      price: 0,
      points: 300,
      image:
        "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 20,
      category: "Volunteering",
    },
    {
      id: 3,
      title: "Nurse Career Growth Webinar",
      type: "Webinar",
      date: "Nov 20, 2024",
      time: "5:00 PM - 6:30 PM",
      location: "Online",
      price: 0,
      points: 100,
      image:
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 200,
      category: "Professional Growth",
    },
    {
      id: 4,
      title: "Nursing Leadership Workshop",
      type: "Workshop",
      date: "Dec 1, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Mumbai Training Center",
      price: 1500,
      points: 350,
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 30,
      category: "Leadership",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl sticky top-0 z-10">
        <h2 className="text-white mb-4">Engage</h2>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            type="search"
            placeholder="Search wellness, fitness, events..."
            className="pl-10 rounded-xl h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="wellness" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="wellness">
              <Heart className="h-4 w-4 mr-1" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="fitness">
              <Dumbbell className="h-4 w-4 mr-1" />
              Fitness
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-1" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Prioritize your mental health and well-being with our wellness programs
              </p>
            </div>
            {wellnessPrograms.map((program) => (
              <Card
                key={program.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("engage-details", {
                    type: "wellness",
                    data: program,
                  })
                }
              >
                <CardContent className="p-0">
                  <div className="relative h-40 rounded-t-xl overflow-hidden">
                    <ImageWithFallback
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      {program.seats} seats left
                    </Badge>
                    {program.price === 0 && (
                      <Badge className="absolute top-3 left-3 bg-blue-500">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-purple-100 text-purple-700">
                      <Heart className="h-3 w-3 mr-1" />
                      {program.category}
                    </Badge>
                    <h3 className="mb-2">{program.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{program.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{program.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{program.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {program.price === 0 ? (
                          <p className="text-green-600">Free</p>
                        ) : (
                          <p className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {program.price}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">
                          +{program.points} pts
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Fitness Tab */}
          <TabsContent value="fitness" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Stay active and healthy with fitness programs designed for nurses
              </p>
            </div>
            {fitnessActivities.map((activity) => (
              <Card
                key={activity.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("engage-details", {
                    type: "fitness",
                    data: activity,
                  })
                }
              >
                <CardContent className="p-0">
                  <div className="relative h-40 rounded-t-xl overflow-hidden">
                    <ImageWithFallback
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-orange-500">
                      {activity.type}
                    </Badge>
                    {activity.price === 0 && (
                      <Badge className="absolute top-3 left-3 bg-blue-500">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-700">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {activity.category}
                    </Badge>
                    <h3 className="mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {activity.instructor}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{activity.enrolled} enrolled</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {activity.price === 0 ? (
                          <p className="text-green-600">Free</p>
                        ) : (
                          <p className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {activity.price}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">
                          +{activity.points} pts
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Join conferences, workshops, and community events for professional growth
              </p>
            </div>
            {events.map((event) => (
              <Card
                key={event.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("engage-details", {
                    type: "event",
                    data: event,
                  })
                }
              >
                <CardContent className="p-0">
                  <div className="relative h-40 rounded-t-xl overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      {event.seats} seats left
                    </Badge>
                    {event.price === 0 && (
                      <Badge className="absolute top-3 left-3 bg-blue-500">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700">
                      <Activity className="h-3 w-3 mr-1" />
                      {event.category}
                    </Badge>
                    <h3 className="mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {event.price === 0 ? (
                          <p className="text-green-600">Free</p>
                        ) : (
                          <p className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {event.price}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">
                          +{event.points} pts
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
