import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArticleStore } from "../../store/useArticleStore";
import styles from "./article_form.module.css";
import Button from "react-bootstrap/Button";
import { Form, Image } from "react-bootstrap/";
import { X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

export default function ArticleFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createArticle, updateArticle, getArticle, article, isBookLoading, error } = useArticleStore();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        imagePreview: null,
        file: null,
        fileData: null
    });

    useEffect(() => {
        if (id) {
            getArticle(id);
        }
    }, [id, getArticle]);

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title || "",
                content: article.content || "",
                category: article.category || "",
                imagePreview: article.main_image || null,
                fileData: article.main_image || null
            });
        }
    }, [article]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file?.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    file,
                    imagePreview: reader.result,
                    fileData: {
                        data: reader.result,
                        width: img.width,
                        height: img.height
                    }
                }));
            };
        };
        reader.readAsDataURL(file);
    };

    function removeImage() {
        setFormData(prev => ({
            ...prev,
            imagePreview: null,
            file: null,
            fileData: null
        }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (formData.fileData?.width >= 1000) {
                toast.error("Image width must be less than 1000px");
                return;
            }
            
            if (formData.fileData?.width < 1000) {
                const articleData = {
                    title: formData.title,
                    content: formData.content.trim(),
                    main_image: formData.fileData,
                    category: formData.category,
                };

                if (id) {
                    await updateArticle({ id, updateData: articleData });
                    toast.success("Article updated successfully");
                } else {
                    await createArticle(articleData);
                    toast.success("Article created successfully");
                }

                navigate('/articles'); // Redirect to articles list
            } else {
                toast.error("Image width must be less than 1000px");
            }
        } catch (err) {
            console.error("Failed to save article:", err);
            toast.error("Failed to save article");
        }
    };

    return (
        <div>
            <h2>{id ? "Update Article" : "Create New Article"}</h2>
            {error && <div className="error-message">{error}</div>}
            <Form onSubmit={handleSubmit} className={styles.articleForm}>
                <div className={styles.titleCategoryRow}>
                                    <Form.Group className={styles.titleGroup}>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder="Article title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                
                                    <Form.Group className={styles.categoryGroup}>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            name="category"
                                            aria-label="Category select"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select a category</option>
                                            <option value="health">Health</option>
                                            <option value="technology_and_science">
                                                Technology and science
                                            </option>
                                            <option value="lifestyle">Lifestyle</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                                
                                <button
                                    type="button"
                                    className={`hidden sm:flex btn btn-circle ${
                                        formData.imagePreview ? "text-emerald-500" : "text-zinc-400"
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Image size={20} />
                                </button>
                
                                {formData.imagePreview && (
                                    <div className={styles.preview}>
                                        <div className="relative">
                                            <img src={formData.imagePreview} alt="Preview" />
                                            <button onClick={removeImage} type="button">
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                
                                <div>
                                    <Form.Group className={styles.contentGroup}>
                                        <Form.Label>Article Content</Form.Label>
                                        <ReactQuill
                                            value={formData.content}
                                            onChange={handleContentChange}
                                        />
                                    </Form.Group>
                                </div>

                <Button
                    variant="primary"
                    type="submit"
                    className={styles.submitButton}
                    disabled={isBookLoading}
                >
                    {isBookLoading ? "Saving..." : (id ? "Update Article" : "Create Article")}
                </Button>
            </Form>
        </div>
    );
}
