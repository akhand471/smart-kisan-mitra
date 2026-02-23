const asyncHandler = require('../middleware/asyncHandler');

// ────────────────────────────────────────────────────────────────────────────
// Expanded High-Income & Quick-Harvest Crop Knowledge Base (30+ crops)
// incomePerAcre / investmentPerAcre in INR
// ────────────────────────────────────────────────────────────────────────────
const CROPS = [
    // ── QUICK HARVEST: 30–50 days ───────────────────────────────────────────
    {
        id: 'spinach', name: 'Spinach', hindi: 'पालक', emoji: '🥬',
        season: 'Rabi/Winter', quickHarvest: true,
        soilTypes: ['Loamy', 'Sandy', 'Silty'],
        tempMin: 10, tempMax: 25, humidityMin: 50, humidityMax: 85,
        states: ['UP', 'Punjab', 'Haryana', 'HP', 'Uttarakhand', 'Delhi', 'Bihar'],
        yieldPerAcre: 60, marketPriceMin: 500, marketPriceMax: 2000,
        investmentPerAcre: 8000, incomePerAcre: 55000,
        duration: '30–40 days', tips: 'Multiple cuttings possible. Urban demand is very high.',
    },
    {
        id: 'radish', name: 'Radish', hindi: 'मूली', emoji: '🔴',
        season: 'Rabi/Winter', quickHarvest: true,
        soilTypes: ['Sandy', 'Loamy', 'Silty'],
        tempMin: 10, tempMax: 22, humidityMin: 50, humidityMax: 80,
        states: ['Punjab', 'Haryana', 'UP', 'Bihar', 'West Bengal', 'Rajasthan'],
        yieldPerAcre: 100, marketPriceMin: 200, marketPriceMax: 800,
        investmentPerAcre: 6000, incomePerAcre: 35000,
        duration: '25–40 days', tips: 'Fastest harvest root vegetable. Ideal for relay cropping.',
    },
    {
        id: 'fenugreek', name: 'Fenugreek (Methi)', hindi: 'मेथी', emoji: '🌿',
        season: 'Rabi/Winter', quickHarvest: true,
        soilTypes: ['Loamy', 'Clay', 'Sandy'],
        tempMin: 10, tempMax: 28, humidityMin: 40, humidityMax: 75,
        states: ['Rajasthan', 'Gujarat', 'MP', 'UP', 'Punjab', 'Maharashtra'],
        yieldPerAcre: 20, marketPriceMin: 1000, marketPriceMax: 4000,
        investmentPerAcre: 5000, incomePerAcre: 40000,
        duration: '30–45 days', tips: 'High demand spice herb. Can be cut 3–4 times per crop.',
    },
    {
        id: 'coriander', name: 'Coriander (Dhania)', hindi: 'धनिया', emoji: '🌱',
        season: 'Rabi', quickHarvest: true,
        soilTypes: ['Loamy', 'Sandy', 'Red'],
        tempMin: 15, tempMax: 30, humidityMin: 40, humidityMax: 75,
        states: ['Rajasthan', 'MP', 'Gujarat', 'AP', 'Karnataka', 'UP'],
        yieldPerAcre: 8, marketPriceMin: 3000, marketPriceMax: 12000,
        investmentPerAcre: 6000, incomePerAcre: 60000,
        duration: '40–50 days', tips: 'Price spikes 5x in summers. Leaves + seeds = dual income.',
    },
    {
        id: 'spring_onion', name: 'Spring Onion', hindi: 'हरी प्याज', emoji: '🧅',
        season: 'Rabi/Kharif', quickHarvest: true,
        soilTypes: ['Loamy', 'Sandy', 'Silty'],
        tempMin: 13, tempMax: 30, humidityMin: 50, humidityMax: 80,
        states: ['Maharashtra', 'Karnataka', 'UP', 'Punjab', 'West Bengal'],
        yieldPerAcre: 50, marketPriceMin: 600, marketPriceMax: 2500,
        investmentPerAcre: 10000, incomePerAcre: 50000,
        duration: '45–55 days', tips: 'Star hotel/restaurant ingredient. Premium city markets.',
    },
    {
        id: 'cluster_beans', name: 'Cluster Beans (Guar)', hindi: 'ग्वार', emoji: '🫘',
        season: 'Kharif', quickHarvest: true,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 25, tempMax: 42, humidityMin: 30, humidityMax: 65,
        states: ['Rajasthan', 'Gujarat', 'Haryana', 'Punjab', 'UP'],
        yieldPerAcre: 10, marketPriceMin: 2000, marketPriceMax: 5000,
        investmentPerAcre: 7000, incomePerAcre: 35000,
        duration: '45–60 days', tips: 'Drought-tolerant. Guar gum export = high global demand.',
    },
    {
        id: 'cowpea', name: 'Cowpea (Lobia)', hindi: 'लोबिया', emoji: '🫘',
        season: 'Kharif', quickHarvest: true,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 20, tempMax: 38, humidityMin: 40, humidityMax: 80,
        states: ['Rajasthan', 'UP', 'Bihar', 'AP', 'Karnataka', 'Tamil Nadu'],
        yieldPerAcre: 12, marketPriceMin: 3000, marketPriceMax: 6000,
        investmentPerAcre: 8000, incomePerAcre: 48000,
        duration: '50–65 days', tips: 'Nitrogen-fixer. Improves soil + quick income.',
    },

    // ── HIGH-YIELD VEGETABLES ───────────────────────────────────────────────
    {
        id: 'tomato', name: 'Tomato', hindi: 'टमाटर', emoji: '🍅',
        season: 'Kharif/Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Red'],
        tempMin: 15, tempMax: 35, humidityMin: 50, humidityMax: 90,
        states: ['UP', 'Maharashtra', 'Karnataka', 'MP', 'Bihar', 'HP', 'Odisha', 'West Bengal'],
        yieldPerAcre: 120, marketPriceMin: 400, marketPriceMax: 2000,
        investmentPerAcre: 25000, incomePerAcre: 60000,
        duration: '3–4 months', tips: 'High demand vegetable with quick returns.',
    },
    {
        id: 'onion', name: 'Onion', hindi: 'प्याज', emoji: '🧅',
        season: 'Rabi/Kharif', quickHarvest: false,
        soilTypes: ['Loamy', 'Clay', 'Black'],
        tempMin: 13, tempMax: 35, humidityMin: 40, humidityMax: 75,
        states: ['Maharashtra', 'MP', 'Karnataka', 'Rajasthan', 'Gujarat', 'UP', 'Bihar'],
        yieldPerAcre: 100, marketPriceMin: 500, marketPriceMax: 4000,
        investmentPerAcre: 20000, incomePerAcre: 80000,
        duration: '4–5 months', tips: 'Prices spike to ₹4000+/quintal in off-season.',
    },
    {
        id: 'potato', name: 'Potato', hindi: 'आलू', emoji: '🥔',
        season: 'Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Silty'],
        tempMin: 10, tempMax: 25, humidityMin: 60, humidityMax: 85,
        states: ['UP', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab', 'Haryana'],
        yieldPerAcre: 150, marketPriceMin: 300, marketPriceMax: 1200,
        investmentPerAcre: 30000, incomePerAcre: 55000,
        duration: '3–4 months', tips: 'Highest yield per acre among vegetables.',
    },
    {
        id: 'bitter_gourd', name: 'Bitter Gourd (Karela)', hindi: 'करेला', emoji: '🥒',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 24, tempMax: 38, humidityMin: 55, humidityMax: 85,
        states: ['UP', 'Bihar', 'West Bengal', 'AP', 'Odisha', 'Maharashtra'],
        yieldPerAcre: 50, marketPriceMin: 800, marketPriceMax: 3000,
        investmentPerAcre: 18000, incomePerAcre: 65000,
        duration: '55–65 days', tips: 'Medicinal demand drives premium prices.',
    },
    {
        id: 'bottle_gourd', name: 'Bottle Gourd (Lauki)', hindi: 'लौकी', emoji: '🥒',
        season: 'Kharif/Summer', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Silty'],
        tempMin: 24, tempMax: 40, humidityMin: 50, humidityMax: 85,
        states: ['UP', 'Bihar', 'MP', 'Rajasthan', 'Haryana', 'Punjab'],
        yieldPerAcre: 100, marketPriceMin: 300, marketPriceMax: 1200,
        investmentPerAcre: 15000, incomePerAcre: 50000,
        duration: '55–65 days', tips: 'Fast grower. Year-round urban demand.',
    },
    {
        id: 'capsicum', name: 'Capsicum (Bell Pepper)', hindi: 'शिमला मिर्च', emoji: '🫑',
        season: 'Rabi/Kharif', quickHarvest: false,
        soilTypes: ['Loamy', 'Red', 'Sandy'],
        tempMin: 18, tempMax: 30, humidityMin: 55, humidityMax: 80,
        states: ['HP', 'Kashmir', 'Karnataka', 'AP', 'Maharashtra', 'UP'],
        yieldPerAcre: 80, marketPriceMin: 1500, marketPriceMax: 6000,
        investmentPerAcre: 30000, incomePerAcre: 150000,
        duration: '70–90 days', tips: 'Premium vegetable. Polyhouse farming = 3x income.',
    },
    {
        id: 'brinjal', name: 'Brinjal (Baingan)', hindi: 'बैंगन', emoji: '🍆',
        season: 'Kharif/Rabi', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red', 'Clay'],
        tempMin: 18, tempMax: 38, humidityMin: 50, humidityMax: 85,
        states: ['West Bengal', 'Odisha', 'Bihar', 'UP', 'AP', 'Karnataka'],
        yieldPerAcre: 130, marketPriceMin: 300, marketPriceMax: 1500,
        investmentPerAcre: 15000, incomePerAcre: 55000,
        duration: '60–80 days', tips: 'Long harvest window. One of highest-yielding vegetables.',
    },

    // ── SPICES ──────────────────────────────────────────────────────────────
    {
        id: 'turmeric', name: 'Turmeric', hindi: 'हल्दी', emoji: '🟡',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Loamy', 'Red', 'Clay'],
        tempMin: 20, tempMax: 35, humidityMin: 65, humidityMax: 90,
        states: ['Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'UP', 'Odisha', 'Assam'],
        yieldPerAcre: 25, marketPriceMin: 6000, marketPriceMax: 12000,
        investmentPerAcre: 30000, incomePerAcre: 120000,
        duration: '8–9 months', tips: 'Premium spice with 3–4x returns on investment.',
    },
    {
        id: 'garlic', name: 'Garlic', hindi: 'लहसुन', emoji: '🧄',
        season: 'Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Clay'],
        tempMin: 12, tempMax: 28, humidityMin: 45, humidityMax: 75,
        states: ['MP', 'Rajasthan', 'UP', 'Gujarat', 'Punjab', 'Haryana'],
        yieldPerAcre: 50, marketPriceMin: 1500, marketPriceMax: 8000,
        investmentPerAcre: 25000, incomePerAcre: 100000,
        duration: '5–6 months', tips: 'Prices can hit ₹200/kg. Strong export demand.',
    },
    {
        id: 'ginger', name: 'Ginger', hindi: 'अदरक', emoji: '🫚',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Loamy', 'Red', 'Silty'],
        tempMin: 20, tempMax: 35, humidityMin: 70, humidityMax: 90,
        states: ['Kerala', 'Meghalaya', 'Assam', 'Karnataka', 'HP', 'West Bengal', 'Mizoram'],
        yieldPerAcre: 80, marketPriceMin: 2000, marketPriceMax: 8000,
        investmentPerAcre: 40000, incomePerAcre: 150000,
        duration: '8–10 months', tips: 'Highest income potential. Well-drained hilly slopes.',
    },
    {
        id: 'chilli', name: 'Green Chilli', hindi: 'मिर्च', emoji: '🌶️',
        season: 'Kharif/Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Red'],
        tempMin: 18, tempMax: 38, humidityMin: 50, humidityMax: 80,
        states: ['AP', 'Telangana', 'Karnataka', 'Maharashtra', 'Rajasthan', 'UP', 'Odisha'],
        yieldPerAcre: 40, marketPriceMin: 1500, marketPriceMax: 6000,
        investmentPerAcre: 18000, incomePerAcre: 80000,
        duration: '4–5 months', tips: 'Fresh + dried dual income. High export demand.',
    },

    // ── CASH CROPS ──────────────────────────────────────────────────────────
    {
        id: 'sugarcane', name: 'Sugarcane', hindi: 'गन्ना', emoji: '🎋',
        season: 'Annual', quickHarvest: false,
        soilTypes: ['Loamy', 'Clay', 'Black'],
        tempMin: 20, tempMax: 38, humidityMin: 60, humidityMax: 90,
        states: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar', 'Punjab', 'Uttarakhand'],
        yieldPerAcre: 300, marketPriceMin: 290, marketPriceMax: 360,
        investmentPerAcre: 35000, incomePerAcre: 75000,
        duration: '10–12 months', tips: 'MSP guaranteed. Steady year-round income.',
    },
    {
        id: 'cotton', name: 'Cotton', hindi: 'कपास', emoji: '☁️',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Black', 'Clay', 'Loamy'],
        tempMin: 21, tempMax: 40, humidityMin: 40, humidityMax: 70,
        states: ['Maharashtra', 'Gujarat', 'Telangana', 'AP', 'MP', 'Rajasthan', 'Karnataka', 'Haryana'],
        yieldPerAcre: 8, marketPriceMin: 6000, marketPriceMax: 7500,
        investmentPerAcre: 25000, incomePerAcre: 55000,
        duration: '5–6 months', tips: 'MSP supported. Bt Cotton = higher yield.',
    },
    {
        id: 'soybean', name: 'Soybean', hindi: 'सोयाबीन', emoji: '🫘',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Black', 'Clay', 'Loamy'],
        tempMin: 20, tempMax: 32, humidityMin: 60, humidityMax: 85,
        states: ['MP', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana', 'Chhattisgarh'],
        yieldPerAcre: 10, marketPriceMin: 4000, marketPriceMax: 5500,
        investmentPerAcre: 12000, incomePerAcre: 40000,
        duration: '3–4 months', tips: 'Oil crop with steady demand. Short season = quick return.',
    },
    {
        id: 'groundnut', name: 'Groundnut', hindi: 'मूंगफली', emoji: '🥜',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 22, tempMax: 38, humidityMin: 45, humidityMax: 75,
        states: ['Gujarat', 'Rajasthan', 'AP', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'MP'],
        yieldPerAcre: 15, marketPriceMin: 4000, marketPriceMax: 6000,
        investmentPerAcre: 15000, incomePerAcre: 60000,
        duration: '90–110 days', tips: 'Oil + direct sale. Excellent for sandy soils.',
    },

    // ── CEREALS & PULSES ────────────────────────────────────────────────────
    {
        id: 'wheat', name: 'Wheat', hindi: 'गेहूं', emoji: '🌾',
        season: 'Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Clay', 'Silty'],
        tempMin: 10, tempMax: 25, humidityMin: 40, humidityMax: 75,
        states: ['UP', 'Punjab', 'Haryana', 'MP', 'Rajasthan', 'Bihar', 'Uttarakhand'],
        yieldPerAcre: 18, marketPriceMin: 2015, marketPriceMax: 2500,
        investmentPerAcre: 15000, incomePerAcre: 35000,
        duration: '5–6 months', tips: 'MSP guaranteed. Low-risk stable crop.',
    },
    {
        id: 'maize', name: 'Maize (Baby Corn)', hindi: 'मक्का', emoji: '🌽',
        season: 'Kharif/Rabi', quickHarvest: false,
        soilTypes: ['Loamy', 'Sandy', 'Silty'],
        tempMin: 18, tempMax: 35, humidityMin: 50, humidityMax: 85,
        states: ['Karnataka', 'AP', 'Rajasthan', 'MP', 'Bihar', 'UP', 'Maharashtra'],
        yieldPerAcre: 30, marketPriceMin: 1500, marketPriceMax: 4000,
        investmentPerAcre: 15000, incomePerAcre: 50000,
        duration: '3 months', tips: 'Baby corn fetches 4x the price of regular corn.',
    },
    {
        id: 'mustard', name: 'Mustard', hindi: 'सरसों', emoji: '🌻',
        season: 'Rabi', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Silty'],
        tempMin: 10, tempMax: 28, humidityMin: 30, humidityMax: 65,
        states: ['Rajasthan', 'UP', 'Haryana', 'Punjab', 'MP', 'Gujarat', 'Uttarakhand'],
        yieldPerAcre: 8, marketPriceMin: 5000, marketPriceMax: 7000,
        investmentPerAcre: 10000, incomePerAcre: 45000,
        duration: '4–5 months', tips: 'Very low water requirement. Great for dry areas.',
    },
    {
        id: 'pearl_millet', name: 'Pearl Millet (Bajra)', hindi: 'बाजरा', emoji: '🌾',
        season: 'Kharif', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 25, tempMax: 42, humidityMin: 30, humidityMax: 65,
        states: ['Rajasthan', 'Gujarat', 'Haryana', 'UP', 'MP'],
        yieldPerAcre: 8, marketPriceMin: 2150, marketPriceMax: 2600,
        investmentPerAcre: 8000, incomePerAcre: 18000,
        duration: '2–3 months', tips: 'Drought-resistant. Best for water-scarce sandy areas.',
    },

    // ── FRUITS ──────────────────────────────────────────────────────────────
    {
        id: 'pomegranate', name: 'Pomegranate', hindi: 'अनार', emoji: '🍎',
        season: 'Annual', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 18, tempMax: 38, humidityMin: 30, humidityMax: 65,
        states: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Karnataka', 'AP', 'MP'],
        yieldPerAcre: 100, marketPriceMin: 3000, marketPriceMax: 8000,
        investmentPerAcre: 80000, incomePerAcre: 200000,
        duration: '2–3 years (perennial)', tips: 'Best long-term investment. Fruits for 20+ years.',
    },
    {
        id: 'banana', name: 'Banana', hindi: 'केला', emoji: '🍌',
        season: 'Annual', quickHarvest: false,
        soilTypes: ['Loamy', 'Clay', 'Silty'],
        tempMin: 20, tempMax: 38, humidityMin: 65, humidityMax: 90,
        states: ['Maharashtra', 'Tamil Nadu', 'AP', 'Gujarat', 'Karnataka', 'Bihar'],
        yieldPerAcre: 200, marketPriceMin: 400, marketPriceMax: 1200,
        investmentPerAcre: 50000, incomePerAcre: 130000,
        duration: '11–15 months', tips: 'High water demand but massive returns near markets.',
    },
    {
        id: 'watermelon', name: 'Watermelon', hindi: 'तरबूज', emoji: '🍉',
        season: 'Summer/Zaid', quickHarvest: false,
        soilTypes: ['Sandy', 'Loamy', 'Red'],
        tempMin: 25, tempMax: 40, humidityMin: 40, humidityMax: 75,
        states: ['UP', 'Rajasthan', 'AP', 'Karnataka', 'MP', 'Bihar', 'West Bengal'],
        yieldPerAcre: 150, marketPriceMin: 300, marketPriceMax: 1200,
        investmentPerAcre: 20000, incomePerAcre: 80000,
        duration: '70–90 days', tips: 'Summer cash crop. Sandy riverbed soils = premium taste.',
    },
];

