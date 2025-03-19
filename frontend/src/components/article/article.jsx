import styles from "./article.module.css";
import { Link } from "react-router-dom";

export default function Article({ article, className }) {
    return (
        <div key={article._id} className={`${styles.article} ${styles[className]}`}>
            <Link to={`/articles/${article._id}`}>
                <div
                    key={article._id}
                    className={styles.article_image_container}
                >
                    <img
                        key={article.main_image}
                        src={article.main_image}
                        width={500}
                        height={500}
                        className={styles.article_image}
                    />
                </div>

                <h1 className={styles.article_title}>{article.title}</h1>
            </Link>
        </div>
    );
}
