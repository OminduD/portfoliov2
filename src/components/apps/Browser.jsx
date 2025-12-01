import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink } from 'lucide-react';
import Projects from './Projects'; // Import Projects
import './Browser.css';

const Browser = ({ initialUrl = 'https://www.google.com/webhp?igu=1' }) => {
    const [tabs, setTabs] = useState([{ id: 1, url: initialUrl, title: 'New Tab' }]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [inputUrl, setInputUrl] = useState(initialUrl);
    const [iframeKey, setIframeKey] = useState(0);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const updateTab = (id, updates) => {
        setTabs(tabs.map(t => t.id === id ? { ...t, ...updates } : t));
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
        if (tabs.length === 1) return; // Don't close last tab
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
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '5px', fontSize: '10px', textAlign: 'center', pointerEvents: 'none' }}>
                    Note: Many sites block embedding. Use the icon top-right to open in a new tab.
                </div>
            </>
        );
    };

    return (
        <div className="browser-container">
            <div className="browser-header">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`browser-tab ${tab.id === activeTabId ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTabId(tab.id);
                            setInputUrl(tab.url);
                        }}
                    >
                        <span>{tab.url.includes('projects') ? 'GitHub Projects' : 'New Tab'}</span>
                        <span
                            style={{ marginLeft: 'auto', cursor: 'pointer' }}
                            onClick={(e) => closeTab(e, tab.id)}
                        >×</span>
                    </div>
                ))}
                <div className="browser-nav-btn" onClick={() => addTab()} title="New Tab">+</div>
            </div>
            <div className="browser-bar">
                <button className="browser-nav-btn"><ArrowLeft size={16} /></button>
                <button className="browser-nav-btn"><ArrowRight size={16} /></button>
                <button className="browser-nav-btn" onClick={() => setIframeKey(prev => prev + 1)}><RotateCw size={16} /></button>
                <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex' }}>
                    <input
                        className="browser-input"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        onFocus={(e) => e.target.select()}
                    />
                </form>
                <button className="browser-nav-btn" onClick={() => window.open(activeTab.url, '_blank')} title="Open in new tab"><ExternalLink size={16} /></button>
            </div>
            <div className="browser-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Browser;
