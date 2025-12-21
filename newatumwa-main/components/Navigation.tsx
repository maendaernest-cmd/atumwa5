import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Map, MessageSquare, User, LogOut, CheckCircle, Menu, X, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

const NavItem = ({ to, icon: Icon, label, isCollapsed }: { to: string; icon: any; label: string; isCollapsed?: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center ${isCollapsed ? 'px-3 justify-center' : 'px-4 mx-2'} py-3 rounded-lg transition-colors font-medium ${isActive
        ? 'text-brand-600 bg-brand-50'
        : 'text-slate-500 hover:text-brand-600 hover:bg-slate-50'
      }`
    }
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-5 h-5" />
    {!isCollapsed && <span className="text-base ml-3">{label}</span>}
  </NavLink>
);

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const SidebarContent = ({ isCollapsed }: { isCollapsed?: boolean }) => (
    <>
      <div className={`${isCollapsed ? 'px-3' : 'px-6'} mb-8 flex items-center justify-between`}>
        <div className="flex items-center">
          {!isCollapsed && (
            <>
              <img
                src="/atumwa-logo.jpeg"
                alt="Atumwa Logo"
                className="w-10 h-10 rounded-md object-cover mr-2"
              />
              <span className="text-2xl font-bold text-slate-800 tracking-tight">Atumwa</span>
            </>
          )}
          {isCollapsed && (
            <img
              src="/atumwa-logo.jpeg"
              alt="Atumwa Logo"
              className="w-8 h-8 rounded-md object-cover"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Collapse toggle button - only on desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {/* Close button only visible on mobile inside drawer */}
          <button onClick={closeMobileMenu} className="md:hidden text-slate-500 p-1 hover:bg-slate-100 rounded-full">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-1" onClick={closeMobileMenu}>
        <NavItem to="/" icon={Home} label="Home" isCollapsed={isCollapsed} />
        {user?.role === 'admin' && (
          <NavItem to="/admin" icon={LayoutDashboard} label="Admin" isCollapsed={isCollapsed} />
        )}
        {(user?.role === 'atumwa' || user?.role === 'client') && (
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
        )}
        <NavItem to="/gigs" icon={Briefcase} label={user?.role === 'client' ? "My Gigs" : "Gigs"} isCollapsed={isCollapsed} />
        <NavItem to="/map" icon={Map} label="Map" isCollapsed={isCollapsed} />
        <NavItem to="/messages" icon={MessageSquare} label="Messages" isCollapsed={isCollapsed} />
        <NavItem to="/profile" icon={User} label="Profile" isCollapsed={isCollapsed} />
      </div>



      <div className="mt-auto border-t border-slate-100 dark:border-slate-700">
        {user && (
          <div className={`${isCollapsed ? 'p-3' : 'p-4'}`}>
            {/* Theme Toggle */}
            {!isCollapsed && (
              <div className="mb-3 px-2">
                <ThemeToggle />
              </div>
            )}

            {!isCollapsed && (
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                      <CheckCircle size={12} className="text-blue-500 fill-white dark:fill-slate-800" />
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
            )}
            <button
              onClick={() => { logout(); closeMobileMenu(); }}
              className={`w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-colors ${isCollapsed ? 'px-2' : ''}`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 left-0 pt-6 shadow-sm z-30 overflow-y-auto scrollbar-hide transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64 lg:w-72 xl:w-80'}`}>
        <SidebarContent isCollapsed={isCollapsed} />
      </nav>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center min-w-0 flex-1">
          <img
            src="/atumwa-logo.jpeg"
            alt="Atumwa Logo"
            className="w-10 h-10 rounded-md object-cover mr-2 flex-shrink-0"
          />
          <span className="text-xl font-bold text-slate-800 truncate">Atumwa</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex-shrink-0 cursor-pointer">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] md:hidden animate-in fade-in duration-200 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-[100] pt-6 transform transition-transform duration-300 md:hidden flex flex-col overflow-y-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>
    </>
  );
};
