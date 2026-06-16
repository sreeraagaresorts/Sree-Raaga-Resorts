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
} from "lucide-react";

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
    <div className="min-h-screen bg-black flex text-white font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-yellow-500/10 hidden md:flex flex-col bg-zinc-950 min-h-screen sticky top-0">
        
        {/* BRANDING */}
        <div className="p-6">
          <Link to="/" className="block">
            <h1 className="text-2xl font-serif text-yellow-500 tracking-wide">
              Sree Raaga
            </h1>
            <span className="text-[9px] tracking-[3px] uppercase text-white/60 block mt-0.5">
              Resorts
            </span>
          </Link>
          <p className="text-[10px] text-yellow-500/60 uppercase tracking-[2px] mt-4 font-light">Guest Portal</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition tracking-wider uppercase text-xs ${
                isActive(item.path)
                  ? "bg-yellow-500 text-black font-semibold shadow-lg"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-zinc-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-yellow-500/10 p-4 space-y-2">
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-yellow-500 hover:bg-zinc-900 rounded transition cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 border-b border-yellow-500/10 flex items-center justify-between px-6 bg-zinc-950 sticky top-0 z-30">
          <div className="text-sm text-gray-400 tracking-wide font-light">
            Welcome back, <span className="text-yellow-500 font-medium">{user ? user.full_name : "Valued Guest"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard/profile"
              className="w-9 h-9 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm hover:bg-yellow-400 transition"
              title="View Profile"
            >
              {user ? user.full_name.charAt(0).toUpperCase() : "G"}
            </Link>
          </div>
        </header>

        {/* PAGE OUTLET */}
        <div className="p-6 flex-1 bg-black overflow-y-auto">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default UserLayout;