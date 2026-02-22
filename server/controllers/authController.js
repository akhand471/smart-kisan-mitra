const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const generateToken = require('../utils/generateToken');
const { sendSMS } = require('../services/smsService');

// ─── @desc   Send OTP to phone number
// ─── @route  POST /api/auth/send-otp
// ─── @access Public
const sendOTP = asyncHandler(async (req, res) => {
    const { phone, name } = req.body;

    // Validation
    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit phone number',
        });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
        user = await User.create({ phone, name: name || '' });
    } else if (name && !user.name) {
        user.name = name;
    }

    // Generate OTP and set expiry (5 minutes)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP via SMS (mock during development)
    await sendSMS(phone, otp);

    res.status(200).json({
        success: true,
        message: `OTP sent to +91${phone}`,
        // In development, also return OTP for easy testing
        ...(process.env.NODE_ENV === 'development' && { otp, note: 'OTP shown only in development mode' }),
    });
});

// ─── @desc   Verify OTP and login/register user
// ─── @route  POST /api/auth/verify-otp
// ─── @access Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Phone and OTP are required',
        });
    }

    // Fetch user including hidden otp fields
    const user = await User.findOne({ phone }).select('+otp +otpExpiry');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No account found for this phone number. Please register first.',
        });
    }

    // Check OTP match
    if (user.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP. Please try again.',
        });
    }

    // Check OTP expiry
    if (user.otpExpiry < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new one.',
        });
    }

    // Mark verified and clear OTP
    user.clearOTP();
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            _id: user._id,
            phone: user.phone,
            name: user.name,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        },
    });
});

// ─── @desc   Get current logged-in user profile
// ─── @route  GET /api/auth/me
// ─── @access Protected
const getMe = asyncHandler(async (req, res) => {
    const user = req.user; // populated by protect middleware
    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            phone: user.phone,
            name: user.name,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        },
    });
});

// ─── @desc   Update user profile (name)
// ─── @route  PUT /api/auth/me
// ─── @access Protected
const updateMe = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name },
        { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
});

module.exports = { sendOTP, verifyOTP, getMe, updateMe };
