require("dotenv").config();

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
