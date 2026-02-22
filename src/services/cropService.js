import api from './api';

// ── Calculate crop profit/loss ────────────────────────────────────────────────
// POST /api/crop/calculate
// Body: { seedCost, fertilizerCost, labourCost, landArea, expectedYield, marketPrice }
// Returns { success, result: { totalCost, expectedRevenue, estimatedProfit, ... } }
export const calculateCrop = async (inputs) => {
    const { data } = await api.post('/crop/calculate', inputs);
    return data.result;
};
