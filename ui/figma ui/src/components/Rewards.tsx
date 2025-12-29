import { useState } from 'react';
import { ChevronLeft, Trophy, Gift, Star, Zap, Award, Target, Lock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface RewardsProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Rewards({ onNavigate }: RewardsProps) {
  const [totalPoints, setTotalPoints] = useState(2450);
  const currentLevel = 'Silver';
  const nextLevel = 'Gold';
  const pointsToNextLevel = 550;

  const rewardsHistory = [
    {
      id: 1,
      title: 'Course Completed',
      description: 'Advanced Wound Care Management',
      points: 200,
      date: 'Nov 25, 2024',
      icon: 'trophy',
    },
    {
      id: 2,
      title: 'Mentorship Session',
      description: 'Session with Dr. Anjali Reddy',
      points: 150,
      date: 'Nov 20, 2024',
      icon: 'star',
    },
    {
      id: 3,
      title: 'Profile Completed',
      description: 'Added all professional details',
      points: 100,
      date: 'Nov 15, 2024',
      icon: 'award',
    },
  ];

  const availableRewards = [
    {
      id: 1,
      title: 'Free Course Access',
      description: 'Unlock any course worth ₹1,999',
      points: 1000,
      icon: 'gift',
      available: true,
    },
    {
      id: 2,
      title: 'Mentor Session Discount',
      description: '50% off on next mentorship session',
      points: 800,
      icon: 'star',
      available: true,
    },
    {
      id: 3,
      title: 'Premium Badge',
      description: 'Get NUON Premium badge on profile',
      points: 1500,
      icon: 'award',
      available: true,
    },
    {
      id: 4,
      title: 'Exclusive Workshop',
      description: 'Free access to premium workshop',
      points: 2000,
      icon: 'zap',
      available: true,
    },
    {
      id: 5,
      title: 'Certificate Bundle',
      description: 'Three free certifications',
      points: 3000,
      icon: 'trophy',
      available: false,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Early Adopter',
      description: 'Joined NUON in first month',
      unlocked: true,
      icon: 'star',
    },
    {
      id: 2,
      title: 'Knowledge Seeker',
      description: 'Complete 5 courses',
      progress: 2,
      total: 5,
      unlocked: false,
      icon: 'trophy',
    },
    {
      id: 3,
      title: 'Mentor Connect',
      description: 'Attend 10 mentorship sessions',
      progress: 3,
      total: 10,
      unlocked: false,
      icon: 'target',
    },
    {
      id: 4,
      title: 'Community Champion',
      description: 'Participate in 20 discussions',
      progress: 0,
      total: 20,
      unlocked: false,
      icon: 'award',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white px-6 pt-12 pb-32 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Rewards</h2>
        </div>
      </div>

      {/* Points Card - Overlapping */}
      <div className="px-6 -mt-24 mb-6">
        <Card className="shadow-2xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <p className="text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {totalPoints}
                </p>
              </div>
              <p className="text-gray-600">Total Points Earned</p>
            </div>

            {/* Level Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-400 border-none">
                    {currentLevel}
                  </Badge>
                  <span className="text-gray-600">→</span>
                  <Badge className="bg-yellow-500 border-none">
                    {nextLevel}
                  </Badge>
                </div>
                <span className="text-gray-600">{pointsToNextLevel} points to go</span>
              </div>
              <Progress 
                value={(totalPoints / (totalPoints + pointsToNextLevel)) * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs defaultValue="redeem" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Redeem Tab */}
          <TabsContent value="redeem" className="space-y-4">
            <div className="mb-4">
              <h3 className="mb-1">Available Rewards</h3>
              <p className="text-sm text-gray-600">
                Use your points to unlock exclusive benefits
              </p>
            </div>

            {availableRewards.map((reward) => {
              const canAfford = totalPoints >= reward.points;
              return (
                <Card
                  key={reward.id}
                  className={`${
                    !reward.available
                      ? 'opacity-50'
                      : canAfford
                      ? 'border-2 border-yellow-200'
                      : ''
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                        {reward.icon === 'gift' && <Gift className="h-6 w-6 text-white" />}
                        {reward.icon === 'star' && <Star className="h-6 w-6 text-white" />}
                        {reward.icon === 'award' && <Award className="h-6 w-6 text-white" />}
                        {reward.icon === 'zap' && <Zap className="h-6 w-6 text-white" />}
                        {reward.icon === 'trophy' && <Trophy className="h-6 w-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4>{reward.title}</h4>
                          {!reward.available && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {reward.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-600">
                              {reward.points} points
                            </span>
                          </div>
                          {reward.available && (
                            <Button
                              size="sm"
                              disabled={!canAfford}
                              className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                            >
                              {canAfford ? 'Redeem' : 'Not enough points'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="mb-4">
              <h3 className="mb-1">Your Achievements</h3>
              <p className="text-sm text-gray-600">
                Complete challenges to unlock badges
              </p>
            </div>

            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={achievement.unlocked ? 'border-2 border-yellow-200' : 'opacity-75'}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                          : 'bg-gray-200'
                      }`}
                    >
                      {achievement.unlocked ? (
                        <>
                          {achievement.icon === 'star' && <Star className="h-6 w-6 text-white" />}
                          {achievement.icon === 'trophy' && <Trophy className="h-6 w-6 text-white" />}
                          {achievement.icon === 'target' && <Target className="h-6 w-6 text-white" />}
                          {achievement.icon === 'award' && <Award className="h-6 w-6 text-white" />}
                        </>
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4>{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge className="bg-yellow-500 border-none">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              {achievement.progress} / {achievement.total}
                            </span>
                            <span>
                              {Math.round((achievement.progress / achievement.total) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(achievement.progress / achievement.total) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="mb-4">
              <h3 className="mb-1">Points History</h3>
              <p className="text-sm text-gray-600">
                Track how you've earned your points
              </p>
            </div>

            {rewardsHistory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                      {item.icon === 'trophy' && <Trophy className="h-5 w-5 text-white" />}
                      {item.icon === 'star' && <Star className="h-5 w-5 text-white" />}
                      {item.icon === 'award' && <Award className="h-5 w-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="text-sm mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="flex items-center gap-1 text-green-600 mb-1">
                            <span className="text-lg">+{item.points}</span>
                          </div>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <p className="text-center text-sm text-gray-500 py-4">
              Showing recent activity
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
