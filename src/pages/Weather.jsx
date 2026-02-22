import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import { useLang } from '../context/LanguageContext';
import { getCurrentWeather, getForecast } from '../services/weatherService';

// Map condition strings → emoji icons (backend sends condition text, not emojis)
const conditionEmoji = (condition = '') => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sunny')) return '☀️';
    if (c.includes('partly')) return '⛅';
    if (c.includes('cloud') || c.includes('overcast')) return '☁️';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
    if (c.includes('thunder') || c.includes('storm')) return '⛈️';
    if (c.includes('snow') || c.includes('sleet')) return '❄️';
    if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '🌫️';
    if (c.includes('wind')) return '💨';
    return '🌤️';
};

// Format a forecast datetime string to a short day label
const dayLabel = (item, index) => {
    if (index === 0) return 'Today';
    if (item.datetime) {
        const d = new Date(item.datetime);
        return d.toLocaleDateString('en-IN', { weekday: 'short' });
    }
    return item.day || '—';
};

function WeatherStat({ icon, label, value }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="text-2xl">{icon}</div>
            <p className="text-xs text-blue-200">{label}</p>
            <p className="text-white font-bold text-sm">{value ?? '—'}</p>
        </div>
    );
}

export default function Weather() {
    const { t } = useLang();
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [w, f] = await Promise.all([getCurrentWeather(), getForecast()]);
                setCurrent(w);
                setForecast(Array.isArray(f) ? f : []);
            } catch (err) {
                setError(err.message || 'Could not load weather data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getRainAdvice = (rain) => {
        if (rain >= 70) return { text: t('weather_advice_high'), color: 'bg-blue-100 text-blue-700 border-blue-200' };
        if (rain >= 40) return { text: t('weather_advice_med'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        return { text: t('weather_advice_low'), color: 'bg-green-100 text-green-700 border-green-200' };
    };

    const rainChance = current?.rainChance ?? 0;
    const advice = current ? getRainAdvice(rainChance) : null;
    const emoji = current ? conditionEmoji(current.condition) : '🌤️';

    return (
        <div className="page-container bg-gray-50">
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-5 pt-12 pb-8">
                <div className="flex items-start justify-between mb-2">
                    <p className="text-blue-200 text-sm font-medium">{t('weather_title')}</p>
                    <LangToggle />
                </div>

                {loading ? (
                    <div className="mt-4 animate-pulse space-y-3">
                        <div className="h-16 bg-white/20 rounded-xl" />
                        <div className="h-4 bg-white/20 rounded-xl w-1/2" />
                    </div>
                ) : error ? (
                    <p className="text-red-200 text-sm mt-4">{error}</p>
                ) : current ? (
                    <>
                        {/* Current temp + icon */}
                        <div className="flex items-center gap-3 mt-3 mb-2">
                            {/* If backend sent an OWM image URL, show <img>, otherwise show emoji */}
                            {current.icon && current.icon.startsWith('http') ? (
                                <img src={current.icon} alt={current.condition} className="w-16 h-16 drop-shadow-lg" />
                            ) : (
                                <span className="text-6xl">{emoji}</span>
                            )}
                            <div>
                                <p className="text-6xl font-bold text-white leading-none">{current.temp}°</p>
                                <p className="text-blue-100 text-sm mt-1">{current.condition}</p>
                            </div>
                        </div>
                        <p className="text-blue-200 text-sm">📍 {current.city}</p>
                        <p className="text-blue-200 text-xs mt-1">{t('weather_feels')} {current.feelsLike}°C</p>

                        {/* Stats bar */}
                        <div className="grid grid-cols-4 gap-2 mt-5 bg-white/10 rounded-2xl p-3">
                            <WeatherStat icon="💧" label={t('weather_humidity')} value={`${current.humidity}%`} />
                            <WeatherStat icon="🌧️" label={t('weather_rain')} value={`${rainChance}%`} />
                            <WeatherStat icon="💨" label={t('weather_wind')} value={`${current.windSpeed} km/h`} />
                            <WeatherStat icon="☀️" label={t('weather_uv')} value={current.uvIndex != null ? current.uvIndex : '—'} />
                        </div>
                    </>
                ) : null}
            </div>

            <div className="px-4 pt-4 space-y-4">
                {advice && (
                    <div className={`card border ${advice.color}`}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">{t('weather_advice_title')}</p>
                        <p className="text-sm font-medium">{advice.text}</p>
                    </div>
                )}

                {/* 5-Day Forecast */}
                <div>
                    <h2 className="section-title">{t('weather_forecast_title')}</h2>
                    {loading ? (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex-shrink-0 w-24 h-32 bg-gray-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {forecast.map((day, i) => {
                                const icon = conditionEmoji(day.condition);
                                const rain = day.rainProbability ?? day.rain ?? 0;
                                const label = dayLabel(day, i);
                                return (
                                    <div key={i} className={`flex-shrink-0 w-24 card flex flex-col items-center gap-2 ${i === 0 ? 'border-2 border-primary-400 bg-primary-50' : ''}`}>
                                        <p className={`text-xs font-bold ${i === 0 ? 'text-primary-700' : 'text-gray-500'}`}>
                                            {label}
                                        </p>
                                        <span className="text-3xl">{icon}</span>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-800">{day.high ?? day.temp}°</p>
                                            <p className="text-xs text-gray-400">{day.low}°</p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <span className="text-[10px]">🌧️</span>
                                            <p className="text-[10px] text-blue-500 font-medium">{rain}%</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Seasonal tips */}
                <div className="card bg-amber-50 border border-amber-200">
                    <p className="text-amber-700 text-sm font-bold mb-2">🌱 {t('weather_tips_title')}</p>
                    <ul className="space-y-1.5 text-xs text-amber-700">
                        <li>• {t('weather_tip1')}</li>
                        <li>• {t('weather_tip2')}</li>
                        <li>• {t('weather_tip3')}</li>
                    </ul>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
