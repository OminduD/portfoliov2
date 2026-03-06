import React from 'react';
import { Power, RefreshCw, Moon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './PowerMenu.css';

const PowerMenu = ({ isOpen, onClose, onAction }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            className="power-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="power-dialog"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.15 }}
            >
                <div className="power-dialog-header">
                    <span className="power-dialog-title">End Session</span>
                    <button className="power-dialog-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className="power-dialog-body">
                    <p className="power-dialog-message">What would you like to do?</p>
                    <div className="power-actions">
                        <button className="power-action-btn" onClick={() => onAction('sleep')}>
                            <div className="power-action-icon"><Moon size={28} /></div>
                            <span>Sleep</span>
                        </button>
                        <button className="power-action-btn" onClick={() => onAction('restart')}>
                            <div className="power-action-icon"><RefreshCw size={28} /></div>
                            <span>Restart</span>
                        </button>
                        <button className="power-action-btn power-action-shutdown" onClick={() => onAction('shutdown')}>
                            <div className="power-action-icon"><Power size={28} /></div>
                            <span>Shut Down</span>
                        </button>
                    </div>
                </div>

                <div className="power-dialog-footer">
                    <button className="power-cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PowerMenu;