// ── Detect season ─────────────────────────────────────────────────────────────
const getCurrentSeason = () => {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return 'Kharif';
    if (m >= 11 || m <= 3) return 'Rabi';
    return 'Zaid';
};

// ── Score a single crop ───────────────────────────────────────────────────────
const scoreCrop = (crop, { soilType, state, temp, humidity, onlyQuick }) => {
    // If filtering for quick harvest only, exclude non-quick crops
    if (onlyQuick && !crop.quickHarvest) return { score: -1, reasons: [] };

    let score = 0;
    const reasons = [];

    if (crop.soilTypes.includes(soilType)) { score += 30; reasons.push(`🌱 ${soilType} soil match`); }
    if (temp >= crop.tempMin && temp <= crop.tempMax) { score += 25; reasons.push(`🌡️ Ideal temp (${temp}°C)`); }
    else if (temp >= crop.tempMin - 3 && temp <= crop.tempMax + 3) score += 12;

    if (humidity >= crop.humidityMin && humidity <= crop.humidityMax) { score += 15; reasons.push(`💧 Suitable humidity (${humidity}%)`); }
    else if (humidity >= crop.humidityMin - 10 && humidity <= crop.humidityMax + 10) score += 7;

    const norm = (s) => s.toLowerCase().replace(/\s/g, '');
    const stateMatch = crop.states.some(s => norm(s).includes(norm(state)) || norm(state).includes(norm(s)));
    if (stateMatch) { score += 20; reasons.push('📍 Popular in your region'); }

    const currentSeason = getCurrentSeason();
    if (crop.season.includes(currentSeason) || crop.season === 'Annual') { score += 10; reasons.push(`📅 Right ${currentSeason} season`); }
    if (crop.quickHarvest) { score += 5; reasons.push('⚡ Quick harvest (30–60 days)'); }

    score += Math.min(Math.floor(crop.incomePerAcre / 10000), 15);
    return { score, reasons };
};

