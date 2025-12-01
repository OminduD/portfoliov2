import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick, Wifi, Volume2, Power } from 'lucide-react';
import { format } from 'date-fns';
import './Waybar.css';

const Waybar = ({ onOpenLauncher, onPower }) => {
    const [time, setTime] = useState(new Date());
    const [cpu, setCpu] = useState(12);
    const [ram, setRam] = useState(2.4);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setCpu(Math.floor(Math.random() * (30 - 5 + 1) + 5)); // Random CPU 5-30%
            setRam((Math.random() * (4 - 2) + 2).toFixed(1)); // Random RAM 2-4GB
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="waybar">
            <div className="waybar-left">
                <div className="workspace" onClick={onOpenLauncher} title="Open Launcher">
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>A</span>
                </div>
                <div className="workspace active">1</div>
                <div className="workspace">2</div>
                <div className="workspace">3</div>
                <div className="workspace">4</div>
                <div className="workspace">5</div>
            </div>

            <div className="waybar-center">
                <div className="module clock">
                    {format(time, 'MMM d HH:mm')}
                </div>
            </div>

            <div className="waybar-right">
                <div className="module cpu">
                    <Cpu size={14} />
                    <span>{cpu}%</span>
                </div>
                <div className="module ram">
                    <MemoryStick size={14} />
                    <span>{ram}G</span>
                </div>
                <div className="module">
                    <Wifi size={14} />
                </div>
                <div className="module">
                    <Volume2 size={14} />
                </div>
                <div className="module power" onClick={onPower} title="Shutdown">
                    <Power size={14} />
                </div>
            </div>
        </div>
    );
};

export default Waybar;
