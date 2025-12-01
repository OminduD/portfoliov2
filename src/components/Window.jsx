import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import './Window.css';

const Window = ({ window, onClose, onMinimize, onMaximize }) => {
    const { id, title, component, x, y, width, height, zIndex } = window;

    return (
        <motion.div
            className="window"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
                left: x || '50%',
                top: y || '50%',
                width: width || 800,
                height: height || 600,
                x: x ? 0 : '-50%', // Center if no x provided
                y: y ? 0 : '-50%', // Center if no y provided
                zIndex: zIndex,
            }}
            drag
            dragMomentum={false}
        >
            <div className="window-header">
                <div className="window-title">
                    <span>{title}</span>
                </div>
                <div className="window-controls">
                    <button className="control-btn minimize" onClick={() => onMinimize(id)} />
                    <button className="control-btn maximize" onClick={() => onMaximize(id)} />
                    <button className="control-btn close" onClick={() => onClose(id)} />
                </div>
            </div>
            <div className="window-content">
                {component}
            </div>
        </motion.div>
    );
};

export default Window;
