import React, { useState, useEffect } from 'react';
import { Power, RefreshCw, Moon, Unlock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import './Login.css';

const Login = ({ onLogin, wallpaper }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // NOTE: Removed full window click listener to make it feel more "interactive" with the specific button
    // But kept keydown for convenience
    useEffect(() => {
        const handleKey = () => onLogin();
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onLogin]);

    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-overlay" />

            {/* Time */}
            <motion.div
                className="lock-time"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {format(time, 'HH:mm')}
            </motion.div>
            <motion.div
                className="lock-date"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            >
                {format(time, 'EEEE, MMMM d')}
            </motion.div>

            {/* ═══ User Login Area ═══ */}
            <motion.div
                className="lock-screen-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="lock-avatar-container">
                    <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="User" className="lock-avatar" />
                </div>
                <div className="lock-user-name">OminduD</div>

                <div className="lock-input-container" onClick={onLogin}>
                    <div className="lock-password-display">
                        <Unlock size={14} />
                        <span>Click to Unlock</span>
                        <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                    </div>
                </div>
            </motion.div>

            {/* ── Bottom Bar ── */}
            <div className="sddm-bottom-bar">
                <div className="sddm-controls">
                    <button className="sddm-btn" title="Sleep">
                        <Moon size={20} />
                    </button>
                    <button className="sddm-btn" title="Restart" onClick={() => window.location.reload()}>
                        <RefreshCw size={20} />
                    </button>
                    <button className="sddm-btn" title="Shutdown">
                        <Power size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
