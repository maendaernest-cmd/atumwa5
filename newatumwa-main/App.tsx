import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Gigs } from './pages/Gigs';
import { MapPage } from './pages/MapPage';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AdminDashboard } from './pages/AdminDashboard';
import { MessengerDashboard } from './pages/MessengerDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { GlobalSocketListener } from './components/GlobalSocketListener';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const AuthenticatedApp = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row">
        {/* Global WebSocket Simulation for Chat and Admin Broadcasts */}
        <GlobalSocketListener />

        <Navigation />

        {/*
            Mobile: pt-20 (80px) to clear the fixed h-16 (64px) header + spacing.
            Desktop: pt-6, md:px-8.
        */}
        <main className="flex-1 max-w-7xl mx-auto w-full md:px-8 py-6 px-4 pt-20 md:pt-6 overflow-x-hidden">
          {/* Global role + verification banner */}
          <div className="mb-4 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold w-fit">
              <span className="uppercase tracking-wide text-[10px] text-slate-300">You are using</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 capitalize">
                {user.role === 'atumwa' ? 'Atumwa Messenger' : user.role}
              </span>
            </div>
            {!user.isVerified && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
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
          </div>

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
        </main>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthenticatedApp />
      </ToastProvider>
    </AuthProvider>
  );
}
