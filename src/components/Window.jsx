import React from 'react';
import { motion } from 'framer-motion';
import './Window.css';

const Window = ({ window, onClose, onMinimize, onMaximize }) => {
    const { id, title, component, x, y, width, height, zIndex, isMaximized } = window;

    return (
        <motion.div
            className={`window ${isMaximized ? 'window-maximized' : ''}`}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
                left: isMaximized ? 0 : (x || '50%'),
                top: isMaximized ? 0 : (y || '50%'),
                width: isMaximized ? '100%' : (width || 800),
                height: isMaximized ? '100%' : (height || 600),
                x: isMaximized ? 0 : (x != null ? 0 : '-50%'),
                y: isMaximized ? 0 : (y != null ? 0 : '-50%'),
                zIndex: zIndex,
            }}
            drag={!isMaximized}
            dragMomentum={false}
        >
            <div className="window-header" onDoubleClick={() => onMaximize(id)}>
                {/* KDE Breeze: title on the left */}
                <div className="window-title">
                    <span>{title}</span>
                </div>
                {/* KDE Breeze: controls on the right — minimize, maximize, close */}
                <div className="window-controls">
                    <button
                        className="control-btn btn-minimize"
                        onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
                        title="Minimize"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10">
                            <rect x="1" y="7" width="8" height="1.5" fill="currentColor" rx="0.5" />
                        </svg>
                    </button>
                    <button
                        className="control-btn btn-maximize"
                        onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
                        title={isMaximized ? "Restore" : "Maximize"}
                    >
                        {isMaximized ? (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <rect x="0" y="2" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.3" rx="0.5" />
                                <rect x="3" y="0" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.3" rx="0.5" />
                            </svg>
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" rx="0.5" />
                            </svg>
                        )}
                    </button>
                    <button
                        className="control-btn btn-close"
                        onClick={(e) => { e.stopPropagation(); onClose(id); }}
                        title="Close"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10">
                            <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="window-content">
                {component}
            </div>
        </motion.div>
    );
};

export default Window;
