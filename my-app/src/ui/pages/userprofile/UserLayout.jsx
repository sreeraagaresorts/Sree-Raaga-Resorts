import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import {
  LayoutDashboard,
  User,
  Calendar,
  Heart,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", path: "/dashboard/bookings", icon: Calendar },
  { name: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
  // { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    toast.success("Signed out successfully!\nHave a wonderful day.");
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex text-[#0d2b4e] user-dashboard-wrapper">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 border-r border-[#0d2b4e]/10 hidden lg:flex flex-col bg-[#0d2b4e] h-screen fixed left-0 top-0 z-20">
        
        {/* BRANDING */}
        <div className="p-6">
          <Link to="/" className="block">
            <h1 className="text-2xl text-[#c8a64d] tracking-wide font-semibold">
              Sree Raaga
            </h1>
            <span className="text-[9px] tracking-[3px] uppercase text-white/50 block mt-0.5">
              Resorts
            </span>
          </Link>
          <p className="text-[10px] text-[#c8a64d] uppercase tracking-[2px] mt-4 font-light">Guest Portal</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition tracking-wider uppercase text-xs ${
                isActive(item.path)
                  ? "bg-[#c8a64d] text-white font-semibold shadow-md"
                  : "text-white/70 hover:text-[#c8a64d] hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-[#c8a64d] hover:bg-white/5 rounded transition cursor-pointer uppercase tracking-wider bg-transparent border-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer uppercase tracking-wider bg-transparent border-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0d2b4e] border-r border-white/5 z-50 lg:hidden flex flex-col min-h-screen"
            >
              {/* BRANDING / HEADER */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <Link to="/" className="block">
                  <h1 className="text-2xl text-[#c8a64d] tracking-wide font-semibold">
                    Sree Raaga
                  </h1>
                  <span className="text-[9px] tracking-[3px] uppercase text-white/50 block mt-0.5">
                    Resorts
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-[#c8a64d] transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* NAVIGATION */}
              <nav className="flex-1 px-4 space-y-1.5 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition tracking-wider uppercase text-[10px] ${
                      isActive(item.path)
                        ? "bg-[#c8a64d] text-white font-semibold shadow-md"
                        : "text-white/70 hover:text-[#c8a64d] hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* FOOTER */}
              <div className="border-t border-white/10 p-4 space-y-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-[#c8a64d] hover:bg-white/5 rounded transition cursor-pointer uppercase tracking-wider bg-transparent border-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Home
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer uppercase tracking-wider bg-transparent border-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64">
        
        {/* HEADER */}
        <header className="h-16 border-b border-[#0d2b4e]/10 flex items-center justify-between px-4 sm:px-6 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#0d2b4e] hover:text-[#c8a64d] p-1 rounded hover:bg-[#0d2b4e]/5 transition cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-[#0d2b4e]/70 tracking-wide font-light hidden sm:block">
              Welcome back, <span className="text-[#c8a64d] font-semibold">{user ? user.full_name : "Valued Guest"}</span>
            </div>
            <div className="text-sm text-[#0d2b4e]/70 tracking-wide font-light sm:hidden">
              Welcome, <span className="text-[#c8a64d] font-semibold">{user ? user.full_name.split(" ")[0] : "Guest"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard/profile"
              className="w-9 h-9 rounded-full bg-[#c8a64d] text-white flex items-center justify-center font-bold text-sm hover:bg-[#b09141] transition"
              title="View Profile"
            >
              {user ? user.full_name.charAt(0).toUpperCase() : "G"}
            </Link>
          </div>
        </header>

        {/* PAGE OUTLET */}
        <div className="p-4 sm:p-6 flex-1 bg-[#f5f6fa] overflow-y-auto">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default UserLayout;