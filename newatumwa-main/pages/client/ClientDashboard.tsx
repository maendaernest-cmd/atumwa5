import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { ClientHeroVideo } from '../../components/dashboard/ClientHeroVideo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/StatCard';
import { usePWA } from '../../hooks/usePWA';
import {
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ListBulletIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  MicrophoneIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Mic, Sparkles, TrendingUp, Star, Bell, Zap, Activity, MessageSquare, MapPin, Users, Award, Target, Gift, Shield, HelpCircle, Cloud, CloudRain, Sun, Thermometer, Navigation, Search, Crown, AlertTriangle, Phone, Camera, DollarSign, Check, X, AlertCircle, Info } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { gigs } = useData();
  const navigate = useNavigate();
  const { isOffline } = usePWA();
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny', icon: Sun });
  const [loyaltyPoints, setLoyaltyPoints] = useState(450);
  const [nextReward, setNextReward] = useState(550);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Calculate stats from real data
  const clientGigs = gigs.filter(g => g.postedBy.id === user?.id);
  const activeGigs = clientGigs.filter(g => g.status === 'in-progress' || g.status === 'open').length;
  const completedGigs = clientGigs.filter(g => g.status === 'completed' || g.status === 'verified').length;
  const totalSpent = clientGigs
    .filter(g => g.status === 'completed' || g.status === 'verified')
    .reduce((sum, gig) => sum + gig.price, 0);

  // Mock activity feed data
  const activityFeed = [
    { id: 1, type: 'gig_assigned', message: 'Messenger John assigned to your grocery delivery', time: '2 min ago', icon: Users },
    { id: 2, type: 'gig_completed', message: 'Pharmacy pickup completed successfully', time: '15 min ago', icon: CheckCircleIcon },
    { id: 3, type: 'notification', message: 'New messenger available in your area', time: '1 hour ago', icon: Bell },
    { id: 4, type: 'promotion', message: 'Earn 10% bonus on your next 3 errands', time: '2 hours ago', icon: Gift },
  ];

  // Calculate smart insights from user data
  const pendingReviews = clientGigs.filter(g => g.status === 'completed' && !g.clientRating).length;
  const profileCompletion = user?.isVerified ? 100 : 75; // Mock calculation
  const weeklySavings = Math.round(totalSpent * 0.15); // Estimate savings
  const isNewUser = completedGigs < 3;

  // Smart Action Cards - Dynamic based on user behavior
  const smartActions = [
    pendingReviews > 0 && {
      id: 'reviews',
      title: 'Complete Reviews',
      description: `Rate ${pendingReviews} recent delivery${pendingReviews > 1 ? 'ies' : 'y'} to help messengers improve`,
      icon: Star,
      action: 'Review Now',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
      priority: 'high'
    },
    profileCompletion < 100 && {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add verification details to unlock faster matching and better rates',
      icon: UserIcon,
      action: 'Complete Now',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      priority: 'medium'
    },
    !isNewUser && {
      id: 'bulk',
      title: 'Bulk Order Discount',
      description: `Save $${weeklySavings} with weekly grocery delivery subscription`,
      icon: TrendingUp,
      action: 'Set Up Plan',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      priority: 'medium'
    },
    weather.condition === 'rainy' && {
      id: 'weather',
      title: 'Weather Protection',
      description: 'Add $1 weather insurance to protect against rain delays',
      icon: CloudRain,
      action: 'Add Protection',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      priority: 'high'
    }
  ].filter(Boolean);

  // AI-powered suggestions based on real data
  const aiSuggestions = [
    {
      title: 'Weekly Grocery Run',
      description: `Based on your ${completedGigs} completed deliveries, save 15% with bulk ordering`,
      icon: Sparkles,
      action: 'Post Now',
      savings: weeklySavings
    },
    {
      title: 'Express Pharmacy Pickup',
      description: 'Quick errand - 3 messengers available within 2km',
      icon: ShieldCheckIcon,
      action: 'Schedule',
      eta: '~25 min'
    },
    {
      title: 'Document Delivery',
      description: `Secure service - ${completedGigs} successful deliveries completed`,
      icon: Shield,
      action: 'Learn More',
      trust: '500+ clients'
    },
  ].slice(0, 3);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock weather update
  useEffect(() => {
    const weatherConditions = [
      { condition: 'sunny', icon: Sun, temp: 28 },
      { condition: 'cloudy', icon: Cloud, temp: 24 },
      { condition: 'rainy', icon: CloudRain, temp: 20 }
    ];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    setWeather(randomWeather);
  }, []);

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get contextual message based on user activity
  const getContextualMessage = () => {
    if (activeGigs > 0) return `You have ${activeGigs} delivery${activeGigs > 1 ? 'ies' : 'y'} in progress`;
    if (completedGigs > 5) return 'You\'re a valued customer! Thanks for choosing Atumwa';
    if (totalSpent > 100) return 'Your trust means everything to us';
    return 'Ready to get things done? Let\'s make it happen';
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      setVoiceCommand('Post grocery delivery to my house');
      setIsListening(false);
      // Auto-fill form or navigate
      navigate('/dashboard/client/gigs/new');
    }, 2000);
  };

  return (
    <DashboardShell role="client" title="Client Hub">
      <div className="space-y-6">
        {/* Hero Section */}
        <ClientHeroVideo />

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/dashboard/client/gigs/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
          >
            <PlusIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Post Gig</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/client/gigs')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
          >
            <ListBulletIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">My Gigs</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/client/map')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
          >
            <MapPinIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Track</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/client/messages')}
            className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg relative"
          >
            <MessageSquare className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Messages</span>
            {activityFeed.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activityFeed.length}
              </div>
            )}
          </button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{activeGigs}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{completedGigs}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-xl">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">${totalSpent.toFixed(0)}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">4.8</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Actions */}
        {smartActions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartActions.slice(0, 2).map((action: any) => (
                <div
                  key={action.id}
                  className="bg-white rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                      <action.icon className={`h-4 w-4 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{action.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{action.description}</p>
                      <button className={`text-xs font-bold mt-2 ${action.iconColor} hover:opacity-80`}>
                        {action.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Recent Activity</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {activityFeed.slice(0, 3).map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => navigate('/dashboard/client/gigs')}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all activity →
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-black text-green-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Pro Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-800">Add detailed pickup/drop-off instructions for better service</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-800">Rate deliveries quickly to help messengers improve</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-800">Use emergency mode for urgent deliveries (extra fees apply)</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ClientDashboard;
