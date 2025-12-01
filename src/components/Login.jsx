import React from 'react';
import { Power, RefreshCw, Moon } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin, wallpaper }) => {
    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-overlay" />

            <div className="login-container">
                <div className="user-avatar">
                    <img src="https://github.com/OminduD.png" alt="User Avatar" />
                </div>
                <div className="user-name">OminduD</div>

                <button className="login-btn" onClick={onLogin} autoFocus>
                    Login
                </button>
            </div>

            <div className="sddm-controls">
                <button className="sddm-btn" title="Sleep">
                    <Moon size={20} />
                </button>
                <button className="sddm-btn" title="Restart" onClick={() => window.location.reload()}>
                    <RefreshCw size={20} />
                </button>
                <button className="sddm-btn" title="Shutdown" onClick={() => alert("It's a website, you can just close the tab! :)")}>
                    <Power size={20} />
                </button>
            </div>
        </div>
    );
};

export default Login;
