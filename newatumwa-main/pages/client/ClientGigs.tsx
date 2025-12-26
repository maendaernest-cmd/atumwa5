import React, { useState } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ListBulletIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  EllipsisHorizontalIcon,
  MapPinIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { PostGigModal } from '../../components/dashboard/PostGigModal';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Gig } from '../../types';

export default function ClientGigsPage() {
  const { gigs, addGig } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePostGig = (gigData: any) => {
    const newGig: Gig = {
      id: `GIG-${Math.floor(Math.random() * 1000)}`,
      status: 'open',
      postedBy: { id: 'u1', name: 'Sarah J.', email: 'sarah@example.com', role: 'client', isVerified: true },
      postedAt: new Date().toISOString(),
      distance: '0.5 km',
      coordinates: { lat: -17.8248, lng: 31.0530 },
      ...gigData
    };
    
    addGig(newGig);
    setIsModalOpen(false);
    addToast('Request Launched', 'Your errand request has been broadcasted successfully.', 'success');
  };

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gig.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="client" title="My Gigs">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">My Gigs</h1>
            <p className="text-slate-500 font-medium">Manage and track all your service requests</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-6 py-3.5 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-900/20 hover:bg-brand-500 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post New Gig
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Spent', value: '$1,240.50', trend: null },
            { label: 'Active Gigs', value: gigs.filter(g => g.status === 'in-progress' || g.status === 'accepted' || g.status === 'open').length, trend: 'blue' },
            { label: 'Completed', value: gigs.filter(g => g.status === 'completed').length, trend: 'brand' },
            { label: 'Save Rate', value: '15%', trend: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.trend === 'brand' ? 'text-brand-600' : stat.trend === 'blue' ? 'text-blue-600' : stat.trend === 'orange' ? 'text-orange-500' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button className="text-sm font-black text-slate-900 border-b-2 border-brand-600 pb-1 uppercase tracking-widest">All Gigs</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Active</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Pending</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Completed</button>
            </div>
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by title or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none w-full md:w-72 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Project / Details</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Worker</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredGigs.map((gig) => (
                  <tr 
                    key={gig.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform border border-slate-100 ${
                          gig.status === 'completed' ? 'bg-brand-50 text-brand-600' :
                          gig.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          <ListBulletIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight mb-1">{gig.title}</p>
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <span className="mr-3">{gig.id}</span>
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            <span>{gig.locationStart || 'Harare'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {gig.assignedTo ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center mr-3 font-black text-slate-400 text-xs border border-white shadow-sm">
                            {gig.assignedTo.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Worker {gig.assignedTo}</p>
                            <p className="text-[10px] font-bold text-brand-600">★ 4.9</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 bg-brand-500 rounded-full mr-2 animate-pulse"></span>
                          Matching...
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 ${
                        gig.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                        gig.status === 'completed' ? 'bg-brand-50 text-brand-600' :
                        gig.status === 'open' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                          gig.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                          gig.status === 'completed' ? 'bg-brand-500' :
                          gig.status === 'open' ? 'bg-amber-500' :
                          'bg-slate-500'
                        }`}></span>
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900">${gig.price}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escrow Held</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100 active:scale-90">
                          <ChatBubbleLeftIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 active:scale-90">
                          <EllipsisHorizontalIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PostGigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostGig}
      />
    </DashboardShell>
  );
}
