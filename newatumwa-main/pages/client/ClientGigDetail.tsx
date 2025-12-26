import React, { useState, useMemo } from 'react';
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
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { RateGigModal } from '../../components/RateGigModal';
import { TippingModal } from '../../components/TippingModal';
import { format } from 'date-fns';

export default function ClientGigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gigs, users, confirmGigDelivery, rateGig, tipWorker } = useData();
  const { addToast } = useToast();

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isTippingModalOpen, setIsTippingModalOpen] = useState(false);

  const gig = useMemo(() => gigs.find(g => g.id === id), [gigs, id]);
  const worker = useMemo(() => gig?.assignedTo ? users.find(u => u.id === gig.assignedTo) : null, [gig, users]);

  const handleConfirmDelivery = () => {
    if (gig) {
      confirmGigDelivery(gig.id);
      addToast('Delivery Confirmed!', 'Funds released to worker. Please rate your experience!', 'success');
      setIsRatingModalOpen(true); // Open rating modal after confirmation
    }
  };

  const handleRateGig = async (rating: number, review: string) => {
    if (gig) {
      rateGig(gig.id, rating, review);
      addToast('Rating Submitted', 'Thank you for your feedback!', 'success');
      // Optionally open tipping modal after rating
      // setIsTippingModalOpen(true); 
    }
  };

  const handleAddTip = async (tipAmount: number) => {
    if (gig) {
      tipWorker(gig.id, tipAmount);
      addToast('Tip Added!', `You tipped ${tipAmount.toFixed(2)} to ${worker?.name || 'the worker'}.`, 'success');
    }
  };

  if (!gig) {
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
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <h1 className="text-3xl font-black text-slate-900">Gig Not Found</h1>
            <p className="text-slate-500 mt-2">The gig you are looking for does not exist or has been removed.</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Dummy timeline for now, can be made dynamic based on gig status history
  const timeline = [
    { status: 'Gig Posted', time: gig.postedAt, completed: true },
    { status: 'Worker Assigned', time: gig.assignedAt, completed: !!gig.assignedAt },
    { status: 'In Progress', time: '', completed: gig.status === 'in-progress' || gig.status === 'delivered' || gig.status === 'completed' || gig.status === 'verified' },
    { status: 'Delivered', time: gig.completedAt, completed: gig.status === 'delivered' || gig.status === 'completed' || gig.status === 'verified' },
    { status: 'Completed & Rated', time: '', completed: gig.status === 'verified' },
  ];

  const showConfirmDeliveryButton = (gig.status === 'in-progress' || gig.status === 'delivered') && !gig.clientRating;

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
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center ${
                  gig.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                  gig.status === 'completed' || gig.status === 'verified' ? 'bg-brand-50 text-brand-600' :
                  gig.status === 'open' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                    gig.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                    gig.status === 'completed' || gig.status === 'verified' ? 'bg-brand-500' :
                    gig.status === 'open' ? 'bg-amber-500' :
                    'bg-slate-500'
                  }`}></span>
                  {gig.status}
                </span>
                <span className="text-xs font-bold text-slate-400">Order ID: {gig.orderNumber || gig.id}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-6 font-display italic uppercase tracking-tight">{gig.title}</h1>
              
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl mb-8 border border-slate-100/50">
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                    <CurrencyDollarIcon className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                    <p className="font-black text-slate-900">${gig.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted</p>
                    <p className="font-black text-slate-900">{format(new Date(gig.postedAt), 'MMM dd, yyyy')}</p>
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
                    <p className="font-bold text-slate-900">{gig.locationStart}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <MapPinIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dropoff</p>
                    <p className="font-bold text-slate-900">{gig.locationEnd}</p>
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
                {timeline.map((step, i) => (
                  <div key={i} className="flex items-center relative z-10">
                    <div className={`h-8 w-8 rounded-full border-4 border-white flex items-center justify-center mr-4 ${step.completed ? 'bg-brand-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-slate-200'}`}>
                      {step.completed && <CheckCircleIcon className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <p className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                      {step.time && <p className="text-xs font-bold text-slate-400">{format(new Date(step.time), 'hh:mm a')}</p>}
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
              {worker ? (
                <>
                  <div className="h-24 w-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-black text-slate-400 border-4 border-white shadow-lg relative">
                    <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-3xl" />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-brand-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{worker.name}</h4>
                  <p className="text-sm font-bold text-brand-600 mb-6">★ {worker.rating.toFixed(1)} • {worker.jobsCompleted} completed</p>
                  
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
                </>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 font-medium">No worker assigned yet.</div>
              )}

              <div className="p-6 bg-blue-50 rounded-3xl text-left border border-blue-100">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Escrow Active</p>
                </div>
                <p className="text-[10px] font-bold text-blue-700 leading-tight leading-relaxed">
                  Your payment of ${gig.price.toFixed(2)} is held securely and will only be released once you confirm delivery.
                </p>
              </div>
            </div>
            
            {showConfirmDeliveryButton && (
                <button 
                    onClick={handleConfirmDelivery}
                    className="w-full py-5 bg-brand-600 text-white rounded-[2rem] font-black text-sm hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 active:scale-95 uppercase tracking-widest"
                >
                    Confirm Delivery
                </button>
            )}

            <button className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-sm hover:bg-red-100 transition-all border border-red-100 active:scale-95 uppercase tracking-widest">
              Cancel Gig
            </button>
          </div>
        </div>
      </div>
      <RateGigModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRateGig}
        gig={gig}
      />
    </DashboardShell>
  );
}
