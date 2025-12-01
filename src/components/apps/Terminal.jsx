import React, { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const ASCII_ART = `
   /\\
  /  \\    ARCH LINUX
 /    \\   ----------
/______\\  User: Omindu
          OS: Arch Linux x86_64
          WM: Hyprland
          Shell: zsh
`;

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'output', content: ASCII_ART },
        { type: 'output', content: 'Welcome to my portfolio! Type "help" to see available commands.' }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let output = '';

        switch (trimmedCmd) {
            case 'help':
                output = `Available commands:
  help      - Show this help message
  about     - Learn more about me
  projects  - View my projects
  contact   - Get my contact info
  clear     - Clear the terminal
  neofetch  - Display system info`;
                break;
            case 'about':
                output = `I am a passionate developer who loves building cool things.
I specialize in React, Node.js, and modern web technologies.
I also enjoy customizing my Linux setup (as you can see!).`;
                break;
            case 'projects':
                output = `My Projects:
1. Portfolio v2 (This website!) - React, Vite, Framer Motion
2. Project Alpha - A cool AI tool
3. Project Beta - A mobile app
(Type "open <project_number>" to see details - WIP)`;
                break;
            case 'contact':
                output = `Email: omindu@example.com
GitHub: github.com/omindu
Twitter: @omindu`;
                break;
            case 'neofetch':
                output = ASCII_ART;
                break;
            case 'clear':
                setHistory([]);
                return;
            case '':
                return;
            default:
                output = `Command not found: ${cmd}`;
        }

        setHistory([...history, { type: 'command', content: cmd }, { type: 'output', content: output }]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            {history.map((item, index) => (
                <div key={index} className={item.type === 'command' ? 'command-line' : 'terminal-output'}>
                    {item.type === 'command' && (
                        <span className="prompt">
                            omindu@archlinux <span className="prompt-path">~</span> ❯
                        </span>
                    )}
                    <span className={item.content.startsWith('Command not found') ? 'command-error' : ''}>
                        {item.content}
                    </span>
                </div>
            ))}

            <div className="command-line">
                <span className="prompt">
                    omindu@archlinux <span className="prompt-path">~</span> ❯
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="input-area"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
