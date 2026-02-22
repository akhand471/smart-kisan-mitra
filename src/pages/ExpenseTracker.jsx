import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import BottomNav from '../components/BottomNav';
import LangToggle from '../components/LangToggle';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useLang } from '../context/LanguageContext';
import { getExpenses, addExpense, deleteExpense, CATEGORIES } from '../services/expenseService';

const CATEGORY_EMOJI = { Seeds: '🌱', Fertilizer: '🧪', Diesel: '⛽', Pesticide: '🪣', Labour: '👨‍🌾', Irrigation: '💧', Other: '📦' };
const CATEGORY_HINDI = { Seeds: 'बीज', Fertilizer: 'खाद', Diesel: 'डीज़ल', Pesticide: 'कीटनाशक', Labour: 'मजदूरी', Irrigation: 'सिंचाई', Other: 'अन्य' };

const INIT_FORM = { category: 'Seeds', amount: '', date: new Date().toISOString().split('T')[0], note: '' };

export default function ExpenseTracker() {
    const { t, lang } = useLang();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(INIT_FORM);
    const [errors, setErrors] = useState({});
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const now = new Date();

    const loadExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getExpenses();
            setExpenses(data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load expenses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadExpenses(); }, [loadExpenses]);

    const validate = () => {
        const errs = {};
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = t('noData');
        if (!form.date) errs.date = t('noData');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAdd = async () => {
        if (!validate()) return;
        setAdding(true);
        try {
            await addExpense({ ...form, amount: Number(form.amount) });
            await loadExpenses();
            setModalOpen(false);
            setForm(INIT_FORM);
            setErrors({});
            toast.success(lang === 'hi' ? 'खर्च जोड़ा गया!' : 'Expense added successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to add expense');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteExpense(id);
            setExpenses((prev) => prev.filter((e) => e._id !== id));
            toast.success(lang === 'hi' ? 'खर्च हटाया गया' : 'Expense deleted');
        } catch (err) {
            toast.error(err.message || 'Failed to delete expense');
        } finally {
            setDeletingId(null);
        }
    };

    const totalAll = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const monthlyTotal = expenses
        .filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, e) => s + Number(e.amount), 0);

    const catLabel = (c) => lang === 'hi' ? CATEGORY_HINDI[c] || c : c;
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '';

    return (
        <div className="page-container bg-gray-50">
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 pt-12 pb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white text-xl font-bold">{t('expense_title')}</h1>
                        <p className="text-red-100 text-sm mt-0.5">{t('expense_subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <LangToggle />
                        <button
                            id="add-expense-btn"
                            onClick={() => setModalOpen(true)}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                        >
                            <PlusIcon className="h-6 w-6 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="card bg-red-50 border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                            <CalendarDaysIcon className="h-4 w-4 text-red-500" />
                            <p className="text-xs text-red-600 font-semibold">{t('expense_this_month')}</p>
                        </div>
                        <p className="text-xl font-bold text-red-700">₹{monthlyTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="card bg-gray-50 border border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold mb-1">{t('expense_all_time')}</p>
                        <p className="text-xl font-bold text-gray-700">₹{totalAll.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 font-medium">{expenses.length} {t('expense_recorded')}</p>

                {loading ? (
                    <div className="text-center py-14">
                        <div className="text-4xl mb-3 animate-pulse">💰</div>
                        <p className="text-gray-400 text-sm">Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-14 px-4">
                        <div className="text-5xl mb-3">💰</div>
                        <p className="text-gray-600 font-semibold">{t('expense_empty')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('expense_empty_sub')}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {expenses.map((exp) => (
                            <div key={exp._id} className="card flex items-center gap-3">
                                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                    {CATEGORY_EMOJI[exp.category] || '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm">{catLabel(exp.category)}</p>
                                    <p className="text-gray-400 text-xs">{formatDate(exp.date)}</p>
                                    {exp.note && <p className="text-gray-500 text-xs truncate">{exp.note}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-bold text-red-600">₹{Number(exp.amount).toLocaleString('en-IN')}</p>
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        disabled={deletingId === exp._id}
                                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <TrashIcon className={`h-4 w-4 ${deletingId === exp._id ? 'text-gray-300 animate-pulse' : 'text-red-400 hover:text-red-600'}`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setErrors({}); setForm(INIT_FORM); }} title={t('expense_add_title')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('expense_cat_label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setForm(f => ({ ...f, category: cat }))}
                                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-colors text-xs font-medium ${form.category === cat ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                    <span className="text-xl">{CATEGORY_EMOJI[cat]}</span>
                                    {catLabel(cat)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('expense_amount_label')}</label>
                        <input
                            id="expense-amount"
                            type="number"
                            inputMode="numeric"
                            placeholder={t('expense_amount_placeholder')}
                            value={form.amount}
                            onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                            className={`input-field ${errors.amount ? 'input-error' : ''}`}
                        />
                        {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('expense_date_label')}</label>
                        <input
                            id="expense-date"
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                            className={`input-field ${errors.date ? 'input-error' : ''}`}
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('expense_note_label')}</label>
                        <input
                            id="expense-note"
                            type="text"
                            placeholder={t('expense_note_placeholder')}
                            value={form.note}
                            onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    <Button loading={adding} onClick={handleAdd} icon={PlusIcon}>{t('expense_add_btn')}</Button>
                </div>
            </Modal>

            <BottomNav />
        </div>
    );
}
