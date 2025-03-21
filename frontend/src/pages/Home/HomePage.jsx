import React, { useEffect } from "react";
import Article from "../../components/article/article"; // Assuming you are going to display articles in a list
import styles from "./homepage.module.css";
import { useArticleStore } from "../../store/useArticleStore";
import { Link } from "react-router-dom";
import TechAndScienceSection from "../../components/articlesByCategory/scienceAndTechArticles";
import LifestyleArticles from "../../components/articlesByCategory/lifestyleArticles";
import HealthArticles from "../../components/articlesByCategory/healthArticles";

export default function HomePage() {
    const { getArticles, articles, isArticleLoading, error } =
        useArticleStore();

    
        useEffect(() => {
            getArticles();
        }, [getArticles]);
    
        if (isArticleLoading) {
            return <div>Loading...</div>;
        }
    
        if (error) {
            return <div>Error: {error}</div>;
        }
    
        if (!articles || articles.length === 0) {
            return <div>No articles found.</div>;
        }

    const bannerArticle = articles[0];
    const bannerArticleBkg = bannerArticle?.mainImage ?? "defaultImageUrl";
    const sectionOneGrid = articles.slice(1, 5);
    const sectionTwoGrid = articles.slice(5, 9);
    console.log(articles)

    return (
        <main className='page_container'>
            <div className={styles.section_one}>
                <div className={styles.banner_article}>
                        <Link to={`/articles/${bannerArticle._id} `}>
                            <img src={articles[0].main_image} alt="backgroundImage" className={styles.banner_article_img} />
                            <h1 className={styles.banner_text}>
                                {bannerArticle.title}
                            </h1>
                        </Link>
                   
                </div>
                <div className={styles.section_one_grid}>
                    {sectionOneGrid.map((article) => {
                        return <Article key={article._id} article={article} />;
                    })}
                </div>
            </div>
            <div className={styles.section_two}>
                {sectionTwoGrid.map((article) => {
                    return <Article key={article._id} article={article} />;
                })}
            </div>
            <div className={styles.post_by_categories}>
                <LifestyleArticles />
                <HealthArticles />
                <TechAndScienceSection />
            </div>
        </main>
    );
}
