import React from 'react';
import { 
  CurrencyDollarIcon, 
  MapPinIcon, 
  StarIcon, 
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { Link } from 'react-router-dom';

const availableGigs = [
  { id: '101', title: 'Document delivery to CBD', price: 12, distance: '2.4km', type: 'paperwork' },
  { id: '102', title: 'Parcel pickup - Westgate', price: 18, distance: '5.1km', type: 'parcel' },
];

const WorkerDashboard: React.FC = () => {
  return (
    <DashboardShell role="worker" title="Messenger Hub">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Earnings"
          value="$245.50"
          icon={CurrencyDollarIcon}
          variant="brand"
          trend={{ value: '15%', isUp: true }}
        />
        <StatCard
          label="Active Tasks"
          value="1"
          icon={BoltIcon}
          variant="slate"
        />
        <StatCard
          label="Rating"
          value="4.9"
          icon={StarIcon}
          subtext="from 52 reviews"
        />
        <StatCard
          label="Completed"
          value="128"
          icon={ClipboardDocumentCheckIcon}
          subtext="Lifetime tasks"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Nearby Opportunities</h3>
              <Link to="/dashboard/worker/find" className="text-brand-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Find More <MagnifyingGlassIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {availableGigs.map(gig => (
                <div key={gig.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                      <MapPinIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{gig.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gig.distance}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gig.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-600">${gig.price}</p>
                    <button className="bg-brand-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 mt-2 transition-colors">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-black mb-3 uppercase italic">Shift Status: Online</h3>
                <p className="text-slate-400 font-medium mb-0">You are currently visible to clients. Stay safe on the road!</p>
             </div>
             <button className="relative z-10 bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-500/20 transition-all active:scale-95">
                Go Offline
             </button>
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">Weekly Earnings</h3>
            <div className="space-y-4">
               {[
                 { day: 'Mon', amount: 45.00 },
                 { day: 'Tue', amount: 32.50 },
                 { day: 'Wed', amount: 58.20 },
                 { day: 'Thu', amount: 0.00 },
                 { day: 'Fri', amount: 110.00 },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{item.day}</span>
                    <div className="flex-1 mx-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-brand-500" 
                         style={{ width: `${(item.amount / 120) * 100}%` }}
                       ></div>
                    </div>
                    <span className="text-xs font-black text-slate-900">${item.amount}</span>
                 </div>
               ))}
            </div>
            <Link to="/dashboard/worker/earnings" className="block text-center mt-8 text-xs font-black uppercase tracking-widest text-brand-600 hover:underline">
              View Detailed Report
            </Link>
          </div>

          <div className="bg-brand-50 rounded-[2.5rem] border border-brand-100 p-8">
            <h3 className="text-lg font-black text-brand-900 uppercase italic tracking-tight mb-4">Pro Tip</h3>
            <p className="text-brand-700/80 text-sm font-medium leading-relaxed">
              Completing 3 more gigs this week will unlock the <span className="text-brand-900 font-black">"Top Messenger"</span> badge, giving you priority access to high-value tasks.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default WorkerDashboard;
