const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            select: false, // Never returned in queries by default
        },
        otpExpiry: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Clear OTP fields after successful verification
userSchema.methods.clearOTP = function () {
    this.otp = undefined;
    this.otpExpiry = undefined;
    this.isVerified = true;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
