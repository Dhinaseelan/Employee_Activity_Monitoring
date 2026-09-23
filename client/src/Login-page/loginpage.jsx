import React, { useContext, useState } from 'react';
import '../Login-page/login-page.css';
import DataContext from '../Context/AdminContext/Datacontext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import NetworkBackground from '../Components/3D/NetworkBackground';

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
                <NetworkBackground />
                <div className="branding-content">
                    <div className="brand-logo">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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

                </div>
            </div>
        </div>
    );
};

export default Loginpage;
