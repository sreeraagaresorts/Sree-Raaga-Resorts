import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setPasswordTouched(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const minLength = 8;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    if (formData.password.length < minLength) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!hasNumber.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!hasSymbol.test(formData.password)) {
      toast.error("Password must contain at least one special character/symbol");
      return;
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be a valid 10-digit number starting with +91");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Registration Successful! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid =
    formData.password.length >= 8 &&
    /\d/.test(formData.password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  return (
    <div className="bg-black text-white min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row">
      {/* Left Column: Image banner (hidden on mobile, 50% width on desktop) */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center space-y-3 max-w-md">
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight">Sign Up</h1>
          <p className="text-yellow-500 uppercase tracking-[4px] text-xs font-semibold">
            Create an Account with Sree Raaga Resorts
          </p>
        </div>
      </div>

      {/* Right Column: Centered Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-zinc-950/40 relative overflow-y-auto h-full">
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
          className="w-full max-w-md bg-zinc-900/90 border border-yellow-500/10 p-6 sm:p-8 shadow-2xl relative z-10 my-8 md:my-0"
        >
          {/* Mobile title */}
          <div className="text-center mb-6 md:hidden">
            <h1 className="text-3xl font-light mb-1.5">Sign Up</h1>
            <p className="text-yellow-500 uppercase tracking-[3px] text-[10px] font-semibold">
              Create An Account
            </p>
          </div>

          <h2 className="text-3xl font-light text-center mb-6 hidden md:block text-white">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-yellow-500/20 py-1.5 outline-none focus:border-yellow-500 text-white transition text-sm"
              />
            </div>

            <div>
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-yellow-500/20 py-1.5 outline-none focus:border-yellow-500 text-white transition text-sm"
              />
            </div>

            <div>
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1 font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                placeholder="+919876543210"
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith("+91")) {
                    if (val.startsWith("91")) {
                      val = "+" + val;
                    } else if (val.startsWith("+")) {
                      val = "+91" + val.slice(1).replace(/\D/g, "");
                    } else {
                      val = "+91" + val.replace(/\D/g, "");
                    }
                  } else {
                    const rest = val.slice(3).replace(/\D/g, "");
                    val = "+91" + rest;
                  }
                  if (val.length <= 13) {
                    setFormData({
                      ...formData,
                      phone: val,
                    });
                  }
                }}
                className="w-full bg-transparent border-b border-yellow-500/20 py-1.5 outline-none focus:border-yellow-500 text-white transition text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-yellow-500 text-[14px] uppercase tracking-widest font-semibold">
                  Password
                </label>
                {passwordTouched && !isPasswordValid && (
                  <span className="text-[10px] text-white font-medium">
                    Min 8 chars, 1 number & 1 symbol
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  onBlur={() => setPasswordTouched(true)}
                  className="w-full bg-transparent border-b border-yellow-500/20 py-1.5 pr-10 outline-none focus:border-yellow-500 text-white transition text-sm"
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
              <label className="block text-yellow-500 text-[14px] uppercase tracking-widest mb-1 font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-yellow-500/20 py-1.5 pr-10 outline-none focus:border-yellow-500 text-white transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 cursor-pointer bg-transparent border-0"
                >
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition text-sm uppercase tracking-wider cursor-pointer mt-4"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:underline">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;