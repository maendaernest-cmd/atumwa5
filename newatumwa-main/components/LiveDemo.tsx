import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, MapPin, Truck, Smartphone, Star } from 'lucide-react';

interface DemoStep {
  icon: string;
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  {
    icon: '📱',
    title: 'Post a Gig',
    description: 'Create delivery request in 30 seconds with smart suggestions',
    duration: 4000
  },
  {
    icon: '🚴',
    title: 'Messenger Accepts',
    description: 'Verified messengers compete for your job with instant notifications',
    duration: 3500
  },
  {
    icon: '📍',
    title: 'Real-time Tracking',
    description: 'Watch delivery progress live on interactive map with ETA updates',
    duration: 4500
  },
  {
    icon: '✅',
    title: 'Secure Delivery',
    description: 'Safe handover with digital confirmation and rating system',
    duration: 3000
  }
];

export const LiveDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const step = demoSteps[currentStep];
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next step
          setCurrentStep(current => (current + 1) % demoSteps.length);
          return 0;
        }
        return prev + (100 / (step.duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, isPlaying]);

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">See Atumwa in Action</h3>
            <p className="text-brand-100">Experience our delivery platform live</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={resetDemo}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Steps */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                  index === currentStep
                    ? 'bg-brand-50 border-2 border-brand-200 shadow-lg'
                    : index < currentStep
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-stone-50 border border-stone-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  index === currentStep
                    ? 'bg-brand-100 text-brand-600 animate-pulse'
                    : index < currentStep
                    ? 'bg-green-100 text-green-600'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {index < currentStep ? <CheckCircle size={24} /> : step.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg ${index === currentStep ? 'text-brand-900' : 'text-stone-900'}`}>
                    {step.title}
                  </h4>
                  <p className="text-stone-600 mt-1">{step.description}</p>
                  {index === currentStep && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping"></div>
                      <span className="text-sm font-medium text-brand-700">In Progress...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Interactive Preview */}
          <div className="relative">
            <div className="bg-stone-100 rounded-2xl p-6 h-80 flex items-center justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 bg-brand-500 rounded-lg rotate-12"></div>
                <div className="absolute bottom-4 right-4 w-20 h-20 bg-purple-500 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500 rounded-xl rotate-45"></div>
              </div>

              {/* Dynamic Content Based on Step */}
              <div className="relative z-10 text-center">
                {currentStep === 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <Smartphone size={64} className="mx-auto mb-4 text-brand-600" />
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Mobile App Interface</h4>
                    <p className="text-stone-600">Intuitive design for quick gig posting</p>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="animate-in fade-in zoom-in">
                    <div className="flex -space-x-2 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">J</div>
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                    </div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Messenger Network</h4>
                    <p className="text-stone-600">Active messengers ready to deliver</p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-left-4">
                    <MapPin size={64} className="mx-auto mb-4 text-purple-600" />
                    <div className="bg-white rounded-lg p-3 shadow-lg mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-stone-900">ETA: 12 min</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">GPS Tracking</h4>
                    <p className="text-stone-600">Real-time location updates</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-1 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={24} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Delivery Complete</h4>
                    <p className="text-stone-600">Secure verification and rating</p>
                  </div>
                )}
              </div>
            </div>

            {/* Demo Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">2,547</div>
                <div className="text-sm text-stone-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-stone-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-stone-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
