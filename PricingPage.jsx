import React, { useEffect } from 'react';
import PublicLayout from './components/PublicLayout';
import { Check, Zap } from 'lucide-react';

export default function PricingPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const plans = [
        {
            name: "Free Tier",
            price: "$0",
            period: "forever",
            desc: "Perfect for individuals managing personal receipts and screenshots.",
            features: [
                "Up to 35 image uploads",
                "Standard AI categorization",
                "Basic semantic search",
                "Community access"
            ],
            buttonText: "Get Started",
            popular: false
        },
        {
            name: "Pro Vault",
            price: "$1",
            period: "per month",
            desc: "Advanced features for professionals dealing with high-volume digital assets.",
            features: [
                "Unlimited image uploads",
                "Bulk ZIP exports structured by AI",
                "Instant Llama 3.2 Vision processing",
                "Priority chat-with-images AI",
                "Priority 24/7 email support"
            ],
            buttonText: "Upgrade to Pro",
            popular: true
        }
    ];

    return (
        <PublicLayout>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 lg:p-16 flex flex-col items-center">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 shadow-sm mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Simple pricing, limitless organization.</h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        Start for free and see how AI can transform your messy camera roll into a highly structured database. Upgrade when you need more power.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative bg-white rounded-3xl p-8 border hover:-translate-y-2 transition-all duration-300 ${plan.popular ? 'border-orange-500 shadow-2xl shadow-orange-500/10' : 'border-slate-200 shadow-sm hover:shadow-xl'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-6">{plan.desc}</p>

                            <div className="mb-8 border-b border-slate-100 pb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500 font-medium">/ {plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3 text-slate-600 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => window.location.hash = '#/'} className={`relative w-full py-4 rounded-xl font-bold text-center transition-all duration-300 overflow-hidden group flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02]' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:scale-[1.02]'} mt-auto`}>
                                {plan.popular && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>}
                                <span className="relative z-10 flex items-center gap-2">{plan.buttonText} {plan.popular && <Zap size={18} className="fill-white/30" />}</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 max-w-2xl mx-auto text-center">
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Need an Enterprise solution?</h4>
                    <p className="text-slate-500 font-medium mb-6">If you need custom API access, dedicated hosting, or high-volume SLA processing, we can build a plan for your business.</p>
                    <button onClick={() => window.location.hash = '#/contact'} className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4">
                        Contact our sales team
                    </button>
                </div>
            </div>
        </PublicLayout>
    );
}
