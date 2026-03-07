import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Terminal.css';

// Page load time for uptime calculation
const PAGE_LOAD_TIME = Date.now();
// "Install date" for OS Age (Oct 25, 2025)
const INSTALL_DATE = new Date('2025-10-25');

// Gentoo ASCII art
const GENTOO_LOGO = [
    '         -/oyddmdhs+:.',
    '     -odNMMMMMMMMNNmhy+-`',
    '   -yNMMMMMMMMMMMNNNmmdhy+-',
    ' `omMMMMMMMMMMMMNmdmmmmddhhy/`',
    ' omMMMMMMMMMMMNhhyyyohmdddhhhdo`',
    '.ydMMMMMMMMMMdhs++so/smdddhhhhdm+`',
    ' oyhdmNMMMMMMMNdyooydmddddhhhhyhNd.',
    '  :oyhhdNNMMMMMMMNNNmmdddhhhhhyymMh',
    '    .:+sydNMMMMMNNNmmmdddhhhhhhmMmy',
    '       /mMMMMMMNNNmmmdddhhhhhmMNhs:',
    '    `oNMMMMMMMNNNmmmddddhhdmMNhs+`',
    '  `sNMMMMMMMMNNNmmmdddddmNMmhs/.',
    ' /NMMMMMMMMNNNNmmmdddmNMNdso:`',
    '+MMMMMMMNNNNNmmmmdmNMNdso/-',
    'yMMNNNNNNNmmmmmNNMmhs+/-`',
    '/hMMNNNNNNNNMNdhs++/-`',
    '`/ohdmmddhys+++/:.`',
    '  `-//////:--.',
];

// System info section 1 — OS details
const FASTFETCH_SECTION_1 = [
    { type: 'header' },
    { type: 'box-top' },
    { label: 'Chassis', value: 'Notebook — MSI' },
    { label: 'OS', value: 'Gentoo Linux x86_64' },
    { label: 'Kernel', value: '6.12.74-1-lts' },
    { label: 'Packages', value: '2242 (emerge), 10 (flatpak)' },
    { label: 'Display', value: '1920x1080 @ 60Hz [Built-in]' },
    { label: 'Shell', value: 'zsh 5.9 (oh-my-zsh)' },
    { label: 'Terminal', value: 'konsole 25.12.2' },
    { label: 'DE/WM', value: 'KDE Plasma / KWin (Wayland)' },
    { type: 'box-bottom' },
];

