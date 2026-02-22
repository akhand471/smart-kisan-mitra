import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CalculatorIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import Button from '../components/Button';
import Input from '../components/Input';
import { useLang } from '../context/LanguageContext';
import { calculateCrop } from '../services/cropService';

const INITIAL = { seedCost: '', fertilizerCost: '', labourCost: '', landArea: '', expectedYield: '', pricePerQuintal: '' };

export default function CropCalculator() {
    const { t } = useLang();
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const errs = {};
        Object.entries(form).forEach(([k, v]) => {
            if (!v || isNaN(v) || Number(v) < 0) errs[k] = t('noData');
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const calculate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            // Map pricePerQuintal → marketPrice (field name backend expects)
            const res = await calculateCrop({
                seedCost: form.seedCost,
                fertilizerCost: form.fertilizerCost,
                labourCost: form.labourCost,
                landArea: form.landArea,
                expectedYield: form.expectedYield,
                marketPrice: form.pricePerQuintal,
            });
            // Backend returns: { totalCost, expectedRevenue, estimatedProfit, costPerAcre, profitMargin }
            setResult({
                totalCost: res.totalCost,
                revenue: res.expectedRevenue,
                profit: res.estimatedProfit,
                costPerAcre: res.costPerAcre,
                profitMargin: res.profitMargin,
            });
        } catch (err) {
            toast.error(err.message || 'Calculation failed');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { setForm(INITIAL); setResult(null); setErrors({}); };

    return (
        <div className="page-container bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 pt-12 pb-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-white text-xl font-bold">{t('calc_title')}</h1>
                        <p className="text-blue-100 text-sm mt-0.5">{t('calc_subtitle')}</p>
                    </div>
                    <LangToggle />
                </div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                <div className="card space-y-4">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5 text-blue-600" />
                        {t('calc_enter_details')}
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        <Input id="seed-cost" label={t('calc_seed')} type="number" placeholder={`${t('calc_placeholder')} 5000`} value={form.seedCost} onChange={(e) => set('seedCost', e.target.value)} error={errors.seedCost} inputMode="numeric" />
                        <Input id="fertilizer-cost" label={t('calc_fertilizer')} type="number" placeholder={`${t('calc_placeholder')} 3000`} value={form.fertilizerCost} onChange={(e) => set('fertilizerCost', e.target.value)} error={errors.fertilizerCost} inputMode="numeric" />
                        <Input id="labour-cost" label={t('calc_labour')} type="number" placeholder={`${t('calc_placeholder')} 4000`} value={form.labourCost} onChange={(e) => set('labourCost', e.target.value)} error={errors.labourCost} inputMode="numeric" />
                        <Input id="land-area" label={t('calc_land')} type="number" placeholder={`${t('calc_placeholder')} 2`} value={form.landArea} onChange={(e) => set('landArea', e.target.value)} error={errors.landArea} inputMode="numeric" />
                        <Input id="expected-yield" label={t('calc_yield')} type="number" placeholder={`${t('calc_placeholder')} 40`} value={form.expectedYield} onChange={(e) => set('expectedYield', e.target.value)} error={errors.expectedYield} inputMode="numeric" />
                        <Input id="price-per-quintal" label={t('calc_price_qtl')} type="number" placeholder={`${t('calc_placeholder')} 2100`} value={form.pricePerQuintal} onChange={(e) => set('pricePerQuintal', e.target.value)} error={errors.pricePerQuintal} inputMode="numeric" />
                    </div>

                    <div className="flex gap-3">
                        <Button loading={loading} onClick={calculate} icon={CalculatorIcon} className="flex-1">{t('calc_btn')}</Button>
                        <button onClick={reset} className="p-3.5 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors" title="Reset">
                            <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {result && (
                    <div className={`card border-2 ${result.profit >= 0 ? 'border-primary-300 bg-primary-50' : 'border-red-300 bg-red-50'}`}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-4 text-gray-500">{t('calc_results')}</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                                <span className="text-gray-600 text-sm">{t('calc_total_cost')}</span>
                                <span className="font-bold text-gray-800 text-base">₹{result.totalCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                                <span className="text-gray-600 text-sm">{t('calc_revenue')}</span>
                                <span className="font-bold text-gray-800 text-base">₹{result.revenue.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                                <span className="text-gray-600 text-sm">{t('calc_cost_per_acre')}</span>
                                <span className="font-bold text-gray-800 text-base">₹{result.costPerAcre.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`flex justify-between items-center py-3 px-4 rounded-xl ${result.profit >= 0 ? 'bg-primary-100' : 'bg-red-100'}`}>
                                <span className={`font-bold text-base ${result.profit >= 0 ? 'text-primary-700' : 'text-red-700'}`}>
                                    {result.profit >= 0 ? t('calc_profit') : t('calc_loss')}
                                </span>
                                <span className={`text-xl font-bold ${result.profit >= 0 ? 'text-primary-700' : 'text-red-700'}`}>
                                    ₹{Math.abs(result.profit).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!result && (
                    <div className="card bg-blue-50 border border-blue-200">
                        <p className="text-blue-700 text-sm font-medium">{t('calc_tip_title')}</p>
                        <p className="text-blue-600 text-xs mt-1">{t('calc_tip_text')}</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
