import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import { SkeletonList } from '../components/Skeleton';
import { useLang } from '../context/LanguageContext';
import { getSchemes } from '../services/schemesService';

const CATEGORY_COLORS = {
    'Income Support': 'bg-green-100 text-green-700',
    'Insurance': 'bg-blue-100 text-blue-700',
    'Credit & Loans': 'bg-purple-100 text-purple-700',
    'Irrigation': 'bg-cyan-100 text-cyan-700',
    'Solar & Energy': 'bg-yellow-100 text-yellow-800',
    'Organic Farming': 'bg-lime-100 text-lime-700',
    'Pension': 'bg-orange-100 text-orange-700',
    'Market Access': 'bg-pink-100 text-pink-700',
    'Development': 'bg-indigo-100 text-indigo-700',
    'Women Farmers': 'bg-rose-100 text-rose-700',
    'Soil & Technology': 'bg-amber-100 text-amber-800',
};

// Category labels in Hindi
const CATEGORY_HINDI = {
    'Income Support': 'आय सहायता',
    'Insurance': 'बीमा',
    'Credit & Loans': 'ऋण एवं कर्ज',
    'Irrigation': 'सिंचाई',
    'Solar & Energy': 'सौर ऊर्जा',
    'Organic Farming': 'जैविक खेती',
    'Pension': 'पेंशन',
    'Market Access': 'बाजार पहुंच',
    'Development': 'विकास',
    'Women Farmers': 'महिला किसान',
    'Soil & Technology': 'मिट्टी एवं तकनीक',
};

function SchemeCard({ scheme, lang }) {
    const [expanded, setExpanded] = useState(false);
    const hi = lang === 'hi';
    const colorClass = CATEGORY_COLORS[scheme.category] || 'bg-gray-100 text-gray-700';
    const categoryLabel = hi
        ? (scheme.categoryHindi || CATEGORY_HINDI[scheme.category] || scheme.category)
        : scheme.category;

    return (
        <div className={`card border-2 ${scheme.featured ? 'border-primary-300 bg-primary-50' : 'border-gray-200'}`}>
            {scheme.featured && (
                <span className="inline-flex items-center text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full mb-2">
                    ⭐ {hi ? 'विशेष योजना' : 'Featured Scheme'}
                </span>
            )}

            <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${scheme.featured ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    {scheme.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">
                        {hi ? scheme.nameHindi : scheme.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-tight">
                        {hi ? scheme.fullNameHindi : scheme.fullName}
                    </p>
                    <span className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                        {categoryLabel}
                    </span>
                </div>
            </div>

            {/* Benefit */}
            <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mb-0.5">
                    {hi ? 'लाभ' : 'Benefit'}
                </p>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                    {hi ? scheme.benefitHindi : scheme.benefit}
                </p>
            </div>

            {/* Eligibility */}
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-0.5">
                    {hi ? 'कौन आवेदन कर सकता है' : 'Who can apply'}
                </p>
                <p className="text-xs text-gray-700 leading-snug">
                    {hi ? scheme.eligibilityHindi : scheme.eligibility}
                </p>
            </div>

            {/* Expand */}
            <button onClick={() => setExpanded(e => !e)} className="mt-3 text-xs text-primary-600 font-semibold">
                {expanded
                    ? (hi ? '▲ कम जानकारी' : '▲ Less info')
                    : (hi ? '▼ दस्तावेज और अंतिम तिथि' : '▼ Documents & Deadline')}
            </button>

            {expanded && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                    <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase mb-1">
                            📄 {hi ? 'आवश्यक दस्तावेज' : 'Documents Required'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {(hi ? scheme.documentsHindi : scheme.documents).map((d, i) => (
                                <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{d}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">
                            ⏰ {hi ? 'अंतिम तिथि' : 'Deadline'}
                        </p>
                        <p className="text-xs text-gray-700">
                            {hi ? scheme.deadlineHindi : scheme.deadline}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">
                            🏛️ {hi ? 'मंत्रालय' : 'Ministry'}
                        </p>
                        <p className="text-xs text-gray-700">{scheme.ministry}</p>
                    </div>
                </div>
            )}

            {/* Apply button */}
            <a
                href={scheme.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 active:scale-95 transition-all"
            >
                {hi ? 'आवेदन करें / अधिक जानें' : 'Apply / Know More'}
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
        </div>
    );
}

export default function GovernmentSchemes() {
    const { lang } = useLang();
    const hi = lang === 'hi';
    const [schemes, setSchemes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            const res = await getSchemes({ category: selectedCategory, search });
            setSchemes(res.data);
            if (res.categories?.length) setCategories(res.categories);
        } catch {
            toast.error(hi ? 'योजनाएं लोड नहीं हो सकीं' : 'Failed to load schemes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchemes(); }, [selectedCategory, search, lang]);

    return (
        <div className="page-container bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-5 pt-12 pb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-white text-xl font-bold">
                            🏛️ {hi ? 'सरकारी योजनाएं' : 'Govt Schemes'}
                        </h1>
                        <p className="text-indigo-200 text-xs mt-0.5">
                            {loading
                                ? (hi ? 'लोड हो रहा है...' : 'Loading...')
                                : `${schemes.length} ${hi ? 'किसान योजनाएं उपलब्ध' : 'schemes available for farmers'}`}
                        </p>
                    </div>
                    <LangToggle />
                </div>

                {/* Search bar */}
                <div className="relative mt-4">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                    <input
                        type="text"
                        placeholder={hi ? 'पीएम-किसान, फसल बीमा खोजें...' : 'Search PM-KISAN, crop insurance...'}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/20 text-white placeholder-indigo-300 border border-indigo-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                </div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                {/* Category filter chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        {hi ? 'सभी' : 'All'}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            {hi ? (CATEGORY_HINDI[cat] || cat) : cat}
                        </button>
                    ))}
                </div>

                <p className="text-xs text-gray-500 font-medium">
                    {hi
                        ? `${schemes.length} सरकारी योजनाएं`
                        : `Showing ${schemes.length} government scheme${schemes.length !== 1 ? 's' : ''}`}
                </p>

                {loading ? (
                    <div className="card"><SkeletonList count={5} /></div>
                ) : schemes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🏛️</div>
                        <p className="text-gray-600 font-semibold">
                            {hi ? 'कोई योजना नहीं मिली' : 'No schemes found'}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            {hi ? 'किसी अन्य श्रेणी या कीवर्ड से खोजें' : 'Try a different category or keyword'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schemes.map(scheme => (
                            <SchemeCard key={scheme.id} scheme={scheme} lang={lang} />
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
