import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_GIGS } from '../constants';
import { MarketRatesCard } from '../components/MarketRatesCard';
import { Gig, ClientDashboard as ClientDashboardType, TaskStatus } from '../types';
import {
  MapPin,
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  TrendingUp,
  Plus,
  Settings,
  MessageSquare,
  Bell,
  Wallet,
  BarChart3,
  Calendar,
  Zap,
  Home,
  Briefcase,
  User,
  RotateCcw,
  CreditCard,
  History,
  Bookmark,
  MapIcon,
  HelpCircle,
  Send,
  Share,
  X,
  Flag,
  ShieldAlert
} from 'lucide-react';

// Generate user-specific mock data for clients
const generateClientDashboard = (userId: string): ClientDashboardType => {
  const userGigs = MOCK_GIGS.filter(g => g.postedBy.id === userId);
  const activeTasks = userGigs.filter(g => g.status === 'open' || g.status === 'in-progress').slice(0, 3);
  const upcomingTasks = userGigs.filter(g => g.status === 'open').slice(0, 2);
  const completedTasks = userGigs.filter(g => g.status === 'completed').slice(0, 15);

  const recurringTasks = [
    {
      id: 'rec1',
      templateId: 'temp1',
      schedule: {
        frequency: 'weekly' as const,
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        timeOfDay: '09:00',
        nextRun: '2025-12-18T09:00:00Z'
      },
      clientId: userId,
      isActive: true,
      createdTasks: ['g1', 'g2', 'g3']
    }
  ];

  const templates = [
    {
      id: 'temp1',
      name: 'Weekly Pharmacy Run',
      description: 'Regular prescription pickup from downtown pharmacy',
      type: 'prescription' as const,
      stops: [
        {
          type: 'pickup' as const,
          location: 'Greenwood Pharmacy',
          address: 'Fife Ave, Harare',
          instructions: 'Ask for prescription under Johnson'
        }
      ],
      checklist: [
        { id: 'chk1', text: 'Confirm prescription is ready', completed: false, required: true },
        { id: 'chk2', text: 'Check expiry date', completed: false, required: false }
      ],
      estimatedPrice: 15,
      paymentMethod: 'cash_usd' as const,
      createdBy: userId,
      isPublic: false,
      usageCount: 12 + Math.floor(Math.random() * 20)
    },
    {
      id: 'temp2',
      name: 'Grocery Shopping',
      description: 'Weekly grocery pickup from local supermarket',
      type: 'shopping' as const,
      stops: [
        {
          type: 'pickup' as const,
          location: 'Food Lovers Market',
          address: 'Avondale, Harare',
          instructions: 'Call when you arrive for assistance'
        }
      ],
      checklist: [
        { id: 'chk1', text: 'Review shopping list', completed: false, required: true },
        { id: 'chk2', text: 'Check item availability', completed: false, required: false },
        { id: 'chk3', text: 'Verify total cost', completed: false, required: true }
      ],
      estimatedPrice: 45,
      paymentMethod: 'ecocash' as const,
      createdBy: userId,
      isPublic: true,
      usageCount: 8 + Math.floor(Math.random() * 15)
    }
  ];

  const savedAddresses = [
    { id: 'addr1', name: 'Home', address: 'Avondale, Harare', isDefault: true },
    { id: 'addr2', name: 'Office', address: 'CBD, Harare', isDefault: false },
    { id: 'addr3', name: 'Pharmacy', address: 'Greenwood Pharmacy, Fife Ave', isDefault: false }
  ];

  return {
    activeTasks,
    upcomingTasks,
    completedTasks,
    recurringTasks,
    templates,
    savedAddresses,
    credits: 25.50 + Math.random() * 50,
    totalSpent: 450.75 + Math.random() * 200,
    completedTasksCount: completedTasks.length
  };
};

