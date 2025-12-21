import React, { useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_GIGS } from '../constants';
import { MapPin, Navigation, Wifi, Layers, Filter, Activity, Bike, Search, ChevronRight, Clock, Map as MapIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Premium Custom Icons with Industry standard styling
const createDivIcon = (emoji: string, color: string, label?: string) => L.divIcon({
    className: 'custom-map-icon',
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-${color}-500/20 rounded-full animate-ping"></div>
            <div class="relative w-10 h-10 bg-white border-2 border-${color}-500 rounded-2xl flex items-center justify-center shadow-lg text-xl transform transition-transform hover:scale-110">
                ${emoji}
                ${label ? `<span class="absolute -top-2 -right-2 bg-${color}-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">${label}</span>` : ''}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-${color}-500 rotate-45"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const fleetIcon = createDivIcon('🛵', 'green', 'Live');
const pickupIcon = createDivIcon('📍', 'brand');
const deliveryIcon = createDivIcon('🎁', 'blue');

// Simulation utility for "Street-Level" curved paths
const generateRealisticPath = (start: [number, number], end: [number, number]) => {
    const mid1: [number, number] = [start[0] + (end[0] - start[0]) * 0.4 + 0.002, start[1] + (end[1] - start[1]) * 0.3];
    const mid2: [number, number] = [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.6 + 0.002];
    return [start, mid1, mid2, end];
};

// Component to handle map view updates
const MapUpdater: React.FC<{ center: [number, number], zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom || map.getZoom());
    }, [center, zoom, map]);
    return null;
};

