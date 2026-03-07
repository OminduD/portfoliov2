import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MemoryStick, Wifi, Volume2, Power, ChevronUp, ChevronDown, X, Layout } from 'lucide-react';
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

    // Calendar helpers
    const renderCalendar = () => {
        const now = time;
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const days = eachDayOfInterval({ start, end });
        const startDay = getDay(start);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className="popup-calendar">
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

    // System monitor popup
    const renderSysMonitor = () => (
        <div className="popup-sysmonitor">
            <div className="sysmon-title">System Monitor</div>
            <div className="sysmon-item">
                <div className="sysmon-row">
                    <Cpu size={14} />
                    <span>CPU</span>
                    <span className="sysmon-value">{cpu}%</span>
                </div>
                <div className="sysmon-bar"><div className="sysmon-bar-fill cpu-bar" style={{ width: `${cpu}%` }} /></div>
            </div>
            <div className="sysmon-item">
                <div className="sysmon-row">
                    <MemoryStick size={14} />
                    <span>Memory</span>
                    <span className="sysmon-value">{ram}G / 16G</span>
                </div>
                <div className="sysmon-bar"><div className="sysmon-bar-fill ram-bar" style={{ width: `${(ram / 16) * 100}%` }} /></div>
            </div>
            <div className="sysmon-item">
                <div className="sysmon-row">
                    <span>Swap</span>
                    <span className="sysmon-value">0.0G / 4G</span>
                </div>
                <div className="sysmon-bar"><div className="sysmon-bar-fill swap-bar" style={{ width: '2%' }} /></div>
            </div>
        </div>
    );

    // Volume popup
    const renderVolumePopup = () => (
        <div className="popup-volume">
            <div className="volume-title">Audio Volume</div>
            <div className="volume-control">
                <Volume2 size={16} />
                <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                />
                <span className="volume-value">{volume}%</span>
            </div>
            <div className="volume-output">
                <span className="volume-device">Built-in Audio Analog Stereo</span>
            </div>
        </div>
    );

    // WiFi popup
    const renderWifiPopup = () => (
        <div className="popup-wifi">
            <div className="wifi-title">Network</div>
            <div className="wifi-item connected">
                <Wifi size={14} />
                <div className="wifi-info">
                    <span className="wifi-name">HomeNetwork-5G</span>
                    <span className="wifi-status">Connected — 867 Mbps</span>
                </div>
            </div>
            <div className="wifi-item">
                <Wifi size={14} />
                <div className="wifi-info">
                    <span className="wifi-name">Neighbor_WiFi</span>
                    <span className="wifi-status">Secured</span>
                </div>
            </div>
            <div className="wifi-item">
                <Wifi size={14} />
                <div className="wifi-info">
                    <span className="wifi-name">CafeNetwork</span>
                    <span className="wifi-status">Open</span>
                </div>
            </div>
        </div>
    );

    const popupVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.95 }
    };

    return (
        <div className="plasma-panel">
            {/* KDE Kickoff Launcher Button */}
            <div className="panel-left">
                <button className="kickoff-btn" onClick={onOpenLauncher} title="Application Launcher">
                    <img className="kickoff-icon-img" src="/kde.png" alt="KDE" />
                </button>

                {/* Quick Launch Buttons */}
                <div className="panel-divider" />
                <div className="quick-launch">
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('terminal')} title="Kitty Terminal">
                        <img src="/kitty.svg" alt="Kitty" />
                    </button>
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('browser', { url: 'https://google.com' })} title="Falkon Browser">
                        <img src="/falcon.png" alt="Falkon" />
                    </button>
                    <button className="quick-launch-btn" onClick={() => onOpenApp && onOpenApp('email')} title="Thunderbird">
                        <img src="/thunderbird.png" alt="Thunderbird" />
                    </button>
                </div>
                <div className="panel-divider" />

                {/* Task Manager */}
                <div className="task-manager">
                    {windows.filter(w => w.isOpen).map(win => (
                        <button
                            key={win.id}
                            className={`task-btn ${!win.isMinimized ? 'active' : ''}`}
                            onClick={() => onWindowClick && onWindowClick(win.id)}
                            title={win.title}
                        >
                            <span className="task-btn-text">{win.title.split('—')[0].trim()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* System Tray + Clock */}
            <div className="panel-right" ref={popupRef}>
                {/* System Monitor */}
                <button className="systray-item systray-clickable" onClick={() => togglePopup('sysmon')} title="System Monitor">
                    <Cpu size={14} />
                    <span>{cpu}%</span>
                </button>
                <button className="systray-item systray-clickable" onClick={() => togglePopup('sysmon')} title="Memory">
                    <MemoryStick size={14} />
                    <span>{ram}G</span>
                </button>

                {/* WiFi */}
                <button className="systray-item systray-clickable" onClick={() => togglePopup('wifi')} title="Network">
                    <Wifi size={14} />
                </button>

                {/* Volume */}
                <button className="systray-item systray-clickable" onClick={() => togglePopup('volume')} title="Audio Volume">
                    <Volume2 size={14} />
                </button>

                <button className="systray-item systray-expand" onClick={() => togglePopup('sysmon')} title="Show system info">
                    <ChevronUp size={12} />
                </button>

                <div className="panel-divider" />

                {/* Clock */}
                <button className="panel-clock" onClick={() => togglePopup('calendar')} title="Calendar">
                    <div className="clock-time">{format(time, 'HH:mm')}</div>
                    <div className="clock-date">{format(time, 'EEE, MMM d')}</div>
                </button>

                <div className="panel-divider" />

                <button className="panel-power-btn" onClick={onPower} title="Leave">
                    <Power size={14} />
                </button>

                {/* Show Desktop */}
                <div className="panel-divider" />
                <button className="show-desktop-btn" onClick={onShowDesktop} title="Show Desktop">
                    <Layout size={14} />
                </button>

                {/* Popups */}
                <AnimatePresence>
                    {activePopup && (
                        <motion.div
                            className={`panel-popup popup-${activePopup}`}
                            variants={popupVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            {activePopup === 'calendar' && renderCalendar()}
                            {activePopup === 'sysmon' && renderSysMonitor()}
                            {activePopup === 'volume' && renderVolumePopup()}
                            {activePopup === 'wifi' && renderWifiPopup()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Waybar;
