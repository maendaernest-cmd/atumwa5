import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Gig, GigType, PaymentMethod } from '../types';
import { X, Loader2 } from 'lucide-react';

interface EditGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: Partial<Gig>) => void;
  gig: Gig | null;
}

const editGigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['prescription', 'paperwork', 'parcel', 'shopping']),
  price: z.number().min(1, 'Price must be at least $1'),
  locationStart: z.string().min(1, 'Pickup location is required'),
  locationEnd: z.string().min(1, 'Drop-off location is required'),
  paymentMethod: z.enum(['ecocash', 'cash_usd', 'zig'])
});

export const EditGigModal: React.FC<EditGigModalProps> = ({ isOpen, onClose, onSubmit, gig }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'shopping' as GigType,
    price: '',
    locationStart: '',
    locationEnd: '',
    paymentMethod: 'cash_usd' as PaymentMethod
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gig && isOpen) {
      setFormData({
        title: gig.title,
        description: gig.description,
        type: gig.type,
        price: gig.price.toString(),
        locationStart: gig.locationStart,
        locationEnd: gig.locationEnd,
        paymentMethod: gig.paymentMethod
      });
      setErrors({});
    }
  }, [gig, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationData = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };

    const result = editGigSchema.safeParse(validationData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validationData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to update gig. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !gig) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.title ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Brief task description"
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Detailed instructions for the messenger"
                  aria-describedby={errors.description ? "description-error" : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['prescription', 'paperwork', 'shopping', 'parcel'] as GigType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('type', type)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.type === type
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    value={formData.locationStart}
                    onChange={(e) => handleInputChange('locationStart', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.locationStart ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Store or pickup address"
                    aria-describedby={errors.locationStart ? "locationStart-error" : undefined}
                  />
                  {errors.locationStart && (
                    <p id="locationStart-error" className="text-red-500 text-xs mt-1">{errors.locationStart}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Drop-off Location *
                  </label>
                  <input
                    type="text"
                    value={formData.locationEnd}
                    onChange={(e) => handleInputChange('locationEnd', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.locationEnd ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Delivery destination"
                    aria-describedby={errors.locationEnd ? "locationEnd-error" : undefined}
                  />
                  {errors.locationEnd && (
                    <p id="locationEnd-error" className="text-red-500 text-xs mt-1">{errors.locationEnd}</p>
                  )}
                </div>
              </div>

              {/* Price and Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        errors.price ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="0.00"
                      aria-describedby={errors.price ? "price-error" : undefined}
                    />
                  </div>
                  {errors.price && (
                    <p id="price-error" className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="cash_usd">Cash USD</option>
                    <option value="ecocash">EcoCash</option>
                    <option value="zig">ZiG</option>
                  </select>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};