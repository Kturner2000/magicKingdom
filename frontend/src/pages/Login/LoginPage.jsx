import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import styles from "./Login.module.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, isLoggingIn } = useAuthStore();

    function handleSubmit(e) {
        e.preventDefault();
        login(formData);
    }

    return (
        <div>
            <div className={styles.page_container}>
                <div>
                    <div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.email_container}>
                        <label>
                            <span>
                                <Mail /> <span>Email</span>
                            </span>
                        </label>
                        <div>
                            <input
                                type='email'
                                className={styles.email_input}
                                placeholder='you@example.com'
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label>
                            <span>
                                <Lock /> Password
                            </span>
                        </label>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder='••••••••'
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <button type='submit' disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <>
                                <Loader2 />
                                Loading...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <div>
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link to='/signup'>Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
