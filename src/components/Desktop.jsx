import React, { useState, useEffect } from 'react';
import Waybar from './Waybar';
import Window from './Window';
import Terminal from './apps/Terminal';
import Projects from './apps/Projects';
import Browser from './apps/Browser';
import Email from './apps/Email';
import Login from './Login';
import Launcher from './Launcher';
import PowerMenu from './PowerMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal as TerminalIcon, Github, Globe, Mail } from 'lucide-react';
import './Desktop.css';

// Gentoo-themed landscape wallpaper
const WALLPAPER_URL = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

const Desktop = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
    const [windows, setWindows] = useState([
        {
            id: 1,
            appId: 'terminal',
            title: 'Konsole — omindu@gentoo',
            component: <Terminal />,
            isOpen: true,
            isMinimized: false,
            zIndex: 1,
            x: null,
            y: null,
            width: 800,
            height: 500
        }
    ]);
    const [activeWindowId, setActiveWindowId] = useState(1);
    const [nextZIndex, setNextZIndex] = useState(10);

    const handleClose = (id) => {
        setWindows(windows.map(w => w.id === id ? { ...w, isOpen: false } : w));
    };

    const handleMinimize = (id) => {
        setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    };

    const handleMaximize = (id) => {
        setWindows(windows.map(w => w.id === id ? {
            ...w,
            width: w.width === '100%' ? 800 : '100%',
            height: w.height === '100%' ? 500 : '100%',
            x: w.width === '100%' ? null : 0,
            y: w.height === '100%' ? null : 0
        } : w));
    };

    const bringToFront = (id) => {
        setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
        setNextZIndex(nextZIndex + 1);
        setActiveWindowId(id);
    };

    const openApp = (appId, props = {}) => {
        const existing = windows.find(w => w.appId === appId && !props.forceNew);
        if (existing) {
            setWindows(windows.map(w => w.id === existing.id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZIndex } : w));
            setNextZIndex(nextZIndex + 1);
            return;
        }

        let component;
        let title;

        switch (appId) {
            case 'terminal':
                component = <Terminal />;
                title = 'Konsole — omindu@gentoo';
                break;
            case 'projects':
                component = <Projects />;
                title = 'Dolphin — GitHub Projects';
                break;
            case 'browser':
                component = <Browser initialUrl={props.url} />;
                title = 'Falkon — Web Browser';
                break;
            case 'about':
                component = <div style={{ padding: 20, color: '#eff0f1' }}><h1>About Me</h1><p>I'm Omindu, a developer.</p></div>;
                title = 'About Me';
                break;
            case 'email':
                component = <Email />;
                title = 'Thunderbird — Contact Me';
                break;
            default:
                return;
        }

        const newWindow = {
            id: Date.now(),
            appId,
            title,
            component,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZIndex,
            width: 800,
            height: 600,
            x: null,
            y: null
        };

        setWindows([...windows, newWindow]);
        setNextZIndex(nextZIndex + 1);
    };

    const handlePower = (action) => {
        if (action === 'lock') setIsLoggedIn(false);
        if (action === 'restart') window.location.reload();
        if (action === 'shutdown') setIsLoggedIn(false);
        if (action === 'sleep') alert("Zzz... (Just kidding, I can't sleep!)");
        setIsPowerMenuOpen(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} wallpaper={WALLPAPER_URL} />;
    }

    return (
        <motion.div
            className="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="wallpaper" style={{ backgroundImage: `url(${WALLPAPER_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Desktop Icons — top-left like KDE Plasma */}
            <div className="desktop-icons">
                <div className="desktop-icon" onClick={() => openApp('terminal')}>
                    <TerminalIcon size={36} />
                    <span>Konsole</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('browser', { url: 'internal://projects' })}>
                    <Github size={36} />
                    <span>Projects</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('browser', { url: 'https://google.com' })}>
                    <Globe size={36} />
                    <span>Falkon</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('email')}>
                    <Mail size={36} />
                    <span>Thunderbird</span>
                </div>
            </div>

            {/* Window area */}
            <div className="window-area">
                <AnimatePresence>
                    {windows.map((win) => (
                        win.isOpen && !win.isMinimized && (
                            <div key={win.id} onMouseDown={() => bringToFront(win.id)}>
                                <Window
                                    window={win}
                                    onClose={handleClose}
                                    onMinimize={handleMinimize}
                                    onMaximize={handleMaximize}
                                />
                            </div>
                        )
                    ))}
                </AnimatePresence>
            </div>

            {/* KDE Plasma Panel — bottom */}
            <Waybar
                onOpenLauncher={() => setIsLauncherOpen(!isLauncherOpen)}
                onPower={() => setIsPowerMenuOpen(true)}
                windows={windows}
                onWindowClick={(id) => {
                    const win = windows.find(w => w.id === id);
                    if (win && win.isMinimized) {
                        handleMinimize(id);
                    }
                    bringToFront(id);
                }}
            />

            <Launcher
                isOpen={isLauncherOpen}
                onClose={() => setIsLauncherOpen(false)}
                onLaunch={openApp}
                onPower={handlePower}
            />

            <AnimatePresence>
                {isPowerMenuOpen && (
                    <PowerMenu
                        isOpen={isPowerMenuOpen}
                        onClose={() => setIsPowerMenuOpen(false)}
                        onAction={handlePower}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Desktop;
