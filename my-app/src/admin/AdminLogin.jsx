import React, { useState } from "react";
import { API_URL } from "../config/api";
import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      if (data.user.role !== "admin") {
        throw new Error("Access Denied: Administrator role required.");
      }

      // Save admin tokens and user details
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-zinc-950/90 border border-yellow-500/20 p-8 shadow-2xl relative z-10"
      >
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-500 transition mb-6 uppercase tracking-wider"
        >
          <ArrowLeft size={12} /> Back to Homepage
        </Link>

        {/* Brand/Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-yellow-500 w-6 h-6" />
          </div>
          <p className="text-yellow-500 text-[10px] uppercase tracking-[4px] mb-1 font-semibold">
            Control Panel
          </p>
          <h2 className="text-3xl font-serif text-white font-light">
            Admin Portal
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-none text-xs mb-6 text-center tracking-wider"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-yellow-500 text-[10px] uppercase tracking-widest mb-2 font-medium">
              Administrative Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@sreeraagaresort.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-yellow-500/15 py-3 px-4 outline-none focus:border-yellow-500 text-white transition text-sm rounded-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-yellow-500 text-[10px] uppercase tracking-widest mb-2 font-medium">
              Passcode
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-yellow-500/15 py-3 px-4 outline-none focus:border-yellow-500 text-white transition text-sm rounded-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-yellow-500 text-black hover:bg-yellow-400 font-bold transition disabled:bg-yellow-500/50 uppercase tracking-widest text-xs cursor-pointer rounded-none"
          >
            {loading ? "Authorizing access..." : "Enter Portal"}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-600 mt-8 uppercase tracking-widest">
          Sree Raaga Resort © {new Date().getFullYear()} All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;