// Mock data for client dashboard
const MOCK_CLIENT_DASHBOARD: ClientDashboardType = {
  activeTasks: MOCK_GIGS.filter(g => g.postedBy.id === 'client1' && (g.status === 'open' || g.status === 'in-progress')).slice(0, 3),
  upcomingTasks: MOCK_GIGS.filter(g => g.postedBy.id === 'client1' && g.status === 'open').slice(0, 2),
  completedTasks: MOCK_GIGS.filter(g => g.postedBy.id === 'client1' && g.status === 'completed').slice(0, 15),
  recurringTasks: [
    {
      id: 'rec1',
      templateId: 'temp1',
      schedule: {
        frequency: 'weekly',
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        timeOfDay: '09:00',
        nextRun: '2025-12-18T09:00:00Z'
      },
      clientId: 'client1',
      isActive: true,
      createdTasks: ['g1', 'g2', 'g3']
    }
  ],
  templates: [
    {
      id: 'temp1',
      name: 'Weekly Pharmacy Run',
      description: 'Regular prescription pickup from downtown pharmacy',
      type: 'prescription',
      stops: [
        {
          type: 'pickup',
          location: 'Greenwood Pharmacy',
          address: 'Fife Ave, Harare',
          instructions: 'Ask for prescription under Johnson'
        }
      ],
      checklist: [
        { id: 'chk1', text: 'Confirm prescription is ready', completed: false, required: true },
        { id: 'chk2', text: 'Check expiry date', completed: false, required: false }
      ],
      estimatedPrice: 15,
      paymentMethod: 'cash_usd',
      createdBy: 'client1',
      isPublic: false,
      usageCount: 12
    }
  ],
  savedAddresses: [
    { id: 'addr1', name: 'Home', address: 'Avondale, Harare', isDefault: true },
    { id: 'addr2', name: 'Office', address: 'CBD, Harare', isDefault: false },
    { id: 'addr3', name: 'Pharmacy', address: 'Greenwood Pharmacy, Fife Ave', isDefault: false }
  ],
  credits: 25.50,
  totalSpent: 450.75,
  completedTasksCount: 23
};

