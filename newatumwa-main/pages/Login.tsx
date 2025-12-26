import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Chrome, ArrowRight, AlertCircle, Loader, Fingerprint, Shield } from 'lucide-react';
import { AuthCredentials } from '../types';

export const Login: React.FC = () => {
  const { login, loading, error, loginAsTestUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <img
            src="/atumwa-logo.jpeg"
            alt="Atumwa Logo"
            className="w-8 h-8 rounded"
          />
          <Link
            to="/signup"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Join now
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 text-sm mb-8">Stay updated on your professional world</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-red-900">{error.message}</p>
              </div>
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Chrome size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or phone
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email or phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Demo Access */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Demo Access</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => loginAsTestUser('client')}
                className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">Client Demo</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Try</span>
              </button>
              <button
                onClick={() => loginAsTestUser('atumwa')}
                className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">Messenger Demo</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Try</span>
              </button>
              <button
                onClick={() => loginAsTestUser('admin')}
                className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">Admin Demo</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Try</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <span className="text-gray-600 text-sm">New to Atumwa? </span>
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Join now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
