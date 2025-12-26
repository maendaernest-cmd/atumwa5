import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Zap, DollarSign, Smartphone, Coins, Search } from 'lucide-react';
import { Gig, GigType, PaymentMethod } from '../../types';
import { useData } from '../../context/DataContext';

const MOCK_LOCATIONS = [
  "Greenwood Pharmacy, Fife Ave",
  "Food Lovers Market, Avondale",
  "High Court, Samora Machel Ave",
  "Main Post Office, Inez Terrace",
  "Avenues Clinic, Mazowe St",
  "Eastgate Centre, CBD",
  "Sam Levy's Village, Borrowdale",
  "Joina City, CBD",
  "Parirenyatwa Hospital",
  "Westgate Shopping Mall",
  "Roadport Bus Station",
  "Mbare Musika",
  "University of Zimbabwe, Mt Pleasant",
  "Meikles Hotel, CBD",
  "RGM International Airport"
];

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({ label, value, onChange, placeholder, required }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.length > 0) {
      const filtered = MOCK_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (loc: string) => {
    onChange(loc);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative group">
        <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-brand-500" />
        <input
          required={required}
          type="text"
          className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-slate-400 transition-shadow"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onFocus={() => {
            if (value.length > 0) setShowSuggestions(true);
          }}
          autoComplete="off"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 bg-transparent rounded-full p-0.5 hover:bg-slate-100 transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {showSuggestions && value.length > 0 && (
        <div className="absolute z-20 w-full bg-white mt-1 border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {suggestions.length > 0 ? (
            suggestions.map((loc, idx) => (
              <div
                key={idx}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 flex items-center gap-2 border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => handleSelect(loc)}
              >
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{loc}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500 flex items-center justify-center gap-2 italic">
              <Search size={14} />
              <span>No locations found</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gigData: Omit<Gig, 'id' | 'postedBy' | 'postedAt' | 'distance' | 'status'>) => void;
  prefillData?: Partial<Pick<Gig, 'title' | 'description' | 'type' | 'locationStart' | 'locationEnd' | 'paymentMethod'>>;
}

export const PostGigModal: React.FC<PostGigModalProps> = ({ isOpen, onClose, onSubmit, prefillData }) => {
  const { exchangeRates } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'shopping' as GigType,
    price: '',
    locationStart: '',
    locationEnd: '',
    paymentMethod: 'cash_usd' as PaymentMethod
  });
  const [urgency, setUrgency] = useState<'standard' | 'express' | 'priority'>('standard');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (prefillData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...prefillData
      }));
      setCurrentStep(1);
    }
  }, [prefillData, isOpen]);

  useEffect(() => {
    let basePrice = 15;
    if (formData.type === 'shopping') basePrice = 25;
    if (formData.type === 'paperwork') basePrice = 20;
    if (formData.type === 'parcel') basePrice = 18;
    if (formData.type === 'prescription') basePrice = 15;

    let multiplier = 1;
    if (urgency === 'express') multiplier = 1.3;
    if (urgency === 'priority') multiplier = 1.8;

    const demandVariance = 1 + (Math.random() * 0.1 - 0.05);
    let finalPrice = basePrice * multiplier * demandVariance;

    if (formData.paymentMethod === 'zig') {
      finalPrice = finalPrice * exchangeRates.usd_to_zig;
    }

    setFormData(prev => ({ ...prev, price: finalPrice.toFixed(2) }));
  }, [formData.type, urgency, formData.paymentMethod, exchangeRates]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0
    });
    setFormData({ title: '', description: '', type: 'shopping', price: '', locationStart: '', locationEnd: '', paymentMethod: 'cash_usd' });
    setUrgency('standard');
    setCurrentStep(1);
  };

  const handleClose = () => {
    onClose();
    setFormData({ title: '', description: '', type: 'shopping', price: '', locationStart: '', locationEnd: '', paymentMethod: 'cash_usd' });
    setUrgency('standard');
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-xl flex flex-col h-[92vh] sm:h-auto sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in duration-300">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white/50 backdrop-blur rounded-t-3xl shrink-0">
          <div>
            <h2 className="font-black text-xl text-slate-900 tracking-tight">Request an Errand</h2>
            <div className="flex gap-1.5 mt-1.5">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'w-4 bg-brand-500' : 'w-2 bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'w-4 bg-brand-500' : 'w-2 bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'w-4 bg-brand-500' : 'w-2 bg-slate-200'}`} />
            </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['prescription', 'paperwork', 'shopping', 'parcel'] as GigType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all group ${formData.type === type
                            ? 'bg-brand-50 border-brand-500 shadow-sm shadow-brand-100'
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${formData.type === type ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                            {type === 'prescription' ? '💊' : type === 'paperwork' ? '📄' : type === 'shopping' ? '🛒' : '📦'}
                          </div>
                          <span className={`text-xs font-black uppercase tracking-widest ${formData.type === type ? 'text-brand-700' : 'text-slate-500'}`}>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Task Essentials</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-inner"
                      placeholder="Briefly, what needs doing?"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                    <textarea
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium placeholder-slate-400 min-h-[120px] focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-inner resize-none"
                      placeholder="Any specific items or special instructions for the Atumwa?"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 items-center">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Live Routing</p>
                      <p className="text-[10px] text-blue-700 font-medium">Nearest Atumwa will be matched instantly.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <LocationInput
                      label="Collection Point"
                      placeholder="Enter store name or address"
                      value={formData.locationStart}
                      onChange={(val) => setFormData({ ...formData, locationStart: val })}
                      required
                    />
                    <div className="flex justify-center -my-2 opacity-30">
                      <div className="h-4 w-px bg-slate-400 border-dashed border-l" />
                    </div>
                    <LocationInput
                      label="Final Destination"
                      placeholder="Where are we delivering to?"
                      value={formData.locationEnd}
                      onChange={(val) => setFormData({ ...formData, locationEnd: val })}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Select Urgency & Speed</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency('standard')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${urgency === 'standard' ? 'border-slate-800 bg-slate-900 text-white shadow-lg' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        <span className="text-sm font-black">Std.</span>
                        <span className="text-[10px] font-medium opacity-70">~45m</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('express')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${urgency === 'express' ? 'border-amber-500 bg-amber-500 text-white shadow-lg' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        <span className="text-sm font-black">Express</span>
                        <span className="text-[10px] font-medium opacity-90">~25m</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('priority')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${urgency === 'priority' ? 'border-red-600 bg-red-600 text-white shadow-lg' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        <Zap size={14} className="fill-current" />
                        <span className="text-sm font-black">Fast</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Settlement Details</label>

                    <div className="flex justify-between items-end mb-6">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">You will pay</p>
                        <p className="text-4xl font-black font-display tracking-tight">{formData.paymentMethod === 'zig' ? '' : '$'}{formData.price}{formData.paymentMethod === 'zig' ? ' ZiG' : ''}</p>
                      </div>
                      <div className="flex gap-2">
                        {(['cash_usd', 'ecocash', 'zig'] as PaymentMethod[]).map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setFormData({ ...formData, paymentMethod: m })}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${formData.paymentMethod === m ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                          >
                            {m === 'cash_usd' ? <DollarSign size={18} /> : m === 'ecocash' ? <Smartphone size={18} /> : <Coins size={18} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center font-medium uppercase tracking-widest">Includes base fee + distance + {urgency} multiplier</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-display"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1 && (!formData.title || !formData.description)) return;
                    if (currentStep === 2 && (!formData.locationStart || !formData.locationEnd)) return;
                    setCurrentStep(prev => prev + 1);
                  }}
                  className="flex-[2] bg-brand-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                >
                  Confirm & Continue
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`flex-[2] text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 uppercase tracking-widest ${urgency === 'priority' ? 'bg-red-600 shadow-red-200/50' : 'bg-brand-600 shadow-brand-200/50'}`}
                >
                  Launch Request
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
