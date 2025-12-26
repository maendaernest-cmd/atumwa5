import React from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowUpRightIcon, 
  ArrowDownLeftIcon,
  WalletIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 32 },
  { day: 'Wed', amount: 58 },
  { day: 'Thu', amount: 0 },
  { day: 'Fri', amount: 110 },
  { day: 'Sat', amount: 85 },
  { day: 'Sun', amount: 65 },
];

const transactions = [
  { id: 'TX-901', date: 'Today, 2:45 PM', description: 'Pharmacy Delivery Payout', amount: 15.00, type: 'credit' },
  { id: 'TX-902', date: 'Yesterday', description: 'Weekly Service Fee', amount: -5.00, type: 'debit' },
  { id: 'TX-903', date: 'Jan 12, 2025', description: 'Grocery Pickup Bonus', amount: 25.00, type: 'credit' },
];

export default function WorkerEarnings() {
  return (
    <DashboardShell role="worker" title="Earnings & Wallet">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Available Balance"
          value="$124.50"
          icon={WalletIcon}
          variant="brand"
        />
        <StatCard
          label="Pending Clearance"
          value="$45.00"
          icon={CurrencyDollarIcon}
          subtext="Available in 48h"
        />
        <StatCard
          label="Weekly Growth"
          value="+22%"
          icon={ChartBarIcon}
          trend={{ value: '12%', isUp: true }}
          variant="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Income Analytics</h3>
               <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                  <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Week</button>
                  <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Month</button>
               </div>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                     <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="day" 
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
                       dataKey="amount" 
                       stroke="#22c55e" 
                       strokeWidth={4}
                       fillOpacity={1} 
                       fill="url(#colorAmount)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">Recent Transactions</h3>
            <div className="space-y-4">
               {transactions.map(tx => (
                 <div key={tx.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                         tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                       }`}>
                          {tx.type === 'credit' ? <ArrowDownLeftIcon className="w-6 h-6" /> : <ArrowUpRightIcon className="w-6 h-6" />}
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 leading-tight">{tx.description}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{tx.date} • {tx.id}</p>
                       </div>
                    </div>
                    <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                       {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-lg font-black uppercase italic tracking-tight mb-6 text-brand-400">Withdraw Funds</h3>
                 <div className="bg-white/10 rounded-2xl p-6 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Connected Method</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-6 bg-white/20 rounded-md"></div>
                       <span className="text-sm font-bold italic">EcoCash Cash-In • ****429</span>
                    </div>
                 </div>
                 <button className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                    Payout Now
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl"></div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">Earnings Goal</h3>
              <div className="flex items-end justify-between mb-2">
                 <p className="text-2xl font-black text-slate-900">$392 / $500</p>
                 <p className="text-xs font-bold text-brand-600 uppercase">78%</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                 <div className="h-full bg-brand-500 w-[78%]"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                 You're only <span className="text-slate-900 font-bold">$108</span> away from your weekly goal! Keep it up.
              </p>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
