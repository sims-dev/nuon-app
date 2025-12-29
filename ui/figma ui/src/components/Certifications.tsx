import { useState } from 'react';
import { ChevronLeft, Download, GraduationCap, Award, FileCheck, Share2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CertificationsProps {
  onNavigate: (page: string) => void;
}

export function Certifications({ onNavigate }: CertificationsProps) {
  const certifications = [
    {
      id: 1,
      title: 'B.Sc Nursing',
      institution: 'University of Delhi',
      year: '2015',
      type: 'Degree',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwZGVncmVlJTIwY2VydGlmaWNhdGV8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 2,
      title: 'Critical Care Certification',
      institution: 'Indian Nursing Council',
      year: '2018',
      type: 'Certification',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMG1lZGljYWx8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 3,
      title: 'Advanced Cardiac Life Support',
      institution: 'ACLS India',
      year: '2020',
      type: 'Certification',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2VydGlmaWNhdGlvbnxlbnwxfHx8fDE3NjA0Mjg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      title: 'Excellence in Patient Care',
      institution: 'Apollo Hospitals',
      year: '2023',
      type: 'Award',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMGF3YXJkJTIwdHJvcGh5fGVufDF8fHx8MTc2MDQyODY1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 5,
      title: 'Outstanding Nurse Award',
      institution: 'Delhi Nurses Association',
      year: '2022',
      type: 'Award',
      image: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeSUyMGdvbGR8ZW58MXx8fHwxNzYwNDI4NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 6,
      title: 'Infection Control Specialist',
      institution: 'National Healthcare Institute',
      year: '2021',
      type: 'Certification',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMG1lZGljYWx8ZW58MXx8fHwxNzYwNDI4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const handleDownload = (certId: number, title: string) => {
    // Simulate download
    console.log(`Downloading certificate: ${title}`);
    // In a real app, this would trigger a file download
  };

  const handleShare = (certId: number, title: string) => {
    // Simulate share functionality
    console.log(`Sharing certificate: ${title}`);
    // In a real app, this would open share dialog
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Degree':
        return GraduationCap;
      case 'Award':
        return Award;
      default:
        return FileCheck;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => onNavigate('profile')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Certifications & Awards</h2>
        </div>
        <p className="text-white/90 text-sm ml-14">Your professional credentials</p>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="shadow-md border-none bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xl mb-1 text-purple-600">1</p>
              <p className="text-xs text-gray-600">Degree</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-none bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xl mb-1 text-blue-600">3</p>
              <p className="text-xs text-gray-600">Certifications</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-none bg-gradient-to-br from-yellow-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xl mb-1 text-orange-600">2</p>
              <p className="text-xs text-gray-600">Awards</p>
            </CardContent>
          </Card>
        </div>

        {/* Certifications List */}
        <div className="space-y-4">
          {certifications.map((cert) => {
            const IconComponent = getIcon(cert.type);
            
            return (
              <Card key={cert.id} className="shadow-lg border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Certificate Image */}
                    <div className="w-24 h-32 flex-shrink-0 relative rounded-xl overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className={`absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="flex-1">
                      <Badge className="mb-2 text-xs bg-purple-100 text-purple-700 border-none">
                        {cert.type}
                      </Badge>
                      <h4 className="mb-1 line-clamp-2">{cert.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{cert.institution}</p>
                      <p className="text-xs text-gray-500 mb-3">Issued: {cert.year}</p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(cert.id, cert.title)}
                          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-8"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(cert.id, cert.title)}
                          className="rounded-full border-2 text-xs h-8"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
