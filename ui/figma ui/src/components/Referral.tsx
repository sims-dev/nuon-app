import { useState } from 'react';
import { ChevronLeft, Copy, Share2, Gift, Users, CheckCircle, IndianRupee, Facebook, Twitter, MessageCircle, Mail } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ReferralProps {
  onNavigate: (page: string) => void;
}

export function Referral({ onNavigate }: ReferralProps) {
  const [copied, setCopied] = useState(false);
  const referralCode = 'PRIYA2024';
  const referralLink = 'https://neonclub.app/join/PRIYA2024';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    discountsEarned: 2400,
    pendingDiscounts: 600,
  };

  const referralHistory = [
    {
      name: 'Anjali K.',
      status: 'active',
      date: '2024-10-10',
      discount: 200,
    },
    {
      name: 'Rahul M.',
      status: 'active',
      date: '2024-10-08',
      discount: 200,
    },
    {
      name: 'Neha S.',
      status: 'pending',
      date: '2024-10-15',
      discount: 200,
    },
    {
      name: 'Vikram P.',
      status: 'active',
      date: '2024-09-28',
      points: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('profile')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-white">Refer & Earn</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <Users className="h-5 w-5 text-white mb-2" />
            <p className="text-xs text-white/90 mb-1">Total Referrals</p>
            <p className="text-2xl text-white">{referralStats.totalReferrals}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <Gift className="h-5 w-5 text-white mb-2" />
            <p className="text-xs text-white/90 mb-1">Points Earned</p>
            <p className="text-2xl text-white">{referralStats.pointsEarned}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* How it Works */}
        <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <h3 className="mb-4 text-green-900">How Referral Works</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Share Your Code</p>
                  <p className="text-xs text-gray-600">Send your unique referral code to friends</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Friend Signs Up</p>
                  <p className="text-xs text-gray-600">They join using your code and get 100 bonus points</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Both Earn Rewards</p>
                  <p className="text-xs text-gray-600">You get 200 points when they complete their first purchase</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Code */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Your Referral Code</h3>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
              <p className="text-center text-3xl tracking-widest mb-2 text-purple-900">{referralCode}</p>
              <Button 
                onClick={() => handleCopy(referralCode)}
                variant="outline" 
                className="w-full rounded-full"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm mb-2 text-gray-600">Or share your referral link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
                <Button 
                  onClick={() => handleCopy(referralLink)}
                  variant="outline"
                  className="rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Options */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-4">Share via</h3>
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs">Facebook</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <Twitter className="h-6 w-6 text-sky-600" />
                </div>
                <span className="text-xs">Twitter</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-xs">Email</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Referral History</h3>
              <Badge className="bg-purple-100 text-purple-700 border-none">
                {referralStats.totalReferrals} referrals
              </Badge>
            </div>
            
            <div className="space-y-3">
              {referralHistory.map((referral, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{referral.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(referral.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {referral.status === 'active' ? (
                        <>
                          <Badge className="bg-green-100 text-green-700 border-none mb-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                          <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                            +{referral.points} pts
                          </p>
                        </>
                      ) : (
                        <>
                          <Badge className="bg-orange-100 text-orange-700 border-none mb-1">
                            Pending
                          </Badge>
                          <p className="text-xs text-gray-600">
                            Awaiting purchase
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {index < referralHistory.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Rewards */}
        {referralStats.pendingPoints > 0 && (
          <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="mb-1 text-orange-900">Pending Rewards</h4>
                  <p className="text-xs text-gray-600">
                    {referralStats.totalReferrals - referralStats.activeReferrals} friends haven't made their first purchase yet
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-orange-600">{referralStats.pendingPoints}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
