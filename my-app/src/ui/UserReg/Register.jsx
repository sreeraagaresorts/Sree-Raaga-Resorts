import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
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

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Hero Section */}
      <section
        className="relative h-[45vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Join Us
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Create An Account
          </p>
        </div>
      </section>

      {/* Register Form */}
      <section className="py-24 px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-zinc-950 border border-yellow-500/20 p-10 shadow-2xl">

            <h2 className="text-4xl text-center mb-10">
              Create Account
            </h2>
            <form
              onSubmit={handleRegister}
              className="space-y-6"
            >
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
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
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
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
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  Phone Number
                </label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  Confirm Password
                </label>

                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-yellow-500/20 py-3 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
              >
                {loading
                  ? "Creating Account..."
                  : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-500 hover:underline"
              >
                Sign In
              </Link>
            </div>

          </div>
        </motion.div>

      </section>
    </div>
  );
};

export default Register;