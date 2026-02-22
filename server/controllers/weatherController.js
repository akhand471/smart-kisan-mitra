const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');

// ─── @desc   Get current weather for a city
// ─── @route  GET /api/weather?city=cityname
// ─── @access Public
const getWeather = asyncHandler(async (req, res) => {
    const city = req.query.city || 'Lucknow';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // If no real API key configured, return mock data
    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        return res.status(200).json({
            success: true,
            source: 'mock',
            note: 'Set OPENWEATHER_API_KEY in .env to get real weather data',
            data: getMockWeather(city),
        });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city + ',IN',
                    appid: apiKey,
                    units: 'metric',
                    lang: 'en',
                },
                timeout: 5000,
            }
        );

        const w = response.data;
        res.status(200).json({
            success: true,
            source: 'openweathermap',
            data: {
                city: w.name,
                country: w.sys.country,
                temp: Math.round(w.main.temp),
                feelsLike: Math.round(w.main.feels_like),
                humidity: w.main.humidity,
                windSpeed: Math.round(w.wind.speed * 3.6), // m/s → km/h
                condition: w.weather[0].main,
                description: w.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`,
                rainChance: w.clouds?.all || 0,
                uvIndex: null, // requires separate API call
                sunrise: new Date(w.sys.sunrise * 1000).toLocaleTimeString('en-IN'),
                sunset: new Date(w.sys.sunset * 1000).toLocaleTimeString('en-IN'),
            },
        });
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ success: false, message: `City "${city}" not found` });
        }
        if (error.response?.status === 401) {
            return res.status(500).json({ success: false, message: 'Invalid OpenWeatherMap API key' });
        }
        // Fallback to mock data on any network error
        return res.status(200).json({
            success: true,
            source: 'mock_fallback',
            note: 'Live API unavailable — returning mock data',
            data: getMockWeather(city),
        });
    }
});

// ─── @desc   Get 5-day forecast
// ─── @route  GET /api/weather/forecast?city=cityname
// ─── @access Public
const getForecast = asyncHandler(async (req, res) => {
    const city = req.query.city || 'Lucknow';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        return res.status(200).json({ success: true, source: 'mock', data: getMockForecast() });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast`,
            {
                params: { q: city + ',IN', appid: apiKey, units: 'metric', cnt: 5 },
                timeout: 5000,
            }
        );

        const days = response.data.list.map((item) => ({
            datetime: item.dt_txt,
            temp: Math.round(item.main.temp),
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            humidity: item.main.humidity,
            condition: item.weather[0].main,
            description: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
            rainProbability: Math.round((item.pop || 0) * 100),
        }));

        res.status(200).json({ success: true, source: 'openweathermap', count: days.length, data: days });
    } catch {
        res.status(200).json({ success: true, source: 'mock_fallback', data: getMockForecast() });
    }
});

// ─── Mock data helpers ─────────────────────────────────────────────────
const getMockWeather = (city) => ({
    city,
    temp: 24,
    feelsLike: 22,
    humidity: 68,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    description: 'partly cloudy',
    rainChance: 30,
    uvIndex: 5,
    sunrise: '6:42 AM',
    sunset: '6:18 PM',
});

const getMockForecast = () => [
    { day: 'Today', high: 24, low: 16, condition: 'Partly Cloudy', rainProbability: 30 },
    { day: 'Sat', high: 26, low: 17, condition: 'Sunny', rainProbability: 5 },
    { day: 'Sun', high: 22, low: 15, condition: 'Rainy', rainProbability: 80 },
    { day: 'Mon', high: 20, low: 13, condition: 'Cloudy', rainProbability: 60 },
    { day: 'Tue', high: 25, low: 16, condition: 'Sunny', rainProbability: 10 },
];

module.exports = { getWeather, getForecast };
