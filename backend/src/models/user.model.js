const mongoose = require("mongoose");
const roles = ["reader", "writer", "admin"];

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        profilePic: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: roles, // Possible roles
            default: "reader", // Default role is reader
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
