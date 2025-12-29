import { ChevronLeft, Play, CheckCircle, Lock, Download, BookOpen, Clock, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseViewerProps {
  onNavigate: (page: string) => void;
  courseData?: any;
}

export function CourseViewer({ onNavigate, courseData }: CourseViewerProps) {
  const course = courseData || {
    id: 1,
    title: 'Advanced Patient Care',
    instructor: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmclMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYwMzQ1MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    progress: 65,
    totalLessons: 24,
    completedLessons: 15,
    duration: '8 weeks',
    enrolled: '2024-09-15',
    certificate: false,
  };

  const lessons = [
    { id: 1, title: 'Introduction to Patient Care', duration: '12 min', completed: true },
    { id: 2, title: 'Basic Assessment Techniques', duration: '18 min', completed: true },
    { id: 3, title: 'Vital Signs Monitoring', duration: '22 min', completed: true },
    { id: 4, title: 'Patient Communication Skills', duration: '15 min', completed: true },
    { id: 5, title: 'Documentation Best Practices', duration: '20 min', completed: true },
    { id: 6, title: 'Infection Control Protocols', duration: '25 min', completed: true },
    { id: 7, title: 'Medication Administration Safety', duration: '28 min', completed: true },
    { id: 8, title: 'Pain Management Strategies', duration: '23 min', completed: true },
    { id: 9, title: 'Wound Care Basics', duration: '30 min', completed: true },
    { id: 10, title: 'Patient Mobility Assistance', duration: '18 min', completed: true },
    { id: 11, title: 'Nutrition and Hydration', duration: '20 min', completed: true },
    { id: 12, title: 'Fall Prevention', duration: '16 min', completed: true },
    { id: 13, title: 'Oxygen Therapy', duration: '22 min', completed: true },
    { id: 14, title: 'Catheter Care', duration: '24 min', completed: true },
    { id: 15, title: 'Pressure Ulcer Prevention', duration: '26 min', completed: true },
    { id: 16, title: 'Emergency Response', duration: '30 min', completed: false, current: true },
    { id: 17, title: 'Advanced Assessment Skills', duration: '28 min', completed: false, locked: true },
    { id: 18, title: 'Complex Medication Management', duration: '32 min', completed: false, locked: true },
    { id: 19, title: 'Critical Thinking in Care', duration: '25 min', completed: false, locked: true },
    { id: 20, title: 'Patient Advocacy', duration: '18 min', completed: false, locked: true },
    { id: 21, title: 'End of Life Care', duration: '30 min', completed: false, locked: true },
    { id: 22, title: 'Cultural Competence', duration: '20 min', completed: false, locked: true },
    { id: 23, title: 'Ethical Considerations', duration: '22 min', completed: false, locked: true },
    { id: 24, title: 'Final Assessment', duration: '45 min', completed: false, locked: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <button onClick={() => onNavigate('my-learning')} className="flex items-center gap-2">
            <ChevronLeft className="h-6 w-6" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Course Banner */}
      <div className="relative h-64">
        <ImageWithFallback
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="mb-3 bg-blue-500 text-white border-none">
            {course.progress < 100 ? 'In Progress' : 'Completed'}
          </Badge>
          <h1 className="text-white mb-2">{course.title}</h1>
          <p className="text-white/90 text-sm">by {course.instructor}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Card */}
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Your Progress</h3>
              <p className="text-2xl text-purple-600">{course.progress}%</p>
            </div>
            <Progress value={course.progress} className="h-3 mb-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="font-medium">{course.completedLessons} lessons</p>
              </div>
              <div>
                <p className="text-gray-600">Remaining</p>
                <p className="font-medium">{course.totalLessons - course.completedLessons} lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Info */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Total Lessons:</span>
                <span className="font-medium">{course.totalLessons}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Enrolled:</span>
                <span className="font-medium">{new Date(course.enrolled).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Course Content</h3>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div key={lesson.id}>
                  <button
                    disabled={lesson.locked}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      lesson.current
                        ? 'bg-purple-50 border-2 border-purple-500'
                        : lesson.completed
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : lesson.locked
                        ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed
                        ? 'bg-green-100'
                        : lesson.current
                        ? 'bg-purple-500'
                        : lesson.locked
                        ? 'bg-gray-200'
                        : 'bg-purple-100'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : lesson.locked ? (
                        <Lock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Play className={`h-5 w-5 ${lesson.current ? 'text-white' : 'text-purple-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm mb-1 ${lesson.current ? 'font-medium text-purple-900' : ''}`}>
                        Lesson {lesson.id}: {lesson.title}
                      </p>
                      <p className="text-xs text-gray-600">{lesson.duration}</p>
                    </div>
                    {lesson.current && (
                      <Badge className="bg-purple-500 text-white">
                        Continue
                      </Badge>
                    )}
                  </button>
                  {index < lessons.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Download */}
        {course.certificate && course.progress === 100 && (
          <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-green-900 mb-1">Congratulations!</h4>
                  <p className="text-sm text-gray-600">You've completed this course</p>
                </div>
              </div>
              <Separator className="my-4" />
              <Button className="w-full rounded-full bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
