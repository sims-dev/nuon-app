import { useState } from 'react';
import { ChevronLeft, Sparkles, CheckCircle2, Lamp, Calendar, FileText, Users, GraduationCap, Trophy, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NightingaleChampionProps {
  onNavigate: (page: string) => void;
  onCelebrate?: (data: any) => void;
}

export function NightingaleChampion({ onNavigate, onCelebrate }: NightingaleChampionProps) {
  const [assessmentStage, setAssessmentStage] = useState<'overview' | 'questionnaire' | 'workshop' | 'leadership' | 'completed'>('overview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
      question: 'What is your primary area of nursing expertise?',
      options: ['Critical Care', 'Emergency', 'Pediatrics', 'General Ward'],
    },
    {
      id: 2,
      question: 'How many years of clinical experience do you have?',
      options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'],
    },
    {
      id: 3,
      question: 'Have you completed any specialized certifications?',
      options: ['Yes, multiple', 'Yes, one', 'Currently pursuing', 'No'],
    },
    {
      id: 4,
      question: 'How comfortable are you with teaching and mentoring?',
      options: ['Very comfortable', 'Somewhat comfortable', 'Need more experience', 'Not comfortable yet'],
    },
    {
      id: 5,
      question: 'What motivates you to become a Champion Mentor?',
      options: ['Give back to profession', 'Share knowledge', 'Professional growth', 'All of the above'],
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Card with Nightingale Theme - Coming Soon */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1588439319418-3ee1dca2dfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yZW5jZSUyMG5pZ2h0aW5nYWxlJTIwbGFtcHxlbnwxfHx8fDE3NjA0MjczNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Nightingale Lamp"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-pink-900/80 to-orange-900/80"></div>
        </div>
        
        <div className="relative z-10 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Lamp className="h-12 w-12 text-yellow-300" />
          </div>
          <h2 className="text-white mb-3">The Nightingale Programme</h2>
          <p className="text-white/95 leading-relaxed mb-4">
            Follow in the footsteps of Florence Nightingale. Become a certified Champion Mentor and light the way for the next generation of nurses.
          </p>
          <Badge className="bg-yellow-500 text-gray-900 border-none">
            Coming Soon in Phase 2
          </Badge>
        </div>
      </div>
      
      {/* Thank You Message */}
      <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-gray-900 mb-3">Thank You for Your Interest!</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We're excited about your enthusiasm to become a Champion Mentor. The Nightingale Programme will be launched soon as part of Phase 2 of NUON.
          </p>
          <p className="text-sm text-gray-600">
            We'll notify you as soon as enrollments open. Stay tuned! 🎉
          </p>
        </CardContent>
      </Card>

      {/* Nightingale Values */}
      <Card className="shadow-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            The Nightingale Values
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-sm mb-1">Compassionate Leadership</h4>
              <p className="text-xs text-gray-600">Lead with empathy and understanding</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-sm mb-1">Knowledge Sharing</h4>
              <p className="text-xs text-gray-600">Illuminate others with your wisdom</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-sm mb-1">Professional Excellence</h4>
              <p className="text-xs text-gray-600">Maintain the highest standards</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-sm mb-1">Continuous Growth</h4>
              <p className="text-xs text-gray-600">Never stop learning and improving</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits as Mentor */}
      <Card className="shadow-lg border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle>Champion Mentor Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Lamp className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1">Official Certification</h4>
              <p className="text-xs text-gray-600">Recognized Nightingale Champion Mentor status</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1">Guide Future Nurses</h4>
              <p className="text-xs text-gray-600">Mentor and inspire the next generation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Trophy className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1">Earn While You Mentor</h4>
              <p className="text-xs text-gray-600">Get paid for sessions + 2x reward points</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1">Elite Network Access</h4>
              <p className="text-xs text-gray-600">Join the community of healthcare leaders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-Step Programme */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>The Nightingale Journey</CardTitle>
          <p className="text-sm text-gray-600">3 transformative steps to mentorship</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">Step 1</Badge>
              <h4 className="mb-1">Assessment Questionnaire</h4>
              <p className="text-sm text-gray-600">Evaluate your expertise and readiness</p>
            </div>
          </div>
          
          <div className="h-8 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300 ml-6"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">Step 2</Badge>
              <h4 className="mb-1">Workshop & Interview</h4>
              <p className="text-sm text-gray-600">Live evaluation with expert panel</p>
            </div>
          </div>
          
          <div className="h-8 w-0.5 bg-gradient-to-b from-pink-300 to-orange-300 ml-6"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">Step 3</Badge>
              <h4 className="mb-1">Leadership Programme</h4>
              <p className="text-sm text-gray-600">4-week intensive mentoring training</p>
            </div>
          </div>
          
          <div className="h-8 w-0.5 bg-gradient-to-b from-orange-300 to-yellow-300 ml-6"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Lamp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-yellow-500">Final</Badge>
              <h4 className="mb-1">Nightingale Certification</h4>
              <p className="text-sm text-gray-600">Receive your Champion Mentor certificate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => onNavigate('dashboard')}
        className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
      >
        Return to Dashboard
      </Button>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Want to be notified when we launch? Make sure your notification preferences are enabled in your profile.
      </p>
    </div>
  );

  const renderQuestionnaire = () => {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const question = questions[currentQuestion];

    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-2 border-purple-100">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
                <Badge className="bg-purple-100 text-purple-700">{Math.round(progress)}%</Badge>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Lamp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="pt-1">{question.question}</h3>
            </div>

            <RadioGroup
              value={answers[question.id]}
              onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      answers[question.id] === option 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                    <Label htmlFor={`q${question.id}-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              variant="outline"
              className="flex-1 rounded-full h-12 border-2"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
              } else {
                setAssessmentStage('workshop');
              }
            }}
            className="flex-1 rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={!answers[question.id]}
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Complete Assessment'}
          </Button>
        </div>
      </div>
    );
  };

  const renderWorkshop = () => (
    <div className="space-y-6">
      <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Assessment Complete! 🎉</h2>
          <p className="text-gray-600">
            Great work! Now let's schedule your evaluation workshop
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-pink-600" />
            Step 2: Workshop & Interview
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select a date for your live evaluation with the Nightingale panel
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { date: 'Oct 20, 2024', time: '2:00 PM - 4:00 PM', available: true },
            { date: 'Oct 22, 2024', time: '4:00 PM - 6:00 PM', available: true },
            { date: 'Oct 25, 2024', time: '10:00 AM - 12:00 PM', available: false },
          ].map((slot, index) => (
            <Card 
              key={index} 
              className={`transition-all ${
                slot.available 
                  ? 'cursor-pointer hover:border-purple-300 hover:shadow-md border-2 border-transparent' 
                  : 'opacity-50 border border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.time}</p>
                    </div>
                  </div>
                  {slot.available ? (
                    <Button 
                      size="sm" 
                      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => setAssessmentStage('leadership')}
                    >
                      Select
                    </Button>
                  ) : (
                    <Badge variant="secondary">Full</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderLeadership = () => (
    <div className="space-y-6">
      <Card className="shadow-lg bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Workshop Scheduled! 🎊</h2>
          <p className="text-gray-600 mb-4">
            Final step: Enroll in the Leadership Programme
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
            Oct 20, 2:00 PM
          </Badge>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-orange-600" />
            Step 3: Leadership Programme
          </CardTitle>
          <p className="text-sm text-gray-600">
            4-week intensive programme to master mentoring skills
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { week: 1, title: 'Leadership Fundamentals', desc: 'Building your leadership foundation', color: 'from-purple-500 to-purple-600' },
            { week: 2, title: 'Mentoring Excellence', desc: 'The art of effective mentoring', color: 'from-pink-500 to-pink-600' },
            { week: 3, title: 'Communication Mastery', desc: 'Connect with empathy and clarity', color: 'from-orange-500 to-orange-600' },
            { week: 4, title: 'Capstone & Certification', desc: 'Final project and ceremony', color: 'from-yellow-500 to-yellow-600' },
          ].map((module, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <span className="text-white font-semibold">{module.week}</span>
              </div>
              <div className="flex-1">
                <h4 className="mb-1">{module.title}</h4>
                <p className="text-sm text-gray-600">{module.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <CardContent className="p-4 flex items-center gap-3">
          <Lamp className="h-8 w-8 text-yellow-600" />
          <div>
            <h4 className="text-sm mb-1">Programme Duration</h4>
            <p className="text-xs text-gray-600">4 weeks • 12 hours total commitment</p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => {
          setAssessmentStage('completed');
          if (onCelebrate) {
            onCelebrate({
              title: 'Enrolled Successfully!',
              message: 'Your Nightingale journey has begun. You\'re on your way to becoming a Champion Mentor!',
              points: 500,
              icon: 'award'
            });
          }
        }}
        className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
      >
        <Lamp className="mr-2 h-5 w-5" />
        Enroll in Leadership Programme
      </Button>
    </div>
  );

  const renderCompleted = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"></div>
        <div className="relative z-10 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
            <Lamp className="h-12 w-12 text-yellow-300" />
          </div>
          <h1 className="text-white mb-3">Welcome to the Nightingale Programme!</h1>
          <p className="text-white/95 mb-4">
            Your journey to becoming a Champion Mentor has officially begun
          </p>
          <Badge className="bg-white text-purple-600">
            Programme Starts: Oct 20, 2024
          </Badge>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm mb-1">Check Your Email</h4>
              <p className="text-sm text-gray-600">Programme schedule and access details sent</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm mb-1">Pre-Programme Materials</h4>
              <p className="text-sm text-gray-600">Reading materials available in your dashboard</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h4 className="text-sm mb-1">Join the Community</h4>
              <p className="text-sm text-gray-600">Connect with fellow Nightingale participants</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Lamp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-sm mb-1">Certification Ceremony</h4>
              <p className="text-sm text-gray-600">Complete all modules to light your lamp</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => onNavigate('dashboard')}
        className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600"
      >
        Return to Dashboard
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Lamp className="h-6 w-6 text-yellow-300" />
            <h2 className="text-white">Nightingale Programme</h2>
          </div>
        </div>
        <p className="text-white/90 text-sm ml-14">Champion Mentor Certification</p>
      </div>

      <div className="px-6 py-6">
        {assessmentStage === 'overview' && renderOverview()}
        {assessmentStage === 'questionnaire' && renderQuestionnaire()}
        {assessmentStage === 'workshop' && renderWorkshop()}
        {assessmentStage === 'leadership' && renderLeadership()}
        {assessmentStage === 'completed' && renderCompleted()}
      </div>
    </div>
  );
}
