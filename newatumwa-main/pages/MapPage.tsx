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

  // Task panel and drawer states
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<string | null>(null);

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
    <div className="bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner h-[calc(100vh-7rem)] md:h-[calc(100vh-3rem)] flex">
        {/* Real map using OpenStreetMap embed (no extra JS libs needed) */}
        <iframe
          title="Atumwa Harare Map"
          className={`${isTaskPanelOpen ? 'flex-1' : 'w-full'} h-full border-0`}
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

        {/* Collapsible Right Task Panel */}
        {isTaskPanelOpen && (
            <div className="w-80 bg-white shadow-2xl border-l border-slate-200 z-30 flex flex-col">
                {/* Panel Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} />
                        {isAdmin ? 'All Tasks' : user?.role === 'atumwa' ? 'My Deliveries' : 'My Tasks'}
                    </h3>
                    <button
                        onClick={() => setIsTaskPanelOpen(false)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <ChevronRight size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-3">
                        {relevantTasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => {
                                    setSelectedGigId(task.id);
                                    setSelectedTaskForDrawer(task.id);
                                }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                    selectedGigId === task.id
                                        ? 'border-brand-500 bg-brand-50 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                {/* Task Header */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-slate-800 text-sm truncate">{task.title}</h4>
                                            {task.urgency === 'priority' && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Priority</span>}
                                            {task.urgency === 'express' && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Express</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={12} />
                                            <span>{new Date(task.postedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span>•</span>
                                            <span>${task.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        task.status === 'open' ? 'bg-green-100 text-green-700' :
                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                        task.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {task.status.replace('-', ' ')}
                                    </div>
                                </div>

                                {/* Task Details */}
                                <div className="space-y-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} />
                                        <span className="truncate">{task.locationStart} → {task.locationEnd}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={10} />
                                        <span>{task.postedBy.name}</span>
                                        <Star size={10} className="text-amber-500 fill-amber-500" />
                                        <span>{task.postedBy.rating}</span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2 mt-3">
                                    {user?.role === 'atumwa' && task.status === 'open' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle accept
                                            }}
                                            className="flex-1 bg-brand-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-brand-700 transition-colors"
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {user?.role === 'atumwa' && task.status === 'in-progress' && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle navigate
                                                }}
                                                className="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Navigation size={12} />
                                                Navigate
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle deliver
                                                }}
                                                className="bg-green-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Deliver
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/messages');
                                        }}
                                        className="bg-slate-100 text-slate-600 px-2 py-1.5 rounded text-xs font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        <MessageSquare size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Task Panel Toggle Button */}
        {!isTaskPanelOpen && (
            <button
                onClick={() => setIsTaskPanelOpen(true)}
                className="absolute top-1/2 right-4 z-20 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Open task panel"
            >
                <ChevronLeft size={18} className="text-slate-600" />
            </button>
        )}

        {/* Task Drawer */}
        {selectedTaskForDrawer && (
            <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800">Task Details</h3>
                        <button
                            onClick={() => setSelectedTaskForDrawer(null)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {(() => {
                            const task = MOCK_GIGS.find(g => g.id === selectedTaskForDrawer);
                            if (!task) return null;

                            return (
                                <div className="space-y-6">
                                    {/* Task Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-2xl font-bold text-slate-800">{task.title}</h4>
                                                {task.urgency === 'priority' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Priority</span>}
                                                {task.urgency === 'express' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Express</span>}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {new Date(task.postedAt).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign size={16} />
                                                    ${task.price.toFixed(2)} • {task.paymentMethod}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    task.status === 'open' ? 'bg-green-100 text-green-700' :
                                                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                    task.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {task.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task Description */}
                                    <div>
                                        <h5 className="font-semibold text-slate-800 mb-2">Description</h5>
                                        <p className="text-slate-600 leading-relaxed">{task.description}</p>
                                    </div>

                                    {/* Locations */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <MapPin size={16} className="text-green-600" />
                                                </div>
                                                <h6 className="font-semibold text-green-800">Pickup Location</h6>
                                            </div>
                                            <p className="text-green-700">{task.locationStart}</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                    <MapPin size={16} className="text-red-600" />
                                                </div>
                                                <h6 className="font-semibold text-red-800">Drop-off Location</h6>
                                            </div>
                                            <p className="text-red-700">{task.locationEnd}</p>
                                            <p className="text-xs text-red-600 mt-1">{task.distance} • Est. {Math.ceil(parseFloat(task.distance) * 3)} min</p>
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                        <img src={task.postedBy.avatar} alt={task.postedBy.name} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <h6 className="font-semibold text-slate-800">{task.postedBy.name}</h6>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                                <span>{task.postedBy.rating} rating</span>
                                                {task.postedBy.isVerified && <CheckCircle size={14} className="text-blue-500" />}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/messages')}
                                            className="ml-auto bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare size={16} />
                                            Message
                                        </button>
                                    </div>

                                    {/* Status Timeline */}
                                    <div>
                                        <h5 className="font-semibold text-slate-800 mb-4">Task Timeline</h5>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    task.status !== 'open' ? 'bg-green-100' : 'bg-slate-100'
                                                }`}>
                                                    <CheckCircle size={16} className={task.status !== 'open' ? 'text-green-600' : 'text-slate-400'} />
                                                </div>
                                                <div className="flex-1">
                                                    <h6 className="font-medium text-slate-800">Task Posted</h6>
                                                    <p className="text-sm text-slate-600">{new Date(task.postedAt).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    task.status === 'in-progress' || task.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'
                                                }`}>
                                                    <User size={16} className={
                                                        task.status === 'in-progress' || task.status === 'completed' ? 'text-green-600' : 'text-slate-400'
                                                    } />
                                                </div>
                                                <div className="flex-1">
                                                    <h6 className="font-medium text-slate-800">Accepted by Messenger</h6>
                                                    <p className="text-sm text-slate-600">
                                                        {task.assignedTo ? 'Messenger assigned and en route' : 'Waiting for messenger'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    task.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'
                                                }`}>
                                                    <CheckCircle size={16} className={task.status === 'completed' ? 'text-green-600' : 'text-slate-400'} />
                                                </div>
                                                <div className="flex-1">
                                                    <h6 className="font-medium text-slate-800">Task Completed</h6>
                                                    <p className="text-sm text-slate-600">Delivery completed successfully</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proof of Delivery */}
                                    {user?.role === 'atumwa' && task.status === 'in-progress' && (
                                        <div className="bg-slate-50 p-4 rounded-lg border-2 border-dashed border-slate-300">
                                            <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                                <Camera size={18} />
                                                Proof of Delivery
                                            </h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Camera size={24} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">Take Photo</span>
                                                </button>
                                                <button className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Upload size={24} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">Upload File</span>
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-3">Upload photos or signatures to verify delivery completion</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        {user?.role === 'atumwa' && task.status === 'open' && (
                                            <button className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors">
                                                Accept Delivery
                                            </button>
                                        )}
                                        {user?.role === 'atumwa' && task.status === 'in-progress' && (
                                            <>
                                                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                                    <Navigation size={18} />
                                                    Navigate to Pickup
                                                </button>
                                                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                                    Mark Delivered
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => navigate('/messages')}
                                            className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare size={18} />
                                            Contact Client
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
