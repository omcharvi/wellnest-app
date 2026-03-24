import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// ✅ Fallback added (VERY IMPORTANT)
const API = process.env.REACT_APP_API_URL || "https://wellnest-app-rzup.onrender.com";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      console.log("API URL:", API); // 🔍 Debug

      const res = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
      });

      console.log("Response:", res.data);

      setMessage("Registration successful ✅");

      // Redirect to login
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      console.error("Register Error:", err);

      // ✅ Better error handling
      if (err.response) {
        setMessage(err.response.data.detail || "Registration failed ❌");
      } else {
        setMessage("Server not reachable ❌");
      }
    } finally {
      setLoading(false);
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

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
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
    cursor: "pointer",
  },
  link: { color: "#8899aa", textAlign: "center", marginTop: "10px" },
};