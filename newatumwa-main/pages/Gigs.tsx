import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MOCK_GIGS, MOCK_USERS, MOCK_ATUMWA } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Gig, GigType, PaymentMethod } from '../types';
import { MapPin, Clock, Filter, ShoppingBag, FileText, Pill, Package, X, Search, Trash2, CheckCircle, Navigation, AlertCircle, Shield, Flag, Zap, TrendingUp, Map, MessageSquare, DollarSign, Wallet, CheckCircle2, Briefcase, Smartphone, Coins, Loader2, Home, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

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

interface GigCardProps {
  gig: Gig;
  isOwner?: boolean;
  isAdmin?: boolean;
  onAction?: (action: 'accept' | 'complete' | 'cancel' | 'track' | 'chat', gigId: string, price?: number) => void;
  onViewMap?: (gigId: string) => void;
  userRole?: string;
}

const GigCard: React.FC<GigCardProps> = ({ gig, isOwner, isAdmin, onAction, onViewMap, userRole }) => {
  const getTypeIcon = (type: GigType) => {
    switch (type) {
      case 'prescription': return <Pill className="text-red-500" />;
      case 'paperwork': return <FileText className="text-stone-500" />;
      case 'shopping': return <ShoppingBag className="text-green-500" />;
      case 'parcel': return <Package className="text-amber-500" />;
    }
  };

  const getTypeLabel = (type: GigType) => {
    switch (type) {
      case 'prescription': return 'Prescription';
      case 'paperwork': return 'Documents';
      case 'shopping': return 'Shopping';
      case 'parcel': return 'Parcel';
    }
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'ecocash': return <Smartphone size={14} className="text-blue-600" />;
      case 'zig': return <Coins size={14} className="text-amber-600" />;
      case 'cash_usd': return <DollarSign size={14} className="text-green-600" />;
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'ecocash': return 'EcoCash';
      case 'zig': return 'ZiG';
      case 'cash_usd': return 'Cash USD';
    }
  };

  // Calculate if gig is expiring soon (older than 48h but less than 72h)
  const hoursOld = (Date.now() - new Date(gig.postedAt).getTime()) / (1000 * 60 * 60);
  const hoursLeft = 72 - hoursOld;
  const isExpiringSoon = gig.status === 'open' && hoursLeft > 0 && hoursLeft <= 24;

  // Visual state for card based on status
  const cardStyle = {
    completed: 'border-green-200 bg-green-50/20',
    expired: 'border-slate-100 bg-slate-50 opacity-75',
    urgent: 'border-red-300 bg-red-50/40 shadow-md ring-1 ring-red-200',
    default: 'border-slate-100 bg-white hover:shadow-md'
  };

  const currentStyle = gig.status === 'completed'
    ? cardStyle.completed
    : gig.status === 'expired'
      ? cardStyle.expired
      : isExpiringSoon
        ? cardStyle.urgent
        : cardStyle.default;

  return (
    <div className={`p-5 rounded-xl shadow-sm border transition-all relative ${currentStyle}`}>
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${gig.status === 'completed' ? 'bg-green-100 border-green-200'
            : gig.status === 'expired' ? 'bg-slate-200 border-slate-300'
              : isExpiringSoon ? 'bg-red-100 border-red-200'
                : 'bg-slate-50 border-slate-100'
            }`}>
            {gig.status === 'completed' ? <CheckCircle className="text-green-600" />
              : gig.status === 'expired' ? <Clock className="text-slate-500" />
                : getTypeIcon(gig.type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                {getTypeLabel(gig.type)}
              </span>
              <span className="text-xs text-slate-400">• {new Date(gig.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {gig.status === 'in-progress' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 rounded">In Progress</span>}
              {gig.status === 'completed' && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 rounded">Completed</span>}
              {gig.status === 'expired' && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 rounded">Expired</span>}
              {isExpiringSoon && (
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1 border border-red-200 animate-pulse shadow-sm">
                  <Flag size={10} className="fill-red-700" /> Urgent: {Math.ceil(hoursLeft)}h left
                </span>
              )}
            </div>
            <h3 className={`font-bold text-lg leading-tight mb-1 ${gig.status === 'expired' ? 'text-slate-500' : 'text-slate-800'}`}>{gig.title}</h3>
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <span className="mr-3 flex items-center gap-1"><MapPin size={14} /> {gig.distance}</span>
              <span className="mr-3 font-medium text-slate-700">From: {gig.locationStart}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMap?.(gig.id);
                }}
                className="text-brand-600 hover:text-brand-800 hover:bg-brand-50 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-bold"
                title="View on Map"
              >
                <Map size={14} /> <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Price Tag */}
        <div className="text-right">
          <div className={`text-xl font-bold ${gig.status === 'completed' ? 'text-green-600' : gig.status === 'expired' ? 'text-slate-500' : isExpiringSoon ? 'text-red-600' : 'text-slate-800'}`}>${gig.price.toFixed(2)}</div>
          <div className={`text-xs font-medium flex items-center justify-end gap-1 ${gig.paymentMethod === 'ecocash' ? 'text-blue-600' :
            gig.paymentMethod === 'zig' ? 'text-amber-600' : 'text-green-600'
            }`}>
            {getPaymentIcon(gig.paymentMethod)} {getPaymentLabel(gig.paymentMethod)}
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-sm mt-3 mb-4 line-clamp-2">
        {gig.description}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <img src={gig.postedBy.avatar} alt={gig.postedBy.name} className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium text-slate-700">{gig.postedBy.name}</span>
          <span className="text-xs text-amber-500">★ {gig.postedBy.rating}</span>
          {gig.postedBy.isVerified && <CheckCircle size={12} className="text-blue-500 fill-blue-50" />}
        </div>

        <div className="flex gap-2">
          {/* Actions for Atumwa */}
          {userRole === 'atumwa' && gig.status === 'open' && (
            <button
              onClick={() => onAction?.('accept', gig.id)}
              className="bg-brand-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors text-sm shadow-sm"
            >
              Accept Gig
            </button>
          )}

          {userRole === 'atumwa' && gig.status === 'in-progress' && (
            <button
              onClick={() => onAction?.('complete', gig.id, gig.price)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm shadow-sm flex items-center gap-2"
            >
              <CheckCircle size={16} /> Mark Done
            </button>
          )}

          {/* Actions for Client */}
          {isOwner && gig.status === 'open' && (
            <button
              onClick={() => onAction?.('cancel', gig.id)}
              className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 size={16} /> Cancel
            </button>
          )}

          {isOwner && gig.status === 'expired' && (
            <button
              onClick={() => onAction?.('cancel', gig.id)}
              className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 size={16} /> Remove
            </button>
          )}

          {/* Client Actions: Chat & Track for In-Progress and Completed */}
          {isOwner && (gig.status === 'in-progress' || gig.status === 'completed') && (
            <>
              {gig.status === 'in-progress' && (
                <button
                  onClick={() => onAction?.('track', gig.id)}
                  className="bg-slate-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-slate-800 transition-all text-sm flex items-center gap-2 shadow-md shadow-slate-200"
                >
                  <Navigation size={16} /> Track
                </button>
              )}
              <button
                onClick={() => onAction?.('chat', gig.id)}
                className="bg-brand-50 text-brand-600 px-5 py-2 rounded-lg font-medium hover:bg-brand-100 transition-colors text-sm flex items-center gap-2"
              >
                <MessageSquare size={16} /> Chat
              </button>
            </>
          )}

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-1">
              <button
                onClick={() => onAction?.('chat', gig.id)}
                className="text-slate-400 hover:text-brand-600 p-1.5 rounded hover:bg-brand-50 transition-colors"
                title="Message Owner"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={() => onAction?.('cancel', gig.id)}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"
                title="Delete Gig"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    // Close dropdown when clicking outside
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

const PostGigModal: React.FC<PostGigModalProps> = ({ isOpen, onClose, onSubmit, prefillData }) => {
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

  // Prefill data when modal opens
  useEffect(() => {
    if (prefillData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...prefillData
      }));
      setCurrentStep(1); // Reset to first step
    }
  }, [prefillData, isOpen]);

  // Dynamic Pricing Logic with ZiG conversion
  useEffect(() => {
    let basePrice = 15; // USD
    if (formData.type === 'shopping') basePrice = 25;
    if (formData.type === 'paperwork') basePrice = 20;
    if (formData.type === 'parcel') basePrice = 18;
    if (formData.type === 'prescription') basePrice = 15;

    let multiplier = 1;
    if (urgency === 'express') multiplier = 1.3;
    if (urgency === 'priority') multiplier = 1.8;

    const demandVariance = 1 + (Math.random() * 0.1 - 0.05);
    let finalPrice = basePrice * multiplier * demandVariance;

    // Convert if ZiG selected
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

            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
                    <div className="h-4 w-px bg-slate-400 dashed" />
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
                      <p className="text-4xl font-black">{formData.paymentMethod === 'zig' ? '' : '$'}{formData.price}{formData.paymentMethod === 'zig' ? ' ZiG' : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      {['cash_usd', 'ecocash', 'zig'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: m as any })}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${formData.paymentMethod === m ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                        >
                          {m === 'cash_usd' ? <DollarSign size={18} /> : m === 'ecocash' ? <Smartphone size={18} /> : <Coins size={18} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center font-medium">Includes base fee + distance + {urgency} multiplier</p>
                </div>
              </motion.div>
            )}

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

const CompleteGigModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => void;
  gig: Gig | null;
}> = ({ isOpen, onClose, onConfirm, gig }) => {
  const [confirmPrice, setConfirmPrice] = useState('');

  useEffect(() => {
    if (gig) setConfirmPrice(gig.price.toFixed(2));
  }, [gig]);

  if (!isOpen || !gig) return null;

  const getPaymentInstruction = () => {
    if (gig?.paymentMethod === 'cash_usd') return "Verify you have collected the full cash amount from the client.";
    if (gig?.paymentMethod === 'ecocash') return "Verify you have received the EcoCash transfer on your phone.";
    if (gig?.paymentMethod === 'zig') return "Verify you have received the ZiG transfer to your wallet.";
    return "Verify the final agreed amount to release funds.";
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 mx-auto">
          <CheckCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2 text-center">Complete Job?</h2>
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 mb-2">
            Confirming completion for <strong>{gig.title}</strong>.
          </p>
          <div className={`text-xs font-semibold px-3 py-2 rounded-lg inline-block border ${gig.paymentMethod === 'cash_usd' ? 'bg-green-50 text-green-700 border-green-200' :
            gig.paymentMethod === 'ecocash' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
            {getPaymentInstruction()}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Final Payment Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="number"
              step="0.01"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={confirmPrice}
              onChange={(e) => setConfirmPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(parseFloat(confirmPrice) || 0)}
            className="flex-1 py-2.5 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW COMPONENT FOR STATS ---
const StatsCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);

const DashboardStats = ({ user, gigs }: { user: any, gigs: Gig[] }) => {
  if (user.role === 'client') {
    const active = gigs.filter((g) => g.postedBy.id === user.id && g.status === 'open').length;
    const inProgress = gigs.filter((g) => g.postedBy.id === user.id && g.status === 'in-progress').length;
    const completed = gigs.filter((g) => g.postedBy.id === user.id && g.status === 'completed').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Active Requests" value={active} icon={AlertCircle} color="bg-brand-100 text-brand-600" subtext="Waiting for runner" />
        <StatsCard title="In Progress" value={inProgress} icon={Clock} color="bg-amber-100 text-amber-600" subtext="Track real-time" />
        <StatsCard title="Completed" value={completed} icon={CheckCircle2} color="bg-green-100 text-green-600" subtext="All time" />
      </div>
    );
  }

  if (user.role === 'atumwa') {
    const available = gigs.filter((g) => g.status === 'open' && g.postedBy.id !== user.id).length;
    const myActive = gigs.filter((g) => g.assignedTo === user.id && g.status === 'in-progress').length;
    // Mock earnings calculation
    const earnings = gigs.filter((g) => g.assignedTo === user.id && g.status === 'completed').reduce((acc, curr) => acc + curr.price, 0);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Available Nearby" value={available} icon={MapPin} color="bg-brand-100 text-brand-600" subtext="Within 10km" />
        <StatsCard title="Active Jobs" value={myActive} icon={Briefcase} color="bg-blue-100 text-blue-600" subtext="In progress" />
        <StatsCard title="Total Earnings" value={`$${earnings.toFixed(2)}`} icon={Wallet} color="bg-green-100 text-green-600" subtext="Lifetime" />
      </div>
    );
  }

  return null;
};



