import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ArrowLeftIcon, 
  RocketLaunchIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';

export default function ClientNewGig() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Grocery',
    pickupLocation: '',
    dropoffLocation: '',
    budget: '',
    currency: 'USD',
    deadline: '',
    description: '',
    isQuestion: false
  });

  const categories = [
    'Grocery',
    'Pharmacy',
    'Parcel',
    'Liquor',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addToast(
        formData.isQuestion ? 'Question Broadcasted' : 'Errand Posted',
        formData.isQuestion ? 'Nearby workers will answer your questions soon.' : 'Your request is live and messengers are being notified.',
        'success'
      );
      navigate('/dashboard/client/gigs');
    }, 1500);
  };

  return (
    <DashboardShell role="client">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setFormData({...formData, currency: 'USD'})}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${formData.currency === 'USD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              USD
            </button>
            <button 
              onClick={() => setFormData({...formData, currency: 'ZiG'})}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${formData.currency === 'ZiG' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              ZiG
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="bg-brand-600 p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <h1 className="text-4xl font-black mb-2 font-display italic uppercase tracking-tight">
              {formData.isQuestion ? 'Ask About a Place' : 'Post a New Errand'}
            </h1>
            <p className="text-brand-100 font-medium">
              {formData.isQuestion 
                ? 'Nearby workers will answer your questions about stock, queues, or prices.' 
                : 'Connect with top-rated messengers in seconds.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            <div className="flex items-center space-x-4 mb-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <input 
                type="checkbox" 
                id="isQuestion"
                className="h-5 w-5 rounded-lg border-orange-200 text-orange-600 focus:ring-orange-600/20 cursor-pointer"
                checked={formData.isQuestion}
                onChange={(e) => setFormData({...formData, isQuestion: e.target.checked})}
              />
              <label htmlFor="isQuestion" className="text-sm font-bold text-orange-900 cursor-pointer">
                I'm just asking a question (e.g., "Is bread in stock at OK Avondale?")
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {formData.isQuestion ? 'Question Topic' : 'Errand Title'}
                </label>
                <div className="relative">
                  <DocumentTextIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder={formData.isQuestion ? "e.g. Stock check at OK Avondale" : "e.g. Grocery Shopping & Delivery"}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 appearance-none outline-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Store</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter store or address"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                  />
                </div>
              </div>

              {!formData.isQuestion && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dropoff Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your address"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {formData.isQuestion ? 'Bounty Reward' : `Budget (${formData.currency})`}
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {formData.isQuestion ? 'What do you want to know?' : 'Detailed Description'}
              </label>
              <textarea 
                rows={4}
                placeholder={formData.isQuestion ? "e.g. Is there bread in stock? How long is the queue?" : "Describe exactly what needs to be done..."}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 resize-none transition-all outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center space-y-2 group hover:border-brand-600/20 transition-all cursor-pointer bg-slate-50/30">
              <PhotoIcon className="h-8 w-8 text-slate-300 group-hover:text-brand-600/40 transition-all" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {formData.category === 'Pharmacy' ? 'Upload Prescription Photo' : 'Upload relevant photos'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <div className="flex items-center text-xs font-bold text-slate-400">
                  <span className="h-2 w-2 bg-brand-500 rounded-full mr-2 animate-pulse"></span>
                  {formData.isQuestion ? 'Broadcast to Nearby Workers' : 'Secure Escrow Active'}
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-10 py-4 ${formData.isQuestion ? 'bg-orange-600 shadow-orange-100' : 'bg-slate-900 shadow-slate-100'} text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 uppercase tracking-widest text-sm`}
                >
                  <span className="mr-1">
                    {loading ? 'Processing...' : (formData.isQuestion ? 'Ask Nearby Workers' : 'Pay & Post Errand')}
                  </span>
                  {!loading && (
                    <RocketLaunchIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </button>
              </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
