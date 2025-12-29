import { ChevronLeft, Download, CheckCircle, Clock, IndianRupee, Calendar, Award, Video, BookOpen } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface OrderHistoryProps {
  onNavigate: (page: string) => void;
}

export function OrderHistory({ onNavigate }: OrderHistoryProps) {
  const orders = [
    {
      id: 'ORD-2024-10-001',
      type: 'mentor-session',
      title: 'Mentorship Session with Dr. Anjali Reddy',
      subtitle: 'Advanced Wound Care',
      date: '2024-10-16',
      time: '3:00 PM',
      amount: 1999,
      status: 'upcoming',
      points: 200,
      icon: Video,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      id: 'ORD-2024-10-002',
      type: 'course',
      title: 'Advanced Patient Care',
      subtitle: '8 weeks course',
      date: '2024-10-10',
      amount: 4999,
      status: 'completed',
      points: 500,
      icon: BookOpen,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      id: 'ORD-2024-09-003',
      type: 'workshop',
      title: 'Wound Care Management Workshop',
      subtitle: 'Live Workshop',
      date: '2024-09-28',
      amount: 1499,
      status: 'completed',
      points: 150,
      icon: Award,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      id: 'ORD-2024-09-004',
      type: 'event',
      title: 'Healthcare Summit 2024',
      subtitle: '3-Day Conference',
      date: '2024-09-15',
      amount: 2999,
      status: 'completed',
      points: 300,
      icon: Calendar,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      id: 'ORD-2024-09-005',
      type: 'mentor-session',
      title: 'Mentorship Session with Dr. Sunita Verma',
      subtitle: 'Critical Care',
      date: '2024-09-05',
      time: '2:00 PM',
      amount: 1999,
      status: 'completed',
      points: 200,
      icon: Video,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ];

  const upcomingOrders = orders.filter(o => o.status === 'upcoming');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalPoints = orders.reduce((sum, order) => sum + order.points, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('profile')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Order History</h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/90 mb-1">Total Spent</p>
            <p className="text-xl text-white flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              {totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/90 mb-1">Points Earned</p>
            <p className="text-xl text-white">{totalPoints}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          {/* All Orders */}
          <TabsContent value="all" className="space-y-3">
            {orders.map((order) => {
              const Icon = order.icon;
              return (
                <Card key={order.id} className="shadow-lg border-none">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-2xl ${order.iconBg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${order.iconColor}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm mb-1">{order.title}</h4>
                            <p className="text-xs text-gray-600">{order.subtitle}</p>
                          </div>
                          {order.status === 'upcoming' ? (
                            <Badge className="bg-green-100 text-green-700 border-none">
                              <Clock className="h-3 w-3 mr-1" />
                              Upcoming
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 border-none">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        <Separator className="my-2" />

                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {order.time && <span>• {order.time}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Order ID</p>
                            <p className="text-xs font-mono text-gray-900">{order.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Amount Paid</p>
                            <p className="flex items-center gap-1 text-gray-900">
                              <IndianRupee className="h-3 w-3" />
                              {order.amount}
                            </p>
                          </div>
                        </div>

                        {order.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3 rounded-full"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Upcoming Orders */}
          <TabsContent value="upcoming" className="space-y-3">
            {upcomingOrders.length > 0 ? (
              upcomingOrders.map((order) => {
                const Icon = order.icon;
                return (
                  <Card key={order.id} className="shadow-lg border-none border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-2xl ${order.iconBg} flex items-center justify-center`}>
                            <Icon className={`h-6 w-6 ${order.iconColor}`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">{order.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{order.subtitle}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {order.time && <span>• {order.time}</span>}
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-none">
                            <Clock className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Upcoming Orders</h3>
                <p className="text-gray-600 text-sm">You don't have any upcoming bookings</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Orders */}
          <TabsContent value="completed" className="space-y-3">
            {completedOrders.map((order) => {
              const Icon = order.icon;
              return (
                <Card key={order.id} className="shadow-lg border-none">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-2xl ${order.iconBg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${order.iconColor}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm mb-1">{order.title}</h4>
                            <p className="text-xs text-gray-600">{order.subtitle}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 border-none">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-gray-600">
                            +{order.points} points earned
                          </p>
                          <p className="text-xs flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {order.amount}
                          </p>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-full"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Invoice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
