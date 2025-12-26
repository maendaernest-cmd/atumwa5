import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType | React.ReactNode;
  subtext?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  variant?: 'brand' | 'slate' | 'white';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  subtext,
  trend,
  variant = 'white'
}) => {
  const variants = {
    white: 'bg-white border border-slate-100 text-slate-900',
    brand: 'bg-brand-600 text-white',
    slate: 'bg-slate-900 text-white'
  };

  const iconColors = {
    white: 'text-brand-600 bg-brand-50',
    brand: 'text-white bg-white/20',
    slate: 'text-brand-400 bg-white/10'
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const Icon = icon as React.ElementType;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${variants[variant]} p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all h-full`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 rounded-[1.5rem] ${iconColors[variant]}`}>
          {renderIcon()}
        </div>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
            trend.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
          variant === 'white' ? 'text-slate-400' : 'opacity-60'
        }`}>
          {label}
        </p>
        <h3 className="text-3xl font-black">{value}</h3>
        {subtext && (
          <p className={`text-[10px] font-bold mt-1 ${
            variant === 'white' ? 'text-slate-400' : 'opacity-60'
          }`}>
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
};
