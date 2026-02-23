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
    // States
    { value: 'ap', label: 'Andhra Pradesh' },
    { value: 'ar', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'cg', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'hp', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'mp', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamilnadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'up', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'wb', label: 'West Bengal' },
    // Union Territories
    { value: 'andaman', label: 'Andaman & Nicobar Islands' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'dnh', label: 'Dadra & Nagar Haveli' },
    { value: 'dd', label: 'Daman & Diu' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'jk', label: 'Jammu & Kashmir' },
    { value: 'ladakh', label: 'Ladakh' },
    { value: 'lakshadweep', label: 'Lakshadweep' },
    { value: 'puducherry', label: 'Puducherry' },
];

