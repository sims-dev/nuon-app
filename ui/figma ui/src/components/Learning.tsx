import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  BookOpen,
  Users,
  Clock,
  MapPin,
  IndianRupee,
  GraduationCap,
  Award,
  Briefcase,
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

interface LearningProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Learning({ onNavigate }: LearningProps) {
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

  const courses = [
    {
      id: 1,
      title: "Advanced Patient Care & Management",
      instructor: "Dr. Sarah Johnson",
      type: "Professional Development",
      duration: "8 weeks",
      price: 2999,
      points: 500,
      enrolled: 234,
      image: "https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Clinical Skills",
      level: "Advanced",
      modules: 24,
      certificate: true,
    },
    {
      id: 2,
      title: "Medication Management Fundamentals",
      instructor: "Nurse Priya Singh",
      type: "Clinical Skills",
      duration: "4 weeks",
      price: 1999,
      points: 300,
      enrolled: 567,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Medication Safety",
      level: "Intermediate",
      modules: 12,
      certificate: true,
    },
    {
      id: 3,
      title: "Emergency Response & Critical Care",
      instructor: "Dr. Rajesh Kumar",
      type: "Emergency Care",
      duration: "6 weeks",
      price: 3499,
      points: 600,
      enrolled: 189,
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Critical Care",
      level: "Advanced",
      modules: 18,
      certificate: true,
    },
    {
      id: 4,
      title: "Nursing Documentation Essentials",
      instructor: "Nurse Kavita Sharma",
      type: "Professional Development",
      duration: "3 weeks",
      price: 0,
      points: 150,
      enrolled: 891,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Documentation",
      level: "Beginner",
      modules: 8,
      certificate: true,
    },
    {
      id: 5,
      title: "Pediatric Nursing Specialization",
      instructor: "Dr. Meera Patel",
      type: "Specialization",
      duration: "10 weeks",
      price: 4999,
      points: 800,
      enrolled: 145,
      image: "https://images.unsplash.com/photo-1614964157925-8fd859e6d3b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Pediatrics",
      level: "Advanced",
      modules: 30,
      certificate: true,
    },
    {
      id: 6,
      title: "Infection Control & Prevention",
      instructor: "Dr. Anjali Reddy",
      type: "Clinical Skills",
      duration: "2 weeks",
      price: 0,
      points: 100,
      enrolled: 1234,
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      category: "Safety",
      level: "Beginner",
      modules: 6,
      certificate: true,
    },
  ];

  const events = [
    {
      id: 1,
      title: "National Nursing Conference 2024",
      type: "Conference",
      date: "Dec 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "India Habitat Centre, Delhi",
      price: 3500,
      points: 600,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 150,
      category: "Conference",
      speakers: "15+ Healthcare Leaders",
    },
    {
      id: 2,
      title: "Future of Healthcare Webinar",
      type: "Webinar",
      date: "Nov 25, 2024",
      time: "4:00 PM - 6:00 PM",
      location: "Online (Zoom)",
      price: 0,
      points: 100,
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 500,
      category: "Professional Growth",
      speakers: "Dr. Sharma & Team",
    },
    {
      id: 3,
      title: "Clinical Excellence Summit",
      type: "Summit",
      date: "Jan 15-16, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Mumbai Convention Center",
      price: 2500,
      points: 400,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 200,
      category: "Clinical Excellence",
      speakers: "20+ Industry Experts",
    },
    {
      id: 4,
      title: "Nurse Leadership Forum 2024",
      type: "Forum",
      date: "Dec 5, 2024",
      time: "2:00 PM - 7:00 PM",
      location: "Bangalore International Centre",
      price: 1500,
      points: 250,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 100,
      category: "Leadership",
      speakers: "10+ Nursing Leaders",
    },
  ];

