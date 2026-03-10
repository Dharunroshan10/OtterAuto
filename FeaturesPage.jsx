import React, { useEffect } from 'react';
import PublicLayout from './components/PublicLayout';
import { Zap, Search, MessageCircle, Shield, Layers, Download } from 'lucide-react';

export default function FeaturesPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-orange-500" />,
            title: "Instant AI Categorization",
            desc: "The moment you drag and drop an image, our advanced Llama 3.2 Vision Model scans it in milliseconds. It instantly understands context, separating banking screenshots from design memes into perfectly neat folders."
        },
        {
            icon: <Search className="w-8 h-8 text-blue-500" />,
            title: "Deep Semantic Search",
            desc: "Stop scrolling endlessly. Thanks to powerful Optical Character Recognition and semantic AI tagging, you can simply type 'airport coffee receipt' and Otter finds exactly what you're looking for based on the image contents."
        },
        {
            icon: <MessageCircle className="w-8 h-8 text-emerald-500" />,
            title: "Chat with your Images",
            desc: "Our platform doesn't just store images; it interprets them. Need to summarize meeting notes you photographed? Want to extract all items from a grocery receipt into a text list? Just ask the AI Assistant inside the vault."
        },
        {
            icon: <Shield className="w-8 h-8 text-purple-500" />,
            title: "Encrypted Cloud Storage",
            desc: "Security is paramount. Your screenshots—especially sensitive ones containing financial or personal data—are stored securely using Supabase infrastructure with Row Level Security. Only your authenticated Google account has access."
        },
        {
            icon: <Layers className="w-8 h-8 text-rose-500" />,
            title: "Bulk Processing Power",
            desc: "Unlike simple consumer tools, Otter is built for power users. Upload hundreds of screenshots simultaneously. Our asynchronous queuing system processes multiple images in parallel without freezing your browser."
        },
        {
            icon: <Download className="w-8 h-8 text-cyan-500" />,
            title: "Structured ZIP Exports",
            desc: "Your data is yours. When it's time to do your taxes or archive a project, you can download everything with one click. Otter automatically structures your ZIP file into neat folders based on categories, preventing desktop clutter."
        }
    ];

    return (
        <PublicLayout>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 lg:p-16 flex flex-col items-center">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 shadow-sm mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Features</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to organize your chaos.</h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        Every day, we capture recipes, design inspiration, payment confirmations, and flight tickets.
                        The problem? They all get dumped into a single, chaotic folder. Otter fixes this by providing intelligent interpretation of your images.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-xl p-10 lg:p-16 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Experience intelligent image management.</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
                        Stop treating screenshots like photos and treat them like data. Create an account for free and instantly upgrade your workflow.
                    </p>
                    <button onClick={() => window.location.hash = '#/'} className="bg-orange-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/20 inline-flex items-center gap-2">
                        Start your Vault <Zap size={20} />
                    </button>
                </div>
            </div>
        </PublicLayout>
    );
}
