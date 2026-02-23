import axios from 'axios';

// In production (Vercel), VITE_API_URL points to the Render backend.
// In development, the Vite proxy rewrites /api → localhost:5001 so we use '/api'.
const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

// Central axios instance
const api = axios.create({
    baseURL: BASE_URL,
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
