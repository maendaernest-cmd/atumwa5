import React from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
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

const data = [
  { name: 'Mon', tasks: 40, revenue: 2400 },
  { name: 'Tue', tasks: 30, revenue: 1398 },
  { name: 'Wed', tasks: 20, revenue: 9800 },
  { name: 'Thu', tasks: 27, revenue: 3908 },
  { name: 'Fri', tasks: 18, revenue: 4800 },
  { name: 'Sat', tasks: 23, revenue: 3800 },
  { name: 'Sun', tasks: 34, revenue: 4300 },
];

const AdminOverview: React.FC = () => {
  return (
    <DashboardShell role="admin" title="System Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value="1,284"
          icon={UsersIcon}
          trend={{ value: '12%', isUp: true }}
        />
        <StatCard
          label="Active Gigs"
          value="456"
          icon={BriefcaseIcon}
          variant="brand"
        />
        <StatCard
          label="Revenue"
          value="$12,840"
          icon={CurrencyDollarIcon}
          trend={{ value: '8%', isUp: true }}
        />
        <StatCard
          label="Success Rate"
          value="98.2%"
          icon={CheckBadgeIcon}
          variant="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Task Activity</h3>
            <ChartBarIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
                <Bar dataKey="tasks" fill="#22c55e" radius={[10, 10, 10, 10]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Revenue Growth</h3>
            <CurrencyDollarIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
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
