import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SparklesIcon, ArrowLeftIcon, BoltIcon } from '@heroicons/react/24/outline';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import Button from '../components/Button';
import { useLang } from '../context/LanguageContext';
import { getRecommendations } from '../services/cropService';
import { getCurrentWeather } from '../services/weatherService';

// ── Soil types ────────────────────────────────────────────────────────────────
const SOIL_TYPES = [
    { id: 'Loamy', label: 'Loamy', hindi: 'दोमट', emoji: '🟫', desc: 'Fertile, good drainage' },
    { id: 'Clay', label: 'Clay', hindi: 'चिकनी', emoji: '🪨', desc: 'Water-retaining, heavy' },
    { id: 'Sandy', label: 'Sandy', hindi: 'बलुई', emoji: '🏜️', desc: 'Dry, fast draining' },
    { id: 'Black', label: 'Black', hindi: 'काली', emoji: '⬛', desc: 'Cotton soil, rich' },
    { id: 'Red', label: 'Red', hindi: 'लाल', emoji: '🔴', desc: 'Iron-rich, draining' },
    { id: 'Silty', label: 'Silty', hindi: 'गाद', emoji: '🤎', desc: 'River-bank, fertile' },
];

// ── All 36 Indian states & UTs with dominant soil type ───────────────────────
const STATES = [
    // Northern
    { name: 'Delhi', soil: 'Loamy' },
    { name: 'Haryana', soil: 'Loamy' },
    { name: 'Himachal Pradesh', soil: 'Loamy' },
    { name: 'Jammu & Kashmir', soil: 'Loamy' },
    { name: 'Ladakh', soil: 'Sandy' },
    { name: 'Punjab', soil: 'Loamy' },
    { name: 'Rajasthan', soil: 'Sandy' },
    { name: 'Uttarakhand', soil: 'Loamy' },
    { name: 'Uttar Pradesh', soil: 'Loamy' },
    // Central
    { name: 'Chhattisgarh', soil: 'Red' },
    { name: 'Madhya Pradesh', soil: 'Black' },
    // Eastern
    { name: 'Bihar', soil: 'Loamy' },
    { name: 'Jharkhand', soil: 'Red' },
    { name: 'Odisha', soil: 'Red' },
    { name: 'West Bengal', soil: 'Silty' },
    // North-East
    { name: 'Arunachal Pradesh', soil: 'Red' },
    { name: 'Assam', soil: 'Silty' },
    { name: 'Manipur', soil: 'Red' },
    { name: 'Meghalaya', soil: 'Red' },
    { name: 'Mizoram', soil: 'Red' },
    { name: 'Nagaland', soil: 'Red' },
    { name: 'Sikkim', soil: 'Red' },
    { name: 'Tripura', soil: 'Red' },
    // Western
    { name: 'Dadra & NH', soil: 'Loamy' },
    { name: 'Daman & Diu', soil: 'Sandy' },
    { name: 'Goa', soil: 'Loamy' },
    { name: 'Gujarat', soil: 'Black' },
    { name: 'Maharashtra', soil: 'Black' },
    // Southern
    { name: 'Andhra Pradesh', soil: 'Red' },
    { name: 'Karnataka', soil: 'Red' },
    { name: 'Kerala', soil: 'Red' },
    { name: 'Lakshadweep', soil: 'Sandy' },
    { name: 'Puducherry', soil: 'Red' },
    { name: 'Tamil Nadu', soil: 'Red' },
    { name: 'Telangana', soil: 'Red' },
    { name: 'Andaman & Nicobar', soil: 'Red' },
];

// Soil icon mapping for the state soil hint badge
const SOIL_EMOJI = { Loamy: '🟫', Clay: '🪨', Sandy: '🏜️', Black: '⬛', Red: '🔴', Silty: '🤎' };

const suitabilityColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
};

