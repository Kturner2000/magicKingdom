import { Link } from "react-router-dom";
import styles from "./searched.module.css";

export default function SearchedArticles({ key, article }) {
    return (
        <Link
            key={key}
            to={`/articles/${article.slug}`}
            className={styles.article}
        >
            <div>
                {article.main_image && (
                    <img
                        alt={article.title}
                        src={article.main_image}
                        className={styles.article_image}
                    />
                )}
                <p>{article.title}</p>
            </div>
        </Link>
    );
}
