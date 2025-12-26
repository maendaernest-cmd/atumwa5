import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Award, Calendar, DollarSign } from 'lucide-react';

interface EarningsData {
  day: string;
  amount: number;
  gigs: number;
  target: number;
}

interface WorkerPerformanceChartProps {
  earningsData: EarningsData[];
  totalEarnings: number;
  todaysEarnings: number;
  weeklyTarget: number;
  completionRate: number;
}

export const WorkerPerformanceChart: React.FC<WorkerPerformanceChartProps> = ({
  earningsData,
  totalEarnings,
  todaysEarnings,
  weeklyTarget,
  completionRate
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const maxEarnings = Math.max(...earningsData.map(d => d.amount));
  const weeklyProgress = (totalEarnings / weeklyTarget) * 100;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
      {/* Header with Period Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Performance Analytics</h3>
          <p className="text-slate-500 font-medium mt-1">Your earning trends and insights</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedPeriod === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedPeriod === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-black text-green-900">${totalEarnings.toFixed(0)}</div>
          <div className="text-xs font-bold text-green-700 uppercase tracking-widest">Total Earnings</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-600">{completionRate.toFixed(0)}%</span>
          </div>
          <div className="text-2xl font-black text-blue-900">{completionRate.toFixed(1)}%</div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">Completion Rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-900">${todaysEarnings.toFixed(0)}</div>
          <div className="text-xs font-bold text-purple-700 uppercase tracking-widest">Today</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-orange-600" />
            {weeklyProgress >= 100 ? <Award className="h-4 w-4 text-orange-500" /> : <TrendingUp className="h-4 w-4 text-orange-500" />}
          </div>
          <div className="text-2xl font-black text-orange-900">{weeklyProgress.toFixed(0)}%</div>
          <div className="text-xs font-bold text-orange-700 uppercase tracking-widest">Weekly Goal</div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-6">
        <h4 className="text-lg font-black text-slate-900 mb-6 uppercase italic tracking-tight">Daily Earnings</h4>
        <div className="space-y-4">
          {earningsData.map((day, index) => {
            const percentage = maxEarnings > 0 ? (day.amount / maxEarnings) * 100 : 0;
            const isToday = day.day === new Date().toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 text-sm font-bold text-slate-600 ${isToday ? 'text-blue-600' : ''}`}>
                  {day.day}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                      ${day.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">{day.gigs} gigs</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isToday ? 'bg-blue-500' : 'bg-slate-400'
                      }`}
                      style={{
                        width: `${percentage}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>

                {day.amount > day.target && (
                  <div className="text-green-500">
                    <TrendingUp size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-black text-blue-900 uppercase italic tracking-tight">Weekly Goal Progress</h4>
            <p className="text-sm text-blue-700">You're {weeklyProgress >= 100 ? 'ahead' : 'on track'} this week!</p>
          </div>
          <div className={`text-2xl ${weeklyProgress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
            {weeklyProgress >= 100 ? '🎉' : '📈'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-blue-900">${totalEarnings.toFixed(2)}</span>
            <span className="font-bold text-blue-700">${weeklyTarget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                weeklyProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {weeklyProgress >= 100
              ? `Goal exceeded by $${(totalEarnings - weeklyTarget).toFixed(2)}!`
              : `$${Math.max(0, weeklyTarget - totalEarnings).toFixed(2)} remaining`
            }
          </div>
        </div>
      </div>
    </div>
  );
};
