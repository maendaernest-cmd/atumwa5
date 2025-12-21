interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly VITE_MAP_DEFAULT_CENTER_LAT: string;
    readonly VITE_MAP_DEFAULT_CENTER_LNG: string;
    readonly VITE_MAP_DEFAULT_ZOOM: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_NOTIFICATIONS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export const env = {
    appName: import.meta.env.VITE_APP_NAME || 'Atumwa',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Smart Delivery Platform',
    map: {
        defaultCenter: {
            lat: parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT || '-17.8252'),
            lng: parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG || '31.0335'),
        },
        defaultZoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM || '13', 10),
    },
    features: {
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    },
} as const;
