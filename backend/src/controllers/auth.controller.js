const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const bcyrpt = require("bcryptjs");
const s3 = require("../lib/aswS3");

const signup = async (req, res) => {
    const { fullName, email, password, profilePic } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // check if password is long enough
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters" });
        }

        // check if email already exists
        const user = await User.findOne({ email });
        if (user)
            return res
                .status(400)
                .json({ message: "Email already registered" });

        //  hashing a plain text password plus a salt, the hash algorithm’s output is no longer predictable.
        //A salt is a random string
        const salt = await bcyrpt.genSalt(10);
        //hash password
        const hashedPassword = await bcyrpt.hash(password, salt);

        //create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic,
        });

        if (newUser) {
            //generate jwt token
            generateToken(newUser._id, res);
            // adds user to db collection
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//check if the email exists and see if the password matches
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare the password entered with the hashedPassword
        const isPasswordCorrect = await bcyrpt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password doesn't match" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const logout = (req, res) => {
    try {
        // clearing the cookie - removing their authentication token stored in a cookie.
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//update the profile pic
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadRes = await s3.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadRes.secure_url,
            },
            // return the document after update was applied.
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("error in update profile:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = async (req, res) => {
    try {
        //send user back to client.
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in checkAuth controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signup, login, logout, updateProfile, checkAuth };
