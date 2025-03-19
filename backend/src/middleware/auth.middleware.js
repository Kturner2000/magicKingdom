const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async (req, res, next) => {
    try {
        //check if there is a token.
        const token = req.cookies.jwt;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No Token Provided" });
        }

        //decode the jwt cookie so we understand it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid Token" });
        }

        //-password = do not send the password back
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // user is authenticated
        req.user = user;

        next();
    } catch (err) {
        console.log("Error in protectRoute middleware: ", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = protectRoute;
