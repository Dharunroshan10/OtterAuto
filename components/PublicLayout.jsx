import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';

const OtterLogo = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="50" cy="50" r="40" />
        <ellipse cx="50" cy="50" rx="40" ry="15" />
    </svg>
);

export default function PublicLayout({ children, onBack }) {
    const handleNavigation = (path) => {
        window.location.hash = path;
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900 flex flex-col items-center py-6 px-4 md:px-8 gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .btn-primary { transition: all 0.2s ease; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3); }
            `}</style>

            {/* Back to Home Button */}
            <div className="w-full max-w-6xl flex justify-start -mb-4 animate-fade-up relative z-[60]">
                <button
                    onClick={() => handleNavigation('#/')}
                    className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-bold transition-all bg-white hover:bg-orange-50 px-5 py-2.5 rounded-full border border-slate-200 hover:border-orange-200 shadow-sm hover:shadow-md text-sm cursor-pointer"
                >
                    &larr; Back to Home
                </button>
            </div>

            {/* Navbar Card */}
            <nav className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200/50 w-full max-w-6xl px-6 h-20 flex items-center justify-between sticky top-6 z-50 animate-fade-up">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('#/')}>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <OtterLogo size={24} className="text-orange-500" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">Otter Vault</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <button onClick={() => handleNavigation('#/about')} className="hover:text-orange-500 transition-colors">About</button>
                    <button onClick={() => handleNavigation('#/features')} className="hover:text-orange-500 transition-colors">Features</button>
                    <button onClick={() => handleNavigation('#/blog')} className="hover:text-orange-500 transition-colors">Blog</button>
                    <button onClick={() => handleNavigation('#/blog')} className="hover:text-orange-500 transition-colors">Blog</button>
                    <button onClick={() => handleNavigation('#/pricing')} className="hover:text-orange-500 transition-colors">Pricing</button>
                    <button onClick={() => handleNavigation('#/contact')} className="hover:text-orange-500 transition-colors">Contact</button>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleNavigation('#/')} className="hidden md:block text-slate-600 font-semibold text-sm hover:text-slate-900 transition-colors">Log in</button>
                    <button onClick={() => handleNavigation('#/pricing')} className="relative btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-md bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 flex items-center gap-2">Upgrade to Pro <Zap size={16} className="fill-white/30" /></span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="w-full max-w-6xl animate-fade-up delay-100 flex flex-col gap-8">
                {children}
            </div>

            {/* Footer Card */}
            <footer className="w-full max-w-6xl flex flex-col items-center gap-6 mt-auto animate-fade-up delay-200">
                <div className="w-full bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('#/')}>
                        <OtterLogo size={24} className="text-orange-500" />
                        <span className="text-lg font-extrabold text-slate-900">Otter AI Inc.</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <button onClick={() => handleNavigation('#/about')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">About Us</button>
                        <button onClick={() => handleNavigation('#/blog')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Blog</button>
                        <button onClick={() => handleNavigation('#/contact')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Contact</button>
                        <button onClick={() => handleNavigation('#/privacy')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</button>
                        <button onClick={() => handleNavigation('#/terms')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</button>
                    </div>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
