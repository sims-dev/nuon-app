import { useState } from 'react';
import { ChevronRight, GraduationCap, Users, Award, TrendingUp, Gift, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ValuePropositionProps {
  onComplete: () => void;
}

export function ValueProposition({ onComplete }: ValuePropositionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: GraduationCap,
      title: 'Learn & Grow',
      description: 'Access exclusive courses, workshops, and training programs designed specifically for nursing professionals.',
      gradient: 'from-purple-600 to-blue-600',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGxlYXJuaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2MDM1MDEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: Calendar,
      title: 'Events & Workshops',
      description: 'Participate in live events, webinars, and hands-on workshops with industry experts and peers.',
      gradient: 'from-pink-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwd29ya3Nob3AlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MDM1MDEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Connect with experienced mentors for personalized guidance and career development support.',
      gradient: 'from-cyan-600 to-blue-600',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZW50b3JzaGlwJTIwY29hY2hpbmd8ZW58MXx8fHwxNzYwMzUwMTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: Award,
      title: 'Become a Champion',
      description: 'Complete the Nightingale Programme and earn certification as a Neon Club Champion Mentor.',
      gradient: 'from-orange-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHRyb3BoeSUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYwMzUwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: Gift,
      title: 'Earn Rewards',
      description: 'Get reward points for every activity, course completion, and engagement. Redeem for exclusive benefits!',
      gradient: 'from-yellow-500 to-orange-600',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwcmV3YXJkcyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MDM1MDEyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: TrendingUp,
      title: 'Advance Your Career',
      description: 'Build your professional profile, track your growth, and unlock new opportunities in healthcare.',
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBncm93dGglMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjAzNTAxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback 
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 py-16">
          <div className="text-center w-full max-w-lg space-y-8">
            {/* Icon with glassmorphism */}
            <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl mx-auto">
              <Icon className="h-16 w-16 text-white drop-shadow-lg" />
            </div>

            <div className="space-y-6">
              <h1 className="text-white text-center mb-4 drop-shadow-lg">{slide.title}</h1>
              <p className="text-white/95 text-center text-lg leading-relaxed drop-shadow-md px-4">{slide.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-8 space-y-4 shadow-2xl">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext} 
          className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>
        
        {currentSlide < slides.length - 1 && (
          <Button 
            onClick={handleSkip} 
            variant="ghost" 
            className="w-full rounded-full h-12 text-gray-600 hover:text-gray-900"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
