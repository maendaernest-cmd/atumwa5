import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ArrowLeftIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckBadgeIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = {
    id,
    name: 'John Doe',
    role: 'Worker',
    email: 'john.doe@example.com',
    phone: '+263 77 123 4567',
    location: 'Harare, Zimbabwe',
    joined: 'Jan 12, 2025',
    status: 'Active',
    rating: 4.8,
    completedGigs: 156,
    totalEarnings: '$2,450.00',
    verification: 'Verified',
    avatar: 'JD'
  };

  return (
    <DashboardShell role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-brand-500/5"></div>
              <div className="relative">
                <div className="h-32 w-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-4xl font-black text-slate-400 border-4 border-white shadow-xl">
                  {user.avatar}
                  <div className="absolute -bottom-2 -right-2 bg-brand-500 p-2 rounded-full border-4 border-white">
                    <CheckBadgeIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{user.name}</h3>
                <p className="text-sm font-bold text-slate-400 mb-6">{user.role} • ID: {user.id}</p>
                
                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl font-black text-xs uppercase tracking-widest w-fit mx-auto mb-8">
                  <span className="h-2 w-2 bg-brand-500 rounded-full"></span>
                  <span>{user.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center px-4 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all active:scale-95">
                    Edit User
                  </button>
                  <button className="flex items-center justify-center px-4 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-100 transition-all border border-red-100 active:scale-95">
                    Suspend
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400 mr-4" />
                  <span className="text-sm font-bold text-slate-900">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-slate-400 mr-4" />
                  <span className="text-sm font-bold text-slate-900">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-slate-400 mr-4" />
                  <span className="text-sm font-bold text-slate-900">{user.location}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-slate-400 mr-4" />
                  <span className="text-sm font-bold text-slate-900">Joined {user.joined}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center">
                  <StarIcon className="h-6 w-6 text-amber-400 mr-2" />
                  <p className="text-2xl font-black text-slate-900">{user.rating}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gigs Done</p>
                <p className="text-2xl font-black text-slate-900">{user.completedGigs}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earned</p>
                <p className="text-2xl font-black text-brand-600 font-display">{user.totalEarnings}</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight italic uppercase font-display">Recent Activity</h3>
              <div className="space-y-8">
                {[
                  { action: 'Completed Gig #GIG-742', time: '2 hours ago', status: 'success' },
                  { action: 'Accepted Gig #GIG-745', time: '5 hours ago', status: 'info' },
                  { action: 'Updated Profile Photo', time: 'Yesterday', status: 'info' },
                  { action: 'Withdrew $150.00 to EcoCash', time: '2 days ago', status: 'success' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-4 ${item.status === 'success' ? 'bg-brand-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{item.action}</p>
                        <p className="text-xs font-bold text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Details</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full -mr-24 -mt-24"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black font-display uppercase italic tracking-tight">Verification Docs</h3>
                  <span className="px-4 py-1 bg-brand-500/20 text-brand-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/10 transition-all active:scale-95">
                    <ShieldCheckIcon className="h-8 w-8 text-slate-500 mb-2 group-hover:text-white transition-all" />
                    <p className="text-xs font-bold">National ID</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/10 transition-all active:scale-95">
                    <ShieldCheckIcon className="h-8 w-8 text-slate-500 mb-2 group-hover:text-white transition-all" />
                    <p className="text-xs font-bold">Driver's License</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
