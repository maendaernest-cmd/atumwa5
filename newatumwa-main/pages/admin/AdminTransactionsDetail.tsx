import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  HashtagIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function AdminTransactionsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tx = {
    id,
    amount: '$450.00',
    type: 'Payout',
    status: 'Completed',
    date: 'Dec 24, 2025, 14:30 PM',
    description: 'Weekly worker payout for completed errands (Week 51)',
    recipient: {
      name: 'John Doe',
      role: 'Worker',
      email: 'john.doe@example.com'
    },
    sender: {
      name: 'Atumwa Escrow',
      role: 'System',
      account: 'ATW-ESC-001'
    },
    method: 'EcoCash Mobile Money',
    reference: 'TXN-987654321-ATUM',
    fee: '$4.50',
    net: '$445.50'
  };

  return (
    <DashboardShell role="admin">
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Transactions
        </button>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-12 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">
                  <CheckBadgeIcon className="h-3 w-3 mr-1" />
                  {tx.status}
                </span>
                <span className="text-slate-500 text-xs font-bold">Ref: {tx.reference}</span>
              </div>
              <h1 className="text-4xl font-black font-display tracking-tight">{tx.amount}</h1>
              <p className="text-slate-400 font-medium mt-1">{tx.type} • {tx.date}</p>
            </div>
            <div className={`p-6 rounded-3xl ${tx.type === 'Payout' ? 'bg-red-500/10 text-red-400' : 'bg-brand-500/10 text-brand-400'}`}>
              {tx.type === 'Payout' ? <ArrowUpIcon className="h-10 w-10" /> : <ArrowDownIcon className="h-10 w-10" />}
            </div>
          </div>

          <div className="p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">From</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mr-4">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{tx.sender.name}</p>
                    <p className="text-xs font-bold text-slate-400">{tx.sender.role} • {tx.sender.account}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">To</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mr-4">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{tx.recipient.name}</p>
                    <p className="text-xs font-bold text-slate-400">{tx.recipient.role} • {tx.recipient.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Transaction Summary</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Gross Amount</span>
                <span className="font-black text-slate-900">{tx.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Processing Fee (1%)</span>
                <span className="font-black text-red-500">-{tx.fee}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-black text-slate-900">Net Amount Received</span>
                <span className="text-2xl font-black text-brand-600 font-display">{tx.net}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <HashtagIcon className="h-5 w-5 text-slate-400 mr-4 mt-1" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                  <p className="font-black text-slate-900">{tx.method}</p>
                </div>
              </div>
              <div className="flex items-start p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <CalendarIcon className="h-5 w-5 text-slate-400 mr-4 mt-1" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed On</p>
                  <p className="font-black text-slate-900">{tx.date}</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Note</h3>
              <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
                "{tx.description}"
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95">
                Download Receipt
              </button>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95">
                Flag Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
