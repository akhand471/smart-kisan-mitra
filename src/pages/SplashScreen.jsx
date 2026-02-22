import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function SplashScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLang();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(user ? '/dashboard' : '/login', { replace: true });
        }, 2200);
        return () => clearTimeout(timer);
    }, [navigate, user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 flex flex-col items-center justify-center">
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-10 left-10 text-8xl">🌾</div>
                <div className="absolute top-40 right-8 text-6xl">🌱</div>
                <div className="absolute bottom-40 left-8 text-6xl">🌿</div>
                <div className="absolute bottom-20 right-16 text-7xl">🌻</div>
            </div>

            <div className="relative flex flex-col items-center gap-6 px-8">
                <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-6xl animate-bounce">
                    🌾
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-wide">{t('appName')}</h1>
                    <p className="text-primary-200 mt-2 text-base font-medium">आपका कृषि साथी</p>
                    <p className="text-primary-300 mt-1 text-sm">Your Agriculture Companion</p>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                    <p className="text-primary-200 text-sm">{t('splash_loading')}</p>
                </div>

                <div className="mt-6 px-4 py-1.5 bg-white/10 rounded-full">
                    <span className="text-primary-200 text-xs font-medium">v1.0.0 — {t('splash_tagline')}</span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" className="w-full fill-primary-800/50">
                    <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
                </svg>
            </div>
        </div>
    );
}
