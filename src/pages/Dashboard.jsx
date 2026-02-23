import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import { SkeletonCard } from '../components/Skeleton';
import { getCurrentWeather } from '../services/weatherService';
import { getMandiPrices } from '../services/mandiService';
import { getTotalExpenses } from '../services/expenseService';
import {
    CloudIcon, ShoppingBagIcon, CurrencyRupeeIcon, ChartBarIcon,
    ArrowRightIcon, BellIcon,
} from '@heroicons/react/24/outline';

function SummaryCard({ icon: Icon, label, value, sub, gradient, id }) {
    return (
        <div id={id} className={`rounded-2xl p-4 text-white shadow-md ${gradient}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
            <p className="text-sm font-medium text-white/80">{label}</p>
            <p className="text-2xl font-bold mt-0.5">{value}</p>
            {sub && <p className="text-xs text-white/70 mt-1">{sub}</p>}
        </div>
    );
}

function QuickActionBtn({ icon, label, to }) {
    const navigate = useNavigate();
    const colors = {
        '/mandi': 'border-amber-200 bg-amber-50 hover:bg-amber-100',
        '/calculator': 'border-blue-200 bg-blue-50 hover:bg-blue-100',
        '/expenses': 'border-red-200 bg-red-50 hover:bg-red-100',
        '/weather': 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    };
    return (
        <button
            onClick={() => navigate(to)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${colors[to] || ''} transition-all active:scale-95`}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
        </button>
    );
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { t } = useLang();
    const navigate = useNavigate();

    const [weather, setWeather] = useState(null);
    const [mandiPrice, setMandiPrice] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [w, prices, total] = await Promise.all([
                    getCurrentWeather(),
                    getMandiPrices('Wheat'),
                    getTotalExpenses(),
                ]);
                setWeather(w);
                setMandiPrice(prices[0]);
                setTotalExpenses(total || 0);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const estimatedRevenue = 12000;
    const profit = estimatedRevenue - totalExpenses;

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t('dash_good_morning');
        if (h < 17) return t('dash_good_afternoon');
        return t('dash_good_evening');
    };

    return (
        <div className="page-container bg-gray-50">
            <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-5 pt-12 pb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-primary-200 text-sm font-medium">{greeting()},</p>
                        <h1 className="text-white text-xl font-bold mt-0.5">{user?.name || 'Kisan Ji'} 👋</h1>
                        <p className="text-primary-300 text-xs mt-1">+91 {user?.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <LangToggle />
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="text-primary-200 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>

                <div className="mt-4 bg-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <BellIcon className="h-4 w-4 text-accent-300" />
                    <p className="text-white/90 text-xs font-medium">
                        {t('dash_today')}: {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="px-4 pt-5 space-y-5">
                <div>
                    <h2 className="section-title">{t('dash_farm_summary')}</h2>
                    {loading ? (
                        <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <SummaryCard id="weather-card" icon={CloudIcon} label={t('dash_weather_label')} value={`${weather?.temp || '--'}°C`} sub={weather?.condition} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                            <SummaryCard id="mandi-card" icon={ShoppingBagIcon} label={t('dash_wheat_price')} value={`₹${mandiPrice?.price || '--'}`} sub={t('dash_per_quintal')} gradient="bg-gradient-to-br from-accent-500 to-accent-600" />
                            <SummaryCard id="expense-card" icon={CurrencyRupeeIcon} label={t('dash_total_expenses')} value={`₹${totalExpenses.toLocaleString('en-IN')}`} sub={t('dash_all_time')} gradient="bg-gradient-to-br from-red-500 to-red-600" />
                            <SummaryCard id="profit-card" icon={ChartBarIcon} label={t('dash_est_profit')} value={`₹${profit.toLocaleString('en-IN')}`} sub={profit >= 0 ? t('dash_profit') : t('dash_loss')} gradient={profit >= 0 ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gradient-to-br from-gray-500 to-gray-700'} />
                        </div>
                    )}
                </div>

                {/* ── Crop Recommendation Banner ──────────────────── */}
                <button
                    onClick={() => navigate('/recommend')}
                    className="w-full card bg-gradient-to-r from-primary-600 to-primary-700 border-0 text-left hover:opacity-95 active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            ✨
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-base">Get Crop Recommendation</p>
                            <p className="text-primary-200 text-xs mt-0.5">Best crops for your soil, location & weather</p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-white/70 flex-shrink-0" />
                    </div>
                </button>

                {/* ── Govt Schemes Banner ─────────────────────────── */}
                <button
                    onClick={() => navigate('/schemes')}
                    className="w-full card bg-gradient-to-r from-indigo-600 to-indigo-700 border-0 text-left hover:opacity-95 active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            🏛️
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-base">Government Schemes</p>
                            <p className="text-indigo-200 text-xs mt-0.5">PM-KISAN, PMFBY, KCC & 15+ farmer schemes</p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-white/70 flex-shrink-0" />
                    </div>
                </button>

                <div>
                    <h2 className="section-title">{t('dash_quick_actions')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <QuickActionBtn icon="🌾" label={t('dash_mandi')} to="/mandi" />
                        <QuickActionBtn icon="🧮" label={t('dash_calculator')} to="/calculator" />
                        <QuickActionBtn icon="💰" label={t('dash_expenses')} to="/expenses" />
                        <QuickActionBtn icon="⛅" label={t('dash_weather')} to="/weather" />
                    </div>
                </div>

                <div className="card border-l-4 border-l-primary-500 bg-primary-50">
                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">{t('dash_tip_title')}</p>
                    <p className="text-sm text-gray-700">{t('dash_tip_text')}</p>
                    <button onClick={() => navigate('/mandi')} className="mt-3 flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
                        {t('dash_view_prices')} <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
