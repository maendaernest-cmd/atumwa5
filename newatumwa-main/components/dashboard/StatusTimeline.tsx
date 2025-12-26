import React from 'react';

interface StatusTimelineProps {
  status: string;
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, className = '' }) => {
  const steps = [
    { key: 'open', label: 'Posted' },
    { key: 'in-progress', label: 'Active' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'completed', label: 'Done' }
  ];

  const currentIndex = steps.findIndex(step => step.key === status);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 ${
              index <= currentIndex
                ? 'bg-brand-500 border-brand-500'
                : 'border-slate-300 bg-white'
            }`} />
            <span className={`text-[8px] mt-1 font-bold uppercase tracking-widest ${
              index <= currentIndex ? 'text-brand-600' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${
              index < currentIndex ? 'bg-brand-500' : 'bg-slate-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};