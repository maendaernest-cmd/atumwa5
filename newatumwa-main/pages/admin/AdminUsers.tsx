import React, { useState, useMemo } from 'react';
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
  UsersIcon,
  UserGroupIcon,
  ClockIcon,
  XCircleIcon,
  ArrowUpOnSquareIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import { format } from 'date-fns';

type UserFilter = 'all' | 'client' | 'atumwa' | 'staff';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();
  const { users, verifyUser, suspendUser, banUser, updateUserRole } = useData();
  
  const [filter, setFilter] = useState<UserFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getUserStatus = (user: User) => {
    if (user.isBanned) return 'Banned';
    if (user.isSuspended) return 'Suspended';
    if (!user.isVerified) return 'Pending';
    return 'Active';
  };

  const filteredUsers = useMemo(() => {
    let baseUsers = users;
    if (filter !== 'all') {
      if (filter === 'staff') {
        baseUsers = baseUsers.filter(u => u.role === 'admin' || u.role === 'support');
      } else {
        baseUsers = baseUsers.filter(u => u.role === filter);
      }
    }

    if (searchQuery) {
      return baseUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return baseUsers;
  }, [users, filter, searchQuery]);
  
  const totalUsers = users.length;
  const activeWorkers = users.filter(u => u.role === 'atumwa' && !u.isSuspended && !u.isBanned).length;
  const pendingReview = users.filter(u => !u.isVerified && !u.isBanned).length;
  const suspended = users.filter(u => u.isSuspended || u.isBanned).length;

  const handleSuspend = (userId: string) => {
    const reason = window.prompt("Enter reason for suspension:");
    if (reason && adminUser) {
      suspendUser(userId, adminUser.id, reason);
    }
  };

  const handleBan = (userId: string) => {
    const reason = window.prompt("Enter reason for BANNING user permanently. This is irreversible.");
    if (reason && adminUser) {
      banUser(userId, adminUser.id, reason);
    }
  };
  
  const handleMakeAdmin = (userId: string) => {
    if(window.confirm("Are you sure you want to make this user an Admin?") && adminUser){
      updateUserRole(userId, 'admin', adminUser.id);
    }
  }

  return (
    <DashboardShell role="admin" title="User Management">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic">User Management</h1>
            <p className="text-slate-500 font-medium">Control platform access and monitor user activity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={totalUsers} icon={UsersIcon} variant="white" />
          <StatCard label="Active Workers" value={activeWorkers} icon={UserGroupIcon} variant="white" />
          <StatCard label="Pending Review" value={pendingReview} icon={ClockIcon} variant="white" />
          <StatCard label="Suspended/Banned" value={suspended} icon={XCircleIcon} variant="white" />
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/30 gap-6">
            <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(['all', 'client', 'atumwa', 'staff'] as UserFilter[]).map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`text-sm font-black pb-1 whitespace-nowrap uppercase tracking-widest ${filter === f ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-900 transition-colors'}`}>
                  {f === 'atumwa' ? 'Workers' : f}
                </button>
              ))}
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
                {filteredUsers.map((user) => {
                  const status = getUserStatus(user);
                  return (
                    <tr 
                      key={user.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6" onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}>
                        <div className="flex items-center cursor-pointer">
                          <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 font-black text-slate-400 text-sm border border-white shadow-sm relative group-hover:scale-105 transition-transform">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                            {user.isVerified && (
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
                          user.role === 'admin' ? 'bg-slate-900 text-white' :
                          user.role === 'atumwa' ? 'bg-brand-50 text-brand-600' :
                          user.role === 'support' ? 'bg-blue-50 text-blue-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          status === 'Active' ? 'bg-brand-50 text-brand-600' :
                          status === 'Suspended' ? 'bg-orange-50 text-orange-600' :
                          status === 'Banned' ? 'bg-red-50 text-red-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                            status === 'Active' ? 'bg-brand-500' :
                            status === 'Suspended' ? 'bg-orange-500' :
                            status === 'Banned' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`}></span>
                          {status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-900">
                          {(() => {
                            try {
                              return format(new Date(user.createdAt), 'MMM dd, yyyy');
                            } catch (error) {
                              return 'Invalid Date';
                            }
                          })()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {!user.isVerified && <button onClick={() => verifyUser(user.id)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Verify User"><IdentificationIcon className="h-5 w-5" /></button>}
                          {status !== 'Suspended' && status !== 'Banned' && <button onClick={() => handleSuspend(user.id)} className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all" title="Suspend User"><NoSymbolIcon className="h-5 w-5" /></button>}
                          {status !== 'Banned' && <button onClick={() => handleBan(user.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Ban User"><XCircleIcon className="h-5 w-5" /></button>}
                          {user.role !== 'admin' && <button onClick={() => handleMakeAdmin(user.id)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Make Admin"><ArrowUpOnSquareIcon className="h-5 w-5" /></button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
