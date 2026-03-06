import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink, Star, Shield, Home, Plus, X, Search, Bookmark } from 'lucide-react';
import Projects from './Projects';
import './Browser.css';

const BOOKMARKS = [
    { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
    { name: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '📖' },
    { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
];

const Browser = ({ initialUrl = 'https://www.google.com/webhp?igu=1' }) => {
    const [tabs, setTabs] = useState([{ id: 1, url: initialUrl, title: 'New Tab' }]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [inputUrl, setInputUrl] = useState(initialUrl);
    const [iframeKey, setIframeKey] = useState(0);
    const [showBookmarks, setShowBookmarks] = useState(true);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const updateTab = (id, updates) => {
        setTabs(tabs.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const getTabTitle = (tab) => {
        if (tab.url.includes('projects') || tab.url.includes('internal://')) return 'GitHub Projects';
        if (tab.url.includes('google')) return 'Google';
        if (tab.url.includes('github')) return 'GitHub';
        try { return new URL(tab.url).hostname; } catch { return 'New Tab'; }
    };

    const handleNavigate = (e) => {
        e.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http') && !target.startsWith('internal://')) {
            target = 'https://' + target;
        }
        updateTab(activeTabId, { url: target });
        setIframeKey(prev => prev + 1);
    };

    const addTab = (url = 'https://www.google.com/webhp?igu=1') => {
        const newId = Math.max(...tabs.map(t => t.id)) + 1;
        setTabs([...tabs, { id: newId, url, title: 'New Tab' }]);
        setActiveTabId(newId);
        setInputUrl(url);
    };

    const closeTab = (e, id) => {
        e.stopPropagation();
        if (tabs.length === 1) return;
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
            setInputUrl(newTabs[newTabs.length - 1].url);
        }
    };

    const renderContent = () => {
        if (activeTab.url === 'internal://projects') {
            return <Projects onOpenUrl={(url) => addTab(url)} />;
        }
        return (
            <>
                <iframe
                    key={`${activeTabId}-${iframeKey}`}
                    src={activeTab.url}
                    className="browser-iframe"
                    title="Browser"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
                <div className="browser-embed-notice">
                    <Shield size={12} />
                    <span>Some sites may block embedding. Click</span>
                    <ExternalLink size={11} />
                    <span>to open externally.</span>
                </div>
            </>
        );
    };

    return (
        <div className="browser-container">
            {/* ── Tab Strip ── */}
            <div className="browser-tabstrip">
                <div className="browser-tabs-scroll">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`browser-tab ${tab.id === activeTabId ? 'active' : ''}`}
                            onClick={() => { setActiveTabId(tab.id); setInputUrl(tab.url); }}
                        >
                            <span className="browser-tab-favicon">🌐</span>
                            <span className="browser-tab-title">{getTabTitle(tab)}</span>
                            <span className="browser-tab-close" onClick={(e) => closeTab(e, tab.id)}>
                                <X size={12} />
                            </span>
                        </div>
                    ))}
                    <button className="browser-newtab-btn" onClick={() => addTab()} title="New Tab">
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* ── Navigation Bar ── */}
            <div className="browser-navbar">
                <div className="browser-nav-buttons">
                    <button className="browser-nav-btn" title="Back"><ArrowLeft size={16} /></button>
                    <button className="browser-nav-btn" title="Forward"><ArrowRight size={16} /></button>
                    <button className="browser-nav-btn" onClick={() => setIframeKey(prev => prev + 1)} title="Reload"><RotateCw size={14} /></button>
                    <button className="browser-nav-btn" onClick={() => { setInputUrl('https://www.google.com/webhp?igu=1'); updateTab(activeTabId, { url: 'https://www.google.com/webhp?igu=1' }); setIframeKey(prev => prev + 1); }} title="Home"><Home size={16} /></button>
                </div>

                <form onSubmit={handleNavigate} className="browser-url-form">
                    <div className="browser-url-box">
                        <Shield size={13} className="browser-url-shield" />
                        <input
                            className="browser-url-input"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            spellCheck={false}
                        />
                        <button type="button" className="browser-url-action" title="Bookmark">
                            <Star size={14} />
                        </button>
                    </div>
                </form>

                <div className="browser-nav-buttons browser-nav-right">
                    <button className="browser-nav-btn" onClick={() => setShowBookmarks(prev => !prev)} title="Bookmarks">
                        <Bookmark size={15} />
                    </button>
                    <button className="browser-nav-btn" onClick={() => window.open(activeTab.url, '_blank')} title="Open externally">
                        <ExternalLink size={15} />
                    </button>
                </div>
            </div>

            {/* ── Bookmarks Bar ── */}
            {showBookmarks && (
                <div className="browser-bookmarks">
                    {BOOKMARKS.map(bm => (
                        <button
                            key={bm.name}
                            className="browser-bm-item"
                            onClick={() => { setInputUrl(bm.url); updateTab(activeTabId, { url: bm.url }); setIframeKey(prev => prev + 1); }}
                        >
                            <span className="browser-bm-icon">{bm.icon}</span>
                            <span>{bm.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Content ── */}
            <div className="browser-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Browser;
