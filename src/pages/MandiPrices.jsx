import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import { SkeletonList } from '../components/Skeleton';
import { useLang } from '../context/LanguageContext';
import { getMandiPrices, CROPS, STATES } from '../services/mandiService';

function EmptyState({ t }) {
    return (
        <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">🌾</div>
            <p className="text-gray-600 font-semibold">{t('mandi_no_prices')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('mandi_no_prices_sub')}</p>
        </div>
    );
}

const CROP_EMOJI = { Wheat: '🌾', Rice: '🍚', Maize: '🌽', Cotton: '🌸', Potato: '🥔' };
const CROP_HINDI = { Wheat: 'गेहूं', Rice: 'चावल', Maize: 'मक्का', Cotton: 'कपास', Potato: 'आलू' };

export default function MandiPrices() {
    const { t, lang } = useLang();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [search, setSearch] = useState('');

    const fetchPrices = async (crop, state) => {
        setLoading(true);
        try {
            const data = await getMandiPrices(crop, state);
            setPrices(data);
        } catch {
            toast.error('Failed to load prices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPrices(selectedCrop, selectedState); }, [selectedCrop, selectedState]);

    const filtered = prices.filter(
        (p) => p.market.toLowerCase().includes(search.toLowerCase()) || p.crop.toLowerCase().includes(search.toLowerCase())
    );

    const cropLabel = (c) => lang === 'hi' ? `${CROP_EMOJI[c]} ${CROP_HINDI[c] || c}` : `${CROP_EMOJI[c]} ${c}`;

    return (
        <div className="page-container bg-gray-50">
            <div className="bg-gradient-to-r from-accent-600 to-accent-500 px-5 pt-12 pb-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-white text-xl font-bold">{t('mandi_title')}</h1>
                        <p className="text-accent-100 text-sm mt-0.5">{t('mandi_subtitle')}</p>
                    </div>
                    <LangToggle />
                </div>
            </div>

            <div className="px-4 pt-4 space-y-3">
                <div className="card space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FunnelIcon className="h-4 w-4" />
                        {t('filter')}
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">{t('mandi_select_crop')}</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                id="crop-all"
                                onClick={() => setSelectedCrop('')}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCrop ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {t('mandi_all')}
                            </button>
                            {CROPS.map((c) => (
                                <button
                                    key={c}
                                    id={`crop-${c.toLowerCase()}`}
                                    onClick={() => setSelectedCrop(c)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCrop === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cropLabel(c)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">{t('mandi_select_state')}</p>
                        <select
                            id="state-select"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="input-field text-sm py-2.5"
                        >
                            {STATES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        id="search-input"
                        type="text"
                        placeholder={t('mandi_search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10 py-3"
                    />
                </div>

                <p className="text-xs text-gray-500 font-medium">
                    {loading ? t('loading') : `${filtered.length} ${t('results')}`}
                </p>

                {loading ? (
                    <div className="card"><SkeletonList count={6} /></div>
                ) : filtered.length === 0 ? (
                    <EmptyState t={t} />
                ) : (
                    <div className="space-y-2">
                        {filtered.map((item) => (
                            <div key={item.id} className="card flex items-center gap-3">
                                <div className="text-3xl">{CROP_EMOJI[item.crop] || '🌿'}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {lang === 'hi' ? CROP_HINDI[item.crop] || item.crop : item.crop}
                                        </p>
                                        <span className="badge bg-primary-100 text-primary-700">{item.unit}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs truncate">{item.market}</p>
                                    <p className="text-gray-400 text-xs">{item.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary-700">₹{item.price.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400">{t('mandi_per_qtl')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
