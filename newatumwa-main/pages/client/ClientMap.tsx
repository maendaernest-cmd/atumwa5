import React, { useState, useMemo } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { MapComponent } from '../../components/dashboard/MapComponent';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Gig } from '../../types';
import { useNavigate } from 'react-router-dom';

export default function ClientMapPage() {
  const { users, gigs, addGig } = useData();
  const { user: client } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [mapCenter, setMapCenter] = useState<[number, number]>([-17.8292, 31.0522]);
  const [mapZoom, setMapZoom] = useState(13);

  const onlineWorkers = useMemo(() => users.filter(u => u.role === 'atumwa' && u.isOnline), [users]);
  const activeGig = useMemo(() => 
    gigs.find(g => g.postedBy.id === client?.id && g.status === 'in-progress' && g.assignedTo),
    [gigs, client]
  );
  const assignedWorker = useMemo(() => 
    activeGig ? users.find(u => u.id === activeGig.assignedTo) : undefined,
    [activeGig, users]
  );

  const handleMarkerClick = (item: User | Gig) => {
    if ('locationCoordinates' in item && item.locationCoordinates) {
      setMapCenter([item.locationCoordinates.lat, item.locationCoordinates.lng]);
      setMapZoom(15);
    }
  };

  const handleHireNow = (worker: User) => {
    if (!client) return;
    const newGig: Gig = {
        id: `gig-${Date.now()}`,
        orderNumber: `ATMW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Generate order number here
        title: `Delivery for ${client.name}`,
        description: `Deliver to ${client.name}`,
        type: 'parcel',
        price: 25, // Example price
        paymentMethod: 'cash_usd',
        urgency: 'standard',
        status: 'in-progress',
        locationStart: 'Pickup Location (Dummy)',
        locationEnd: 'Dropoff Location (Dummy)',
        stops: [],
        checklist: [],
        postedBy: client,
        postedAt: new Date().toISOString(),
        assignedTo: worker.id,
        assignedAt: new Date().toISOString(),
        distance: '5km',
        coordinates: { lat: -17.8292 + (Math.random() * 0.02 - 0.01), lng: 31.0522 + (Math.random() * 0.02 - 0.01) } // Example coordinates
    };
    addGig(newGig);
    addToast('Worker Hired!', `${worker.name} has been assigned to your new gig.`, 'success');
    navigate(`/dashboard/client/gigs/${newGig.id}`); // Navigate to gig detail page
  };

  return (
    <DashboardShell role="client" title="Map & Tracking">
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">Live Fleet Tracker</h1>
            <p className="text-slate-500 font-medium">
              {activeGig ? `Tracking Order #${activeGig.orderNumber}` : 'Monitor active deliveries and discover nearby messengers'}
            </p>
          </div>
          {!activeGig && (
            <div className="flex space-x-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search for couriers..." 
                  className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 shadow-sm w-full md:w-80 transition-all outline-none"
                />
              </div>
              <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90">
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <MapComponent 
              usersToShow={onlineWorkers}
              gigsToShow={activeGig ? [activeGig] : []}
              activeGig={activeGig}
              assignedWorker={assignedWorker}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          <div className="w-full lg:w-96 flex flex-col space-y-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            {activeGig && assignedWorker ? (
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Your Active Order</h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                    <img src={assignedWorker.avatar} alt={assignedWorker.name} className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{assignedWorker.name}</h4>
                    <p className="text-xs font-bold text-slate-400">Order #{activeGig.orderNumber}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 text-brand-500" />
                    <span>Status: {activeGig.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-brand-500" />
                    <span>ETA: Calculating...</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">
                  View Order Details
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Nearby Workers</h3>
                <div className="space-y-4">
                  {onlineWorkers.map((worker) => (
                    <div key={worker.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 font-black text-slate-400 text-sm border border-white shadow-sm group-hover:scale-105 transition-transform">
                          <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-black text-slate-900 mr-1">{worker.name}</h4>
                            {worker.isVerified && <CheckBadgeIcon className="h-4 w-4 text-blue-500" />}
                          </div>
                          <p className="text-xs font-bold text-slate-400">{worker.role}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-brand-600">
                            <StarIcon className="h-3 w-3 fill-current mr-1" />
                            <span className="text-xs font-black">{worker.rating}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{/*worker.distance*/ '1.2km'}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleHireNow(worker)}
                          className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all active:scale-95 uppercase tracking-widest">
                          Hire Now
                        </button>
                        <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all active:scale-90 border border-transparent hover:border-slate-100">
                          <ChatBubbleLeftIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
