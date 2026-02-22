/**
 * SMS Service — Mock implementation
 *
 * In production, replace the sendSMS function body with a real SMS provider:
 *   - Twilio: require('twilio')(accountSid, authToken)
 *   - MSG91: axios.post('https://api.msg91.com/api/v5/otp', { ...})
 *   - Fast2SMS: axios.post('https://www.fast2sms.com/dev/bulkV2', { ... })
 */

const sendSMS = async (phone, otp) => {
    // ─── MOCK: log to console during development ─────────────────────────
    console.log('─'.repeat(50));
    console.log(`📱 [SMS SERVICE] Sending OTP to +91${phone}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log(`⏰ Expires in: 5 minutes`);
    console.log('─'.repeat(50));

    // ─── PRODUCTION: Uncomment and configure one of the below ────────────
    //
    // // Twilio
    // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({
    //   body: `Your Smart Kisan Mitra OTP is: ${otp}. Valid for 5 minutes.`,
    //   from: process.env.TWILIO_PHONE,
    //   to: `+91${phone}`,
    // });
    //
    // // Fast2SMS (free tier available in India)
    // await axios.post('https://www.fast2sms.com/dev/bulkV2', {
    //   route: 'q',
    //   message: `Your Smart Kisan Mitra OTP is ${otp}. Valid for 5 minutes.`,
    //   language: 'english',
    //   numbers: phone,
    // }, { headers: { authorization: process.env.FAST2SMS_KEY } });

    return { success: true };
};

module.exports = { sendSMS };
