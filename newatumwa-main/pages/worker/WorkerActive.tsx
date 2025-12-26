import React, { useState } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { UpdateGigStatusModal } from '../../components/UpdateGigStatusModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Gig, TaskStatus } from '../../types';

export default function WorkerActive() {
  const { user } = useAuth();
  const { gigs, updateChecklistItem, updateGigStatus, createTicket } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const activeTasks = gigs.filter(g => g.assignedTo === user?.id && g.status === 'in-progress');

  const handleOpenModal = (gig: Gig) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (status: TaskStatus) => {
    if (selectedGig) {
      updateGigStatus(selectedGig.id, status);
      addToast('Task Status Updated', `Task is now "${status}"`, 'success');
    }
  };

  const handleReportProblem = (gigId: string, gigTitle: string) => {
    const problem = window.prompt(`Describe the problem you're having with "${gigTitle}":`);
    if (problem && user) {
      const newTicket = {
        sender: user,
        subject: `Problem with Gig: ${gigTitle}`,
        category: 'gig_issue',
        priority: 'high',
        gigId: gigId,
        messages: [{ sender: user, text: problem, timestamp: new Date().toISOString() }],
      };
      createTicket(newTicket);
      addToast('Problem Reported', 'A support ticket has been created.', 'info');
    }
  };
  
  return (
    <DashboardShell role="worker" title="Active Tasks">
      <div className="space-y-8">
        {activeTasks.length > 0 ? (
          activeTasks.map(task => {
            const completedSteps = task.checklist.filter(step => step.completed).length;
            const allRequiredStepsCompleted = task.checklist.filter(s => s.required).every(s => s.completed);

            return (
              <div key={task.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-brand-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live Task</span>
                      <span className="text-slate-400 text-xs font-bold">{task.id}</span>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tight">{task.title}</h2>
                    <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                      <MapPinIcon className="w-4 h-4 text-brand-400" /> {task.locationStart} to {task.locationEnd}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <button 
                        onClick={() => handleOpenModal(task)}
                        className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        Update Status <ChevronDownIcon className="w-4 h-4"/>
                    </button>
                    <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" /> Chat Client
                    </button>
                  </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase italic mb-6">Execution Checklist</h3>
                      <div className="space-y-4">
                        {task.checklist.map((step, idx) => (
                          <div key={step.id} className={`flex items-center gap-4 p-6 rounded-3xl border transition-all ${
                            step.completed ? 'bg-brand-50 border-brand-100 opacity-60' : 'bg-slate-50 border-slate-100'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                              step.completed ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-200 text-slate-300'
                            }`}>
                              {step.completed ? <CheckBadgeIcon className="w-5 h-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                            </div>
                            <span className={`flex-1 font-bold ${step.completed ? 'text-brand-900 line-through' : 'text-slate-700'}`}>
                              {step.text}
                            </span>
                            {!step.completed && (
                              <button 
                                onClick={() => updateChecklistItem(task.id, step.id, true)}
                                className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all">
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
                         "{task.description}"
                       </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <h4 className="text-slate-900 font-black uppercase italic text-sm mb-6">Task Progress</h4>
                        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
                           <div className="absolute inset-y-0 left-0 bg-brand-500" style={{ width: `${(completedSteps / task.checklist.length) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completedSteps} of {task.checklist.length} Completed</span>
                           <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{Math.round((completedSteps / task.checklist.length) * 100)}%</span>
                        </div>
                     </div>

                     <button 
                       onClick={() => updateGigStatus(task.id, 'delivered')}
                       disabled={!allRequiredStepsCompleted}
                       className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                     >
                        Finish task <ArrowRightIcon className="w-5 h-5" />
                     </button>
                     
                     <button
                       onClick={() => handleReportProblem(task.id, task.title)} 
                       className="w-full bg-white hover:bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 transition-all">
                        Report Problem
                     </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
             <BriefcaseIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-900 uppercase italic">No active tasks</h3>
             <p className="text-slate-400 font-medium mt-2">Pick up a gig from the marketplace to get started.</p>
          </div>
        )}
      </div>
      <UpdateGigStatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateStatus}
        gig={selectedGig}
      />
    </DashboardShell>
  );
}
