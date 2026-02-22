const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');

// ─── @desc   Get current weather — accepts ?city=name OR ?lat=&lon=
// ─── @route  GET /api/weather
// ─── @access Public
const getWeather = asyncHandler(async (req, res) => {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // If no real API key configured, return mock data
    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        return res.status(200).json({
            success: true,
            source: 'mock',
            data: getMockWeather(city || 'Lucknow'),
        });
    }

    try {
        // Build params: prefer lat/lon if provided, otherwise use city name
        const params = lat && lon
            ? { lat, lon, appid: apiKey, units: 'metric', lang: 'en' }
            : { q: (city || 'Lucknow') + ',IN', appid: apiKey, units: 'metric', lang: 'en' };

        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            { params, timeout: 5000 }
        );

        const w = response.data;
        res.status(200).json({
            success: true,
            source: 'openweathermap',
            data: {
                city: w.name,
                country: w.sys.country,
                lat: w.coord.lat,
                lon: w.coord.lon,
                temp: Math.round(w.main.temp),
                feelsLike: Math.round(w.main.feels_like),
                humidity: w.main.humidity,
                windSpeed: Math.round(w.wind.speed * 3.6), // m/s → km/h
                condition: w.weather[0].main,
                description: w.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`,
                rainChance: w.clouds?.all || 0,
                uvIndex: null,
                sunrise: new Date(w.sys.sunrise * 1000).toLocaleTimeString('en-IN'),
                sunset: new Date(w.sys.sunset * 1000).toLocaleTimeString('en-IN'),
            },
        });
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ success: false, message: `City "${city}" not found. Try another name.` });
        }
        if (error.response?.status === 401) {
            return res.status(500).json({ success: false, message: 'Invalid OpenWeatherMap API key' });
        }
        // Fallback to mock data on network error
        return res.status(200).json({
            success: true,
            source: 'mock_fallback',
            data: getMockWeather(city || 'Lucknow'),
        });
    }
});

// ─── @desc   Get 5-day forecast — accepts ?city=name OR ?lat=&lon=
// ─── @route  GET /api/weather/forecast
// ─── @access Public
const getForecast = asyncHandler(async (req, res) => {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        return res.status(200).json({ success: true, source: 'mock', data: getMockForecast() });
    }

    try {
        const params = lat && lon
            ? { lat, lon, appid: apiKey, units: 'metric', cnt: 5 }
            : { q: (city || 'Lucknow') + ',IN', appid: apiKey, units: 'metric', cnt: 5 };

        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast',
            { params, timeout: 5000 }
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

// ─── Mock helpers ──────────────────────────────────────────────────────────────
const getMockWeather = (city) => ({
    city,
    temp: 24,
    feelsLike: 22,
    humidity: 68,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    description: 'partly cloudy',
    rainChance: 30,
    uvIndex: null,
    sunrise: '6:42 AM',
    sunset: '6:18 PM',
});

const getMockForecast = () => [
    { datetime: null, day: 'Today', high: 24, low: 16, condition: 'Partly Cloudy', rainProbability: 30 },
    { datetime: null, day: 'Sat', high: 26, low: 17, condition: 'Clear', rainProbability: 5 },
    { datetime: null, day: 'Sun', high: 22, low: 15, condition: 'Rain', rainProbability: 80 },
    { datetime: null, day: 'Mon', high: 20, low: 13, condition: 'Clouds', rainProbability: 60 },
    { datetime: null, day: 'Tue', high: 25, low: 16, condition: 'Clear', rainProbability: 10 },
];

module.exports = { getWeather, getForecast };
