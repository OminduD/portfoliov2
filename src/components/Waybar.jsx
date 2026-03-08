import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MemoryStick, Wifi, Volume2, Power, ChevronUp, ChevronDown, X, Layout, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import './Waybar.css';

const Waybar = ({ onOpenLauncher, onPower, windows = [], onWindowClick, onOpenApp, onShowDesktop }) => {

    const [time, setTime] = useState(new Date());
    const [cpu, setCpu] = useState(12);
    const [ram, setRam] = useState(2.4);
    const [activePopup, setActivePopup] = useState(null);
    const [volume, setVolume] = useState(75);
    const popupRef = useRef(null);

    // Map appId to icons
    const getAppIcon = (appId) => {
        const icons = {
            terminal: '/kitty.svg',
            projects: '/project.png',
            browser: '/falcon.png',
            email: '/thunderbird.png',
            about: '/kde.png',
            files: '/folder.png', // Fallback or add
            settings: '/settings.png'
        };
        // Simple fallback logic if needed
        return icons[appId] || '/kde.png';
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setCpu(Math.floor(Math.random() * (30 - 5 + 1) + 5));
            setRam((Math.random() * (4 - 2) + 2).toFixed(1));
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setActivePopup(null);
            }
        };
        if (activePopup) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [activePopup]);

    const togglePopup = (popupName) => {
        setActivePopup(prev => prev === popupName ? null : popupName);
    };

    // Calendar Component
    const renderCalendar = () => {
        const now = time;
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const days = eachDayOfInterval({ start, end });
        const startDay = getDay(start);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className="popup-calendar" onClick={e => e.stopPropagation()}>
                <div className="calendar-header">
                    <span className="calendar-month">{format(now, 'MMMM yyyy')}</span>
                </div>
                <div className="calendar-grid">
                    {weekDays.map(d => <div key={d} className="calendar-weekday">{d}</div>)}
                    {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}
                    {days.map(day => (
                        <div
                            key={day.toISOString()}
                            className={`calendar-day ${isToday(day) ? 'today' : ''}`}
                        >
                            {format(day, 'd')}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // System Monitor Component
    const renderSysMonitor = () => (
        <div className="popup-sysmonitor" onClick={e => e.stopPropagation()}>
            <div className="sysmon-title">System Monitor</div>
            <div className="sysmon-item">
                <div className="sysmon-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Cpu size={14} />
                        <span>CPU Load</span>
                    </div>
                    <span className="sysmon-value">{cpu}%</span>
                </div>
                <div className="sysmon-bar"><div className="sysmon-bar-fill cpu-bar" style={{ width: `${cpu}%` }} /></div>
            </div>
            <div className="sysmon-item">
                <div className="sysmon-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MemoryStick size={14} />
                        <span>Memory</span>
                    </div>
                    <span className="sysmon-value">{ram}G / 16G</span>
                </div>
                <div className="sysmon-bar"><div className="sysmon-bar-fill ram-bar" style={{ width: `${(ram / 16) * 100}%` }} /></div>
            </div>
        </div>
    );

    // Audio Popup
    const renderAudioPopup = () => (
        <div className="popup-audio" onClick={e => e.stopPropagation()}>
            <div className="audio-header">
                <span>Volume</span>
                <span>{volume}%</span>
            </div>
            <div className="audio-slider-container">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(e.target.value)}
                    className="audio-slider"
                />
            </div>
        </div>
    );

    return (
        <div className="plasma-panel">
            {/* Left Section: Launcher, Quick Launch, Tasks */}
            <div className="panel-left">
                <button className="kickoff-btn" onClick={onOpenLauncher} title="Application Launcher">
                   <img className="kickoff-icon-img" src="/logo.png" alt="Menu" />
                </button>

                <div className="panel-sep" />

                <div className="quick-launch">
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('terminal')} title="Terminal">
                        <img src="/kitty.svg" alt="Kitty" />
                    </button>
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('browser')} title="Browser">
                        <img src="/falcon.png" alt="Browser" />
                    </button>
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('files')} title="Files">
                         <img src="/folder.png" alt="Files" style={{ filter: 'invert(1)' }} />
                         {/* Note: folder.png might need style adjustment if it's black */}
                    </button>
                </div>

                <div className="panel-sep" />

                <div className="task-manager">
                    {windows.filter(w => w.isOpen).map(win => (
                         <div 
                            key={win.id}
                            className={`task-item ${!win.isMinimized && win.isOpen ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
                            onClick={() => onWindowClick && onWindowClick(win.id)}
                            title={win.title}
                         >
                            {getAppIcon(win.appId) ? (
                                <img src={getAppIcon(win.appId)} alt="icon" className="task-icon" />
                            ) : (
                                <div className="task-icon-fallback">{win.title.charAt(0)}</div>
                            )}
                            <span className="task-title">{win.title}</span>
                         </div>
                    ))}
                </div>
            </div>

            {/* Right Section: Tray, Clock, Power, Desktop */}
            <div className="panel-right" ref={popupRef}>
                <div className="tray-box">
                    <button 
                        className={`tray-item ${activePopup === 'sysmonitor' ? 'active' : ''}`} 
                        onClick={() => togglePopup('sysmonitor')}
                        title="System Monitor"
                    >
                        <Cpu size={15} />
                    </button>
                    <button 
                         className="tray-item"
                         onClick={() => togglePopup('network')}
                         title="Network: Connected"
                    >
                        <Wifi size={15} />
                    </button>
                    <button 
                        className={`tray-item ${activePopup === 'audio' ? 'active' : ''}`} 
                        onClick={() => togglePopup('audio')}
                        title="Volume"
                    >
                        <Volume2 size={15} />
                    </button>
                </div>

                <div className="panel-sep" />

                <div 
                    className="clock-widget" 
                    onClick={() => togglePopup('calendar')}
                >
                    <div className="clock-time">{format(time, 'HH:mm')}</div>
                    <div className="clock-date">{format(time, 'EEE, MMM d')}</div>
                </div>

                <div className="panel-sep" />

                <button className="show-desktop-btn" onClick={onPower} title="Power Menu">
                    <Power size={18} />
                </button>
                
                <button className="show-desktop-btn" onClick={onShowDesktop} title="Show Desktop">
                    <Layout size={18} />
                </button>

                {/* Popups */}
                <AnimatePresence>
                    {activePopup === 'calendar' && (
                        <motion.div
                            className="panel-popup"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {renderCalendar()}
                        </motion.div>
                    )}
                    {activePopup === 'sysmonitor' && (
                        <motion.div
                            className="panel-popup"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {renderSysMonitor()}
                        </motion.div>
                    )}
                    {activePopup === 'audio' && (
                        <motion.div
                            className="panel-popup"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {renderAudioPopup()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Waybar;