function CropCard({ crop, rank }) {
    const [expanded, setExpanded] = useState(false);
    const isTop = rank === 1;
    return (
        <div className={`card border-2 transition-all ${isTop ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}`}>
            {isTop && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary-600 text-white px-2.5 py-0.5 rounded-full mb-2">
                    ⭐ Best Match
                </span>
            )}
            {crop.quickHarvest && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full mb-2 ml-1">
                    ⚡ 30–60 Days
                </span>
            )}
            <div className="flex items-start gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${isTop ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    {crop.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{crop.name}</h3>
                        <span className="text-gray-400 text-sm">{crop.hindi}</span>
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{crop.season}</span>
                    </div>
                    <div className="mt-2 mb-1">
                        <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-gray-500">Suitability</span>
                            <span className={`font-bold ${crop.suitability >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{crop.suitability}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${suitabilityColor(crop.suitability)}`} style={{ width: `${crop.suitability}%` }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-green-50 rounded-xl px-2 py-1.5 text-center">
                            <p className="text-[10px] text-gray-500">Income/Acre</p>
                            <p className="text-sm font-bold text-green-700">₹{(crop.incomePerAcre / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="bg-red-50 rounded-xl px-2 py-1.5 text-center">
                            <p className="text-[10px] text-gray-500">Investment</p>
                            <p className="text-sm font-bold text-red-600">₹{(crop.investmentPerAcre / 1000).toFixed(0)}K</p>
                        </div>
                    </div>
                </div>
            </div>
            {crop.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {crop.reasons.map((r, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                </div>
            )}
            <button onClick={() => setExpanded(e => !e)} className="mt-3 text-xs text-primary-600 font-semibold">
                {expanded ? '▲ Less info' : '▼ More details'}
            </button>
            {expanded && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                    <p>⏱ <strong>Duration:</strong> {crop.duration}</p>
                    <p>📦 <strong>Yield/Acre:</strong> {crop.yieldPerAcre} quintals</p>
                    <p>💰 <strong>Market Price:</strong> {crop.marketPrice}</p>
                    <p className="text-primary-700 font-medium mt-1.5">💡 {crop.tips}</p>
                </div>
            )}
        </div>
    );
}

export default function CropRecommendation() {
    const { lang } = useLang();
    const [soilType, setSoilType] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [weather, setWeather] = useState({ temp: 28, humidity: 60 });
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [onlyQuick, setOnlyQuick] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('input');

    // When state is selected, auto-suggest its soil type
    const handleStateSelect = (e) => {
        const st = STATES.find(s => s.name === e.target.value) || null;
        setSelectedState(st);
        if (st && !soilType) setSoilType(st.soil); // auto-fill soil type
    };

    const detectWeather = () => {
        if (!navigator.geolocation) return;
        setWeatherLoading(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const w = await getCurrentWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setWeather({ temp: w.temp, humidity: w.humidity });
                toast.success(`📍 ${w.city}: ${w.temp}°C, ${w.humidity}% humidity`);
            } catch { toast.error('Could not fetch weather.'); }
            finally { setWeatherLoading(false); }
        }, () => setWeatherLoading(false));
    };

    const handleSubmit = async () => {
        if (!soilType) { toast.error('Please select soil type'); return; }
        if (!selectedState) { toast.error('Please select your state'); return; }
        setLoading(true);
        try {
            const data = await getRecommendations({
                soilType, state: selectedState.name,
                temp: weather.temp, humidity: weather.humidity,
                onlyQuick,
            });
            setResults(data);
            setStep('results');
        } catch (err) { toast.error(err.message || 'Failed to get recommendations'); }
        finally { setLoading(false); }
    };

    return (
        <div className="page-container bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-5 pt-12 pb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {step === 'results' && (
                            <button onClick={() => setStep('input')} className="text-white/80">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-white text-lg font-bold flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5 text-yellow-300" />
                                Crop Advisor
                            </h1>
                            <p className="text-primary-200 text-xs mt-0.5">
                                {step === 'results'
                                    ? `${onlyQuick ? 'Quick-harvest' : 'Top'} crops for ${soilType} soil · ${selectedState?.name}`
                                    : 'Find the best crop for your land'}
                            </p>
                        </div>
                    </div>
                    <LangToggle />
                </div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                {step === 'input' ? (
                    <>
                        {/* ── Quick-harvest toggle ─────────────────────────── */}
                        <button
                            onClick={() => setOnlyQuick(q => !q)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${onlyQuick ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}
                        >
                            <BoltIcon className={`h-6 w-6 ${onlyQuick ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <div className="text-left">
                                <p className={`text-sm font-bold ${onlyQuick ? 'text-yellow-700' : 'text-gray-700'}`}>
                                    ⚡ Quick Harvest Only (30–60 days)
                                </p>
                                <p className="text-[11px] text-gray-500">Spinach, Radish, Coriander, Methi & more</p>
                            </div>
                            <div className={`ml-auto w-10 h-5 rounded-full transition-colors ${onlyQuick ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${onlyQuick ? 'translate-x-5' : ''}`} />
                            </div>
                        </button>

                        {/* ── Soil type selector ───────────────────────────── */}
                        <div className="card">
                            <h2 className="text-sm font-bold text-gray-700 mb-3">1. Select Soil Type</h2>
                            <div className="grid grid-cols-3 gap-2">
                                {SOIL_TYPES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSoilType(s.id)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${soilType === s.id ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-200'}`}
                                    >
                                        <span className="text-2xl">{s.emoji}</span>
                                        <span className="text-xs font-bold text-gray-700">{lang === 'hi' ? s.hindi : s.label}</span>
                                        <span className="text-[9px] text-gray-400 text-center leading-tight">{s.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── State selector ───────────────────────────────── */}
                        <div className="card">
                            <h2 className="text-sm font-bold text-gray-700 mb-3">2. Select Your State / UT</h2>
                            <select
                                value={selectedState?.name || ''}
                                onChange={handleStateSelect}
                                className="input-field"
                            >
                                <option value="">-- Select State / UT (36 options) --</option>
                                {STATES.map(s => (
                                    <option key={s.name} value={s.name}>
                                        {s.name} ({s.soil} soil)
                                    </option>
                                ))}
                            </select>
                            {selectedState && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                                    <span>{SOIL_EMOJI[selectedState.soil]}</span>
                                    <span><strong>{selectedState.name}</strong> typically has <strong>{selectedState.soil}</strong> soil</span>
                                    {soilType !== selectedState.soil && (
                                        <button
                                            onClick={() => setSoilType(selectedState.soil)}
                                            className="ml-auto text-primary-600 font-semibold whitespace-nowrap"
                                        >
                                            Use {selectedState.soil}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Weather ──────────────────────────────────────── */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-gray-700">3. Current Weather</h2>
                                <button
                                    onClick={detectWeather}
                                    disabled={weatherLoading}
                                    className="text-xs text-primary-600 font-semibold disabled:opacity-60"
                                >
                                    {weatherLoading ? '↻ Detecting...' : '🎯 Auto-detect GPS'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium block mb-1">Temperature (°C)</label>
                                    <input type="number" value={weather.temp} min={0} max={50}
                                        onChange={e => setWeather(w => ({ ...w, temp: Number(e.target.value) }))}
                                        className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-medium block mb-1">Humidity (%)</label>
                                    <input type="number" value={weather.humidity} min={0} max={100}
                                        onChange={e => setWeather(w => ({ ...w, humidity: Number(e.target.value) }))}
                                        className="input-field" />
                                </div>
                            </div>
                        </div>

                        <Button loading={loading} onClick={handleSubmit} icon={SparklesIcon}>
                            Get Recommendations
                        </Button>
                    </>
                ) : (
                    <>
                        {/* ── Results header ───────────────────────────────── */}
                        <div className="card bg-primary-50 border border-primary-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">Season</p>
                                    <p className="font-bold text-primary-800">{results?.season} Season</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-primary-600 font-semibold">Conditions</p>
                                    <p className="text-sm font-bold text-primary-800">{weather.temp}°C · {weather.humidity}% RH</p>
                                </div>
                            </div>
                        </div>

                        {onlyQuick && (
                            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                                <BoltIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                <p className="text-xs text-yellow-700 font-medium">Showing only quick-harvest crops (30–60 days)</p>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 px-1">
                            Showing <strong>{results?.recommendations?.length}</strong> crops for{' '}
                            <strong>{soilType} soil</strong> in <strong>{selectedState?.name}</strong>
                        </p>

                        {results?.recommendations?.map((crop, i) => (
                            <CropCard key={crop.id} crop={crop} rank={i + 1} />
                        ))}

                        <button
                            onClick={() => setStep('input')}
                            className="w-full text-center text-sm text-primary-600 font-semibold py-3"
                        >
                            ← Try Different Conditions
                        </button>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
