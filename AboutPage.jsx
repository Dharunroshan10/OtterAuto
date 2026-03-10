import React, { useEffect } from 'react';
import PublicLayout from './components/PublicLayout';

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PublicLayout>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 lg:p-16 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 shadow-sm mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Our Mission</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                    The smartest vault for your<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        digital screenshots.
                    </span>
                </h1>
                <p className="text-lg text-slate-600 font-medium mb-12 max-w-2xl leading-relaxed">
                    To ensure no piece of vital information is ever lost in a screenshot again. We automate the organization so you can focus on what matters.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
                    {[
                        { title: "Privacy First", desc: "Encrypted edge storage. We never sell your data.", icon: "🛡️" },
                        { title: "Full Ownership", desc: "It's your data. Export as ZIP or delete it anytime.", icon: "💼" },
                        { title: "Lightning Fast", desc: "AI processes images in milliseconds.", icon: "⚡" },
                        { title: "Cloud Sync", desc: "Securely access your vault anywhere.", icon: "🌐" }
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:-translate-y-1 transition-transform">
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

                <div className="lg:w-1/2 relative z-10">
                    <h2 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3">Technology</h2>
                    <h3 className="text-3xl md:text-4xl font-black mb-6">Built on modern foundations.</h3>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Otter is engineered for speed, privacy, and scale. We don't compromise on the tech stack.
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">⚛️</div>
                            <div>
                                <h4 className="font-bold">React Frontend</h4>
                                <p className="text-sm text-slate-400">Lightning fast SPA</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">🗄️</div>
                            <div>
                                <h4 className="font-bold">Supabase Auth & Storage</h4>
                                <p className="text-sm text-slate-400">Secure edge infrastructure</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">🧠</div>
                            <div>
                                <h4 className="font-bold">Multimodal AI</h4>
                                <p className="text-sm text-slate-400">Llama 3.2 processing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 relative z-10 w-full">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-[2rem] border border-slate-700 p-8 shadow-2xl text-center">
                        <h4 className="text-2xl font-bold mb-4">Ready to clear your camera roll?</h4>
                        <p className="text-slate-400 mb-8">Join Otter today and let our AI organize your visual knowledge base.</p>
                        <button onClick={() => window.location.hash = '#/'} className="bg-white text-slate-900 w-full py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                            Open the App
                        </button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
