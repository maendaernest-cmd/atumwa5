import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase, ShoppingBag, ShieldCheck, ArrowRight, Globe, MapPin, Zap,
    CheckCircle, Smartphone, Clock, DollarSign, Users, Menu, X, Star, Truck, TrendingUp
} from 'lucide-react';

const LandingNavbar = ({ onLogin, onNavigate }: { onLogin: (role: any) => void; onNavigate: (path: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="h-20 grid grid-cols-2 lg:grid-cols-3 items-center">
                    {/* Brand - Left */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/atumwa-logo.jpeg"
                            alt="Atumwa Logo"
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                        <span className="font-bold text-xl tracking-tight text-stone-900">Atumwa</span>
                    </div>

                    {/* Navigation - Center */}
                    <div className="hidden lg:flex items-center justify-center gap-10 text-sm font-semibold text-stone-600">
                        <a href="#how-it-works" className="hover:text-brand-600 transition-colors whitespace-nowrap">How it Works</a>
                        <a href="#pricing" className="hover:text-brand-600 transition-colors whitespace-nowrap">Pricing</a>
                        <a href="#safety" className="hover:text-brand-600 transition-colors whitespace-nowrap">Trust & Safety</a>
                    </div>

                    {/* Actions - Right */}
                    <div className="flex items-center justify-end gap-3 text-sm">
                        <Link
                            to="/signup"
                            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-brand-100 active:scale-95 whitespace-nowrap"
                        >
                            Get Started
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden text-stone-600 p-2 hover:bg-stone-50 rounded-lg transition-colors ml-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-stone-100 p-4 absolute w-full shadow-xl">
                    <div className="flex flex-col gap-4">
                        <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-left text-stone-600 font-medium py-2 w-full hover:text-brand-600 transition-colors">How it Works</a>
                        <a href="#pricing" onClick={() => setIsOpen(false)} className="text-left text-stone-600 font-medium py-2 w-full hover:text-brand-600 transition-colors">Pricing</a>
                        <a href="#safety" onClick={() => setIsOpen(false)} className="text-left text-stone-600 font-medium py-2 w-full hover:text-brand-600 transition-colors">Trust & Safety</a>
                        <Link
                            to="/signup"
                            className="w-full text-center border border-stone-200 rounded-lg py-3 font-bold text-stone-700"
                        >
                            Sign Up
                        </Link>
                        <button
                            onClick={() => onNavigate('/signup')}
                            className="w-full text-center border border-stone-200 rounded-lg py-3 font-bold text-stone-700"
                        >
                            Earn by Delivering
                        </button>
                        <button
                            onClick={() => onNavigate('/signup')}
                            className="w-full text-center bg-brand-600 text-white rounded-lg py-3 font-bold"
                        >
                            Request an Errand
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export const Landing: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'business' | 'worker'>('business');

    const handleLogin = (role: 'client' | 'atumwa' | 'admin') => {
        login(role);
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <LandingNavbar onLogin={handleLogin} onNavigate={navigate} />

            {/* --- HERO SECTION (Bento Grid) --- */}
            <div className="p-4 md:p-8 pt-8 flex items-center justify-center">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 md:gap-6 md:h-[700px]">
                    {/* 1. Hero / Brand Block */}
                    <div className="md:col-span-2 md:row-span-1 bg-white rounded-3xl p-8 flex flex-col justify-center items-start shadow-sm border border-stone-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={120} className="text-brand-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Harare's #1</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 relative z-10 leading-tight">
                            Can't be in two places <br /> at once? <span className="text-brand-600">We can.</span>
                        </h1>
                        <p className="mt-4 text-stone-500 font-medium relative z-10 max-w-md">
                            Your trusted everyday assistant. We handle errands, pickups, and tasks while you're busy or away.
                        </p>
                    </div>

                    {/* 2. Client Login */}
                    <div
                        onClick={() => navigate('/login')}
                        className="md:col-span-1 md:row-span-2 bg-stone-100 rounded-3xl p-8 flex flex-col justify-between cursor-pointer group hover:bg-stone-200 transition-all relative overflow-hidden border border-stone-200"
                    >
                        <div className="absolute -right-4 -top-4 bg-white p-4 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBag className="w-16 h-16 text-stone-300" />
                        </div>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:rotate-12 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-stone-700" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-stone-800">For<br />Senders</h2>
                            <p className="text-stone-500 text-sm font-medium mb-4">Post errands, deliveries & pickups.</p>
                            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm group-hover:translate-x-2 transition-transform">
                                Post an Errand <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Messenger Login */}
                    <div
                        onClick={() => navigate('/login')}
                        className="md:col-span-1 md:row-span-2 bg-brand-600 rounded-3xl p-8 flex flex-col justify-between cursor-pointer group hover:bg-brand-700 transition-all relative overflow-hidden shadow-lg shadow-brand-200"
                    >
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-500 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-inner mb-4 relative z-10 group-hover:-rotate-12 transition-transform">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="relative z-10 text-white">
                            <h2 className="text-3xl font-bold mb-2">For<br />Runners</h2>
                            <p className="text-brand-100 text-sm font-medium mb-4">Earn money on your own schedule.</p>
                            <div className="flex items-center gap-2 font-bold text-sm group-hover:translate-x-2 transition-transform">
                                Start Delivering <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* 4. Context/Map Block */}
                    <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm border border-stone-100 flex flex-col justify-end">
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#16a34a 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        </div>
                        <div className="absolute top-6 right-6">
                            <span className="flex items-center gap-2 bg-green-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100 animate-pulse">
                                <span className="w-2 h-2 bg-brand-600 rounded-full"></span> Live: Harare
                            </span>
                        </div>
                        <div className="relative z-10 max-w-md">
                            <div className="mb-4 inline-flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1 text-xs font-bold text-stone-600">
                                <Globe size={12} /> Diaspora Connect
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-stone-800">Support home, from anywhere.</h3>
                            <p className="text-stone-500 leading-relaxed">
                                Trusted by Zimbabweans in the UK, USA, and SA to handle tasks back home.
                                Pharmacy runs, grocery drops, and document collection.
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/id/65/100/100" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/id/64/100/100" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/id/68/100/100" alt="User" />
                                </div>
                                <span className="text-xs font-bold text-stone-400">2,000+ Active Users</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. Admin Login */}
                    <div
                        onClick={() => navigate('/login')}
                        className="md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-md transition-all border-2 border-dashed border-stone-200 hover:border-brand-500 group"
                    >
                        <div className="bg-stone-50 p-3 rounded-full mb-2 group-hover:bg-brand-50 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-stone-400 group-hover:text-brand-600 transition-colors" />
                        </div>
                        <span className="font-bold text-stone-600 group-hover:text-brand-600 text-sm">Admin Access</span>
                    </div>

                    {/* 6. Location Badge */}
                    <div className="md:col-span-1 md:row-span-1 bg-stone-900 rounded-3xl p-6 flex flex-col justify-center items-center text-white text-center">
                        <MapPin className="w-8 h-8 text-stone-500 mb-2" />
                        <span className="font-bold text-sm">HQ: Avondale</span>
                        <span className="text-xs text-stone-500">Harare, ZW</span>
                    </div>
                </div>
            </div>

            {/* --- PRICING SECTION (HOLIDAY RATES) --- */}
            <section id="pricing" className="py-20 bg-stone-50 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-xs font-black mb-4 tracking-widest uppercase">
                            Transparent & Fair
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">Atumwa Rates</h2>
                        <p className="text-lg text-stone-500 font-medium">Reliable | Honest | Affordable pricing you'll love.</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8 bg-white rounded-[3rem] p-4 md:p-12 shadow-2xl border border-stone-100 relative overflow-hidden">
                        <div className="md:col-span-3 space-y-2 relative z-10">
                            <div className="grid grid-cols-2 border-b border-stone-100 pb-4 mb-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                                <span>DISTANCE (KM)</span>
                                <span className="text-right">PRICE (USD)</span>
                            </div>
                            {[
                                { d: "0 - 3 km", p: "$2" },
                                { d: "3 - 5 km", p: "$3" },
                                { d: "5 - 7 km", p: "$4" },
                                { d: "7 - 9 km", p: "$5" },
                                { d: "9 - 12 km", p: "$6" },
                                { d: "12 - 14 km", p: "$7" },
                                { d: "14 - 17 km", p: "$8" },
                                { d: "17 - 19 km", p: "$9" },
                                { d: "19 - 22 km", p: "$10" },
                                { d: "22+ km", p: "$0.50 / km" },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-2 py-3 px-4 rounded-2xl hover:bg-brand-50/50 transition-colors border-b border-stone-50 last:border-0 group">
                                    <span className="font-bold text-stone-700 group-hover:text-stone-900">{row.d}</span>
                                    <span className="text-right font-black text-brand-600 text-lg">{row.p}</span>
                                </div>
                            ))}
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-between p-8 bg-stone-900 rounded-[2.5rem] text-white relative h-full min-h-[400px]">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
                                <Truck size={200} className="rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-4 leading-tight">Can't be in <br />two places? <br /><span className="text-brand-500">We can.</span></h3>
                                <p className="text-stone-400 text-sm leading-relaxed mb-8">
                                    Whether you're in Harare, the UK, or the USA, we're your feet on the ground every day.
                                </p>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">WhatsApp Us</div>
                                    <div className="font-bold text-lg">0710206475</div>
                                </div>
                                <button onClick={() => navigate('/login')} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS (Switchable) --- */}
            <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-center mb-12">
                    <div className="bg-stone-100 p-1 rounded-full inline-flex">
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'business' ? 'bg-white shadow-sm text-brand-600' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            For Senders
                        </button>
                        <button
                            onClick={() => setActiveTab('worker')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'worker' ? 'bg-white shadow-sm text-brand-600' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            For Messengers
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {activeTab === 'business' ? (
                        <>
                            <div className="space-y-8 animate-in slide-in-from-left duration-500">
                                <h2 className="text-4xl font-extrabold text-stone-900 leading-tight">
                                    Your on-demand <br /> fleet in Harare.
                                </h2>
                                <p className="text-lg text-stone-600">
                                    Whether you need to send contracts to the CBD, pick up meds for parents in Mt Pleasant, or get groceries delivered. Atumwa connects you instantly.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-brand-50 p-2 rounded-lg text-brand-600"><Zap /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Instant Matching</h4>
                                            <p className="text-stone-600 text-sm">Post a job and get matched with a verified runner in minutes.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-brand-50 p-2 rounded-lg text-brand-600"><MapPin /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Real-time Tracking</h4>
                                            <p className="text-stone-600 text-sm">Watch your messenger move across the map from pickup to drop-off.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-brand-50 p-2 rounded-lg text-brand-600"><Globe /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Diaspora Friendly</h4>
                                            <p className="text-stone-600 text-sm">Pay securely from the UK/US. We handle the local logistics.</p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => handleLogin('client')} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors">
                                    Start Sending Now
                                </button>
                            </div>
                            <div className="bg-stone-100 rounded-3xl p-8 h-96 flex items-center justify-center relative overflow-hidden animate-in slide-in-from-right duration-500">
                                {/* Abstract Phone UI Representation */}
                                <div className="w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 absolute top-12 -right-12 transform -rotate-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600"><CheckCircle size={20} /></div>
                                        <div>
                                            <div className="font-bold text-sm text-stone-800">Delivery Complete</div>
                                            <div className="text-xs text-stone-500">Just now • Borrowdale</div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full w-full mb-2"></div>
                                    <div className="h-2 bg-stone-100 rounded-full w-2/3"></div>
                                </div>

                                <div className="w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 absolute bottom-12 -left-4 transform rotate-3 z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-stone-400 uppercase">New Gig</span>
                                        <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded text-xs">$15.00</span>
                                    </div>
                                    <h4 className="font-bold text-stone-800 mb-1">Pharmacy Pickup</h4>
                                    <p className="text-xs text-stone-500">Greenwood Pharmacy to Avenues</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div id="messengers" className="order-2 md:order-1 bg-stone-100 rounded-3xl p-8 h-96 relative overflow-hidden flex items-center justify-center animate-in slide-in-from-left duration-500">
                                <div className="absolute inset-0 bg-brand-600 opacity-5 pattern-dots"></div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 max-w-xs w-full relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="text-stone-500 text-sm">Daily Earnings</div>
                                        <TrendingUp className="text-brand-600" />
                                    </div>
                                    <div className="text-4xl font-black text-stone-900 mb-2">$85.00</div>
                                    <div className="flex gap-2 mb-4">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">+ $25 (Tips)</span>
                                    </div>
                                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-brand-500 w-3/4 h-full"></div>
                                    </div>
                                    <div className="mt-2 text-xs text-stone-400 text-right">Goal: $100</div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 space-y-8 animate-in slide-in-from-right duration-500">
                                <h2 className="text-4xl font-extrabold text-stone-900 leading-tight">
                                    Turn your time <br /> into <span className="text-brand-600">income</span>.
                                </h2>
                                <p className="text-lg text-stone-600">
                                    Got a bike, a car, or just a good pair of shoes? Join Atumwa and start earning by completing simple errands around Harare.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-stone-100 p-2 rounded-lg text-stone-700"><Clock /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Flexible Schedule</h4>
                                            <p className="text-stone-600 text-sm">Work when you want. No boss, no shifts.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-stone-100 p-2 rounded-lg text-stone-700"><DollarSign /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Fast Payment</h4>
                                            <p className="text-stone-600 text-sm">Get paid directly to your wallet or EcoCash upon completion.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-stone-100 p-2 rounded-lg text-stone-700"><Users /></div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">Community</h4>
                                            <p className="text-stone-600 text-sm">Join a network of reliable messengers building a reputation.</p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => handleLogin('atumwa')} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100">
                                    Become a Messenger
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* --- SAFETY SECTION --- */}
            <section id="safety" className="py-20 bg-stone-900 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="inline-block bg-stone-800 rounded-lg px-3 py-1 text-xs font-bold text-brand-400 mb-4 border border-stone-700">TRUST & SAFETY</div>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Verified. Vetted. Safe.</h2>
                            <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                                We take safety seriously. Every Atumwa messenger undergoes a strict vetting process including ID verification and background checks.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-brand-500" />
                                    <span>Government ID Verification</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-brand-500" />
                                    <span>Real-time GPS Tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-brand-500" />
                                    <span>Secure In-app Payments</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-brand-500" />
                                    <span>Review & Rating System</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700">
                                    <ShieldCheck className="text-brand-500 w-10 h-10 mb-4" />
                                    <h4 className="font-bold text-lg mb-2">100% Insured</h4>
                                    <p className="text-stone-400 text-sm">All parcels are insured against loss or damage during transit.</p>
                                </div>
                                <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 translate-y-8">
                                    <Smartphone className="text-brand-500 w-10 h-10 mb-4" />
                                    <h4 className="font-bold text-lg mb-2">Live Support</h4>
                                    <p className="text-stone-400 text-sm">Our local support team in Harare is available 7 days a week.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-stone-900 mb-12">Stories from the Community</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                            <div className="flex text-amber-500 mb-4">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="text-stone-700 mb-6 italic">"Living in London, it was so hard to get meds to my mom in Highfield. Atumwa made it instant. I saw the runner on the map the whole time."</p>
                            <div className="flex items-center gap-3">
                                <img src="https://picsum.photos/id/65/50/50" className="w-10 h-10 rounded-full" alt="" />
                                <div>
                                    <div className="font-bold text-sm text-stone-900">Sarah J.</div>
                                    <div className="text-xs text-stone-500">London, UK</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                            <div className="flex text-amber-500 mb-4">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="text-stone-700 mb-6 italic">"I'm a student at UZ. I do runs between classes on my bike. It pays for my data and textbooks. Best gig app in Zim."</p>
                            <div className="flex items-center gap-3">
                                <img src="https://picsum.photos/id/68/50/50" className="w-10 h-10 rounded-full" alt="" />
                                <div>
                                    <div className="font-bold text-sm text-stone-900">Tinashe M.</div>
                                    <div className="text-xs text-stone-500">Messenger</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                            <div className="flex text-amber-500 mb-4">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="text-stone-700 mb-6 italic">"We use Atumwa for urgent document deliveries between our branches. It's faster than hiring a full-time driver."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center font-bold text-brand-700">L</div>
                                <div>
                                    <div className="font-bold text-sm text-stone-900">Law Firm Partner</div>
                                    <div className="text-xs text-stone-500">Harare CBD</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* --- TESTIMONIALS --- */}
            <section className="py-16 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-stone-900 mb-4">What Our Users Say</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">Real stories from clients and messengers using Atumwa every day.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="flex items-center mb-4">
                                <img src="https://picsum.photos/id/65/50/50" alt="Sarah J." className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <div className="font-bold text-stone-900">Sarah J.</div>
                                    <div className="text-xs text-stone-500">Client • London, UK</div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm mb-4">"Atumwa made it so easy to help my family back home. From prescription pickups to grocery deliveries, everything arrived perfectly!"</p>
                            <div className="flex text-amber-400">
                                ★★★★★
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="flex items-center mb-4">
                                <img src="https://picsum.photos/id/64/50/50" alt="Blessing C." className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <div className="font-bold text-stone-900">Blessing C.</div>
                                    <div className="text-xs text-stone-500">Messenger • Harare CBD</div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm mb-4">"Being an Atumwa has changed my life. I earn good money on my own schedule, and the platform is so easy to use."</p>
                            <div className="flex text-amber-400">
                                ★★★★★
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="flex items-center mb-4">
                                <img src="https://picsum.photos/id/66/50/50" alt="Dr. Moyo" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <div className="font-bold text-stone-900">Dr. Moyo</div>
                                    <div className="text-xs text-stone-500">Client • Avenues, Harare</div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm mb-4">"Reliable and trustworthy service. My prescriptions are always delivered on time, and I can track everything in real-time."</p>
                            <div className="flex text-amber-400">
                                ★★★★★
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-stone-200 py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    src="/atumwa-logo.jpeg"
                                    alt="Atumwa Logo"
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span className="font-bold text-xl tracking-tight text-stone-900">Atumwa</span>
                            </div>
                            <p className="text-stone-500 text-sm">Connecting the world to Harare, one errand at a time.</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-stone-600">
                                <li><a href="#clients" className="hover:text-brand-600">For Clients</a></li>
                                <li><a href="#messengers" className="hover:text-brand-600">For Messengers</a></li>
                                <li><a href="#pricing" className="hover:text-brand-600">Pricing</a></li>
                                <li><a href="#safety" className="hover:text-brand-600">Safety</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-stone-600">
                                <li><a href="#about" className="hover:text-brand-600">About Us</a></li>
                                <li><a href="#careers" className="hover:text-brand-600">Careers</a></li>
                                <li><a href="#blog" className="hover:text-brand-600">Blog</a></li>
                                <li><a href="#contact" className="hover:text-brand-600">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-stone-600">
                                <li><a href="#terms" className="hover:text-brand-600">Terms of Service</a></li>
                                <li><a href="#privacy" className="hover:text-brand-600">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-xs text-stone-400">© 2025 Atumwa Inc. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <Globe size={16} className="text-stone-400" />
                            <span className="text-xs text-stone-500">English (US)</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
