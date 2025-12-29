import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SessionFeedbackProps {
  onNavigate: (page: string) => void;
  sessionData?: any;
  onCelebrate?: (data: any) => void;
}

export function SessionFeedback({ onNavigate, sessionData, onCelebrate }: SessionFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);

  const session = sessionData || {
    mentor: 'Dr. Anjali Reddy',
    topic: 'Advanced Wound Care',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  const qualities = [
    'Knowledgeable',
    'Patient',
    'Clear Communication',
    'Engaging',
    'Well Prepared',
    'Supportive',
    'Experienced',
    'Helpful',
  ];

  const toggleQuality = (quality: string) => {
    if (selectedQualities.includes(quality)) {
      setSelectedQualities(selectedQualities.filter(q => q !== quality));
    } else {
      setSelectedQualities([...selectedQualities, quality]);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please rate the session before submitting');
      return;
    }

    // Submit feedback
    setTimeout(() => {
      if (onCelebrate) {
        onCelebrate({
          title: 'Thank You! 🙏',
          message: 'Your feedback helps us improve. You earned 50 bonus points!',
          points: 50,
          icon: 'gift'
        });
      }
      onNavigate('mentorship');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-white mb-2">Session Complete!</h2>
          <p className="text-white/90 text-sm">How was your experience?</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Mentor Info */}
        <Card className="shadow-lg border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-purple-200">
                <ImageWithFallback
                  src={session.image}
                  alt={session.mentor}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{session.mentor}</h3>
                <p className="text-sm text-gray-600">{session.topic}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Star Rating */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4 text-center">Rate Your Session</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </CardContent>
        </Card>

        {/* Qualities */}
        {rating > 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4">What did you like? (Optional)</h3>
              <div className="flex flex-wrap gap-2">
                {qualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => toggleQuality(quality)}
                    className="transition-all"
                  >
                    <Badge
                      className={`cursor-pointer ${
                        selectedQualities.includes(quality)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      {selectedQualities.includes(quality) && (
                        <ThumbsUp className="h-3 w-3 mr-1" />
                      )}
                      {quality}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Written Feedback */}
        {rating > 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Additional Comments (Optional)
              </h3>
              <Textarea
                placeholder="Share your thoughts about the session..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your feedback helps improve the quality of mentorship sessions
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bonus Points */}
        {rating > 0 && (
          <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-green-900 mb-1">Earn Bonus Points!</h4>
                <p className="text-xs text-gray-600">
                  Submit your feedback and get 50 bonus points
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg disabled:opacity-50"
          >
            <Send className="mr-2 h-5 w-5" />
            Submit Feedback
          </Button>

          <Button
            onClick={() => onNavigate('mentorship')}
            variant="outline"
            className="w-full rounded-full h-12 border-2"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
}
