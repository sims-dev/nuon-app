import { ChevronLeft, Calendar, Clock, MapPin, Users, Download, ExternalLink, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventViewerProps {
  onNavigate: (page: string, data?: any) => void;
  eventData?: any;
}

export function EventViewer({ onNavigate, eventData }: EventViewerProps) {
  const event = eventData || {
    id: 1,
    title: 'Healthcare Summit 2024',
    type: 'Conference',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NjA0NTM2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2024-10-18',
    time: '9:00 AM - 5:00 PM',
    location: 'India Expo Centre, Delhi',
    venue: 'Hall 5, India Expo Centre',
    status: 'upcoming',
    daysUntil: 2,
    hasJoinLink: false,
  };

  const isRegistered = true; // User is already registered
  const isCompleted = event.status === 'completed';
  const isUpcoming = event.status === 'upcoming';

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

      {/* Event Banner */}
      <div className="relative h-64">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className={`mb-3 border-none ${
            isCompleted ? 'bg-gray-500' : 'bg-purple-500'
          } text-white`}>
            {event.type}
          </Badge>
          <h1 className="text-white mb-2">{event.title}</h1>
          {isUpcoming && event.daysUntil && (
            <p className="text-white/90 text-sm">Starting in {event.daysUntil} days</p>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Registration Status */}
        {isRegistered && (
          <Card className={`shadow-lg border-2 ${
            isCompleted 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
          }`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-gray-200' : 'bg-green-500'
              }`}>
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={isCompleted ? 'text-gray-900' : 'text-green-900'}>
                  {isCompleted ? 'You Attended This Event' : 'You are Registered!'}
                </h4>
                <p className="text-xs text-gray-600">
                  {isCompleted ? 'Event completed' : 'Your spot is confirmed'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Details */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString('en-IN', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-medium">{event.location}</p>
                  {event.venue && (
                    <p className="text-sm text-gray-600 mt-1">{event.venue}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Event */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-3">About This Event</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Join us for the most anticipated healthcare summit of the year! Connect with leading healthcare professionals, 
              discover innovative technologies, and learn about the latest trends in patient care and nursing excellence.
            </p>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="text-sm mb-3 text-purple-900">What to Expect</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Keynote speeches from industry leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Interactive panel discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Networking opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Exhibition of latest healthcare technologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Certificate of attendance</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {isUpcoming && isRegistered && (
          <div className="space-y-3">
            <Button 
              onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(event.location), '_blank')}
              className="w-full rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
            <Button 
              variant="outline"
              className="w-full rounded-full h-12 border-2"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </div>
        )}

        {isCompleted && (
          <Button 
            className="w-full rounded-full h-12 bg-gradient-to-r from-green-600 to-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Attendance Certificate
          </Button>
        )}

        {!isRegistered && (
          <Button 
            onClick={() => onNavigate('payment', {
              type: 'event',
              data: {
                title: event.title,
                price: 2999,
                points: 300
              }
            })}
            className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Register Now - ₹2999
          </Button>
        )}

        {/* Important Info */}
        {isUpcoming && isRegistered && (
          <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <h4 className="text-blue-900 mb-2">Important Information</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• Please arrive 30 minutes before the event starts</li>
                <li>• Bring a valid ID for registration</li>
                <li>• Dress code: Business casual</li>
                <li>• Lunch and refreshments will be provided</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
