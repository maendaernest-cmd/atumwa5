import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_GIGS, MOCK_USERS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketRatesCard } from '../components/MarketRatesCard';
import { Gig, MessengerDashboard as MessengerDashboardType, TaskStatus } from '../types';
import { Button } from '../components/ui/Button';
import {
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  TrendingUp,
  Play,
  Pause,
  Settings,
  MessageSquare,
  Bell,
  Wallet,
  BarChart3,
  Calendar,
  Zap,
  Briefcase,
  User,
  HelpCircle,
  X,
  Send,
  ArrowRight,
  Flag,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Activity,
  Target,
  Award,
  TrendingDown,
  Eye,
  Phone,
  Mail,
  RefreshCw,
  MoreHorizontal,
  Filter,
  Search,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  Info,
  Check,
  XCircle,
  Loader,
  Bike,
  Car,
  Truck,
  Package,
  Users,
  Timer,
  CreditCard,
  Award as Trophy,
  Sparkles,
  Rocket,
  Heart,
  Shield,
  Compass,
  Battery,
  Wifi,
  Signal,
  BookOpen
} from 'lucide-react';

interface TaskCardProps {
  task: Gig;
  onAction: (action: string, taskId: string) => void;
  showMap?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction, showMap = false }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800">{task.title}</h3>
            {task.urgency === 'priority' && <Zap size={14} className="text-red-500" />}
            {task.urgency === 'express' && <TrendingUp size={14} className="text-amber-500" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} />
            <span>{task.distance}</span>
            <span>•</span>
            <span>${task.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-slate-600">
          <strong>Pickup:</strong> {task.locationStart}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Drop-off:</strong> {task.locationEnd}
        </div>
        {task.timeWindow && (
          <div className="text-sm text-slate-600">
            <strong>Time:</strong> {new Date(task.timeWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(task.timeWindow.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onAction('accept', task.id)}
          variant="success"
          size="lg"
          fullWidth
          leftIcon={<CheckCircle size={18} />}
        >
          Accept Task
        </Button>
        <Button
          onClick={() => onAction('message', task.id)}
          variant="secondary"
          size="lg"
          leftIcon={<MessageSquare size={18} />}
        >
          Message
        </Button>
      </div>
    </div>
  );
};

export const MessengerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { gigs, walletHistory, inquiries, exchangeRates, createTicket, supportTickets, sharedLocations, toggleGPSSharing, updateUserLocation } = useData();
  const navigate = useNavigate();

  const availableTasks = gigs.filter(g => g.status === 'open' && g.assignedTo !== user?.id).slice(0, 8);
  const activeTasks = gigs.filter(g => g.assignedTo === user?.id && (g.status === 'in-progress' || g.status === 'purchased'));
  const completedTasks = gigs.filter(g => g.assignedTo === user?.id && g.status === 'completed');

  const dashboard = {
    availableTasks,
    activeTasks,
    completedTasks,
    earnings: {
      totalEarnings: walletHistory.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0),
      thisWeek: walletHistory.filter(t => t.type === 'credit' && new Date(t.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).reduce((acc, t) => acc + t.amount, 0),
      pendingPayouts: 95.25,
      completedTasks: completedTasks.length,
      averageRating: 4.8,
      tipsReceived: 125.50,
      transactions: walletHistory.slice(0, 5)
    },
    rating: 4.8,
    completedCount: completedTasks.length,
    responseRate: 94,
    isOnline: true,
  };

  const [shiftStatus, setShiftStatus] = useState<'available' | 'busy' | 'off'>('available');
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'performance' | 'earnings' | 'routes' | 'communication' | 'safety' | 'help'>('overview');
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

  if (!user || user.role !== 'atumwa') {
    return <div>Access denied</div>;
  }

  const { updateGigStatus, assignGig } = useData();

  const handleTaskAction = (action: string, taskId: string) => {
    switch (action) {
      case 'accept':
        if (user) {
          assignGig(taskId, user.id);
          navigate('/map', { state: { selectedGigId: taskId } });
        }
        break;
      case 'navigate':
        navigate('/map', { state: { selectedGigId: taskId } });
        break;
      case 'mark_purchased':
        updateGigStatus(taskId, 'purchased');
        break;
      case 'deliver':
        updateGigStatus(taskId, 'completed');
        break;
      case 'message':
        const gig = gigs.find(g => g.id === taskId);
        if (gig) {
          navigate('/messages', { state: { recipientId: gig.postedBy.id, recipientName: gig.postedBy.name, gigId: taskId } });
        }
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'start_route':
        if (dashboard.activeTasks.length > 0) {
          navigate('/map', { state: { selectedGigId: dashboard.activeTasks[0].id } });
        }
        break;
      case 'quick_message':
        break;
      case 'emergency':
        break;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const inProgressGig = activeTasks.find(g => g.status === 'in-progress');

  // Mini-map icon fix
  const miniIcon = L.divIcon({
    className: 'mini-courier-icon',
    html: '<div class="w-4 h-4 bg-brand-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
    iconSize: [16, 16]
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Live Activity Widget (Mini-Map picture-in-picture) */}
      {inProgressGig && inProgressGig.coordinates && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden group bg-white rounded-3xl border border-slate-200 shadow-2xl h-64 md:h-72"
        >
          <div className="absolute inset-0 z-0 opacity-80">
            <MapContainer
              center={[inProgressGig.coordinates.lat, inProgressGig.coordinates.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={[inProgressGig.coordinates.lat, inProgressGig.coordinates.lng]} icon={miniIcon} />
            </MapContainer>
          </div>

          <div className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col justify-between bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="bg-brand-500/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Activity</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 truncate max-w-xs">{inProgressGig.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brand-400" />
                    <span className="text-sm font-bold text-slate-300">~8 mins away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-400" />
                    <span className="text-sm font-bold text-slate-300">Harare Central</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/map', { state: { selectedGigId: inProgressGig.id } })}
                className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.15em] hover:bg-brand-500 hover:text-white transition-all transform active:scale-95 shadow-xl flex items-center gap-2 shrink-0"
              >
                Track Live <Zap size={14} fill="currentColor" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full-Screen Welcome Greeting Overlay */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center"
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
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <div className="text-4xl">🚴‍♂️</div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              >
                {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
                <span className="block text-white/90 text-2xl md:text-3xl mt-2 font-bold">
                  {user?.name?.split(' ')[0] || 'Messenger'}!
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xl text-white/80 mb-8 font-medium"
              >
                Ready to deliver excellence today? Your tasks are waiting.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">Network: Online</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Dismiss button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              onClick={dismissGreeting}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200"
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Messenger Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your deliveries, track earnings, and stay connected.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShiftStatus(shiftStatus === 'available' ? 'busy' : 'available')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-500/20 ${shiftStatus === 'available'
              ? 'bg-green-600/90 backdrop-blur text-white hover:bg-green-700'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {shiftStatus === 'available' ? <Play size={16} /> : <Pause size={16} />}
            {shiftStatus === 'available' ? 'Go Online' : 'Go Offline'}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards & Market Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <CheckCircle size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">{dashboard.completedCount}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                <DollarSign size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">${dashboard.earnings.thisWeek.toFixed(0)}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Week</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                <Star size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">{dashboard.rating}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <MarketRatesCard />
        </div>
      </div>

      {/* Enhanced Messenger Dashboard Tabs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-100/50 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'tasks', label: 'Tasks', icon: Package },
            { key: 'performance', label: 'Performance', icon: Target },
            { key: 'earnings', label: 'Earnings', icon: Wallet },
            { key: 'routes', label: 'Routes', icon: Navigation },
            { key: 'communication', label: 'Communication', icon: MessageSquare },
            { key: 'safety', label: 'Safety', icon: Shield },
            { key: 'help', label: 'Help', icon: HelpCircle }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 min-w-[120px] px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative flex flex-col items-center gap-2 ${
                  activeTab === tab.key
                    ? 'text-brand-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <IconComponent size={16} />
                <span className="hidden sm:block">{tab.label}</span>
                <span className="sm:hidden text-[10px]">{tab.label.split(' ')[0]}</span>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 min-h-[500px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Quick Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl text-center">
                  <Zap size={24} className="mx-auto mb-2 text-blue-600" />
                  <div className="text-xl font-black text-slate-900">{dashboard.responseRate}%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Response Rate</div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <Timer size={24} className="mx-auto mb-2 text-green-600" />
                  <div className="text-xl font-black text-slate-900">2.4km</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Avg Distance</div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
                  <div className="text-xl font-black text-slate-900">94%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">On-Time Rate</div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <Award size={24} className="mx-auto mb-2 text-amber-600" />
                  <div className="text-xl font-black text-slate-900">Top 10%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Rank</div>
                </div>
              </div>

              {/* Today's Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600" />
                    Today's Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Tasks Completed</span>
                      <span className="font-bold text-slate-900">{dashboard.completedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Distance Covered</span>
                      <span className="font-bold text-slate-900">24.5 km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Avg Delivery Time</span>
                      <span className="font-bold text-slate-900">18 mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Customer Rating</span>
                      <span className="font-bold text-slate-900">4.8 ⭐</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-green-600" />
                    Goals & Achievements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Monthly Target</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-slate-900">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-slate-600">5-star delivery streak</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-slate-600">Perfect on-time record</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock size={16} />
                      <span>Next: Speed demon badge</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShiftStatus(shiftStatus === 'available' ? 'busy' : 'available')}
                  className="glass-card p-4 rounded-2xl hover:shadow-md transition-all text-center"
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    shiftStatus === 'available' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {shiftStatus === 'available' ? <Play size={16} /> : <Pause size={16} />}
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {shiftStatus === 'available' ? 'Go Offline' : 'Go Online'}
                  </div>
                </button>

                <button className="glass-card p-4 rounded-2xl hover:shadow-md transition-all text-center">
                  <Battery size={20} className="mx-auto mb-2 text-blue-600" />
                  <div className="text-xs font-bold text-slate-900">Vehicle Status</div>
                </button>

                <button className="glass-card p-4 rounded-2xl hover:shadow-md transition-all text-center">
                  <Shield size={20} className="mx-auto mb-2 text-red-600" />
                  <div className="text-xs font-bold text-slate-900">Emergency</div>
                </button>

                <button className="glass-card p-4 rounded-2xl hover:shadow-md transition-all text-center">
                  <MessageSquare size={20} className="mx-auto mb-2 text-purple-600" />
                  <div className="text-xs font-bold text-slate-900">Support</div>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Task Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['All', 'Available', 'Active', 'Urgent', 'High-Value'].map(filter => (
                  <button key={filter} className="px-4 py-2 bg-slate-100 hover:bg-brand-100 text-slate-700 hover:text-brand-700 rounded-xl text-sm font-medium transition-all">
                    {filter}
                  </button>
                ))}
              </div>

              {/* Available Tasks */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-slate-800 text-lg flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Available Tasks ({dashboard.availableTasks.length})
                </h3>
                {dashboard.availableTasks.length > 0 ? (
                  dashboard.availableTasks.map(task => (
                    <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                  ))
                ) : (
                  <div className="text-center py-12 glass-card rounded-3xl">
                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No available tasks</h3>
                    <p className="text-slate-500 mb-4">New tasks will appear here when clients post them.</p>
                    <div className="text-sm text-slate-400">
                      💡 Tip: Stay online to get notified of urgent tasks first!
                    </div>
                  </div>
                )}
              </div>

              {/* Active Tasks */}
              {dashboard.activeTasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-slate-800 text-lg flex items-center gap-2">
                    <Clock size={20} className="text-amber-600" />
                    Active Tasks ({dashboard.activeTasks.length})
                  </h3>
                  {dashboard.activeTasks.map(task => (
                    <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Performance Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-3xl text-center">
                  <Target size={32} className="mx-auto mb-4 text-blue-600" />
                  <div className="text-3xl font-black text-slate-900 mb-2">94%</div>
                  <div className="text-sm font-bold text-slate-500 uppercase mb-1">Acceptance Rate</div>
                  <div className="text-xs text-green-600 font-medium">+2% from last week</div>
                </div>

                <div className="glass-card p-6 rounded-3xl text-center">
                  <Clock size={32} className="mx-auto mb-4 text-green-600" />
                  <div className="text-3xl font-black text-slate-900 mb-2">18m</div>
                  <div className="text-sm font-bold text-slate-500 uppercase mb-1">Avg Response</div>
                  <div className="text-xs text-green-600 font-medium">Below 20m target</div>
                </div>

                <div className="glass-card p-6 rounded-3xl text-center">
                  <CheckCircle size={32} className="mx-auto mb-4 text-purple-600" />
                  <div className="text-3xl font-black text-slate-900 mb-2">96%</div>
                  <div className="text-sm font-bold text-slate-500 uppercase mb-1">Completion Rate</div>
                  <div className="text-xs text-green-600 font-medium">Above 95% target</div>
                </div>

                <div className="glass-card p-6 rounded-3xl text-center">
                  <Star size={32} className="mx-auto mb-4 text-amber-600" />
                  <div className="text-3xl font-black text-slate-900 mb-2">4.8</div>
                  <div className="text-sm font-bold text-slate-500 uppercase mb-1">Avg Rating</div>
                  <div className="text-xs text-green-600 font-medium">Top 10% of messengers</div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Performance Trends (Last 30 Days)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-black text-green-600 mb-2">+12%</div>
                    <div className="text-sm text-slate-600">Tasks Completed</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="w-12/12 h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-600 mb-2">+8%</div>
                    <div className="text-sm text-slate-600">Response Time</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="w-10/12 h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-purple-600 mb-2">+5%</div>
                    <div className="text-sm text-slate-600">Customer Satisfaction</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="w-9/12 h-full bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Star size={20} className="text-amber-600" />
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {[
                    { rating: 5, comment: "Excellent service! Very punctual and professional.", client: "Sarah M.", time: "2 hours ago" },
                    { rating: 5, comment: "Package delivered safely and quickly. Will use again!", client: "John D.", time: "1 day ago" },
                    { rating: 4, comment: "Good service overall, just a bit late due to traffic.", client: "Mary K.", time: "2 days ago" }
                  ].map((review, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-amber-600">{review.rating}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{review.client}</span>
                          <span className="text-xs text-slate-500">{review.time}</span>
                        </div>
                        <p className="text-sm text-slate-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Earnings Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet size={32} className="text-green-600" />
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-2">${dashboard.earnings.totalEarnings.toFixed(2)}</div>
                  <div className="text-sm text-slate-500 font-medium">Total Earnings</div>
                  <div className="text-xs text-green-600 font-medium mt-1">+15% from last month</div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={32} className="text-blue-600" />
                    <Timer size={20} className="text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-2">${dashboard.earnings.pendingPayouts.toFixed(2)}</div>
                  <div className="text-sm text-slate-500 font-medium">Pending Payouts</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Paid every Friday</div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <Heart size={32} className="text-purple-600" />
                    <Sparkles size={20} className="text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-2">${dashboard.earnings.tipsReceived.toFixed(2)}</div>
                  <div className="text-sm text-slate-500 font-medium">Tips Received</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">Avg $2.50 per delivery</div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-600" />
                  Earnings Breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    { category: 'Standard Deliveries', amount: 245.50, percentage: 65, color: 'bg-blue-500' },
                    { category: 'Priority/Express', amount: 98.25, percentage: 25, color: 'bg-amber-500' },
                    { category: 'Tips & Bonuses', amount: 125.50, percentage: 10, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-900">{item.category}</span>
                          <span className="font-bold text-slate-900">${item.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCard size={20} />
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  {dashboard.earnings.transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {transaction.type === 'credit' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{transaction.description}</div>
                          <div className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                        <div className={`text-xs capitalize px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'routes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Route Optimization */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Navigation size={20} className="text-blue-600" />
                  Route Optimization
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <span className="font-medium text-slate-900">Optimal Route Found</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">2.4km saved</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Current Route:</strong> CBD → Avondale → Borrowdale<br />
                      <strong>Optimized:</strong> CBD → Borrowdale → Avondale
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Fuel Efficiency</span>
                      <span className="font-bold text-slate-900">87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Time Saved</span>
                      <span className="font-bold text-slate-900">12 mins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">CO₂ Reduced</span>
                      <span className="font-bold text-slate-900">0.3kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Route Tracking */}
              {dashboard.activeTasks.length > 0 && (
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-red-600" />
                    Active Route Tracking
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-slate-900 text-lg">{dashboard.activeTasks[0].title}</div>
                        <div className="text-slate-600">En route to delivery location</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-600">8 mins</div>
                        <div className="text-sm text-slate-500">ETA</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600">Your Location</span>
                      </div>
                      <div className="flex-1 h-1 bg-slate-200 rounded">
                        <div className="h-1 bg-blue-500 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">Pickup Point</span>
                      </div>
                      <div className="flex-1 h-1 bg-slate-200 rounded">
                        <div className="h-1 bg-purple-500 rounded w-1/2"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-600">Drop-off</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/map', { state: { selectedGigId: dashboard.activeTasks[0].id } })}
                      className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors"
                    >
                      View Full Route Map
                    </button>
                  </div>
                </div>
              )}

              {/* Route History */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity size={20} />
                  Route History
                </h3>
                <div className="space-y-4">
                  {[
                    { route: 'CBD → Avondale', distance: '8.2km', time: '32 mins', efficiency: 'High', date: 'Today' },
                    { route: 'Borrowdale → CBD', distance: '12.5km', time: '45 mins', efficiency: 'Medium', date: 'Yesterday' },
                    { route: 'Avondale → Highlands', distance: '15.8km', time: '52 mins', efficiency: 'High', date: '2 days ago' }
                  ].map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Navigation size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{route.route}</div>
                          <div className="text-sm text-slate-500">{route.distance} • {route.time} • {route.date}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        route.efficiency === 'High' ? 'bg-green-100 text-green-700' :
                        route.efficiency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {route.efficiency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'communication' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Communication Hub */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-blue-600" />
                    Client Messages
                  </h3>
                  <div className="space-y-3">
                    {[
                      { client: 'Sarah Johnson', message: 'Package is ready for pickup', time: '5 mins ago', urgent: true },
                      { client: 'Mike Chen', message: 'Please call when you arrive', time: '1 hour ago', urgent: false },
                      { client: 'Anna Davis', message: 'Thanks for the quick delivery!', time: '2 hours ago', urgent: false }
                    ].map((msg, index) => (
                      <div key={index} className={`p-3 rounded-xl ${msg.urgent ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-900">{msg.client}</span>
                          <span className="text-xs text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-slate-600">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                    Open Messages
                  </button>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Phone size={20} className="text-green-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors text-left">
                      📞 Call Client Support
                    </button>
                    <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors text-left">
                      📍 Share Location Update
                    </button>
                    <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-medium transition-colors text-left">
                      📦 Confirm Package Received
                    </button>
                    <button className="w-full p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-medium transition-colors text-left">
                      🚨 Report Delivery Issue
                    </button>
                  </div>
                </div>
              </div>

              {/* Communication Guidelines */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-green-600" />
                  Communication Guidelines
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Always Confirm Receipt</div>
                        <div className="text-sm text-slate-500">Take photos of packages before/after delivery</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Be Professional</div>
                        <div className="text-sm text-slate-500">Use polite language and proper etiquette</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Update Regularly</div>
                        <div className="text-sm text-slate-500">Keep clients informed of delivery progress</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle size={16} className="text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Don't Share Personal Info</div>
                        <div className="text-sm text-slate-500">Never share contact details or location without permission</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'safety' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Safety Status */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl text-center">
                  <Shield size={32} className="mx-auto mb-4 text-green-600" />
                  <div className="text-2xl font-black text-slate-900 mb-2">Safe</div>
                  <div className="text-sm text-slate-500 font-medium">Current Status</div>
                  <div className="text-xs text-green-600 font-medium mt-1">All systems operational</div>
                </div>

                <div className="glass-card p-6 rounded-3xl text-center">
                  <Battery size={32} className="mx-auto mb-4 text-blue-600" />
                  <div className="text-2xl font-black text-slate-900 mb-2">87%</div>
                  <div className="text-sm text-slate-500 font-medium">Vehicle Battery</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">Good condition</div>
                </div>

                <div className="glass-card p-6 rounded-3xl text-center">
                  <Wifi size={32} className="mx-auto mb-4 text-purple-600" />
                  <div className="text-2xl font-black text-slate-900 mb-2">Strong</div>
                  <div className="text-sm text-slate-500 font-medium">Network Signal</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">5G Connected</div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldAlert size={20} className="text-red-600" />
                  Emergency Contacts & Resources
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert size={20} className="text-red-600" />
                        <span className="font-bold text-red-900">Emergency Button</span>
                      </div>
                      <p className="text-sm text-red-700 mb-3">For immediate danger or medical emergencies</p>
                      <button className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
                        🚨 Emergency SOS
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone size={20} className="text-blue-600" />
                        <span className="font-bold text-blue-900">Atumwa Support</span>
                      </div>
                      <p className="text-sm text-blue-700">24/7 support for delivery issues</p>
                      <div className="text-sm font-bold text-blue-900 mt-1">+263 123 456 789</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck size={20} className="text-green-600" />
                        <span className="font-bold text-green-900">Safety Checklist</span>
                      </div>
                      <div className="space-y-2 text-sm text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} />
                          <span>Vehicle inspection completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} />
                          <span>Emergency kit present</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} />
                          <span>App location sharing enabled</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle size={20} className="text-amber-600" />
                        <span className="font-bold text-amber-900">Report Incident</span>
                      </div>
                      <p className="text-sm text-amber-700 mb-3">Report safety concerns or incidents</p>
                      <button className="w-full bg-amber-600 text-white py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors">
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Safety Best Practices
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Vehicle Safety:</strong> Always check brakes, lights, and tire pressure before starting
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Package Handling:</strong> Never leave packages unattended or accept suspicious items
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Client Verification:</strong> Always call clients to confirm identity when needed
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Location Sharing:</strong> Keep location sharing enabled for safety monitoring
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Emergency Kit:</strong> Carry first aid kit, flashlight, and emergency contacts
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm text-slate-600">
                        <strong>Weather Awareness:</strong> Check weather conditions and adjust routes accordingly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'help' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Help Resources */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <HelpCircle size={20} className="text-blue-600" />
                    Quick Help
                  </h3>
                  <div className="space-y-3">
                    {[
                      'How to accept tasks',
                      'Payment and payout schedule',
                      'Route optimization tips',
                      'Customer service guidelines',
                      'Vehicle maintenance checks',
                      'Emergency procedures'
                    ].map((help, index) => (
                      <button key={index} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                        <div className="font-medium text-slate-900">{help}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-green-600" />
                    Training Resources
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="font-medium text-green-900 mb-1">Safety Training</div>
                      <div className="text-sm text-green-700">Complete required safety modules</div>
                      <div className="w-full h-2 bg-green-200 rounded-full mt-2 overflow-hidden">
                        <div className="w-8/10 h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="font-medium text-blue-900 mb-1">Customer Service</div>
                      <div className="text-sm text-blue-700">Learn best practices for client communication</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="font-medium text-purple-900 mb-1">Route Optimization</div>
                      <div className="text-sm text-purple-700">Advanced routing techniques</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Tickets */}
              <div className="glass-card p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Support Tickets
                  </h3>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                    New Ticket
                  </button>
                </div>

                {supportTickets.filter((t: any) => t.sender?.id === user.id).length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.filter((t: any) => t.sender?.id === user.id).map((ticket: any) => (
                      <div key={ticket.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-center justify-between hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">
                            {ticket.category === 'payment' ? '💰' : ticket.category === 'late_delivery' ? '⏰' : ticket.category === 'safety' ? '🛡️' : '💬'}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-900">{ticket.subject}</span>
                              <span className="text-[10px] font-black text-slate-400">#{ticket.id}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                                ticket.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {ticket.status}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">• {new Date(ticket.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Support</p>
                          <p className="text-xs font-bold text-slate-600">Atumwa Trust & Safety</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No active support tickets. We're here if you need us!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
