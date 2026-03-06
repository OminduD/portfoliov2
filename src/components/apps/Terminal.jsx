import React, { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const GENTOO_LOGO = [
    '    .----.',
    '  .`    _  `.',
    '  `.   (_)    `.',
    '    `.          `.',
    '   .`           `.',
    '  .` .           `.',
    ' .`   .          `.',
    '.`     `.       .`',
    '  `.      `.  .`',
    '    `-..__.-`',
];

const SYSTEM_INFO = [
    { label: '', value: '\x1bUSER' },
    { label: '', value: '──────────────────' },
    { label: 'OS', value: 'Gentoo Linux x86_64' },
    { label: 'Kernel', value: '6.6.21-gentoo' },
    { label: 'DE', value: 'KDE Plasma 6.1' },
    { label: 'WM', value: 'KWin (Wayland)' },
    { label: 'Shell', value: 'zsh 5.9 (oh-my-zsh)' },
    { label: 'Terminal', value: 'Konsole 24.05' },
    { label: 'CPU', value: 'AMD Ryzen 7 5800X' },
    { label: 'GPU', value: 'NVIDIA RTX 3070' },
    { label: 'Memory', value: '2.4G / 16G' },
    { label: 'Packages', value: '1847 (emerge)' },
];

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'neofetch' },
        { type: 'output', content: 'Welcome to my portfolio! Type "help" to see available commands.' }
    ]);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const renderNeofetch = () => {
        const maxLines = Math.max(GENTOO_LOGO.length, SYSTEM_INFO.length);
        const rows = [];
        for (let i = 0; i < maxLines; i++) {
            const artLine = GENTOO_LOGO[i] || '';
            const info = SYSTEM_INFO[i];
            rows.push(
                <div key={i} className="neofetch-line">
                    <span className="neofetch-art">{artLine.padEnd(28)}</span>
                    <span className="neofetch-info">
                        {info ? renderInfoValue(info) : null}
                    </span>
                </div>
            );
        }
        // Color palette row
        rows.push(
            <div key="colors" className="neofetch-line">
                <span className="neofetch-art">{''.padEnd(28)}</span>
                <span className="neofetch-info">
                    <span className="color-blocks">
                        <span className="cb" style={{ color: '#1b1e20' }}>███</span>
                        <span className="cb" style={{ color: '#ed1515' }}>███</span>
                        <span className="cb" style={{ color: '#27ae60' }}>███</span>
                        <span className="cb" style={{ color: '#f67400' }}>███</span>
                        <span className="cb" style={{ color: '#3daee9' }}>███</span>
                        <span className="cb" style={{ color: '#8e44ad' }}>███</span>
                        <span className="cb" style={{ color: '#1abc9c' }}>███</span>
                        <span className="cb" style={{ color: '#eff0f1' }}>███</span>
                    </span>
                </span>
            </div>
        );
        return <div className="neofetch-block">{rows}</div>;
    };

    const renderInfoValue = (info) => {
        const { label, value } = info;
        if (value === '\x1bUSER') {
            return (
                <span>
                    <span className="nf-user">omindu</span>
                    <span className="nf-at">@</span>
                    <span className="nf-host">gentoo</span>
                </span>
            );
        }
        if (value.startsWith('──')) return <span className="nf-separator">{value}</span>;
        if (label) {
            return (
                <span>
                    <span className="nf-label">{label}</span>
                    <span className="nf-value">{value}</span>
                </span>
            );
        }
        return <span>{value}</span>;
    };

    const renderPrompt = () => (
        <span className="omz-prompt">
            <span className="omz-arrow">❯</span>
            <span className="omz-segment omz-seg-user">
                <span className="omz-seg-text"> omindu@gentoo </span>
            </span>
            <span className="omz-seg-arrow seg-user-to-dir"></span>
            <span className="omz-segment omz-seg-dir">
                <span className="omz-seg-text"> ~ </span>
            </span>
            <span className="omz-seg-arrow seg-dir-to-git"></span>
            <span className="omz-segment omz-seg-git">
                <span className="omz-seg-text"> main ✔ </span>
            </span>
            <span className="omz-seg-arrow seg-git-to-end"></span>
            <span className="omz-final-arrow"> ❯ </span>
        </span>
    );

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let output = '';

        if (cmd.trim()) {
            setCmdHistory(prev => [cmd.trim(), ...prev]);
            setHistIdx(-1);
        }

        switch (trimmedCmd) {
            case 'help':
                output = `\x1bTITLEAvailable commands:\x1bEND
  \x1bCMDhelp\x1bEND      Show this help message
  \x1bCMDabout\x1bEND     Learn more about me
  \x1bCMDprojects\x1bEND  View my projects
  \x1bCMDskills\x1bEND    View my tech stack
  \x1bCMDcontact\x1bEND   Get my contact info
  \x1bCMDclear\x1bEND     Clear the terminal
  \x1bCMDneofetch\x1bEND  Display system info
  \x1bCMDemerge\x1bEND    Check installed packages`;
                break;
            case 'about':
                output = `I am a passionate developer who loves building cool things.
I specialize in \x1bHLReact\x1bEND, \x1bHLNode.js\x1bEND, and modern web technologies.
I also enjoy customizing my \x1bHLLinux\x1bEND setup — currently running \x1bHLGentoo\x1bEND with \x1bHLKDE Plasma\x1bEND!`;
                break;
            case 'projects':
                output = `\x1bTITLEMy Projects:\x1bEND
  \x1bBULLET▸\x1bEND \x1bHLPortfolio v2\x1bEND      — React, Vite, Framer Motion (this website!)
  \x1bBULLET▸\x1bEND \x1bHLProject Alpha\x1bEND     — An AI-powered tool
  \x1bBULLET▸\x1bEND \x1bHLProject Beta\x1bEND      — Cross-platform mobile app`;
                break;
            case 'skills':
                output = `\x1bTITLETech Stack:\x1bEND
  \x1bBULLET▸\x1bEND \x1bCMDLanguages\x1bEND    — JavaScript, TypeScript, Python, Java
  \x1bBULLET▸\x1bEND \x1bCMDFrontend\x1bEND     — React, Next.js, Vite, Framer Motion
  \x1bBULLET▸\x1bEND \x1bCMDBackend\x1bEND      — Node.js, Express, PostgreSQL
  \x1bBULLET▸\x1bEND \x1bCMDDevOps\x1bEND       — Docker, Linux, Git, CI/CD
  \x1bBULLET▸\x1bEND \x1bCMDOS/Desktop\x1bEND   — Gentoo Linux, KDE Plasma`;
                break;
            case 'contact':
                output = `\x1bCMDEmail\x1bEND     omindu@example.com
\x1bCMDGitHub\x1bEND    github.com/OminduD
\x1bCMDTwitter\x1bEND   @omindu`;
                break;
            case 'neofetch':
                setHistory([...history, { type: 'command', content: cmd }, { type: 'neofetch' }]);
                return;
            case 'emerge':
                output = `\x1bTITLEThese are the packages that would be merged:\x1bEND

\x1bEMERGE[ebuild   R   ]\x1bEND sys-kernel/gentoo-sources-6.6.21
\x1bEMERGE[ebuild   R   ]\x1bEND kde-plasma/plasma-desktop-6.1.0
\x1bEMERGE[ebuild   R   ]\x1bEND app-editors/vim-9.1
\x1bEMERGE[ebuild   R   ]\x1bEND dev-lang/python-3.12.2
\x1bEMERGE[ebuild   R   ]\x1bEND net-misc/curl-8.6.0

>>> Total: \x1bHL1847\x1bEND packages installed.`;
                break;
            case 'clear':
                setHistory([]);
                return;
            case '':
                return;
            default:
                output = `zsh: command not found: \x1bERR${cmd}\x1bEND`;
        }

        setHistory([...history, { type: 'command', content: cmd }, { type: 'output', content: output }]);
    };

    const renderStyledOutput = (text) => {
        if (!text) return null;
        const parts = text.split(/\x1b(TITLE|CMD|HL|BULLET|EMERGE|ERR|END)/);
        let currentStyle = null;
        return parts.map((part, i) => {
            switch (part) {
                case 'TITLE': currentStyle = 'out-title'; return null;
                case 'CMD': currentStyle = 'out-cmd'; return null;
                case 'HL': currentStyle = 'out-highlight'; return null;
                case 'BULLET': currentStyle = 'out-bullet'; return null;
                case 'EMERGE': currentStyle = 'out-emerge'; return null;
                case 'ERR': currentStyle = 'out-error'; return null;
                case 'END': currentStyle = null; return null;
                default:
                    if (currentStyle) return <span key={i} className={currentStyle}>{part}</span>;
                    return <span key={i}>{part}</span>;
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
                setHistIdx(newIdx);
                setInput(cmdHistory[newIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) {
                const newIdx = histIdx - 1;
                setHistIdx(newIdx);
                setInput(cmdHistory[newIdx]);
            } else {
                setHistIdx(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const cmds = ['help', 'about', 'projects', 'skills', 'contact', 'neofetch', 'emerge', 'clear'];
            const match = cmds.find(c => c.startsWith(input.toLowerCase()));
            if (match) setInput(match);
        }
    };

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            {history.map((item, index) => {
                if (item.type === 'neofetch') return <div key={index}>{renderNeofetch()}</div>;
                return (
                    <div key={index} className={item.type === 'command' ? 'command-line' : 'terminal-output'}>
                        {item.type === 'command' && renderPrompt()}
                        {item.type === 'command'
                            ? <span className="cmd-text">{item.content}</span>
                            : renderStyledOutput(item.content)
                        }
                    </div>
                );
            })}
            <div className="command-line">
                {renderPrompt()}
                <input
                    ref={inputRef}
                    type="text"
                    className="input-area"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <span className="cursor-blink" />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
