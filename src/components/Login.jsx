import React from 'react';
import { Power, RefreshCw, Moon } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin, wallpaper }) => {
    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-overlay" />

            <div className="login-container">
                <div className="login-kde-logo">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                    <span className="login-distro-label">Gentoo Linux</span>
                </div>

                <div className="user-avatar">
                    <img src="https://github.com/OminduD.png" alt="User Avatar" />
                </div>
                <div className="user-name">OminduD</div>

                <div className="login-input-row">
                    <input
                        type="password"
                        className="password-input"
                        placeholder="Password"
                        onKeyDown={(e) => { if (e.key === 'Enter') onLogin(); }}
                        autoFocus
                    />
                    <button className="login-btn" onClick={onLogin}>
                        →
                    </button>
                </div>

                <div className="login-session-info">
                    <span>Session: Plasma (Wayland)</span>
                </div>
            </div>

            <div className="sddm-controls">
                <button className="sddm-btn" title="Sleep">
                    <Moon size={18} />
                </button>
                <button className="sddm-btn" title="Restart" onClick={() => window.location.reload()}>
                    <RefreshCw size={18} />
                </button>
                <button className="sddm-btn" title="Shutdown" onClick={() => alert("It's a website, you can just close the tab! :)")}>
                    <Power size={18} />
                </button>
            </div>
        </div>
    );
};

export default Login;
