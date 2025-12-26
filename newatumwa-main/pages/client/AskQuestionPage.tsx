import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ArrowLeftIcon, 
  HelpCircleIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  SendIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Gig } from '../../types';

export default function AskQuestionPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { addGig } = useData(); // We can use addGig to broadcast a question
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    bounty: '',
    currency: 'USD',
    question: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('Error', 'You must be logged in to ask a question.', 'error');
      return;
    }
    setLoading(true);

    const newQuestion: Gig = {
        id: `question-${Date.now()}`,
        title: formData.title,
        description: formData.question,
        type: 'shopping', // Using 'shopping' as a placeholder type for questions
        price: parseFloat(formData.bounty) || 0,
        paymentMethod: formData.currency === 'USD' ? 'cash_usd' : 'zig',
        urgency: 'standard',
        status: 'open',
        locationStart: formData.location,
        locationEnd: '',
        stops: [],
        checklist: [],
        postedBy: user,
        postedAt: new Date().toISOString(),
        distance: 'N/A',
    };

    try {
        addGig(newQuestion); // Broadcasting the question as a gig
        addToast('Question Broadcasted', 'Nearby workers will answer your questions soon.', 'success');
        navigate('/dashboard/client');
    } catch (error) {
        addToast('Error Asking Question', 'There was a problem broadcasting your question. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
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
            Back
          </button>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="bg-orange-600 p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <h1 className="text-4xl font-black mb-2 font-display italic uppercase tracking-tight">Ask a Question</h1>
            <p className="text-orange-100 font-medium">
              Nearby workers will answer your questions about stock, queues, or prices.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Question Topic
                </label>
                <div className="relative">
                  <HelpCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Stock check at OK Avondale"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-600/20 transition-all outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Store</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter store or address"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-600/20 transition-all outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bounty Reward</label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    required
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-600/20 transition-all outline-none"
                    value={formData.bounty}
                    onChange={(e) => setFormData({...formData, bounty: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                What do you want to know?
              </label>
              <textarea 
                rows={4}
                placeholder="e.g. Is there bread in stock? How long is the queue?"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-600/20 resize-none transition-all outline-none"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <div className="flex items-center text-xs font-bold text-slate-400">
                  <span className="h-2 w-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  Broadcast to Nearby Workers
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-10 py-4 bg-orange-600 shadow-orange-100 text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 uppercase tracking-widest text-sm"
                >
                  <span className="mr-1">
                    {loading ? 'Processing...' : 'Ask Nearby Workers'}
                  </span>
                  {!loading && (
                    <SendIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
