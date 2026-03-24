import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const _res= await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
      });

      setMessage("Registration successful ✅");

      // Redirect to login
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Registration failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌿 Register</h1>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && <p style={{ color: "#fff" }}>{message}</p>}

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>

        <p style={styles.link}>
          Already have account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1923",
  },
  card: {
    background: "#1a2634",
    padding: "40px",
    borderRadius: "16px",
    width: "360px",
  },
  title: { color: "#4ecdc4", textAlign: "center" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4ecdc4",
    border: "none",
    borderRadius: "8px",
  },
  link: { color: "#8899aa", textAlign: "center", marginTop: "10px" },
};