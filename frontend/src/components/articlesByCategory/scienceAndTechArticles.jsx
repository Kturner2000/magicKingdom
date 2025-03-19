import { Link } from "react-router-dom";
import { useArticleStore } from "../../store/useArticleStore";
import styles from "./sciAndTechArticles.module.css";
import Article from "../article/article";

export default function TechAndScienceSection() {
    const { articles } = useArticleStore();

    // Fetch articles on component mount

    // Filter articles by category
    const techandScienceArticles =
        articles?.filter(
            (article) => article.category === "technology_and_science"
        ) || [];

    // Safely handle banner and grid articles

    const firstBannerArticle = techandScienceArticles[0];
    const secondBannerArticle = techandScienceArticles[1];
    const sectionGrid = techandScienceArticles.slice(2, 6);

    return (
        <div>
            <Link to='/articles/category/technology_and_science'>
                <h1>Science and Technology</h1>
            </Link>

            <div className={styles.techAndScienceSection}>
                {/* First Banner Article */}
                {firstBannerArticle && (
                    <div className={styles.grid_item_1}>
                        <Article
                            key={firstBannerArticle._id}
                            article={firstBannerArticle}
                            className={styles.banner_article}
                            
                        />
                    </div>
                )}
                {/* Second Banner Article */}
                {secondBannerArticle && (
                    <div className={styles.grid_item_2}>
                        <Article
                            key={secondBannerArticle._id}
                            article={secondBannerArticle}
                            className={styles.banner_article}
                        />
                    </div>
                )}
                {/* Section Grid Articles */}
                {sectionGrid.map((article) => (
                    <div className={styles.grid_item} key={article._id}>
                        <Article article={article} />
                    </div>
                ))}
            </div>
        </div>
    );
}
