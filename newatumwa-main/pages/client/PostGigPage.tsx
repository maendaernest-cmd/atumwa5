import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import {
  ArrowLeftIcon,
  RocketLaunchIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  PhotoIcon,
  MicrophoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Mic, Calculator, Sparkles, AlertCircle, Upload, Camera, FileText, ShoppingCart, Heart, Briefcase, Wrench, Package, Star, Shield, Cloud } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Gig, GigType } from '../../types';

export default function PostGigPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { addGig } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [availableMessengers, setAvailableMessengers] = useState(5);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Grocery',
    pickupLocation: '',
    dropoffLocation: '',
    budget: '',
    currency: 'USD',
    deadline: '',
    description: '',
    urgency: 'standard' as 'standard' | 'express' | 'fast',
    tip: 0,
    insurance: false,
    recurring: false,
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'home', name: 'Home', address: '123 Main Street, Harare' },
    { id: 'work', name: 'Work', address: '456 Business Ave, Harare' },
    { id: 'gym', name: 'Gym', address: '789 Fitness Blvd, Harare' }
  ]);
  const [selectedMessenger, setSelectedMessenger] = useState<any>(null);
  const [showMessengerPreview, setShowMessengerPreview] = useState(false);
  const [surgePricing, setSurgePricing] = useState(1.2);
  const [weatherImpact, setWeatherImpact] = useState('rain');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState<'pickup' | 'dropoff' | null>(null);
  const [mapSelectedLocation, setMapSelectedLocation] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, title: 'Task Essentials', description: 'What needs to be done?' },
    { id: 2, title: 'Collection Point', description: 'Where to pick up from?' },
    { id: 3, title: 'Final Destination', description: 'Where to deliver to?' },
    { id: 4, title: 'Select Urgency', description: 'How fast do you need it?' },
    { id: 5, title: 'Settlement Details', description: 'Review and confirm' },
  ];

  const urgencyOptions = [
    { id: 'standard', label: 'Standard', time: '~45 min', price: 1, description: 'Regular delivery time' },
    { id: 'express', label: 'Express', time: '~25 min', price: 1.5, description: 'Faster delivery' },
    { id: 'fast', label: 'Fast', time: '~15 min', price: 2, description: 'Priority delivery' },
  ];

  const categories = [
    'Grocery',
    'Pharmacy',
    'Parcel',
    'Liquor',
    'Other'
  ];

  // Template system for common errands
  const errandTemplates = [
    {
      id: 'grocery',
      title: 'Weekly Grocery Shopping',
      category: 'Grocery',
      description: 'Pick up groceries from local supermarket and deliver to my home',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      id: 'pharmacy',
      title: 'Prescription Pickup',
      category: 'Pharmacy',
      description: 'Collect prescription from pharmacy and deliver urgently',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      id: 'parcel',
      title: 'Document Delivery',
      category: 'Parcel',
      description: 'Pick up important documents and deliver securely',
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      id: 'repairs',
      title: 'Device Repair',
      category: 'Other',
      description: 'Take device to repair shop and pick up when ready',
      icon: Wrench,
      color: 'bg-orange-500'
    }
  ];

  // Mock location suggestions
  const locationSuggestions = [
    'Shoprite Borrowdale',
    'OK Mart Highlands',
    'TM Pick n Pay',
    'Spar Greendale',
    'Checkers Westgate',
    '143 Kwame Nkrumah Avenue',
    '4th Street, CBD',
    'Samora Machel Avenue',
    'Borrowdale Brooke',
    'Greendale Shopping Centre'
  ];

  // Voice command handler
  const handleVoiceCommand = () => {
    setIsListening(true);
    // Mock voice recognition - in real app, use Web Speech API
    setTimeout(() => {
      setVoiceText('I need groceries delivered from Shoprite to my home');
      setIsListening(false);
      // Auto-fill form based on voice command
      setFormData({
        ...formData,
        title: 'Grocery Delivery',
        category: 'Grocery',
        pickupLocation: 'Shoprite',
        description: 'Grocery delivery from Shoprite to my home'
      });
    }, 3000);
  };

  // Real-time price calculation
  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation) {
      // Mock distance calculation - in real app, use Google Maps API
      const mockDistance = Math.random() * 10 + 2; // 2-12 km
      setEstimatedDistance(mockDistance);

      // Calculate price based on distance and category
      let basePrice = 2;
      if (mockDistance <= 3) basePrice = 2;
      else if (mockDistance <= 5) basePrice = 3;
      else if (mockDistance <= 7) basePrice = 4;
      else if (mockDistance <= 9) basePrice = 5;
      else if (mockDistance <= 12) basePrice = 6;
      else basePrice = 6 + (mockDistance - 12) * 0.5;

      // Category multipliers
      const categoryMultipliers = {
        'Grocery': 1,
        'Pharmacy': 1.2,
        'Parcel': 1.5,
        'Liquor': 1.3,
        'Other': 1.1
      };

      const finalPrice = basePrice * categoryMultipliers[formData.category as keyof typeof categoryMultipliers];
      setCalculatedPrice(finalPrice);
    }
  }, [formData.pickupLocation, formData.dropoffLocation, formData.category]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.pickupLocation.trim()) errors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) errors.dropoffLocation = 'Drop-off location is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.deadline) errors.deadline = 'Deadline is required';

    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) errors.deadline = 'Deadline must be in the future';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Validation Error', 'Please fix the errors in the form.', 'error');
      return;
    }

    if (!user) {
      addToast('Error', 'You must be logged in to post a gig.', 'error');
      return;
    }

    setLoading(true);

    let gigType: GigType;
    switch (formData.category) {
      case 'Grocery':
        gigType = 'shopping';
        break;
      case 'Pharmacy':
        gigType = 'prescription';
        break;
      case 'Parcel':
        gigType = 'parcel';
        break;
      default:
        gigType = 'shopping';
    }

    const newGig: Gig = {
        id: `gig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title,
        description: formData.description,
        type: gigType,
        price: calculatedPrice || 3, // Use calculated price or fallback
        paymentMethod: formData.currency === 'USD' ? 'cash_usd' : 'zig',
        urgency: 'standard',
        status: 'open',
        locationStart: formData.pickupLocation,
        locationEnd: formData.dropoffLocation,
        stops: [],
        checklist: [],
        postedBy: user,
        postedAt: new Date().toISOString(),
        distance: `${estimatedDistance.toFixed(1)} km`,
    };

    try {
        await addGig(newGig);
        addToast('Errand Posted', 'Your request is live and messengers are being notified.', 'success');
        navigate('/dashboard/client/gigs');
    } catch (error) {
        addToast('Error Posting Gig', 'There was a problem posting your errand. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardShell role="client">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceCommand}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice Input'}
            </button>

            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setFormData({...formData, currency: 'USD'})}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${formData.currency === 'USD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                USD
              </button>
              <button
                onClick={() => setFormData({...formData, currency: 'ZiG'})}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${formData.currency === 'ZiG' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                ZiG
              </button>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display italic mb-2">
                Quick Start Templates
              </h2>
              <p className="text-slate-500 font-medium">Choose from common errand types to get started faster</p>
            </div>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              {showTemplates ? 'Hide' : 'Show'} Templates
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {errandTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      title: template.title,
                      category: template.category,
                      description: template.description
                    });
                    setShowTemplates(false);
                  }}
                  className="group p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all text-left"
                >
                  <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <template.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">{template.title}</h3>
                  <p className="text-slate-500 text-xs leading-tight">{template.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Cost Calculator */}
        {formData.pickupLocation && formData.dropoffLocation && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-[2.5rem] border border-blue-100 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Live Cost Estimate</h3>
                  <p className="text-slate-600 font-medium">Distance: {estimatedDistance.toFixed(1)} km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900">${calculatedPrice.toFixed(2)}</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{formData.currency}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">Real-time pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">Distance-based</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">Category adjusted</span>
              </div>
            </div>
          </div>
        )}

        {/* Step Wizard */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          {/* Step Progress Indicator */}
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {currentStep > step.id ? <CheckCircleIcon className="h-4 w-4" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-brand-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">{steps[currentStep - 1].title}</span>
              <span className="text-slate-500">Step {currentStep} of {steps.length}</span>
            </div>
            <p className="text-slate-600 text-sm mt-1">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step Content */}
          <div className="p-12 min-h-[400px]">
            {/* Step 1: Task Essentials */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Briefly, what needs doing?</h2>
                  <p className="text-slate-500">Any specific items or special instructions for the Atumwa?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Errand Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Pick up groceries"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Special Instructions</label>
                  <textarea
                    rows={4}
                    placeholder="Any special requirements or instructions..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Collection Point */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Collection Point</h2>
                  <p className="text-slate-500">Enter store name or address</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Pickup Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Shoprite Borrowdale"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      value={formData.pickupLocation}
                      onChange={(e) => {
                        handleInputChange('pickupLocation', e.target.value);
                        const filtered = locationSuggestions.filter(loc =>
                          loc.toLowerCase().includes(e.target.value.toLowerCase())
                        ).slice(0, 3);
                        setPickupSuggestions(filtered);
                      }}
                    />
                    {pickupSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 mt-1">
                        {pickupSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleInputChange('pickupLocation', suggestion);
                              setPickupSuggestions([]);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3"
                          >
                            <MapPinIcon className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-sm">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Final Destination */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Final Destination</h2>
                  <p className="text-slate-500">Where are we delivering to?</p>
                </div>

                {/* Saved Addresses */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Quick Select</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => setFormData({...formData, dropoffLocation: address.address})}
                        className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <MapPinIcon className="h-5 w-5 text-slate-400" />
                          <span className="font-bold text-slate-900">{address.name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{address.address}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Or Enter Address Manually</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <textarea
                      rows={3}
                      placeholder="Enter your full address..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                      value={formData.dropoffLocation}
                      onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                    />
                  </div>
                  {formData.dropoffLocation && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Address confirmed</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Select Urgency & Speed */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Select Urgency & Speed</h2>
                  <p className="text-slate-500">How fast do you need this delivery?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({...formData, urgency: option.id as any})}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        formData.urgency === option.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-black text-slate-900">{option.label}</span>
                        <span className="text-sm font-bold text-slate-500">{option.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{option.description}</p>
                      <div className="text-xl font-black text-slate-900">
                        ${(calculatedPrice * option.price).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Settlement Details */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Settlement Details</h2>
                  <p className="text-slate-500">Review and confirm your order</p>
                </div>

                {/* Messenger Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Your Messenger</h3>
                  <div className="flex items-center gap-4">
                    <img src="/atumwa-logo.jpeg" alt="Messenger" className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">John M.</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>4.9 rating</span>
                        <span>•</span>
                        <span>127 deliveries</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Online now
                      </div>
                      <p className="text-xs text-slate-500">2.3 km away</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span>🚗 Has vehicle</span>
                    <span>📱 Verified ID</span>
                    <span>⭐ 4.9 rating</span>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Add Protection & Support</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.insurance ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.insurance}
                        onChange={(e) => setFormData({...formData, insurance: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Insurance Coverage</p>
                        <p className="text-sm text-slate-600">$2 • Up to $500 protection</p>
                      </div>
                      <Shield className="h-5 w-5 text-blue-500" />
                    </label>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Tip After Delivery</label>
                      <select
                        value={formData.tip}
                        onChange={(e) => setFormData({...formData, tip: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      >
                        <option value={0}>No tip planned</option>
                        <option value={1}>$1 • Thank you</option>
                        <option value={2}>$2 • Great service</option>
                        <option value={3}>$3 • Amazing!</option>
                        <option value={5}>$5 • Outstanding</option>
                      </select>
                      <p className="text-xs text-slate-500">Tip is paid directly to messenger after successful delivery</p>
                    </div>
                  </div>

                  {weatherImpact === 'rain' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Cloud className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-bold text-yellow-900">Weather Alert</p>
                          <p className="text-sm text-yellow-700">Rain expected • Consider adding $1 weather protection</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Price Breakdown</h3>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Base Fee</span>
                    <span className="font-bold text-slate-900">$2.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Distance ({estimatedDistance.toFixed(1)} km)</span>
                    <span className="font-bold text-slate-900">${(estimatedDistance * 0.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Urgency ({urgencyOptions.find(o => o.id === formData.urgency)?.label})</span>
                    <span className="font-bold text-slate-900">
                      {urgencyOptions.find(o => o.id === formData.urgency)?.price}x
                    </span>
                  </div>

                  {surgePricing > 1 && (
                    <div className="flex justify-between items-center text-orange-600">
                      <span className="font-medium">Demand Surge</span>
                      <span className="font-bold">{surgePricing.toFixed(1)}x</span>
                    </div>
                  )}

                  {formData.insurance && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">Insurance</span>
                      <span className="font-bold text-slate-900">$2.00</span>
                    </div>
                  )}

                  {formData.tip > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">Tip</span>
                      <span className="font-bold text-slate-900">${formData.tip}.00</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                    <span className="text-lg font-black text-slate-900">Total</span>
                    <span className="text-2xl font-black text-slate-900">
                      ${(calculatedPrice + (formData.insurance ? 2 : 0) + formData.tip).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Analytics & Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-black text-green-600 mb-1">15%</div>
                    <p className="text-sm text-green-700">Cheaper than traditional delivery</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-2xl font-black text-blue-600 mb-1">2hrs</div>
                    <p className="text-sm text-blue-700">Time saved vs going yourself</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-black text-purple-600 mb-1">80%</div>
                    <p className="text-sm text-purple-700">Lower carbon footprint</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-bold text-green-900">Secure escrow payment • Instant messenger matching</p>
                      <p className="text-sm text-green-700">GPS tracking • Real-time updates • 24/7 support</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Back
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.description)) ||
                    (currentStep === 2 && !formData.pickupLocation) ||
                    (currentStep === 3 && !formData.dropoffLocation) ||
                    (currentStep === 4 && !formData.urgency)
                  }
                  className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span>{loading ? 'Processing...' : 'Launch Request'}</span>
                  {!loading && <RocketLaunchIcon className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
