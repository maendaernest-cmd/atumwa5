import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
}) => {
    const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

export const GigCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <Skeleton width="60%" height={20} className="mb-2" />
                    <Skeleton width="40%" height={16} />
                </div>
                <Skeleton width={60} height={24} className="rounded-full" />
            </div>

            <div className="space-y-2 mb-4">
                <Skeleton width="100%" height={16} />
                <Skeleton width="100%" height={16} />
                <Skeleton width="80%" height={16} />
            </div>

            <div className="flex gap-2">
                <Skeleton width="100%" height={40} />
                <Skeleton width={40} height={40} />
            </div>
        </div>
    );
};

export const DashboardStatSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                    <Skeleton width="60%" height={24} className="mb-2" />
                    <Skeleton width="40%" height={14} />
                </div>
            </div>
        </div>
    );
};
