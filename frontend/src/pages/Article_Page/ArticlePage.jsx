import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleStore } from "../../store/useArticleStore";
import styles from "./articlePage.module.css";
import DOMPurify from "dompurify";
import { SquarePen, Trash2 } from 'lucide-react'
import { useAuthStore } from "../../store/useAuthStore";

export default function ArticlePage() {
    const { id } = useParams();
    const { getArticle, article, deleteArticle, isArticleLoading, error } =
        useArticleStore();
    const { authUser, checkAuth } = useAuthStore();

    useEffect(() => {
        getArticle(id);
        checkAuth();
    }, [checkAuth, id, getArticle]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            const success = await deleteArticle(article._id);
            if (success) navigate("/articles"); // Redirect after successful deletion
        }
    };

    if (isArticleLoading) {
        return <div>Loading...</div>; // Optionally show a loading message or spinner
    }

    if (error) {
        return <div style={{ color: "red" }}>Error: {error}</div>; // Display the error message in red
    }

    if (!article || !article.title || !article.content) {
        return <div>Article not found.</div>; // Improved check to ensure valid article
    }

    return (
        <div>
            <main className={`${styles.page_content} ${"page_container"}`}>
                
                <section key={article._id} className={styles.page_header}>
                    <h1 className={styles.page_title}>{article.title}</h1>
                    {authUser &&
                        (authUser.role === "writer" ||
                            authUser.role === "admin") && (
                                <div className={styles.options}>
                                    <Link
                                            to={`/updateArticle/${article._id}`}
                                            
                                        >
                                           <SquarePen />
                                        </Link>
                            <button className={styles.delete} onClick={handleDelete}>
                                <Trash2 />
                            </button>
                                </div>
                                
                        )}
                </section>
                <section>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(article.content),
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
