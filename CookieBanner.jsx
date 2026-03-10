import React, { useState, useEffect } from 'react';
import { Cookie, Settings, X, Check } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true
        analytics: true,
        marketing: true,
    });

    useEffect(() => {
        const consent = localStorage.getItem('otter_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        } else {
            try {
                const parsedConsent = JSON.parse(consent);
                // Don't show banner if consent was already given
            } catch (e) {
                // If it's a legacy simple string like "true", we assume they accepted all previously
                // but might want to re-show it, or just keep it hidden. We will just keep it hidden.
            }
        }
    }, []);

    const saveConsent = (settings) => {
        localStorage.setItem('otter_cookie_consent', JSON.stringify(settings));
        setIsVisible(false);
        setShowPreferences(false);
        // Typically, this is where you'd initialize/destroy Google AdSense or Analytics scripts based on the booleans
    };

    const acceptAll = () => {
        const allConsent = { necessary: true, analytics: true, marketing: true };
        setPreferences(allConsent);
        saveConsent(allConsent);
    };

    const rejectAll = () => {
        const minimalConsent = { necessary: true, analytics: false, marketing: false };
        setPreferences(minimalConsent);
        saveConsent(minimalConsent);
    };

    const savePreferences = () => {
        saveConsent(preferences);
    };

    if (!isVisible) return null;

    if (showPreferences) {
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                                <Settings size={22} />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Cookie Preferences</h2>
                        </div>
                        <button onClick={() => setShowPreferences(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-50 md:ml-auto">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6" style={{ maxHeight: 'max(400px, 50vh)' }}>
                        <p className="text-slate-600 font-medium">
                            We use cookies to improve your browsing experience, deliver personalized ads or content, and analyze our traffic. You can customize your preferences below.
                        </p>

                        <div className="space-y-4">
                            {/* Necessary */}
                            <div className="p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-2 relative">
                                <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                    Always Active
                                </div>
                                <h3 className="font-bold text-slate-900 pr-24">Strictly Necessary Cookies</h3>
                                <p className="text-sm text-slate-600 font-medium mt-1">These cookies are essential for the website to function properly and cannot be disabled. They are usually only set in response to actions made by you, such as setting your privacy preferences.</p>
                            </div>

                            {/* Analytics */}
                            <div className="p-4 md:p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2 hover:border-slate-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-bold text-slate-900">Analytics cookies</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-slate-600 font-medium mt-1">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.</p>
                            </div>

                            {/* Marketing / AdSense */}
                            <div className="p-4 md:p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2 hover:border-slate-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-bold text-slate-900">Marketing & Advertising</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                            checked={preferences.marketing}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-slate-600 font-medium mt-1">These cookies may be set through our site by our advertising partners (like Google AdSense). They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3 rounded-b-[2rem]">
                        <button onClick={rejectAll} className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
                            Reject All
                        </button>
                        <button onClick={savePreferences} className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all">
                            Save Preferences
                        </button>
                        <button onClick={acceptAll} className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2">
                            <Check size={18} strokeWidth={3} /> Accept All
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl bg-white md:rounded-[2rem] border-t md:border border-slate-200/60 p-5 md:p-6 z-[100] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-3xl">
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center text-orange-500 shrink-0 border border-orange-100">
                    <Cookie size={24} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-slate-900 font-extrabold text-base tracking-tight flex items-center gap-2">
                        <Cookie size={18} className="sm:hidden text-orange-500" />
                        Your privacy choices
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-2xl">
                        We use cookies and similar technologies, including third-party trackers (like Google), to personalize content, deliver tailored ads, and analyze our traffic. By clicking <span className="font-bold text-slate-800">Accept All</span>, you consent to this processing as described in our <a href="#/privacy" className="text-orange-500 hover:text-orange-600 underline font-semibold">Privacy Policy</a>.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                <button
                    onClick={() => setShowPreferences(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap text-sm"
                >
                    Preferences
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={rejectAll}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all whitespace-nowrap text-sm flex-1"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptAll}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all whitespace-nowrap text-sm flex-1"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
