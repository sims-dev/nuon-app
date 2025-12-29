import { useEffect } from 'react';
import { NuonLogo } from './NuonLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const collaborators = [
    'Ozone Hospital',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-150"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <NuonLogo variant="white" showTagline={true} />
        </div>

        {/* Collaborators */}
        <div className="mt-16 animate-fade-in-delay">
          <p className="text-blue-100 text-sm mb-4">In collaboration with</p>
          <div className="space-y-2">
            {collaborators.map((collab, index) => (
              <div
                key={index}
                className="text-white text-sm opacity-80 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {collab}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        </div>
      </div>
    </div>
  );
}
