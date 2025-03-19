const express = require("express");
const {
    getCommentUser,
    getMessages,
    sendMessage,
} = require("../controllers/comments.controller");
const protectRoute = require("../middlewear/auth.middleware");

const router = express.Router();

router.get("/users/:id", protectRoute, getCommentUser);

router.get("/:id", protectRoute, getComment);

router.post("/post/:id", protectRoute, sendComment);

module.exports = router;
