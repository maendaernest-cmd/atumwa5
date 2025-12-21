import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { isValidEmail } from '../utils/authUtils';

type ForgotPasswordStep = 'request' | 'sent' | 'reset';

export const ForgotPassword: React.FC = () => {
  const { requestPasswordReset, resetPassword, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetToken = searchParams.get('token');

  // If token in URL, go directly to reset step
  React.useEffect(() => {
    if (resetToken) {
      setStep('reset');
    }
  }, [resetToken]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return;
    }

    await requestPasswordReset(email);
    setStep('sent');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    await resetPassword(resetToken, newPassword);
    
    // On success, redirect to login
    if (!error) {
      setTimeout(() => navigate('/login'), 2000);
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

          {/* Request Step */}
          {step === 'request' && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black text-stone-900 mb-2 leading-tight">
                Reset your password
              </h1>
              <p className="text-stone-500 mb-8 font-medium">
                Enter your email and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-bold text-red-900">{error.message}</p>
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium disabled:opacity-50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-200 active:scale-[0.98] disabled:active:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-8 text-stone-500 text-sm font-medium">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-600 font-black hover:text-brand-700 transition-colors underline underline-offset-4">
                  Login here
                </Link>
              </p>
            </>
          )}

          {/* Sent Step */}
          {step === 'sent' && (
            <>
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mb-6 mx-auto relative z-10">
                    <Mail size={48} />
                  </div>
                  <div className="absolute inset-0 bg-green-200 blur-2xl opacity-20"></div>
                </div>

                <div>
                  <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
                    Check your email
                  </h1>
                  <p className="text-stone-500 font-medium leading-relaxed mb-2">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-brand-600 font-bold text-lg">{email}</p>
                </div>

                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-left space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-bold text-stone-700">Check your inbox</p>
                      <p className="text-xs text-stone-500 mt-1">Look for an email from Atumwa with reset instructions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-bold text-stone-700">Click the link</p>
                      <p className="text-xs text-stone-500 mt-1">The link expires in 1 hour for security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-bold text-stone-700">Set new password</p>
                      <p className="text-xs text-stone-500 mt-1">Create a strong, unique password</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6">
                  <p className="text-stone-500 text-sm font-medium mb-4">
                    Didn't receive the email?
                  </p>
                  <button
                    onClick={() => {
                      setEmail('');
                      setStep('request');
                    }}
                    className="text-brand-600 font-black hover:text-brand-700 transition-colors"
                  >
                    Try another email address
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Reset Step */}
          {step === 'reset' && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black text-stone-900 mb-2 leading-tight">
                Create new password
              </h1>
              <p className="text-stone-500 mb-8 font-medium">
                Enter a strong password to secure your account.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-bold text-red-900">{error.message}</p>
                </div>
              )}

              {!error && !loading && newPassword && confirmPassword && newPassword === confirmPassword && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-bold text-green-900">Password reset successful! Redirecting to login...</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1 relative">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="space-y-1 relative">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium pr-14 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-5 top-[42px] text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {newPassword !== confirmPassword && confirmPassword && (
                  <p className="text-xs text-red-600 font-medium">Passwords do not match</p>
                )}

                <button
                  type="submit"
                  disabled={loading || newPassword !== confirmPassword || !newPassword}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-200 active:scale-[0.98] disabled:active:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">
              Password security matters
            </h2>
            <p className="text-lg lg:text-xl text-white/90 max-w-md leading-relaxed">
              We take your account security seriously. Your password is encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
