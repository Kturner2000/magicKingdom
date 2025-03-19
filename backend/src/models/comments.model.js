const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
