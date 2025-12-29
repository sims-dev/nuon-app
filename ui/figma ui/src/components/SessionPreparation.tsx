import { useState, useEffect } from 'react';
import { ChevronLeft, Video, Mic, Camera, Check, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SessionPreparationProps {
  onNavigate: (page: string, data?: any) => void;
  sessionData?: any;
}

export function SessionPreparation({ onNavigate, sessionData }: SessionPreparationProps) {
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [timeUntilSession, setTimeUntilSession] = useState(120); // 2 minutes countdown

  const session = sessionData || {
    mentor: 'Dr. Anjali Reddy',
    topic: 'Advanced Wound Care',
    date: 'Tomorrow',
    time: '3:00 PM',
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  useEffect(() => {
    // Simulate permission checks
    const checkPermissions = async () => {
      setTimeout(() => setMicPermission(true), 500);
      setTimeout(() => setCameraPermission(true), 1000);
    };
    checkPermissions();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeUntilSession(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allPermissionsGranted = micPermission && cameraPermission;
  const canJoin = timeUntilSession <= 300; // Can join 5 minutes before

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('mentorship')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Join Session</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Session Info Card */}
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-xl">
                <Video className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-2">{session.topic}</h3>
              <p className="text-gray-600">with {session.mentor}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>{session.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Timer */}
        {canJoin && (
          <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Session starts in</p>
              <p className="text-4xl text-green-600 mb-2">{formatCountdown(timeUntilSession)}</p>
              <Badge className="bg-green-500 text-white">Ready to Join</Badge>
            </CardContent>
          </Card>
        )}

        {/* System Check */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">System Check</h3>
            <div className="space-y-3">
              {/* Microphone */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    micPermission === true ? 'bg-green-100' : micPermission === false ? 'bg-red-100' : 'bg-gray-200'
                  }`}>
                    <Mic className={`h-5 w-5 ${
                      micPermission === true ? 'text-green-600' : micPermission === false ? 'text-red-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Microphone</p>
                    <p className="text-xs text-gray-600">
                      {micPermission === true ? 'Working' : micPermission === false ? 'Not accessible' : 'Checking...'}
                    </p>
                  </div>
                </div>
                {micPermission === true && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {micPermission === false && (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              {/* Camera */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    cameraPermission === true ? 'bg-green-100' : cameraPermission === false ? 'bg-red-100' : 'bg-gray-200'
                  }`}>
                    <Camera className={`h-5 w-5 ${
                      cameraPermission === true ? 'text-green-600' : cameraPermission === false ? 'text-red-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Camera</p>
                    <p className="text-xs text-gray-600">
                      {cameraPermission === true ? 'Working' : cameraPermission === false ? 'Not accessible' : 'Checking...'}
                    </p>
                  </div>
                </div>
                {cameraPermission === true && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {cameraPermission === false && (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              {/* Internet Connection */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-green-600 rounded"></div>
                      <div className="w-1 h-4 bg-green-600 rounded"></div>
                      <div className="w-1 h-5 bg-green-600 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Internet</p>
                    <p className="text-xs text-gray-600">Strong connection</p>
                  </div>
                </div>
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <h4 className="mb-3 text-blue-900">Session Tips</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Find a quiet space with good lighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Keep your camera at eye level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Have your questions ready</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Test your audio before joining</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('video-session', session)}
            disabled={!allPermissionsGranted || !canJoin}
            className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video className="mr-2 h-5 w-5" />
            {canJoin ? 'Join Session Now' : 'Session Not Started Yet'}
          </Button>

          <Button
            onClick={() => onNavigate('mentorship')}
            variant="outline"
            className="w-full rounded-full h-12 border-2"
          >
            Back to Sessions
          </Button>
        </div>

        {!allPermissionsGranted && (
          <p className="text-xs text-center text-red-600">
            ⚠️ Please allow camera and microphone access to join the session
          </p>
        )}
      </div>
    </div>
  );
}
