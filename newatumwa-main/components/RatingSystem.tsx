import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: number;
    showValue?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
    value,
    onChange,
    readonly = false,
    size = 20,
    showValue = false,
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const handleClick = (rating: number) => {
        if (!readonly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => {
                    const isFilled = (hoverValue ?? value) >= rating;
                    return (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => handleClick(rating)}
                            onMouseEnter={() => !readonly && setHoverValue(rating)}
                            onMouseLeave={() => !readonly && setHoverValue(null)}
                            disabled={readonly}
                            className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                        >
                            <Star
                                size={size}
                                className={isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                            />
                        </button>
                    );
                })}
            </div>
            {showValue && (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
};

interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
}

interface ReviewListProps {
    reviews: Review[];
    onMarkHelpful?: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onMarkHelpful }) => {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No reviews yet. Be the first to leave a review!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-start gap-3 mb-3">
                        <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {review.userName}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <Rating value={review.rating} readonly size={16} />
                        </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">{review.comment}</p>
                    {onMarkHelpful && (
                        <button
                            onClick={() => onMarkHelpful(review.id)}
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        >
                            Helpful ({review.helpful})
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => void;
    onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0 && comment.trim()) {
            onSubmit(rating, comment);
            setRating(0);
            setComment('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Your Rating
                </label>
                <Rating value={rating} onChange={setRating} size={32} />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
            </div>
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={rating === 0 || !comment.trim()}
                    className="flex-1 px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Submit Review
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
