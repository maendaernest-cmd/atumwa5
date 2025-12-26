import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Truck, CheckCircle, MessageSquare, Phone, Navigation } from 'lucide-react';
import { Gig } from '../types';

interface OrderTrackingModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  gig,
  isOpen,
  onClose,
  onOpenChat
}) => {
  const [currentStep, setCurrentStep] = useState<'pickup' | 'transit' | 'delivery'>('pickup');
  const [eta, setEta] = useState(15);

  // Simulate ETA countdown
  useEffect(() => {
    if (eta > 0) {
      const timer = setInterval(() => {
        setEta(prev => prev - 1);
      }, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [eta]);

  // Determine current step based on gig status
  useEffect(() => {
    if (gig.status === 'in-progress') {
      setCurrentStep('transit');
    } else if (gig.status === 'completed') {
      setCurrentStep('delivery');
    } else {
      setCurrentStep('pickup');
    }
  }, [gig.status]);

  const steps = [
    {
      id: 'pickup',
      title: 'Pickup',
      description: 'Messenger arriving at pickup location',
      icon: MapPin,
      time: '~5 min'
    },
    {
      id: 'transit',
      title: 'In Transit',
      description: 'Package is on the way to you',
      icon: Truck,
      time: `${eta} min`
    },
    {
      id: 'delivery',
      title: 'Delivered',
      description: 'Package has been delivered successfully',
      icon: CheckCircle,
      time: 'Complete'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Order #{gig.id.slice(-6).toUpperCase()}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Order Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-900">{gig.title}</p>
                <p className="text-sm text-blue-700">Estimated delivery: {eta} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock size={14} />
              <span>Track in real-time</span>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-6">Delivery Progress</h3>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = step.id === 'pickup' && currentStep !== 'pickup' ||
                                step.id === 'transit' && currentStep === 'delivery' ||
                                step.id === 'delivery' && currentStep === 'delivery';
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white animate-pulse' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={16} />
                    ) : (
                      <step.icon size={16} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                        {step.title}
                      </h4>
                      <span className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.time}
                      </span>
                    </div>
                    <p className={`text-sm ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenChat}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={18} />
              <span>Message</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
              <Phone size={18} />
              <span>Call</span>
            </button>
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            <Navigation size={18} />
            <span>View on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
