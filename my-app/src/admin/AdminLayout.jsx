import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  CalendarDays,
  Users,
  Edit3,
  Settings,
  LogOut,
  Bell,
  Sun,
  CreditCard,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Billing & Payments", path: "/admin/billing", icon: CreditCard },
  { name: "Guests", path: "/admin/users", icon: Users },
  { name: "Rooms & Bookings", path: "/admin/bookings", icon: Calendar },
  { name: "Room Inventory", path: "/admin/rooms", icon: BedDouble },
  { name: "Events & Activities", path: "/admin/events", icon: CalendarDays },
  { name: "CMS", path: "/admin/content", icon: Edit3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const  AdminLayout=()=> {
  const location = useLocation();
  const [adminUser, setAdminUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        setAdminUser(null);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/admin" && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#071524] flex text-white font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 hidden md:flex flex-col bg-[#071524] min-h-screen sticky top-0">

        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Sree</span>
            <span className="text-[#C8A64D]">Raaga</span>
          </h2>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition ${
                isActive(item.path)
                  ? "bg-[#C8A64D] text-[#071524] font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/5 p-4 space-y-3">

          <div className="flex items-center gap-3 bg-[#081A2F] p-3 rounded-lg">
            <div className="w-8 h-8 bg-[#C8A64D] text-[#071524] flex items-center justify-center rounded-full font-bold">
              {adminUser ? adminUser.full_name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">{adminUser ? adminUser.full_name : "Admin User"}</div>
              <div className="text-[10px] text-white/40 uppercase truncate">
                {adminUser ? adminUser.email : "Administrator"}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-md cursor-pointer bg-transparent border-0"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#071524] sticky top-0">

          <div className="text-sm text-white/60">
            Welcome to{" "}
            <span className="text-[#C8A64D] font-medium">Admin Panel</span>
          </div>

          <div className="flex items-center gap-3">

            <button className="p-2 rounded-full hover:bg-white/5">
              <Sun className="w-4 h-4 text-white/40" />
            </button>

            <button className="p-2 rounded-full hover:bg-white/5 relative">
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;