// Helper: format uptime
const formatUptime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}, ${mins} min${mins !== 1 ? 's' : ''}`;
    return `${mins} min${mins !== 1 ? 's' : ''}`;
};

// Helper: calculate OS age in days
const getOsAge = () => {
    const diff = Date.now() - INSTALL_DATE.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// System info section 2 — Hardware (dynamic)
const getFastfetchSection2 = (uptimeMs) => {
    const memUsed = (5.8 + Math.random() * 1.5).toFixed(2);
    const memPct = Math.round((parseFloat(memUsed) / 22.87) * 100);
    return [
        { type: 'user-header' },
        { type: 'box-top' },
        { label: 'CPU', value: 'AMD Ryzen 5 4600H @ 3.00 GHz' },
        { label: 'GPU', value: 'AMD Radeon RX 5300M' },
        { label: 'GPU', value: 'AMD Radeon Vega Series' },
        { label: 'GPU Driver', value: 'amdgpu' },
        { label: 'Memory', value: `${memUsed} GiB / 22.87 GiB (${memPct}%)` },
        { label: 'Swap', value: '0.0 GiB / 4.0 GiB' },
        { label: 'OS Age', value: `${getOsAge()} days` },
        { label: 'Uptime', value: formatUptime(uptimeMs) },
        { type: 'box-bottom' },
        { type: 'color-dots' },
    ];
};

const BOX_WIDTH = 50;

const Terminal = () => {
    const [uptime, setUptime] = useState(Date.now() - PAGE_LOAD_TIME);
    const [history, setHistory] = useState([
        { type: 'fastfetch' },
        { type: 'output', content: 'Welcome to my portfolio! Type \x1bCMDhelp\x1bEND to see available commands.' }
    ]);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [activeKonsoleTab, setActiveKonsoleTab] = useState(0);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Update uptime every 30s
    useEffect(() => {
        const timer = setInterval(() => setUptime(Date.now() - PAGE_LOAD_TIME), 30000);
        return () => clearInterval(timer);
    }, []);

    const renderFastfetch = () => {
        const section2 = getFastfetchSection2(uptime);
        const allInfoLines = [...FASTFETCH_SECTION_1, { type: 'spacer' }, ...section2];
        const maxLines = Math.max(GENTOO_LOGO.length, allInfoLines.length);
        const rows = [];

        for (let i = 0; i < maxLines; i++) {
            const artLine = GENTOO_LOGO[i] || '';
            const info = allInfoLines[i];
            rows.push(
                <div key={i} className="ff-line">
                    <span className="ff-art">{artLine.padEnd(40)}</span>
                    <span className="ff-info">{info ? renderFfInfo(info) : null}</span>
                </div>
            );
        }
        return <div className="ff-block">{rows}</div>;
    };

    const renderFfInfo = (info) => {
        if (info.type === 'header') {
            return <span className="ff-empty-line"> </span>;
        }
        if (info.type === 'user-header') {
            return (
                <span className="ff-user-line">
                    <span className="ff-icon">&#xf007;</span>
                    <span className="ff-colon"> : </span>
                    <span className="ff-username">omindu</span>
                    <span className="ff-at"> @ </span>
                    <span className="ff-hostname">gentoo</span>
                </span>
            );
        }
        if (info.type === 'box-top') {
            return <span className="ff-box-border">{'┌' + '─'.repeat(BOX_WIDTH) + '┐'}</span>;
        }
        if (info.type === 'box-bottom') {
            return <span className="ff-box-border">{'└' + '─'.repeat(BOX_WIDTH) + '┘'}</span>;
        }
        if (info.type === 'spacer') {
            return <span className="ff-spacer"> </span>;
        }
        if (info.type === 'color-dots') {
            return (
                <span className="ff-color-dots">
                    {'  '}
                    {['#e06c75', '#e5c07b', '#98c379', '#56b6c2', '#61afef', '#c678dd', '#be5046', '#abb2bf'].map((c, i) => (
                        <span key={i} className="ff-dot" style={{ color: c }}>● </span>
                    ))}
                </span>
            );
        }
        if (info.label) {
            return (
                <span className="ff-info-row">
                    <span className="ff-box-side">  </span>
                    <span className="ff-label">{info.label}</span>
                    <span className="ff-colon"> : </span>
                    <span className="ff-value">{info.value}</span>
                </span>
            );
        }
        return null;
    };

    const renderPrompt = () => (
        <span className="omz-prompt">
            <span className="omz-segment omz-seg-user"><span className="omz-seg-text"> omindu@gentoo </span></span>
            <span className="omz-seg-arrow seg-user-to-dir"></span>
            <span className="omz-segment omz-seg-dir"><span className="omz-seg-text"> ~ </span></span>
            <span className="omz-seg-arrow seg-dir-to-git"></span>
            <span className="omz-segment omz-seg-git"><span className="omz-seg-text">  main ✔ </span></span>
            <span className="omz-seg-arrow seg-git-to-end"></span>
            <span className="omz-final-arrow"> ❯ </span>
        </span>
    );

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let output = '';
        if (cmd.trim()) { setCmdHistory(prev => [cmd.trim(), ...prev]); setHistIdx(-1); }

        switch (trimmedCmd) {
            case 'help':
                output = `\x1bTITLE  Available commands:\x1bEND
  \x1bCMDhelp\x1bEND          Show this help message
  \x1bCMDabout\x1bEND         Learn more about me
  \x1bCMDprojects\x1bEND      View my projects
  \x1bCMDskills\x1bEND        View my tech stack
  \x1bCMDcontact\x1bEND       Get my contact info
  \x1bCMDclear\x1bEND         Clear the terminal
  \x1bCMDfastfetch\x1bEND     Display system info
  \x1bCMDneofetch\x1bEND      Display system info
  \x1bCMDemerge\x1bEND        Check installed packages
  \x1bCMDuname\x1bEND         Show kernel info
  \x1bCMDuptime\x1bEND        Show uptime`;
                break;
            case 'about':
                output = `\x1bTITLE  About Me\x1bEND
  I'm a passionate developer who loves building cool things.
  I specialize in \x1bHLReact\x1bEND, \x1bHLNode.js\x1bEND, and modern web technologies.
  
  Currently running \x1bHLGentoo Linux\x1bEND with \x1bHLKDE Plasma\x1bEND on a
  \x1bHLMSI\x1bEND notebook powered by \x1bHLAMD Ryzen 5 4600H\x1bEND.
  
  I also enjoy Linux rice, open-source, and automation!`;
                break;
            case 'projects':
                output = `\x1bTITLE  My Projects:\x1bEND
  \x1bBULLET▸\x1bEND \x1bHLPortfolio v2\x1bEND        — React, Vite, Framer Motion
  \x1bBULLET▸\x1bEND \x1bHLProject Alpha\x1bEND       — An AI-powered tool
  \x1bBULLET▸\x1bEND \x1bHLProject Beta\x1bEND        — Cross-platform mobile app`;
                break;
            case 'skills':
                output = `\x1bTITLE  Tech Stack:\x1bEND
  \x1bBULLET▸\x1bEND \x1bCMDLanguages\x1bEND      — JavaScript, TypeScript, Python, Java
  \x1bBULLET▸\x1bEND \x1bCMDFrontend\x1bEND       — React, Next.js, Vite, Framer Motion
  \x1bBULLET▸\x1bEND \x1bCMDBackend\x1bEND        — Node.js, Express, PostgreSQL
  \x1bBULLET▸\x1bEND \x1bCMDDevOps\x1bEND         — Docker, Linux, Git, CI/CD
  \x1bBULLET▸\x1bEND \x1bCMDOS/Desktop\x1bEND     — Gentoo Linux, KDE Plasma`;
                break;
            case 'contact':
                output = `\x1bCMDEmail\x1bEND       omindu@example.com
