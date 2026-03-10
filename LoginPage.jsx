import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Loader2 } from 'lucide-react';

const OtterLogo = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="50" cy="50" r="40" />
        <ellipse cx="50" cy="50" rx="40" ry="15" />
    </svg>
);

export default function LoginPage() {
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        // If already logged in, redirect to dashboard
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                window.location.hash = '#/';
            }
        });
    }, []);

    const handleGoogleLogin = async () => {
        setLoginError('');
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            setLoginError("Failed to sign in with Google. " + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#ffedd5_0%,_transparent_50%)] opacity-60 pointer-events-none"></div>

            <button
                onClick={() => window.location.hash = '#/'}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors z-10"
            >
                ← Back to Home
            </button>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative z-10 animate-fade-up">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 shadow-inner ring-1 ring-orange-100/50">
                        <OtterLogo size={32} className="text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium">Sign in to access your intelligent vault</p>
                </div>

                {loginError && (
                    <div className="mb-6 flex items-start gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-100 animate-fade-up">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-red-600 font-black text-xs">!</span>
                        </div>
                        <p className="text-red-700 text-sm font-semibold leading-snug">{loginError}</p>
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-2xl px-5 transition-all duration-300 shadow-sm mb-6 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    ) : (
                        <>
                            <svg width="22" height="22" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="font-bold text-slate-700 group-hover:text-orange-700 transition-colors">Continue with Google</span>
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">🔒</div>
                        <span className="text-xs font-semibold text-slate-500">Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">☁️</div>
                        <span className="text-xs font-semibold text-slate-500">Cloud Sync</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
