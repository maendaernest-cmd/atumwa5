import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';

type VerifyStep = 'verifying' | 'success' | 'error' | 'resend';

export const VerifyEmail: React.FC = () => {
  const { verifyEmail, resendVerificationEmail, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<VerifyStep>('verifying');
  const [email, setEmail] = useState('');
  const [resendEmail, setResendEmail] = useState('');

  const token = searchParams.get('token');

  // Verify email on mount if token present
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStep('error');
        return;
      }

      try {
        await verifyEmail(token);
        setStep('success');
      } catch (err) {
        setStep('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await resendVerificationEmail(resendEmail);
    if (!error) {
      setStep('resend');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Verifying */}
        {step === 'verifying' && (
          <>
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 mx-auto relative z-10">
                <Loader size={48} className="animate-spin" />
              </div>
              <div className="absolute inset-0 bg-blue-200 blur-2xl opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
                Verifying your email
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                We're confirming your email address. This should only take a moment.
              </p>
            </div>
          </>
        )}

        {/* Success */}
        {step === 'success' && (
          <>
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mb-6 mx-auto relative z-10">
                <CheckCircle size={48} />
              </div>
              <div className="absolute inset-0 bg-green-200 blur-2xl opacity-20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
                Email verified!
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                Your email has been successfully verified. You can now log in to your account.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-200 active:scale-[0.98]"
            >
              Continue to Login
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {/* Error */}
        {step === 'error' && (
          <>
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mb-6 mx-auto relative z-10">
                <AlertCircle size={48} />
              </div>
              <div className="absolute inset-0 bg-red-200 blur-2xl opacity-20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
                Verification failed
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed mb-4">
                {error?.message || 'The verification link is invalid or has expired.'}
              </p>
              <p className="text-stone-500 font-medium leading-relaxed">
                Request a new verification email below.
              </p>
            </div>

            {/* Resend Form */}
            <form onSubmit={handleResendEmail} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
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
                    Sending...
                  </>
                ) : (
                  <>
                    Resend Verification Email
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <Link to="/login" className="text-brand-600 font-black hover:text-brand-700 transition-colors">
              Back to Login
            </Link>
          </>
        )}

        {/* Resend Sent */}
        {step === 'resend' && (
          <>
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
                We've sent a new verification link to:
              </p>
              <p className="text-brand-600 font-bold text-lg">{resendEmail}</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-left space-y-3">
              <p className="text-sm font-bold text-stone-700">Next steps:</p>
              <ul className="space-y-2 text-xs text-stone-600">
                <li>• Check your email for the verification link</li>
                <li>• Click the link to confirm your email</li>
                <li>• Log in to your Atumwa account</li>
              </ul>
            </div>
            <Link to="/login" className="text-brand-600 font-black hover:text-brand-700 transition-colors">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
