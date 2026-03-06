import React, { useState, useEffect } from 'react';
import { Power, RefreshCw, Moon, ArrowUp, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import './Login.css';

const Login = ({ onLogin, wallpaper }) => {
    const [time, setTime] = useState(new Date());
    const [isLockScreen, setIsLockScreen] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Lock screen — click/key to dismiss
    useEffect(() => {
        if (isLockScreen) {
            const dismiss = () => setIsLockScreen(false);
            window.addEventListener('click', dismiss);
            window.addEventListener('keydown', dismiss);
            return () => {
                window.removeEventListener('click', dismiss);
                window.removeEventListener('keydown', dismiss);
            };
        }
    }, [isLockScreen]);

    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-overlay" />

            <AnimatePresence mode="wait">
                {isLockScreen ? (
                    /* ═══ Lock Screen ═══ */
                    <motion.div
                        key="lockscreen"
                        className="lock-screen-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="lock-time">{format(time, 'HH:mm')}</div>
                        <div className="lock-date">{format(time, 'EEEE, MMMM d')}</div>

                        <motion.div
                            className="lock-hint"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ArrowUp size={20} />
                            <span>Click or press any key to unlock</span>
                        </motion.div>
                    </motion.div>
                ) : (
                    /* ═══ Login/Greeter Screen ═══ */
                    <motion.div
                        key="greeter"
                        className="login-container"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="login-kde-logo">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="#3daee9">
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            <span className="login-distro-label">Gentoo Linux</span>
                        </div>

                        <div className="user-avatar-ring">
                            <div className="user-avatar">
                                <img src="https://github.com/OminduD.png" alt="User Avatar" />
                            </div>
                        </div>

                        <div className="user-name">OminduD</div>
                        <div className="user-greeting">Welcome back</div>

                        <button className="login-unlock-btn" onClick={onLogin}>
                            <Lock size={16} />
                            <span>Unlock</span>
                        </button>

                        <div className="login-session-info">
                            <span className="session-dot" />
                            <span>Plasma (Wayland)</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Bottom Bar ── */}
            <div className="sddm-bottom-bar">
                <div className="sddm-bottom-left">
                    <span className="sddm-hostname">gentoo</span>
                </div>
                <div className="sddm-bottom-right">
                    <div className="sddm-clock-small">
                        {format(time, 'HH:mm')}
                    </div>
                    <div className="sddm-controls">
                        <button className="sddm-btn" title="Sleep">
                            <Moon size={16} />
                        </button>
                        <button className="sddm-btn" title="Restart" onClick={() => window.location.reload()}>
                            <RefreshCw size={16} />
                        </button>
                        <button className="sddm-btn" title="Shutdown">
                            <Power size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
