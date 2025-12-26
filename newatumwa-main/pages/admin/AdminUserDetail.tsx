import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/StatCard';
import { ArrowLeftIcon, UserCircleIcon, EnvelopeIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users } = useData();

  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <DashboardShell role="admin" title="User Not Found">
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-700">User not found.</p>
          <button 
            onClick={() => navigate('/dashboard/admin/users')}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back to User List
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="admin" title={`User: ${user.name}`}>
      <div className="space-y-8">
        <div>
          <button 
            onClick={() => navigate('/dashboard/admin/users')}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to User List
          </button>
          <div className="flex items-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mr-6">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display italic">{user.name}</h1>
              <div className="flex items-center text-slate-500 font-medium">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Role" value={user.role} icon={UserCircleIcon} variant="white" />
          <StatCard label="Joined" value={format(new Date(user.createdAt), 'MMM dd, yyyy')} icon={CalendarIcon} variant="white" />
          <StatCard label="Status" value={user.isVerified ? 'Verified' : 'Not Verified'} icon={ShieldCheckIcon} variant="white" />
        </div>
        
        {/* Add more user details here as needed */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4">User Information</h2>
            <div className="space-y-4">
                <p><span className="font-bold">ID:</span> {user.id}</p>
                <p><span className="font-bold">Name:</span> {user.name}</p>
                <p><span className="font-bold">Email:</span> {user.email}</p>
                <p><span className="font-bold">Role:</span> {user.role}</p>
                <p><span className="font-bold">Joined:</span> {format(new Date(user.createdAt), 'PPPPpp')}</p>
                <p><span className="font-bold">Verified:</span> {user.isVerified ? 'Yes' : 'No'}</p>
                <p><span className="font-bold">Suspended:</span> {user.isSuspended ? 'Yes' : 'No'}</p>
                <p><span className="font-bold">Banned:</span> {user.isBanned ? 'Yes' : 'No'}</p>
            </div>
        </div>
      </div>
    </DashboardShell>
  );
}