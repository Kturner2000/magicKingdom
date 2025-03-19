import Navbar from "./components/header/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/Signup/SignUpPage";
import LoginPage from "./pages/Login/LoginPage";
import ProfilePage from "./pages/Signup/SignUpPage";
import ArticleFormPage from "./pages/ArticleFormPage/ArticleForm";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import ArticlePage from "./pages/Article_Page/ArticlePage";
import CategoryPage from "./pages/Category/categoryPage";

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );
    }

    return (
        <div>
            <div className={"header"}>
                <Navbar />
            </div>

            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route
                    path='/signup'
                    element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
                />
                <Route
                    path='/login'
                    element={!authUser ? <LoginPage /> : <Navigate to='/' />}
                />
                <Route
                    path='/profile'
                    element={
                        authUser ? <ProfilePage /> : <Navigate to='/login' />
                    }
                />
                <Route
                    path='/createArticle'
                    element={
                        authUser ? (
                            <ArticleFormPage />
                        ) : (
                            <Navigate to='/login' />
                        )
                    }
                />
                <Route
                    path='/updateArticle/:id'
                    element={
                        authUser ? (
                            <ArticleFormPage />
                        ) : (
                            <Navigate to='/login' />
                        )
                    }
                />
                {/* Route for viewing the article (no login required) */}
                <Route path='/articles/:id' element={<ArticlePage />} />
                <Route
                    path='/articles/category/:category'
                    element={<CategoryPage />}
                />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
