import api from './api';

const DEMO_OTP = '123456';

// ── Send OTP ─────────────────────────────────────────────────────────────────
// Tries the real backend. If the server/DB is unreachable, falls back to demo mode.
export const sendOTP = async (phone, name = '') => {
    if (!phone || phone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
    }
    try {
        const { data } = await api.post('/auth/send-otp', { phone, name });
        return data; // { success, message, otp? (dev only) }
    } catch (err) {
        // Network error or backend down → fall back to demo mode
        if (!err.response) {
            console.warn('[Auth] Backend unreachable — using demo mode (OTP: 123456)');
            return { success: true, message: `Demo OTP sent to ${phone}`, _demo: true };
        }
        throw err; // re-throw real backend errors (bad phone, rate limit, etc.)
    }
};

// ── Verify OTP & Login ────────────────────────────────────────────────────────
// POST /api/auth/verify-otp { phone, otp }
// Returns { success, token, user: { _id, phone, name } }
export const verifyOTP = async (phone, otp) => {
    try {
        const { data } = await api.post('/auth/verify-otp', { phone, otp });
        return data;
    } catch (err) {
        // Network error or backend down → run demo check locally
        if (!err.response) {
            if (otp !== DEMO_OTP) {
                throw new Error(`Invalid OTP. Use ${DEMO_OTP} for demo.`);
            }
            return {
                success: true,
                token: 'demo_jwt_' + Date.now(),
                user: { _id: 'demo_' + phone, phone, name: 'Demo Kisan' },
            };
        }
        throw err;
    }
};

// ── Register + auto-login ─────────────────────────────────────────────────────
export const registerUser = async (name, phone, otp) => {
    try {
        const { data } = await api.post('/auth/verify-otp', { phone, otp });
        return data;
    } catch (err) {
        if (!err.response) {
            if (otp !== DEMO_OTP) {
                throw new Error(`Invalid OTP. Use ${DEMO_OTP} for demo.`);
            }
            return {
                success: true,
                token: 'demo_jwt_' + Date.now(),
                user: { _id: 'demo_' + phone, phone, name: name || 'Demo Kisan' },
            };
        }
        throw err;
    }
};
