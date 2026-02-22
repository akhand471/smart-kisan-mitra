const crypto = require('crypto');

/**
 * Generates a cryptographically random 6-digit OTP string.
 * Returns a zero-padded string, e.g. "042819"
 */
const generateOTP = () => {
    // Random number between 0 and 999999, padded to 6 digits
    const otp = crypto.randomInt(100000, 999999);
    return otp.toString();
};

module.exports = generateOTP;
