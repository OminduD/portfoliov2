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
            <div className="power-menu-title">Goodbye Omindu!</div>

            <div className="power-options" onClick={e => e.stopPropagation()}>
                <button className="power-btn sleep" onClick={() => onAction('sleep')}>
                    <Moon />
                    <span>Sleep</span>
                </button>
                <button className="power-btn restart" onClick={() => onAction('restart')}>
                    <RefreshCw />
                    <span>Restart</span>
                </button>
                <button className="power-btn shutdown" onClick={() => onAction('shutdown')}>
                    <Power />
                    <span>Shutdown</span>
                </button>
            </div>

            <button className="sddm-btn" style={{ marginTop: 40 }} onClick={onClose}>
                <X size={24} />
            </button>
        </motion.div>
    );
};

export default PowerMenu;
