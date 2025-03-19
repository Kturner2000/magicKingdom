import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./header.module.css";
import { Loader, User, Search, Pencil } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useArticleStore } from "../../store/useArticleStore";
import SearchedArticles from "../searchedArticles/Searched_Articles";

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredArticles, setFilteredArticles] = useState([]);

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [pencilDropdownOpen, setPencilDropdownOpen] = useState(false);

    const searchInputRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const pencilDropdownRef = useRef(null);

    const { authUser, checkAuth, isCheckingAuth, logout } = useAuthStore();
    const { getArticles, searchArticles } = useArticleStore();

    const toggleProfileDropdown = () =>
        setProfileDropdownOpen(!profileDropdownOpen);
    const togglePencilDropdown = () =>
        setPencilDropdownOpen(!pencilDropdownOpen);

    useEffect(() => {
        checkAuth();
        getArticles();
    }, [checkAuth, getArticles]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setProfileDropdownOpen(false);
            }
            if (
                pencilDropdownRef.current &&
                !pencilDropdownRef.current.contains(event.target)
            ) {
                setPencilDropdownOpen(false);
            }
            if (
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(event.target) &&
                !event.target.closest(`.${styles.search_container}`)
            ) {
                setIsModalOpen(false);
                setSearchOpen(false);
                setSearchText("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (value.trim()) {
            const results = searchArticles(value);
            const sortedResults = results.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            setFilteredArticles(sortedResults);
            setSearchOpen(true);
        } else {
            setFilteredArticles([]);
            setSearchOpen(false);
        }
    };

    return (
        <header className={styles.header_container}>
            <div className={styles.header}>
                <div className={styles.logo_container}>
                    <Link to='/' className={styles.home_link}>
                        <h1>The Magic Kingdom Chronicles</h1>
                    </Link>
                </div>
                <div className={styles.nav_icons}>
                    <div ref={searchDropdownRef} className={styles.dropdown}>
                        <Search
                            color='#000'
                            size={20}
                            onClick={() => setIsModalOpen(true)}
                            aria-label='Toggle search input'
                            className={styles.icon}
                        />
                        {isModalOpen && (
                            <div className={styles.search_container}>
                                <input
                                    type='text'
                                    placeholder='Search...'
                                    value={searchText}
                                    onChange={handleSearchInput}
                                    className={`${styles.search_input} ${
                                        isModalOpen ? styles.open : ""
                                    }`}
                                    ref={searchInputRef}
                                />
                                {isSearchOpen && (
                                    <div className={styles.list_box}>
                                        {filteredArticles.length > 0 ? (
                                            <ul>
                                                {filteredArticles.map(
                                                    (article) => (
                                                        <SearchedArticles
                                                            key={article._id}
                                                            article={article}
                                                        />
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p>No articles found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div ref={profileDropdownRef} className={styles.dropdown}>
                        <User
                            color='#000'
                            size={20}
                            aria-label='Profile options'
                            className={styles.icon}
                            onClick={toggleProfileDropdown}
                        />
                        {profileDropdownOpen && (
                            <div className={styles.dropdown_menu}>
                                {!authUser ? (
                                    <>
                                        <Link to='/login'>Login</Link>
                                        <Link to='/signup'>Sign Up</Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setProfileDropdownOpen(false);
                                        }}
                                        className={styles.logout_btn}
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {authUser &&
                        (authUser.role === "writer" ||
                            authUser.role === "admin") && (
                            <div
                                ref={pencilDropdownRef}
                                className={styles.dropdown}
                            >
                                <Pencil
                                    color='#000'
                                    size={20}
                                    aria-label='Article options'
                                    className={styles.icon}
                                    onClick={togglePencilDropdown}
                                />
                                {pencilDropdownOpen && (
                                    <div className={styles.dropdown_menu}>
                                        <Link
                                            to='/createArticle'
                                            onClick={() =>
                                                setPencilDropdownOpen(false)
                                            }
                                        >
                                            Create Article
                                        </Link>
                                        
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </header>
    );
}
