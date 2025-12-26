import React from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';

const activeTasks = [
  { 
    id: 'GIG-501', 
    title: 'Pharmacy Pickup', 
    client: 'John D.', 
    location: 'Avondale Shops', 
    status: 'In Transit', 
    price: 15.00,
    steps: [
      { label: 'Pickup at MedRight Pharmacy', completed: true },
      { label: 'Verify prescription ID', completed: true },
      { label: 'Deliver to 12 Mazowe St', completed: false },
    ]
  }
];

export default function WorkerActive() {
  return (
    <DashboardShell role="worker" title="Active Tasks">
      <div className="space-y-8">
        {activeTasks.length > 0 ? (
          activeTasks.map(task => (
            <div key={task.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live Task</span>
                    <span className="text-slate-400 text-xs font-bold">{task.id}</span>
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">{task.title}</h2>
                  <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                    <MapPinIcon className="w-4 h-4 text-brand-400" /> {task.location}
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" /> Chat Client
                  </button>
                  <div className="hidden md:block w-px h-12 bg-white/10"></div>
                  <div className="text-right hidden md:block">
                    <p className="text-2xl font-black text-brand-400">${task.price.toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Estimated Payout</p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase italic mb-6">Execution Checklist</h3>
                    <div className="space-y-4">
                      {task.steps.map((step, idx) => (
                        <div key={idx} className={`flex items-center gap-4 p-6 rounded-3xl border transition-all ${
                          step.completed ? 'bg-brand-50 border-brand-100 opacity-60' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            step.completed ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-200 text-slate-300'
                          }`}>
                            {step.completed ? <CheckBadgeIcon className="w-5 h-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                          </div>
                          <span className={`flex-1 font-bold ${step.completed ? 'text-brand-900 line-through' : 'text-slate-700'}`}>
                            {step.label}
                          </span>
                          {!step.completed && (
                            <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all">
                              Complete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
                     <h4 className="text-amber-900 font-black uppercase italic text-sm mb-2">Client Instructions</h4>
                     <p className="text-amber-800/80 text-sm font-medium leading-relaxed italic">
                       "Please make sure the medicine is kept in a cool bag. I'll be waiting at the front gate."
                     </p>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                      <h4 className="text-slate-900 font-black uppercase italic text-sm mb-6">Task Progress</h4>
                      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
                         <div className="absolute inset-y-0 left-0 bg-brand-500 w-[66%] transition-all duration-1000"></div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 of 3 Completed</span>
                         <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">66%</span>
                      </div>
                   </div>

                   <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                      Finish task <ArrowRightIcon className="w-5 h-5" />
                   </button>
                   
                   <button className="w-full bg-white hover:bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 transition-all">
                      Report Problem
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
             <BriefcaseIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-900 uppercase italic">No active tasks</h3>
             <p className="text-slate-400 font-medium mt-2">Pick up a gig from the marketplace to get started.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
