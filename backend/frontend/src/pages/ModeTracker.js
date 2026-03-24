
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem('token');

export default function MoodTracker() {
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');

  const moods = ['😞','😕','😐','🙂','😊','😄','🤩'];

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/mood/`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/mood/`, { mood_score: mood, notes },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setMessage('Mood logged successfully! ✅');
      setNotes('');
      fetchLogs();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage('Failed to log mood ❌'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Back</Link>
        <h2 style={styles.title}>😊 Mood Tracker</h2>
      </div>
      <div style={styles.card}>
        <h3 style={styles.label}>How are you feeling? {moods[Math.floor(mood/1.5)]}</h3>
        <input type="range" min="1" max="10" value={mood}
          onChange={e => setMood(e.target.value)} style={styles.slider} />
        <p style={styles.moodScore}>Score: {mood}/10</p>
        <textarea style={styles.textarea} placeholder="Add notes (optional)..."
          value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
        {message && <p style={styles.message}>{message}</p>}
        <button style={styles.button} onClick={handleSubmit}>Log Mood</button>
      </div>
      <h3 style={styles.historyTitle}>Recent Mood Logs</h3>
      {logs.slice(0, 7).map((log, i) => (
        <div key={i} style={styles.logItem}>
          <span style={styles.logScore}>Score: {log.mood_score}/10</span>
          <span style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</span>
          {log.notes && <p style={styles.logNotes}>{log.notes}</p>}
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
  card: { background: '#1a2634', padding: '24px', borderRadius: '16px', marginBottom: '24px' },
  label: { color: '#fff', marginBottom: '16px' },
  slider: { width: '100%', marginBottom: '8px' },
  moodScore: { color: '#4ecdc4', marginBottom: '16px' },
  textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #2a3a4a',
    background: '#0f1923', color: '#fff', fontSize: '14px',
    boxSizing: 'border-box', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', background: '#4ecdc4', color: '#0f1923',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  message: { color: '#4ecdc4', marginBottom: '12px' },
  historyTitle: { color: '#fff', marginBottom: '16px' },
  logItem: { background: '#1a2634', padding: '16px', borderRadius: '12px', marginBottom: '12px' },
  logScore: { color: '#4ecdc4', fontWeight: 'bold', marginRight: '16px' },
  logDate: { color: '#8899aa', fontSize: '14px' },
  logNotes: { color: '#ccc', fontSize: '14px', marginTop: '8px', marginBottom: 0 },
};