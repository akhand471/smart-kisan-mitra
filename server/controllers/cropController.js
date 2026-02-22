const asyncHandler = require('../middleware/asyncHandler');

// ─── @desc   Calculate crop profit/loss (no database)
// ─── @route  POST /api/crop/calculate
// ─── @access Public
const calculateCrop = asyncHandler(async (req, res) => {
    const { seedCost, fertilizerCost, labourCost, landArea, expectedYield, marketPrice } = req.body;

    // Input validation
    const requiredFields = { seedCost, fertilizerCost, labourCost, landArea, expectedYield, marketPrice };
    const missing = Object.entries(requiredFields)
        .filter(([, v]) => v === undefined || v === null || v === '')
        .map(([k]) => k);

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missing.join(', ')}`,
        });
    }

    const numericFields = { seedCost, fertilizerCost, labourCost, landArea, expectedYield, marketPrice };
    for (const [key, val] of Object.entries(numericFields)) {
        if (isNaN(Number(val)) || Number(val) < 0) {
            return res.status(400).json({ success: false, message: `${key} must be a non-negative number` });
        }
    }

    const s = Number(seedCost);
    const f = Number(fertilizerCost);
    const l = Number(labourCost);
    const area = Number(landArea);
    const yield_ = Number(expectedYield);
    const price = Number(marketPrice);

    const totalCost = s + f + l;
    const expectedRevenue = yield_ * price;
    const estimatedProfit = expectedRevenue - totalCost;
    const costPerAcre = area > 0 ? totalCost / area : 0;
    const revenuePerAcre = area > 0 ? expectedRevenue / area : 0;
    const profitMargin = expectedRevenue > 0
        ? parseFloat(((estimatedProfit / expectedRevenue) * 100).toFixed(2))
        : 0;

    res.status(200).json({
        success: true,
        result: {
            totalCost,
            expectedRevenue,
            estimatedProfit,
            costPerAcre: parseFloat(costPerAcre.toFixed(2)),
            revenuePerAcre: parseFloat(revenuePerAcre.toFixed(2)),
            profitMargin,
            isProfitable: estimatedProfit >= 0,
            inputs: { seedCost: s, fertilizerCost: f, labourCost: l, landArea: area, expectedYield: yield_, marketPrice: price },
        },
    });
});

module.exports = { calculateCrop };