export const MapPage: React.FC = () => {
    const { user } = useAuth();
    const { gigs } = useData(); // Global Gigs
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';
    const [selectedGigId, setSelectedGigId] = React.useState<string>(location.state?.selectedGigId || (gigs.length > 0 ? (gigs.find(g => g.status === 'in-progress' && g.postedBy.id === user?.id)?.id || gigs[0].id) : ''));
    const [showTripHUD, setShowTripHUD] = React.useState(!!location.state?.selectedGigId);

    // BACKEND SIMULATION: User's live location (for messenger)
    const [userLoc, setUserLoc] = useState<[number, number]>([-17.835, 31.042]);

    // Sync state with navigation updates
    useEffect(() => {
        if (location.state?.selectedGigId) {
            setSelectedGigId(location.state.selectedGigId);
            setShowTripHUD(true);
        }
    }, [location.state]);

    const activeGig = gigs.find(g => g.id === selectedGigId) || gigs[0];

    // Harare center
    const HARARE_CENTER: [number, number] = [-17.8292, 31.0522];

    // BACKEND SIMULATION: Real-time Fleet Movement
    const [fleetPositions, setFleetPositions] = useState<Record<string, [number, number]>>({});

    useEffect(() => {
        // Initialize positions
        const initial: Record<string, [number, number]> = {};
        MOCK_USERS.forEach(u => {
            if (u.locationCoordinates) {
                initial[u.id] = [u.locationCoordinates.lat, u.locationCoordinates.lng];
            }
        });
        setFleetPositions(initial);

        // Move couriers slightly every 4 seconds
        const interval = setInterval(() => {
            setFleetPositions(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => {
                    const [lat, lng] = next[id];
                    // Very small random move (approx 5-10 meters)
                    next[id] = [
                        lat + (Math.random() * 0.0002 - 0.0001),
                        lng + (Math.random() * 0.0002 - 0.0001)
                    ];
                });
                return next;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const [layers, setLayers] = React.useState({
        openGigsOnly: false,
        traffic: false,
    });
    const [isLayerMenuOpen, setIsLayerMenuOpen] = React.useState(false);

    const visibleGigs = (layers.openGigsOnly
        ? gigs.filter(g => g.status === 'open')
        : gigs);

    // Get tasks relevant to current user
    const getRelevantTasks = () => {
        if (isAdmin) return visibleGigs;
        if (user?.role === 'atumwa') {
            return visibleGigs.filter(g => g.assignedTo === user.id || g.status === 'open');
        }
        // Clients see their posted tasks
        return visibleGigs.filter(g => g.postedBy.id === user?.id);
    };

    const relevantTasks = getRelevantTasks();

    // Determine map center based on active gig or user location
    const mapCenter = activeGig.coordinates
        ? [activeGig.coordinates.lat, activeGig.coordinates.lng] as [number, number]
        : HARARE_CENTER;

    // ETA Calculation Logic
    const calculateETA = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Approx km
        const time = Math.round(dist * 6); // Approx 6 mins per km in city
        return { dist: dist.toFixed(1), time: time + (time < 5 ? 2 : 5) };
    };

    const tripStats = activeGig?.coordinates && activeGig?.assignedTo ? calculateETA(userLoc[0], userLoc[1], activeGig.coordinates.lat, activeGig.coordinates.lng) : { dist: '2.4', time: '12' };

    return (
        <div className="bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner h-[calc(100vh-7rem)] md:h-[calc(100vh-3rem)] font-sans">

            <MapContainer
                center={HARARE_CENTER}
                zoom={14}
                style={{ height: '100%', width: '100%', background: '#f8fafc' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapUpdater center={mapCenter} />

                {/* Demand Heatspots & Geofences (Industry Standard) */}
                <Circle center={[-17.825, 31.045]} radius={1500} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1, dashArray: '10, 10' }} className="geofence-active" />
                <Circle center={[-17.840, 31.070]} radius={800} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.1, weight: 1 }} />

                {/* Admin Heatmap simulation (Demand clusters) */}
                {isAdmin && (
                    <>
                        <Circle center={[-17.815, 31.030]} radius={1200} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 0 }} />
                        <Circle center={[-17.850, 31.080]} radius={1000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 0 }} />
                    </>
                )}

                {/* Gig Markers (Pickup) */}
                {relevantTasks.map((gig) => (
                    gig.coordinates && (
                        <Marker
                            key={`gig-${gig.id}`}
                            position={[gig.coordinates.lat, gig.coordinates.lng]}
                            icon={pickupIcon}
                            eventHandlers={{
                                click: () => {
                                    setSelectedGigId(gig.id);
                                    setShowTripHUD(true);
                                },
                            }}
                        >
                            <Popup closeButton={false} className="premium-popup">
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="font-black text-slate-900 leading-tight uppercase text-xs tracking-wider">{gig.title}</div>
                                        <div className="text-brand-600 font-black text-sm">${gig.price.toFixed(2)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{gig.status}</div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/gigs')}
                                        className="w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}

                {/* User's Marker (The Atumwa) */}
                {user?.role === 'atumwa' && (
                    <Marker position={userLoc} icon={fleetIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {/* Delivery Location Markers */}
                {relevantTasks.map(gig => {
                    if (!gig.coordinates) return null;
                    const deliveryLat = gig.coordinates.lat + 0.01;
                    const deliveryLng = gig.coordinates.lng + 0.01;
                    const isSelected = gig.id === selectedGigId;
                    const isAssignedToMe = gig.assignedTo === user?.id;

                    if (!isSelected && !isAdmin && !isAssignedToMe) return null;

                    return (
                        <React.Fragment key={`delivery-group-${gig.id}`}>
                            {/* Destination Marker */}
                            <Marker
                                position={[deliveryLat, deliveryLng]}
                                icon={deliveryIcon}
                            >
                                <Popup>
                                    <div className="p-1 font-bold text-xs uppercase tracking-tight">🏁 Destination: {gig.locationEnd}</div>
                                </Popup>
                            </Marker>

                            {/* Trip Routing */}
                            {/* 1. Pickup -> Delivery (Primary Route) */}
                            <Polyline
                                positions={generateRealisticPath([gig.coordinates.lat, gig.coordinates.lng], [deliveryLat, deliveryLng])}
                                pathOptions={{
                                    color: isSelected ? '#3b82f6' : '#475569',
                                    weight: 6,
                                    lineJoin: 'round',
                                    opacity: isSelected ? 1 : 0.3
                                }}
                                className={isSelected ? 'ant-path' : ''}
                            />

                            {/* Geofence Alert Zone when selected */}
                            {isSelected && (
                                <Circle
                                    center={[deliveryLat, deliveryLng]}
                                    radius={300}
                                    pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1 }}
                                    className="geofence-active"
                                />
                            )}

                            {/* 2. Courier -> Pickup (Approach Route) */}
                            {isSelected && (isAssignedToMe || user?.role === 'client') && (
                                <Polyline
                                    positions={generateRealisticPath(userLoc, [gig.coordinates.lat, gig.coordinates.lng])}
                                    pathOptions={{
                                        color: '#818cf8',
                                        weight: 4,
                                        opacity: 0.8
                                    }}
                                    className="ant-path"
                                />
                            )}
                        </React.Fragment>
                    )
                })}

                {/* Fleet Markers (Clients see nearby couriers / Admins see all) */}
                {(isAdmin || user?.role === 'client') && MOCK_USERS.filter(u => u.role === 'atumwa').map(courier => {
                    const pos = fleetPositions[courier.id] || (courier.locationCoordinates ? [courier.locationCoordinates.lat, courier.locationCoordinates.lng] : null);
                    if (!pos) return null;

                    // Don't show assigned courier twice if they have a special marker
                    if (activeGig?.assignedTo === courier.id && user?.role === 'client') return null;

                    return (
                        <Marker
                            key={courier.id}
                            position={pos as [number, number]}
                            icon={fleetIcon}
                        >
                            <Popup>
                                <div className="p-2 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        <span className="font-bold text-slate-800">{courier.name}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black">Online • Nearby</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

            </MapContainer>

            {/* Live Indicator */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-slate-200 pointer-events-auto">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    {isAdmin ? 'SYSTEM LIVE' : 'LIVE'} <Wifi size={12} className="text-slate-400" />
                </span>
            </div>

            {/* Messenger-Specific Context */}
            {!isAdmin && activeGig && (
                <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-slate-200 max-w-xs pointer-events-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Delivery Mode
                        </p>
                    </div>

                    <p className="text-sm text-slate-800 font-medium mb-1">{activeGig.title}</p>
                    <div className="space-y-1 text-xs text-slate-600">
                        <p>📍 {activeGig.distance} away</p>
                        <p>💰 ${activeGig.price.toFixed(2)} • {activeGig.paymentMethod}</p>
                    </div>
                </div>
            )}

            {/* Admin Overlay: Live Stats */}
            {isAdmin && (
                <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 w-48 pointer-events-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Operations</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Bike size={14} className="text-brand-600" /> Active Fleet
                            </div>
                            <span className="font-bold text-slate-900">
                                {MOCK_USERS.filter(u => u.role === 'atumwa').length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Layers size={14} className="text-brand-600" /> Active Gigs
                            </div>
                            <span className="font-bold text-slate-900">{MOCK_GIGS.length}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Google-Maps Style Search & Filter Bar */}
            <div className="absolute top-4 left-4 right-16 md:right-auto md:w-[400px] z-[400] pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 pointer-events-auto p-1 overflow-hidden transition-all duration-300 hover:ring-2 ring-brand-500/20">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Search className="text-slate-400 shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Search places, errands or couriers..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder-slate-400"
                        />
                        <div className="h-6 w-px bg-slate-200 mx-1" />
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                            <MapIcon size={18} />
                        </button>
                    </div>
                    {/* Quick Suggestions (Trending) */}
                    <div className="flex gap-2 px-4 pb-3 overflow-x-auto custom-scrollbar">
                        {['Pharmacies', 'Supermarkets', 'Hardware', 'Lunch'].map(cat => (
                            <span key={cat} className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-brand-50 hover:text-brand-600 cursor-pointer transition-colors">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trip HUD (The "Uber" Experience for Clients & Messengers) */}
            {activeGig && showTripHUD && (
                <div className="absolute bottom-24 md:bottom-32 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[400] animate-in slide-in-from-bottom duration-500 pointer-events-none">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-2xl border border-white/10 pointer-events-auto relative overflow-hidden group">
                        <button
                            onClick={() => setShowTripHUD(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-[10]"
                        >
                            <X size={18} />
                        </button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-500/20 transition-all" />

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estimated Arrival</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tabular-nums">{tripStats.time}</span>
                                    <span className="text-sm font-bold text-brand-400">mins</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Distance</p>
                                <p className="text-lg font-black tabular-nums">{tripStats.dist} <span className="text-xs text-slate-400">km</span></p>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-black text-lg">
                                    {user?.role === 'atumwa' ? '👤' : '🛵'}
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">{user?.role === 'atumwa' ? 'Client' : 'Atumwa'}</p>
                                    <p className="text-sm text-slate-400 font-medium">{user?.role === 'atumwa' ? activeGig.postedBy.name : (MOCK_USERS.find(u => u.id === activeGig.assignedTo)?.name || 'Searching...')}</p>
                                </div>
                            </div>
                            {user?.role === 'client' && (
                                <button className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                                    <Activity size={16} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_#3b82f6]"></div>
                                <p className="text-[11px] font-bold text-slate-300 truncate">{activeGig.locationStart}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-px h-4 bg-slate-700 ml-1"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full border-2 border-slate-500"></div>
                                <p className="text-[11px] font-bold text-slate-300 truncate">{activeGig.locationEnd}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Operations HUD (Industry Trend: Side Overlay Telemetry) */}
            <div className="absolute top-24 right-4 z-[400] w-64 space-y-3 pointer-events-none hidden lg:block">
                <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform Telemetry</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400 font-medium">Avg. Response</span>
                            <span className="text-lg font-black text-white">4m 12s</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400 font-medium">Network Load</span>
                            <span className="text-lg font-black text-brand-400">Optimal</span>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 w-3/4 animate-pulse"></div>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest text-center">Live Transaction Volume</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
