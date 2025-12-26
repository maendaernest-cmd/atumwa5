import React, { useState, useMemo } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { MapComponent } from '../../components/dashboard/MapComponent';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Gig, User } from '../../types';

export default function WorkerMapPage() {
  const { users, gigs } = useData();
  const { user: workerUser } = useAuth();
  const navigate = useNavigate();

  const [mapCenter, setMapCenter] = useState<[number, number]>([-17.8292, 31.0522]);
  const [mapZoom, setMapZoom] = useState(13);

  const activeGig: Gig | undefined = useMemo(() => 
    gigs.find(g => g.assignedTo === workerUser?.id && g.status === 'in-progress'),
    [gigs, workerUser]
  );

  const clientOfGig: User | undefined = useMemo(() => 
    activeGig ? users.find(u => u.id === activeGig.postedBy.id) : undefined,
    [activeGig, users]
  );

  const handleMarkerClick = (item: User | Gig) => {
    if ('locationCoordinates' in item && item.locationCoordinates) {
      setMapCenter([item.locationCoordinates.lat, item.locationCoordinates.lng]);
      setMapZoom(15);
    }
  };

  const calculateETA = (gig: Gig, worker: User) => {
    if (!gig.coordinates || !worker.locationCoordinates) return { dist: 'N/A', time: 'N/A' };
    
    const lat1 = worker.locationCoordinates.lat;
    const lon1 = worker.locationCoordinates.lng;
    const lat2 = gig.coordinates.lat;
    const lon2 = gig.coordinates.lng;

    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Approx km
    const time = Math.round(dist * 3); // Approx 3 mins per km in city
    return { dist: dist.toFixed(1), time: time + (time < 5 ? 2 : 5) };
  };

  const etaToPickup = useMemo(() => {
    if (activeGig && workerUser?.locationCoordinates && activeGig.coordinates) {
        return calculateETA(activeGig, { ...workerUser, locationCoordinates: activeGig.coordinates });
    }
    return { dist: 'N/A', time: 'N/A' };
  }, [activeGig, workerUser]);

  const etaToDropoff = useMemo(() => {
    if (activeGig && workerUser?.locationCoordinates && activeGig.coordinates) {
        const dummyDropoffCoords = { lat: activeGig.coordinates.lat + 0.005, lng: activeGig.coordinates.lng + 0.005 };
        return calculateETA(activeGig, { ...workerUser, locationCoordinates: dummyDropoffCoords });
    }
    return { dist: 'N/A', time: 'N/A' };
  }, [activeGig, workerUser]);


  return (
    <DashboardShell role="atumwa" title="My Route">
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">My Active Route</h1>
            <p className="text-slate-500 font-medium">
              {activeGig ? `Order #${activeGig.orderNumber}: ${activeGig.title}` : 'No active gigs. Find new opportunities!'}
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <MapComponent 
              activeGig={activeGig}
              assignedWorker={workerUser}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          <div className="w-full lg:w-96 flex flex-col space-y-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            {activeGig && workerUser ? (
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Current Task</h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                    <img src={clientOfGig?.avatar} alt={clientOfGig?.name} className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{clientOfGig?.name || 'Client'}</h4>
                    <p className="text-xs font-bold text-slate-400">Order #{activeGig.orderNumber}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-brand-500" />
                    <span>Pickup: {activeGig.locationStart}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-blue-500" />
                    <span>Dropoff: {activeGig.locationEnd || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 text-green-500" />
                    <span>Status: {activeGig.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-brand-500" />
                    <span>ETA to Pickup: {etaToPickup.time} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-blue-500" />
                    <span>ETA to Dropoff: {etaToDropoff.time} mins</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">
                  View Task Details
                </button>
              </div>
            ) : (
                <div className="text-center py-12 px-6 bg-slate-50/80 rounded-3xl">
                  <ClipboardDocumentCheckIcon className="w-12 h-12 mx-auto text-slate-300" />
                  <h4 className="mt-4 text-lg font-black text-slate-600">No Active Task</h4>
                  <p className="mt-1 text-sm text-slate-500">You haven't accepted any tasks yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
