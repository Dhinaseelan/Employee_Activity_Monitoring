import React, { useContext, useState } from 'react';
import '../Login-page/login-page.css';
import DataContext from '../Context/AdminContext/Datacontext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Loginpage = () => {
    const { handleChange, handleLogin, error } = useContext(DataContext);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (e) => {
        setIsLoading(true);
        handleLogin(e);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="login-page">
            {/* Left branding panel */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="brand-logo">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.15)" />
                            <path d="M14 34V22C14 17.5817 17.5817 14 22 14H26C30.4183 14 34 17.5817 34 22V34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="24" cy="24" r="4" stroke="white" strokeWidth="2" />
                            <path d="M20 34H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className="brand-title">Employee Activity</h1>
                    <h2 className="brand-subtitle">Monitoring System</h2>
                    <p className="brand-desc">
                        Track attendance, manage projects, and monitor team performance — all in one place.
                    </p>
                    <div className="brand-features">
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Real-time activity tracking</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Face recognition check-in</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Project management dashboard</span>
                        </div>
                    </div>
                </div>
                <div className="branding-footer">
                    <span>© 2026 Employee Activity Monitor</span>
                </div>
            </div>

            {/* Right form panel */}
            <div className="login-form-panel">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your account to continue</p>
                    </div>

                    <form className="login-form" onSubmit={onSubmit}>
                        {error && (
                            <div className="error-banner">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                                    <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email address</label>
                            <div className="input-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@company.com"
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="form-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn google-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button className="social-btn microsoft-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 21 21">
                                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                            </svg>
                            Microsoft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginpage;
