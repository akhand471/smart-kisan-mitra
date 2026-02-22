import api from './api';

// ── Get mandi prices with optional crop/state filters ─────────────────────────
// GET /api/mandi?crop=Wheat&state=up
// Returns { success, count, data: [...] }
export const getMandiPrices = async (crop = '', state = '') => {
    const params = {};
    if (crop) params.crop = crop;
    if (state && state !== 'all') params.state = state;
    const { data } = await api.get('/mandi', { params });
    return data.data; // array of price objects
};

export const CROPS = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Potato'];
export const STATES = [
    { value: 'all', label: 'All States' },
    { value: 'up', label: 'Uttar Pradesh' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'mp', label: 'Madhya Pradesh' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'tamilnadu', label: 'Tamil Nadu' },
    { value: 'wb', label: 'West Bengal' },
];

