import React from 'react';
import { 
  PlusIcon, 
  MapIcon, 
  ClipboardDocumentListIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { Link } from 'react-router-dom';

const activeGigs = [
  { id: '1', title: 'Pick up medical prescription', status: 'In Progress', type: 'prescription', price: 15 },
  { id: '2', title: 'Grocery shopping - Avondale', status: 'Pending', type: 'shopping', price: 25 },
];

const ClientDashboard: React.FC = () => {
  return (
    <DashboardShell role="client" title="Client Hub">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Gigs"
          value="2"
          icon={ClockIcon}
          variant="brand"
          subtext="Ongoing errands"
        />
        <StatCard
          label="Completed"
          value="24"
          icon={CheckCircleIcon}
          subtext="Successfully delivered"
        />
        <StatCard
          label="Total Spent"
          value="$480"
          icon={ClipboardDocumentListIcon}
          subtext="Last 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Active Errands</h3>
              <Link to="/dashboard/client/gigs" className="text-brand-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                View All <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {activeGigs.map(gig => (
                <div key={gig.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                      <ClipboardDocumentListIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{gig.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gig.type}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{gig.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">${gig.price}</p>
                    <Link to={`/dashboard/client/gigs/${gig.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600 mt-1 block">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 uppercase italic">Need something else?</h3>
              <p className="text-white/80 font-medium mb-6 max-w-sm">Post a new gig and our messengers will be on it in no time.</p>
              <Link to="/dashboard/client/gigs/new" className="inline-flex items-center gap-3 bg-white text-brand-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">
                <PlusIcon className="w-5 h-5" /> Post New Gig
              </Link>
            </div>
            <PlusIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase italic tracking-tight">Map View</h3>
              <MapIcon className="w-6 h-6 text-brand-400" />
            </div>
            <div className="aspect-square bg-slate-800 rounded-3xl mb-6 relative overflow-hidden">
               {/* Simplified Map Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold text-xs uppercase tracking-widest p-8 text-center">
                 Real-time tracking available in full map view
               </div>
            </div>
            <Link to="/dashboard/client/map" className="block text-center bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
              Open Full Map
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-brand-50 rounded-2xl transition-all group flex items-center justify-between">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-600">Reorder Previous</span>
                <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-brand-400" />
              </button>
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-brand-50 rounded-2xl transition-all group flex items-center justify-between">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-600">Saved Addresses</span>
                <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-brand-400" />
              </button>
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-brand-50 rounded-2xl transition-all group flex items-center justify-between">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-600">Contact Support</span>
                <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-brand-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ClientDashboard;
