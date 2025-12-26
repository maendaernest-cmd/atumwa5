import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { motion, AnimatePresence } from 'framer-motion';

const availableGigs = [
  { id: '101', title: 'Medical Supply Delivery', client: 'Avenues Clinic', price: 15.50, distance: '1.2km', time: '15m ago', type: 'prescription', urgency: 'high' },
  { id: '102', title: 'Grocery Pickup - Pick n Pay', client: 'Sarah M.', price: 22.00, distance: '3.5km', time: '25m ago', type: 'shopping', urgency: 'standard' },
  { id: '103', title: 'Corporate Document Courier', client: 'Zim-Asset Corp', price: 12.00, distance: '0.8km', time: '5m ago', type: 'paperwork', urgency: 'priority' },
  { id: '104', title: 'E-Commerce Parcel Delivery', client: 'Shopify Store', price: 8.50, distance: '5.2km', time: '1h ago', type: 'parcel', urgency: 'standard' },
];

export default function WorkerFind() {
  const [filter, setFilter] = useState('all');

  return (
    <DashboardShell role="worker" title="Find Work">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by area or task type..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {['all', 'high pay', 'nearby', 'urgent'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {availableGigs.map((gig) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={gig.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${
                    gig.urgency === 'high' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
                  }`}>
                    {gig.urgency === 'high' ? <ClockIcon className="w-6 h-6 animate-pulse" /> : <MapPinIcon className="w-6 h-6" />}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">${gig.price.toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gig.time}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-2">{gig.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <MapPinIcon className="w-4 h-4" /> {gig.distance}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-xs font-bold text-slate-500 capitalize">{gig.type}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                        {gig.client.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{gig.client}</span>
                   </div>
                   <button className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 hover:shadow-lg transition-all active:scale-95">
                     Accept Gig
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
