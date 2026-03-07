import React, { useState, useEffect, useRef } from 'react';
import { User, Power, RefreshCw, Lock, Settings, FolderOpen, Moon, Code, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Launcher.css';

const Launcher = ({ isOpen, onClose, onLaunch, onPower }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('favorites');
    const [hoveredApp, setHoveredApp] = useState(null);
    const inputRef = useRef(null);

    const apps = [
        { id: 'terminal', name: 'Kitty', desc: 'Terminal Emulator', icon: <img className="launcher-app-icon" src="/kitty.svg" alt="Kitty" />, category: 'System', action: () => onLaunch('terminal'), favorite: true },
        { id: 'projects', name: 'GitHub Projects', desc: 'View Repositories', icon: <img className="launcher-app-icon" src="/github.png" alt="GitHub" />, category: 'Development', action: () => onLaunch('projects'), favorite: true },
        { id: 'browser', name: 'Falkon', desc: 'Web Browser', icon: <img className="launcher-app-icon" src="/falcon.png" alt="Falkon" />, category: 'Internet', action: () => onLaunch('browser', { url: 'https://www.google.com/webhp?igu=1' }), favorite: true },
        { id: 'email', name: 'Thunderbird', desc: 'Contact Me', icon: <img className="launcher-app-icon" src="/thunderbird.png" alt="Thunderbird" />, category: 'Internet', action: () => onLaunch('email'), favorite: true },
        { id: 'about', name: 'About Me', desc: 'Personal Info', icon: <User size={24} />, category: 'Information', action: () => onLaunch('about'), favorite: true },
        { id: 'files', name: 'Dolphin', desc: 'File Manager', icon: <FolderOpen size={24} />, category: 'System', action: () => onLaunch('browser', { url: 'internal://projects' }), favorite: false },
        { id: 'settings', name: 'System Settings', desc: 'Configure Desktop', icon: <Settings size={24} />, category: 'System', action: () => onLaunch('about'), favorite: false },
        { id: 'code', name: 'VS Code', desc: 'Code Editor', icon: <Code size={24} />, category: 'Development', action: () => onLaunch('about'), favorite: false },
        { id: 'monitor', name: 'System Monitor', desc: 'Resource Usage', icon: <Monitor size={24} />, category: 'System', action: () => onLaunch('about'), favorite: false },
    ];

    const powerActions = [
        { id: 'lock', name: 'Lock', icon: <Lock size={16} /> },
        { id: 'sleep', name: 'Sleep', icon: <Moon size={16} /> },
        { id: 'restart', name: 'Restart', icon: <RefreshCw size={16} /> },
        { id: 'shutdown', name: 'Shut Down', icon: <Power size={16} /> },
    ];

    const filteredApps = search
        ? apps.filter(app =>
            app.name.toLowerCase().includes(search.toLowerCase()) ||
            app.desc.toLowerCase().includes(search.toLowerCase())
        )
        : activeTab === 'favorites'
            ? apps.filter(a => a.favorite)
            : apps;

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setSearch('');
            setActiveTab('favorites');
            setHoveredApp(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="kickoff-overlay" onClick={onClose}>
            <AnimatePresence>
                <motion.div
                    className="kickoff-container"
                    onClick={e => e.stopPropagation()}
                    initial={{ y: 30, opacity: 0, scale: 0.92 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 30, opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* ── User Header ── */}
                    <div className="kickoff-user-header">
                        <div className="kickoff-user-avatar">
                            <img src="https://github.com/OminduD.png" alt="avatar" />
                        </div>
                        <div className="kickoff-user-info">
                            <span className="kickoff-user-name">OminduD</span>
                            <span className="kickoff-user-role">Developer · KDE Plasma</span>
                        </div>
                        <div className="kickoff-header-actions">
                            <button className="kickoff-settings-btn" onClick={() => { onLaunch('about'); onClose(); }} title="Settings">
                                <Settings size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ── Search ── */}
                    <div className="kickoff-search-bar">
                        <svg className="kickoff-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="kickoff-search"
                            placeholder="Search applications..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && filteredApps.length > 0) {
                                    filteredApps[0].action();
                                    onClose();
                                }
                                if (e.key === 'Escape') onClose();
                            }}
                        />
                    </div>

                    <div className="kickoff-body">
                        {/* ── Sidebar ── */}
                        <div className="kickoff-sidebar">
                            <button
                                className={`kickoff-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('favorites'); setSearch(''); }}
                            >
                                <span className="kickoff-tab-icon">★</span>
                                <span>Favorites</span>
                            </button>
                            <button
                                className={`kickoff-tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('all'); setSearch(''); }}
                            >
                                <span className="kickoff-tab-icon">▤</span>
                                <span>All Apps</span>
                            </button>

                            <div className="kickoff-sidebar-spacer" />

                            {/* ── Power Row ── */}
                            <div className="kickoff-power-row">
                                {powerActions.map(action => (
                                    <button
                                        key={action.id}
                                        className="kickoff-power-btn"
                                        onClick={() => { onPower(action.id); onClose(); }}
                                        title={action.name}
                                    >
                                        {action.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── App Content ── */}
                        <div className="kickoff-content">
                            {!search && (
                                <div className="kickoff-section-title">
                                    {activeTab === 'favorites' ? '★ Favorites' : 'All Applications'}
                                </div>
                            )}
                            {search && (
                                <div className="kickoff-section-title">
                                    Results for "{search}"
                                </div>
                            )}

                            {/* Grid for favorites, list for all/search */}
                            {activeTab === 'favorites' && !search ? (
                                <div className="kickoff-grid">
                                    {filteredApps.map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            className="kickoff-grid-item"
                                            onClick={() => { app.action(); onClose(); }}
                                            onMouseEnter={() => setHoveredApp(app.id)}
                                            onMouseLeave={() => setHoveredApp(null)}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.04, duration: 0.15 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className={`kickoff-grid-icon ${hoveredApp === app.id ? 'hovered' : ''}`}>
                                                {app.icon}
                                            </div>
                                            <span className="kickoff-grid-name">{app.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="kickoff-list">
                                    {filteredApps.map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            className={`kickoff-item ${index === 0 && search ? 'selected' : ''}`}
                                            onClick={() => { app.action(); onClose(); }}
                                            onMouseEnter={() => setHoveredApp(app.id)}
                                            onMouseLeave={() => setHoveredApp(null)}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03, duration: 0.15 }}
                                        >
                                            <div className={`kickoff-item-icon ${hoveredApp === app.id ? 'hovered' : ''}`}>
                                                {app.icon}
                                            </div>
                                            <div className="kickoff-item-info">
                                                <span className="kickoff-item-name">{app.name}</span>
                                                <span className="kickoff-item-desc">{app.desc}</span>
                                            </div>
                                            <span className="kickoff-item-category">{app.category}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            {filteredApps.length === 0 && (
                                <div className="kickoff-empty">
                                    <span>No applications found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Launcher;
