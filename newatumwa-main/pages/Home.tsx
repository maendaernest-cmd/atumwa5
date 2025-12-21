import React, { useEffect, useState } from 'react';
import { FEED_UPDATES, MOCK_GIGS, MOCK_ADMIN, MOCK_ATUMWA } from '../constants';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, MessageCircle, Share2, MapPin, Clock, CheckCircle, Bell, Info, Briefcase, MessageSquare, User, Star, Trophy, Zap, Heart, DollarSign, ShieldAlert, BarChart3, AlertTriangle, Megaphone, Users, TrendingUp, Activity, Navigation, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [realtimeBroadcasts, setRealtimeBroadcasts] = useState<any[]>([]);

  // Load broadcasts from "Server" (localStorage)
  useEffect(() => {
    const fetchBroadcasts = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('atumwa_broadcasts') || '[]');
        setRealtimeBroadcasts(stored);
      } catch (e) {
        console.error("Error loading broadcasts", e);
      }
    };

    fetchBroadcasts();

    // In a real app, this would be a socket.on('broadcast')
    // Here we poll occasionally or could use window storage event if multi-tab
    const interval = setInterval(fetchBroadcasts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Passive Alert Simulation for Clients (Welcome Guide)
    if (user?.role === 'client') {
      const timer = setTimeout(() => {
        // Only show if not seen recently (mock logic)
        if (Math.random() > 0.7) {
          addToast(
            'New Article Available',
            'Read the latest guide: "How to maximize efficiency with Atumwa"',
            'message'
          );
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, addToast]);

  if (!user) return null;

  // Filter Broadcasts relevant to the current user
  const relevantBroadcasts = realtimeBroadcasts.filter(b =>
    b.audience === 'all' ||
    (b.audience === 'clients' && user.role === 'client') ||
    (b.audience === 'atumwas' && user.role === 'atumwa')
  ).map(b => ({
    id: `broadcast-${b.id}`,
    user: MOCK_ADMIN,
    content: `📢 ${b.title}\n\n${b.content}`,
    time: new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isBroadcast: true
  }));

  // Filter feed content based on user role for better relevance
  const filterFeedForUser = (posts: any[]) => {
    if (user.role === 'atumwa') {
      // Messengers see: achievements, gig posts, availability, announcements, tips, speed deliveries, weekend availability, admin posts, and messenger posts (except reviews)
      return posts.filter(post => {
        // Include messenger-relevant post types
        const relevantTypes = ['achievement', 'gig_post', 'availability', 'announcement', 'tip', 'speed_delivery', 'weekend_available'];
        if (relevantTypes.includes(post.type)) return true;

        // Include admin posts
        if (post.user.role === 'admin') return true;

        // Include messenger posts (but not reviews about others)
        if (post.user.role === 'atumwa' && post.type !== 'review') return true;

        return false;
      });
    } else if (user.role === 'client') {
      // Clients see: reviews, gig posts, discoveries, tips, community posts, announcements, admin posts
      return posts.filter(post => {
        const relevantTypes = ['review', 'gig_post', 'discovery', 'tip', 'community', 'announcement'];
        if (relevantTypes.includes(post.type)) return true;

        // Include admin posts
        if (post.user.role === 'admin') return true;

        return false;
      });
    }
    return posts; // Admin sees all
  };

  // Combine Real-time Broadcasts with Static Feed
  const allPosts = [...relevantBroadcasts, ...FEED_UPDATES];
  const feed = filterFeedForUser(allPosts);

  // Fallback content if feed is empty for the user role
  if (feed.length === 0) {
    if (user.role === 'client') {
      feed.push({
        id: 99,
        user: MOCK_ADMIN,
        content: '📢 Platform Update: We have improved our tracking system! You can now see real-time ETA updates for all your active gigs. Happy shipping!',
        time: 'Just now',
        type: 'announcement'
      });
    } else if (user.role === 'atumwa') {
      // Add messenger-specific fallback content
      feed.push(
        {
          id: 100,
          user: MOCK_ADMIN,
          content: '🚀 Messenger Spotlight: Check out the latest gig opportunities and stay updated with platform features. Your next delivery awaits!',
          time: 'Just now',
          type: 'announcement'
        },
        {
          id: 101,
          user: MOCK_ATUMWA,
          content: '💼 Pro tip: Always confirm pickup details with clients before heading out. Clear communication = smooth deliveries! 📱',
          time: '1h ago',
          type: 'tip'
        }
      );
    }
  }

  return (
    <div className="space-y-6">
      {user.role === 'client' && (
        <>
          {/* Client Dashboard */}
          <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">Atumwa Dashboard</h1>
              <p className="text-slate-500 text-sm">Post errands and connect with reliable messengers across Zimbabwe.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/gigs', { state: { openPostModal: true } })}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-brand-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Post a Gig</h3>
                    <p className="text-sm text-slate-500">Create new errand</p>
                  </div>
                </div>
                <div className="text-brand-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Get started →
                </div>
              </button>

              <button
                onClick={() => navigate('/gigs')}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Active Gigs</h3>
                    <p className="text-sm text-slate-500">Track progress</p>
                  </div>
                </div>
                <div className="text-slate-600 text-sm">View your errands</div>
              </button>

              <button
                onClick={() => navigate('/map')}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Live Tracking</h3>
                    <p className="text-sm text-slate-500">Real-time updates</p>
                  </div>
                </div>
                <div className="text-slate-600 text-sm">Track messengers</div>
              </button>

              <button
                onClick={() => navigate('/messages')}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Messages</h3>
                    <p className="text-sm text-slate-500">Chat with Atumwas</p>
                  </div>
                </div>
                <div className="text-slate-600 text-sm">Communicate</div>
              </button>
            </div>

            {/* Recent Completed Errands */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Completed Errands</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Pharmacy Pickup</h3>
                    <p className="text-sm text-slate-600">Completed 2 hours ago • $15.00</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">Delivered</div>
                    <div className="text-xs text-slate-500">Blessing C.</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Grocery Delivery</h3>
                    <p className="text-sm text-slate-600">Completed yesterday • $22.50</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">Delivered</div>
                    <div className="text-xs text-slate-500">Tinashe M.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Content */}
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Premium Service Available</h3>
                  <p className="text-brand-100 mb-3">Get priority matching and faster delivery times</p>
                  <button className="bg-white text-brand-600 px-4 py-2 rounded-lg font-semibold hover:bg-brand-50 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Updates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Platform Updates</h2>
              <div className="space-y-3">
                {feed.slice(0, 3).map(post => (
                  <div key={post.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Info className="text-brand-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{post.content}</p>
                      <p className="text-xs text-slate-500 mt-1">{post.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {user.role === 'atumwa' && (
        <>
          {/* Messenger-Centric Home - Delivery Operations Hub */}
          <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Header - Shift Status & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Delivery Operations Hub</h1>
                <p className="text-slate-500 text-sm">Manage your deliveries, track earnings, and stay safe on the road.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online - Available
                </div>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Go Offline
                </button>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">47</div>
                    <div className="text-xs text-slate-500">Deliveries Today</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">$385</div>
                    <div className="text-xs text-slate-500">Today's Earnings</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Star className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">4.8</div>
                    <div className="text-xs text-slate-500">Avg Rating</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Zap className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">2.4km</div>
                    <div className="text-xs text-slate-500">Avg Distance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Deliveries */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Navigation className="text-blue-600" size={20} />
                  Current Delivery
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-800">Pharmacy Pickup & Delivery</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">In Progress</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-600" />
                      <span><strong>Pickup:</strong> Greenwood Pharmacy, Fife Ave</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-600" />
                      <span><strong>Drop-off:</strong> Avondale, Harare (2.5km away)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span>$15.00 • EcoCash • Est. 15min</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/map')} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Navigation size={16} />
                      Navigate
                    </button>
                    <button onClick={() => navigate('/messages')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Call Client
                    </button>
                    <button className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="text-amber-600" size={20} />
                  Upcoming Deliveries
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Briefcase size={16} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 text-sm">Grocery Delivery</h4>
                      <p className="text-xs text-slate-600">Avondale → Mt Pleasant • $18.50</p>
                      <p className="text-xs text-slate-500">Starts in 45 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText size={16} className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 text-sm">Document Drop-off</h4>
                      <p className="text-xs text-slate-600">CBD → High Court • $25.00</p>
                      <p className="text-xs text-slate-500">Starts in 2 hours</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/gigs')} className="w-full mt-4 text-brand-600 text-sm font-medium hover:underline">
                  View all scheduled deliveries →
                </button>
              </div>
            </div>

            {/* Quick Actions for Delivery Operations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Delivery Operations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => navigate('/gigs')} className="flex flex-col items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-green-600" size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Accept Deliveries</span>
                </button>

                <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Live Navigation</span>
                </button>

                <button onClick={() => navigate('/messages')} className="flex flex-col items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-purple-600" size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Client Communication</span>
                </button>

                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-amber-600" size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Earnings & Stats</span>
                </button>
              </div>
            </div>

            {/* Safety & Support */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Bell className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Emergency Support</h3>
                    <p className="text-sm text-red-700 mt-1">Need immediate assistance? We're here to help 24/7.</p>
                    <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Emergency Hotline
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Messenger Resources</h3>
                    <p className="text-sm text-blue-700 mt-1">Tips, safety guidelines, and delivery best practices.</p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Resources
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deliveries & Community */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Deliveries</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Pharmacy delivery completed</p>
                      <p className="text-xs text-slate-500">$15.00 • 2 hours ago</p>
                    </div>
                    <Star className="text-amber-500" size={16} />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Grocery delivery completed</p>
                      <p className="text-xs text-slate-500">$18.50 • Yesterday</p>
                    </div>
                    <Star className="text-amber-500" size={16} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Messenger Community</h2>
                <div className="space-y-4">
                  {feed.slice(0, 2).map(post => (
                    <div key={post.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <img src={post.user.avatar} alt={post.user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 text-sm">{post.user.name}</span>
                          <span className="text-xs text-slate-500">• {post.time}</span>
                        </div>
                        <p className="text-sm text-slate-700">{post.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {user.role === 'admin' && (
        <>
          {/* Admin Dashboard */}
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="text-brand-600" /> Admin Command Center
                </h1>
                <p className="text-slate-500 text-sm">Monitor platform health, manage content, and resolve issues.</p>
              </div>
              <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm overflow-x-auto max-w-full">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap bg-slate-800 text-white shadow-sm"
                >
                  <BarChart3 size={16} /> Analytics
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-slate-600 hover:bg-slate-50"
                >
                  <Briefcase size={16} /> Gigs
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-slate-600 hover:bg-slate-50"
                >
                  <AlertTriangle size={16} /> Disputes
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-slate-600 hover:bg-slate-50"
                >
                  <Megaphone size={16} /> Content
                </button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Quick Navigation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">🏠</span>
                  <div>
                    <div className="font-semibold text-slate-800">Home</div>
                    <div className="text-xs text-slate-500">Dashboard</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/gigs')}
                  className="flex items-center gap-3 p-3 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">💼</span>
                  <div>
                    <div className="font-semibold text-slate-800">Gigs</div>
                    <div className="text-xs text-slate-500">Manage</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">🗺️</span>
                  <div>
                    <div className="font-semibold text-slate-800">Map</div>
                    <div className="text-xs text-slate-500">Fleet</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">💬</span>
                  <div>
                    <div className="font-semibold text-slate-800">Messages</div>
                    <div className="text-xs text-slate-500">Support</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase">Total Users</span>
                  <Users className="text-brand-500 bg-brand-50 p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-2xl font-bold text-slate-800">2,450</div>
                <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp size={12} /> +12% this week
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase">Active Gigs</span>
                  <Activity className="text-amber-500 bg-amber-50 p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-2xl font-bold text-slate-800">142</div>
                <div className="text-xs text-slate-500 mt-1">
                  85% fulfillment rate
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase">Pending Approvals</span>
                  <Clock className="text-purple-500 bg-purple-50 p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-2xl font-bold text-slate-800">23</div>
                <div className="text-xs text-purple-600 font-medium mt-1">
                  Review required
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase">Recent Disputes</span>
                  <AlertTriangle className="text-red-500 bg-red-50 p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-2xl font-bold text-slate-800">8</div>
                <div className="text-xs text-red-600 font-medium mt-1">
                  Requires attention
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase">Revenue</span>
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">$$$</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">$12.4k</div>
                <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp size={12} /> +5% vs last week
                </div>
              </div>
            </div>

            {/* Pending Items & Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Items & Quick Actions</h2>
              <div className="space-y-4">
                {/* Pending Gig Approvals */}
                <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-amber-800">New Gig Approvals (12)</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Priority</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Urgent Pharmacy Pickup</p>
                        <p className="text-xs text-slate-500">Posted 2 hours ago • $15.00</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">Approve</button>
                        <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100">Decline</button>
                        <button className="bg-slate-50 text-slate-600 px-3 py-1 rounded text-xs font-medium hover:bg-slate-100">Flag</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Grocery Delivery Request</p>
                        <p className="text-xs text-slate-500">Posted 45 min ago • $22.50</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">Approve</button>
                        <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100">Decline</button>
                        <button className="bg-slate-50 text-slate-600 px-3 py-1 rounded text-xs font-medium hover:bg-slate-100">Flag</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <button className="text-amber-600 font-medium text-sm hover:underline">View all pending approvals</button>
                    <div className="flex gap-2">
                      <button className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-700">Bulk Approve</button>
                      <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm font-medium hover:bg-slate-200">Bulk Decline</button>
                    </div>
                  </div>
                </div>

                {/* Dispute Alerts */}
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-red-800">Dispute Alerts (3)</h3>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Urgent</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-red-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Damaged Item Complaint</p>
                        <p className="text-xs text-slate-500">Pharmacy Pickup • $15.00 • Reported by Sarah J.</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700">Review</button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">Resolve</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-red-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">GPS Activity Flagged</p>
                        <p className="text-xs text-slate-500">Parcel Delivery • $45.00 • System detected anomaly</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700">Review</button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">Resolve</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="text-red-600 font-medium text-sm hover:underline">View all disputes</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">New gig posted: Pharmacy Pickup</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Gig completed by Blessing C.</p>
                    <p className="text-xs text-slate-500">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-amber-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">New dispute reported</p>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
