import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Skeleton } from './components/Skeleton';
import { GlobalSocketListener } from './components/GlobalSocketListener';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import 'leaflet/dist/leaflet.css';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Gigs = lazy(() => import('./pages/Gigs').then(module => ({ default: module.Gigs })));
const MapPage = lazy(() => import('./pages/MapPage').then(module => ({ default: module.MapPage })));
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Landing = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const SignUp = lazy(() => import('./pages/SignUp').then(module => ({ default: module.SignUp })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(module => ({ default: module.VerifyEmail })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const MessengerDashboard = lazy(() => import('./pages/MessengerDashboard').then(module => ({ default: module.MessengerDashboard })));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard').then(module => ({ default: module.ClientDashboard })));

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    if (justLoggedIn) {
      setShowGreeting(true);
      sessionStorage.removeItem('just_logged_in');
    }
  }, []);

  // Handle Messengers pending approval
  if (user && user.role === 'atumwa' && !user.isVerified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 mb-6 mx-auto relative z-10">
              <Clock size={48} className="animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-20 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight uppercase italic">Atumwa Pending</h1>
            <p className="text-stone-500 font-medium leading-relaxed">
              Hello <span className="text-stone-900 font-bold">{user.name}</span>! Our administrators are currently reviewing your messenger profile.
              This is to ensure safety for our entire community.
            </p>
          </div>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle size={18} />
              </div>
              <span className="text-sm font-bold text-stone-700 font-sans">Identity details received</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-sm font-bold text-stone-700 font-sans">Background review in progress</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95 uppercase tracking-widest"
          >
            Check Status
          </button>
          <button
            onClick={() => { localStorage.removeItem('atumwa_user'); window.location.href = '/login'; }}
            className="text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-600 transition-colors"
          >
            Switch Account
          </button>
        </div>
      </div>
    );
  }

  if (user) {
    return (

      <div className="flex min-h-screen bg-slate-50 relative flex-col md:flex-row font-sans">
        {/* Mesh Gradient Background */}
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{
          backgroundImage: `
                radial-gradient(at 0% 0%, hsla(153, 96%, 89%, 1) 0px, transparent 50%),
                radial-gradient(at 100% 0%, hsla(240, 100%, 94%, 1) 0px, transparent 50%),
                radial-gradient(at 100% 100%, hsla(153, 96%, 89%, 1) 0px, transparent 50%),
                radial-gradient(at 0% 100%, hsla(240, 100%, 94%, 1) 0px, transparent 50%)
            `
        }}></div>

        {/* Global WebSocket Simulation for Chat and Admin Broadcasts */}
        <GlobalSocketListener />

        <div className="z-40 relative flex-shrink-0">
          <Navigation />
        </div>

        {/*
            Mobile: pt-20 (80px) to clear the fixed h-16 (64px) header + spacing.
            Desktop: pt-6, md:px-8.
        */}
        <main className="flex-1 w-full md:px-8 py-6 px-4 pt-20 md:pt-6 overflow-x-hidden z-10 relative max-w-screen-2xl mx-auto">
          {/* Dashboard Header & Greetings */}
          {/* Floating Greeting Pop-up */}
          {showGreeting && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg pointer-events-none">
              <div className="bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-3xl p-6 animate-fade-out ring-1 ring-black/5" style={{ animationDelay: '3000ms' }}>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return "Good morning";
                      if (hour < 18) return "Good afternoon";
                      return "Good evening";
                    })()},
                    <span className="text-brand-600 italic underline decoration-brand-200 decoration-4 underline-offset-4">{user.name.split(' ')[0]}!</span>
                  </h2>

                  <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                    {user.role === 'admin'
                      ? "Welcome back! System metrics look healthy. Hope you find what you are looking for."
                      : user.role === 'atumwa'
                        ? "Welcome back! Ready to earn? Hope you find what you are looking for today."
                        : "Welcome back! Need help with an errand? Hope you find what you are looking for."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!user.isVerified && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              <span className="font-semibold">
                Verify your Atumwa account to unlock all features.
              </span>
              <span className="hidden sm:inline">
                {user.role === 'client'
                  ? 'Confirm your email from the Profile page to post and manage gigs safely.'
                  : 'Upload your ID in Profile to start accepting and completing gigs.'}
              </span>
            </div>
          )}

          <ErrorBoundary>
            <Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              </div>
            }>
              <Routes>
                <Route
                  path="/"
                  element={
                    user.role === 'admin' ? <Navigate to="/admin" replace /> :
                      user.role === 'atumwa' ? <Gigs /> :
                        <Home />
                  }
                />
                <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={
                  user.role === 'atumwa' ? <MessengerDashboard /> :
                    user.role === 'client' ? <ClientDashboard /> :
                      <Navigate to="/" />
                } />
                <Route path="/gigs" element={<Gigs />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Skeleton variant="circular" width={80} height={80} className="mx-auto mb-4" />
          <Skeleton width={200} height={24} className="mx-auto" />
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthenticatedApp />
          </ToastProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}
