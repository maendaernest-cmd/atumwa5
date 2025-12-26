import React from 'react';

interface DashboardShellProps {
  children: React.ReactNode;
  role: string;
  title?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children, role, title }) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{title}</h1>
            <p className="text-slate-500 font-medium capitalize">{role} control center</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
