import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Twitter, Chrome, Gamepad2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Determine role based on email
    let role: 'client' | 'atumwa' | 'admin' = 'client';
    if (formData.email === 'client@atumwa.com') {
      role = 'client';
  } else if (formData.email === 'runner@atumwa.com') {
    role = 'atumwa';
    } else if (formData.email === 'admin@atumwa.com') {
      role = 'admin';
    }
    // For demo purposes, login with determined role
    login(role);
    navigate('/');
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
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="font-bold text-2xl tracking-tight text-stone-900">Atumwa</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4 leading-tight">
            Welcome back to your journey.
          </h1>

          <p className="text-stone-600 mb-8 leading-relaxed">
            Continue connecting with reliable messengers and getting things done across Harare.
          </p>

          {/* Social Login */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
              <Twitter size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-700">Twitter</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
              <Chrome size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-700">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
              <Gamepad2 size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-700">Twitch</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-stone-200"></div>
            <span className="text-sm text-stone-500 font-medium">Or</span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group"
            >
              Continue Journey
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-stone-600">
            New to Atumwa?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Sign up now!
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
              Join Now
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
