import { ChevronLeft, Calendar, Clock, MapPin, Video, Download, ExternalLink, CheckCircle, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorkshopViewerProps {
  onNavigate: (page: string, data?: any) => void;
  workshopData?: any;
}

export function WorkshopViewer({ onNavigate, workshopData }: WorkshopViewerProps) {
  const workshop = workshopData || {
    id: 1,
    title: 'Wound Care Management Workshop',
    instructor: 'Dr. Anjali Reddy',
    type: 'Live Workshop',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYwNDUzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2024-10-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Virtual (Zoom)',
    joinLink: 'https://zoom.us/j/123456789',
    status: 'upcoming',
    daysUntil: 4,
    duration: '3 hours',
  };

  const isRegistered = true;
  const isCompleted = workshop.status === 'completed';
  const isUpcoming = workshop.status === 'upcoming';
  const isVirtual = workshop.location.includes('Virtual');

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

      {/* Workshop Banner */}
      <div className="relative h-64">
        <ImageWithFallback
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className={`mb-3 border-none ${
            isCompleted ? 'bg-gray-500' : 'bg-orange-500'
          } text-white`}>
            {workshop.type}
          </Badge>
          <h1 className="text-white mb-2">{workshop.title}</h1>
          <p className="text-white/90 text-sm">with {workshop.instructor}</p>
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
                  {isCompleted ? 'You Attended This Workshop' : 'You are Registered!'}
                </h4>
                <p className="text-xs text-gray-600">
                  {isCompleted ? 'Workshop completed' : 'Your spot is confirmed'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Countdown for upcoming virtual workshops */}
        {isUpcoming && isVirtual && isRegistered && workshop.daysUntil && workshop.daysUntil <= 7 && (
          <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Workshop starts in</p>
                <p className="text-3xl text-orange-600 mb-3">{workshop.daysUntil} days</p>
                {workshop.joinLink && (
                  <Button 
                    onClick={() => window.open(workshop.joinLink, '_blank')}
                    className="w-full rounded-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Workshop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workshop Details */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Workshop Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(workshop.date).toLocaleDateString('en-IN', { 
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
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time & Duration</p>
                  <p className="font-medium">{workshop.time}</p>
                  <p className="text-sm text-gray-600">{workshop.duration}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                {isVirtual ? (
                  <Video className="h-5 w-5 text-orange-600 mt-0.5" />
                ) : (
                  <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{workshop.location}</p>
                  {isVirtual && workshop.joinLink && isRegistered && (
                    <button 
                      onClick={() => window.open(workshop.joinLink, '_blank')}
                      className="text-sm text-blue-600 hover:underline mt-1 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Join link
                    </button>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-medium">{workshop.instructor}</p>
                  <p className="text-sm text-gray-600">15+ years experience</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Workshop */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-3">About This Workshop</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Join this comprehensive hands-on workshop to master advanced wound care management techniques. 
              Learn evidence-based practices for assessment, treatment, and documentation of various wound types.
            </p>
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="text-sm mb-3 text-orange-900">What You'll Learn</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Comprehensive wound assessment techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Modern dressing selection and application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Infection prevention and management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Documentation best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Case studies and practical demonstrations</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        {isRegistered && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4">Workshop Materials</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <span className="text-sm">Pre-workshop Reading Material</span>
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <span className="text-sm">Workshop Handout</span>
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {isUpcoming && isRegistered && isVirtual && workshop.joinLink && (
          <div className="space-y-3">
            <Button 
              onClick={() => window.open(workshop.joinLink, '_blank')}
              className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-orange-600 to-red-600"
            >
              <Video className="mr-2 h-5 w-5" />
              Join Workshop
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

        {isUpcoming && isRegistered && !isVirtual && (
          <div className="space-y-3">
            <Button 
              onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(workshop.location), '_blank')}
              className="w-full rounded-full h-12 bg-gradient-to-r from-orange-600 to-red-600"
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
            Download Completion Certificate
          </Button>
        )}

        {!isRegistered && (
          <Button 
            onClick={() => onNavigate('payment', {
              type: 'workshop',
              data: {
                title: workshop.title,
                price: 1499,
                points: 150
              }
            })}
            className="w-full rounded-full h-14 text-lg bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Register Now - ₹1499
          </Button>
        )}

        {/* Requirements */}
        {isUpcoming && isRegistered && (
          <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <h4 className="text-blue-900 mb-2">
                {isVirtual ? 'Technical Requirements' : 'What to Bring'}
              </h4>
              {isVirtual ? (
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Stable internet connection</li>
                  <li>• Zoom app installed (latest version)</li>
                  <li>• Webcam and microphone enabled</li>
                  <li>• Quiet space for learning</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Notebook and pen</li>
                  <li>• Valid ID for registration</li>
                  <li>• Comfortable clothing</li>
                  <li>• Water bottle</li>
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
