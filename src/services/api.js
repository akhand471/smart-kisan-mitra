import axios from 'axios';

// Central axios instance — baseURL uses Vite proxy (no CORS in dev)
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem('kisan_user');
        if (stored) {
            try {
                const { token } = JSON.parse(stored);
                if (token) config.headers.Authorization = `Bearer ${token}`;
            } catch (_) { /* ignore parse errors */ }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Normalize error messages from backend responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Something went wrong. Please try again.';
        return Promise.reject(new Error(message));
    }
);

export default api;
