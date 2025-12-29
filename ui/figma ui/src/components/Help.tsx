import { ChevronLeft, Search, MessageCircle, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface HelpProps {
  onNavigate: (page: string) => void;
}

export function Help({ onNavigate }: HelpProps) {
  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, go to the Learning Modules section, browse available courses, and click "Enroll Now" on your desired course. You can start learning immediately after enrollment.',
    },
    {
      question: 'How do I book a mentorship session?',
      answer: 'Navigate to the Sessions tab, browse available mentors, and click "Book Session" on your chosen mentor\'s profile. You can then select a convenient time slot from their available schedule.',
    },
    {
      question: 'Can I reschedule a mentorship session?',
      answer: 'Yes, you can reschedule a session up to 24 hours before the scheduled time. Go to your upcoming sessions and click "Reschedule" to choose a new time slot.',
    },
    {
      question: 'How do I track my learning progress?',
      answer: 'Your progress is automatically tracked as you complete lessons. You can view your overall progress on the Dashboard and detailed course progress in the Learning Modules section.',
    },
    {
      question: 'What are badges and how do I earn them?',
      answer: 'Badges are achievements you earn by completing various activities like finishing courses, attending sessions, and completing tasks. Check the Achievements section to see all available badges and your progress.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'On the login screen, click "Forgot password?" and follow the instructions sent to your registered email address to reset your password.',
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Currently, all courses require an internet connection. We\'re working on adding offline access in future updates.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the contact options below. We typically respond within 24 hours during business days.',
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+91 1800-123-4567',
      action: 'Call Now',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@nurseconnect.in',
      action: 'Send Email',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => onNavigate('profile')}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2>Help & Support</h2>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="pl-10 rounded-xl h-12 bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Quick Help Banner */}
        <Card className="shadow-sm mb-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white">Need Quick Help?</h3>
                <p className="text-sm text-blue-100">We're here to assist you</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full rounded-full">
              Start Live Chat
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="mb-6">
          <h3 className="mb-4">Frequently Asked Questions</h3>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Options */}
        <div className="mb-6">
          <h3 className="mb-4">Contact Us</h3>
          <div className="space-y-3">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{option.title}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources */}
        <div>
          <h3 className="mb-4">Resources</h3>
          <div className="space-y-3">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <button className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>User Guide</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <button className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <span>Video Tutorials</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
