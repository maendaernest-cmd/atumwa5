import React, { useState } from 'react';
import { WALLET_HISTORY } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Award, ChevronRight, CreditCard, Settings, LogOut, ShieldCheck, Mail, Upload, CheckCircle, Loader2, AlertCircle, RefreshCw, X, Smartphone, Wifi, WifiOff, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data for the chart
const data = [
    { name: 'Mon', amount: 45 },
    { name: 'Tue', amount: 30 },
    { name: 'Wed', amount: 65 },
    { name: 'Thu', amount: 40 },
    { name: 'Fri', amount: 85 },
    { name: 'Sat', amount: 120 },
    { name: 'Sun', amount: 95 },
];

export const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [verificationState, setVerificationState] = useState<'idle' | 'sending' | 'pending_code' | 'verifying' | 'uploading' | 'success'>('idle');
    const [emailCode, setEmailCode] = useState('');
    const [showPayments, setShowPayments] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', avatar: user?.avatar || '', location: user?.location || '' });
    const [newMethodData, setNewMethodData] = useState({ type: 'mobile', name: '', details: '' });

    const { isInstallable, isOffline, notificationPermission, installPWA, requestNotificationPermission, sendTestNotification } = usePWA();

    if (!user) return null;

    // Verification Handlers
    const handleSendEmailCode = () => {
        setVerificationState('sending');
        // Simulate API call
        setTimeout(() => {
            setVerificationState('pending_code');
            addToast('Verification Code Sent', 'Please check your email inbox for the 4-digit code.', 'message');
        }, 1500);
    };

    const handleResendCode = () => {
        // Simulate Resend
        addToast('Code Resent', 'A new verification code has been sent to your email.', 'message');
    };

    const handleVerifyEmail = () => {
        if (emailCode.length < 4) return;
        setVerificationState('verifying');

        // Simulate Verification API
        setTimeout(() => {
            setVerificationState('success');
            addToast(
                'Verification Submitted',
                'Email verified successfully. Your profile is now unlocked.',
                'success'
            );
            // Delay context update so user sees success message
            setTimeout(() => {
                updateUser({ isVerified: true });
            }, 2000);
        }, 1500);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, avatar: reader.result as string });
                addToast('Preview Ready', 'Click save to update your profile photo.', 'message');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        updateUser(editData);
        setShowEditProfile(false);
        addToast('Profile Updated', 'Your changes have been saved successfully.', 'success');
    };

    const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                addToast('Invalid File Type', 'Please upload a valid image file (JPG, PNG).', 'alert');
                return;
            }

            setVerificationState('uploading');
            // Simulate upload latency
            setTimeout(() => {
                setVerificationState('success');
                addToast(
                    'Documents Uploaded',
                    'Your ID has been securely transmitted. Admin alert triggered for review.',
                    'success'
                );
                // Verify user after success animation
                setTimeout(() => {
                    updateUser({ isVerified: true });
                }, 2000);
            }, 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Quick Links */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                    >
                        <span className="text-lg">🏠</span>
                        <div>
                            <div className="font-semibold text-slate-800">Home</div>
                            <div className="text-xs text-slate-500">Dashboard</div>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/gigs')}
                        className="flex items-center gap-3 p-3 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-left"
                    >
                        <span className="text-lg">💼</span>
                        <div>
                            <div className="font-semibold text-slate-800">Gigs</div>
                            <div className="text-xs text-slate-500">Jobs</div>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/messages')}
                        className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                    >
                        <span className="text-lg">💬</span>
                        <div>
                            <div className="font-semibold text-slate-800">Messages</div>
                            <div className="text-xs text-slate-500">Chat</div>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/map')}
                        className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                    >
                        <span className="text-lg">🗺️</span>
                        <div>
                            <div className="font-semibold text-slate-800">Map</div>
                            <div className="text-xs text-slate-500">Track</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-400"></div>
                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <div className="relative">
                            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                            {user.isVerified && (
                                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm">
                                    <CheckCircle size={20} className="text-brand-500 fill-brand-50" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowEditProfile(true)}
                            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                            {user.isVerified && (
                                <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-brand-200">
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 mb-2 flex items-center gap-2">
                            <MapPin size={16} /> {user.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm mt-3">
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded font-medium">
                                <Star size={14} className="fill-amber-500 text-amber-500" /> {user.rating} Rating
                            </span>
                            <span className="flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-1 rounded font-medium">
                                <Award size={14} /> {user.jobsCompleted} Gigs Completed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">

                    {/* VERIFICATION SECTION - Display if not verified */}
                    {!user.isVerified && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800">Verification Required</h2>
                                    <p className="text-sm text-slate-600">
                                        {user.role === 'client' ? 'Verify your email to verify your profile.' : 'Upload your ID to start accepting gigs.'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                {user.role === 'client' ? (
                                    // CLIENT VERIFICATION (Email)
                                    <div className="max-w-md mx-auto">
                                        {verificationState === 'idle' && (
                                            <div className="flex flex-col gap-4 text-center">
                                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                                    <Mail size={32} />
                                                </div>
                                                <p className="text-sm text-slate-600">We will send a one-time verification code to your registered email address to verify your identity.</p>
                                                <button
                                                    onClick={handleSendEmailCode}
                                                    className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-lg shadow-slate-200"
                                                >
                                                    Send Verification Code
                                                </button>
                                            </div>
                                        )}

                                        {verificationState === 'sending' && (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
                                                <p className="text-sm font-medium text-slate-600">Sending verification code...</p>
                                            </div>
                                        )}

                                        {verificationState === 'pending_code' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <div className="text-center">
                                                    <h3 className="font-bold text-slate-800 mb-1">Enter Verification Code</h3>
                                                    <p className="text-sm text-slate-500">We sent a 4-digit code to your email.</p>
                                                </div>

                                                <div>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        placeholder="0000"
                                                        className="w-full border border-slate-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none tracking-[1em] font-mono text-center text-2xl font-bold text-slate-800 placeholder-slate-200 transition-all"
                                                        value={emailCode}
                                                        onChange={(e) => {
                                                            // Only allow numbers and max 4 chars
                                                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                                            setEmailCode(val);
                                                        }}
                                                        maxLength={4}
                                                        autoFocus
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleVerifyEmail}
                                                    disabled={emailCode.length < 4}
                                                    className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-100"
                                                >
                                                    Verify Email
                                                </button>

                                                <div className="flex items-center justify-between text-xs pt-2">
                                                    <button onClick={() => setVerificationState('idle')} className="text-slate-500 hover:text-slate-800">
                                                        Wrong email?
                                                    </button>
                                                    <button onClick={handleResendCode} className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                                                        <RefreshCw size={12} /> Resend Code
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {verificationState === 'verifying' && (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
                                                <p className="text-sm font-medium text-slate-600">Verifying code...</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // ATUMWA VERIFICATION (ID Upload)
                                    <div>
                                        {verificationState === 'idle' && (
                                            <div className="space-y-4">
                                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        accept="image/*"
                                                        onChange={handleIdUpload}
                                                    />
                                                    <div className="bg-brand-50 text-brand-600 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                                        <Upload size={32} />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 mb-1">Upload Government ID</h3>
                                                    <p className="text-sm text-slate-500 max-w-xs">
                                                        Please upload a clear photo of your driver's license or passport.
                                                    </p>
                                                </div>
                                                <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                                                    <AlertCircle size={12} /> Your data is securely encrypted.
                                                </p>
                                            </div>
                                        )}

                                        {verificationState === 'uploading' && (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <Loader2 className="animate-spin text-brand-600 mb-3" size={40} />
                                                <p className="text-slate-600 font-medium">Verifying your document...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Common Success State for both roles */}
                                {verificationState === 'success' && (
                                    <div className="flex flex-col items-center justify-center py-6 text-green-600 animate-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <p className="font-bold text-xl mb-1">Verification Successful!</p>
                                        <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Wallet / Earnings Section */}
                    {user.role !== 'client' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-800">Weekly Earnings</h2>
                                <span className="text-2xl font-bold text-brand-600">$480.00</span>
                            </div>

                            {/* Chart */}
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
                        <div className="space-y-4">
                            {WALLET_HISTORY.map(t => (
                                <div key={t.id} className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {t.type === 'credit' ? '+' : '-'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{t.description}</p>
                                            <p className="text-xs text-slate-500">{t.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                                        {t.type === 'credit' ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Settings */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Account</h3>
                        <ul className="space-y-2">
                            <li
                                onClick={() => setShowPayments(true)}
                                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3 text-slate-700">
                                    <CreditCard size={18} /> Payment Methods
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                            </li>
                            <li
                                onClick={() => setShowPreferences(true)}
                                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Settings size={18} /> Preferences
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                            </li>
                            <li
                                onClick={logout}
                                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group text-red-600"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut size={18} /> Sign Out
                                </div>
                            </li>
                        </ul>
                    </div>

                    {user.role === 'atumwa' && (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                            <p className="text-slate-300 text-sm mb-4">Get lower fees and priority access to high-value gigs.</p>
                            <button className="w-full bg-white text-slate-900 py-2 rounded-lg font-bold text-sm hover:bg-slate-100">
                                Upgrade Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Methods Modal */}
            {showPayments && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md">
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl w-full max-w-md p-8 animate-in slide-in-from-bottom duration-500 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                {showAddMethod ? 'Add Method' : 'Payments'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPayments(false);
                                    setShowAddMethod(false);
                                }}
                                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {!showAddMethod ? (
                            <>
                                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-6">
                                    {/* Default EcoCash */}
                                    <div className="p-5 border-2 border-brand-500 bg-brand-50/50 rounded-2xl flex items-center justify-between shadow-sm shadow-brand-200/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md text-xl">
                                                📱
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-tight">EcoCash Wallet</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">077 **** 892</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.15em] bg-white px-3 py-1 rounded-full shadow-sm border border-brand-100">Default</span>
                                        </div>
                                    </div>

                                    {/* Cash Option */}
                                    <div className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl group-hover:shadow-md transition-all">
                                                💵
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-tight">Cash on Delivery</p>
                                                <p className="text-xs text-slate-500 font-medium">USD, South African Rand</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300" />
                                    </div>

                                    {/* ZiG Coming Soon */}
                                    <div className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-between opacity-50 grayscale">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl">
                                                🪙
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-tight">ZiG Central Wallet</p>
                                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-1">Maintenance</p>
                                            </div>
                                        </div>
                                        <Settings size={18} className="text-slate-300" />
                                    </div>

                                    {/* Industry Trend: Crypto Option */}
                                    <div className="p-5 border border-dashed border-slate-300 bg-slate-50/10 rounded-2xl flex items-center justify-between group cursor-help">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                                                ⛓️
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-400 leading-tight">Crypto (Lightning)</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Vote for this feature</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddMethod(true)}
                                    className="w-full mt-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                                >
                                    + Add New Method
                                </button>
                            </>
                        ) : (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Method Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setNewMethodData({ ...newMethodData, type: 'mobile' })}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${newMethodData.type === 'mobile' ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <span className="text-xl">📱</span>
                                                <span className="text-xs font-bold text-slate-700">Mobile Money</span>
                                            </button>
                                            <button
                                                onClick={() => setNewMethodData({ ...newMethodData, type: 'card' })}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${newMethodData.type === 'card' ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <span className="text-xl">💳</span>
                                                <span className="text-xs font-bold text-slate-700">Debit Card</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Full Name on Account</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                                                value={newMethodData.name}
                                                onChange={(e) => setNewMethodData({ ...newMethodData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">
                                                {newMethodData.type === 'mobile' ? 'Phone Number' : 'Card Number'}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={newMethodData.type === 'mobile' ? '077 **** ***' : '**** **** **** ****'}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                                                value={newMethodData.details}
                                                onChange={(e) => setNewMethodData({ ...newMethodData, details: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddMethod(false)}
                                        className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-display"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (newMethodData.details) {
                                                addToast('Method Added', 'Saving to secure vault...', 'success');
                                                setTimeout(() => {
                                                    setShowAddMethod(false);
                                                    setShowPayments(false);
                                                    setNewMethodData({ type: 'mobile', name: '', details: '' });
                                                }, 1500);
                                            }
                                        }}
                                        className="flex-2 bg-brand-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 px-8"
                                    >
                                        Link Securely
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">App Preferences</h3>
                            <button onClick={() => setShowPreferences(false)} className="text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Notifications</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-700 font-medium">Push Notifications</span>
                                        <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-700 font-medium">Email Updates</span>
                                        <div className="w-10 h-6 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Security</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-700 font-medium">Biometric Login</span>
                                        <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">App & Notifications</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Smartphone size={18} className="text-slate-600" />
                                            <span className="text-slate-700 font-medium">Install App</span>
                                        </div>
                                        {isInstallable ? (
                                            <button
                                                onClick={installPWA}
                                                className="bg-brand-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-700"
                                            >
                                                Install
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-500">Installed</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isOffline ? <WifiOff size={18} className="text-red-600" /> : <Wifi size={18} className="text-green-600" />}
                                            <span className="text-slate-700 font-medium">Online Status</span>
                                        </div>
                                        <span className={`text-xs font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                                            {isOffline ? 'Offline' : 'Online'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Bell size={18} className="text-slate-600" />
                                            <span className="text-slate-700 font-medium">Push Notifications</span>
                                        </div>
                                        {notificationPermission === 'granted' ? (
                                            <button
                                                onClick={sendTestNotification}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700"
                                            >
                                                Test
                                            </button>
                                        ) : (
                                            <button
                                                onClick={requestNotificationPermission}
                                                className="bg-slate-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-slate-700"
                                            >
                                                Enable
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowPreferences(false)} className="w-full mt-8 bg-brand-600 text-white py-3 rounded-xl font-bold text-sm">Save Changes</button>
                    </div>
                </div>
            )}
            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl overflow-hidden relative"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile</h3>
                            <button onClick={() => setShowEditProfile(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="relative group">
                                    <img src={editData.avatar} alt="Preview" className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-xl object-cover bg-white" />
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    </label>
                                </div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tap to change photo</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        value={editData.location}
                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-display"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-2 bg-brand-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 px-12"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};