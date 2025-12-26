import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function ClientGigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const gig = {
    id,
    title: 'Grocery Shopping & Delivery',
    status: 'In Progress',
    budget: '$15.00',
    date: 'Dec 24, 2025',
    pickup: 'Pick n Pay, Borrowdale',
    dropoff: '123 Borrowdale Road',
    description: 'I need someone to pick up a list of groceries from Pick n Pay Borrowdale and deliver them to my home. The list includes milk, bread, eggs, and some fruits. I will provide the digital receipt once you arrive at the store.',
    worker: {
      name: 'John Doe',
      rating: 4.8,
      completedErrands: 156,
      avatar: 'JD'
    },
    timeline: [
      { status: 'Gig Posted', time: '09:00 AM', completed: true },
      { status: 'Worker Assigned', time: '09:15 AM', completed: true },
      { status: 'Shopping in Progress', time: '10:00 AM', completed: true },
      { status: 'Out for Delivery', time: '10:45 AM', completed: false },
    ]
  };

  return (
    <DashboardShell role="client">
      <div className="max-w-5xl mx-auto space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  {gig.status}
                </span>
                <span className="text-xs font-bold text-slate-400">ID: {gig.id}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-6 font-display italic uppercase tracking-tight">{gig.title}</h1>
              
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl mb-8 border border-slate-100/50">
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                    <CurrencyDollarIcon className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                    <p className="font-black text-slate-900">{gig.budget}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted</p>
                    <p className="font-black text-slate-900">{gig.date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-brand-50 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <MapPinIcon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
                    <p className="font-bold text-slate-900">{gig.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <MapPinIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dropoff</p>
                    <p className="font-bold text-slate-900">{gig.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {gig.description}
                </p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 font-display italic uppercase tracking-tight">Timeline</h3>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />
                {gig.timeline.map((step, i) => (
                  <div key={i} className="flex items-center relative z-10">
                    <div className={`h-8 w-8 rounded-full border-4 border-white flex items-center justify-center mr-4 ${step.completed ? 'bg-brand-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-slate-200'}`}>
                      {step.completed && <ShieldCheckIcon className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <p className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                      <p className="text-xs font-bold text-slate-400">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900/5"></div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative">Assigned Worker</h3>
              <div className="h-24 w-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-black text-slate-400 border-4 border-white shadow-lg relative">
                {gig.worker.avatar}
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-brand-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-1">{gig.worker.name}</h4>
              <p className="text-sm font-bold text-brand-600 mb-6">★ {gig.worker.rating} • {gig.worker.completedErrands} completed</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center px-4 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all active:scale-95 uppercase tracking-widest">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="flex items-center justify-center px-4 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all border border-slate-100 active:scale-95 uppercase tracking-widest">
                  <UserCircleIcon className="h-4 w-4 mr-2" />
                  Profile
                </button>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl text-left border border-blue-100">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Escrow Active</p>
                </div>
                <p className="text-[10px] font-bold text-blue-700 leading-tight leading-relaxed">
                  Your payment of {gig.budget} is held securely and will only be released once you confirm delivery.
                </p>
              </div>
            </div>

            <button className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-sm hover:bg-red-100 transition-all border border-red-100 active:scale-95 uppercase tracking-widest">
              Cancel Gig
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
