import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify & Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      toast.success(data.message || "OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      toast.success(data.message || "Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to reset password.");
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
        <div className="absolute inset-0 bg-[#011b3c] backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center space-y-3 max-w-md">
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight">
            {step === 1 ? "Recovery" : "Reset"}
          </h1>
          <p className="text-yellow-500 uppercase tracking-[4px] text-xs font-semibold">
            Secure Password Reset
          </p>
        </div>
      </div>

      {/* Right Column: Centered Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-[#011b3c] relative">
        {/* Mobile background banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] md:hidden"></div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-zinc-900/90 border border-yellow-500/10 p-6 sm:p-8 shadow-2xl relative z-10"
        >
          {step === 1 ? (
            /* Step 1: Send OTP UI */
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-light text-white mb-2">Forgot Password</h2>
                <p className="text-gray-400 text-sm">
                  Enter your registered email address and we will send you an OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
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
                    placeholder="e.g. guest@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? "Sending OTP..." : "Send OTP Code"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-gray-400 hover:text-yellow-500 transition inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Step 2: Verify OTP & Reset UI */
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-light text-white mb-2">Verify OTP</h2>
                <p className="text-gray-400 text-sm">
                  We've sent a 6-digit OTP to <span className="text-yellow-500 font-semibold">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1.5 font-semibold">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent border-b border-yellow-500/20 py-2 outline-none focus:border-yellow-500 text-white tracking-widest text-center text-lg transition font-semibold"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1.5 font-semibold">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div>
                  <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1.5 font-semibold">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-yellow-500/20 py-2 outline-none focus:border-yellow-500 text-white transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition text-sm uppercase tracking-wider cursor-pointer"
                >
                  {loading ? "Updating Password..." : "Update Password"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-yellow-500 transition inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-yellow-500 hover:underline bg-transparent border-0 cursor-pointer font-medium"
                >
                  Resend OTP Code
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
      </div>
    </div>
  );
};

export default ForgotPassword;
