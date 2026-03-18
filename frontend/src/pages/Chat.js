
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem('token');

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your WellNest AI companion 🌿 How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat/`,
        { message: input },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble responding right now. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Back</Link>
        <h2 style={styles.title}>💬 AI Companion</h2>
      </div>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.bubble,
            ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble) }}>
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.aiBubble}>Thinking... 🤔</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} placeholder="Type your message..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} />
        <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1923', padding: '24px',
    maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
  back: { color: '#4ecdc4', textDecoration: 'none' },
  title: { color: '#4ecdc4', margin: 0 },
  chatBox: { flex: 1, background: '#1a2634', borderRadius: '16px',
    padding: '16px', marginBottom: '16px', minHeight: '400px',
    maxHeight: '500px', overflowY: 'auto' },
  bubble: { padding: '12px 16px', borderRadius: '12px',
    marginBottom: '12px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.5' },
  userBubble: { background: '#4ecdc4', color: '#0f1923', marginLeft: 'auto' },
  aiBubble: { background: '#0f1923', color: '#fff', marginRight: 'auto' },
  inputRow: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px',
    border: '1px solid #2a3a4a', background: '#1a2634',
    color: '#fff', fontSize: '14px' },
  sendBtn: { padding: '12px 24px', background: '#4ecdc4', color: '#0f1923',
    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
};