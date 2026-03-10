import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const handleNavigation = (path) => {
        window.location.hash = path;
        window.scrollTo(0, 0);
    };

    return (
        <footer className="w-full mt-auto py-8 z-10 relative">
            <div className="bg-[#1c1c1c] rounded-[2.5rem] p-8 md:p-14 relative mt-16 shadow-2xl mx-auto w-full max-w-7xl border border-slate-800/50 overflow-hidden">

                {/* SVG Background Map/Topo Lines to simulate the topography lines in the image */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <defs>
                            <pattern id="topo" width="200" height="200" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                <path d="M-10 100 Q 50 50 100 100 T 210 100" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.4" />
                                <path d="M-10 120 Q 50 70 100 120 T 210 120" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.5" />
                                <path d="M-10 80 Q 50 30 100 80 T 210 80" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />
                                <path d="M-10 100 Q 60 150 100 100 T 210 100" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#topo)" />
                    </svg>
                </div>

                {/* Floating Top Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-[4rem] z-20 flex flex-col items-center">
                    <div className="w-[8.5rem] h-[8.5rem] flex items-center justify-center text-orange-500 filter drop-shadow-[0_8px_8px_rgba(249,115,22,0.25)]">
                        {/* Otter logo modified to look thicker and more prominent like the reference */}
                        <svg width="110" height="110" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="50" cy="50" r="36" />
                            <ellipse cx="50" cy="50" rx="36" ry="12" />
                            <ellipse cx="50" cy="50" rx="12" ry="36" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 mt-12 md:mt-16 xl:px-4 relative z-10 w-full">

                    {/* Left Column: Contact */}
                    <div className="md:col-span-3 flex flex-col gap-6 md:pl-2">
                        <div>
                            <h3 className="text-white text-xl font-bold mb-4 tracking-tight">Contact</h3>
                            <div className="text-[13px] space-y-1 text-slate-400 font-medium tracking-wide">
                                <p className="text-slate-300">VaultIQ Headquarters,<br />1 Innovation Way</p>
                                <p>1012 AB Amsterdam</p>
                                <p className="mt-2 text-slate-300">0800 - 123 45 67</p>
                                <p className="hover:text-orange-500 cursor-pointer transition-colors pt-1">hello@ottervault.ai</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            {/* Score card / badge */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-[#f97316] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">9.8</span>
                                <span className="text-[11px] text-slate-400 font-semibold tracking-wide">Customer Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Left-Middle Column: Socials */}
                    <div className="md:col-span-2 flex flex-col pt-2 md:pt-[2.8rem]">
                        <div className="flex flex-col gap-2.5">
                            <a href="#" className="flex items-center justify-between text-[13px] font-semibold text-slate-300 hover:text-orange-500 transition-colors w-[100px] group">Facebook <ArrowUpRight size={14} className="text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></a>
                            <a href="#" className="flex items-center justify-between text-[13px] font-semibold text-slate-300 hover:text-orange-500 transition-colors w-[100px] group">Instagram <ArrowUpRight size={14} className="text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></a>
                            <a href="#" className="flex items-center justify-between text-[13px] font-semibold text-slate-300 hover:text-orange-500 transition-colors w-[100px] group">LinkedIn <ArrowUpRight size={14} className="text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></a>
                        </div>
                    </div>

                    {/* Center Column: Brand & Buttons */}
                    <div className="md:col-span-4 flex flex-col items-center text-center -mt-2 md:-mt-6">
                        <h2 className="text-4xl md:text-[2.5rem] font-bold text-[#fafafa] mb-1 tracking-tight">Otter Vault</h2>
                        <p className="text-orange-300/80 italic text-[15px] font-serif mb-8 tracking-wide">Your intelligent digital vault</p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                            <button onClick={() => handleNavigation('#/')} className="bg-[#12cb74] hover:bg-[#10b969] text-[#052e16] rounded-full px-5 py-2.5 font-bold text-[13px] flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-[#12cb74]/20 whitespace-nowrap">
                                Get Started <ArrowRight size={14} className="text-[#052e16]" />
                            </button>
                            <button onClick={() => handleNavigation('#/login')} className="bg-[#0f3d24] border border-[#165031] hover:bg-[#124d2d] text-white rounded-full px-5 py-2.5 font-bold text-[13px] flex items-center gap-2 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                Log In <ArrowRight size={14} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Quick Links */}
                    <div className="md:col-span-3 flex flex-col items-start md:items-end text-left md:pr-2 mt-8 md:mt-0">
                        <div className="w-full md:w-auto">
                            <h3 className="text-white text-xl font-bold mb-5 tracking-tight">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px] font-medium text-slate-400 text-left">
                                <span onClick={() => handleNavigation('#/about')} className="hover:text-orange-500 cursor-pointer transition-colors block">About Us</span>
                                <span onClick={() => handleNavigation('#/features')} className="hover:text-orange-500 cursor-pointer transition-colors block">Features</span>
                                <span onClick={() => handleNavigation('#/blog')} className="hover:text-orange-500 cursor-pointer transition-colors block">Blog</span>
                                <span onClick={() => handleNavigation('#/pricing')} className="hover:text-orange-500 cursor-pointer transition-colors block">Pricing</span>
                                <span onClick={() => handleNavigation('#/contact')} className="hover:text-orange-500 cursor-pointer transition-colors block">Contact</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Pill */}
                <div className="mt-14 flex md:justify-end justify-center relative z-10 w-full md:pr-4">
                    <div className="bg-[#fcf8ec] rounded-md px-3.5 py-1.5 flex items-center gap-4 text-[10px] font-bold text-slate-800 shadow-sm">
                        <span onClick={() => handleNavigation('#/privacy')} className="hover:text-amber-800 cursor-pointer transition-colors">Cookies policy</span>
                        <span onClick={() => handleNavigation('#/privacy')} className="hover:text-amber-800 cursor-pointer transition-colors">Privacy policy</span>
                        <span className="text-slate-600 opacity-80 pl-2">©{new Date().getFullYear()}</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
