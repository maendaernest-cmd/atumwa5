import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_GIGS, MOCK_USERS } from '../constants';
import { Gig, MessengerDashboard as MessengerDashboardType, TaskStatus } from '../types';

// Generate user-specific mock data for messengers
const generateMessengerDashboard = (userId: string): MessengerDashboardType => {
  const userGigs = MOCK_GIGS.filter(g => g.assignedTo === userId || g.status === 'open');
  const availableTasks = userGigs.filter(g => g.status === 'open' && g.assignedTo !== userId).slice(0, 5);
  const activeTasks = userGigs.filter(g => g.assignedTo === userId && (g.status === 'in-progress' || g.status === 'purchased')).slice(0, 2);
  const completedTasks = userGigs.filter(g => g.assignedTo === userId && g.status === 'completed');

  const earnings = {
    totalEarnings: 1250.50 + Math.random() * 500,
    thisWeek: 385.75 + Math.random() * 100,
    thisMonth: 1250.50 + Math.random() * 200,
    pendingPayouts: 95.25 + Math.random() * 50,
    completedTasks: completedTasks.length,
    averageRating: 4.6 + Math.random() * 0.4,
    tipsReceived: 125.50 + Math.random() * 50,
    transactions: [
      { id: 't1', date: '2025-12-17', amount: 25.50, type: 'credit' as const, description: 'Pharmacy pickup completed', status: 'completed' as const },
      { id: 't2', date: '2025-12-16', amount: 18.75, type: 'credit' as const, description: 'Grocery delivery', status: 'completed' as const },
      { id: 't3', date: '2025-12-15', amount: 45.00, type: 'credit' as const, description: 'Parcel delivery', status: 'pending' as const },
    ]
  };

  return {
    availableTasks,
    activeTasks,
    completedTasks,
    earnings,
    rating: earnings.averageRating,
    completedCount: earnings.completedTasks,
    responseRate: 90 + Math.random() * 10,
    isOnline: true,
    shiftStatus: 'available' as const
  };
};
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
  Home,
  Briefcase,
  User
} from 'lucide-react';

// Mock data for messenger dashboard
const MOCK_MESSENGER_DASHBOARD: MessengerDashboardType = {
  availableTasks: MOCK_GIGS.filter(g => g.status === 'open').slice(0, 5),
  activeTasks: MOCK_GIGS.filter(g => g.status === 'in-progress' && g.assignedTo === 'atumwa1').slice(0, 2),
  completedTasks: MOCK_GIGS.filter(g => g.status === 'completed' && g.assignedTo === 'atumwa1').slice(0, 10),
  earnings: {
    totalEarnings: 1250.50,
    thisWeek: 385.75,
    thisMonth: 1250.50,
    pendingPayouts: 95.25,
    completedTasks: 47,
    averageRating: 4.8,
    tipsReceived: 125.50,
    transactions: [
      { id: 't1', date: '2025-12-17', amount: 25.50, type: 'credit', description: 'Pharmacy pickup completed', status: 'completed' },
      { id: 't2', date: '2025-12-16', amount: 18.75, type: 'credit', description: 'Grocery delivery', status: 'completed' },
      { id: 't3', date: '2025-12-15', amount: 45.00, type: 'credit', description: 'Parcel delivery', status: 'pending' },
    ]
  },
  rating: 4.8,
  completedCount: 47,
  responseRate: 94,
  isOnline: true,
  shiftStatus: 'available'
};

