import React from 'react';
import {
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BoltIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/react/24/outline';
import { Star, CheckCircleIcon } from 'lucide-react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { WorkerPerformanceChart } from '../../components/dashboard/WorkerPerformanceChart';
import { StatCard } from '../../components/StatCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { gigs, assignGig, users, toggleWorkerStatus } = useData();
  const { addToast } = useToast();
  const worker = users.find(u => u.id === user?.id);

  // Advanced analytics and insights
  const openGigs = gigs.filter(gig => gig.status === 'open' && !gig.assignedTo);
  const myGigs = gigs.filter(gig => gig.assignedTo === user?.id);
  const activeTasks = myGigs.filter(gig => gig.status === 'in-progress');
  const completedTasks = myGigs.filter(gig => gig.status === 'completed' || gig.status === 'verified');
  const totalEarnings = completedTasks.reduce((sum, gig) => sum + (gig.totalEarnings || gig.price), 0);

  // Performance metrics
  const averageRating = user?.rating || 0;
  const completionRate = myGigs.length > 0 ? (completedTasks.length / myGigs.length) * 100 : 0;
  const todaysEarnings = completedTasks
    .filter(gig => new Date(gig.completedAt || '').toDateString() === new Date().toDateString())
    .reduce((sum, gig) => sum + (gig.totalEarnings || gig.price), 0);

  // Smart recommendations
  const highValueGigs = openGigs.filter(gig => gig.price >= 8).slice(0, 3);
  const nearbyGigs = openGigs.filter(gig => gig.distance && parseFloat(gig.distance) <= 3).slice(0, 3);
  const quickGigs = openGigs.filter(gig => gig.urgency === 'express' || gig.urgency === 'fast').slice(0, 3);

  // Weekly earnings data
  const weeklyEarnings = [
    { day: 'Mon', amount: 45.00, gigs: 3 },
    { day: 'Tue', amount: 32.50, gigs: 2 },
    { day: 'Wed', amount: 58.20, gigs: 4 },
    { day: 'Thu', amount: todaysEarnings, gigs: completedTasks.filter(gig => new Date(gig.completedAt || '').toDateString() === new Date().toDateString()).length },
    { day: 'Fri', amount: 0.00, gigs: 0 },
    { day: 'Sat', amount: 0.00, gigs: 0 },
    { day: 'Sun', amount: 0.00, gigs: 0 },
  ];
  
  const handleAcceptGig = (gigId: string) => {
    if (!user) return;
    assignGig(gigId, user.id);
    addToast('Gig Accepted!', 'The task has been added to your active list.', 'success');
  };

  const handleToggleStatus = () => {
    if (!worker) return;
    toggleWorkerStatus(worker.id, !worker.isOnline);
    addToast(
      worker.isOnline ? 'You are now OFFLINE' : 'You are now ONLINE',
      worker.isOnline ? 'You will no longer receive new gig notifications.' : 'You are visible to clients and will receive new opportunities.',
      'info'
    );
  };

  return (
    <DashboardShell role="worker" title="Messenger Hub">
      <div className="space-y-6">
        {/* Status Toggle Banner */}
        <div className={`rounded-2xl p-6 text-white relative overflow-hidden transition-all ${worker?.isOnline ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${worker?.isOnline ? 'bg-green-300 animate-pulse' : 'bg-gray-400'}`}></div>
              <div>
                <h3 className="text-lg font-black">Status: {worker?.isOnline ? 'Online' : 'Offline'}</h3>
                <p className="text-white/90 text-sm">
                  {worker?.isOnline ? 'Visible to clients • Ready for gigs' : 'Offline • No new opportunities'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 ${
                worker?.isOnline
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {worker?.isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleToggleStatus()}
            className={`p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg ${
              worker?.isOnline
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <BoltIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">{worker?.isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
          <Link
            to="/dashboard/worker/find"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg text-center"
          >
            <MagnifyingGlassIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Find Gigs</span>
          </Link>
          <Link
            to="/dashboard/worker/map"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg text-center"
          >
            <MapPinIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Live Map</span>
          </Link>
          <Link
            to="/dashboard/worker/earnings"
            className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg text-center"
          >
            <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Earnings</span>
          </Link>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">${totalEarnings.toFixed(0)}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <BoltIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{activeTasks.length}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <StarIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{averageRating.toFixed(1)}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-xl">
                <ClipboardDocumentCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{completedTasks.length}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Gigs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Available Gigs</h3>
              <Link
                to="/dashboard/worker/find"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {openGigs.length > 0 ? (
              <div className="space-y-4">
                {openGigs.slice(0, 3).map(gig => (
                  <div key={gig.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{gig.title}</h4>
                        <p className="text-gray-600 text-xs">{gig.distance} • {gig.type}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-bold text-green-600">${gig.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleAcceptGig(gig.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArchiveBoxXMarkIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h4 className="text-gray-600 font-medium mb-2">No gigs available right now</h4>
                <p className="text-gray-500 text-sm">Check back soon or go online to receive notifications</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Overview */}
        <WorkerPerformanceChart
          earningsData={weeklyEarnings}
          totalEarnings={totalEarnings}
          todaysEarnings={todaysEarnings}
          weeklyTarget={200}
          completionRate={completionRate}
        />

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Messenger Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-sm text-indigo-800">Stay online during peak hours (7-9 AM, 5-7 PM) for more opportunities</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-sm text-indigo-800">Accept gigs within 5 minutes to maintain high completion rates</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-1 rounded">
                <CheckCircleIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-sm text-indigo-800">High-value gigs ($8+) offer better earning potential</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default WorkerDashboard;
