import { useState } from 'react';
import { login } from '../api/api';
import './Login.css';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login({ email, password });
            onLoginSuccess(res.data.token, res.data.userName);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Teacher's Portal</h2>
                        <p>Welcome! Please sign in to continue.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="e.g., teacher@school.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group password-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
                <div className="login-footer">
                    <p>&copy; {new Date().getFullYear()} SchoolApp. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}