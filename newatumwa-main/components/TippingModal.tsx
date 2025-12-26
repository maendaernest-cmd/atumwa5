import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gig } from '../types';
import { X, DollarSign, Loader2 } from 'lucide-react';

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tipAmount: number) => void;
  gig: Gig | null;
}

export const TippingModal: React.FC<TippingModalProps> = ({ isOpen, onClose, onSubmit, gig }) => {
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedTips = [2, 5, 10, 15]; // Example tip amounts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipAmount > 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(tipAmount);
        onClose();
        setTipAmount(0);
      } catch (error) {
        console.error('Failed to submit tip:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTipAmount(0);
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Add a Tip for {gig.assignedTo ? gig.assignedTo : 'Worker'}</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-600 mb-4 text-center">Show your appreciation for excellent service!</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Choose tip amount
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedTips.map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipAmount(tip)}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        tipAmount === tip ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      disabled={isSubmitting}
                    >
                      ${tip.toFixed(2)}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={tipAmount > 0 && !predefinedTips.includes(tipAmount) ? tipAmount : ''}
                    onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  No Thanks
                </button>
                <button
                  type="submit"
                  disabled={tipAmount <= 0 || isSubmitting}
                  className="flex-1 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding Tip...
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} />
                      Add Tip ${tipAmount.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
