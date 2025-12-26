import React from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const ActivityTimeline: React.FC = () => {
  const activities = [
    { id: 1, type: 'success', text: 'Errand #GIG-742 completed', time: '2h ago' },
    { id: 2, type: 'info', text: 'New worker assigned to #GIG-745', time: '5h ago' },
    { id: 3, type: 'warning', text: 'Payment pending for #GIG-748', time: 'Yesterday' },
  ];

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Activity Timeline</h3>
      <div className="space-y-6">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className={`mt-1 p-2 rounded-lg ${
              item.type === 'success' ? 'bg-brand-50 text-brand-600' :
              item.type === 'warning' ? 'bg-red-50 text-red-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              {item.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> :
               item.type === 'warning' ? <ExclamationCircleIcon className="w-4 h-4" /> :
               <ClockIcon className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{item.text}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
