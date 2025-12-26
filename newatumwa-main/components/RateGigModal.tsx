import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gig } from '../types';
import { X, Star, Loader2 } from 'lucide-react';

interface RateGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  gig: Gig | null;
}

export const RateGigModal: React.FC<RateGigModalProps> = ({ isOpen, onClose, onSubmit, gig }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(rating, comment);
        onClose();
        setRating(0);
        setComment('');
      } catch (error) {
        console.error('Failed to submit rating:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setRating(0);
      setHoveredRating(0);
      setComment('');
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
            <h2 className="text-xl font-bold text-slate-900">Rate Your Experience</h2>
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
            <div className="text-center mb-6">
              <p className="text-slate-600 mb-4">How was your experience with this delivery?</p>

              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={isSubmitting}
                    className={`text-3xl mx-1 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-slate-300'
                    } disabled:opacity-50`}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-sm text-slate-500">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Share your feedback <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none disabled:opacity-50"
                  aria-describedby="comment-help"
                />
                <p id="comment-help" className="text-xs text-slate-500 mt-1">
                  Your feedback helps us improve our service
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 py-2.5 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star size={16} />
                      Submit Rating
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