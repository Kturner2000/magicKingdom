const Article = require("../models/article.model");
const s3 = require("../lib/aswS3");

const getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (err) {
        console.error("Error in getArticles: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const singleArticle = await Article.findById(articleId);

        res.status(200).json(singleArticle);
    } catch (err) {
        console.error("Error in getArticle: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const createArticle = async (req, res) => {
    try {
        const { title, content, main_image, category } = req.body;
        const author = req.user._id;
        let imageUrl;

        if (main_image) {
            // Convert base64 to buffer
            const buffer = Buffer.from(main_image.split(",")[1], "base64");
            const fileType = main_image.split(";")[0].split("/")[1];
            if (buffer.length > 10 * 1024 * 1024) {
                // limit file size to 10MB
                return res
                    .status(400)
                    .json({ error: "File size exceeds limit." });
            }

            const params = {
                Bucket: "disneykingdom",
                Key: `${Date.now()}.${fileType}`,
                Body: buffer,
                ContentType: `image/${fileType}`,
                ContentEncoding: "base64",
            };

            const uploadResult = await s3.upload(params).promise();
            imageUrl = uploadResult.Location;
        }

        const newArticle = new Article({
            title,
            content,
            main_image: imageUrl,
            author,
            category,
        });

        await newArticle.save();

        res.status(201).json(newArticle);
    } catch (err) {
        console.error("Error in newArticle: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getArticlesByCategory = async (req, res) => {
    const { category } = req.params; // Get category from the URL parameter
    try {
        // Query the database for articles by category
        const articles = category
            ? await Article.find({ category }).sort({ createdAt: -1 })
            : await Article.find().sort({ createdAt: -1 });
        if (articles.length === 0) {
            return res
                .status(404)
                .json({ error: "No articles found for this category." });
        }
        res.status(200).json(articles);
    } catch (err) {
        console.error("Error fetching articles by category: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateArticle = async (req, res) => {
    const articleId = req.params.id;
    try {
        const updatedArticle = await Article.findOneAndUpdate(
            { _id: articleId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedArticle) {
            return res.status(404).json({ error: "Article not found." });
        }
        res.status(200).json(updatedArticle);
    } catch (err) {
        console.error("Error in updateArticle: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteArticle = async (req, res) => {
    const articleId = req.params.id;
    try {
        const deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle) {
            return res.status(404).json({ error: "Article not found." });
        }
        res.status(200).json({ message: "Article deleted successfully." });
    } catch (err) {
        console.error("Error in deleteArticle: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getArticle,
    getArticles,
    createArticle,
    getArticlesByCategory,
    updateArticle,
    deleteArticle,
};
