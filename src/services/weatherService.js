import api from './api';

// ── Get current weather ───────────────────────────────────────────────────────
// Accepts either city name OR { lat, lon } coordinates
export const getCurrentWeather = async (location = {}) => {
    const { city, lat, lon } = location;
    const params = lat && lon ? { lat, lon } : { city: city || 'Lucknow' };
    const { data } = await api.get('/weather', { params });
    return data.data;
};

// ── Get 5-day forecast ────────────────────────────────────────────────────────
export const getForecast = async (location = {}) => {
    const { city, lat, lon } = location;
    const params = lat && lon ? { lat, lon } : { city: city || 'Lucknow' };
    const { data } = await api.get('/weather/forecast', { params });
    return data.data;
};
