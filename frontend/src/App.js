import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";   // ✅ ADD THIS
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";

export default function App() {
  return (
    <BrowserRouter>   {/* ✅ fix spelling */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />   {/* ✅ ADD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood" element={<MoodTracker />} />
      </Routes>
    </BrowserRouter>
  );
}