import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Rooms", path: "/rooms" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex-1 md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <Menu className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Left Links */}
          <div className="hidden md:flex flex-1 gap-8 uppercase tracking-wider text-sm">
            {links.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition ${
                  location.pathname === link.path
                    ? "text-yellow-500"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" className="text-center">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-serif text-yellow-500"
            >
              Sree Raaga
            </motion.h1>

            <span className="text-[10px] tracking-[4px] uppercase text-white">
              Resorts
            </span>
          </Link>

          {/* Right Links */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-6 uppercase tracking-wider text-sm">
            {links.slice(3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition ${
                  location.pathname === link.path
                    ? "text-yellow-500"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                {/* <Link
                  to="/dashboard"
                  className="hover:text-yellow-500 text-white"
                >
                  Dashboard
                </Link> */}
                <button
                  onClick={handleSignOut}
                  className="hover:text-red-400 text-white cursor-pointer uppercase tracking-wider text-sm bg-transparent border-0"
                >
                  Sign Out
                </button>
                <Link
                  to="/dashboard/profile"
                  className="w-9 h-9 rounded-full border border-yellow-500 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition"
                  title={user.full_name}
                >
                  <User size={16} />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="hover:text-yellow-500 text-white"
              >
                Login
              </Link>
            )}

            <Link
              to="/rooms"
              className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Book Button */}
          <div className="md:hidden flex-1 flex justify-end">
            <Link
              to="/rooms"
              className="px-4 py-2 bg-yellow-500 text-black rounded"
            >
              Book
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-yellow-500/20">
              <h2 className="text-2xl text-yellow-500 font-serif">
                Menu
              </h2>

              <button onClick={() => setIsOpen(false)}>
                <X className="w-8 h-8 text-white" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-8">
              {links.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`text-3xl font-serif ${
                      location.pathname === link.path
                        ? "text-yellow-500"
                        : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-10 flex flex-col gap-4 w-72">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="border border-yellow-500 py-3 text-center text-white hover:bg-yellow-500 hover:text-black transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="border border-red-500 py-3 text-center text-white hover:bg-red-500 hover:text-white transition cursor-pointer bg-transparent"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="border border-yellow-500 py-3 text-center text-white hover:bg-yellow-500 hover:text-black transition"
                  >
                    Sign In
                  </Link>
                )}

                <Link
                  to="/rooms"
                  className="bg-yellow-500 py-3 text-center text-black"
                >
                  Book Your Stay
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;