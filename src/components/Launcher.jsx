import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Github, User, Power, RefreshCw, Lock } from 'lucide-react';
import './Launcher.css';

const Launcher = ({ isOpen, onClose, onLaunch, onPower }) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);

    const apps = [
        { id: 'terminal', name: 'Terminal', icon: <Terminal size={20} />, action: () => onLaunch('terminal') },
        { id: 'projects', name: 'GitHub Projects', icon: <Github size={20} />, action: () => onLaunch('projects') },
        { id: 'about', name: 'About Me', icon: <User size={20} />, action: () => onLaunch('about') },
        { id: 'lock', name: 'Lock Screen', icon: <Lock size={20} />, action: () => onPower('lock') },
        { id: 'restart', name: 'Restart', icon: <RefreshCw size={20} />, action: () => onPower('restart') },
        { id: 'shutdown', name: 'Shutdown', icon: <Power size={20} />, action: () => onPower('shutdown') },
    ];

    const filteredApps = apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearch('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="launcher-overlay" onClick={onClose}>
            <div className="launcher-container" onClick={e => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    type="text"
                    className="launcher-search"
                    placeholder="Search..."
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
                <div className="launcher-list">
                    {filteredApps.map((app, index) => (
                        <div
                            key={app.id}
                            className={`launcher-item ${index === 0 ? 'selected' : ''}`}
                            onClick={() => {
                                app.action();
                                onClose();
                            }}
                        >
                            <span className="launcher-item-icon">{app.icon}</span>
                            <span>{app.name}</span>
                        </div>
                    ))}
                    {filteredApps.length === 0 && (
                        <div className="launcher-item">No results found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Launcher;
