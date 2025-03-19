import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./lifestyleArticle.module.css";
import Article from "../article/article";
import { useArticleStore } from "../../store/useArticleStore";

export default function LifestyleArticles() {
    const { articles } = useArticleStore();

    const lifestyleArticles =
        articles.filter((article) => article.category === "lifestyle") || [];

    const bannerArticle = lifestyleArticles[0];
    const bannerArticleBkg = bannerArticle?.main_image || "defaultImageUrl";
    const sectionOneGrid = lifestyleArticles.slice(2, 6);

    return (
        <div>
            <Link to='/articles/category/lifestyle'>
                <h1>Lifestyle</h1>
            </Link>
            <div className={styles.lifestyle_section}>
                {bannerArticle && (
                    <div
                        className={styles.banner_article}
                        style={{
                            backgroundImage: `url('${bannerArticleBkg}')`,
                        }}
                    >
                        <h1 className={styles.banner_text_container}>
                            <Link
                                className={styles.banner_text}
                                to={`/article/${bannerArticle._id}`}
                            >
                                {bannerArticle.title}
                            </Link>
                        </h1>
                    </div>
                )}
                <div className={styles.section_grid}>
                    {sectionOneGrid.map((article) => (
                        <Article key={article._id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}
