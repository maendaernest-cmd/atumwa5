import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '../context/ToastContext';
import { MOCK_GIGS } from '../constants';
import {
  BarChart3,
  Users,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Activity,
  ShieldAlert,
  Briefcase,
  Trash2,
  Filter,
  Info,
  Smartphone,
  Coins,
  DollarSign,
  XCircle,
  Send,
  Search,
  RefreshCcw,
  ThumbsDown,
  Ban,
  Clock,
  Loader2,
  Bike,
  Navigation,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { X } from 'lucide-react';

// --- Mock Data for Analytics ---
const INITIAL_ACTIVITY_DATA = [
  { name: 'Mon', gigs: 45, disputes: 2, users: 12 },
  { name: 'Tue', gigs: 52, disputes: 1, users: 15 },
  { name: 'Wed', gigs: 48, disputes: 0, users: 18 },
  { name: 'Thu', gigs: 61, disputes: 3, users: 22 },
  { name: 'Fri', gigs: 75, disputes: 1, users: 25 },
  { name: 'Sat', gigs: 95, disputes: 4, users: 30 },
  { name: 'Sun', gigs: 88, disputes: 2, users: 18 },
];

const PERFORMANCE_ALERTS = [
  { id: 1, type: 'supply', message: 'Low Messenger supply in Downtown Area', severity: 'high', time: '10 min ago' },
  { id: 2, type: 'fulfillment', message: 'Gig fulfillment rate dropped by 5% this hour', severity: 'medium', time: '35 min ago' },
  { id: 3, type: 'system', message: 'Payment gateway latency spike detected', severity: 'low', time: '2h ago' },
];

// --- Mock Data for Disputes ---
const MOCK_DISPUTES = [
  {
    id: 'd1',
    gigTitle: 'Urgent Prescription Pickup',
    reporter: 'Sarah J. (Client)',
    accused: 'Alex M. (Atumwa)',
    reason: 'Item damaged upon arrival',
    status: 'open',
    severity: 'medium',
    amount: 15.00
  },
  {
    id: 'd2',
    gigTitle: 'Grocery Run - Whole Foods',
    reporter: 'Mike T. (Atumwa)',
    accused: 'Dr. Smith (Client)',
    reason: 'Client unavailable at drop-off location',
    status: 'investigating',
    severity: 'low',
    amount: 22.50
  },
  {
    id: 'd3',
    gigTitle: 'Parcel Delivery to Airport',
    reporter: 'System',
    accused: 'User_882',
    reason: 'Suspicious GPS activity detected during transit',
    status: 'flagged',
    severity: 'high',
    amount: 45.00
  }
];

interface BroadcastMessage {
  id: number;
  title: string;
  content: string;
  audience: 'all' | 'clients' | 'atumwas';
  type: 'update' | 'policy' | 'alert';
  timestamp: string;
}

// Mock Broadcast History Data
const MOCK_BROADCAST_HISTORY: BroadcastMessage[] = [
  {
    id: 101,
    title: "Scheduled Maintenance",
    content: "Platform will undergo maintenance this Sunday at 2 AM EST. Expected downtime: 30 mins.",
    audience: 'all',
    type: 'update',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
  },
  {
    id: 102,
    title: "Updated Safety Guidelines",
    content: "Please review the new contactless delivery protocols in the Help Center.",
    audience: 'atumwas',
    type: 'policy',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: 103,
    title: "High Demand: Downtown",
    content: "Surge pricing active in Downtown due to high request volume.",
    audience: 'atumwas',
    type: 'alert',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  }
];

import { MarketRatesCard } from '../components/MarketRatesCard';

// ... (keep includes)

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { users, gigs, walletHistory, updateGigStatus, exchangeRates, inquiries, supportTickets, updateTicketStatus, auditLog, adminSettings, suspendUser, banUser, unsuspendUser, logAdminAction, updateAdminSettings, updateUserRole } = useData();
  const [showGreeting, setShowGreeting] = useState(() => {
    // Only show greeting immediately after login
    const justLoggedIn = sessionStorage.getItem('just_logged_in') === 'true';
    if (justLoggedIn) {
      sessionStorage.removeItem('just_logged_in');
      return true;
    }
    return false;
  });

  const dismissGreeting = () => {
    setShowGreeting(false);
  };

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        dismissGreeting();
      }, 4000); // Show for exactly 4 seconds
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'moderation' | 'gigs' | 'messaging' | 'fleet' | 'support' | 'users' | 'audit' | 'revenue' | 'settings'>('analytics');

  const [liveChartData, setLiveChartData] = useState(INITIAL_ACTIVITY_DATA);

  // Use global gigs for the table
  const dashboardGigs = gigs; // Derived from context directly

  // Content Management State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [audience, setAudience] = useState<'all' | 'clients' | 'atumwas'>('all');
  const [postType, setPostType] = useState<'update' | 'policy' | 'alert'>('update');
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastMessage[]>([]);

  // Dispute Resolution State
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Gig Management State
  const [gigStatusFilter, setGigStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed' | 'expired'>('all');
  const [gigTypeFilter, setGigTypeFilter] = useState<'all' | 'prescription' | 'paperwork' | 'shopping' | 'parcel'>('all');
  const [deletingGigId, setDeletingGigId] = useState<string | null>(null);

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);

  // Settings State
  const [platformFee, setPlatformFee] = useState(adminSettings.platformFee);
  const [surgeMultiplier, setSurgeMultiplier] = useState(adminSettings.surgeMultiplier);
  const [minPrice, setMinPrice] = useState(adminSettings.minDeliveryPrice);
  const [maxPrice, setMaxPrice] = useState(adminSettings.maxDeliveryPrice);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Analytics Date Range State
  const [dateRange, setDateRange] = useState('week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate Real-time Stats (After all state declarations)
  const kpiStats = {
    users: users.length,
    activeGigs: gigs.filter(g => g.status === 'open' || g.status === 'in-progress').length,
    disputes: disputes.length,
    revenue: walletHistory.reduce((acc, t) => t.type === 'debit' ? acc + Math.abs(t.amount) : acc, 0) + 12400
  };

  // Simulate Real-time Data Updates for Analytics (Partial)
  useEffect(() => {
    if (activeTab !== 'analytics') return;

    const interval = setInterval(() => {
      // Just update chart data visuals for aliveness
      setLiveChartData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        const currentDay = { ...newData[lastIdx] };

        if (Math.random() > 0.6) currentDay.gigs += 1;

        newData[lastIdx] = currentDay;
        return newData;
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'content') {
      const stored = localStorage.getItem('atumwa_broadcasts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBroadcastHistory(parsed);
          } else {
            setBroadcastHistory(MOCK_BROADCAST_HISTORY);
            localStorage.setItem('atumwa_broadcasts', JSON.stringify(MOCK_BROADCAST_HISTORY));
          }
        } catch (e) {
          console.error("Failed to parse broadcasts", e);
          setBroadcastHistory(MOCK_BROADCAST_HISTORY);
        }
      } else {
        setBroadcastHistory(MOCK_BROADCAST_HISTORY);
        localStorage.setItem('atumwa_broadcasts', JSON.stringify(MOCK_BROADCAST_HISTORY));
      }
    }
  }, [activeTab]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;

    const newBroadcast: BroadcastMessage = {
      id: Date.now(),
      title: postTitle,
      content: postContent,
      audience,
      type: postType,
      timestamp: new Date().toISOString()
    };

    const updatedBroadcasts = [newBroadcast, ...broadcastHistory];

    localStorage.setItem('atumwa_broadcasts', JSON.stringify(updatedBroadcasts));
    setBroadcastHistory(updatedBroadcasts);

    addToast(
      'Broadcast Sent',
      `Message "${postTitle}" sent to ${audience === 'all' ? 'All Users' : audience === 'clients' ? 'Clients' : 'Messengers'}.`,
      'success'
    );

    setPostTitle('');
    setPostContent('');
    setAudience('all');
  };

  const handleDeleteBroadcast = (id: number) => {
    const updated = broadcastHistory.filter(b => b.id !== id);
    setBroadcastHistory(updated);
    localStorage.setItem('atumwa_broadcasts', JSON.stringify(updated));
    addToast('Broadcast Deleted', 'Message removed from history.', 'success');
  };

  const handleResolveDispute = (id: string, action: 'refund' | 'warn' | 'ban') => {
    setProcessingId(id);

    // Simulate API Call
    setTimeout(() => {
      setDisputes(prev => prev.map(d =>
        d.id === id ? { ...d, status: 'resolved' } : d
      ));

      let title = 'Dispute Resolved';
      let message = `Dispute #${id} marked as resolved.`;

      if (action === 'refund') {
        title = 'Refund Processed';
        message = `Full refund issued to client for Dispute #${id}.`;
      } else if (action === 'warn') {
        title = 'Warning Sent';
        message = `Official warning sent to user for Dispute #${id}.`;
      } else if (action === 'ban') {
        title = 'User Suspended';
        message = `User account banned for Dispute #${id}.`;
      }

      addToast(title, message, 'success');
      setProcessingId(null);
    }, 1500);
  };

  const handleDeleteGig = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this gig? This action cannot be undone.')) {
      setDeletingGigId(id);
      setTimeout(() => {
        // Soft delete using status update to cancelled
        updateGigStatus(id, 'cancelled');
        addToast('Gig Deleted', `Gig #${id} has been permanently deleted from the registry.`, 'success');
        setDeletingGigId(null);
      }, 800);
    }
  };

  const filteredGigs = dashboardGigs.filter(gig => {
    const statusMatch = gigStatusFilter === 'all' || gig.status === gigStatusFilter;
    const typeMatch = gigTypeFilter === 'all' || gig.type === gigTypeFilter;
    return statusMatch && typeMatch;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Security Protocol Active</h2>
          <p className="text-slate-500 font-medium mb-8">Access to the High-Command Interface is restricted to verified administrators only.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-600 transition-all shadow-lg"
          >
            Authenticate Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center text-white max-w-md mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
                className="mb-8"
              >
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <div className="text-4xl">👋</div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black mb-4 leading-tight"
              >
                {new Date().getHours() < 12 ? 'Welcome back, Chief' : new Date().getHours() < 18 ? 'Good afternoon, Admin' : 'Good evening, Director'},
                <span className="block text-white/90 text-3xl md:text-4xl mt-2 font-bold">
                  {user?.name?.split(' ')[0] || 'Admin'}!
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xl text-white/90 mb-8 font-medium"
              >
                Platform performance is optimal. You have {supportTickets.filter(t => t.status === 'open').length} open reports to review.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">Mainframe Link: Secure</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              onClick={dismissGreeting}
              className="absolute top-8 right-8 w-14 h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl flex items-center justify-center text-white transition-all duration-200"
            >
              <X size={28} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl lg:text-6xl font-black text-stone-900 mb-2"
              >
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-stone-600 font-medium"
              >
                Admin Command Center - Platform Oversight
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold">System Status: Optimal</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
          >
            <div className="card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 leading-tight">{kpiStats.users.toLocaleString()}</div>
                  <div className="text-sm text-stone-500 font-medium">Total Users</div>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Activity size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 leading-tight">{kpiStats.activeGigs}</div>
                  <div className="text-sm text-stone-500 font-medium">Active Gigs</div>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 leading-tight">{kpiStats.disputes}</div>
                  <div className="text-sm text-stone-500 font-medium">Disputes</div>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 leading-tight">${(kpiStats.revenue / 1000).toFixed(1)}k</div>
                  <div className="text-sm text-stone-500 font-medium">Revenue</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="card p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('analytics')}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                  <BarChart3 size={24} />
                </div>
                <span className="font-bold text-center text-stone-900">Analytics</span>
              </div>
            </div>

            <div className="card p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('gigs')}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Briefcase size={24} />
                </div>
                <span className="font-bold text-center text-stone-900">Gig Management</span>
              </div>
            </div>

            <div className="card p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('moderation')}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <AlertTriangle size={24} />
                </div>
                <span className="font-bold text-center text-stone-900">Dispute Resolution</span>
              </div>
            </div>

            <div className="card p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('support')}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <HelpCircle size={24} />
                </div>
                <span className="font-bold text-center text-stone-900">Support Hub</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Global Search */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="🔍 Global search: users, gigs, disputes..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {showSearchResults && globalSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {users.filter(u => u.name.toLowerCase().includes(globalSearch.toLowerCase()) || u.email.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 5).map(u => (
                <div key={u.id} className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.role}</div>
                  </div>
                </div>
              ))}
              {gigs.filter(g => g.title.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 5).map(g => (
                <div key={g.id} className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="text-sm font-bold text-slate-800">{g.title}</div>
                  <div className="text-xs text-slate-500">{g.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart3 size={16} /> Analytics
          </button>
          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'gigs' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Briefcase size={16} /> Gigs
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'moderation' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <AlertTriangle size={16} /> Disputes
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'messaging' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Megaphone size={16} /> Messaging
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'fleet' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <Activity size={18} className="mr-3" />
            Fleet Status
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'support' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <HelpCircle size={18} className="mr-3" />
            Support Helpdesk
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <Users size={18} className="mr-3" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'audit' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <RefreshCcw size={18} className="mr-3" />
            Audit Log
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'revenue' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <DollarSign size={18} className="mr-3" />
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'settings' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
          >
            <RefreshCcw size={18} className="mr-3" />
            Settings
          </button>
        </div>
      </div>

      {/* Admin Performance & Rates Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MarketRatesCard />
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Inquiries</p>
            <p className="text-xl font-bold text-slate-800">{inquiries.length} Open</p>
          </div>
          <HelpCircle className="text-blue-500" size={24} />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Server Latency</p>
            <p className="text-xl font-bold text-slate-800">24ms</p>
          </div>
          <Activity className="text-green-500" size={24} />
        </div>
      </div>

      {/* Quick Links */}
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

      {/* --- ANALYTICS TAB --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Date Range & Export Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-4 items-center flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => setDateRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${dateRange === 'week' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${dateRange === 'month' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                This Month
              </button>
              <button
                onClick={() => setDateRange('custom')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${dateRange === 'custom' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Custom Range
              </button>
            </div>

            {dateRange === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <span className="text-slate-500 font-bold">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}

            <button
              onClick={() => {
                const data = {
                  dateRange,
                  customStartDate,
                  customEndDate,
                  gigs: gigs.length,
                  users: users.length,
                  revenue: kpiStats.revenue,
                  disputes: disputes.length,
                  timestamp: new Date().toISOString()
                };
                const csvContent = Object.entries(data).map(([k, v]) => `${k},${v}`).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                addToast('Export Successful', 'Report downloaded as CSV', 'success');
              }}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} /> Export Report
            </button>
          </div>

          {/* System Alerts & Monitoring */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              System Alerts & Monitoring
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">High Disputes Rate</span>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">CRITICAL</span>
                </div>
                <p className="text-xs text-slate-600">Dispute rate at {((disputes.length / gigs.length) * 100).toFixed(1)}% - monitor closely</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">Unverified Users</span>
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold">WARNING</span>
                </div>
                <p className="text-xs text-slate-600">{users.filter(u => !u.isVerified).length} users need verification</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">Platform Health</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">OPTIMAL</span>
                </div>
                <p className="text-xs text-slate-600">All systems operational - {gigs.length} active gigs</p>
              </div>
            </div>
          </div>

          {/* Hyper-Live Platform Oversight (Voyager Theme) */}
          <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
            <MapContainer center={[-17.8292, 31.0522]} zoom={13} style={{ height: '100%', width: '100%', background: '#f8fafc' }} zoomControl={false} className="rounded-3xl">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                {/* Global Heatmap Clusters */}
                <Circle center={[-17.815, 31.030]} radius={800} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 0 }} />
                <Circle center={[-17.845, 31.065]} radius={1000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 0 }} />
                <Circle center={[-17.830, 31.045]} radius={600} pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.15, weight: 0 }} />
                {/* Live Fleet (Random dots) */}
                {[-17.82, -17.83, -17.84, -17.825, -17.835].map((lat, i) => (
                  <Circle key={i} center={[lat, 31.04 + (i * 0.01)]} radius={50} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.8, weight: 2 }} />
                ))}
              </MapContainer>

            {/* Overlay Telemetry */}
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_#ef4444]"></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Live Status</p>
                    <p className="text-sm font-black text-white leading-none">High Demand Detected</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-white uppercase">42 Active Couriers</span>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <TrendingUp size={12} className="text-brand-400" />
                    <span className="text-[10px] font-black text-white uppercase">Surcharge: 1.2x</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tight">Harare Central</p>
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Regional Operations Hub</p>
                </div>
                <button className="bg-brand-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-600 transition-all pointer-events-auto shadow-xl shadow-brand-500/20">
                  View Heatmap Focus
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Total Users</span>
                <Users className="text-brand-500 bg-brand-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{kpiStats.users.toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> +12% this week
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Active Gigs</span>
                <Activity className="text-amber-500 bg-amber-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{kpiStats.activeGigs}</div>
              <div className="text-xs text-slate-500 mt-1">
                85% fulfillment rate
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Disputes</span>
                <AlertTriangle className="text-red-500 bg-red-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{kpiStats.disputes}</div>
              <div className="text-xs text-red-600 font-medium mt-1">
                Requires attention
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Revenue</span>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">$$$</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">${(kpiStats.revenue / 1000).toFixed(1)}k</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> +5% vs last week
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Platform Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liveChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend />
                    <Bar dataKey="gigs" name="Gigs Completed" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="users" name="New Users" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Performance Alerts</h3>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">Live</span>
              </div>
              <div className="space-y-3">
                {PERFORMANCE_ALERTS.map(alert => (
                  <div key={alert.id} className={`p-3 rounded-lg border flex gap-3 ${alert.severity === 'high' ? 'bg-red-50 border-red-100' :
                    alert.severity === 'medium' ? 'bg-amber-50 border-amber-100' :
                      'bg-slate-50 border-slate-100'
                    }`}>
                    {alert.severity === 'high' ? <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" /> :
                      alert.severity === 'medium' ? <Clock size={18} className="text-amber-600 mt-0.5 flex-shrink-0" /> :
                        <Activity size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    }
                    <div>
                      <p className={`text-sm font-medium ${alert.severity === 'high' ? 'text-red-800' :
                        alert.severity === 'medium' ? 'text-amber-800' :
                          'text-slate-700'
                        }`}>{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-brand-600 font-medium hover:underline">
                View System Logs
              </button>
            </div>

            {/* Platform Inquiries Oversight */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-500" />
                Live Platform Inquiries
              </h3>
              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.slice(0, 3).map((inq: any) => (
                    <div key={inq.id} className="pb-4 border-b border-slate-50 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-700">{inq.user.name}</span>
                        <span className="text-[10px] text-slate-400">{new Date(inq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">"{inq.query}" at {inq.place}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No live inquiries currently.</p>
              )}
              <button className="w-full mt-4 pt-4 border-t border-slate-50 text-center text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest">
                View All Inquiries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GIGS MANAGEMENT TAB --- */}
      {activeTab === 'gigs' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-brand-600" /> Gig Management
              </h2>
              <div className="text-sm text-slate-500">
                Total Gigs: <strong>{dashboardGigs.length}</strong>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={gigStatusFilter}
                  onChange={(e) => setGigStatusFilter(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={gigTypeFilter}
                  onChange={(e) => setGigTypeFilter(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize"
                >
                  <option value="all">All Types</option>
                  <option value="prescription">Prescription</option>
                  <option value="paperwork">Paperwork</option>
                  <option value="shopping">Shopping</option>
                  <option value="parcel">Parcel</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Title / ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Posted By</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGigs.length > 0 ? filteredGigs.map(gig => (
                  <tr key={gig.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{gig.title}</div>
                      <div className="text-xs text-slate-500 font-mono">#{gig.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                        {gig.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={gig.postedBy.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-slate-700">{gig.postedBy.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        {gig.paymentMethod === 'ecocash' && <><Smartphone size={14} className="text-blue-600" /> EcoCash</>}
                        {gig.paymentMethod === 'zig' && <><Coins size={14} className="text-amber-600" /> ZiG</>}
                        {gig.paymentMethod === 'cash_usd' && <><DollarSign size={14} className="text-green-600" /> Cash</>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${gig.status === 'open' ? 'bg-brand-100 text-brand-700' :
                        gig.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                          gig.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-500'
                        }`}>
                        {gig.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      ${gig.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={deletingGigId === gig.id}
                        onClick={() => handleDeleteGig(gig.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100 hover:border-red-200 transition-all disabled:opacity-50"
                      >
                        {deletingGigId === gig.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <XCircle size={32} className="text-slate-300" />
                        <p>No gigs found matching your filters.</p>
                        <button
                          onClick={() => { setGigStatusFilter('all'); setGigTypeFilter('all'); }}
                          className="text-brand-600 font-bold hover:underline text-xs"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT MANAGEMENT TAB --- */}
      {activeTab === 'content' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone size={20} className="text-brand-600" /> Create Broadcast
                </h2>
                <p className="text-sm text-slate-500 mt-1">Send targeted updates to users' feeds and notification centers.</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleBroadcast} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Audience</label>
                      <select
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value as any)}
                      >
                        <option value="all">Everyone (All Users)</option>
                        <option value="clients">Clients Only</option>
                        <option value="atumwas">Messengers (Atumwas) Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type</label>
                      <select
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={postType}
                        onChange={(e) => setPostType(e.target.value as any)}
                      >
                        <option value="update">Platform Update</option>
                        <option value="policy">Policy Change</option>
                        <option value="alert">Urgent Alert / Surge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g., Surge Pricing in Effect Downtown"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message Body</label>
                    <textarea
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[150px]"
                      placeholder="Type your announcement here..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Will appear in Feed & Notifications
                    </span>
                    <button
                      type="submit"
                      className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center gap-2"
                    >
                      <Send size={16} /> Broadcast Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Broadcast History</h3>
                {broadcastHistory.length > 0 && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{broadcastHistory.length} sent</span>
                )}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {broadcastHistory.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg">
                    <p className="text-slate-400 text-sm">No broadcasts have been sent yet.</p>
                  </div>
                ) : (
                  broadcastHistory.map((broadcast) => (
                    <div key={broadcast.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{broadcast.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${broadcast.type === 'alert' ? 'bg-red-100 text-red-700' :
                              broadcast.type === 'policy' ? 'bg-amber-100 text-amber-700' :
                                'bg-brand-100 text-brand-700'
                              }`}>
                              {broadcast.type}
                            </span>
                            <span className="text-xs text-slate-500">• {new Date(broadcast.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteBroadcast(broadcast.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        <span className="font-semibold text-slate-500">To:</span> <span className="capitalize">{broadcast.audience}</span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{broadcast.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODERATION TAB --- */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Dispute Resolution Center
              </h2>
              <p className="text-sm text-slate-500 mt-1">Review flagged gigs and resolve user conflicts.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search ID or User..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Dispute ID / Gig</th>
                  <th className="p-4">Reported By</th>
                  <th className="p-4">Accused</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {disputes.map(dispute => (
                  <tr key={dispute.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">#{dispute.id}</div>
                      <div className="text-xs text-slate-500">{dispute.gigTitle}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                          {dispute.reporter.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]" title={dispute.reporter}>{dispute.reporter}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                          {dispute.accused.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]" title={dispute.accused}>{dispute.accused}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs text-slate-600">
                      {dispute.reason}
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${dispute.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        dispute.severity === 'high' ? 'bg-red-100 text-red-700' :
                          dispute.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-brand-100 text-brand-700'
                        }`}>
                        {dispute.status === 'resolved' ? <CheckCircle2 size={14} /> :
                          dispute.severity === 'high' ? <ShieldAlert size={14} /> :
                            dispute.severity === 'medium' ? <AlertTriangle size={14} /> :
                              <Info size={14} />
                        }
                        {dispute.status === 'resolved' ? 'Resolved' : dispute.severity}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      ${dispute.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      {dispute.status === 'resolved' ? (
                        <div className="flex justify-end items-center gap-2 text-green-600 font-medium text-xs">
                          <CheckCircle2 size={16} /> Resolved
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId === dispute.id}
                            onClick={() => handleResolveDispute(dispute.id, 'refund')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-md border border-slate-200 hover:border-green-200 transition-all disabled:opacity-50 min-w-[85px] justify-center"
                            title="Refund Client"
                          >
                            {processingId === dispute.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                            Refund
                          </button>
                          <button
                            disabled={processingId === dispute.id}
                            onClick={() => handleResolveDispute(dispute.id, 'warn')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-md border border-slate-200 hover:border-amber-200 transition-all disabled:opacity-50 min-w-[75px] justify-center"
                            title="Warn User"
                          >
                            {processingId === dispute.id ? <Loader2 size={14} className="animate-spin" /> : <ThumbsDown size={14} />}
                            Warn
                          </button>
                          <button
                            disabled={processingId === dispute.id}
                            onClick={() => handleResolveDispute(dispute.id, 'ban')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-slate-200 hover:border-red-200 transition-all disabled:opacity-50 min-w-[70px] justify-center"
                            title="Ban User"
                          >
                            {processingId === dispute.id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                            Ban
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <button className="text-brand-600 text-sm font-bold hover:underline">View Resolved History</button>
          </div>
        </div>
      )}

      {/* --- MESSAGING TAB --- */}
      {activeTab === 'messaging' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone size={20} className="text-brand-600" /> Quick Message
                </h2>
                <p className="text-sm text-slate-500 mt-1">Send direct messages to users or groups for support and communication.</p>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Recipient Type</label>
                      <select className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value="user">Specific User</option>
                        <option value="all_clients">All Clients</option>
                        <option value="all_messengers">All Messengers</option>
                        <option value="dispute_parties">Dispute Parties</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                      <select className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="system">System Alert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Brief subject line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[120px]"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Will appear in user messages
                    </span>
                    <button
                      type="submit"
                      className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center gap-2"
                    >
                      <Send size={16} /> Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Active Conversations</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">3 unread</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-slate-800 text-sm">Sarah Johnson</span>
                    </div>
                    <span className="text-xs text-slate-500">2m ago</span>
                  </div>
                  <p className="text-sm text-slate-600">Regarding pharmacy pickup dispute...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Urgent</span>
                    <span className="text-xs text-slate-500">Dispute #d1</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-slate-800 text-sm">Mike Thompson</span>
                    </div>
                    <span className="text-xs text-slate-500">15m ago</span>
                  </div>
                  <p className="text-sm text-slate-600">Question about payment processing...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">Resolved</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-slate-800 text-sm">Alex Rodriguez</span>
                    </div>
                    <span className="text-xs text-slate-500">1h ago</span>
                  </div>
                  <p className="text-sm text-slate-600">New messenger onboarding questions</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">In Progress</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 text-center text-sm text-brand-600 font-medium hover:underline">
                View all conversations
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="font-semibold text-slate-800 text-sm">Send System Alert</div>
                  <div className="text-xs text-slate-500">Platform-wide notification</div>
                </button>
                <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="font-semibold text-slate-800 text-sm">Bulk Messenger Update</div>
                  <div className="text-xs text-slate-500">Send to all active messengers</div>
                </button>
                <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="font-semibold text-slate-800 text-sm">Client Support Template</div>
                  <div className="text-xs text-slate-500">Pre-written responses</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FLEET & OPERATIONS TAB --- */}
      {activeTab === 'fleet' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Fleet Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Active Messengers</span>
                <Bike className="text-green-500 bg-green-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">24</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> 18 online now
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Avg Delivery Time</span>
                <Clock className="text-blue-500 bg-blue-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">28m</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> -5% from last week
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Routes Optimized</span>
                <Navigation className="text-purple-500 bg-purple-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">156</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> +23% efficiency
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Incidents Today</span>
                <AlertTriangle className="text-red-500 bg-red-50 p-1.5 rounded-lg" size={28} />
              </div>
              <div className="text-2xl font-bold text-slate-800">3</div>
              <div className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-medium">
                <Activity size={12} /> 2 resolved
              </div>
            </div>
          </div>

          {/* Route Optimization & Fleet Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Navigation className="text-brand-600" size={20} />
                Route Optimization
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Multi-stop Routes</div>
                    <div className="text-sm text-slate-600">AI-optimized delivery sequences</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">89%</div>
                    <div className="text-xs text-slate-500">Success Rate</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Eco-Friendly Routing</div>
                    <div className="text-sm text-slate-600">Fuel-efficient paths</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">12%</div>
                    <div className="text-xs text-slate-500">Fuel Saved</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Predictive ETA</div>
                    <div className="text-sm text-slate-600">ML-powered time estimates</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">94%</div>
                    <div className="text-xs text-slate-500">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bike className="text-brand-600" size={20} />
                Fleet Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">On-Time Delivery Rate</span>
                  <span className="font-bold text-slate-800">92.4%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.4%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Customer Satisfaction</span>
                  <span className="font-bold text-slate-800">4.7/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Messenger Utilization</span>
                  <span className="font-bold text-slate-800">78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              Incident Management System
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-slate-600">Active Incidents</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">12</div>
                  <div className="text-sm text-slate-600">Resolved Today</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-slate-600">Resolution Rate</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Traffic Accident - CBD</div>
                    <div className="text-sm text-slate-600">Messenger John D. reported collision, minor injuries</div>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Critical</span>
                    <div className="text-xs text-slate-500 mt-1">2h ago</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Package Damage Report</div>
                    <div className="text-sm text-slate-600">Client reported damaged prescription delivery</div>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">High</span>
                    <div className="text-xs text-slate-500 mt-1">45m ago</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">GPS Signal Loss</div>
                    <div className="text-sm text-slate-600">Messenger Alex R. experiencing location tracking issues</div>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Medium</span>
                    <div className="text-xs text-slate-500 mt-1">15m ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="text-brand-600" size={20} />
              Performance Analytics Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Delivery Performance by Hour</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { hour: '8AM', deliveries: 12, onTime: 11 },
                    { hour: '10AM', deliveries: 18, onTime: 16 },
                    { hour: '12PM', deliveries: 25, onTime: 23 },
                    { hour: '2PM', deliveries: 22, onTime: 20 },
                    { hour: '4PM', deliveries: 28, onTime: 25 },
                    { hour: '6PM', deliveries: 15, onTime: 14 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deliveries" fill="#3b82f6" name="Total" />
                    <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Messenger Efficiency Rankings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">1</div>
                      <div>
                        <div className="font-semibold text-slate-800">Sarah Johnson</div>
                        <div className="text-sm text-slate-500">28 deliveries today</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">96%</div>
                      <div className="text-xs text-slate-500">On-time rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">2</div>
                      <div>
                        <div className="font-semibold text-slate-800">Mike Chen</div>
                        <div className="text-sm text-slate-500">24 deliveries today</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">94%</div>
                      <div className="text-xs text-slate-500">On-time rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-700">3</div>
                      <div>
                        <div className="font-semibold text-slate-800">Alex Rodriguez</div>
                        <div className="text-sm text-slate-500">22 deliveries today</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">92%</div>
                      <div className="text-xs text-slate-500">On-time rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Support Command Center</h2>
              <p className="text-sm font-medium text-slate-500">Overseeing active resolving of platform-wide issues.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-50 text-amber-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-amber-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                {supportTickets.filter((t: any) => t.status === 'open').length} Response Required
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Incidents</h3>
              <div className="flex gap-2">
                <button className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"><Filter size={18} /></button>
                <button className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"><Search size={18} /></button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {supportTickets.length > 0 ? (
                supportTickets.map((ticket: any) => (
                  <div key={ticket.id} className="p-8 hover:bg-slate-50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-5">
                        <div className="w-14 h-14 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-all">
                          {ticket.sender?.avatar ? <img src={ticket.sender.avatar} className="w-10 h-10 rounded-full" /> : '👤'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-slate-900 tracking-tight">{ticket.subject}</span>
                            <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">#{ticket.id}</span>
                            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${ticket.urgency === 'critical' ? 'bg-red-500 text-white' :
                              ticket.urgency === 'high' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white'
                              }`}>
                              {ticket.urgency}
                            </div>
                          </div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <span>By {ticket.sender?.name}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-brand-600 font-black">{ticket.sender?.role}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'investigating')}
                          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${ticket.status === 'investigating' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                            }`}
                        >
                          Investigate
                        </button>
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${ticket.status === 'resolved' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                            }`}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                    <div className="ml-20 bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm text-slate-600 leading-relaxed font-medium">
                      "{ticket.description || ticket.message}"
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-32 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">🏆</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Incident Queue Clear</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mt-2">All support requests have been resolved. Platform safety and trust scores are optimal.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- USER MANAGEMENT TAB --- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">User Management</h2>
              <p className="text-sm font-medium text-slate-500">Manage users, roles, and permissions.</p>
            </div>
            {selectedUsers.size > 0 && (
              <div className="bg-brand-50 border border-brand-300 px-4 py-2 rounded-lg">
                <span className="text-sm font-bold text-brand-700">{selectedUsers.size} user(s) selected</span>
                <button
                  onClick={() => selectedUsers.forEach(id => banUser(id, user?.id || '', 'Bulk action'))}
                  className="ml-3 px-3 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ban All
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Client</option>
                  <option>Atumwa</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(new Set(users.map(u => u.id)));
                          } else {
                            setSelectedUsers(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedUsers.has(u.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedUsers);
                            if (e.target.checked) {
                              newSelected.add(u.id);
                            } else {
                              newSelected.delete(u.id);
                            }
                            setSelectedUsers(newSelected);
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="font-bold text-slate-800">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select defaultValue={u.role} className="px-2 py-1 border border-slate-300 rounded text-xs">
                          <option>admin</option>
                          <option>client</option>
                          <option>atumwa</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${(u as any).isBanned ? 'bg-red-100 text-red-700' : (u as any).isSuspended ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {(u as any).isBanned ? 'Banned' : (u as any).isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold ${u.isVerified ? 'text-green-600' : 'text-slate-400'}`}>
                          {u.isVerified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setShowSuspendModal(u.id)}
                          className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => banUser(u.id, user?.id || '', 'Admin action')}
                          className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- AUDIT LOG TAB --- */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">System Audit Log</h2>
            <p className="text-sm font-medium text-slate-500">Track all administrative actions and system changes.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex gap-4">
                <input type="text" placeholder="Search audit logs..." className="flex-1 px-4 py-2 border border-slate-300 rounded-lg" />
                <select className="px-4 py-2 border border-slate-300 rounded-lg">
                  <option>All Actions</option>
                  <option>User Changes</option>
                  <option>Gig Changes</option>
                  <option>Settings Changes</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {auditLog.length > 0 ? (
                auditLog.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800 text-sm">{log.action.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{log.targetType}</span>
                        </div>
                        <p className="text-xs text-slate-500">Admin: {log.adminId} | Target: {log.targetId}</p>
                        {log.details.reason && <p className="text-xs text-slate-600 mt-1">Reason: {log.details.reason}</p>}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">No audit log entries yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- REVENUE DASHBOARD TAB --- */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Revenue Dashboard</h2>
            <p className="text-sm font-medium text-slate-500">Monitor platform revenue and financial metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Revenue</div>
              <div className="text-3xl font-black text-slate-900">${(walletHistory.reduce((acc, t) => t.type === 'debit' ? acc + Math.abs(t.amount) : acc, 0) + 12400).toFixed(2)}</div>
              <div className="text-xs text-green-600 font-medium mt-2">↑ 12% from last month</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Platform Fees Collected</div>
              <div className="text-3xl font-black text-slate-900">${((walletHistory.reduce((acc, t) => t.type === 'debit' ? acc + Math.abs(t.amount) : acc, 0) + 12400) * 0.15).toFixed(2)}</div>
              <div className="text-xs text-slate-500 font-medium mt-2">15% commission</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Payouts</div>
              <div className="text-3xl font-black text-slate-900">${(walletHistory.filter(t => t.status === 'pending').reduce((acc, t) => acc + Math.abs(t.amount), 0)).toFixed(2)}</div>
              <div className="text-xs text-amber-600 font-medium mt-2">{walletHistory.filter(t => t.status === 'pending').length} transactions</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Completed Transactions</div>
              <div className="text-3xl font-black text-slate-900">{walletHistory.filter(t => t.status === 'completed').length}</div>
              <div className="text-xs text-green-600 font-medium mt-2">This month</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200">
                  <tr className="text-slate-600 font-semibold">
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walletHistory.slice(0, 10).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-600">{t.date}</td>
                      <td className="p-3 text-slate-700">{t.description}</td>
                      <td className="p-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${t.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">${Math.abs(t.amount).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Platform Settings</h2>
            <p className="text-sm font-medium text-slate-500">Configure platform-wide settings and rules.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Platform Fee (%)</label>
              <input
                type="number"
                step="0.01"
                value={platformFee}
                onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-slate-500 mt-1">Commission taken from each gig (currently {(platformFee * 100).toFixed(1)}%)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Surge Pricing Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-slate-500 mt-1">Multiplier applied during high-demand periods (current: {surgeMultiplier}x)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Minimum Delivery Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Maximum Delivery Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateAdminSettings({
                  platformFee,
                  surgeMultiplier,
                  minDeliveryPrice: minPrice,
                  maxDeliveryPrice: maxPrice
                });
                addToast('Settings Updated', 'Platform settings have been saved successfully.', 'success');
              }}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
