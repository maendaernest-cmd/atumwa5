import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Twitter, Chrome, Gamepad2, ArrowRight, ShoppingBag, Briefcase, ShieldCheck } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'atumwa'>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup logic: Clients are instant, Messengers are pending
    if (role === 'client') {
      login('client');
      navigate('/');
    } else {
      // For messengers, we simulate a 'pending' state by logging in as unverified
      login('atumwa', true);
      navigate('/login'); // Redirect to login which will show pending message
    }
  };

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
            Create your account
          </h1>
          <p className="text-stone-500 mb-8 font-medium">Join the logistics revolution in Zimbabwe.</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'client' ? 'border-brand-600 bg-brand-50/50 shadow-lg shadow-brand-100' : 'border-stone-100 hover:border-stone-200'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'client' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                <ShoppingBag size={20} />
              </div>
              <span className={`font-bold text-sm ${role === 'client' ? 'text-brand-900' : 'text-stone-500'}`}>I want to Send</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('atumwa')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'atumwa' ? 'border-brand-600 bg-brand-50/50 shadow-lg shadow-brand-100' : 'border-stone-100 hover:border-stone-200'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'atumwa' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                <Briefcase size={20} />
              </div>
              <span className={`font-bold text-sm ${role === 'atumwa' ? 'text-brand-900' : 'text-stone-500'}`}>I want to Earn</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium pr-14"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[38px] text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {role === 'atumwa' && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Messengers require admin review before they can start taking jobs. This usually takes less than 24 hours.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-200 active:scale-[0.98]"
            >
              {role === 'client' ? 'Start Posting Errands' : 'Start Delivering & Earning'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-stone-100"></div>
            <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Or continue with</span>
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

          <p className="text-center mt-8 text-stone-500 text-sm font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-brand-600 font-black hover:text-brand-700 transition-colors underline underline-offset-4">
              Login here
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
              Join Atumwa
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
