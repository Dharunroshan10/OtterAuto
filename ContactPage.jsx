import React, { useState, useEffect } from 'react';
import PublicLayout from './components/PublicLayout';
import { MapPin, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setStatus('sending');

        try {
            const response = await fetch('https://formsubmit.co/ajax/dharunroshan68@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    service: formData.service || 'General Inquiry',
                    message: formData.message,
                    _subject: `New Contact from ${formData.name}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            if (response.ok) {
                setStatus('sent');
                setFormData({ name: '', email: '', service: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <PublicLayout>
            <div className="w-full max-w-5xl rounded-[40px] p-3 flex flex-col md:flex-row overflow-hidden bg-white shadow-xl mx-auto border border-slate-100">
                {/* Left Side: Info */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 text-orange-600 bg-orange-50 text-xs font-bold tracking-widest uppercase mb-8 self-start">
                        <MessageSquare size={14} />
                        <span>Get In Touch</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6 tracking-tight text-slate-900">
                        Make Your Screenshots<br />Organized
                    </h1>

                    <p className="text-lg leading-relaxed font-medium mb-12 max-w-md text-slate-500">
                        Ready to turn your digital clutter into an auto-organized visual library? Fill out the form below or reach out directly to start managing your AI vault perfectly.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                                <MapPin size={20} />
                            </div>
                            <span className="text-base font-bold text-slate-900">Coimbatore, Tamil Nadu, India</span>
                        </div>

                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                                <Mail size={20} />
                            </div>
                            <a href="mailto:support@otter-app.com" className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors">support@otter-app.com</a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 rounded-[32px] p-8 md:p-12 relative flex flex-col justify-center min-h-[500px] bg-[#f97316]">
                    {status === 'sent' ? (
                        <div className="text-center animate-fade-up">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 text-2xl border border-white/30 backdrop-blur-sm">✅</div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Message Sent!</h3>
                            <p className="text-lg text-white/90 font-medium mb-8">Your email has safely reached our AI vault. We'll get back to you soon.</p>
                            <button onClick={() => setStatus('idle')} className="px-8 py-4 rounded-full bg-white text-orange-600 font-bold hover:scale-105 transition-all shadow-xl hover:shadow-white/20">
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 pl-1 text-orange-900/60">Your name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 rounded-xl text-base font-semibold transition-all outline-none bg-[#fb923c] text-white placeholder-orange-200 focus:bg-[#fdba74] focus:ring-2 focus:ring-white/50 border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 pl-1 text-orange-900/60">Your Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-5 py-4 rounded-xl text-base font-semibold transition-all outline-none bg-[#fb923c] text-white placeholder-orange-200 focus:bg-[#fdba74] focus:ring-2 focus:ring-white/50 border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 pl-1 text-orange-900/60">Reason for Contact</label>
                                <div className="relative">
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl text-base font-semibold transition-all appearance-none cursor-pointer pr-12 outline-none bg-[#fb923c] text-white focus:bg-[#fdba74] focus:ring-2 focus:ring-white/50 border-transparent"
                                    >
                                        <option value="" className="text-slate-900 bg-white">Select a reason</option>
                                        <option value="General Support" className="text-slate-900 bg-white">General Support</option>
                                        <option value="Bug Report" className="text-slate-900 bg-white">Bug Report</option>
                                        <option value="Feature Request" className="text-slate-900 bg-white">Feature Request</option>
                                        <option value="API Integration" className="text-slate-900 bg-white">API Integration</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 pl-1 text-orange-900/60">Message (Optional)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about how we can help..."
                                    rows="3"
                                    className="w-full px-5 py-4 rounded-xl text-base font-semibold transition-all outline-none resize-none bg-[#fb923c] text-white placeholder-orange-200 focus:bg-[#fdba74] focus:ring-2 focus:ring-white/50 border-transparent"
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center backdrop-blur-sm">
                                    <span className="text-sm font-bold text-white shadow-sm">Something went wrong. Try again.</span>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'sending' || !formData.name || !formData.email}
                                    className="group w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    ) : (
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                    <span>Send Message</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
