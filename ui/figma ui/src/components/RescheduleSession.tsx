import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RescheduleSessionProps {
  onNavigate: (page: string) => void;
  sessionData?: any;
  onCelebrate?: (data: any) => void;
}

export function RescheduleSession({ onNavigate, sessionData, onCelebrate }: RescheduleSessionProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const session = sessionData || {
    mentor: 'Dr. Anjali Reddy',
    topic: 'Advanced Wound Care',
    currentDate: 'Oct 16, 2024',
    currentTime: '3:00 PM - 3:45 PM',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  const availableDates = [
    { date: '2024-10-17', day: 'Thu', dateNum: '17', month: 'Oct' },
    { date: '2024-10-18', day: 'Fri', dateNum: '18', month: 'Oct' },
    { date: '2024-10-19', day: 'Sat', dateNum: '19', month: 'Oct' },
    { date: '2024-10-21', day: 'Mon', dateNum: '21', month: 'Oct' },
    { date: '2024-10-22', day: 'Tue', dateNum: '22', month: 'Oct' },
  ];

  const timeSlots = {
    '2024-10-17': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: false },
    ],
    '2024-10-18': [
      { time: '11:00 AM - 11:45 AM', available: true },
      { time: '3:00 PM - 3:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '7:00 PM - 7:45 PM', available: false },
    ],
    '2024-10-19': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '11:00 AM - 11:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
    ],
    '2024-10-21': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '3:00 PM - 3:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
    '2024-10-22': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
    ],
  };

  const handleReschedule = () => {
    if (selectedDate && selectedSlot) {
      const selectedDateObj = availableDates.find(d => d.date === selectedDate);
      
      // Simulate rescheduling
      setTimeout(() => {
        if (onCelebrate) {
          onCelebrate({
            title: 'Session Rescheduled! ✅',
            message: `Your session has been moved to ${selectedDateObj?.day}, ${selectedDateObj?.dateNum} ${selectedDateObj?.month} at ${selectedSlot}`,
            icon: 'star'
          });
        }
        onNavigate('mentorship');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('mentorship')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Reschedule Session</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Current Session Info */}
        <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm mb-1 text-orange-900">Current Booking</h4>
                <p className="text-xs text-gray-600">You are rescheduling this session</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-orange-200">
                <ImageWithFallback
                  src={session.image}
                  alt={session.mentor}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="mb-1">{session.mentor}</h4>
                <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {session.currentDate}
                  </Badge>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {session.currentTime}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select New Date */}
        <div>
          <h3 className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Select New Date
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {availableDates.map((dateObj) => (
              <button
                key={dateObj.date}
                onClick={() => {
                  setSelectedDate(dateObj.date);
                  setSelectedSlot(null);
                }}
                className={`flex-shrink-0 w-20 p-3 rounded-2xl border-2 transition-all ${
                  selectedDate === dateObj.date
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200 bg-white'
                }`}
              >
                <p className={`text-xs mb-1 ${selectedDate === dateObj.date ? 'text-purple-600' : 'text-gray-500'}`}>
                  {dateObj.day}
                </p>
                <p className={`text-2xl mb-1 ${selectedDate === dateObj.date ? 'text-purple-600' : 'text-gray-900'}`}>
                  {dateObj.dateNum}
                </p>
                <p className={`text-xs ${selectedDate === dateObj.date ? 'text-purple-600' : 'text-gray-500'}`}>
                  {dateObj.month}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Select New Time Slot */}
        {selectedDate && (
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Select New Time
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots[selectedDate as keyof typeof timeSlots]?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot.available && setSelectedSlot(slot.time)}
                  disabled={!slot.available}
                  className={`p-4 rounded-2xl border-2 transition-all relative ${
                    selectedSlot === slot.time
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : slot.available
                      ? 'border-gray-200 hover:border-purple-200 bg-white'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {selectedSlot === slot.time && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <p className={`text-sm ${
                    selectedSlot === slot.time
                      ? 'text-purple-600 font-medium'
                      : slot.available
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {slot.time}
                  </p>
                  {!slot.available && (
                    <p className="text-xs text-gray-400 mt-1">Booked</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* New Schedule Summary */}
        {selectedDate && selectedSlot && (
          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="p-4">
              <h4 className="mb-3 text-green-900">New Schedule</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Date</span>
                  <span className="font-medium">
                    {availableDates.find(d => d.date === selectedDate)?.day}, {availableDates.find(d => d.date === selectedDate)?.dateNum} {availableDates.find(d => d.date === selectedDate)?.month}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Time</span>
                  <span className="font-medium">{selectedSlot}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onNavigate('mentorship')}
            variant="outline"
            className="flex-1 rounded-full h-12 border-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedSlot}
            className="flex-1 rounded-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg disabled:opacity-50"
          >
            Confirm Reschedule
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          No charges for rescheduling. You can reschedule up to 2 hours before the session.
        </p>
      </div>
    </div>
  );
}
