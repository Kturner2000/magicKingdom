const express = require("express");
const {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// endpoint, middleware, controller
router.put("/update-profile", protectRoute, updateProfile);

//check whether to take to login or profile page
router.get("/check", protectRoute, checkAuth);

module.exports = router;
