import api from './api';

// ── Get current weather ───────────────────────────────────────────────────────
// GET /api/weather?city=Lucknow
// Returns { success, source, data: { city, temp, feelsLike, humidity, ... } }
export const getCurrentWeather = async (city = 'Lucknow') => {
    const { data } = await api.get('/weather', { params: { city } });
    return data.data;
};

// ── Get 5-day forecast ────────────────────────────────────────────────────────
// GET /api/weather/forecast?city=Lucknow
// Returns { success, source, data: [...] }
export const getForecast = async (city = 'Lucknow') => {
    const { data } = await api.get('/weather/forecast', { params: { city } });
    return data.data;
};

