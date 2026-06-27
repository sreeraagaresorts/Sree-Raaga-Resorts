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
    <div className="bg-black text-white min-h-screen">

      {/* Hero */}
      <section
        className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Sign In
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Welcome Back
          </p>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-24 px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg mx-auto"
        >

          <div className="bg-zinc-950 border border-yellow-500/20 p-10 shadow-2xl">

            <h2 className="text-4xl text-center mb-10">
              User Login
            </h2>
            <form
              onSubmit={handleLogin}
              className="space-y-8"
            >
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full bg-transparent border-b border-yellow-500/20 py-3 pr-10 outline-none focus:border-yellow-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 cursor-pointer"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-yellow-500 hover:underline"
              >
                Sign Up
              </Link>

            </div>

            <div className="mt-4 text-center">

              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-yellow-500 transition"
              >
                Forgot Password?
              </Link>

            </div>

          </div>

        </motion.div>

      </section>

    </div>
  );
};

export default Login;