\x1bCMDGitHub\x1bEND      github.com/OminduD
\x1bCMDTwitter\x1bEND     @omindu`;
                break;
            case 'fastfetch':
            case 'neofetch':
                setHistory([...history, { type: 'command', content: cmd }, { type: 'fastfetch' }]);
                return;
            case 'emerge':
            case 'emerge --info':
                output = `\x1bTITLEThese are the packages that would be merged:\x1bEND

\x1bEMERGE[ebuild   R   ]\x1bEND sys-kernel/gentoo-sources-6.12.74
\x1bEMERGE[ebuild   R   ]\x1bEND kde-plasma/plasma-desktop-6.3.2
\x1bEMERGE[ebuild   R   ]\x1bEND app-editors/vim-9.1
\x1bEMERGE[ebuild   R   ]\x1bEND dev-lang/python-3.12.2
\x1bEMERGE[ebuild   R   ]\x1bEND net-misc/curl-8.6.0
\x1bEMERGE[ebuild   R   ]\x1bEND x11-drivers/xf86-video-amdgpu-23.0.0

>>> Total: \x1bHL2242\x1bEND packages installed.`;
                break;
            case 'uname':
            case 'uname -a':
                output = `Linux gentoo \x1bHL6.12.74-1-lts\x1bEND #1 SMP PREEMPT_DYNAMIC x86_64 AMD Ryzen 5 4600H GNU/Linux`;
                break;
            case 'uptimed':
            case 'uptime':
                output = ` \x1bHL03:39:55\x1bEND up 36 min, 1 user, load average: 0.42, 0.38, 0.31`;
                break;
            case 'clear': setHistory([]); return;
            case '': return;
            default: output = `zsh: command not found: \x1bERR${cmd}\x1bEND`;
        }
        setHistory([...history, { type: 'command', content: cmd }, { type: 'output', content: output }]);
    };

    const renderStyledOutput = (text) => {
        if (!text) return null;
        const parts = text.split(/\x1b(TITLE|CMD|HL|BULLET|EMERGE|ERR|END)/);
        let currentStyle = null;
        return parts.map((part, i) => {
            if (['TITLE', 'CMD', 'HL', 'BULLET', 'EMERGE', 'ERR'].includes(part)) { currentStyle = 'out-' + part.toLowerCase(); return null; }
            if (part === 'END') { currentStyle = null; return null; }
            return currentStyle ? <span key={i} className={currentStyle}>{part}</span> : <span key={i}>{part}</span>;
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { handleCommand(input); setInput(''); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (cmdHistory.length > 0) { const n = Math.min(histIdx + 1, cmdHistory.length - 1); setHistIdx(n); setInput(cmdHistory[n]); } }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > 0) { setHistIdx(histIdx - 1); setInput(cmdHistory[histIdx - 1]); } else { setHistIdx(-1); setInput(''); } }
        else if (e.key === 'Tab') { e.preventDefault(); const cmds = ['help', 'about', 'projects', 'skills', 'contact', 'fastfetch', 'neofetch', 'emerge', 'uname', 'uptime', 'uptimed', 'clear']; const m = cmds.find(c => c.startsWith(input.toLowerCase())); if (m) setInput(m); }
    };

    return (
        <div className="konsole-wrapper" onClick={() => inputRef.current?.focus()}>
            {/* ── Konsole Tab Bar ── */}
            <div className="konsole-tabbar">
                <div className="konsole-tabs">
                    {['Shell'].map((tab, i) => (
                        <div key={i} className={`konsole-tab ${i === activeKonsoleTab ? 'active' : ''}`} onClick={() => setActiveKonsoleTab(i)}>
                            <span className="konsole-tab-icon">❯_</span>
                            <span>{tab}</span>
                            <span className="konsole-tab-close">×</span>
                        </div>
                    ))}
                    <div className="konsole-new-tab">+</div>
                </div>
                <div className="konsole-tabbar-right">
                    <span className="konsole-profile">Breeze Dark</span>
                </div>
            </div>

            {/* ── Terminal Content ── */}
            <div className="terminal">
                {history.map((item, index) => {
                    if (item.type === 'fastfetch') return <div key={index}>{renderFastfetch()}</div>;
                    return (
                        <div key={index} className={item.type === 'command' ? 'command-line' : 'terminal-output'}>
                            {item.type === 'command' && renderPrompt()}
                            {item.type === 'command' ? <span className="cmd-text">{item.content}</span> : renderStyledOutput(item.content)}
                        </div>
                    );
                })}
                <div className="command-line">
                    {renderPrompt()}
                    <input ref={inputRef} type="text" className="input-area" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
                    <span className="cursor-blink" />
                </div>
                <div ref={bottomRef} />
            </div>

            {/* ── Status Bar ── */}
            <div className="konsole-statusbar">
                <span className="statusbar-shell">zsh</span>
                <span className="statusbar-sep">│</span>
                <span>omindu@gentoo: ~</span>
                <span className="statusbar-sep">│</span>
                <span>Size: 120×40</span>
                <span className="statusbar-right">
                    <span className="statusbar-encoding">UTF-8</span>
                </span>
            </div>
        </div>
    );
};

export default Terminal;