interface TaskCardProps {
  task: Gig;
  onAction: (action: string, taskId: string) => void;
  showMap?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction, showMap = false }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'purchased': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'priority': return <Zap size={14} className="text-red-500" />;
      case 'express': return <TrendingUp size={14} className="text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800">{task.title}</h3>
            {getUrgencyIcon(task.urgency)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} />
            <span>{task.distance}</span>
            <span>•</span>
            <span>${task.price.toFixed(2)}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </span>
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

      {task.stops && task.stops.length > 2 && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-700 mb-1">Multi-stop task ({task.stops.length} stops)</div>
          <div className="text-xs text-blue-600">
            {task.stops.filter(s => s.completed).length} of {task.stops.length} completed
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {task.status === 'open' && (
          <button
            onClick={() => onAction('accept', task.id)}
            className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Accept Task
          </button>
        )}

        {task.status === 'in-progress' && (
          <>
            <button
              onClick={() => onAction('navigate', task.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              Navigate
            </button>
            <button
              onClick={() => onAction('mark_purchased', task.id)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Mark Purchased
            </button>
            <button
              onClick={() => onAction('deliver', task.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Deliver
            </button>
          </>
        )}

        <button
          onClick={() => onAction('message', task.id)}
          className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <MessageSquare size={16} />
        </button>
      </div>
    </div>
  );
};

import { useData } from '../context/DataContext';

export const MessengerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { gigs, walletHistory } = useData(); // Global Data
  const navigate = useNavigate();

  // Filter Gigs for this Messenger
  const availableTasks = gigs.filter(g => g.status === 'open' && g.assignedTo !== user?.id).slice(0, 5);
  const activeTasks = gigs.filter(g => g.assignedTo === user?.id && (g.status === 'in-progress' || g.status === 'purchased'));
  const completedTasks = gigs.filter(g => g.assignedTo === user?.id && g.status === 'completed');

  const dashboard = {
    availableTasks,
    activeTasks,
    completedTasks,
    earnings: {
      totalEarnings: walletHistory.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0),
      thisWeek: 385.75, // Calc from history
      thisMonth: 1250.50, // Calc from history
      pendingPayouts: 95.25,
      completedTasks: completedTasks.length,
      averageRating: 4.8,
      tipsReceived: 125.50,
      transactions: walletHistory
    },
    rating: 4.8,
    completedCount: completedTasks.length,
    responseRate: 94,
    isOnline: true,
    shiftStatus: 'available' as const
  };
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'earnings' | 'timeline'>('available');

  // Enhanced features state
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [sharedLocationWith, setSharedLocationWith] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentPhoto, setIncidentPhoto] = useState<string>('');
  const [locationHistory, setLocationHistory] = useState([
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 30), location: 'CBD Pharmacy Pickup', type: 'pickup', coords: { lat: -17.8252, lng: 31.0335 } },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 15), location: 'Avondale Delivery', type: 'delivery', coords: { lat: -17.7917, lng: 31.0483 } },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 5), location: 'Borrowdale Transit', type: 'transit', coords: { lat: -17.7650, lng: 31.0917 } },
  ]);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [parkingLocations, setParkingLocations] = useState([
    { id: 'p1', name: 'CBD Parking', coords: { lat: -17.8252, lng: 31.0335 }, parked: false },
    { id: 'p2', name: 'Avondale Mall', coords: { lat: -17.7917, lng: 31.0483 }, parked: true },
  ]);

  if (!user || user.role !== 'atumwa') {
    return <div>Access denied</div>;
  }

  const { updateGigStatus, assignGig } = useData();

  const handleTaskAction = (action: string, taskId: string) => {
    switch (action) {
      case 'accept':
        if (user) {
          assignGig(taskId, user.id);
          navigate('/map', { state: { selectedGigId: taskId } }); // Go to map after accept
        }
        break;
      case 'navigate':
        navigate('/map', { state: { selectedGigId: taskId } });
        break;
      case 'mark_purchased':
        updateGigStatus(taskId, 'purchased');
        break;
      case 'deliver':
        updateGigStatus(taskId, 'completed'); // Or 'delivered' if we want that interim state
        break;
      case 'message':
        const gig = gigs.find(g => g.id === taskId);
        if (gig) {
          navigate('/messages', { state: { recipientId: gig.postedBy.id, recipientName: gig.postedBy.name, gigId: taskId } });
        }
        break;
    }
  };

  const toggleShift = () => {
    // Handle shift toggle
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'start_route':
        if (dashboard.activeTasks.length > 0) {
          navigate('/map', { state: { selectedGigId: dashboard.activeTasks[0].id } });
        }
        break;
      case 'share_location':
        setIsSharingLocation(!isSharingLocation);
        if (!isSharingLocation && dashboard.activeTasks.length > 0) {
          // Share with current active task client
          setSharedLocationWith([dashboard.activeTasks[0].postedBy.name]);
        }
        break;
      case 'quick_message':
        // Handle quick message
        break;
      case 'emergency':
        setShowIncidentReport(true);
        break;
    }
  };

  const submitIncidentReport = () => {
    // Handle incident report submission
    alert(`Incident reported: ${incidentType} - ${incidentDescription}`);
    setShowIncidentReport(false);
    setIncidentType('');
    setIncidentDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messenger Dashboard</h1>
          <p className="text-slate-500 text-sm">Find tasks, track deliveries, and manage your earnings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${dashboard.shiftStatus === 'available'
            ? 'bg-green-100 text-green-700'
            : dashboard.shiftStatus === 'busy'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-700'
            }`}>
            <div className={`w-2 h-2 rounded-full ${dashboard.shiftStatus === 'available' ? 'bg-green-500' :
              dashboard.shiftStatus === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
            {dashboard.shiftStatus === 'available' ? 'Available' :
              dashboard.shiftStatus === 'busy' ? 'Busy' : 'Off Duty'}
          </div>
          <button
            onClick={toggleShift}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dashboard.shiftStatus === 'off'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {dashboard.shiftStatus === 'off' ? <Play size={16} /> : <Pause size={16} />}
            {dashboard.shiftStatus === 'off' ? 'Go Online' : 'Go Offline'}
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards - Messenger Focused */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">{dashboard.completedCount}</div>
              <div className="text-xs text-slate-500">Deliveries Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">${dashboard.earnings.thisWeek.toFixed(2)}</div>
              <div className="text-xs text-slate-500">This Week Earnings</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Star className="text-amber-600" size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">{dashboard.rating}</div>
              <div className="text-xs text-slate-500">Client Rating</div>
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
              <div className="text-xs text-slate-500">Avg Delivery Distance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Messengers */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Zap size={16} className="text-orange-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleQuickAction('start_route')}
            className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Navigation size={16} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Start Route</span>
          </button>

          <button
            onClick={() => handleQuickAction('share_location')}
            className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${isSharingLocation ? 'bg-blue-100 hover:bg-blue-200' : 'bg-blue-50 hover:bg-blue-100'
              }`}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {isSharingLocation ? 'Sharing Location' : 'Share Location'}
            </span>
            {isSharingLocation && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          </button>

          <button
            onClick={() => handleQuickAction('quick_message')}
            className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare size={16} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Quick Message</span>
          </button>

          <button
            onClick={() => handleQuickAction('emergency')}
            className="flex items-center gap-2 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell size={16} className="text-red-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Emergency</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'available' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Available Tasks ({dashboard.availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Active Tasks ({dashboard.activeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'timeline' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'earnings' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Earnings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-4">
              {dashboard.availableTasks.length > 0 ? (
                dashboard.availableTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto text-slate-300" size={48} />
                  <h3 className="text-lg font-medium text-slate-600 mt-4">No available tasks</h3>
                  <p className="text-slate-500 mt-2">Check back later or expand your service area.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {dashboard.activeTasks.length > 0 ? (
                dashboard.activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAction={handleTaskAction} showMap />
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto text-slate-300" size={48} />
                  <h3 className="text-lg font-medium text-slate-600 mt-4">No active tasks</h3>
                  <p className="text-slate-500 mt-2">Accept a task to get started.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold">${dashboard.earnings.totalEarnings.toFixed(2)}</p>
                    </div>
                    <Wallet size={32} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Pending Payouts</p>
                      <p className="text-2xl font-bold">${dashboard.earnings.pendingPayouts.toFixed(2)}</p>
                    </div>
                    <Clock size={32} className="text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Tips Received</p>
                      <p className="text-2xl font-bold">${dashboard.earnings.tipsReceived.toFixed(2)}</p>
                    </div>
                    <Star size={32} className="text-purple-200" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {dashboard.earnings.transactions.map(transaction => (
                    <div key={transaction.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <p className={`text-xs capitalize ${transaction.status === 'completed' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                          }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Real-time Location & Route */}
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Navigation size={16} className="text-blue-600" />
                  Live Route Tracking
                </h3>
                {dashboard.activeTasks.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-slate-800">Current Task: {dashboard.activeTasks[0].title}</div>
                        <div className="text-sm text-slate-600">En route to pickup location</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">ETA: 8 mins</div>
                        <div className="text-xs text-slate-500">2.3 km remaining</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600">Current Location</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-slate-200"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">Pickup Point</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-slate-200"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-slate-600">Drop-off</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No active deliveries. Accept a task to start tracking.
                  </div>
                )}
              </div>

              {/* Location History */}
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Location Timeline</h3>
                  <p className="text-sm text-slate-500">Your movement history for today</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {locationHistory.map((entry, index) => (
                    <div key={entry.id} className="p-4 flex items-center gap-3 hover:bg-slate-50">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${entry.type === 'pickup' ? 'bg-blue-500' :
                        entry.type === 'delivery' ? 'bg-green-500' : 'bg-amber-500'
                        }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{entry.location}</div>
                        <div className="text-sm text-slate-500">
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${entry.type === 'pickup' ? 'bg-blue-100 text-blue-700' :
                        entry.type === 'delivery' ? 'bg-green-100 text-green-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {entry.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parking Locations */}
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  Parking Locations
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {parkingLocations.map(location => (
                    <div key={location.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">{location.name}</div>
                        <div className="text-sm text-slate-500">
                          Lat: {location.coords.lat.toFixed(4)}, Lng: {location.coords.lng.toFixed(4)}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${location.parked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {location.parked ? 'Parked' : 'Available'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Incident Report Modal */}
      {showIncidentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-red-600" />
              Report Incident
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Incident Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select type...</option>
                  <option value="traffic">Traffic Accident</option>
                  <option value="road">Road Conditions</option>
                  <option value="delay">Delivery Delay</option>
                  <option value="client">Client Issue</option>
                  <option value="vehicle">Vehicle Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Describe the incident in detail..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setIncidentPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {incidentPhoto && (
                <div className="mt-2">
                  <img src={incidentPhoto} alt="Incident" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitIncidentReport}
                disabled={!incidentType || !incidentDescription}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Report Incident
              </button>
              <button
                onClick={() => {
                  setShowIncidentReport(false);
                  setIncidentType('');
                  setIncidentDescription('');
                  setIncidentPhoto('');
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