export const Gigs: React.FC = () => {
  const { user } = useAuth();
  const { gigs, addGig, updateGigStatus, assignGig, confirmPayment, exchangeRates } = useData(); // Use global data
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<GigType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed' | 'expired'>('all');
  const [viewMode, setViewMode] = useState<'browse' | 'my_jobs'>('browse');

  // NOTE: Local state `gigs` removed in favor of `gigs` from useData()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completingGig, setCompletingGig] = useState<Gig | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openPostModal) {
      setIsModalOpen(true);
      // Clean up state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    // Check for expired gigs logic moved here or could be in DataContext
    // For now we keep it visual
    const checkExpiration = () => {
      // Logic to auto-expire can be implemented in DataContext or backend
    };
  }, []);

  // Simulate High Priority Push Notification for Atumwas
  useEffect(() => {
    if (user?.role !== 'atumwa') return;
    // Debounce to allow page load
    const timeout = setTimeout(() => {
      // Only show if there's an actual high priority gig? For now keep demo logic or bind to real data
    }, 5000);
    return () => clearTimeout(timeout);
  }, [user]);

  if (!user) return null;

  const handleCreateGig = (data: Omit<Gig, 'id' | 'postedBy' | 'postedAt' | 'distance' | 'status'>) => {
    const newGig: Gig = {
      id: `g${Date.now()}`,
      ...data,
      status: 'open',
      postedBy: user,
      postedAt: new Date().toISOString(),
      distance: '0.5 km', // This would normally be calculated from coordinates
      coordinates: { lat: -17.82 + (Math.random() * 0.05), lng: 31.05 + (Math.random() * 0.05) } // Random location in Harare for demo
    };
    addGig(newGig); // Global add
    setIsModalOpen(false);
    addToast('Request Posted', 'Your gig is now live and visible to nearby messengers.', 'success');
  };

  const handleViewMap = (gigId: string) => {
    navigate('/map', { state: { selectedGigId: gigId } });
  };

  const handleConfirmCompletion = (finalPrice: number) => {
    if (!completingGig) return;

    // Industry Standard: Verify settlement method
    const method = completingGig.paymentMethod;
    confirmPayment(completingGig.id, method); // Simulated Backend API Call

    addToast(
      'Payment Released',
      `Transaction complete. ${method === 'zig' ? 'ZiG' : 'USD'} ${finalPrice.toFixed(2)} has been released to your wallet via ${method.toUpperCase()}.`,
      'earnings'
    );
    setCompletingGig(null);
  };

  const handleGigAction = (action: 'accept' | 'complete' | 'cancel' | 'track' | 'chat', gigId: string, price?: number) => {
    if (action === 'complete') {
      const gig = gigs.find(g => g.id === gigId);
      if (gig) setCompletingGig(gig);
    } else if (action === 'cancel') {
      if (window.confirm("Are you sure you want to cancel this gig?")) {
        updateGigStatus(gigId, 'cancelled');
        addToast('Gig Cancelled', 'The gig has been cancelled.', 'info');
      }
    } else if (action === 'track') {
      navigate('/map', { state: { selectedGigId: gigId } });
    } else if (action === 'accept') {
      if (!user) {
        addToast('Error', 'You must be logged in to accept a gig.', 'error');
        return;
      }
      assignGig(gigId, user.id);
      addToast('Gig Accepted', 'You have accepted this gig. Head to the map to start!', 'success');
      navigate('/map', { state: { selectedGigId: gigId } });
    } else if (action === 'chat') {
      const gig = gigs.find(g => g.id === gigId);
      if (gig) {
        let recipientId = '';
        let recipientName = 'Messenger';

        if (user?.id === gig.postedBy.id && gig.assignedTo) {
          recipientId = gig.assignedTo;
        } else if (user?.id === gig.assignedTo) {
          recipientId = gig.postedBy.id;
          recipientName = gig.postedBy.name;
        } else if (!gig.assignedTo && user?.role === 'atumwa') {
          recipientId = gig.postedBy.id;
          recipientName = gig.postedBy.name;
        }

        if (recipientId) {
          navigate('/messages', { state: { recipientId, recipientName, gigId } });
        } else {
          addToast('Error', 'Cannot start chat.', 'error');
        }
      }
    }
  };

  // Filter Logic (using global gigs)
  const filteredGigs = gigs.filter(gig => {
    // 1. View Mode Filter (Atumwa only)
    if (user.role === 'atumwa') {
      if (viewMode === 'my_jobs') {
        // Show jobs assigned to me
        if (gig.assignedTo !== user.id) return false;
      } else {
        // Browse Mode: Show Open jobs OR jobs assigned to me (but usually just open)
        if (gig.status !== 'open') return false;
      }
    }

    // 2. Client Filter (Owner only)
    if (user.role === 'client') {
      // Clients see all THEIR gigs, plus maybe public ones? Usually just theirs.
      // The UI for client usually shows "My Requests".
      // If the page is "Gigs" (Marketplace), maybe they just see theirs?
      // Let's assume Gigs page for Client = My Posted Gigs
      if (gig.postedBy.id !== user.id) return false;
    }

    // 3. Category Filter
    if (filter !== 'all' && gig.type !== filter) return false;

    // 4. Status Filter (Admin mainly, or Client tabs)
    // For Client, status is handled by Tabs often, but here we have a dropdown?
    // Lets respect the variable statusFilter if used.
    if (statusFilter !== 'all' && gig.status !== statusFilter) return false;

    return true;
  }).sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());



  // Counts for Atumwa toggle
  const browseCount = gigs.filter(g => g.postedBy.id !== user.id && g.status === 'open').length;
  const myJobsCount = gigs.filter(g => g.assignedTo === user.id).length;

  return (
    <div className="space-y-6 relative">
      {/* Messenger-Specific Header */}
      {user.role === 'atumwa' && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">Delivery Opportunities</h2>
              <p className="text-sm opacity-90">Available tasks in your area</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      )}

      <PostGigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGig}
        prefillData={location.state?.prefillData}
      />

      <CompleteGigModal
        isOpen={!!completingGig}
        onClose={() => setCompletingGig(null)}
        onConfirm={handleConfirmCompletion}
        gig={completingGig}
      />

      {/* DASHBOARD STATS SECTION - Only for clients and admins */}
      {user.role !== 'atumwa' && <DashboardStats user={user} gigs={gigs} />}

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {user.role === 'client' ? 'My Posted Gigs'
              : user.role === 'admin' ? 'Global Gigs Registry'
                : 'Available Deliveries'}
            {user.role === 'admin' && <Shield size={20} className="text-brand-600" />}
          </h1>
          <p className="text-slate-500 text-sm">
            {user.role === 'client' ? 'Manage your active requests and history.'
              : user.role === 'admin' ? 'View and manage all platform activity and requests.'
                : 'Find delivery opportunities and build your earnings.'}
          </p>
          {user.role === 'client' && (
            <p className="text-xs text-slate-400 mt-1">
              Step 1: Post a request • Step 2: Track it on the map • Step 3: Chat with your Atumwa.
            </p>
          )}
          {user.role === 'atumwa' && (
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={16} />
                <span>Serving: Harare CBD, Avondale, Borrowdale</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Briefcase size={16} />
                <span>Transport: Bicycle + Backpack</span>
              </div>
            </div>
          )}
        </div>
        {user.role === 'client' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2"
          >
            <span>+</span> Post a Request
          </button>
        )}
        {user.role === 'atumwa' && (
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('browse')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'browse' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Browse ({browseCount})
            </button>
            <button
              onClick={() => setViewMode('my_jobs')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'my_jobs' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              My Deliveries ({myJobsCount})
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
          >
            <Home className="text-slate-600" size={20} />
            <div>
              <div className="font-semibold text-slate-800">Home</div>
              <div className="text-xs text-slate-500">Dashboard</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
          >
            <MessageSquare className="text-green-600" size={20} />
            <div>
              <div className="font-semibold text-slate-800">Messages</div>
              <div className="text-xs text-slate-500">Chat</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
          >
            <MapPin className="text-blue-600" size={20} />
            <div>
              <div className="font-semibold text-slate-800">Map</div>
              <div className="text-xs text-slate-500">Track</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
          >
            <User className="text-purple-600" size={20} />
            <div>
              <div className="font-semibold text-slate-800">Profile</div>
              <div className="text-xs text-slate-500">Account</div>
            </div>
          </button>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="bg-slate-100 p-3 rounded-lg flex items-center gap-2 overflow-x-auto mb-2 no-scrollbar border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex-shrink-0">Filter Status:</span>
          {(['all', 'open', 'in-progress', 'completed', 'expired'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors flex-shrink-0 ${statusFilter === s
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Filter size={16} /> All
        </button>
        <button
          onClick={() => setFilter('prescription')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'prescription' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Pill size={16} /> Prescriptions
        </button>
        <button
          onClick={() => setFilter('paperwork')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'paperwork' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <FileText size={16} /> Paperwork
        </button>
        <button
          onClick={() => setFilter('shopping')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'shopping' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <ShoppingBag size={16} /> Shopping
        </button>
        <button
          onClick={() => setFilter('parcel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'parcel' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Package size={16} /> Parcels
        </button>
      </div>

      <div className="grid gap-4">
        {filteredGigs.map(gig => (
          <GigCard
            key={gig.id}
            gig={gig}
            isOwner={user.role === 'client' && gig.postedBy.id === user.id}
            isAdmin={user.role === 'admin'}
            onAction={handleGigAction}
            onViewMap={handleViewMap}
            userRole={user.role}
          />
        ))}
        {filteredGigs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <p className="text-slate-400">No gigs found in this section.</p>
            {user.role === 'client' && (
              <button onClick={() => setIsModalOpen(true)} className="mt-4 text-brand-600 font-bold hover:underline">
                Post your first gig
              </button>
            )}
            {user.role === 'atumwa' && viewMode === 'my_jobs' && (
              <button onClick={() => setViewMode('browse')} className="mt-4 text-brand-600 font-bold hover:underline">
                Browse available gigs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
