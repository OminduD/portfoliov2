import React, { useState, useRef } from 'react';
import { Send, Paperclip, Bold, Italic, Underline, AlignLeft, List, Image, Smile, Trash2, ChevronDown, Inbox, SendHorizonal, FileText, Star, Archive } from 'lucide-react';
import './Email.css';

const Email = () => {
    const [view, setView] = useState('compose'); // 'inbox' or 'compose'
    const [to] = useState('omindudulneth@outlook.com');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [fromName, setFromName] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const bodyRef = useRef(null);

    const inboxMessages = [
        { id: 1, from: 'KDE Community', subject: 'Welcome to KDE Plasma 6.1', date: 'Mar 5', read: true, starred: true },
        { id: 2, from: 'Gentoo Dev', subject: 'Package update: sys-kernel/gentoo-sources-6.6.21', date: 'Mar 4', read: true, starred: false },
        { id: 3, from: 'GitHub', subject: '[OminduD/portfoliov2] New star on your repository', date: 'Mar 3', read: false, starred: false },
    ];

    const handleSend = async () => {
        if (!fromName.trim() || !fromEmail.trim() || !subject.trim() || !body.trim()) {
            setError('Please fill in all fields before sending.');
            return;
        }
        setError('');
        setSending(true);

        // Use mailto as the action — opens user's email client with pre-filled data
        const mailtoLink = `mailto:omindudulneth@outlook.com?subject=${encodeURIComponent(`[Portfolio Contact] ${subject}`)}&body=${encodeURIComponent(`From: ${fromName} (${fromEmail})\n\n${body}`)}`;
        window.open(mailtoLink, '_blank');

        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    const handleReset = () => {
        setSubject('');
        setBody('');
        setFromName('');
        setFromEmail('');
        setError('');
        setSent(false);
    };

    return (
        <div className="thunderbird-container">
            {/* ── Toolbar ── */}
            <div className="tb-toolbar">
                <button className="tb-toolbar-btn" onClick={() => { setView('compose'); handleReset(); }}>
                    <FileText size={14} />
                    <span>New Message</span>
                </button>
                <div className="tb-toolbar-separator" />
                <button className={`tb-toolbar-btn ${view === 'inbox' ? 'active' : ''}`} onClick={() => setView('inbox')}>
                    <Inbox size={14} />
                    <span>Inbox</span>
                    <span className="tb-badge">3</span>
                </button>
                <button className={`tb-toolbar-btn ${view === 'compose' ? 'active' : ''}`} onClick={() => setView('compose')}>
                    <SendHorizonal size={14} />
                    <span>Compose</span>
                </button>
            </div>

            {view === 'inbox' ? (
                /* ═══ Inbox View ═══ */
                <div className="tb-inbox">
                    <div className="tb-inbox-header">
                        <span className="tb-folder-name">Inbox</span>
                        <span className="tb-msg-count">3 messages</span>
                    </div>
                    <div className="tb-message-list">
                        {inboxMessages.map(msg => (
                            <div key={msg.id} className={`tb-message-row ${!msg.read ? 'unread' : ''}`} onClick={() => setView('compose')}>
                                <button className={`tb-star-btn ${msg.starred ? 'starred' : ''}`}>
                                    <Star size={14} />
                                </button>
                                <div className="tb-msg-from">{msg.from}</div>
                                <div className="tb-msg-subject">{msg.subject}</div>
                                <div className="tb-msg-date">{msg.date}</div>
                            </div>
                        ))}
                    </div>
                    <div className="tb-inbox-footer">
                        <span>Want to get in touch? Click <strong>Compose</strong> to send me a message!</span>
                    </div>
                </div>
            ) : (
                /* ═══ Compose View ═══ */
                <div className="tb-compose">
                    {/* Header Fields */}
                    <div className="tb-compose-fields">
                        <div className="tb-field-row">
                            <label className="tb-field-label">From:</label>
                            <div className="tb-field-inputs-split">
                                <input
                                    type="text"
                                    className="tb-field-input"
                                    placeholder="Your name"
                                    value={fromName}
                                    onChange={e => setFromName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    className="tb-field-input"
                                    placeholder="your@email.com"
                                    value={fromEmail}
                                    onChange={e => setFromEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="tb-field-row">
                            <label className="tb-field-label">To:</label>
                            <div className="tb-field-value-fixed">
                                <span className="tb-recipient-chip">
                                    <span className="tb-recipient-avatar">O</span>
                                    omindudulneth@outlook.com
                                </span>
                            </div>
                        </div>
                        <div className="tb-field-row">
                            <label className="tb-field-label">Subject:</label>
                            <input
                                type="text"
                                className="tb-field-input"
                                placeholder="What's this about?"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="tb-format-bar">
                        <button className="tb-format-btn"><Bold size={14} /></button>
                        <button className="tb-format-btn"><Italic size={14} /></button>
                        <button className="tb-format-btn"><Underline size={14} /></button>
                        <div className="tb-format-separator" />
                        <button className="tb-format-btn"><AlignLeft size={14} /></button>
                        <button className="tb-format-btn"><List size={14} /></button>
                        <div className="tb-format-separator" />
                        <button className="tb-format-btn"><Paperclip size={14} /></button>
                        <button className="tb-format-btn"><Image size={14} /></button>
                        <button className="tb-format-btn"><Smile size={14} /></button>
                    </div>

                    {/* Message Body */}
                    <textarea
                        ref={bodyRef}
                        className="tb-body"
                        placeholder="Write your message here..."
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    />

                    {/* Status / Error */}
                    {error && <div className="tb-error">{error}</div>}
                    {sent && <div className="tb-success">✓ Email client opened! Send the message from your email app.</div>}

                    {/* Bottom Actions */}
                    <div className="tb-compose-actions">
                        <button className="tb-send-btn" onClick={handleSend} disabled={sending}>
                            <Send size={14} />
                            <span>{sending ? 'Opening...' : 'Send'}</span>
                        </button>
                        <div className="tb-actions-right">
                            <button className="tb-action-btn" onClick={handleReset} title="Discard">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Email;
