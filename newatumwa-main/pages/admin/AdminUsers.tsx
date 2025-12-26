import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { StatCard } from '../../components/StatCard';
import { 
  MagnifyingGlassIcon, 
  UserPlusIcon, 
  EllipsisHorizontalIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ChevronDownIcon,
  UsersIcon,
  UserGroupIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const users = [
  { id: 'USR-101', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Client', status: 'Active', joined: 'Dec 12, 2024', verified: true, avatar: 'SJ' },
  { id: 'USR-102', name: 'Tinashe Mutero', email: 'tinashe.m@example.com', role: 'Worker', status: 'Active', joined: 'Dec 15, 2024', verified: true, avatar: 'TM' },
  { id: 'USR-103', name: 'Blessing Chida', email: 'blessing.c@example.com', role: 'Worker', status: 'Pending', joined: 'Dec 24, 2025', verified: false, avatar: 'BC' },
  { id: 'USR-104', name: 'John Doe', email: 'john.d@example.com', role: 'Client', status: 'Active', joined: 'Jan 05, 2025', verified: true, avatar: 'JD' },
  { id: 'USR-105', name: 'Mike Ross', email: 'mike.r@example.com', role: 'Worker', status: 'Suspended', joined: 'Nov 20, 2024', verified: true, avatar: 'MR' },
  { id: 'USR-106', name: 'Grace Moyo', email: 'grace.m@example.com', role: 'Support', status: 'Active', joined: 'Dec 01, 2024', verified: true, avatar: 'GM' },
  { id: 'USR-107', name: 'Arthur Admin', email: 'arthur@atum.com', role: 'Admin', status: 'Active', joined: 'Oct 10, 2024', verified: true, avatar: 'AA' },
];

export default function AdminUsersPage() {
  const navigate = useNavigate();

  return (
    <DashboardShell role="admin" title="User Management">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic">User Management</h1>
            <p className="text-slate-500 font-medium">Control platform access and monitor user activity</p>
          </div>
          <button className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-100 hover:bg-black transition-all active:scale-95">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add New User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Users" value="1,248" icon={UsersIcon} variant="white" />
          <StatCard label="Active Workers" value="842" icon={UserGroupIcon} variant="white" />
          <StatCard label="Pending Review" value="12" icon={ClockIcon} variant="white" />
          <StatCard label="Suspended" value="3" icon={XCircleIcon} variant="white" />
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/30 gap-6">
            <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-1 whitespace-nowrap uppercase tracking-widest">All Users</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors whitespace-nowrap uppercase tracking-widest">Clients</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors whitespace-nowrap uppercase tracking-widest">Workers</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors whitespace-nowrap uppercase tracking-widest">Staff</button>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or ID..." 
                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900/10 w-full md:w-80 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Contact</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 font-black text-slate-400 text-sm border border-white shadow-sm relative group-hover:scale-105 transition-transform">
                          {user.avatar}
                          {user.verified && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                              <ShieldCheckIcon className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight mb-1">{user.name}</p>
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'Admin' ? 'bg-slate-900 text-white' :
                        user.role === 'Worker' ? 'bg-brand-50 text-brand-600' :
                        user.role === 'Support' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-brand-50 text-brand-600' :
                        user.status === 'Suspended' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                          user.status === 'Active' ? 'bg-brand-500' :
                          user.status === 'Suspended' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{user.joined}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                          <IdentificationIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                          <EllipsisHorizontalIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
