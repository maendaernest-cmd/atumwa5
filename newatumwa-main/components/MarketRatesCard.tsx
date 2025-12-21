import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export const MarketRatesCard: React.FC = () => {
    const { exchangeRates } = useData();

    return (
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-400" />
                Live Market Rates
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium uppercase tracking-wider">1.00 USD Basis</span>
                    <span className="font-black text-green-400 text-lg">{exchangeRates.usd_to_zig.toFixed(2)} ZiG</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Live Converter</p>
                    <div className="space-y-2">
                        <div className="flex bg-white/5 p-3 rounded-xl border border-white/10 items-center justify-between group hover:bg-white/10 transition-all">
                            <span className="text-xs font-bold">15 USD</span>
                            <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                            <span className="text-xs font-black text-brand-400">{(15 * exchangeRates.usd_to_zig).toFixed(2)} ZiG</span>
                        </div>
                        <div className="flex bg-white/5 p-3 rounded-xl border border-white/10 items-center justify-between group hover:bg-white/10 transition-all">
                            <span className="text-xs font-bold">50 USD</span>
                            <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                            <span className="text-xs font-black text-brand-400">{(50 * exchangeRates.usd_to_zig).toFixed(2)} ZiG</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
