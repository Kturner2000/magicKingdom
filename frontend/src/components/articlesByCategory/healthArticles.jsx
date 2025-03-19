import { Link } from "react-router-dom";
import Article from "../article/article";
import styles from "./healthArticles.module.css";
import { useArticleStore } from "../../store/useArticleStore";

export default function HealthArticles() {
    const { articles } = useArticleStore();

    // Filter articles by category
    const healthArticles =
        articles.filter((article) => article.category === "health") || [];

    return (
        <div className={styles.health_section}>
            <Link to='/articles/category/health'>
                <h1>Health</h1>
            </Link>
            <div className={styles.section_grid}>
            {healthArticles.length > 0 ? (
                healthArticles.map((article) => (
                    <Article key={article._id} article={article} />
                ))
            ) : (
                <p>No health articles available at the moment.</p> // Fallback message
            )}
        </div>
        </div>
    );
}
