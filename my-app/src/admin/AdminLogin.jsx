import React, { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Restrict access on screens smaller than 1024px (mobile & tablet)
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  if (isMobile) {
    return (
      <div 
        className="h-screen overflow-hidden flex items-center justify-center bg-cover bg-center relative p-4"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000')"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-zinc-950/95 border border-red-500/20 p-6 sm:p-8 shadow-2xl relative z-10 text-center"
        >
          {/* Brand/Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-red-500 w-8 h-8 animate-pulse" />
            </div>
            <p className="text-red-500 text-[10px] uppercase tracking-[4px] mb-2 font-semibold">
              Access Restricted
            </p>
            <h2 className="text-2xl text-white font-light mb-3">
              Desktop Access Only
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider mb-6">
              For security reasons, the Admin Portal is only accessible from desktop devices. Please log in using a computer.
            </p>
          </div>

          {/* Return Home Link */}
          <Link 
            to="/" 
            className="flex items-center py-4 justify-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={12} /> Return to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen overflow-hidden flex items-center justify-center bg-cover bg-center relative p-4"
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
        className="w-full max-w-md bg-zinc-950/90 border border-yellow-500/20 p-6 sm:p-8 shadow-2xl relative z-10"
      >
      

        {/* Brand/Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-yellow-500 w-6 h-6" />
          </div>
          <p className="text-yellow-500 text-[10px] uppercase tracking-[4px] mb-1 font-semibold">
            Control Panel
          </p>
          <h2 className="text-3xl  text-white font-light">
            Admin Portal
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-none text-xs mb-4 text-center tracking-wider"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-yellow-500 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
               Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-yellow-500/15 py-2.5 px-4 outline-none focus:border-yellow-500 text-white transition text-sm rounded-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-yellow-500 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-yellow-500/15 py-2.5 px-4 outline-none focus:border-yellow-500 text-white transition text-sm rounded-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black hover:bg-yellow-400 font-bold transition disabled:bg-yellow-500/50 uppercase tracking-widest text-xs cursor-pointer rounded-none"
          >
            {loading ? "Authorizing access..." : "Enter Portal"}
          </button>
        </form>
          {/* Back Link */}
        <Link 
          to="/" 
          className="flex items-center py-7 justify-center gap-2 text-xs text-gray-100 hover:text-yellow-500 transition  uppercase tracking-wider"
        >
          <ArrowLeft size={12} /> Back to Homepage
        </Link>

        <p className="text-[12px] text-center text-gray-400  uppercase tracking-widest">
          Restricted area. Admin access only.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;