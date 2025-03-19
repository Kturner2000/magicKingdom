const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const validCategories = ["health", "lifestyle", "technology_and_science"];

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        slug: { type: String, slug: "title" },
        content: {
            type: String,
        },
        main_image: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: validCategories,
            required: true,
        },
    },
    { timestamps: true }
);

articleSchema.virtual("excerpt").get(function () {
    return this.content ? this.content.substring(0, 200) + "..." : "";
});

// Add this to include virtuals in JSON output
articleSchema.set("toJSON", { virtuals: true });
articleSchema.set("toObject", { virtuals: true });

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
