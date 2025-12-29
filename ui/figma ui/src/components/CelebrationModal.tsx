import { useEffect, useState } from 'react';
import { Sparkles, Award, Gift, Star } from 'lucide-react';
import { Button } from './ui/button';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: 'award' | 'gift' | 'star';
}

export function CelebrationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  icon = 'award' 
}: CelebrationModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#FBBF24'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(newConfetti);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const IconComponent = icon === 'gift' ? Gift : icon === 'star' ? Star : Award;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10%',
            animationDelay: `${piece.delay}s`,
            backgroundColor: piece.color,
          }}
        />
      ))}

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-fade-in">
        {/* Animated Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl animate-pulse-neon">
            <IconComponent className="h-12 w-12 text-white" />
          </div>
          {/* Sparkles around icon */}
          <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-sparkle" />
          <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-pink-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>

        <h2 className="text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <Button 
          onClick={onClose}
          className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
}
