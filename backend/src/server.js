const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

const connectDB = require("./lib/db.js");

const PORT = process.env.PORT;

// Routes
const authRoutes = require("./routes/auth.routes.js");
const articleRoutes = require("./routes/article.routes.js");
// const commentRoutes = require("./routes/comment.routes.js");

// auth
// posts
// comment

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
// app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
    connectDB();
});
