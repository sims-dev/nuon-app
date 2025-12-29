import { AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ProfileCompletionPromptProps {
  onComplete: () => void;
  onCancel?: () => void;
  feature?: string;
}

export function ProfileCompletionPrompt({ 
  onComplete, 
  onCancel, 
  feature = 'this service' 
}: ProfileCompletionPromptProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Complete Your Profile</h3>
            <p className="text-gray-600">
              Please complete your professional information to book {feature}. This helps us provide you with the best experience.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">Missing information:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Current Workplace</li>
              <li>• Nursing Registration Number</li>
              <li>• Highest Qualification</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onComplete}
              className="w-full rounded-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Complete Profile Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            {onCancel && (
              <Button 
                onClick={onCancel}
                variant="ghost"
                className="w-full rounded-full h-12"
              >
                Maybe Later
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