// ─── @desc   Recommend high-income crops
// ─── @route  POST /api/crop/recommend
// ─── @access Public
const recommendCrops = asyncHandler(async (req, res) => {
    const { soilType = 'Loamy', state = '', temp = 28, humidity = 60, onlyQuick = false } = req.body;

    const scored = CROPS
        .map(crop => {
            const { score, reasons } = scoreCrop(crop, { soilType, state, temp: Number(temp), humidity: Number(humidity), onlyQuick });
            const suitability = Math.min(Math.round((score / 105) * 100), 98);
            return { ...crop, score, suitability, reasons };
        })
        .filter(c => c.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(({ id, name, hindi, emoji, season, quickHarvest, yieldPerAcre, marketPriceMin, marketPriceMax,
            investmentPerAcre, incomePerAcre, duration, tips, suitability, reasons }) => ({
                id, name, hindi, emoji, season, quickHarvest, yieldPerAcre,
                marketPrice: `₹${marketPriceMin.toLocaleString('en-IN')}–₹${marketPriceMax.toLocaleString('en-IN')}/qtl`,
                investmentPerAcre, incomePerAcre, duration, tips, suitability, reasons,
            }));

    res.status(200).json({
        success: true,
        season: getCurrentSeason(),
        inputs: { soilType, state, temp, humidity, onlyQuick },
        count: scored.length,
        recommendations: scored,
    });
});

// ─── @desc   Calculate crop profit/loss
// ─── @route  POST /api/crop/calculate
// ─── @access Public
const calculateCrop = asyncHandler(async (req, res) => {
    const { seedCost, fertilizerCost, labourCost, landArea, expectedYield, marketPrice } = req.body;
    if (!seedCost || !fertilizerCost || !labourCost || !landArea || !expectedYield || !marketPrice)
        return res.status(400).json({ success: false, message: 'All fields are required' });

    const totalCost = Number(seedCost) + Number(fertilizerCost) + Number(labourCost);
    const expectedRevenue = Number(expectedYield) * Number(marketPrice);
    const estimatedProfit = expectedRevenue - totalCost;
    const costPerAcre = Number(landArea) > 0 ? Math.round(totalCost / Number(landArea)) : totalCost;
    const profitMargin = expectedRevenue > 0 ? Math.round((estimatedProfit / expectedRevenue) * 100 * 100) / 100 : 0;

    res.status(200).json({ success: true, result: { totalCost, expectedRevenue, estimatedProfit, costPerAcre, profitMargin } });
});

module.exports = { calculateCrop, recommendCrops };
