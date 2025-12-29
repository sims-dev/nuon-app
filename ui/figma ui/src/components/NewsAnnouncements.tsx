import { useState } from 'react';
import { ChevronLeft, Calendar, Filter, Play, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface NewsAnnouncementsProps {
  onNavigate: (page: string) => void;
}

export function NewsAnnouncements({ onNavigate }: NewsAnnouncementsProps) {
  const [filterDate, setFilterDate] = useState('all');

  const newsItems = [
    {
      id: 1,
      type: 'video',
      title: 'New Healthcare Guidelines 2024',
      description: 'Updated protocols for patient care and safety standards',
      date: 'Oct 15, 2024',
      category: 'Guidelines',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbmV3cyUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '5 min',
    },
    {
      id: 2,
      type: 'article',
      title: 'Breakthrough in Nursing Education',
      description: 'Revolutionary training methods adopted across partner hospitals',
      date: 'Oct 12, 2024',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uZmVyZW5jZSUyMHVwZGF0ZXxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '8 min',
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Neon Club Expansion Announcement',
      description: 'Now partnering with 50+ healthcare institutions nationwide',
      date: 'Oct 10, 2024',
      category: 'Announcement',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NjA0Mjg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '3 min',
    },
    {
      id: 4,
      type: 'article',
      title: 'Champion Mentors Making Impact',
      description: 'Success stories from our certified Nightingale mentors',
      date: 'Oct 8, 2024',
      category: 'Success Stories',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwYWNoaWV2ZW1lbnQlMjBhd2FyZHxlbnwxfHx8fDE3NjA0Mjg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '6 min',
    },
    {
      id: 5,
      type: 'video',
      title: 'Virtual Workshop Series Launch',
      description: 'Free monthly workshops on advanced nursing topics',
      date: 'Oct 5, 2024',
      category: 'Workshops',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbmV3cyUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '12 min',
    },
    {
      id: 6,
      type: 'article',
      title: 'Mental Health Support for Nurses',
      description: 'New wellness programme launched for healthcare workers',
      date: 'Oct 1, 2024',
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uZmVyZW5jZSUyMHVwZGF0ZXxlbnwxfHx8fDE3NjA0Mjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '7 min',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'article':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-purple-100 text-purple-700';
    }
  };

  const filteredNews = filterDate === 'all' 
    ? newsItems 
    : newsItems.filter(item => {
        const itemDate = new Date(item.date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filterDate === 'week') return diffDays <= 7;
        if (filterDate === 'month') return diffDays <= 30;
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">News & Announcements</h2>
        </div>
        <p className="text-white/90 text-sm">Stay updated with latest healthcare insights</p>
      </div>

      {/* Filter Section */}
      <div className="px-6 py-4 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-[180px] rounded-xl border-2">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 ml-auto">{filteredNews.length} articles</span>
        </div>
      </div>

      {/* News Grid */}
      <div className="px-6 py-6 space-y-4">
        {filteredNews.map((item) => (
          <Card 
            key={item.id} 
            className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all cursor-pointer"
          >
            <CardContent className="p-0">
              <div className="flex gap-0">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-purple-600 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge className={`${getTypeColor(item.type)} border-none text-xs`}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <h3 className="text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span>{item.readTime} read</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
