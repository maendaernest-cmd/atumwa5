/**
 * Haptic feedback utilities for mobile devices
 */

export const haptics = {
    /**
     * Light haptic feedback for subtle interactions
     */
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    /**
     * Medium haptic feedback for standard interactions
     */
    medium: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    },

    /**
     * Heavy haptic feedback for important actions
     */
    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    },

    /**
     * Success pattern
     */
    success: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([10, 50, 10]);
        }
    },

    /**
     * Error pattern
     */
    error: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([20, 100, 20, 100, 20]);
        }
    },

    /**
     * Warning pattern
     */
    warning: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([15, 75, 15]);
        }
    },
};

/**
 * Hook for adding haptic feedback to click handlers
 */
export const useHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    return () => haptics[intensity]();
};
