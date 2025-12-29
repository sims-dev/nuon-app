import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Users, BookOpen, IndianRupee, Gift, GraduationCap, Award, Briefcase, Video, Download } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProfileCompletionPrompt } from './ProfileCompletionPrompt';

interface LearningDetailsProps {
  onNavigate: (page: string, data?: any) => void;
  learningData?: any;
}

export function LearningDetails({ onNavigate, learningData }: LearningDetailsProps) {
  const { type, data } = learningData || { type: 'course', data: {} };
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
    if (type === 'course') {
      return 'Enhance your professional skills with this comprehensive course designed specifically for nurses. Led by experienced healthcare professionals and industry experts, this program provides in-depth knowledge, practical applications, and real-world case studies to help you excel in your nursing career. Earn a certificate upon completion to showcase your expertise.';
    } else if (type === 'event') {
      return 'Join healthcare professionals from across the country for this enriching event featuring keynote speakers, panel discussions, and networking opportunities. Gain insights from industry leaders, learn about the latest trends and innovations in healthcare, and connect with peers who share your passion for nursing excellence. This event offers valuable knowledge and professional connections that will benefit your career.';
    } else if (type === 'workshop') {
      return 'Develop practical skills through this hands-on workshop led by experienced practitioners. This interactive session combines theoretical knowledge with practical application, providing you with techniques and tools you can immediately apply in your clinical practice. Limited seats ensure personalized attention and ample opportunity for practice and feedback.';
    }
    return '';
  };

  const getWhatYouWillLearn = () => {
    if (type === 'course') {
      return [
        'Comprehensive curriculum covering essential concepts',
        'Real-world case studies and practical applications',
        'Interactive assessments and quizzes',
        'Expert-led video lectures and tutorials',
        'Downloadable resources and study materials',
        'Professional certificate upon completion',
        'Lifetime access to course materials',
        'Community forum for peer discussion',
      ];
    } else if (type === 'event') {
      return [
        'Keynote presentations from industry leaders',
        'Interactive panel discussions and Q&A sessions',
        'Networking opportunities with healthcare professionals',
        'Latest trends and innovations in healthcare',
        'Access to event recordings and materials',
        'Certificate of attendance',
        'Continuing education credits (where applicable)',
        'Exclusive resources and takeaways',
      ];
    } else {
      return [
        'Hands-on practice with equipment and techniques',
        'Step-by-step instruction from expert trainers',
        'Small group setting for personalized learning',
        'Real-world scenarios and case discussions',
        'All materials and equipment provided',
        'Certificate of completion',
        'Practice workbook and reference guides',
        'Post-workshop support and resources',
      ];
    }
  };

  const getCourseModules = () => {
    if (type === 'course' && data.modules) {
      return [
        { title: 'Introduction & Fundamentals', duration: '2 hours', lessons: 4 },
        { title: 'Core Concepts & Theory', duration: '4 hours', lessons: 6 },
        { title: 'Practical Applications', duration: '5 hours', lessons: 8 },
        { title: 'Advanced Techniques', duration: '3 hours', lessons: 4 },
        { title: 'Case Studies & Analysis', duration: '2 hours', lessons: 3 },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <button onClick={() => onNavigate('learning')} className="flex items-center gap-2">
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
          {type === 'course' && (
            <Badge className="mb-3 bg-blue-500">
              <GraduationCap className="h-3 w-3 mr-1" />
              Course
            </Badge>
          )}
          {type === 'event' && (
            <Badge className="mb-3 bg-purple-500">
              <Calendar className="h-3 w-3 mr-1" />
              Event
            </Badge>
          )}
          {type === 'workshop' && (
            <Badge className="mb-3 bg-orange-500">
              <Briefcase className="h-3 w-3 mr-1" />
              Workshop
            </Badge>
          )}
          <h1 className="mb-2">{data.title}</h1>
          {data.instructor && (
            <p className="text-gray-600">by {data.instructor}</p>
          )}
          {data.speakers && (
            <p className="text-gray-600">{data.speakers}</p>
          )}
          {data.category && (
            <p className="text-sm text-gray-500 mt-1">{data.category}</p>
          )}
          {data.level && (
            <Badge variant="outline" className="mt-2">
              {data.level}
            </Badge>
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
                {data.location.includes('Online') || data.location.includes('Virtual') ? (
                  <Video className="h-5 w-5 text-primary" />
                ) : (
                  <MapPin className="h-5 w-5 text-primary" />
                )}
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
            {data.modules && (
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Modules</p>
                  <p className="text-sm">{data.modules} comprehensive modules</p>
                </div>
              </div>
            )}
            {data.enrolled && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="text-sm">{data.enrolled} students</p>
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
            {data.certificate && (
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Certificate</p>
                  <p className="text-sm">Yes, upon completion</p>
                </div>
              </div>
            )}
            {data.materials && (
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Materials</p>
                  <p className="text-sm">{data.materials}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3">About This {type === 'course' ? 'Course' : type === 'event' ? 'Event' : 'Workshop'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getDescriptionByType()}
            </p>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3">What You'll {type === 'course' ? 'Learn' : 'Get'}</h3>
            <div className="space-y-2">
              {getWhatYouWillLearn().map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        {type === 'course' && getCourseModules().length > 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3">Course Curriculum</h3>
              <div className="space-y-3">
                {getCourseModules().map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm mb-1">Module {index + 1}</p>
                      <p className="text-sm">{module.title}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <p>{module.lessons} lessons</p>
                      <p>{module.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {type === 'course' && (
          <Card className="shadow-sm bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <h3 className="mb-3 text-blue-900">Why Take This Course?</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Continuous learning is essential for providing excellent patient care and advancing your nursing career. This course offers evidence-based content, practical skills, and professional recognition that will enhance your capabilities and open new opportunities in healthcare.
              </p>
            </CardContent>
          </Card>
        )}

        {type === 'workshop' && (
          <Card className="shadow-sm bg-orange-50 border-orange-100">
            <CardContent className="p-4">
              <h3 className="mb-3 text-orange-900">Why Attend This Workshop?</h3>
              <p className="text-sm text-orange-800 leading-relaxed">
                Hands-on training is invaluable for developing clinical skills and building confidence. This workshop provides a safe learning environment where you can practice techniques, ask questions, and receive expert guidance—helping you deliver better patient care with increased competence.
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
            {data.price === 0 ? 'Enroll Free' : type === 'event' ? 'Register Now' : type === 'workshop' ? 'Book Your Seat' : 'Enroll Now'}
          </Button>
        </div>
      </div>

      {/* Profile Completion Prompt */}
      {showCompletionPrompt && (
        <ProfileCompletionPrompt
          feature={type === 'course' ? 'courses' : type === 'event' ? 'events' : 'workshops'}
          onComplete={() => onNavigate('profile-edit')}
          onCancel={() => setShowCompletionPrompt(false)}
        />
      )}
    </div>
  );
}
