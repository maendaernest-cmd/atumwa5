import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export interface GigFilterOptions {
    searchQuery: string;
    priceRange: [number, number];
    maxDistance: number;
    urgency: string[];
    categories: string[];
    status: string[];
}

interface GigFiltersProps {
    filters: GigFilterOptions;
    onFilterChange: (filters: GigFilterOptions) => void;
    onReset: () => void;
}

export const GigFilters: React.FC<GigFiltersProps> = ({ filters, onFilterChange, onReset }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.searchQuery);
    const debouncedSearch = useDebounce(localSearch, 300);

    React.useEffect(() => {
        if (debouncedSearch !== filters.searchQuery) {
            onFilterChange({ ...filters, searchQuery: debouncedSearch });
        }
    }, [debouncedSearch]);

    const handlePriceChange = (index: 0 | 1, value: number) => {
        const newRange: [number, number] = [...filters.priceRange] as [number, number];
        newRange[index] = value;
        onFilterChange({ ...filters, priceRange: newRange });
    };

    const toggleUrgency = (urgency: string) => {
        const newUrgency = filters.urgency.includes(urgency)
            ? filters.urgency.filter(u => u !== urgency)
            : [...filters.urgency, urgency];
        onFilterChange({ ...filters, urgency: newUrgency });
    };

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ ...filters, categories: newCategories });
    };

    const activeFilterCount =
        (filters.urgency.length > 0 ? 1 : 0) +
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
        (filters.maxDistance < 50 ? 1 : 0);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search gigs by title, location, or description..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
                />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <SlidersHorizontal size={18} />
                    <span className="font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {activeFilterCount > 0 && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    >
                        <X size={16} />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6">
                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            Price Range
                        </label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                    placeholder="Min"
                                />
                                <span className="text-slate-500 dark:text-slate-400">to</span>
                                <input
                                    type="number"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                    placeholder="Max"
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={filters.priceRange[1]}
                                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Distance */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            Max Distance: {filters.maxDistance}km
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={filters.maxDistance}
                            onChange={(e) => onFilterChange({ ...filters, maxDistance: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    {/* Urgency */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            Urgency
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['standard', 'express', 'priority'].map((urgency) => (
                                <button
                                    key={urgency}
                                    onClick={() => toggleUrgency(urgency)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.urgency.includes(urgency)
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Pharmacy', 'Groceries', 'Parcel', 'Food', 'Documents', 'Other'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.categories.includes(category)
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const useGigFilters = () => {
    const [filters, setFilters] = useState<GigFilterOptions>({
        searchQuery: '',
        priceRange: [0, 1000],
        maxDistance: 50,
        urgency: [],
        categories: [],
        status: [],
    });

    const resetFilters = () => {
        setFilters({
            searchQuery: '',
            priceRange: [0, 1000],
            maxDistance: 50,
            urgency: [],
            categories: [],
            status: [],
        });
    };

    return { filters, setFilters, resetFilters };
};
