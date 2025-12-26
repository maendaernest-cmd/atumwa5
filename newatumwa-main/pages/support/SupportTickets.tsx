import React from 'react';
import { 
  TicketIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UserCircleIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';

const tickets = [
  { id: 'T-1042', user: 'Farai M.', issue: 'Payment not reflecting in wallet', priority: 'high', status: 'Open', time: '12m ago', category: 'Billing' },
  { id: 'T-1045', user: 'Sarah K.', issue: 'Unable to upload ID for verification', priority: 'medium', status: 'In Progress', time: '45m ago', category: 'Account' },
  { id: 'T-1038', user: 'John D.', issue: 'Package delivered to wrong address', priority: 'critical', status: 'Open', time: '2m ago', category: 'Gig Issue' },
  { id: 'T-1035', user: 'Mike R.', issue: 'How do I change my phone number?', priority: 'low', status: 'Resolved', time: '2h ago', category: 'General' },
];

export default function SupportTickets() {
  return (
    <DashboardShell role="support" title="Support Queue">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets by ID, user, or issue..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                <FunnelIcon className="w-4 h-4" /> Filter
             </button>
             <button className="bg-brand-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-700 shadow-lg shadow-brand-100 transition-all">
                Export Log
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Info</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {tickets.map(ticket => (
                   <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                               <UserCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 leading-tight">{ticket.user}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{ticket.id}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                         <p className="font-bold text-slate-700 text-sm leading-relaxed">{ticket.issue}</p>
                         <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-1 inline-block">{ticket.category}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           ticket.priority === 'critical' ? 'bg-red-100 text-red-600' :
                           ticket.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                           ticket.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                           'bg-slate-100 text-slate-600'
                         }`}>
                            {ticket.priority}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              ticket.status === 'Open' ? 'bg-green-500' :
                              ticket.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-slate-300'
                            }`}></div>
                            <span className="text-xs font-bold text-slate-700">{ticket.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="text-brand-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                            Open Chat
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </DashboardShell>
  );
}
