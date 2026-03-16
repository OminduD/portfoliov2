import React from 'react';
import { useTheme } from '../ThemeContext';
import { Monitor, Moon, Sun } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="settings-app">
            <div className="settings-sidebar">
                <div className="settings-nav-item active">
                    <Monitor size={16} />
                    <span>Appearance</span>
                </div>
            </div>
            <div className="settings-content">
                <h2>Appearance Settings</h2>

                <div className="settings-section">
                    <h3>Theme</h3>
                    <p>Select the application theme for your desktop environment.</p>

                    <div className="theme-options">
                        <div
                            className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <div className="theme-preview dark-preview">
                                <div className="preview-window">
                                    <div className="preview-header"></div>
                                    <div className="preview-body"></div>
                                </div>
                            </div>
                            <div className="theme-label">
                                <Moon size={16} />
                                <span>Dark Mode</span>
                            </div>
                        </div>

                        <div
                            className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <div className="theme-preview light-preview">
                                <div className="preview-window">
                                    <div className="preview-header"></div>
                                    <div className="preview-body"></div>
                                </div>
                            </div>
                            <div className="theme-label">
                                <Sun size={16} />
                                <span>Light Mode</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
