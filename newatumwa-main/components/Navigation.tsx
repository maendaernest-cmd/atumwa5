import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Map, MessageSquare, User, LogOut, CheckCircle, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors font-medium ${
        isActive
          ? 'text-brand-600 bg-brand-50'
          : 'text-slate-500 hover:text-brand-600 hover:bg-slate-50'
      }`
    }
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="text-base">{label}</span>
  </NavLink>
);

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const SidebarContent = () => (
    <>
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center">
             <img
               src="/atumwa-logo.jpeg"
               alt="Atumwa Logo"
               className="w-10 h-10 rounded-md object-cover mr-2"
             />
             <span className="text-2xl font-bold text-slate-800 tracking-tight">Atumwa</span>
          </div>
          {/* Close button only visible on mobile inside drawer */}
          <button onClick={closeMobileMenu} className="md:hidden text-slate-500 p-1 hover:bg-slate-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col space-y-1" onClick={closeMobileMenu}>
          <NavItem to="/" icon={Home} label="Home" />
          {user?.role === 'admin' && (
             <NavItem to="/admin" icon={LayoutDashboard} label="Admin" />
          )}
          {(user?.role === 'atumwa' || user?.role === 'client') && (
             <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}
          <NavItem to="/gigs" icon={Briefcase} label={user?.role === 'client' ? "My Gigs" : "Gigs"} />
          <NavItem to="/map" icon={Map} label="Map" />
          <NavItem to="/messages" icon={MessageSquare} label="Messages" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </div>

        {/* Dummy messaging + Atumwa network snapshot for nav */}
        <div className="mt-4 mx-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Today on Atumwa</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">New messages</span>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold">
                3 chats
              </span>
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• Sarah (sender) → “Pharmacy pickup in Avondale?”</li>
              <li>• Tinashe (Atumwa) → “On my way to CBD.”</li>
              <li>• Mai Dube (sender) → “Groceries for Mbare.”</li>
            </ul>
            <div className="mt-2 border-t border-slate-200 pt-2 flex items-center justify-between">
              <span className="text-slate-500">Atumwas online (demo)</span>
              <span className="text-[11px] font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                18 nearby
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-100">
           {user && (
             <div className="p-4">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                        <CheckCircle size={12} className="text-blue-500 fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 truncate flex items-center gap-1">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
             </div>
           )}
        </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 left-0 pt-6 shadow-sm z-30">
        <SidebarContent />
      </nav>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-40 shadow-sm">
         <div className="flex items-center min-w-0 flex-1">
            <img
               src="/atumwa-logo.jpeg"
               alt="Atumwa Logo"
               className="w-10 h-10 rounded-md object-cover mr-2 flex-shrink-0"
            />
            <span className="text-xl font-bold text-slate-800 truncate">Atumwa</span>
         </div>
         <button onClick={toggleMobileMenu} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex-shrink-0">
            <Menu size={24} />
         </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in duration-200 backdrop-blur-sm"
            onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 pt-6 transform transition-transform duration-300 md:hidden flex flex-col overflow-y-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <SidebarContent />
      </div>
    </>
  );
};
