import React, { useState, useEffect } from 'react';

const OtterLogo = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="50" cy="50" r="40" />
        <ellipse cx="50" cy="50" rx="40" ry="15" />
    </svg>
);

function useInView(threshold = 0.12) {
    const [ref, setRef] = useState(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setInView(true); observer.unobserve(ref); }
        }, { threshold });
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, threshold]);
    return [setRef, inView];
}

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [faqOpen, setFaqOpen] = useState(null);
    const [heroRef, heroIn] = useInView(0.05);
    const [featRef, featIn] = useInView(0.05);
    const [howRef, howIn] = useInView(0.05);
    const [bentoRef, bentoIn] = useInView(0.05);
    const [pricingRef, pricingIn] = useInView(0.05);
    const [faqRef, faqIn] = useInView(0.05);

    const goTo = (hash) => { window.location.hash = hash; window.scrollTo(0, 0); };

    const faqs = [
        { q: 'What is Otter?', a: 'Otter is an AI-powered screenshot vault that automatically organizes your images using OCR, smart tagging, and intelligent categorization. Think of it as a smart photo album for screenshots, receipts, documents, and everyday captures.' },
        { q: 'Is my data safe and private?', a: 'Absolutely. Your images are stored in encrypted cloud storage with row-level security. We never sell your images or personal information to third parties.' },
        { q: 'How does AI tagging work?', a: 'When you upload an image, our AI vision model analyzes it to detect text (OCR), identify the category, extract data like amounts and dates, and generate semantic tags — all in seconds.' },
        { q: 'What image formats are supported?', a: 'Otter supports JPEG, PNG, WebP, GIF, and BMP. You can upload individual files, entire folders, or import from web URLs.' },
        { q: 'Can I export my data?', a: 'Yes! Download your entire vault as a ZIP file organized into category subfolders. You retain 100% ownership of all your content.' },
        { q: 'Is Otter free to use?', a: 'Yes! Otter offers a generous free tier. Premium features like advanced AI search, bulk extraction, and priority processing are available with a subscription.' },
        { q: 'Do you use cookies?', a: 'Yes. We use cookies to enhance your experience. We also use third-party vendors, including Google, which use cookies to serve ads based on a user\'s prior visits to our website or other websites. You can opt out through Google Ads Settings.' },
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeScale { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
                @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-18px) rotate(2deg)} }
                @keyframes float2 { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(-12px) rotate(-1deg)} }
                @keyframes bounceIn { 0%{opacity:0;transform:scale(0.3)} 50%{opacity:1;transform:scale(1.05)} 100%{transform:scale(1)} }
                @keyframes wobble { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(3deg)} 75%{transform:rotate(-3deg)} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes slideRight { from{width:0} to{width:100%} }
                .fu { animation:fadeUp 0.7s ease-out both }
                .fu1 { animation:fadeUp 0.7s ease-out 0.08s both }
                .fu2 { animation:fadeUp 0.7s ease-out 0.16s both }
                .fu3 { animation:fadeUp 0.7s ease-out 0.24s both }
                .fu4 { animation:fadeUp 0.7s ease-out 0.32s both }
                .fu5 { animation:fadeUp 0.7s ease-out 0.40s both }
                .fu6 { animation:fadeUp 0.7s ease-out 0.48s both }
                .fs { animation:fadeScale 0.6s ease-out both }
                .fl1 { animation:float1 7s ease-in-out infinite }
                .fl2 { animation:float2 5s ease-in-out infinite }
                .bi { animation:bounceIn 0.6s ease-out both }
                .wb { animation:wobble 3s ease-in-out infinite }
                .card-hover { transition:all 0.35s cubic-bezier(.4,0,.2,1) }
                .card-hover:hover { transform:translateY(-6px) scale(1.02); box-shadow:0 24px 64px rgba(0,0,0,0.08) }
                .cta-glow { transition:all 0.25s ease }
                .cta-glow:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(239,68,68,0.3) }
                .highlight-underline { position:relative; display:inline-block }
                .highlight-underline::after { content:''; position:absolute; left:0; bottom:-2px; width:100%; height:8px; background:rgba(239,68,68,0.15); border-radius:4px; z-index:-1 }
            `}</style>

            {/* ═══ NAV BAR ═══ */}
            <nav className="fixed top-0 w-full z-50 bg-[#FAF9F7]/85 backdrop-blur-xl border-b border-stone-200/50">
                <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <OtterLogo size={20} className="text-white" />
                        </div>
                        <span className="text-stone-900 font-black text-xl tracking-tight">Otter</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Dashboard', 'Pricing', 'FAQ'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-stone-400 hover:text-stone-900 transition-colors">{item}</a>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => goTo('#/')} className="text-sm font-semibold text-stone-500 hover:text-stone-900 px-4 py-2.5 rounded-xl transition-colors">Sign In</button>
                        <button onClick={() => goTo('#/')} className="cta-glow text-sm font-bold text-white px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 shadow-md shadow-red-500/20">Get Started Free →</button>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-stone-500">
                        {mobileMenuOpen ? <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg> : <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
                    </button>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 space-y-2">
                        {['Features', 'Dashboard', 'Pricing', 'FAQ'].map(i => <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-stone-600 py-2.5">{i}</a>)}
                        <button onClick={() => goTo('#/')} className="w-full text-sm font-bold text-white py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 shadow-md mt-2">Get Started Free</button>
                    </div>
                )}
            </nav>

            {/* ═══ HERO ═══ */}
            <section ref={heroRef} className="pt-28 pb-8 md:pt-36 md:pb-12 relative">
                {/* Decorative blobs */}
                <div className="absolute top-16 right-[10%] w-32 h-32 rounded-full bg-red-100 opacity-50 fl1 pointer-events-none" />
                <div className="absolute top-40 left-[5%] w-20 h-20 rounded-full bg-amber-100 opacity-60 fl2 pointer-events-none" />
                <div className="absolute bottom-10 right-[20%] w-16 h-16 rounded-2xl bg-violet-100 opacity-40 wb pointer-events-none" style={{ animationDelay: '1s' }} />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    {heroIn && (
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="fu inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm mb-8">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">AI-Powered Vault</span>
                            </div>

                            <h1 className="fu1 text-4xl md:text-6xl lg:text-[4.2rem] font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
                                The best place to<br />
                                <span className="highlight-underline text-red-500" style={{ fontStyle: 'italic' }}>organize</span> and <span className="highlight-underline text-rose-500" style={{ fontStyle: 'italic' }}>search</span><br />
                                your screenshots
                            </h1>

                            <p className="fu2 text-base md:text-lg text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                                Upload thousands of screenshots and let Otter's AI automatically tag, categorize, and extract data. Your digital vault, intelligently organized.
                            </p>

                            <div className="fu3 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => goTo('#/')} className="cta-glow px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-base shadow-xl shadow-red-500/20 flex items-center gap-2">
                                    Get Started
                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ BENTO FEATURE CARDS ═══ */}
            <section id="features" ref={featRef} className="py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    {featIn && (
                        <>
                            <div className="text-center mb-12 fu">
                                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
                                    Our <span className="text-red-500" style={{ fontStyle: 'italic' }}>interactive</span> features
                                </h2>
                                <p className="text-stone-400 font-medium max-w-lg mx-auto">Everything you need to manage your digital captures, powered by advanced AI.</p>
                            </div>

                            {/* Bento Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">

                                {/* Card 1 — AI OCR (Large) */}
                                <div className="fu1 card-hover col-span-2 row-span-2 rounded-[28px] p-8 bg-gradient-to-br from-red-500 to-rose-600 text-white relative overflow-hidden cursor-pointer group">
                                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
                                    <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full bg-white/5" />
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-6">🔍</div>
                                        <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight">AI-Powered<br />OCR</h3>
                                        <p className="text-white/70 text-sm leading-relaxed max-w-xs">Instantly extract text from any screenshot, receipt, or document. Our advanced OCR reads everything with high accuracy.</p>
                                    </div>
                                    {/* Mockup receipt */}
                                    <div className="absolute bottom-6 right-6 w-36 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 rotate-3 group-hover:rotate-0 transition-transform">
                                        <div className="text-[8px] font-bold text-white/80 uppercase mb-1">Detected Text</div>
                                        <div className="space-y-1">
                                            <div className="h-1.5 bg-white/30 rounded-full w-full" />
                                            <div className="h-1.5 bg-white/25 rounded-full w-3/4" />
                                            <div className="h-1.5 bg-white/20 rounded-full w-1/2" />
                                            <div className="mt-2 text-[9px] font-bold text-white/90">₹2,450.00</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 — Smart Tagging */}
                                <div className="fu2 card-hover rounded-[28px] p-6 bg-amber-50 border border-amber-100/80 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute top-[-15px] right-[-15px] w-24 h-24 rounded-full bg-amber-100 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl mb-4">🏷️</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-2">Smart<br /><span className="text-amber-600" style={{ fontStyle: 'italic' }}>Tagging</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed">Auto-tag every image with AI-generated keywords.</p>
                                    </div>
                                </div>

                                {/* Card 3 — Smart Folders */}
                                <div className="fu3 card-hover rounded-[28px] p-6 bg-violet-50 border border-violet-100/80 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 rounded-full bg-violet-100 opacity-60 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-xl mb-4">📁</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-2">Smart<br /><span className="text-violet-600" style={{ fontStyle: 'italic' }}>Folders</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed">Bills, Shopping, Travel — auto-sorted for you.</p>
                                    </div>
                                </div>

                                {/* Card 4 — Amount Detection (Wide) */}
                                <div className="fu4 card-hover col-span-2 rounded-[28px] p-6 bg-emerald-50 border border-emerald-100/80 cursor-pointer relative overflow-hidden group flex items-center gap-6">
                                    <div className="absolute right-[-20px] top-[-20px] w-28 h-28 rounded-full bg-emerald-100 opacity-40 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10 flex-1">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl mb-4">💰</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-1">Amount & Date <span className="text-emerald-600" style={{ fontStyle: 'italic' }}>Detection</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed max-w-xs">Automatically detect ₹ amounts, dates, and OTP codes from your screenshots. Track expenses without typing a number.</p>
                                    </div>
                                    {/* Mini dashboard */}
                                    <div className="hidden sm:block relative z-10 w-36 bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                                        <div className="text-[9px] font-bold text-stone-400 uppercase mb-1">This Month</div>
                                        <div className="text-xl font-black text-emerald-600 mb-2">₹45.2k</div>
                                        <div className="flex items-end gap-1 h-8">
                                            {[35, 55, 40, 70, 50, 80, 65].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? '#10b981' : '#d1fae5' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Row of Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">

                                {/* Card 5 — AI Chat */}
                                <div className="fu5 card-hover rounded-[28px] p-6 bg-sky-50 border border-sky-100/80 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute top-[-15px] right-[-15px] w-20 h-20 rounded-full bg-sky-100 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-xl mb-4">🤖</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-2">AI <span className="text-sky-600" style={{ fontStyle: 'italic' }}>Chat</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed mb-3">Ask questions about any image in natural language.</p>
                                        {/* Mini chat bubbles */}
                                        <div className="space-y-2">
                                            <div className="flex justify-end"><div className="bg-sky-500 text-white text-[10px] px-3 py-1.5 rounded-xl rounded-br-sm font-medium max-w-[80%]">What is the total?</div></div>
                                            <div className="flex justify-start"><div className="bg-white text-stone-600 text-[10px] px-3 py-1.5 rounded-xl rounded-bl-sm font-medium border border-sky-100 max-w-[80%]">The total is ₹2,450</div></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 6 — Export ZIP */}
                                <div className="fu6 card-hover rounded-[28px] p-6 bg-orange-50 border border-orange-100/80 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 rounded-full bg-orange-100 opacity-40 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-xl mb-4">📦</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-2">Bulk <span className="text-orange-600" style={{ fontStyle: 'italic' }}>Export</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed mb-3">Download your vault as an organized ZIP file.</p>
                                        {/* Folder mockup */}
                                        <div className="flex gap-1.5">
                                            {['Bills', 'Travel', 'Shop'].map(f => (
                                                <div key={f} className="bg-white rounded-lg px-2.5 py-1.5 border border-orange-100 text-[9px] font-bold text-stone-500">📂 {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Card 7 — Semantic Search */}
                                <div className="fu5 card-hover rounded-[28px] p-6 bg-pink-50 border border-pink-100/80 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute top-[-10px] left-[-10px] w-20 h-20 rounded-full bg-pink-100 opacity-60 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl mb-4">✨</div>
                                        <h3 className="text-lg font-black text-stone-900 mb-2">Semantic <span className="text-pink-600" style={{ fontStyle: 'italic' }}>Search</span></h3>
                                        <p className="text-xs text-stone-400 leading-relaxed mb-3">Search by meaning, not just keywords.</p>
                                        {/* Search mockup */}
                                        <div className="bg-white rounded-xl px-3 py-2 border border-pink-100 flex items-center gap-2">
                                            <span className="text-pink-300 text-sm">🔍</span>
                                            <span className="text-[10px] text-stone-300 font-medium">flight booking march...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ═══ HOW IT WORKS (DASHBOARD PREVIEW) ═══ */}
            <section id="dashboard" ref={howRef} className="py-16 md:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    {howIn && (
                        <>
                            <div className="text-center mb-14 fu">
                                <span className="inline-block text-[11px] font-black text-red-500 uppercase tracking-widest mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100">How It Works</span>
                                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
                                    Three steps to your <span className="text-red-500" style={{ fontStyle: 'italic' }}>smart vault</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { step: '01', icon: '📤', title: 'Upload Screenshots', desc: 'Drag and drop images, import folders, or paste URLs. We accept all image formats.', color: 'bg-red-500', light: 'bg-red-50', border: 'border-red-100' },
                                    { step: '02', icon: '⚡', title: 'AI Analyzes Everything', desc: 'Our AI reads, categorizes, tags, and extracts data from every image in seconds.', color: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-100' },
                                    { step: '03', icon: '🚀', title: 'Search & Export', desc: 'Find any image by keyword or category. Chat with AI. Download your organized vault.', color: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100' },
                                ].map((item, i) => (
                                    <div key={i} className={`fu${i + 1} card-hover rounded-[28px] p-8 ${item.light} border ${item.border} text-center relative overflow-hidden group`}>
                                        <div className="absolute top-4 right-4 text-6xl font-black text-stone-900/[0.03] select-none">{item.step}</div>
                                        <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-2xl mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Step {item.step}</div>
                                        <h3 className="text-xl font-black text-stone-900 mb-3">{item.title}</h3>
                                        <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ═══ DASHBOARD PREVIEW BENTO ═══ */}
            <section ref={bentoRef} className="py-16 md:py-20 bg-stone-900 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.2), transparent 70%)' }} />
                    <div className="absolute bottom-[10%] right-[15%] w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.2), transparent 70%)' }} />
                </div>
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    {bentoIn && (
                        <>
                            <div className="text-center mb-14 fu">
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                                    Your <span className="text-red-400" style={{ fontStyle: 'italic' }}>Dashboard</span> at a glance
                                </h2>
                                <p className="text-stone-500 font-medium max-w-lg mx-auto">Everything is auto-organized. Here's what your vault looks like.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                {/* Stat Cards */}
                                {[
                                    { label: 'Total Stored', value: '247', icon: '📸', bg: 'from-stone-800 to-stone-700' },
                                    { label: 'Amount Detected', value: '₹45.2k', icon: '💰', bg: 'from-emerald-900/50 to-emerald-800/50' },
                                    { label: 'Categories', value: '8', icon: '📁', bg: 'from-stone-800 to-stone-700' },
                                    { label: 'AI Accuracy', value: '99%', icon: '🎯', bg: 'from-red-900/50 to-rose-800/50' },
                                ].map((s, i) => (
                                    <div key={i} className={`fu${i + 1} rounded-2xl bg-gradient-to-br ${s.bg} border border-white/5 p-5`}>
                                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">{s.label}</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-black text-white">{s.value}</span>
                                            <span className="text-xl opacity-40">{s.icon}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Cards Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
                                {[
                                    { cat: 'Bills', emoji: '📄', summary: 'Electricity bill ₹2,450', tag: 'utility', color: 'from-amber-900/30 to-amber-800/20' },
                                    { cat: 'Travel', emoji: '✈️', summary: 'Flight PNR ABCDEF', tag: 'flight', color: 'from-sky-900/30 to-sky-800/20' },
                                    { cat: 'Banking', emoji: '🏦', summary: 'UPI ₹1,200 to Swiggy', tag: 'payment', color: 'from-violet-900/30 to-violet-800/20' },
                                    { cat: 'Shopping', emoji: '🛍️', summary: 'Amazon order #A7821', tag: 'delivery', color: 'from-rose-900/30 to-rose-800/20' },
                                ].map((item, i) => (
                                    <div key={i} className={`fu${i + 2} rounded-2xl bg-gradient-to-br ${item.color} border border-white/5 p-4 cursor-pointer hover:border-white/15 transition-colors`}>
                                        <div className="text-2xl mb-3 opacity-50">{item.emoji}</div>
                                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">{item.cat}</div>
                                        <div className="text-xs font-semibold text-white/80 mb-2 truncate">{item.summary}</div>
                                        <span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 text-[8px] font-bold text-white/30 rounded-md uppercase">{item.tag}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ═══ PRICING ═══ */}
            <section id="pricing" ref={pricingRef} className="py-16 md:py-24 bg-[#FAF9F7]">
                <div className="max-w-5xl mx-auto px-6">
                    {pricingIn && (
                        <>
                            <div className="text-center mb-14 fu">
                                <span className="inline-block text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-3 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">Pricing</span>
                                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
                                    Simple & <span className="text-emerald-600" style={{ fontStyle: 'italic' }}>transparent</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                {/* Free */}
                                <div className="fu1 card-hover rounded-[28px] bg-white border border-stone-200 p-8">
                                    <div className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Free</div>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-5xl font-black text-stone-900">₹0</span>
                                        <span className="text-stone-400 font-medium text-sm">/forever</span>
                                    </div>
                                    <p className="text-sm text-stone-400 mb-8">Perfect for getting started</p>
                                    <ul className="space-y-3 mb-8">
                                        {['Up to 100 uploads', 'AI auto-tagging & OCR', 'Smart Folders', 'Basic search', 'Community support'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2.5 text-sm text-stone-600 font-medium">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => goTo('#/')} className="w-full py-3.5 rounded-2xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-all">Get Started Free</button>
                                </div>

                                {/* Premium */}
                                <div className="fu2 card-hover rounded-[28px] bg-gradient-to-br from-red-500 to-rose-600 p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10" />
                                    <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-white/5" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-xs font-black text-white/60 uppercase tracking-widest">Premium</div>
                                            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/20 text-white">⭐ Most Popular</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-5xl font-black text-white">₹299</span>
                                            <span className="text-white/50 font-medium text-sm">/month</span>
                                        </div>
                                        <p className="text-sm text-white/50 mb-8">For power users</p>
                                        <ul className="space-y-3 mb-8">
                                            {['Unlimited uploads', 'Advanced AI search', 'Bulk text extraction', 'Priority processing', 'Export as organized ZIP', 'Magic Actions', 'AI Chat Analysis', 'Priority support'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2.5 text-sm text-white/80 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => goTo('#/')} className="w-full py-3.5 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-lg hover:shadow-xl transition-all">Start Premium Trial</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section id="faq" ref={faqRef} className="py-16 md:py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    {faqIn && (
                        <>
                            <div className="text-center mb-12 fu">
                                <span className="inline-block text-[11px] font-black text-violet-600 uppercase tracking-widest mb-3 px-4 py-1.5 bg-violet-50 rounded-full border border-violet-100">FAQ</span>
                                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
                                    Frequently Asked <span className="text-violet-600" style={{ fontStyle: 'italic' }}>Questions</span>
                                </h2>
                            </div>
                            <div className="space-y-3 fu1">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="rounded-2xl border border-stone-200/80 bg-stone-50/50 overflow-hidden hover:border-stone-300 transition-colors">
                                        <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                                            <span className="font-bold text-stone-900 text-[15px] pr-4">{faq.q}</span>
                                            <svg className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${faqOpen === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="px-6 pb-5 text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="py-16 md:py-24 bg-[#FAF9F7] relative">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="rounded-[32px] bg-gradient-to-br from-stone-900 to-stone-800 p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)' }} />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30">
                                <OtterLogo size={32} className="text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Ready to organize your<br />digital life?</h2>
                            <p className="text-stone-500 mb-8 font-medium">Join thousands who trust Otter for their screenshots.</p>
                            <button onClick={() => goTo('#/')} className="cta-glow px-10 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-base shadow-xl shadow-red-500/25 inline-flex items-center gap-2">
                                Get Started — It's Free
                                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-white border-t border-stone-100 py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-500/20">
                                    <OtterLogo size={18} className="text-white" />
                                </div>
                                <span className="text-stone-900 font-black text-lg">Otter</span>
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed">AI-powered screenshot vault. Upload, organize, search, and export your digital memories.</p>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Product</div>
                            <ul className="space-y-2">
                                {['Features', 'Pricing', 'FAQ'].map(i => <li key={i}><a href={`#${i.toLowerCase()}`} className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors">{i}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Legal</div>
                            <ul className="space-y-2">
                                <li><span onClick={() => goTo('#/terms')} className="text-sm text-stone-500 hover:text-stone-900 font-medium cursor-pointer transition-colors">Terms & Conditions</span></li>
                                <li><span onClick={() => goTo('#/privacy')} className="text-sm text-stone-500 hover:text-stone-900 font-medium cursor-pointer transition-colors">Privacy Policy</span></li>
                            </ul>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Contact</div>
                            <ul className="space-y-2">
                                <li><a href="mailto:support@otter-app.com" className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors">support@otter-app.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-stone-400">© 2025–2026 Otter Inc. All rights reserved.</span>
                        <div className="flex gap-4">
                            <span onClick={() => goTo('#/terms')} className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer transition-colors">Terms</span>
                            <span onClick={() => goTo('#/privacy')} className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer transition-colors">Privacy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