interface TaskCardProps {
  task: Gig;
  onAction: (action: string, taskId: string) => void;
  showStatus?: boolean;
  sharedLocations?: string[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction, showStatus = true, sharedLocations = [] }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-amber-100 text-amber-700';
      case 'purchased': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress': return <Clock size={16} className="text-amber-600" />;
      default: return <Briefcase size={16} className="text-slate-500" />;
    }
  };

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
            {task.assignedTo && (
              <>
                <span>•</span>
                <span>Assigned to messenger</span>
              </>
            )}
          </div>
        </div>
        {showStatus && (
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            <span>{task.status.replace('-', ' ')}</span>
          </div>
        )}
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
        {task.assignedTo && (
          <div className="text-sm text-slate-600">
            <strong>Messenger:</strong> {task.assignedTo}
          </div>
        )}
      </div>

      {task.stops && task.stops.length > 2 && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-700 mb-1">Multi-stop delivery ({task.stops.length} stops)</div>
          <div className="text-xs text-blue-600">
            Optimized route calculated
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {task.status === 'open' && (
          <>
            <button
              onClick={() => onAction('edit', task.id)}
              className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Edit Task
            </button>
            <button
              onClick={() => onAction('cancel', task.id)}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Cancel
            </button>
          </>
        )}

        {(task.status === 'in-progress' || task.status === 'purchased' || task.status === 'delivered') && (
          <>
            <button
              onClick={() => onAction('track', task.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={16} />
              Track
            </button>
            <button
              onClick={() => onAction('share_location', task.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sharedLocations.includes(task.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <Share size={16} />
            </button>
            <button
              onClick={() => onAction('message', task.id)}
              className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <MessageSquare size={16} />
            </button>
            <button
              onClick={() => onAction('report', task.id)}
              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              title="Report Issue"
            >
              <Flag size={16} />
            </button>
          </>
        )}

        {task.status === 'completed' && (
          <>
            <button
              onClick={() => onAction('reorder', task.id)}
              className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reorder
            </button>
            <button
              onClick={() => onAction('rate', task.id)}
              className="bg-amber-50 text-amber-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              <Star size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};


export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { gigs, walletHistory, inquiries, createTicket, supportTickets } = useData();
  // Global Data
  const navigate = useNavigate();

  // Filter Gigs for this Client
  const myGigs = gigs.filter(g => g.postedBy.id === user?.id);

  const dashboard = {
    activeTasks: myGigs.filter(g => g.status === 'open' || g.status === 'in-progress'),
    upcomingTasks: myGigs.filter(g => g.status === 'open'),
    completedTasks: myGigs.filter(g => g.status === 'completed'),
    recurringTasks: [
      // ... existing mock data logic ...
      {
        id: 'rec1',
        templateId: 'temp1',
        schedule: {
          frequency: 'weekly' as const,
          daysOfWeek: [1, 3, 5],
          timeOfDay: '09:00',
          nextRun: '2025-12-18T09:00:00Z'
        },
        clientId: user?.id || '',
        isActive: true,
        createdTasks: ['g1', 'g2']
      }
    ],
    templates: MOCK_CLIENT_DASHBOARD.templates,
    savedAddresses: MOCK_CLIENT_DASHBOARD.savedAddresses,
    credits: walletHistory.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 150),
    totalSpent: 450.75,
    completedTasksCount: myGigs.filter(g => g.status === 'completed').length
  };

  const [showAskPlace, setShowAskPlace] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTask, setReportTask] = useState<Gig | null>(null);
  const [reportCategory, setReportCategory] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'timeline' | 'earnings' | 'help'>('available');
  const [askPlaceQuery, setAskPlaceQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askResponse, setAskResponse] = useState<string | null>(null);
  const [sharedLocations, setSharedLocations] = useState<string[]>([]);
  const [showGreeting, setShowGreeting] = useState(() => {
    return !sessionStorage.getItem('welcome_shown_after_login');
  });

  const dismissGreeting = () => {
    setShowGreeting(false);
    sessionStorage.setItem('welcome_shown_after_login', 'true');
  };

  // Auto-dismiss greeting after 4 seconds
  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        dismissGreeting();
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  if (!user || user.role !== 'client') {
    return <div>Access denied</div>;
  }

  const { updateGigStatus, broadcastInquiry, exchangeRates } = useData();

  const handleTaskAction = (action: string, taskId: string) => {
    // ... existing handler ...
    // Just re-using existing logic logic but short-circuited for brevity in replacement
    switch (action) {
      case 'edit':
        alert('Edit functionality would open a modal here.');
        break;
      case 'cancel':
        if (window.confirm("Are you sure you want to cancel this task?")) {
          updateGigStatus(taskId, 'cancelled');
        }
        break;
      case 'track':
        navigate('/map', { state: { selectedGigId: taskId } });
        break;
      case 'report':
        const taskObj = gigs.find(g => g.id === taskId);
        if (taskObj) {
          setReportTask(taskObj);
          setShowReportModal(true);
        }
        break;
      case 'share_location':
        setSharedLocations(prev =>
          prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
        alert(sharedLocations.includes(taskId) ? 'Location sharing stopped' : 'Location shared with messenger');
        break;
      case 'message':
        const gig = gigs.find(g => g.id === taskId);
        if (gig && gig.assignedTo) {
          navigate('/messages', { state: { recipientId: gig.assignedTo, recipientName: 'Messenger', gigId: taskId } });
        } else {
          alert('Task is not assigned yet.');
        }
        break;
      case 'reorder':
        alert('Reorder feature would duplicate this gig details and open post modal.');
        break;
      case 'rate':
        alert('Rating feature would open a review modal.');
        break;
    }
  };

  const submitReport = () => {
    if (!reportCategory || !reportDescription || !user) {
      alert('Please fill in all fields.');
      return;
    }

    createTicket({
      id: `ticket-${Date.now()}`,
      sender: user,
      subject: reportCategory,
      message: reportDescription,
      category: reportCategory as any, // Assuming category matches subject for simplicity
      status: 'open',
      timestamp: new Date().toISOString(),
      relatedGigId: reportTask?.id || null,
    });

    setReportCategory('');
    setReportDescription('');
    setReportTask(null);
    setShowReportModal(false);
    alert('Your report has been submitted. We will get back to you shortly.');
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

  const inProgressGig = myGigs.find(g => g.status === 'in-progress');

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
                  <div className="text-4xl">👋</div>
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
                  {user?.name?.split(' ')[0] || 'Client'}!
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xl text-white/80 mb-8 font-medium"
              >
                Ready to get things done today? Your messengers are active.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">Platform Status: Optimal</span>
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
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Client Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your errands, track deliveries, and save time.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAskPlace(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 backdrop-blur text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <HelpCircle size={16} />
            Ask About Place
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gigs', { state: { openPostModal: true } })}
            className="bg-brand-600/90 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
          >
            <Plus size={16} />
            Post New Task
          </motion.button>
        </div>
      </div>

      {/* Stats Cards & Market Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Clock size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">{dashboard.activeTasks.length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Ops</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">{dashboard.completedTasksCount}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                <DollarSign size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-tight">${dashboard.totalSpent.toFixed(0)}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mo. Impact</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <MarketRatesCard />
        </div>
      </div >

      {/* Tabs */}
      < div className="glass-card rounded-2xl overflow-hidden" >
        <div className="flex border-b border-slate-100/50">
          {[
            { key: 'available', label: 'Available Tasks' },
            { key: 'active', label: 'Active Tasks' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'earnings', label: 'Earnings' },
            { key: 'help', label: 'Support' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab.key
                ? 'text-brand-600'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[400px]">
          {activeTab === 'available' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Active Tasks */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-slate-800 text-lg">Active & Upcoming Tasks</h3>
                {dashboard.activeTasks.length > 0 ? (
                  dashboard.activeTasks.map(task => (
                    <TaskCard key={task.id} task={task} onAction={handleTaskAction} sharedLocations={sharedLocations} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto text-slate-300" size={48} />
                    <h3 className="text-lg font-medium text-slate-600 mt-4">No active tasks</h3>
                    <p className="text-slate-500 mt-2">Post a new task to get started.</p>
                    <button
                      onClick={() => navigate('/gigs', { state: { openPostModal: true } })}
                      className="mt-4 bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                    >
                      Post New Task
                    </button>
                  </div>
                )}
              </div>

              {/* Recurring Tasks - Simplified for implementation speed, retaining logic */}
              {dashboard.recurringTasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Recurring Tasks</h3>
                  {dashboard.recurringTasks.map(recurring => (
                    <div key={recurring.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Weekly Pharmacy Run</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${recurring.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {recurring.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">Every Monday, Wednesday, Friday at 9:00 AM</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Other tabs placeholders or simplified implementations */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-slate-800 text-lg">Completed Tasks</h3>
              {dashboard.completedTasks.length > 0 ? (
                dashboard.completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAction={handleTaskAction} sharedLocations={sharedLocations} />
                ))
              ) : (
                <p className="text-slate-500">No history available yet.</p>
              )}
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-semibold text-slate-800 text-lg">My Templates</h3>
                <button className="text-brand-600 font-bold text-sm">+ New Template</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_CLIENT_DASHBOARD.templates.map(temp => (
                  <div key={temp.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 hover:border-brand-300 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 group-hover:text-brand-700">{temp.name}</h4>
                      <div className="bg-brand-100 text-brand-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{temp.type}</div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{temp.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Regularly ${temp.estimatedPrice}</span>
                      <button className="text-brand-600 text-xs font-black uppercase tracking-widest hover:underline">Use Template</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-semibold text-slate-800 text-lg">Saved Locations</h3>
                <button className="text-brand-600 font-bold text-sm">+ Add Address</button>
              </div>
              <div className="grid gap-4">
                {MOCK_CLIENT_DASHBOARD.savedAddresses.map(addr => (
                  <div key={addr.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      {addr.name.toLowerCase().includes('home') ? '🏠' : addr.name.toLowerCase().includes('work') ? '🏢' : '📍'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{addr.name}</h4>
                      <p className="text-sm text-slate-500">{addr.address}</p>
                    </div>
                    <button className="text-slate-400 hover:text-brand-600 p-2">
                      <Settings size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Help & Support</h3>
                  <p className="text-sm text-slate-500 font-medium">Track your tickets and report platform issues.</p>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                >
                  New Support Ticket
                </button>
              </div>

              <div className="space-y-4">
                {supportTickets.filter(t => t.sender?.id === user.id).length > 0 ? (
                  supportTickets.filter(t => t.sender?.id === user.id).map(ticket => (
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
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No active support tickets. We're here if you need us!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Enhanced Full-Screen Report Modal */}
      <AnimatePresence>
        {
          showReportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/95 z-[500] backdrop-blur-xl flex items-center justify-center p-0 md:p-8 overflow-y-auto"
            >
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                className="bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col my-auto"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shadow-inner">
                      <Flag size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Support Hub</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded uppercase tracking-widest">Official Inquiry</span>
                        {reportTask && <span className="text-xs font-bold text-brand-600">Task: {reportTask.title}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowReportModal(false); setReportTask(null); }}
                    className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Issue Category</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['late_delivery', 'wrong_items', 'safety', 'payment', 'damage', 'other'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => setReportCategory(cat)}
                              className={`p-4 rounded-2xl border-2 text-left transition-all ${reportCategory === cat
                                ? 'border-brand-500 bg-brand-50'
                                : 'border-slate-100 hover:border-slate-200'
                                }`}
                            >
                              <div className="text-[10px] font-black uppercase text-slate-900">{cat.replace('_', ' ')}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[2.5rem] text-center">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                          <Plus size={24} className="text-blue-500" />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Attach Evidence</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Photos help our team resolve issues faster.</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                        <textarea
                          placeholder="Explain what happened in as much detail as possible..."
                          rows={8}
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-6 py-5 text-sm font-bold outline-none focus:border-brand-500 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 max-w-sm">
                    Our team typically reviews all reports within <span className="text-slate-900">45 minutes</span> during operational hours.
                  </p>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={() => { setShowReportModal(false); setReportTask(null); }}
                      className="flex-1 md:px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                    >
                      Discard
                    </button>
                    <button
                      onClick={submitReport}
                      className="flex-2 md:px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      Send to Support Hub <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* Ask About Place Modal */}
      {
        showAskPlace && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!isAsking) {
                setShowAskPlace(false);
                setAskResponse(null);
                setAskPlaceQuery('');
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-[2rem] shadow-2xl max-w-md w-full border border-white/20 relative"
            >
              <button
                onClick={() => {
                  setShowAskPlace(false);
                  setAskResponse(null);
                  setAskPlaceQuery('');
                }}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" size={24} />
                Ask About a Place
              </h3>
              {isAsking ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Connecting to local messengers...</p>
                </div>
              ) : askResponse ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 italic text-blue-800 text-sm">
                    "{askPlaceQuery}"
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700">
                      <span className="font-bold block mb-1">Messenger Intelligence:</span>
                      {askResponse}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAskResponse(null);
                      setAskPlaceQuery('');
                    }}
                    className="w-full mt-4 text-slate-500 text-sm font-bold hover:text-slate-800"
                  >
                    Ask something else
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    value={askPlaceQuery}
                    onChange={(e) => setAskPlaceQuery(e.target.value)}
                    placeholder="e.g., Is the pharmacy on Fife Ave open 24/7 or is there a queue?"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows={4}
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        if (askPlaceQuery.trim()) {
                          setIsAsking(true);
                          // Simulate AI/Messenger delay
                          broadcastInquiry({
                            user: user,
                            query: askPlaceQuery,
                            place: "Downtown Pharmacy (nearby)",
                            price: exchangeRates.usd_to_zig * 0.5 // Cost simulation
                          });

                          setTimeout(() => {
                            setIsAsking(false);
                            setAskResponse("Based on recent activity from 3 Atumwa messengers in that area: Yes, Greenwood Pharmacy is open until midnight today, and the current wait time is estimated at 10-15 minutes. Would you like to post a pickup request?");
                          }, 2500);
                        }
                      }}
                      className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                    >
                      Send to Messengers
                    </button>
                    <button
                      onClick={() => setShowAskPlace(false)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )
      }
    </motion.div >
  );
};
