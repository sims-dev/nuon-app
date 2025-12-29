import { useState, useEffect } from 'react';
import { ChevronLeft, Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Users, Clock, Camera } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VideoSessionProps {
  onNavigate: (page: string) => void;
  sessionData?: any;
  onCelebrate?: (data: any) => void;
}

export function VideoSession({ onNavigate, sessionData, onCelebrate }: VideoSessionProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const session = sessionData || {
    mentor: 'Dr. Anjali Reddy',
    topic: 'Advanced Wound Care',
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    // Navigate to feedback page instead of directly to mentorship
    onNavigate('session-feedback', session);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleEndSession}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h3 className="text-white text-sm">{session.topic}</h3>
            <p className="text-gray-400 text-xs">with {session.mentor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-white text-sm">{formatTime(sessionTime)}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-gray-900 p-4">
        {/* Main Video (Mentor) */}
        <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-gray-800">
          <ImageWithFallback
            src={session.image}
            alt={session.mentor}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {/* Mentor Name Overlay */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/30">
              <Video className="h-3 w-3 mr-1" />
              {session.mentor}
            </Badge>
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-none">
              <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
              Connected
            </Badge>
          </div>
        </div>

        {/* Self Video (Picture-in-Picture) */}
        <div className="absolute bottom-8 right-8 w-32 h-40 rounded-xl overflow-hidden bg-gray-800 border-2 border-white/20 shadow-2xl">
          {isVideoOn ? (
            <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-gray-800 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">P</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-xs">
                  You
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-6">
        <div className="flex items-center justify-center gap-4">
          {/* Mic Toggle */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMicOn 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isMicOn ? (
              <Mic className="h-6 w-6 text-white" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOn 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6 text-white" />
            ) : (
              <VideoOff className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </button>

          {/* Switch Camera */}
          <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all">
            <Camera className="h-6 w-6 text-white" />
          </button>

          {/* End Call */}
          <button
            onClick={handleEndSession}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg"
          >
            <Phone className="h-6 w-6 text-white rotate-135" />
          </button>
        </div>

        {/* Session Info */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>2 participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{session.duration} session</span>
          </div>
        </div>
      </div>

      {/* Chat Sidebar (if shown) */}
      {showChat && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white">Chat</h3>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{session.mentor}</p>
                <p className="text-sm text-white">Welcome! Let's start the session.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
