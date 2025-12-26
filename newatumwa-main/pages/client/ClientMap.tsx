import React from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { MapComponent } from '../../components/dashboard/MapComponent';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const nearbyWorkers = [
  { 
    id: 1, 
    name: 'Tinashe M.', 
    category: 'Fast Courier', 
    rating: 4.9, 
    distance: '0.8 km', 
    status: 'Available',
    jobs: 142,
    avatar: 'TM'
  },
  { 
    id: 2, 
    name: 'Blessing C.', 
    category: 'Heavy Load', 
    rating: 4.7, 
    distance: '1.2 km', 
    status: 'In Job',
    jobs: 89,
    avatar: 'BC'
  },
  { 
    id: 3, 
    name: 'John D.', 
    category: 'Bike Delivery', 
    rating: 5.0, 
    distance: '2.5 km', 
    status: 'Available',
    jobs: 210,
    avatar: 'JD'
  }
];

export default function ClientMapPage() {
  return (
    <DashboardShell role="client" title="Map & Tracking">
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">Live Fleet Tracker</h1>
            <p className="text-slate-500 font-medium">Monitor active deliveries and discover nearby messengers</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for couriers..." 
                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 shadow-sm w-full md:w-80 transition-all outline-none"
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90">
              <AdjustmentsHorizontalIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <MapComponent role="client" />
          </div>

          <div className="w-full lg:w-96 flex flex-col space-y-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Nearby Workers</h3>
            <div className="space-y-4">
              {nearbyWorkers.map((worker) => (
                <div key={worker.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 font-black text-slate-400 text-sm border border-white shadow-sm group-hover:scale-105 transition-transform">
                      {worker.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-black text-slate-900 mr-1">{worker.name}</h4>
                        <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">{worker.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-brand-600">
                        <StarIcon className="h-3 w-3 fill-current mr-1" />
                        <span className="text-xs font-black">{worker.rating}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{worker.distance}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all active:scale-95 uppercase tracking-widest">
                      Hire Now
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all active:scale-90 border border-transparent hover:border-slate-100">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
