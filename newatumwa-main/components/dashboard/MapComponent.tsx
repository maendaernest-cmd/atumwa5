import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  role: string;
  activeGigId?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ role, activeGigId }) => {
  const position: [number, number] = [-17.8248, 31.0530]; // Harare

  return (
    <div className="h-full w-full bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 relative">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Atumwa {role} Center <br /> {activeGigId ? `Order: ${activeGigId}` : 'Ready for duty'}
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur p-2 rounded-lg shadow-md border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600">
        Live Tracker: {role}
      </div>
    </div>
  );
};
