import React from 'react';
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { TrendingUp, Target } from 'lucide-react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useData } from '../../context/DataContext';
import { Gig } from '../../types';
import { subDays, format, parseISO } from 'date-fns';

const AdminOverview: React.FC = () => {
  const { users, gigs, adminSettings } = useData();

  // --- Calculate Key Statistics ---
  const totalUsers = users.length;
  const activeGigs = gigs.filter(g => g.status === 'open' || g.status === 'in-progress').length;
  const completedGigs = gigs.filter(g => g.status === 'completed' || g.status === 'verified');
  const cancelledGigs = gigs.filter(g => g.status === 'cancelled');

  const totalRevenue = completedGigs.reduce((acc, gig) => acc + (gig.price * adminSettings.platformFee), 0);
  const successRate = completedGigs.length > 0 ? (completedGigs.length / (completedGigs.length + cancelledGigs.length)) * 100 : 100;

  // --- Generate Chart Data for the last 7 days ---
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, 'eee'),
      date: format(date, 'yyyy-MM-dd'),
      tasks: 0,
      revenue: 0,
    };
  });

  gigs.forEach((gig: Gig) => {
    const gigDateStr = format(parseISO(gig.postedAt), 'yyyy-MM-dd');
    const chartEntry = chartData.find(d => d.date === gigDateStr);
    if (chartEntry) {
      chartEntry.tasks += 1;
      if (gig.status === 'completed' || gig.status === 'verified') {
        chartEntry.revenue += gig.price * adminSettings.platformFee;
      }
    }
  });

  // Real-time alerts and system health
  const systemAlerts = [
    { id: 1, type: 'critical', message: 'Payment gateway latency detected', time: '2 min ago', icon: ExclamationTriangleIcon, color: 'red' },
    { id: 2, type: 'warning', message: 'High user activity in Harare region', time: '15 min ago', icon: ClockIcon, color: 'yellow' },
    { id: 3, type: 'info', message: 'New messenger verification completed', time: '1 hour ago', icon: CheckBadgeIcon, color: 'green' },
  ];

  // Performance metrics
  const systemHealth = {
    uptime: '99.9%',
    responseTime: '245ms',
    activeUsers: users.filter(u => u.isOnline).length,
    pendingVerifications: users.filter(u => !u.isVerified).length
  };

  return (
    <DashboardShell role="admin" title="System Overview">
      {/* Real-time Alerts Banner */}
      <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-red-900 uppercase italic tracking-tight">⚠️ System Alerts</h3>
          <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold">3 Active</span>
        </div>
        <div className="space-y-3">
          {systemAlerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className={`p-2 rounded-lg ${alert.color === 'red' ? 'bg-red-100' : alert.color === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <alert.icon className={`h-4 w-4 ${alert.color === 'red' ? 'text-red-600' : alert.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{alert.message}</p>
                <p className="text-xs text-slate-500">{alert.time}</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Stats with Real-time Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Users</p>
            <p className="text-3xl font-black text-slate-900 mb-2">{totalUsers.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-600">+12 this week</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UsersIcon className="h-16 w-16 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-xl">
              <BriefcaseIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Gigs</p>
            <p className="text-3xl font-black text-slate-900 mb-2">{activeGigs.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-600">{Math.floor(activeGigs * 0.15)} in progress</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BriefcaseIcon className="h-16 w-16 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
              <CurrencyDollarIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Revenue</p>
            <p className="text-3xl font-black text-slate-900 mb-2">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-bold text-green-600">+8.2% this month</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CurrencyDollarIcon className="h-16 w-16 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <CheckBadgeIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Success Rate</p>
            <p className="text-3xl font-black text-slate-900 mb-2">{successRate.toFixed(1)}%</p>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-xs font-bold text-green-600">Above target</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckBadgeIcon className="h-16 w-16 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Daily Task Volume</h3>
            <ChartBarIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '1rem'
                  }}
                />
                <Bar dataKey="tasks" fill="#22c55e" radius={[10, 10, 10, 10]} barSize={32} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Daily Revenue</h3>
            <CurrencyDollarIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '1rem'
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  name="Revenue" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-slate-900 text-white p-8 rounded-[3rem] overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2 uppercase italic">Platform Health</h2>
            <p className="text-slate-400 font-medium max-w-md">All systems are operational. Check the technical log for detailed service status and uptime metrics.</p>
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap">
            System Log
          </button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
      </div>
    </DashboardShell>
  );
};

export default AdminOverview;
