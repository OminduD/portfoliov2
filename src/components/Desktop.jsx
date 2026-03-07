import React, { useState, useEffect, useCallback } from 'react';
import Waybar from './Waybar';
import Window from './Window';
import Terminal from './apps/Terminal';
import Projects from './apps/Projects';
import Browser from './apps/Browser';
import Email from './apps/Email';
import Login from './Login';
import Launcher from './Launcher';
import PowerMenu from './PowerMenu';
import SplashScreen from './SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, RefreshCw, Settings, FolderOpen } from 'lucide-react';
import './Desktop.css';

const WALLPAPER_URL = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

const Desktop = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [splashDone, setSplashDone] = useState(false);
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [windows, setWindows] = useState([
        {
            id: 1,
            appId: 'terminal',
            title: 'Kitty — omindu@linux',
            component: <Terminal />,
            isOpen: true,
            isMinimized: false,
            zIndex: 1,
            x: null,
            y: null,
            width: 800,
            height: 500,
            isMaximized: false,
            prevBounds: null
        }
    ]);
    const [activeWindowId, setActiveWindowId] = useState(1);
    const [nextZIndex, setNextZIndex] = useState(10);

    // Show welcome notification on first login
    const showNotification = useCallback((title, body, icon = '🔔') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, title, body, icon }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    // Welcome notification after splash finishes
    useEffect(() => {
        if (splashDone) {
            const timer = setTimeout(() => {
                showNotification('Welcome back, Omindu!', 'KDE Plasma 6.3 • Wayland', '🐧');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [splashDone, showNotification]);

    const handleClose = (id) => {
        setWindows(windows.map(w => w.id === id ? { ...w, isOpen: false } : w));
    };

    const handleMinimize = (id) => {
        setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    };

    const handleMaximize = (id) => {
        setWindows(windows.map(w => {
            if (w.id !== id) return w;
            if (w.isMaximized) {
                // Restore to previous bounds
                return {
                    ...w,
                    isMaximized: false,
                    width: w.prevBounds?.width || 800,
                    height: w.prevBounds?.height || 500,
                    x: w.prevBounds?.x ?? null,
                    y: w.prevBounds?.y ?? null
                };
            } else {
                // Maximize — fill the window-area
                return {
                    ...w,
                    isMaximized: true,
                    prevBounds: { width: w.width, height: w.height, x: w.x, y: w.y },
                    width: '100%',
                    height: '100%',
                    x: 0,
                    y: 0
                };
            }
        }));
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
                title = 'Kitty — omindu@linux';
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
            y: null,
            isMaximized: false,
            prevBounds: null
        };

        setWindows([...windows, newWindow]);
        setNextZIndex(nextZIndex + 1);
    };

    const handlePower = (action) => {
        if (action === 'lock') { setIsLoggedIn(false); setSplashDone(false); }
        if (action === 'restart') window.location.reload();
        if (action === 'shutdown') { setIsLoggedIn(false); setSplashDone(false); }
        if (action === 'sleep') alert("Zzz... (Just kidding, I can't sleep!)");
        setIsPowerMenuOpen(false);
    };

    // Right-click context menu on desktop
    const handleContextMenu = (e) => {
        // Only show on the desktop bg / wallpaper / icons area, not inside windows
        if (e.target.closest('.window') || e.target.closest('.konsole-wrapper')) return;
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    // Close context menu on any click
    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} wallpaper={WALLPAPER_URL} />;
    }

    // Loading splash between lock screen and desktop
    if (!splashDone) {
        return (
            <AnimatePresence mode="wait">
                <SplashScreen key="splash" onFinish={() => setSplashDone(true)} />
            </AnimatePresence>
        );
    }

    return (
        <motion.div
            className="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onContextMenu={handleContextMenu}
        >
            <div className="wallpaper" style={{ backgroundImage: `url(${WALLPAPER_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Desktop Icons — top-left like KDE Plasma */}
            <div className="desktop-icons">
                <div className="desktop-icon" onClick={() => openApp('terminal')}>
                    <img className="desktop-icon-img" src="/kitty.svg" alt="Kitty" draggable={false} />
                    <span>Kitty</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('browser', { url: 'internal://projects' })}>
                    <img className="desktop-icon-img" src="/github.png" alt="Projects" draggable={false} />
                    <span>Projects</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('browser', { url: 'https://google.com' })}>
                    <img className="desktop-icon-img" src="/falcon.png" alt="Falkon" draggable={false} />
                    <span>Falkon</span>
                </div>
                <div className="desktop-icon" onClick={() => openApp('email')}>
                    <img className="desktop-icon-img" src="/thunderbird.png" alt="Thunderbird" draggable={false} />
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

            {/* ── Right-click Context Menu ── */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        className="ctx-menu"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.12 }}
                    >
                        <div className="ctx-item" onClick={() => openApp('terminal')}>
                            <img className="ctx-icon-img" src="/kitty.svg" alt="" />
                            <span>Open Kitty</span>
                        </div>
                        <div className="ctx-item" onClick={() => openApp('browser', { url: 'https://google.com' })}>
                            <img className="ctx-icon-img" src="/falcon.png" alt="" />
                            <span>Open Falkon</span>
                        </div>
                        <div className="ctx-item" onClick={() => openApp('browser', { url: 'internal://projects' })}>
                            <FolderOpen size={14} />
                            <span>Open Projects</span>
                        </div>
                        <div className="ctx-item" onClick={() => openApp('email')}>
                            <img className="ctx-icon-img" src="/thunderbird.png" alt="" />
                            <span>Open Thunderbird</span>
                        </div>
                        <div className="ctx-divider" />
                        <div className="ctx-item" onClick={() => window.location.reload()}>
                            <RefreshCw size={14} />
                            <span>Refresh Desktop</span>
                        </div>
                        <div className="ctx-item" onClick={() => showNotification('System Info', `Arch Linux • KDE Plasma 6.3\nKernel 6.12.74-1-lts • Wayland`, '🖥️')}>
                            <Monitor size={14} />
                            <span>System Info</span>
                        </div>
                        <div className="ctx-divider" />
                        <div className="ctx-item ctx-item-muted">
                            <Settings size={14} />
                            <span>Configure Desktop…</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Notification Toasts ── */}
            <div className="notification-area">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            className="notification-toast"
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                            onClick={() => setNotifications(prev => prev.filter(nn => nn.id !== n.id))}
                        >
                            <span className="notif-icon">{n.icon}</span>
                            <div className="notif-body">
                                <div className="notif-title">{n.title}</div>
                                <div className="notif-text">{n.body}</div>
                            </div>
                            <div className="notif-progress" />
                        </motion.div>
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
                onOpenApp={openApp}
                onShowDesktop={() => {
                    const anyVisible = windows.some(w => w.isOpen && !w.isMinimized);
                    setWindows(windows.map(w => w.isOpen ? { ...w, isMinimized: anyVisible } : w));
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
