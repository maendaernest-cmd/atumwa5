import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Map, 
  MessageSquare, 
  User, 
  Users, 
  LogOut, 
  CheckCircle, 
  Menu, 
  X, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Truck, 
  Settings, 
  BarChart3, 
  Shield, 
  Wallet, 
  Star, 
  MapPin, 
  Phone, 
  Bell, 
  CreditCard, 
  AlertTriangle, 
  Megaphone, 
  HelpCircle, 
  DollarSign, 
  RefreshCcw,
  List,
  Search,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../utils/cn';

const NavItem = ({ to, icon: Icon, label, isCollapsed, ...props }: { to: string; icon: any; label: string; isCollapsed?: boolean; [key: string]: any }) => (
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

  // Role-specific navigation configuration
  const getNavigationItems = (role?: string) => {
    const baseNavigation = {
      home: {
        to: role === 'admin' ? '/dashboard/admin' : role === 'client' ? '/dashboard/client' : role === 'atumwa' ? '/dashboard/worker' : role === 'support' ? '/dashboard/support' : '/',
        icon: Home,
        label: role === 'admin' ? '👑 Admin Dashboard' : role === 'client' ? '📦 Client Dashboard' : role === 'atumwa' ? '🚴 Messenger Dashboard' : role === 'support' ? '🆘 Support Dashboard' : '🏠 Home'
      }
    };

    const roleNavigation = {
      admin: [
        { to: '/dashboard/admin', icon: Shield, label: '👑 Admin Dashboard' },
        { to: '/dashboard/admin/users', icon: Users, label: '👥 User Control' },
        { to: '/dashboard/admin/transactions', icon: DollarSign, label: '💰 Revenue Center' },
        { to: '/admin?tab=analytics', icon: BarChart3, label: '📊 Platform Analytics' },
        { to: '/admin?tab=fleet', icon: Truck, label: '🚛 Fleet Command' },
        { to: '/admin?tab=moderation', icon: AlertTriangle, label: '⚖️ Dispute Court' },
        { to: '/admin?tab=messaging', icon: Megaphone, label: '📢 Broadcast Center' },
        { to: '/admin?tab=support', icon: HelpCircle, label: '🆘 Support Hub' },
        { to: '/admin?tab=audit', icon: RefreshCcw, label: '📋 Audit Trail' },
        { to: '/admin?tab=settings', icon: Settings, label: '⚙️ System Settings' }
      ],
      client: [
        { to: '/dashboard/client', icon: LayoutDashboard, label: '📊 Overview' },
        { to: '/dashboard/client/gigs', icon: Package, label: '📦 My Errands' },
        { to: '/dashboard/client/gigs/new', icon: Briefcase, label: '💼 Post New Gig' },
        { to: '/dashboard/client/map', icon: MapPin, label: '🗺️ Track Deliveries' },
        { to: '/dashboard/client/messages', icon: MessageSquare, label: '💬 Messages' },
        { to: '/dashboard/client/profile', icon: User, label: '👤 Profile' }
      ],
      atumwa: [
        { to: '/dashboard/worker', icon: LayoutDashboard, label: '📊 Overview' },
        { to: '/dashboard/worker/active', icon: Truck, label: '🚛 Active Tasks' },
        { to: '/dashboard/worker/find', icon: Briefcase, label: '📋 Available Jobs' },
        { to: '/dashboard/worker/earnings', icon: Wallet, label: '💰 Earnings' }
      ],
      support: [
        { to: '/dashboard/support', icon: LayoutDashboard, label: '📊 Overview' },
        { to: '/dashboard/support/tickets', icon: List, label: '🎫 Support Queue' },
        { to: '/dashboard/support/chat', icon: MessageSquare, label: '💬 Live Chat' }
      ]
    };

    return { baseNavigation, roleNavigation: roleNavigation[role as keyof typeof roleNavigation] || [] };
  };

  const { baseNavigation, roleNavigation } = getNavigationItems(user?.role);

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
          {/* Role indicator badge */}
          {user?.role && !isCollapsed && (
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-bold uppercase',
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
              user.role === 'client' ? 'bg-blue-100 text-blue-700' :
              user.role === 'support' ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            )}>
              {user.role}
            </div>
          )}
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
        {/* Dynamic Home/Dashboard link */}
        <NavItem
          to={baseNavigation.home.to}
          icon={baseNavigation.home.icon}
          label={isCollapsed ? baseNavigation.home.label.split(' ')[0] : baseNavigation.home.label}
          isCollapsed={isCollapsed}
        />

        {/* Role-specific navigation items */}
        {roleNavigation.map((item, index) => (
          <NavItem
            to={item.to}
            icon={item.icon}
            label={isCollapsed ? item.label.split(' ')[0] : item.label}
            isCollapsed={isCollapsed}
            key={index}
          />
        ))}

        {/* Common items for all logged-in users */}
        {user && (
          <>
            <NavItem
              to="/profile"
              icon={User}
              label={isCollapsed ? "👤" : "👤 Profile & Settings"}
              isCollapsed={isCollapsed}
            />
          </>
        )}
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