  const workshops = [
    {
      id: 1,
      title: "Advanced Wound Care Management",
      instructor: "Dr. Anjali Reddy",
      type: "Hands-on Workshop",
      date: "Nov 28, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "AIIMS Training Center, Delhi",
      price: 2500,
      points: 350,
      enrolled: 45,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 30,
      category: "Clinical Skills",
      duration: "6 hours",
      materials: "Provided",
    },
    {
      id: 2,
      title: "IV Therapy & Venipuncture Techniques",
      instructor: "Nurse Kumar Patel",
      type: "Practical Training",
      date: "Dec 2, 2024",
      time: "9:00 AM - 2:00 PM",
      location: "Medical Training Institute, Mumbai",
      price: 1999,
      points: 280,
      enrolled: 67,
      image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 25,
      category: "Technical Skills",
      duration: "5 hours",
      materials: "Provided",
    },
    {
      id: 3,
      title: "ECG Interpretation Workshop",
      instructor: "Dr. Meera Singh",
      type: "Live Workshop",
      date: "Dec 8, 2024",
      time: "11:00 AM - 5:00 PM",
      location: "Virtual (Zoom)",
      price: 1499,
      points: 200,
      enrolled: 189,
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 100,
      category: "Diagnostic Skills",
      duration: "6 hours",
      materials: "Digital Resources",
    },
    {
      id: 4,
      title: "Patient Communication Skills",
      instructor: "Dr. Sarah Johnson",
      type: "Interactive Workshop",
      date: "Nov 30, 2024",
      time: "3:00 PM - 6:00 PM",
      location: "Online",
      price: 0,
      points: 120,
      enrolled: 423,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 200,
      category: "Soft Skills",
      duration: "3 hours",
      materials: "Free PDF Guide",
    },
    {
      id: 5,
      title: "Neonatal Care Basics",
      instructor: "Dr. Priya Sharma",
      type: "Hands-on Workshop",
      date: "Dec 15, 2024",
      time: "10:00 AM - 5:00 PM",
      location: "Apollo Hospital Training Center, Bangalore",
      price: 3500,
      points: 450,
      enrolled: 34,
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      seats: 20,
      category: "Neonatal Care",
      duration: "7 hours",
      materials: "Equipment Provided",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white">Learning</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('my-learning')}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            My Learning
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            type="search"
            placeholder="Search courses, events, workshops..."
            className="pl-10 rounded-xl h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="courses">
              <GraduationCap className="h-4 w-4 mr-1" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-1" />
              Events
            </TabsTrigger>
            <TabsTrigger value="workshops">
              <Briefcase className="h-4 w-4 mr-1" />
              Workshops
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Advance your nursing career with professional development courses
              </p>
            </div>
            {courses.map((course) => (
              <Card
                key={course.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("learning-details", {
                    type: "course",
                    data: course,
                  })
                }
              >
                <CardContent className="p-0">
                  <div className="relative h-40 rounded-t-xl overflow-hidden">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-blue-500">
                      {course.level}
                    </Badge>
                    {course.price === 0 && (
                      <Badge className="absolute top-3 left-3 bg-green-500">
                        FREE
                      </Badge>
                    )}
                    {course.certificate && (
                      <Badge className="absolute bottom-3 left-3 bg-purple-500">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {course.category}
                    </Badge>
                    <h3 className="mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolled}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {course.price === 0 ? (
                          <p className="text-green-600">Free</p>
                        ) : (
                          <p className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {course.price}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">
                          +{course.points} pts
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
                Join professional conferences, webinars, and networking events
              </p>
            </div>
            {events.map((event) => (
              <Card
                key={event.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("learning-details", {
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
                    <Badge variant="secondary" className="mb-2 bg-purple-100 text-purple-700">
                      <Calendar className="h-3 w-3 mr-1" />
                      {event.category}
                    </Badge>
                    <h3 className="mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {event.speakers}
                    </p>
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

          {/* Workshops Tab */}
          <TabsContent value="workshops" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Build practical skills with hands-on workshops and training
              </p>
            </div>
            {workshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  onNavigate("learning-details", {
                    type: "workshop",
                    data: workshop,
                  })
                }
              >
                <CardContent className="p-0">
                  <div className="relative h-40 rounded-t-xl overflow-hidden">
                    <ImageWithFallback
                      src={workshop.image}
                      alt={workshop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-orange-500">
                      {workshop.type}
                    </Badge>
                    {workshop.price === 0 && (
                      <Badge className="absolute top-3 left-3 bg-blue-500">
                        FREE
                      </Badge>
                    )}
                    {workshop.seats && workshop.seats < 30 && (
                      <Badge className="absolute bottom-3 right-3 bg-red-500">
                        {workshop.seats} seats left
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-700">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {workshop.category}
                    </Badge>
                    <h3 className="mb-1">{workshop.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {workshop.instructor}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{workshop.time} • {workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{workshop.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{workshop.enrolled} enrolled • {workshop.materials}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {workshop.price === 0 ? (
                          <p className="text-green-600">Free</p>
                        ) : (
                          <p className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {workshop.price}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">
                          +{workshop.points} pts
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