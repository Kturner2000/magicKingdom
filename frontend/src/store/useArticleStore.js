import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
// import { io } from "socket.io-client";

export const useArticleStore = create((set, get) => ({
    articles: [],
    article: null,
    isArticleLoading: false,
    error: null,

    getArticle: async (articleId) => {
        set({ isArticleLoading: true });

        try {
            const res = await axiosInstance.get(`/articles/${articleId}`);

            set({ article: res.data });
        } catch (err) {
            console.error("Error in getArticle: ", err.message);
            set({ error: err.message });
        } finally {
            set({ isArticleLoading: false });
        }
    },

    createArticle: async (articleData) => {
        set({ isArticleLoading: true, error: null });
        try {
            const res = await axiosInstance.post("/articles", articleData, {
                maxBodyLength: 10 * 1024 * 1024, 
            });
            set({ article: res.data });
            toast.success("Article created successfully");
            return true;
        } catch (err) {
            console.error("Error creating article:", err);
            set({ error: err.message });
            toast.error("Failed to create article");
            return false;
        } finally {
            set({ isArticleLoading: false });
        }
    },

    getArticles: async () => {
        set({ isArticleLoading: true });

        try {
            const res = await axiosInstance.get(`/articles`);

            set({ articles: res.data });
        } catch (err) {
            console.error("Error in getArticle: ", err.message);
            set({ error: "Internal server error" });
        } finally {
            set({ isArticleLoading: false });
        }
    },

    getArticlesByCategory: async (categoryName) => {
        set({ isArticleLoading: true });

        try {
            const res = await axiosInstance.get(
                `articles/category/${categoryName}`
            );

            set({ articles: res.data });
        } catch (err) {
            set({ error: "Internal server error" });
        } finally {
            set({ isArticleLoading: false });
        }
    },
    searchArticles: (query) => {
        const { articles } = get(); // Access the existing articles
        return articles.filter((article) =>
            article.title.toLowerCase().includes(query.toLowerCase())
        );
    },

    updateArticle: async ({ id, updateData }) => {
        set({ isArticleLoading: true, error: null });
        try {
            const res = await axiosInstance.put(`/articles/${id}`, updateData);
            set(state => ({
                articles: state.articles.map(article => 
                    article._id === id ? res.data : article
                ),
                article: state.article && state.article._id === id ? res.data : state.article
            }));
            toast.success("Article updated successfully");
        } catch (error) {
            console.error("Error in updateBookById:", error.message);
            set({ error: error.message });
        } finally {
            set({ isBookLoading: false,  error:null });
        }
    },

    deleteArticle: async (articleId) => {
        try {
            await axiosInstance.delete(`/articles/${articleId}`);
            toast.success("Article deleted successfully");
            set((state) => ({
                articles: state.articles.filter(article => article._id !== articleId),
                article: state.article && state.article._id === articleId ? null : state.article,
            }));
            return true; // Indicate successful deletion
        } catch (err) {
            console.error("Error deleting article:", err);
            toast.error("Failed to delete article");
            return false; // Indicate failure
        }
    },
}));
