import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const SPLASH_DURATION = 3500; // ms

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => onFinish(), SPLASH_DURATION);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
            <img
                className="splash-logo"
                src={`${import.meta.env.BASE_URL}splash.gif`}
                alt="Boot Splash"
                draggable={false}
            />

            <div className="splash-branding">
                <div className="splash-title">KDE Plasma</div>
                <div className="splash-subtitle">Loading Desktop…</div>
            </div>

            <div className="splash-loader">
                <div className="splash-loader-bar" />
            </div>

            <div className="splash-bottom">
                Initializing KDE Plasma Desktop…
            </div>
        </motion.div>
    );
};

export default SplashScreen;
