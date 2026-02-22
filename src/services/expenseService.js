import api from './api';

export const CATEGORIES = ['Seeds', 'Fertilizer', 'Diesel', 'Pesticide', 'Labour', 'Irrigation', 'Other'];

// ── Demo mode fallback (when backend/DB is unavailable) ───────────────────────
const DEMO_KEY = 'kisan_demo_expenses';
const demoGetAll = () => { const d = localStorage.getItem(DEMO_KEY); return d ? JSON.parse(d) : []; };
const demoSaveAll = (list) => localStorage.setItem(DEMO_KEY, JSON.stringify(list));
const isDemoToken = () => {
    try { return JSON.parse(localStorage.getItem('kisan_user'))?.token?.startsWith('demo_jwt_'); } catch { return false; }
};

// ── Get all expenses ──────────────────────────────────────────────────────────
export const getExpenses = async () => {
    if (isDemoToken()) return demoGetAll();
    try {
        const { data } = await api.get('/expenses');
        return data.expenses;
    } catch (err) {
        if (!err.response) return demoGetAll(); // network fallback
        throw err;
    }
};

// ── Get running total ─────────────────────────────────────────────────────────
export const getTotalExpenses = async () => {
    if (isDemoToken()) return demoGetAll().reduce((s, e) => s + Number(e.amount), 0);
    try {
        const { data } = await api.get('/expenses');
        return data.total;
    } catch (err) {
        if (!err.response) return demoGetAll().reduce((s, e) => s + Number(e.amount), 0);
        throw err;
    }
};

// ── Get monthly total ─────────────────────────────────────────────────────────
export const getMonthlyTotal = async (month, year) => {
    if (isDemoToken()) {
        return demoGetAll()
            .filter((e) => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; })
            .reduce((s, e) => s + Number(e.amount), 0);
    }
    try {
        const { data } = await api.get('/expenses', { params: { month: month + 1, year } });
        return data.total;
    } catch (err) {
        if (!err.response) return 0;
        throw err;
    }
};

// ── Add expense ───────────────────────────────────────────────────────────────
export const addExpense = async (expense) => {
    if (isDemoToken()) {
        const list = demoGetAll();
        const newItem = { ...expense, _id: 'demo_' + Date.now(), createdAt: new Date().toISOString() };
        list.unshift(newItem);
        demoSaveAll(list);
        return newItem;
    }
    try {
        const { data } = await api.post('/expenses', expense);
        return data.expense;
    } catch (err) {
        if (!err.response) throw new Error('Backend unavailable');
        throw err;
    }
};

// ── Delete expense ────────────────────────────────────────────────────────────
export const deleteExpense = async (id) => {
    if (isDemoToken()) {
        demoSaveAll(demoGetAll().filter((e) => e._id !== id));
        return;
    }
    try {
        await api.delete(`/expenses/${id}`);
    } catch (err) {
        if (!err.response) throw new Error('Backend unavailable');
        throw err;
    }
};
