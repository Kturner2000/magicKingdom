const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./lib/db.js");

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../../.local.env' }); // Verify this path
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOrigin = process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173";

app.use(cors({ origin: corsOrigin, credentials: true }));

// Routes
const authRoutes = require("./routes/auth.routes.js");
const articleRoutes = require("./routes/article.routes.js");
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

// Static files and catch-all route (PRODUCTION ONLY)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Use PORT variable here
    connectDB().catch(err => console.error("Database connection failed:", err));
});
