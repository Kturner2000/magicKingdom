if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './.local.env' });; // Verify this path
}
const mongoose = require("mongoose");

async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;

    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected to ${conn.connection.host}`);
    } catch (err) {
        console.log("MongoDB connection error", err);
        throw err;
    }
}

module.exports = connectDB;
