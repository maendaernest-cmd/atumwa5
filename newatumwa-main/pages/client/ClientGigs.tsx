import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import {
  ListBulletIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HelpCircle } from 'lucide-react';
import { RateGigModal } from '../../components/RateGigModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Gig, TaskStatus } from '../../types';

type FilterStatus = 'all' | 'active' | 'pending' | 'completed';

export default function ClientGigsPage() {
  const { user } = useAuth();
  const { gigs, users, rateGig } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedGigForRating, setSelectedGigForRating] = useState<Gig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const clientGigs = useMemo(() => gigs.filter(g => g.postedBy.id === user?.id), [gigs, user]);

  const handleOpenRatingModal = (gig: Gig) => {
    setSelectedGigForRating(gig);
    setIsRatingModalOpen(true);
  };

  const handleRateGig = async (rating: number, review: string) => {
    if (!selectedGigForRating) return;
    rateGig(selectedGigForRating.id, rating, review);
    addToast('Rating Submitted', 'Thank you for your feedback!', 'success');
  };

  const filteredGigs = useMemo(() => {
    let filtered = clientGigs;

    if (filterStatus !== 'all') {
      const statusMap: Record<FilterStatus, TaskStatus[]> = {
        all: [],
        active: ['in-progress'],
        pending: ['open'],
        completed: ['completed', 'verified'],
      };
      filtered = filtered.filter(gig => statusMap[filterStatus].includes(gig.status));
    }
    
    if (searchQuery) {
      return filtered.filter(gig => 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [clientGigs, filterStatus, searchQuery]);

  const totalSpent = useMemo(() => 
    clientGigs
      .filter(g => g.status === 'completed' || g.status === 'verified')
      .reduce((sum, gig) => sum + gig.price, 0),
    [clientGigs]
  );
  const activeGigsCount = useMemo(() => clientGigs.filter(g => g.status === 'in-progress' || g.status === 'open').length, [clientGigs]);
  const completedGigsCount = useMemo(() => clientGigs.filter(g => g.status === 'completed' || g.status === 'verified').length, [clientGigs]);
  
  const getWorkerInfo = (workerId: string) => {
    return users.find(u => u.id === workerId);
  }

  const statCards = [
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, trend: null },
    { label: 'Active Gigs', value: activeGigsCount, trend: 'blue' },
    { label: 'Completed', value: completedGigsCount, trend: 'brand' },
    { label: 'Save Rate', value: '15%', trend: 'orange' } // Static for now
  ];

  const filterButtons: { label: string, status: FilterStatus }[] = [
    { label: 'All Gigs', status: 'all' },
    { label: 'Active', status: 'active' },
    { label: 'Pending', status: 'pending' },
    { label: 'Completed', status: 'completed' },
  ];

  return (
    <DashboardShell role="client" title="My Gigs">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">My Gigs</h1>
            <p className="text-slate-500 font-medium">Manage and track all your service requests</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/client/gigs/new')}
            className="flex items-center justify-center px-6 py-3.5 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-900/20 hover:bg-brand-500 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post New Gig
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.trend === 'brand' ? 'text-brand-600' : stat.trend === 'blue' ? 'text-blue-600' : stat.trend === 'orange' ? 'text-orange-500' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {filterButtons.map(btn => (
                <button 
                  key={btn.status}
                  onClick={() => setFilterStatus(btn.status)}
                  className={`text-sm font-black uppercase tracking-widest pb-1 whitespace-nowrap ${
                    filterStatus === btn.status 
                      ? 'text-slate-900 border-b-2 border-brand-600' 
                      : 'text-slate-400 hover:text-slate-900 transition-colors'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
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
                {filteredGigs.map((gig) => {
                  const worker = gig.assignedTo ? getWorkerInfo(gig.assignedTo) : null;
                  return (
                    <tr 
                      key={gig.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform border border-slate-100 ${
                            gig.status === 'completed' || gig.status === 'verified' ? 'bg-brand-50 text-brand-600' :
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
                        {worker ? (
                          <div className="flex items-center">
                            <img src={worker.avatar} alt={worker.name} className="h-10 w-10 rounded-xl object-cover mr-3" />
                            <div>
                              <p className="text-sm font-black text-slate-900">{worker.name}</p>
                              <p className="text-[10px] font-bold text-brand-600">★ {worker.rating.toFixed(1)}</p>
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          gig.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          gig.status === 'completed' || gig.status === 'verified' ? 'bg-brand-50 text-brand-600 border-brand-100' :
                          gig.status === 'open' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                            gig.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                            gig.status === 'completed' || gig.status === 'verified' ? 'bg-brand-500' :
                            gig.status === 'open' ? 'bg-amber-500' :
                            'bg-slate-500'
                          }`}></span>
                          {gig.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900">${gig.price.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escrow Held</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {(gig.status === 'completed') && (
                            <button 
                              onClick={() => handleOpenRatingModal(gig)}
                              className="p-2.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all border border-transparent hover:border-yellow-200 active:scale-90"
                              title="Rate Worker"
                            >
                              <StarIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100 active:scale-90">
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 active:scale-90">
                            <EllipsisHorizontalIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RateGigModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRateGig}
        gig={selectedGigForRating}
      />
    </DashboardShell>
  );
}
