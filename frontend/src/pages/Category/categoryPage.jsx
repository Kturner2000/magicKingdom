import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleStore } from "../../store/useArticleStore";
import DOMPurify from "dompurify";

import styles from "./categoryPage.module.css";

export default function CategoryPage() {
    const { category } = useParams();
    const { getArticlesByCategory, articles, isArticleLoading, error } =
        useArticleStore();

    useEffect(() => {
        getArticlesByCategory(category);
    }, [getArticlesByCategory, category]);

    if (isArticleLoading) {
        return <div>Loading...</div>; // Optionally show a loading message or spinner
    }

    if (error) {
        return <div style={{ color: "red" }}>Error: {error}</div>; // Display the error message in red
    }

    if (!articles) {
        return <div>Articles not found.</div>; // Improved check to ensure valid article
    }

    return (
        <div className='page_container'>
            {articles.map((article) => {
                return (
                    <Link
                        to={`/articles/${article._id}`}
                        key={article._id}
                        className={`${styles.article}`}
                    >
                        <div className={styles.article_text}>
                            <h2 className={styles.article_title}>
                                {article.title}
                            </h2>

                            <p className={styles.article_excerpt}
                                    dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(article.excerpt),
                                }} />
                                
                           
                        </div>

                        <div className={styles.article_image_container}>
                            <img
                                className={styles.article_image}
                                src={article.main_image}
                                width={150}
                                height={150}
                            />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
