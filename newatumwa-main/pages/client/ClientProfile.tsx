import React from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { UserCircleIcon, CameraIcon, CreditCardIcon, BellIcon, ShieldCheckIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ClientProfile() {
  return (
    <DashboardShell role="client" title="User Profile & Settings">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic uppercase">My Profile</h1>
          <p className="text-slate-500 font-medium">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-brand-500/5"></div>
              <div className="relative">
                <div className="h-32 w-32 bg-slate-100 rounded-[32px] mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group cursor-pointer relative">
                  <UserCircleIcon className="h-20 w-20 text-slate-300 group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CameraIcon className="h-8 w-8 text-brand-600" />
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-900">Sarah Johnson</h2>
                <p className="text-xs font-black text-brand-600 uppercase tracking-widest mb-4">Verified Client</p>
                <div className="flex justify-center space-x-2">
                  <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">JOINED DEC 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <p className="text-2xl font-black text-blue-600">12</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">Gigs Posted</p>
                </div>
                <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100/50">
                  <p className="text-2xl font-black text-brand-600 font-display">$840</p>
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tight">Spent</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" defaultValue="Sarah Johnson" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" defaultValue="sarah.j@example.com" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="tel" defaultValue="+263 77 123 4567" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Region</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-600/20 appearance-none transition-all outline-none">
                      <option>Harare, Zimbabwe</option>
                      <option>Bulawayo, Zimbabwe</option>
                      <option>Mutare, Zimbabwe</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-100 uppercase tracking-widest">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-600/20 transition-all active:scale-95">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-brand-50 rounded-2xl flex items-center justify-center mr-4 text-brand-600 group-hover:scale-110 transition-transform">
                    <CreditCardIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Payment Methods</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage cards & EcoCash</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-600/20 transition-all active:scale-95">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 text-blue-600 group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Security & Privacy</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">2FA & Password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
