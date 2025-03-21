const express = require("express");
const {
    getArticle,
    getArticles,
    createArticle,
    getArticlesByCategory,
    updateArticle,
    deleteArticle,
} = require("../controllers/article.controller");
const protectRoute = require("../middleware/auth.middleware");
const {
    requireWriterRole,
    requireAdminRole,
} = require("../middleware/roles.middleware");
const router = express.Router();

// Public routes
router.get("/", getArticles); 
router.get("/category/:category", getArticlesByCategory); 
router.get("/:id", getArticle);


// Protected routes
router.post("/", protectRoute, requireWriterRole, createArticle); 
router.put("/:id", protectRoute, requireWriterRole, updateArticle); 
router.delete("/:id", protectRoute, requireAdminRole, deleteArticle);

module.exports = router;
