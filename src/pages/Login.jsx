import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    PhoneIcon, ShieldCheckIcon, ArrowRightIcon, UserPlusIcon, UserIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { sendOTP, verifyOTP, registerUser } from '../services/authService';
import Button from '../components/Button';
import LangToggle from '../components/LangToggle';

// ─── Shared 6-Box OTP input ───────────────────────────────────────────────
function OTPInput({ otp, onChange, onKeyDown, onPaste, otpRefs, error }) {
    return (
        <div>
            <div className="flex gap-2 justify-between" onPaste={onPaste}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => onChange(e.target.value, i)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
              transition-all duration-150
              ${digit ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'}
              ${error ? 'border-red-400' : ''}`}
                    />
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}

// ─── LOGIN FLOW ───────────────────────────────────────────────────────────
function LoginFlow({ onSwitchToRegister }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLang();

    const [step, setStep] = useState('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const otpRefs = useRef([]);

    const validatePhone = () => {
        if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
            setErrors({ phone: 'Please enter a valid 10-digit mobile number' });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSendOTP = async () => {
        if (!validatePhone()) return;
        setLoading(true);
        try {
            await sendOTP(phone);
            setStep('otp');
            toast.success(t('login_send_otp') + ' +91 ' + phone);
        } catch (err) {
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    };

    const handleOtpPaste = (e) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (text.length === 6) { setOtp(text.split('')); otpRefs.current[5]?.focus(); }
        e.preventDefault();
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) { setErrors({ otp: t('login_otp_label') }); return; }
        setErrors({});
        setLoading(true);
        try {
            const res = await verifyOTP(phone, otpString);
            login({ ...res.user, token: res.token }); // merge real JWT into user object
            toast.success('Welcome! Login successful 🎉');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {step === 'phone' ? (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <PhoneIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">{t('login_enter_mobile')}</h2>
                            <p className="text-gray-500 text-sm">{t('login_otp_sent')}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('login_mobile_label')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                            <input
                                id="phone-input"
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                className={`input-field pl-12 ${errors.phone ? 'input-error' : ''}`}
                                placeholder="9876543210"
                                inputMode="numeric"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <Button id="send-otp-btn" loading={loading} onClick={handleSendOTP} icon={ArrowRightIcon}>
                        {t('login_send_otp')}
                    </Button>

                    <p className="text-center text-xs text-gray-400">{t('login_secure')}</p>
                    <p className="text-center text-sm">
                        <span className="text-gray-500">{t('login_no_account')} </span>
                        <button onClick={onSwitchToRegister} className="text-primary-600 font-semibold hover:underline">
                            {t('tab_register')}
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">{t('login_enter_otp')}</h2>
                            <p className="text-gray-500 text-sm">{t('login_otp_sent_to')} {phone}</p>
                        </div>
                    </div>

                    <OTPInput
                        otp={otp}
                        onChange={handleOtpChange}
                        onKeyDown={handleOtpKeyDown}
                        onPaste={handleOtpPaste}
                        otpRefs={otpRefs}
                        error={errors.otp}
                    />
                    <p className="text-xs text-gray-400">{t('login_demo_hint')}</p>

                    <Button id="verify-otp-btn" loading={loading} onClick={handleVerifyOTP} icon={ShieldCheckIcon}>
                        {t('login_verify_btn')}
                    </Button>

                    <button
                        onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setErrors({}); }}
                        className="w-full text-center text-sm text-primary-600 font-medium py-2 hover:underline"
                    >
                        {t('login_change_number')}
                    </button>
                </>
            )}
        </div>
    );
}

// ─── REGISTER FLOW ────────────────────────────────────────────────────────
function RegisterFlow({ onSwitchToLogin }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLang();

    const [step, setStep] = useState('details'); // 'details' | 'otp'
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const otpRefs = useRef([]);

    const validateDetails = () => {
        const errs = {};
        if (!name.trim() || name.trim().length < 2) errs.name = t('reg_name_error');
        if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) errs.phone = 'Please enter a valid 10-digit mobile number';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateDetails()) return;
        setLoading(true);
        try {
            await sendOTP(phone, name.trim()); // pass name so backend creates user with correct name
            setStep('otp');
            toast.success(t('login_send_otp') + ' +91 ' + phone);
        } catch (err) {
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    };

    const handleOtpPaste = (e) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (text.length === 6) { setOtp(text.split('')); otpRefs.current[5]?.focus(); }
        e.preventDefault();
    };

    const handleCreate = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) { setErrors({ otp: t('reg_otp_label') }); return; }
        setErrors({});
        setLoading(true);
        try {
            const res = await registerUser(name.trim(), phone, otpString);
            login({ ...res.user, token: res.token }); // merge real JWT into user object
            toast.success(t('reg_success'));
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {step === 'details' ? (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                            <UserPlusIcon className="h-5 w-5 text-accent-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">{t('reg_title')}</h2>
                            <p className="text-gray-500 text-sm">{t('reg_subtitle')}</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('reg_name_label')}</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="reg-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`input-field pl-10 ${errors.name ? 'input-error' : ''}`}
                                placeholder={t('reg_name_placeholder')}
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('reg_phone_label')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                            <input
                                id="reg-phone"
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                className={`input-field pl-12 ${errors.phone ? 'input-error' : ''}`}
                                placeholder="9876543210"
                                inputMode="numeric"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <Button id="reg-send-otp-btn" loading={loading} onClick={handleSendOTP} icon={ArrowRightIcon}
                        className="bg-accent-600 hover:bg-accent-700 focus:ring-accent-200">
                        {t('reg_send_otp')}
                    </Button>

                    <p className="text-center text-sm">
                        <span className="text-gray-500">{t('reg_already')} </span>
                        <button onClick={onSwitchToLogin} className="text-primary-600 font-semibold hover:underline">
                            {t('tab_login')}
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="h-5 w-5 text-accent-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">{t('reg_otp_label')}</h2>
                            <p className="text-gray-500 text-sm">{t('login_otp_sent_to')} {phone}</p>
                        </div>
                    </div>

                    {/* Name confirmation badge */}
                    <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-xl px-3 py-2">
                        <UserIcon className="h-4 w-4 text-accent-600 flex-shrink-0" />
                        <span className="text-sm text-accent-800 font-medium">{name}</span>
                        <button onClick={() => setStep('details')} className="ml-auto text-xs text-accent-600 hover:underline">Edit</button>
                    </div>

                    <OTPInput
                        otp={otp}
                        onChange={handleOtpChange}
                        onKeyDown={handleOtpKeyDown}
                        onPaste={handleOtpPaste}
                        otpRefs={otpRefs}
                        error={errors.otp}
                    />
                    <p className="text-xs text-gray-400">{t('reg_otp_hint')}</p>

                    <Button
                        id="create-account-btn"
                        loading={loading}
                        onClick={handleCreate}
                        icon={UserPlusIcon}
                        className="bg-accent-600 hover:bg-accent-700 focus:ring-accent-200"
                    >
                        {t('reg_create_btn')}
                    </Button>

                    <button
                        onClick={() => { setStep('details'); setOtp(['', '', '', '', '', '']); setErrors({}); }}
                        className="w-full text-center text-sm text-gray-500 font-medium py-2 hover:underline"
                    >
                        ← Back
                    </button>
                </>
            )}
        </div>
    );
}

// ─── MAIN LOGIN PAGE ──────────────────────────────────────────────────────
export default function Login() {
    const { t } = useLang();
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
            {/* Header */}
            <div className="bg-primary-600 px-6 pt-12 pb-16 text-center relative">
                <div className="absolute top-4 right-4">
                    <LangToggle />
                </div>
                <div className="text-4xl mb-3">🌾</div>
                <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
                <p className="text-primary-200 mt-1 text-sm">{t('appTagline')}</p>
            </div>

            {/* Card */}
            <div className="flex-1 px-5 -mt-8">
                <div className="card shadow-lg">
                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            id="tab-login"
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'login'
                                ? 'bg-white text-primary-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <PhoneIcon className="h-4 w-4" />
                            {t('tab_login')}
                        </button>
                        <button
                            id="tab-register"
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'register'
                                ? 'bg-white text-accent-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <UserPlusIcon className="h-4 w-4" />
                            {t('tab_register')}
                        </button>
                    </div>

                    {activeTab === 'login' ? (
                        <LoginFlow onSwitchToRegister={() => setActiveTab('register')} />
                    ) : (
                        <RegisterFlow onSwitchToLogin={() => setActiveTab('login')} />
                    )}
                </div>

                <div className="mt-6 text-center space-y-1">
                    <p className="text-xs text-gray-400">{t('login_terms')}</p>
                    <p className="text-xs text-primary-600 font-medium">{t('login_policy')}</p>
                </div>
            </div>
        </div>
    );
}
