import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { motion, AnimatePresence } from "motion/react";
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
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Billing & Payments", path: "/admin/billing", icon: CreditCard },
  { name: "Guests", path: "/admin/users", icon: Users },
  { name: "Rooms & Bookings", path: "/admin/bookings", icon: Calendar },
  { name: "Room Inventory", path: "/admin/rooms", icon: BedDouble },
  { name: "Restaurant Menu", path: "/admin/menu", icon: UtensilsCrossed },
  { name: "Events & Packages", path: "/admin/events", icon: CalendarDays },
  { name: "CMS", path: "/admin/content", icon: Edit3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const  AdminLayout=()=> {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [adminUser, setAdminUser] = React.useState(null);
  const [popNotifications, setPopNotifications] = React.useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [unreadCounts, setUnreadCounts] = React.useState({
    "/admin/bookings": 0,
    "/admin/menu": 0,
    "/admin/content": 0,
  });

  const seenBookings = React.useRef(new Set());
  const seenOrders = React.useRef(new Set());
  const seenMessages = React.useRef(new Set());

  const triggerPopLeft = (title, message, icon) => {
    const id = Date.now().toString() + Math.random().toString();
    setPopNotifications((prev) => [...prev, { id, title, message, icon }]);
    setTimeout(() => {
      setPopNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };

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

  React.useEffect(() => {
    const activePath = Object.keys(unreadCounts).find(
      (path) =>
        location.pathname === path ||
        (path !== "/admin" && location.pathname.startsWith(path))
    );
    if (activePath) {
      setUnreadCounts((prev) => {
        if (prev[activePath] === 0) return prev;
        return {
          ...prev,
          [activePath]: 0,
        };
      });
    }
  }, [location.pathname]);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;

    const fetchInitialBaselines = async () => {
      try {
        // Bookings
        const resB = await fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataB = await resB.json();
        let pendingBookingsCount = 0;
        if (dataB.success && dataB.data) {
          dataB.data.forEach((b) => {
            seenBookings.current.add(b.id);
            if (b.status === "pending") pendingBookingsCount++;
          });
        }

        // Orders
        const resO = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataO = await resO.json();
        let pendingOrdersCount = 0;
        if (dataO.success && dataO.data) {
          dataO.data.forEach((o) => {
            seenOrders.current.add(o.id);
            if (o.status === "pending" || o.status === "preparing") pendingOrdersCount++;
          });
        }

        // Contact messages
        const resM = await fetch(`${API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataM = await resM.json();
        if (dataM.success && dataM.data) {
          dataM.data.forEach((m) => seenMessages.current.add(m.id));
        }

        // Seed initial unread counts if we are not currently active on those pages
        setUnreadCounts((prev) => {
          const isBookingsActive = location.pathname === "/admin/bookings" || location.pathname.startsWith("/admin/bookings/");
          const isMenuActive = location.pathname === "/admin/menu" || location.pathname.startsWith("/admin/menu/");
          return {
            ...prev,
            "/admin/bookings": isBookingsActive ? 0 : pendingBookingsCount,
            "/admin/menu": isMenuActive ? 0 : pendingOrdersCount
          };
        });
      } catch (err) {
        console.warn("Failed to seed initial notifications baseline:", err);
      }
    };

    const pollNewRequests = async () => {
      if (!isMounted) return;
      try {
        // Bookings
        const resB = await fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataB = await resB.json();
        if (dataB.success && dataB.data) {
          dataB.data.forEach((b) => {
            if (!seenBookings.current.has(b.id)) {
              seenBookings.current.add(b.id);
              triggerPopLeft(
                "New Booking Request",
                `Guest "${b.guest_name || "Guest"}" requested Room "${b.room_name}" (Total: ₹${b.total_price}).`,
                React.createElement(Calendar, { className: "w-5 h-5" })
              );

              // Increment unread bookings count if not currently viewed
              const isBookingsActive = location.pathname === "/admin/bookings" || location.pathname.startsWith("/admin/bookings/");
              if (!isBookingsActive) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  "/admin/bookings": prev["/admin/bookings"] + 1,
                }));
              }
            }
          });
        }

        // Food Orders
        const resO = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataO = await resO.json();
        if (dataO.success && dataO.data) {
          dataO.data.forEach((o) => {
            if (!seenOrders.current.has(o.id)) {
              seenOrders.current.add(o.id);
              triggerPopLeft(
                "New Food Order",
                `Room ${o.roomNumber} (${o.guestName}) ordered ${o.quantity}x "${o.dishName}".`,
                React.createElement(UtensilsCrossed, { className: "w-5 h-5" })
              );

              // Increment unread menu orders count if not currently viewed
              const isMenuActive = location.pathname === "/admin/menu" || location.pathname.startsWith("/admin/menu/");
              if (!isMenuActive) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  "/admin/menu": prev["/admin/menu"] + 1,
                }));
              }
            }
          });
        }

        // Contact Messages
        const resM = await fetch(`${API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataM = await resM.json();
        if (dataM.success && dataM.data) {
          dataM.data.forEach((m) => {
            if (!seenMessages.current.has(m.id)) {
              seenMessages.current.add(m.id);
              triggerPopLeft(
                "New CMS Message",
                `Message from "${m.name}": "${m.subject}".`,
                React.createElement(Bell, { className: "w-5 h-5" })
              );

              // Increment unread CMS messages count if not currently viewed
              const isContentActive = location.pathname === "/admin/content" || location.pathname.startsWith("/admin/content/");
              if (!isContentActive) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  "/admin/content": prev["/admin/content"] + 1,
                }));
              }
            }
          });
        }
      } catch (err) {
        console.warn("Notification polling check failed:", err.message);
      }
    };

    fetchInitialBaselines().then(() => {
      const interval = setInterval(pollNewRequests, 5000);
      return () => clearInterval(interval);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out successfully!\nHave a productive day.");
    navigate("/admin/login");
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/admin" && location.pathname.startsWith(path));

  return (
    <div className="h-screen bg-[#071524] flex text-white overflow-hidden admin-portal-wrapper">

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
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-64 bg-[#071524] border-r border-white/5 z-50 md:hidden flex flex-col h-screen"
            >
              {/* BRANDING / HEADER */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-[#C8A64D]">Sree</span>
                    <span className="text-[#C8A64D]">Raaga</span>
                    <span className="text-[#C8A64D]">Resorts</span>
                  </h2>
                  <p className="text-xs text-white/40 mt-1">Admin Panel</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#C8A64D]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* NAVIGATION */}
              <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-md text-sm transition ${
                      isActive(item.path)
                        ? "bg-[#C8A64D] text-[#071524] font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {unreadCounts[item.path] > 0 && (
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition duration-300 ${
                        isActive(item.path)
                          ? "bg-[#071524] text-[#C8A64D]"
                          : "bg-red-500 text-white"
                      }`}>
                        {unreadCounts[item.path]}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 hidden md:flex flex-col bg-[#071524] h-screen sticky top-0 flex-shrink-0">

        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#C8A64D]">Sree</span>
            <span className="text-[#C8A64D]">Raaga</span>
            <span className="text-[#C8A64D]">Resorts</span>
          </h2>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-md text-sm transition ${
                isActive(item.path)
                  ? "bg-[#C8A64D] text-[#071524] font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {unreadCounts[item.path] > 0 && (
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition duration-300 ${
                  isActive(item.path)
                    ? "bg-[#071524] text-[#C8A64D]"
                    : "bg-red-500 text-white animate-pulse"
                }`}>
                  {unreadCounts[item.path]}
                </span>
              )}
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
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#071524] sticky top-0 z-30">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-[#C8A64D] p-1 rounded hover:bg-white/5 transition"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-white/60">
              Welcome to{" "}
              <span className="text-[#C8A64D] font-medium">Admin Panel</span>
            </div>
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
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* POP RIGHT TOP NOTIFICATIONS */}
      <div className="fixed top-20 right-6 z-[999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {popNotifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto bg-[#C8A64D] text-[#071524] border-r-4 border-[#071524] p-4 rounded-l-lg shadow-2xl flex gap-3 items-start animate-slide-in-right transition duration-300 transform"
          >
            <div className="text-[#071524] mt-0.5">{n.icon}</div>
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#071524]">{n.title}</h4>
              <p className="text-[#071524]/90 text-xs mt-1 leading-relaxed font-semibold">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;