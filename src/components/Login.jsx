import React, { useState, useEffect } from 'react';
import { Power, RefreshCw, Moon, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import './Login.css';

const Login = ({ onLogin, wallpaper }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Click or key press — unlock directly
    useEffect(() => {
        const dismiss = () => onLogin();
        window.addEventListener('click', dismiss);
        window.addEventListener('keydown', dismiss);
        return () => {
            window.removeEventListener('click', dismiss);
            window.removeEventListener('keydown', dismiss);
        };
    }, [onLogin]);

    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-overlay" />

            {/* ═══ Lock Screen ═══ */}
            <motion.div
                className="lock-screen-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
