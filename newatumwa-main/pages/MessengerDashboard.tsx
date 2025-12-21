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
  Signal
} from 'lucide-react';

interface TaskCardProps {
  task: Gig;
  onAction: (action: string, taskId: string) => void;
  showMap?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction, showMap = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative p-6 pb-4">
        {task.urgency === 'priority' && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap size={12} />
            PRIORITY
          </div>
        )}
        {task.urgency === 'express' && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <TrendingUp size={12} />
            EXPRESS
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
            📦
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-red-500" />
                <span className="font-medium">{task.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-green-500" />
                <span className="font-bold text-green-600">${task.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pickup Location</div>
            <div className="text-sm font-medium text-slate-900">{task.locationStart}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Drop-off Location</div>
            <div className="text-sm font-medium text-slate-900">{task.locationEnd}</div>
          </div>
        </div>

        {task.timeWindow && (
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time Window</div>
              <div className="text-sm font-medium text-slate-900">
                {new Date(task.timeWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(task.timeWindow.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <button
            onClick={() => onAction('accept', task.id)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Accept Task
          </button>
          <button
            onClick={() => onAction('message', task.id)}
            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </motion.div>
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
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'earnings' | 'timeline' | 'help'>('available');
  const [showGreeting, setShowGreeting] = useState(() => {
    return !sessionStorage.getItem('welcome_shown_after_login');
  });

  const dismissGreeting = () => {
    setShowGreeting(false);
    sessionStorage.setItem('welcome_shown_after_login', 'true');
  };

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        dismissGreeting();
      }, 4000);
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
                  <Bike size={64} className="text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black mb-4 leading-tight"
              >
                Welcome back,
                <span className="block text-white/90 text-3xl md:text-4xl mt-2 font-bold">
                  {user?.name?.split(' ')[0] || 'Courier'}!
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xl text-white/90 mb-8 font-medium"
              >
                Ready to deliver excellence today?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">Network: Online</span>
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
                className="text-4xl lg:text-6xl font-black text-slate-900 mb-2"
              >
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 font-medium"
              >
                Ready to deliver excellence today?
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold">Online & Available</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 group hover:bg-white/90 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{dashboard.completedCount}</div>
                  <div className="text-sm text-slate-500 font-medium">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 group hover:bg-white/90 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">${dashboard.earnings.thisWeek.toFixed(0)}</div>
                  <div className="text-sm text-slate-500 font-medium">This Week</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 group hover:bg-white/90 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                  <Star size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{dashboard.rating}</div>
                  <div className="text-sm text-slate-500 font-medium">Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 group hover:bg-white/90 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                  <Zap size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">2.4km</div>
                  <div className="text-sm text-slate-500 font-medium">Avg Distance</div>
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
            <button
              onClick={() => handleQuickAction('start_route')}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Navigation size={24} />
                </div>
                <span className="font-bold text-center">Start Route</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('quick_message')}
              className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <MessageSquare size={24} />
                </div>
                <span className="font-bold text-center">Messages</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('quick_message')}
              className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Phone size={24} />
                </div>
                <span className="font-bold text-center">Call Client</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('emergency')}
              className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ShieldAlert size={24} />
                </div>
                <span className="font-bold text-center">Emergency</span>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {dashboard.activeTasks.length > 0 && dashboard.activeTasks[0].coordinates && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <MapContainer
                    center={[dashboard.activeTasks[0].coordinates.lat, dashboard.activeTasks[0].coordinates.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    <Polyline
                      positions={[
                        [-17.835, 31.042],
                        [dashboard.activeTasks[0].coordinates.lat, dashboard.activeTasks[0].coordinates.lng]
                      ]}
                      pathOptions={{ color: '#ffffff', weight: 4, opacity: 0.8 }}
                    />
                    <Marker position={[-17.835, 31.042]} icon={L.divIcon({ className: 'courier-dot', html: '<div class="w-4 h-4 bg-white rounded-full border-4 border-blue-500 animate-pulse"></div>' })} />
                  </MapContainer>
                </div>
                <div className="absolute inset-0 z-10 p-6 lg:p-8 flex flex-col justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="flex justify-between items-start w-full">
                    <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2">
                      <Navigation size={16} />
                      <span className="font-bold">Active Mission</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl">
                      <span className="text-white font-bold">ETA: 8 mins</span>
                    </div>
                  </div>
                  <div className="text-white">
                    <p className="text-2xl lg:text-3xl font-black mb-2">{dashboard.activeTasks[0].title}</p>
                    <p className="text-lg opacity-90">En Route • 0.8 km remaining</p>
                    <button
                      onClick={() => navigate('/map', { state: { selectedGigId: dashboard.activeTasks[0].id } })}
                      className="mt-4 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                    >
                      View Full Route
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-2 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${activeTab === 'available' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}
              >
                <Package size={16} />
                Available Tasks ({dashboard.availableTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${activeTab === 'active' ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}
              >
                <Clock size={16} />
                Active Tasks ({dashboard.activeTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${activeTab === 'earnings' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}
              >
                <Wallet size={16} />
                Earnings
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${activeTab === 'timeline' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}
              >
                <Calendar size={16} />
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('help')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${activeTab === 'help' ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}
              >
                <HelpCircle size={16} />
                Support ({supportTickets.filter((t: any) => t.sender?.id === user.id).length})
              </button>
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === 'available' && (
                <div>
                  {dashboard.availableTasks.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {dashboard.availableTasks.map(task => (
                        <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Package className="mx-auto text-slate-300 mb-4" size={64} />
                      <h3 className="text-2xl font-bold text-slate-600 mb-2">No Available Tasks</h3>
                      <p className="text-slate-500">Check back later or expand your service area.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'active' && (
                <div>
                  {dashboard.activeTasks.length > 0 ? (
                    <div className="space-y-6">
                      {dashboard.activeTasks.map(task => (
                        <TaskCard key={task.id} task={task} onAction={handleTaskAction} showMap />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Clock className="mx-auto text-slate-300 mb-4" size={64} />
                      <h3 className="text-2xl font-bold text-slate-600 mb-2">No Active Tasks</h3>
                      <p className="text-slate-500">Accept a task to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-2xl text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Wallet size={32} />
                        <TrendingUp size={20} />
                      </div>
                      <div className="text-3xl font-black mb-2">${dashboard.earnings.totalEarnings.toFixed(2)}</div>
                      <div className="text-green-100">Total Earnings</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Clock size={32} />
                        <Timer size={20} />
                      </div>
                      <div className="text-3xl font-black mb-2">${dashboard.earnings.pendingPayouts.toFixed(2)}</div>
                      <div className="text-blue-100">Pending Payouts</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Heart size={32} />
                        <Sparkles size={20} />
                      </div>
                      <div className="text-3xl font-black mb-2">${dashboard.earnings.tipsReceived.toFixed(2)}</div>
                      <div className="text-purple-100">Tips Received</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CreditCard size={20} />
                      Recent Transactions
                    </h3>
                    <div className="space-y-4">
                      {dashboard.earnings.transactions.map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
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
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Navigation size={20} className="text-blue-600" />
                      Route Tracking
                    </h3>
                    {dashboard.activeTasks.length > 0 ? (
                      <div className="bg-white p-6 rounded-xl shadow-sm">
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
                        <div className="flex items-center gap-4 text-sm">
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
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No active deliveries to track.
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Activity size={20} />
                      Activity Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">Task Completed</div>
                          <div className="text-sm text-slate-500">CBD Pharmacy Pickup • 2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Navigation className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">Route Started</div>
                          <div className="text-sm text-slate-500">Heading to pickup location • 2.5 hours ago</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Package className="text-purple-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">Task Accepted</div>
                          <div className="text-sm text-slate-500">Urgent Prescription Pickup • 3 hours ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
                        <Shield size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Support Center</h3>
                        <p className="text-slate-600">Get help with deliveries, payments, or technical issues</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                          <AlertTriangle className="text-red-600" size={20} />
                        </div>
                        <div className="font-bold text-slate-900">Report Issue</div>
                        <div className="text-sm text-slate-500">Delivery problems or safety concerns</div>
                      </button>

                      <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                          <HelpCircle className="text-blue-600" size={20} />
                        </div>
                        <div className="font-bold text-slate-900">Get Help</div>
                        <div className="text-sm text-slate-500">FAQs and troubleshooting</div>
                      </button>

                      <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <Phone className="text-purple-600" size={20} />
                        </div>
                        <div className="font-bold text-slate-900">Contact Us</div>
                        <div className="text-sm text-slate-500">Speak to our support team</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Your Support Tickets</h3>
                    {supportTickets.filter((t: any) => t.sender?.id === user.id).length > 0 ? (
                      <div className="space-y-4">
                        {supportTickets.filter((t: any) => t.sender?.id === user.id).map((ticket: any) => (
                          <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ticket.urgency === 'critical' ? 'bg-red-100 text-red-600' : ticket.urgency === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {ticket.category === 'accident' ? '🚨' : ticket.category === 'safety' ? '🛡️' : ticket.category === 'payment' ? '💰' : '💬'}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{ticket.subject}</div>
                                  <div className="text-sm text-slate-500">#{ticket.id} • {new Date(ticket.timestamp).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : ticket.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {ticket.status}
                              </div>
                            </div>
                            <p className="text-slate-600">{ticket.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShieldCheck className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No Active Support Tickets</h3>
                        <p className="text-slate-500">All your deliveries are going smoothly!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
