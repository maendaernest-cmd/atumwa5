import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Twitter, Chrome, ArrowRight, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { AuthCredentials } from '../types';

export const Login: React.FC = () => {
  const { user, login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  // Redirection Logic
  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'atumwa' && !user.isVerified) {
        // Show pending approval message (stays on login page)
      } else if ((user.role === 'atumwa' && user.isVerified) || user.role === 'client') {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  // If user is logged in as an unverified messenger, show pending UI
  if (user && user.role === 'atumwa' && !user.isVerified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 mb-6 mx-auto relative z-10">
              <Clock size={48} className="animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-20 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">Hang tight, {user.name}!</h1>
            <p className="text-stone-500 font-medium leading-relaxed">
              Our admins are currently reviewing your profile to ensure safety and quality for all users.
              You'll receive an email as soon as you're approved to start earning.
            </p>
          </div>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle size={18} />
              </div>
              <span className="text-sm font-bold text-stone-700">Identity details received</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-sm font-bold text-stone-700">Background check in progress</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95"
          >
            Check Status
          </button>
          <button
            onClick={() => { localStorage.removeItem('atumwa_user'); window.location.href = '/login'; }}
            className="text-stone-400 font-bold text-sm hover:text-stone-600 transition-colors"
          >
            Log out and try another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/atumwa-logo.jpeg"
              alt="Atumwa Logo"
              className="w-12 h-12 rounded-2xl object-cover shadow-sm"
            />
            <span className="font-bold text-2xl tracking-tight text-stone-900 italic">Atumwa</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-stone-900 mb-2 leading-tight">
            Welcome back
          </h1>
          <p className="text-stone-500 mb-8 font-medium">Continue your journey with the family.</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900">{error.message}</p>
                {error.code === 'ACCOUNT_LOCKED' && (
                  <p className="text-xs text-red-700 mt-1">Too many login attempts. Please try again later.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between items-center pr-1">
                <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-700">Forgot?</Link>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium pr-14 disabled:opacity-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-5 top-[42px] text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-200 active:scale-[0.98] disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Access Errands Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-stone-100"></div>
            <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Or login with</span>
            <div className="flex-1 h-px bg-stone-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all font-bold text-sm text-stone-700">
              <Chrome size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-4 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all font-bold text-sm text-stone-700">
              <Twitter size={18} /> Twitter
            </button>
          </div>

            {/* Demo Credentials Hint */}
            <div className="mt-6 p-4 bg-brand-50/50 border border-brand-100 rounded-2xl">
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2">Test Credentials</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-600">Client: client@atumwa.com</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-brand-200 text-brand-600 font-bold">PW: any</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-600">Runner: runner@atumwa.com</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-brand-200 text-brand-600 font-bold">PW: any</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-600">Admin: admin@atumwa.com</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-brand-200 text-brand-600 font-bold">PW: any</span>
                </div>
              </div>
            </div>

            <p className="text-center mt-8 text-stone-500 text-sm font-medium">
            New to Atumwa?{' '}
            <Link to="/signup" className="text-brand-600 font-black hover:text-brand-700 transition-colors underline underline-offset-4">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Floating Card */}
        <div className="absolute top-12 right-12 bg-white rounded-2xl p-6 shadow-2xl max-w-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-black text-stone-900">+89%</span>
            <button className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors">
              Get Started
            </button>
          </div>
          <p className="text-stone-600 text-sm">
            Positive respond from people.
          </p>
        </div>

        {/* Center Message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">
              We are a Family.
            </h2>
            <p className="text-lg lg:text-xl text-white/90 max-w-md leading-relaxed">
              Join our community of messengers and clients building something special together. Every delivery strengthens our bonds.
            </p>
          </div>
        </div>

        {/* Tags/Badges */}
        <div className="absolute bottom-12 left-12 flex flex-wrap gap-3">
          <span className="bg-orange-500/20 text-white border border-orange-400/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            #Atumwa_Life
          </span>
          <span className="bg-green-500/20 text-white border border-green-400/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            #Harare_Hustle
          </span>
          <span className="bg-blue-500/20 text-white border border-blue-400/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            #Get_It_Done
          </span>
          <span className="bg-pink-500/20 text-white border border-pink-400/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            #Be_Happy
          </span>
        </div>
      </div>
    </div>
  );
};
