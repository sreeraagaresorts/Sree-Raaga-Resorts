import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return;
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login Failed");
    }

    // Restrict admin login
    if (data.user?.role === "admin") {
      toast.error("U Cant login here");
      return;
    }

    // Save JWT Token
    localStorage.setItem("token", data.token);

    // Save User Data
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("Welcome back! Signed in successfully.");
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.message || "Login Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-black text-white h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Left Column: Image banner (hidden on mobile, 50% width on desktop) */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center space-y-3 max-w-md">
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight">Sign In</h1>
          <p className="text-yellow-500 uppercase tracking-[4px] text-xs font-semibold">
            Welcome back to Sree Raaga Resorts
          </p>
        </div>
      </div>

      {/* Right Column: Centered Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-zinc-950/40 relative">
        {/* Mobile background banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] md:hidden"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md bg-zinc-900/90 border border-yellow-500/10 p-6 sm:p-8 shadow-2xl relative z-10"
        >
          {/* Mobile title */}
          <div className="text-center mb-6 md:hidden">
            <h1 className="text-3xl font-light mb-1.5">Sign In</h1>
            <p className="text-yellow-500 uppercase tracking-[3px] text-[10px] font-semibold">
              Welcome Back
            </p>
          </div>

          <h2 className="text-3xl font-light text-center mb-6 hidden md:block text-white">
            User Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1.5 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-yellow-500/20 py-2 outline-none focus:border-yellow-500 text-white transition text-sm"
              />
            </div>

            <div>
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-yellow-500/20 py-2 pr-10 outline-none focus:border-yellow-500 text-white transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 cursor-pointer bg-transparent border-0"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition text-sm uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-lg">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-500 hover:underline">
              Sign Up
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/forgot-password"
              className="text-[16px] text-gray-100 hover:text-yellow-500 transition"
            >
              Forgot Password?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;