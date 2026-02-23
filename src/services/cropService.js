import api from './api';

// ── Calculate profit/loss ─────────────────────────────────────────────────────
export const calculateCrop = async (data) => {
    const { data: res } = await api.post('/crop/calculate', data);
    return res.result;
};

// ── Get high-income crop recommendations ──────────────────────────────────────
// params: { soilType, state, temp, humidity }
export const getRecommendations = async (params) => {
    const { data } = await api.post('/crop/recommend', params);
    return data; // { season, inputs, recommendations[] }
};
