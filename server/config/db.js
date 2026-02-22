const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    // If no real URI is configured, skip connection (non-DB routes still work)
    if (!uri || uri.includes('<username>')) {
        console.warn('⚠️  MONGO_URI not configured — skipping DB connection.');
        console.warn('   Update .env with your MongoDB Atlas connection string.');
        console.warn('   Auth & Expense routes will not work until DB is connected.');
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('⚠️  Server will continue — DB-dependent routes (auth, expenses) will not work.');
        console.warn('   Fix: Whitelist your IP in MongoDB Atlas → Network Access → Add Current IP.');
        // Do NOT process.exit — let non-DB routes (mandi, weather, crop) keep working
    }
};

module.exports = connectDB;
