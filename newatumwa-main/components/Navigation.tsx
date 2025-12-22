import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Map, MessageSquare, User, LogOut, CheckCircle, Menu, X, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../utils/cn';

const NavItem = ({ to, icon: Icon, label, isCollapsed }: { to: string; icon: any; label: string; isCollapsed?: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center py-3 rounded-xl transition-all font-semibold focus-ring',
        isCollapsed ? 'px-3 justify-center' : 'px-4 mx-2',
        isActive
          ? 'text-brand bg-brand-50 shadow-sm'
          : 'text-stone-600 hover:text-brand hover:bg-stone-50'
      )
    }
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!isCollapsed && <span className="text-sm ml-3">{label}</span>}
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
      <div className={cn(isCollapsed ? 'px-3' : 'px-6', 'mb-8 flex items-center justify-between')}>
        <div className="flex items-center">
          {!isCollapsed && (
            <>
              <img
                src="/atumwa-logo.jpeg"
                alt="Atumwa Logo"
                className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
              />
              <span className="text-heading-sm text-stone-900 font-black">Atumwa</span>
            </>
          )}
          {isCollapsed && (
            <img
              src="/atumwa-logo.jpeg"
              alt="Atumwa Logo"
              className="w-8 h-8 rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Collapse toggle button - only on desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-8 h-8 text-stone-500 hover:text-brand hover:bg-stone-50 rounded-lg transition-colors focus-ring"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {/* Close button only visible on mobile inside drawer */}
          <button onClick={closeMobileMenu} className="md:hidden text-stone-500 p-2 hover:bg-stone-100 rounded-lg focus-ring">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-1 overflow-y-auto flex-1" onClick={closeMobileMenu}>
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



      <div className="mt-auto border-t border-stone-200">
        {user && (
          <div className={cn(isCollapsed ? 'p-3' : 'p-4', 'space-y-3')}>
            {/* Theme Toggle */}
            {!isCollapsed && (
              <div className="px-2">
                <ThemeToggle />
              </div>
            )}

            {!isCollapsed && (
              <div className="flex items-center gap-3 px-2">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full shadow-sm border-2 border-white" />
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle size={14} className="text-brand fill-white" />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-caption text-stone-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => { logout(); closeMobileMenu(); }}
              className={cn(
                'w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-3 rounded-xl text-sm font-semibold transition-all focus-ring',
                isCollapsed ? 'px-2' : ''
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex flex-col bg-white border-r border-stone-200 h-screen sticky top-0 left-0 pt-6 shadow-lg z-30 overflow-y-auto scrollbar-hide transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64 lg:w-72 xl:w-80'}`}>
        <SidebarContent isCollapsed={isCollapsed} />
      </nav>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center min-w-0 flex-1">
          <img
            src="/atumwa-logo.jpeg"
            alt="Atumwa Logo"
            className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm flex-shrink-0"
          />
          <span className="text-heading-sm text-stone-900 font-black truncate">Atumwa</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg flex-shrink-0 cursor-pointer focus-ring">
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
