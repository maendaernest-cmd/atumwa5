import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Activity,
  Plus,
  TrendingUp,
  FileText,
  Target,
  ChevronDown
} from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../utils/cn';

const NavItem = ({ to, icon: Icon, label, isCollapsed, badge, ...props }: { to: string; icon: any; label: string; isCollapsed?: boolean; badge?: number; [key: string]: any }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center py-3 rounded-xl transition-all font-semibold focus-ring relative',
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
    {badge && badge > 0 && (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {badge > 99 ? '99+' : badge}
      </div>
    )}
  </NavLink>
);

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    messages: 3,
    gigs: 2,
    alerts: 1
  });

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

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
        { to: '/dashboard/admin', icon: Shield, label: '👑 Admin Dashboard', badge: undefined },
        { to: '/dashboard/admin/users', icon: Users, label: '👥 User Control', badge: undefined },
        { to: '/dashboard/admin/transactions', icon: DollarSign, label: '💰 Revenue Center', badge: undefined },
        { to: '/admin?tab=analytics', icon: BarChart3, label: '📊 Platform Analytics', badge: undefined },
        { to: '/admin?tab=fleet', icon: Truck, label: '🚛 Fleet Command', badge: undefined },
        { to: '/admin?tab=moderation', icon: AlertTriangle, label: '⚖️ Dispute Court', badge: undefined },
        { to: '/admin?tab=messaging', icon: Megaphone, label: '📢 Broadcast Center', badge: undefined },
        { to: '/admin?tab=support', icon: HelpCircle, label: '🆘 Support Hub', badge: undefined },
        { to: '/admin?tab=audit', icon: RefreshCcw, label: '📋 Audit Trail', badge: undefined },
        { to: '/admin?tab=settings', icon: Settings, label: '⚙️ System Settings', badge: undefined }
      ],
      client: [
        { to: '/dashboard/client', icon: LayoutDashboard, label: '🏠 Dashboard', badge: undefined },
        { to: '/dashboard/client/gigs', icon: Package, label: '📦 My Errands', badge: notifications.gigs },
        { to: '/dashboard/client/gigs/new', icon: Briefcase, label: '💼 Post New Gig', badge: undefined },
        { to: '/dashboard/client/map', icon: MapPin, label: '🗺️ Track Deliveries', badge: undefined },
        { to: '/dashboard/client/messages', icon: MessageSquare, label: '💬 Messages', badge: notifications.messages },
        { to: '/dashboard/client/profile', icon: User, label: '👤 Profile', badge: undefined }
      ],
      atumwa: [
        { to: '/dashboard/worker', icon: LayoutDashboard, label: '📊 Overview', badge: undefined },
        { to: '/dashboard/worker/active', icon: Truck, label: '🚛 Active Tasks', badge: undefined },
        { to: '/dashboard/worker/find', icon: Briefcase, label: '📋 Available Jobs', badge: undefined },
        { to: '/dashboard/worker/earnings', icon: Wallet, label: '💰 Earnings', badge: undefined }
      ],
      support: [
        { to: '/dashboard/support', icon: LayoutDashboard, label: '📊 Overview', badge: undefined },
        { to: '/dashboard/support/tickets', icon: List, label: '🎫 Support Queue', badge: undefined },
        { to: '/dashboard/support/chat', icon: MessageSquare, label: '💬 Live Chat', badge: undefined }
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
        {/* Search Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-stone-500 hover:text-brand hover:bg-stone-50 rounded-lg transition-colors focus-ring"
            title="Search (Ctrl+K)"
          >
            <Search size={18} />
          </button>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-center pt-20 px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Search className="h-6 w-6 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search gigs, messages, profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg font-medium bg-transparent border-none outline-none placeholder:text-stone-400"
                  autoFocus
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-4">
                {searchQuery && (
                  <div className="text-sm text-stone-500 font-medium">
                    Search results for "{searchQuery}"
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Quick Actions</div>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="flex items-center gap-3 p-3 text-left hover:bg-stone-50 rounded-xl transition-colors">
                      <PlusIcon className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Post New Gig</span>
                      <span className="text-xs text-stone-400 ml-auto">Ctrl+N</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 text-left hover:bg-stone-50 rounded-xl transition-colors">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <span className="font-medium">New Message</span>
                      <span className="text-xs text-stone-400 ml-auto">Ctrl+M</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 text-left hover:bg-stone-50 rounded-xl transition-colors">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Track Deliveries</span>
                      <span className="text-xs text-stone-400 ml-auto">Ctrl+T</span>
                    </button>
                  </div>
                </div>

                {/* Recent Searches */}
                {!searchQuery && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Recent Searches</div>
                    <div className="space-y-1">
                      <button className="flex items-center gap-3 p-2 text-left hover:bg-stone-50 rounded-lg transition-colors w-full">
                        <Search className="h-4 w-4 text-stone-400" />
                        <span className="text-sm">grocery delivery</span>
                      </button>
                      <button className="flex items-center gap-3 p-2 text-left hover:bg-stone-50 rounded-lg transition-colors w-full">
                        <Search className="h-4 w-4 text-stone-400" />
                        <span className="text-sm">pharmacy pickup</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

  // Get bottom tab items for mobile (5 main items)
  const getBottomTabItems = (role?: string) => {
    const commonTabs = [
      {
        to: role === 'admin' ? '/dashboard/admin' : role === 'client' ? '/dashboard/client' : role === 'atumwa' ? '/dashboard/worker' : role === 'support' ? '/dashboard/support' : '/',
        icon: Home,
        label: 'Home',
        primary: true,
        badge: undefined
      }
    ];

    const roleTabs = {
      client: [
        { to: '/dashboard/client/gigs/new', icon: Plus, label: 'Post', primary: true, badge: undefined },
        { to: '/dashboard/client/map', icon: MapPin, label: 'Track', primary: false, badge: undefined },
        { to: '/dashboard/client/messages', icon: MessageSquare, label: 'Chat', primary: false, badge: notifications.messages }
      ],
      atumwa: [
        { to: '/dashboard/worker/find', icon: Briefcase, label: 'Jobs', primary: true, badge: undefined },
        { to: '/dashboard/worker/active', icon: Truck, label: 'Active', primary: false, badge: undefined },
        { to: '/dashboard/worker/messages', icon: MessageSquare, label: 'Chat', primary: false, badge: notifications.messages }
      ],
      admin: [
        { to: '/dashboard/admin/users', icon: Users, label: 'Users', primary: true, badge: undefined },
        { to: '/dashboard/admin/transactions', icon: DollarSign, label: 'Revenue', primary: false, badge: undefined },
        { to: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics', primary: false, badge: undefined }
      ],
      support: [
        { to: '/dashboard/support/tickets', icon: List, label: 'Tickets', primary: true, badge: undefined },
        { to: '/dashboard/support/chat', icon: MessageSquare, label: 'Chat', primary: false, badge: undefined },
        { to: '/dashboard/support/knowledge', icon: FileText, label: 'Help', primary: false, badge: undefined }
      ]
    };

    return [...commonTabs, ...(roleTabs[role as keyof typeof roleTabs] || [])];
  };

  const bottomTabItems = getBottomTabItems(user?.role);

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 z-50 shadow-sm">
          <div className="flex items-center min-w-0 flex-1">
            <img
              src="/atumwa-logo.jpeg"
              alt="Atumwa Logo"
              className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm flex-shrink-0"
            />
            <span className="text-heading-sm text-stone-900 font-black truncate">Atumwa</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="relative"
            >
              <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
          <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
            {bottomTabItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all relative min-w-0 flex-1',
                    isActive
                      ? 'text-brand bg-brand-50'
                      : 'text-stone-600'
                  )
                }
              >
                <div className="relative">
                  <item.icon className={cn('h-6 w-6', item.primary ? 'mb-1' : '')} />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {item.badge > 9 ? '9+' : item.badge}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex items-start justify-center pt-20 px-4">
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Search className="h-6 w-6 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-lg font-medium bg-transparent border-none outline-none placeholder:text-stone-400"
                    autoFocus
                  />
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Quick Actions</div>
                  <div className="grid grid-cols-1 gap-2">
                    {user?.role === 'client' && (
                      <button
                        onClick={() => { navigate('/dashboard/client/gigs/new'); setIsSearchOpen(false); }}
                        className="flex items-center gap-3 p-3 text-left hover:bg-stone-50 rounded-xl transition-colors"
                      >
                        <PlusIcon className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Post New Gig</span>
                      </button>
                    )}
                    <button
                      onClick={() => { navigate('/messages'); setIsSearchOpen(false); }}
                      className="flex items-center gap-3 p-3 text-left hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Messages</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Top Navigation Bar
  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-stone-200 h-16 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6 max-w-screen-2xl mx-auto">
          {/* Left Section - Logo & Search */}
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-3">
              <img
                src="/atumwa-logo.jpeg"
                alt="Atumwa Logo"
                className="w-10 h-10 rounded-lg object-cover shadow-sm"
              />
              <span className="text-xl text-stone-900 font-black">Atumwa</span>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search gigs, messages, profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                onFocus={() => setIsSearchOpen(true)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Center Section - Main Navigation */}
          <div className="flex items-center gap-1">
            {roleNavigation.slice(0, 5).map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative',
                    isActive
                      ? 'text-brand bg-brand-50'
                      : 'text-stone-600 hover:text-brand hover:bg-stone-50'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label.split(' ')[0]}</span>
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Section - Profile & Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              {notifications.alerts > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notifications.alerts}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3">
              {user?.role && (
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
              <div className="relative">
                <button className="flex items-center gap-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <ChevronDown className="h-4 w-4 text-stone-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal for Desktop */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-center pt-24 px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Search className="h-8 w-8 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search gigs, messages, profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-2xl font-medium bg-transparent border-none outline-none placeholder:text-stone-400"
                  autoFocus
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-6">
                {searchQuery && (
                  <div className="text-sm text-stone-500 font-medium">
                    Search results for "{searchQuery}"
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">Quick Actions</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.role === 'client' && (
                      <button
                        onClick={() => { navigate('/dashboard/client/gigs/new'); setIsSearchOpen(false); }}
                        className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                      >
                        <PlusIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-bold text-blue-900">Post New Gig</p>
                          <p className="text-sm text-blue-700">Create a new delivery request</p>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => { navigate('/messages'); setIsSearchOpen(false); }}
                      className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
                    >
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-bold text-green-900">Messages</p>
                        <p className="text-sm text-green-700">Chat with messengers</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
