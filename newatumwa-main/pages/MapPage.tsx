import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { MapPin, Navigation, Wifi, Layers, Filter, Activity, Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Use Hue-rotated default icons or similar simple solution to avoid external blocking
// We will use CSS classes or just standard icons for now to ensure functionality first.
// A robust way without external assets is to rely on the default icon we just imported.
// If valid local assets existed we would use them. For now, let's use the default icon 
// but we can differentiate via Popup content or by implementing a custom DivIcon if needed later.
const fleetIcon = DefaultIcon;
const deliveryIcon = DefaultIcon;

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

    const [selectedGigId, setSelectedGigId] = React.useState<string>(location.state?.selectedGigId || (gigs.length > 0 ? gigs[0].id : ''));

    // Sync state with navigation updates
    useEffect(() => {
        if (location.state?.selectedGigId) {
            setSelectedGigId(location.state.selectedGigId);
        }
    }, [location.state]);

    const activeGig = gigs.find(g => g.id === selectedGigId) || gigs[0];

    // Harare center
    const HARARE_CENTER: [number, number] = [-17.8292, 31.0522];

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

    return (
        <div className="bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner h-[calc(100vh-7rem)] md:h-[calc(100vh-3rem)]">

            <MapContainer
                center={HARARE_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false} // Custom zoom control needed if we want to match previous UI, or just use default
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={mapCenter} />

                {/* Gig Markers (Pickup) */}
                {relevantTasks.map((gig) => (
                    gig.coordinates && (
                        <Marker
                            key={`gig-${gig.id}`}
                            position={[gig.coordinates.lat, gig.coordinates.lng]}
                            eventHandlers={{
                                click: () => setSelectedGigId(gig.id),
                            }}
                        >
                            <Popup>
                                <div className="p-1">
                                    <div className="font-bold text-slate-800">{gig.title}</div>
                                    <div className="text-brand-600 font-bold">${gig.price.toFixed(2)}</div>
                                    <div className="text-slate-500">{gig.status}</div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}

                {/* Delivery Location Markers (Mocked slightly offset for demo if not real) */}
                {/* For real app, we would have explicit delivery lat/lng. Using offsets for demo. */}
                {relevantTasks.map(gig => {
                    if (!gig.coordinates) return null;
                    // Mock delivery location - shift slightly for visual route
                    const deliveryLat = gig.coordinates.lat + 0.01;
                    const deliveryLng = gig.coordinates.lng + 0.01;
                    const isSelected = gig.id === selectedGigId;

                    if (!isSelected && !isAdmin) return null; // Only show delivery for selected or if admin

                    return (
                        <React.Fragment key={`delivery-group-${gig.id}`}>
                            <Marker
                                position={[deliveryLat, deliveryLng]}
                                icon={deliveryIcon}
                            >
                                <Popup>Delivery Location: {gig.locationEnd}</Popup>
                            </Marker>

                            {/* Route Line */}
                            <Polyline
                                positions={[
                                    [gig.coordinates.lat, gig.coordinates.lng],
                                    [deliveryLat, deliveryLng]
                                ]}
                                pathOptions={{
                                    color: isSelected ? 'blue' : 'gray',
                                    weight: isSelected ? 4 : 2,
                                    dashArray: isSelected ? '5, 10' : undefined // Dotted line for walking/pending?
                                }}
                            />
                        </React.Fragment>
                    )
                })}

                {/* Fleet Markers (Admin Only) */}
                {isAdmin && MOCK_USERS.filter(u => u.role === 'atumwa' && u.locationCoordinates).map(courier => (
                    <Marker
                        key={courier.id}
                        position={[courier.locationCoordinates!.lat, courier.locationCoordinates!.lng]}
                        icon={fleetIcon}
                    >
                        <Popup>
                            <div className="font-bold">{courier.name}</div>
                            <div className="text-xs">Rating: {courier.rating}</div>
                        </Popup>
                    </Marker>
                ))}

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

            {/* Search Overlay & Quick Links (Bottom for mobile, side for desktop) */}
            <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 md:top-20 md:w-64 z-[400] pointer-events-none">
                <div className="bg-white p-2 rounded-lg shadow-lg pointer-events-auto">
                    <div className="flex gap-2 mb-2">
                        <div className="flex-1 bg-slate-100 rounded px-3 py-2 flex items-center text-slate-500 text-sm">
                            <MapPin size={16} className="mr-2" />
                            Search area...
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div className="grid grid-cols-4 gap-1">
                        <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center">
                            <span className="text-lg">🏠</span>
                            <span className="text-[10px] text-slate-600">Home</span>
                        </button>
                        <button onClick={() => navigate('/gigs')} className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center">
                            <span className="text-lg">💼</span>
                            <span className="text-[10px] text-slate-600">Gigs</span>
                        </button>
                        <button onClick={() => navigate('/messages')} className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center">
                            <span className="text-lg">💬</span>
                            <span className="text-[10px] text-slate-600">Chat</span>
                        </button>
                        <button onClick={() => navigate('/profile')} className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center">
                            <span className="text-lg">👤</span>
                            <span className="text-[10px] text-slate-600">Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Admin Layer Controls */}
            {isAdmin && (
                <div className="absolute bottom-6 right-6 z-[400] flex flex-col items-end pointer-events-auto">
                    <button
                        onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                        className={`p-3 rounded-full shadow-lg border transition-all flex items-center justify-center ${isLayerMenuOpen ? 'bg-slate-800 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                        title="Map Layers"
                    >
                        <Layers size={20} />
                    </button>

                    {isLayerMenuOpen && (
                        <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-60">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Filter size={12} /> Map Filters
                            </h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm font-medium text-slate-700">Open Gigs Only</span>
                                    <input
                                        type="checkbox"
                                        checked={layers.openGigsOnly}
                                        onChange={e => setLayers({ ...layers, openGigsOnly: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
