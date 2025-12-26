import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData } from '../../context/DataContext';
import { User, Gig } from '../../types';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
const userIcon = createDivIcon('👤', 'purple');

const generateRealisticPath = (start: [number, number], end: [number, number]) => {
    const mid1: [number, number] = [start[0] + (end[0] - start[0]) * 0.4 + 0.002, start[1] + (end[1] - start[1]) * 0.3];
    const mid2: [number, number] = [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.6 + 0.002];
    return [start, mid1, mid2, end];
};

const MapUpdater: React.FC<{ center: [number, number], zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom || map.getZoom());
    }, [center, zoom, map]);
    return null;
};

interface MapComponentProps {
    usersToShow?: User[];
    gigsToShow?: Gig[];
    activeGig?: Gig;
    assignedWorker?: User;
    center?: [number, number];
    zoom?: number;
    onMarkerClick?: (item: User | Gig) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
    usersToShow = [],
    gigsToShow = [],
    activeGig,
    assignedWorker,
    center: defaultCenter = [-17.8292, 31.0522], // Harare center
    zoom: defaultZoom = 13,
    onMarkerClick,
}) => {
    const { users } = useData();
    const [fleetPositions, setFleetPositions] = useState<Record<string, [number, number]>>({});

    // Dynamic map center and zoom based on active gig
    const [currentCenter, setCurrentCenter] = useState<[number, number]>(defaultCenter);
    const [currentZoom, setCurrentZoom] = useState(defaultZoom);

    useEffect(() => {
        if (activeGig && assignedWorker?.locationCoordinates && activeGig.coordinates) {
            // Calculate a center point between worker and gig destination
            const workerLat = assignedWorker.locationCoordinates.lat;
            const workerLng = assignedWorker.locationCoordinates.lng;
            const gigLat = activeGig.coordinates.lat;
            const gigLng = activeGig.coordinates.lng;

            const newCenter: [number, number] = [
                (workerLat + gigLat) / 2,
                (workerLng + gigLng) / 2
            ];
            setCurrentCenter(newCenter);
            setCurrentZoom(14); // Adjust zoom to fit both points
        } else {
            setCurrentCenter(defaultCenter);
            setCurrentZoom(defaultZoom);
        }
    }, [activeGig, assignedWorker, defaultCenter, defaultZoom]);

    useEffect(() => {
        const allUsers = [...users, ...usersToShow];
        const initial: Record<string, [number, number]> = {};
        allUsers.forEach(u => {
            if (u.locationCoordinates) {
                initial[u.id] = [u.locationCoordinates.lat, u.locationCoordinates.lng];
            }
        });
        setFleetPositions(initial);

        const interval = setInterval(() => {
            setFleetPositions(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => {
                    const [lat, lng] = next[id];
                    next[id] = [
                        lat + (Math.random() * 0.00005 - 0.000025), // Smaller random movement
                        lng + (Math.random() * 0.00005 - 0.000025)
                    ];
                });
                return next;
            });
        }, 2000); // Update more frequently

        return () => clearInterval(interval);
    }, [users, usersToShow]);

    // ETA Calculation Logic (simplified)
    const calculateETA = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Approx km
        const time = Math.round(dist * 3); // Approx 3 mins per km in city
        return { dist: dist.toFixed(1), time: time + (time < 5 ? 2 : 5) };
    };


    return (
        <div className="h-full w-full bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 relative">
            <MapContainer center={currentCenter} zoom={currentZoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapUpdater center={currentCenter} zoom={currentZoom} />

                {activeGig && assignedWorker && assignedWorker.locationCoordinates && activeGig.coordinates ? (
                    <>
                        {/* Worker Marker */}
                        <Marker position={[assignedWorker.locationCoordinates.lat, assignedWorker.locationCoordinates.lng]} icon={fleetIcon}>
                            <Popup>
                                <div>
                                    <h4 className="font-bold">{assignedWorker.name}</h4>
                                    <p>Courier for #{activeGig.orderNumber}</p>
                                    <p>ETA to Pickup: ~{calculateETA(assignedWorker.locationCoordinates.lat, assignedWorker.locationCoordinates.lng, activeGig.coordinates.lat, activeGig.coordinates.lng).time} mins</p>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Pickup Location Marker */}
                        <Marker position={[activeGig.coordinates.lat, activeGig.coordinates.lng]} icon={pickupIcon}>
                            <Popup>
                                <div>
                                    <h4 className="font-bold">Pickup: {activeGig.locationStart}</h4>
                                    <p>Gig: {activeGig.title}</p>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Dropoff Location Marker (simplified to be slightly offset from pickup for visual clarity) */}
                        {activeGig.locationEnd && (
                            <Marker position={[activeGig.coordinates.lat + 0.005, activeGig.coordinates.lng + 0.005]} icon={deliveryIcon}>
                                <Popup>
                                    <div>
                                        <h4 className="font-bold">Dropoff: {activeGig.locationEnd}</h4>
                                        <p>Gig: {activeGig.title}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                        
                        {/* Polyline: Worker to Pickup */}
                        <Polyline
                            positions={generateRealisticPath(
                                [assignedWorker.locationCoordinates.lat, assignedWorker.locationCoordinates.lng],
                                [activeGig.coordinates.lat, activeGig.coordinates.lng]
                            )}
                            pathOptions={{ color: '#818cf8', weight: 4, opacity: 0.8 }}
                        />

                        {/* Polyline: Pickup to Dropoff */}
                        {activeGig.locationEnd && (
                            <Polyline
                                positions={generateRealisticPath(
                                    [activeGig.coordinates.lat, activeGig.coordinates.lng],
                                    [activeGig.coordinates.lat + 0.005, activeGig.coordinates.lng + 0.005]
                                )}
                                pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {/* Display Users (fallback) */}
                        {usersToShow.map((user) => {
                            const pos = fleetPositions[user.id];
                            if (!pos) return null;
                            return (
                                <Marker
                                    key={user.id}
                                    position={pos}
                                    icon={user.role === 'atumwa' ? fleetIcon : userIcon}
                                    eventHandlers={{ click: () => onMarkerClick && onMarkerClick(user) }}
                                >
                                    <Popup>{user.name}</Popup>
                                </Marker>
                            );
                        })}

                        {/* Display Gigs (fallback) */}
                        {gigsToShow.map((gig) => (
                            gig.coordinates && (
                                <Marker
                                    key={gig.id}
                                    position={[gig.coordinates.lat, gig.coordinates.lng]}
                                    icon={pickupIcon}
                                    eventHandlers={{ click: () => onMarkerClick && onMarkerClick(gig) }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <div className="font-bold">{gig.title}</div>
                                            <div>${gig.price.toFixed(2)}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </>
                )}
            </MapContainer>
        </div>
    );
};
