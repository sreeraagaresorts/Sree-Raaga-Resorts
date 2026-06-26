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
  { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "My Bookings", path: "/dashboard/bookings", icon: Calendar },
  { name: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
  { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
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
    <div className="min-h-screen bg-[#fdfeff] flex text-[#0d2b4e] ">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 border-r border-gray-200/50 hidden lg:flex flex-col bg-white min-h-screen sticky top-0">
        
        {/* BRANDING */}
        <div className="p-6">
          <Link to="/" className="block">
            <h1 className="text-2xl  text-[#c8a64d] tracking-wide">
              Sree Raaga
            </h1>
            <span className="text-[9px] tracking-[3px] uppercase text-gray-500 block mt-0.5">
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
                  : "text-gray-500 hover:text-[#c8a64d] hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-gray-200/50 p-4 space-y-2">
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:text-[#c8a64d] hover:bg-gray-50 rounded transition cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50/10 rounded transition cursor-pointer uppercase tracking-wider"
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
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200/50 z-50 lg:hidden flex flex-col min-h-screen"
            >
              {/* BRANDING / HEADER */}
              <div className="p-6 flex items-center justify-between border-b border-gray-200/50">
                <Link to="/" className="block">
                  <h1 className="text-2xl  text-[#c8a64d] tracking-wide">
                    Sree Raaga
                  </h1>
                  <span className="text-[9px] tracking-[3px] uppercase text-gray-500 block mt-0.5">
                    Resorts
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#0d2b4e] hover:text-[#c8a64d]"
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
                        : "text-gray-400 hover:text-[#c8a64d] hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* FOOTER */}
              <div className="border-t border-gray-200/50 p-4 space-y-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:text-[#c8a64d] hover:bg-gray-50 rounded transition cursor-pointer uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Home
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50/10 rounded transition cursor-pointer uppercase tracking-wider"
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
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-6 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#0d2b4e] hover:text-[#c8a64d] p-1 rounded hover:bg-gray-100 transition"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-gray-500 tracking-wide font-light hidden sm:block">
              Welcome back, <span className="text-[#c8a64d] font-medium">{user ? user.full_name : "Valued Guest"}</span>
            </div>
            <div className="text-sm text-gray-500 tracking-wide font-light sm:hidden">
              Welcome, <span className="text-[#c8a64d] font-medium">{user ? user.full_name.split(" ")[0] : "Guest"}</span>
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
        <div className="p-4 sm:p-6 flex-1 bg-[#fdfeff] overflow-y-auto">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default UserLayout;