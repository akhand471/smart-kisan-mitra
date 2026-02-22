const asyncHandler = require('../middleware/asyncHandler');

// Mock Mandi price data — replace with real scraping or eNAM API in production
const MANDI_DATA = [
    { id: 1, crop: 'Wheat', market: 'Azadpur, Delhi', state: 'delhi', price: 2150, unit: 'Quintal', date: '2026-02-21' },
    { id: 2, crop: 'Wheat', market: 'Kanpur Mandi', state: 'up', price: 2080, unit: 'Quintal', date: '2026-02-21' },
    { id: 3, crop: 'Wheat', market: 'Ludhiana Mandi', state: 'punjab', price: 2200, unit: 'Quintal', date: '2026-02-21' },
    { id: 4, crop: 'Wheat', market: 'Jaipur Mandi', state: 'rajasthan', price: 2100, unit: 'Quintal', date: '2026-02-21' },
    { id: 5, crop: 'Rice', market: 'Patna Mandi', state: 'bihar', price: 3200, unit: 'Quintal', date: '2026-02-21' },
    { id: 6, crop: 'Rice', market: 'Cuttack Mandi', state: 'odisha', price: 3100, unit: 'Quintal', date: '2026-02-21' },
    { id: 7, crop: 'Rice', market: 'Karimnagar Mandi', state: 'telangana', price: 2950, unit: 'Quintal', date: '2026-02-21' },
    { id: 8, crop: 'Rice', market: 'Thanjavur Mandi', state: 'tamilnadu', price: 3050, unit: 'Quintal', date: '2026-02-21' },
    { id: 9, crop: 'Maize', market: 'Gulbarga Mandi', state: 'karnataka', price: 1850, unit: 'Quintal', date: '2026-02-21' },
    { id: 10, crop: 'Maize', market: 'Davangere Mandi', state: 'karnataka', price: 1780, unit: 'Quintal', date: '2026-02-21' },
    { id: 11, crop: 'Maize', market: 'Nizamabad Mandi', state: 'telangana', price: 1820, unit: 'Quintal', date: '2026-02-21' },
    { id: 12, crop: 'Maize', market: 'Indore Mandi', state: 'mp', price: 1760, unit: 'Quintal', date: '2026-02-21' },
    { id: 13, crop: 'Cotton', market: 'Akola Mandi', state: 'maharashtra', price: 6800, unit: 'Quintal', date: '2026-02-21' },
    { id: 14, crop: 'Cotton', market: 'Rajkot Mandi', state: 'gujarat', price: 7100, unit: 'Quintal', date: '2026-02-21' },
    { id: 15, crop: 'Cotton', market: 'Adilabad Mandi', state: 'telangana', price: 6500, unit: 'Quintal', date: '2026-02-21' },
    { id: 16, crop: 'Cotton', market: 'Sirsa Mandi', state: 'haryana', price: 6950, unit: 'Quintal', date: '2026-02-21' },
    { id: 17, crop: 'Potato', market: 'Agra Mandi', state: 'up', price: 1200, unit: 'Quintal', date: '2026-02-21' },
    { id: 18, crop: 'Potato', market: 'Indore Mandi', state: 'mp', price: 1150, unit: 'Quintal', date: '2026-02-21' },
    { id: 19, crop: 'Potato', market: 'Jalandhar Mandi', state: 'punjab', price: 1400, unit: 'Quintal', date: '2026-02-21' },
    { id: 20, crop: 'Potato', market: 'Kolkata Mandi', state: 'wb', price: 1300, unit: 'Quintal', date: '2026-02-21' },
];

// ─── @desc   Get mandi prices with optional filters
// ─── @route  GET /api/mandi?crop=wheat&state=up
// ─── @access Public
const getMandiPrices = asyncHandler(async (req, res) => {
    const { crop, state } = req.query;

    let results = [...MANDI_DATA];

    if (crop) {
        results = results.filter(
            (r) => r.crop.toLowerCase() === crop.toLowerCase()
        );
    }

    if (state && state !== 'all') {
        results = results.filter(
            (r) => r.state.toLowerCase() === state.toLowerCase()
        );
    }

    if (results.length === 0) {
        return res.status(200).json({
            success: true,
            count: 0,
            message: 'No prices found for the given filters',
            data: [],
        });
    }

    res.status(200).json({
        success: true,
        count: results.length,
        data: results,
    });
});

// ─── @desc   Get list of available crops
// ─── @route  GET /api/mandi/crops
// ─── @access Public
const getCrops = asyncHandler(async (req, res) => {
    const crops = [...new Set(MANDI_DATA.map((d) => d.crop))];
    res.status(200).json({ success: true, data: crops });
});

// ─── @desc   Get list of available states
// ─── @route  GET /api/mandi/states
// ─── @access Public
const getStates = asyncHandler(async (req, res) => {
    const states = [...new Set(MANDI_DATA.map((d) => d.state))];
    res.status(200).json({ success: true, data: states });
});

module.exports = { getMandiPrices, getCrops, getStates };
