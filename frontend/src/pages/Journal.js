import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem('token');

export default function Journal() {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { fetchEntries(); fetchPrompt(); }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/journal/`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setEntries(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPrompt = async () => {
    try {
      const res = await axios.get(`${API}/journal/prompt`,
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setPrompt(res.data.prompt);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/journal/`, { content },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setMessage('Journal entry saved! ✅');
      setContent('');
      fetchEntries();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage('Failed to save entry ❌'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Back</Link>
        <h2 style={styles.title}>📝 Journal</h2>
      </div>
      {prompt && (
        <div style={styles.promptBox}>
          <p style={styles.promptLabel}>✨ AI Prompt for today:</p>
          <p style={styles.promptText}>{prompt}</p>
        </div>
      )}
      <div style={styles.card}>
        <textarea style={styles.textarea} placeholder="Write your thoughts here..."
          value={content} onChange={e => setContent(e.target.value)} rows={6} />
        {message && <p style={styles.message}>{message}</p>}
        <button style={styles.button} onClick={handleSubmit}>Save Entry</button>
      </div>
      <h3 style={styles.historyTitle}>Past Entries</h3>
      {entries.slice(0, 5).map((entry, i) => (
        <div key={i} style={styles.entryItem}>
          <p style={styles.entryDate}>{new Date(entry.date).toLocaleDateString()}</p>
          <p style={styles.entryContent}>{entry.content}</p>
          {entry.ai_summary && (
            <p style={styles.aiSummary}>🤖 AI Summary: {entry.ai_summary}</p>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1923', padding: '24px', maxWidth: '600px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { color: '#4ecdc4', textDecoration: 'none' },
  title: { color: '#4ecdc4', margin: 0 },
  promptBox: { background: '#1a3a3a', padding: '16px', borderRadius: '12px',
    marginBottom: '20px', borderLeft: '4px solid #4ecdc4' },
  promptLabel: { color: '#4ecdc4', fontWeight: 'bold', marginBottom: '8px', margin: 0 },
  promptText: { color: '#ccc', marginTop: '8px', marginBottom: 0 },
  card: { background: '#1a2634', padding: '24px', borderRadius: '16px', marginBottom: '24px' },
  textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #2a3a4a',
    background: '#0f1923', color: '#fff', fontSize: '14px',
    boxSizing: 'border-box', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', background: '#4ecdc4', color: '#0f1923',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  message: { color: '#4ecdc4', marginBottom: '12px' },
  historyTitle: { color: '#fff', marginBottom: '16px' },
  entryItem: { background: '#1a2634', padding: '16px', borderRadius: '12px', marginBottom: '12px' },
  entryDate: { color: '#8899aa', fontSize: '12px', marginBottom: '8px' },
  entryContent: { color: '#ccc', fontSize: '14px', marginBottom: '8px' },
  aiSummary: { color: '#4ecdc4', fontSize: '13px', fontStyle: 'italic', marginBottom: 0 },
};