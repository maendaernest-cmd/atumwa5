import React, { useState } from 'react';
import { MOCK_GIGS } from '../constants';
import { MapPin, Navigation, Wifi, Layers, Filter, Activity, AlertTriangle, Bike, Clock, CheckCircle, X, Camera, FileText, MessageSquare, Phone, ChevronRight, ChevronLeft, Calendar, DollarSign, User, Star, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [selectedGigId, setSelectedGigId] = React.useState(location.state?.selectedGigId || MOCK_GIGS[0].id);
  const activeGig = MOCK_GIGS.find(g => g.id === selectedGigId) || MOCK_GIGS[0];

  // Harare center and simple lat/lng positions for demo (not exact, but real map)
  const HARARE_CENTER = { lat: -17.8292, lng: 31.0522 };

  const gigLatLng: Record<string, { lat: number; lng: number }> = {
    g1: { lat: -17.825, lng: 31.046 }, // Greenwood / Avenues
    g2: { lat: -17.829, lng: 31.041 }, // CBD
    g3: { lat: -17.8, lng: 31.039 }, // Avondale
    g4: { lat: -17.829, lng: 31.06 }, // Roadport
    g5: { lat: -17.776, lng: 31.079 }, // Borrowdale
    g6: { lat: -17.822, lng: 31.05 }, // Meikles
    g7: { lat: -17.78, lng: 31.08 }, // Borrowdale
    g8: { lat: -17.81, lng: 31.046 }, // Parirenyatwa
    g9: { lat: -17.802, lng: 31.045 }, // Avondale
    g10: { lat: -17.831, lng: 31.043 }, // CBD
  };

  const coords = gigLatLng[activeGig.id] || HARARE_CENTER;

  // User position (percentage based on map)
  const userPos = { x: 50, y: 50 };

  // Gig positions (percentage based on map)
  const gigPos: Record<string, { x: number; y: number }> = {
    g1: { x: 45, y: 45 },
    g2: { x: 50, y: 50 },
    g3: { x: 40, y: 40 },
    g4: { x: 55, y: 55 },
    g5: { x: 35, y: 35 },
    g6: { x: 48, y: 48 },
    g7: { x: 38, y: 38 },
    g8: { x: 42, y: 42 },
    g9: { x: 43, y: 43 },
    g10: { x: 52, y: 52 },
  };

  const effectiveTargetId = selectedGigId;

  // Mock fleet data
  const fleet = [
    { id: '1', name: 'John Doe', status: 'available', coords: { x: 48, y: 48 } },
    { id: '2', name: 'Jane Smith', status: 'busy', coords: { x: 52, y: 52 } },
  ];
  const visibleFleet = fleet;

  // Admin layer toggles (only for visual filters on top of real map)
  const [layers, setLayers] = React.useState({
    openGigsOnly: false,
    traffic: false,
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = React.useState(false);



  const visibleGigs = (layers.openGigsOnly
    ? MOCK_GIGS.filter(g => g.status === 'open')
    : MOCK_GIGS);

  // Get tasks relevant to current user
  const getRelevantTasks = () => {
    if (isAdmin) return visibleGigs;
    if (user?.role === 'atumwa') {
      // Messengers see assigned tasks and available tasks
      return visibleGigs.filter(g => g.assignedTo === user.id || g.status === 'open');
    }
    // Clients see their posted tasks
    return visibleGigs.filter(g => g.postedBy.id === user?.id);
  };

  const relevantTasks = getRelevantTasks();

  // Height calc: Mobile: 100vh - 7rem (header+padding), Desktop: 100vh - 3rem (padding)
  return (
    <div className="bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner h-[calc(100vh-7rem)] md:h-[calc(100vh-3rem)]">
        {/* Real map using OpenStreetMap embed (no extra JS libs needed) */}
        <iframe
          title="Atumwa Harare Map"
          className="w-full h-full border-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.03},${coords.lat - 0.03},${coords.lng + 0.03},${coords.lat + 0.03}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
        />

        {/* Live Indicator */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-slate-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {isAdmin ? 'SYSTEM LIVE' : 'LIVE'} <Wifi size={12} className="text-slate-400" />
            </span>
        </div>

        {/* Messenger-Specific Context */}
        {!isAdmin && (
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-slate-200 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Delivery Mode
              </p>
            </div>
            {activeGig ? (
              <>
                <p className="text-sm text-slate-800 font-medium mb-1">{activeGig.title}</p>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>📍 {activeGig.distance} away</p>
                  <p>💰 ${activeGig.price.toFixed(2)} • {activeGig.paymentMethod}</p>
                  <p>⏱️ Est. {Math.ceil(parseFloat(activeGig.distance) * 3)} min</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-600">Select a delivery to track</p>
            )}
          </div>
        )}

        {/* Current User Marker (Non-Admin Only) */}
        {!isAdmin && (
            <div
                className="absolute z-10 flex flex-col items-center transition-all duration-[2000ms] ease-linear will-change-[top,left]"
                style={{
                    top: `${userPos.y}%`,
                    left: `${userPos.x}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="w-16 h-16 bg-brand-500/20 rounded-full animate-pulse absolute"></div>
                <div className="w-4 h-4 bg-brand-600 rounded-full border-2 border-white shadow-lg z-20"></div>
                <div className="bg-white px-2 py-1 rounded shadow text-[10px] font-bold mt-1 z-20 whitespace-nowrap">You</div>
            </div>
        )}

        {/* Admin Fleet Markers */}
        {isAdmin && visibleFleet.map(member => (
            <div
                key={member.id}
                className="absolute z-30 flex flex-col items-center transition-all duration-[2000ms] ease-linear will-change-[top,left]"
                style={{
                    top: `${member.coords.y}%`,
                    left: `${member.coords.x}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-20 ${member.status === 'busy' ? 'bg-amber-500' : 'bg-brand-500'}`}></div>
                <div className="mt-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {member.name}
                </div>
            </div>
        ))}

        {/* Gig Markers */}
        {visibleGigs.map((gig) => {
            const pos = gigPos[gig.id] || { x: 50, y: 50 }; // Fallback
            const isSelected = gig.id === effectiveTargetId && !isAdmin;

            return (
                <div
                    key={gig.id}
                    className={`absolute group cursor-pointer transition-all duration-[2000ms] ease-linear will-change-[top,left] ${isSelected ? 'z-40' : 'z-10'}`}
                    style={{
                        top: `${pos.y}%`,
                        left: `${pos.x}%`
                    }}
                    onClick={() => setSelectedGigId(gig.id)}
                >
                    <div className={`relative flex flex-col items-center transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                         <div className={`p-1 rounded-full shadow-lg border mb-1 ${isSelected ? 'bg-brand-600 border-white ring-2 ring-brand-300' : 'bg-white border-slate-100'}`}>
                            {gig.type === 'prescription' && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white text-red-500' : 'bg-red-100'}`}>💊</div>}
                            {gig.type === 'paperwork' && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white text-stone-500' : 'bg-stone-100'}`}>📄</div>}
                            {gig.type === 'shopping' && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white text-green-500' : 'bg-green-100'}`}>🛍️</div>}
                            {gig.type === 'parcel' && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white text-amber-500' : 'bg-amber-100'}`}>📦</div>}
                         </div>
                         <div className={`absolute bottom-full mb-2 ${isSelected ? 'block' : 'hidden group-hover:block'} w-48 bg-white p-2 rounded-lg shadow-xl text-xs z-30`}>
                             <div className="font-bold text-slate-800">{gig.title}</div>
                             <div className="text-brand-600 font-bold">${gig.price.toFixed(2)}</div>
                             <div className="text-slate-500">{gig.distance} away</div>
                             {isAdmin && (
                                 <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                                     <button className="flex-1 bg-brand-50 text-brand-600 px-2 py-1 rounded text-xs font-medium hover:bg-brand-100 transition-colors">
                                         Message Owner
                                     </button>
                                     <button className="flex-1 bg-slate-50 text-slate-600 px-2 py-1 rounded text-xs font-medium hover:bg-slate-100 transition-colors">
                                         View Details
                                     </button>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>
            )
        })}

        {/* Admin Overlay: Live Stats */}
        {isAdmin && (
             <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 w-48 animate-in slide-in-from-left duration-500">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Operations</div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Bike size={14} className="text-brand-600" /> Active Fleet
                        </div>
                        <span className="font-bold text-slate-900">{fleet.length}</span>
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

        {/* Admin Layer Controls (New Feature) */}
        {isAdmin && (
            <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end">
                <button
                onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                className={`p-3 rounded-full shadow-lg border transition-all flex items-center justify-center ${isLayerMenuOpen ? 'bg-slate-800 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                title="Map Layers"
                >
                    <Layers size={20} />
                </button>

                {isLayerMenuOpen && (
                <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-60 animate-in slide-in-from-bottom-2 duration-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Filter size={12} /> Map Filters
                    </h4>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Open Gigs Only</span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${layers.openGigsOnly ? 'bg-brand-600' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${layers.openGigsOnly ? 'left-6' : 'left-1'}`} />
                                <input
                                    type="checkbox"
                                    checked={layers.openGigsOnly}
                                    onChange={e => setLayers({...layers, openGigsOnly: e.target.checked})}
                                    className="sr-only"
                                />
                            </div>
                        </label>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Traffic Density</span>
                                {layers.traffic && <Activity size={12} className="text-red-500 animate-pulse" />}
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${layers.traffic ? 'bg-red-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${layers.traffic ? 'left-6' : 'left-1'}`} />
                                <input
                                    type="checkbox"
                                    checked={layers.traffic}
                                    onChange={e => setLayers({...layers, traffic: e.target.checked})}
                                    className="sr-only"
                                />
                            </div>
                        </label>
                    </div>
                </div>
                )}
            </div>
        )}

        {/* Map Controls (Hide on Admin to avoid clutter) */}
        {!isAdmin && (
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                <button className="bg-white p-3 rounded-full shadow-lg text-slate-700 hover:bg-slate-50">
                    <Navigation size={20} />
                </button>
                <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col gap-1">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-xl font-bold text-slate-600">+</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-xl font-bold text-slate-600">-</button>
                </div>
            </div>
        )}

        {/* Search Overlay */}
        <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 z-20">
            {/* If admin, adjust position to not overlap stats */}
            <div className={`bg-white p-2 rounded-lg shadow-lg max-w-full ${isAdmin ? 'md:mr-16 mt-16 md:mt-0' : ''}`}>
                <div className="flex gap-2 mb-2">
                    <div className="flex-1 bg-slate-100 rounded px-3 py-2 flex items-center text-slate-500 text-sm">
                        <MapPin size={16} className="mr-2" />
                        Search area...
                    </div>
                    <button className="bg-brand-600 text-white px-4 py-2 rounded font-medium text-sm">Filter</button>
                </div>
                {/* Quick Links */}
                <div className="grid grid-cols-4 gap-1">
                    <button
                        onClick={() => navigate('/')}
                        className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center"
                        title="Home"
                    >
                        <span className="text-lg">🏠</span>
                        <span className="text-[10px] text-slate-600">Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/gigs')}
                        className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center"
                        title="Gigs"
                    >
                        <span className="text-lg">💼</span>
                        <span className="text-[10px] text-slate-600">Gigs</span>
                    </button>
                    <button
                        onClick={() => navigate('/messages')}
                        className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center"
                        title="Messages"
                    >
                        <span className="text-lg">💬</span>
                        <span className="text-[10px] text-slate-600">Chat</span>
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex flex-col items-center p-2 hover:bg-slate-50 rounded text-center"
                        title="Profile"
                    >
                        <span className="text-lg">👤</span>
                        <span className="text-[10px] text-slate-600">Profile</span>
                    </button>
                </div>
            </div>
        </div>


    </div>
  );
};
