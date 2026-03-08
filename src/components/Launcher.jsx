import React, { useState, useEffect, useRef } from 'react';
import { User, Power, RefreshCw, Lock, Settings, FolderOpen, Moon, Code, Monitor, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Launcher.css';

const Launcher = ({ isOpen, onClose, onLaunch, onPower }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('favorites');
    const inputRef = useRef(null);

    const apps = [
        { id: 'terminal', name: 'Kitty', desc: 'Terminal Emulator', icon: <img className="launcher-app-icon" src="/kitty.svg" alt="Kitty" />, category: 'System', action: () => onLaunch('terminal'), favorite: true },
        { id: 'projects', name: 'Projects', desc: 'View Repositories', icon: <img className="launcher-app-icon" src="/project.png" alt="Projects" />, category: 'Development', action: () => onLaunch('projects'), favorite: true },
        { id: 'browser', name: 'Falkon', desc: 'Web Browser', icon: <img className="launcher-app-icon" src="/falcon.png" alt="Falkon" />, category: 'Internet', action: () => onLaunch('browser', { url: 'https://www.google.com/webhp?igu=1' }), favorite: true },
        { id: 'email', name: 'Thunderbird', desc: 'Contact Me', icon: <img className="launcher-app-icon" src="/thunderbird.png" alt="Thunderbird" />, category: 'Internet', action: () => onLaunch('email'), favorite: true },
        { id: 'about', name: 'About Me', desc: 'Personal Info', icon: <User size={18} />, category: 'Information', action: () => onLaunch('about'), favorite: true },
        // Social Media
        { id: 'github', name: 'GitHub', desc: 'OminduD', icon: <img className="launcher-app-icon" src="/github.png" alt="GitHub" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://github.com/OminduD' }), favorite: false },
        { id: 'linkedin', name: 'LinkedIn', desc: 'Connect with me', icon: <img className="launcher-app-icon" src="/linkdin.webp" alt="LinkedIn" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://linkedin.com' }), favorite: false },
        { id: 'x', name: 'X (Twitter)', desc: '@OminduD', icon: <img className="launcher-app-icon" src="/x.png" alt="X" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://x.com' }), favorite: false },
        { id: 'reddit', name: 'Reddit', desc: 'u/OminduD', icon: <img className="launcher-app-icon" src="/reddit.webp" alt="Reddit" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://reddit.com' }), favorite: false },
        { id: 'mastodon', name: 'Mastodon', desc: 'Fediverse', icon: <img className="launcher-app-icon" src="/mastodon.webp" alt="Mastodon" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://mastodon.social' }), favorite: false },
        { id: 'linktree', name: 'Linktree', desc: 'All My Links', icon: <img className="launcher-app-icon" src="/linktree.png" alt="Linktree" />, category: 'Social', action: () => onLaunch('browser', { url: 'https://linktr.ee' }), favorite: false },
        // System
        { id: 'files', name: 'Dolphin', desc: 'File Manager', icon: <FolderOpen size={18} />, category: 'System', action: () => onLaunch('browser', { url: 'internal://projects' }), favorite: false },
        { id: 'settings', name: 'System Settings', desc: 'Configure Desktop', icon: <Settings size={18} />, category: 'System', action: () => onLaunch('about'), favorite: false },
        { id: 'code', name: 'VS Code', desc: 'Code Editor', icon: <Code size={18} />, category: 'Development', action: () => onLaunch('about'), favorite: false },
        { id: 'monitor', name: 'System Monitor', desc: 'Resource Usage', icon: <Monitor size={18} />, category: 'System', action: () => onLaunch('about'), favorite: false },
    ];

    const powerActions = [
        { id: 'lock', name: 'Lock', icon: <Lock size={14} /> },
        { id: 'sleep', name: 'Sleep', icon: <Moon size={14} /> },
        { id: 'restart', name: 'Restart', icon: <RefreshCw size={14} /> },
        { id: 'shutdown', name: 'Shut Down', icon: <Power size={14} /> },
    ];

    const filteredApps = search
        ? apps.filter(app =>
            app.name.toLowerCase().includes(search.toLowerCase()) ||
            app.desc.toLowerCase().includes(search.toLowerCase())
        )
        : activeTab === 'favorites'
            ? apps.filter(a => a.favorite)
            : activeTab === 'all'
                ? apps
                : apps.filter(a => a.category === activeTab); // Filter by category tab

    const categories = ['favorites', 'all', ...new Set(apps.map(a => a.category))];

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setSearch('');
            setActiveTab('favorites');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="kickoff-overlay" onClick={onClose}>
            <AnimatePresence>
                <div className="kickoff-container" onClick={e => e.stopPropagation()}>
                    {/* ── User Header ── */}
                    <div className="kickoff-user-header">
                        <div className="kickoff-user-avatar">
                            <img src="/profile.jpg" alt="avatar" />
                        </div>
                        <div className="kickoff-user-info">
                            <span className="kickoff-user-name">OminduD</span>
                            <span className="kickoff-user-role">Developer · KDE Plasma</span>
                        </div>
                        <div className="kickoff-header-actions">
                            <button className="kickoff-settings-btn" onClick={() => { onLaunch('about'); onClose(); }} title="Settings">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>

                    {/* ── Search ── */}
                    <div className="kickoff-search-bar">
                        <Search className="kickoff-search-icon" size={16} />
                        <input
                            ref={inputRef}
                            type="text"
                            className="kickoff-search"
                            placeholder="Type to search..."
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

                    {/* ── Content ── */}
                    <div className="kickoff-content">
                        {/* Sidebar Tabs */}
                        <div className="kickoff-sidebar">
                            <button 
                                className={`kickoff-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                Favorites
                            </button>
                            <button 
                                className={`kickoff-tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Applications
                            </button>
                           
                            <div style={{height: 12}}></div>
                            <div style={{paddingLeft: 16, fontSize: 10, color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: 4}}>Categories</div>
                            
                            {categories.filter(c => c !== 'favorites' && c !== 'all').map(cat => (
                                <button
                                    key={cat}
                                    className={`kickoff-tab ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Apps Grid */}
                        <motion.div className="kickoff-apps-area">
                             {filteredApps.map((app, i) => (
                                <motion.div
                                    key={app.id}
                                    className="kickoff-app-item"
                                    onClick={() => { app.action(); onClose(); }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <div className="kickoff-app-icon">
                                        {app.icon}
                                    </div>
                                    <div className="kickoff-app-details">
                                        <span className="kickoff-app-name">{app.name}</span>
                                        <span className="kickoff-app-desc">{app.desc}</span>
                                    </div>
                                </motion.div>
                             ))}
                        </motion.div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="kickoff-footer">
                         {powerActions.map(action => (
                            <button
                                key={action.id}
                                className="kickoff-power-btn"
                                onClick={() => { onPower(action.id); onClose(); }}
                                title={action.name}
                            >
                                {action.icon}
                                <span>{action.name}</span>
                            </button>
                        ))}
                    </div>

                </div>
            </AnimatePresence>
        </div>
    );
};

export default Launcher;
