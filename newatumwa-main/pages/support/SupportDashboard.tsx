import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  TicketIcon, 
  UserCircleIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { Link } from 'react-router-dom';

const urgentTickets = [
  { id: 'T-1042', user: 'Farai M.', issue: 'Payment not reflecting', priority: 'high', time: '12m ago' },
  { id: 'T-1045', user: 'Sarah K.', issue: 'App crashing on checkout', priority: 'medium', time: '45m ago' },
];

const SupportDashboard: React.FC = () => {
  return (
    <DashboardShell role="support" title="Support Command">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Open Tickets"
          value="14"
          icon={TicketIcon}
          variant="brand"
          subtext="Requiring attention"
        />
        <StatCard
          label="Avg. Response"
          value="8m"
          icon={ClockIcon}
          subtext="Past 24 hours"
        />
        <StatCard
          label="Resolved Today"
          value="32"
          icon={CheckCircleIcon}
          variant="slate"
        />
        <StatCard
          label="Active Chats"
          value="5"
          icon={ChatBubbleLeftRightIcon}
          subtext="Live assistance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Priority Tickets</h3>
              <Link to="/dashboard/support/tickets" className="text-brand-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                All Tickets <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {urgentTickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      ticket.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      <ExclamationCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ticket.id}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ticket.time}</span>
                      </div>
                      <h4 className="font-black text-slate-900 leading-tight mt-1">{ticket.issue}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">User: {ticket.user}</p>
                    </div>
                  </div>
                  <button className="text-brand-600 font-black text-[10px] uppercase tracking-widest px-6 py-3 bg-white border border-slate-100 rounded-xl hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all">
                    Assign to me
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black uppercase italic tracking-tight">Recent Activity</h3>
               <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-400">Live Feed</div>
            </div>
            <div className="space-y-6">
               {[
                 { action: 'Ticket #T-1039 resolved', agent: 'Thabo', time: '5m ago' },
                 { action: 'New message in #T-1042', agent: 'System', time: '12m ago' },
                 { action: 'User "John D." initiated chat', agent: 'System', time: '18m ago' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-500"></div>
                    <div>
                       <p className="text-sm font-bold text-slate-200">{item.action}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">By {item.agent} • {item.time}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">Support Tools</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Knowledge Base', icon: ClipboardDocumentCheckIcon },
                 { label: 'Chat Monitor', icon: ChatBubbleLeftRightIcon },
                 { label: 'User Search', icon: UserCircleIcon },
                 { label: 'System Logs', icon: ExclamationCircleIcon },
               ].map((tool, idx) => (
                 <button key={idx} className="p-6 bg-slate-50 hover:bg-brand-50 rounded-3xl transition-all group flex flex-col items-center text-center gap-3">
                    <tool.icon className="w-6 h-6 text-slate-400 group-hover:text-brand-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-brand-600">{tool.label}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-brand-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">Performance Goal</h3>
                <p className="text-white/80 text-sm font-medium mb-4">Resolve 10 more tickets today to hit your daily target.</p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[68%]"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mt-3 text-white/60">22 / 32 Resolved</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SupportDashboard;
