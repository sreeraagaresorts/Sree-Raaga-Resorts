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
  CreditCard,
  UtensilsCrossed,
  Menu,
  X,
  MessageSquare,
  ShoppingBag,
  ChevronDown,
  Ticket,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: Calendar },
      { name: "Billing & Payments", path: "/admin/billing", icon: CreditCard },
    { name: "Rooms Management", path: "/admin/rooms-mgmt", icon: BedDouble },

  { name: "Guests", path: "/admin/users", icon: Users },
  { name: "Manage Hotel", path: "/admin/hotel-mgmt", icon: CalendarDays },
  { name: "Restaurant Menu", path: "/admin/menu", icon: UtensilsCrossed },
  { name: "Enquiries",         path: "/admin/enquiries",  icon: MessageSquare },
  { name: "Discounts & Coupons",path: "/admin/discounts",  icon: Ticket },
  { name: "Add-On Features",           path: "/admin/settings",  icon: Settings },
];

const  AdminLayout=()=> {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [adminUser, setAdminUser] = React.useState(null);
  const [popNotifications, setPopNotifications] = React.useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isHotelMgmtOpen, setIsHotelMgmtOpen] = React.useState(true);
  const [unreadCounts, setUnreadCounts] = React.useState({
    "/admin/bookings": 0,
    "/admin/menu": 0,
    "/admin/enquiries": 0,
  });

  const seenBookings = React.useRef(new Set());
  const seenOrders = React.useRef(new Set());
  const seenMessages = React.useRef(new Set());
  const seenEventEnquiries = React.useRef(new Set());

  const [notifications, setNotifications] = React.useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);


  const clearAllNotifs = () => {
    try {
      const clearedIds = JSON.parse(localStorage.getItem("clearedNotificationIds") || "[]");
      notifications.forEach((n) => {
        if (!clearedIds.includes(n.id)) {
          clearedIds.push(n.id);
        }
      });
      localStorage.setItem("clearedNotificationIds", JSON.stringify(clearedIds));
    } catch (err) {
      console.warn("Failed to clear notifications in localStorage:", err);
    }
    setNotifications([]);
  };

  const handleNotifClick = (n) => {
    setNotifications((prev) => prev.filter((item) => item.id !== n.id));
    setIsNotifDropdownOpen(false);

    // Save read state to localStorage
    try {
      const readIds = JSON.parse(localStorage.getItem("readNotificationIds") || "[]");
      if (!readIds.includes(n.id)) {
        readIds.push(n.id);
        localStorage.setItem("readNotificationIds", JSON.stringify(readIds));
      }
    } catch (err) {
      console.warn("Failed to save read state to localStorage:", err);
    }

    if (n.path) {
      navigate(n.path);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-3.5 h-3.5" />;
      case "order":
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case "content":
      case "event-enquiry":
        return <MessageSquare className="w-3.5 h-3.5" />;
      default:
        return <Bell className="w-3.5 h-3.5" />;
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/device_disconnect.mp3");
      audio.play();
    } catch (err) {
      console.warn("Failed to play notification sound from public folder:", err);
    }
  };

  const triggerPopLeft = (title, message, icon) => {
    playNotificationSound();
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

    const seedInitialNotifications = async () => {
      try {
        const readNotifIds = new Set(JSON.parse(localStorage.getItem("readNotificationIds") || "[]"));
        const clearedNotifIds = new Set(JSON.parse(localStorage.getItem("clearedNotificationIds") || "[]"));
        const initialNotifs = [];
        let pendingBookingsCount = 0;
        let pendingOrdersCount = 0;
        let unreadEnquiriesCount = 0;

        // Bookings
        const resB = await fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataB = await resB.json();
        if (dataB.success && dataB.data) {
          dataB.data.forEach((b) => {
            seenBookings.current.add(b.id);
            if (b.is_manual) return;
            if (b.status === "pending") {
              pendingBookingsCount++;
            }
            const notifId = `b-${b.id}`;
            if (!clearedNotifIds.has(notifId)) {
              initialNotifs.push({
                id: notifId,
                title: `${b.status.charAt(0).toUpperCase() + b.status.slice(1)} Booking`,
                message: `Booking #${b.id} for ${b.guest_name || "Guest"} is ${b.status}.`,
                time: new Date(b.created_at || Date.now()).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                read: readNotifIds.has(notifId),
                type: "booking",
                path: "/admin/bookings"
              });
            }
          });
        }

        // Orders
        const resO = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataO = await resO.json();
        if (dataO.success && dataO.data) {
          dataO.data.forEach((o) => {
            seenOrders.current.add(o.id);
            if (o.status === "pending" || o.status === "preparing") {
              pendingOrdersCount++;
              const notifId = `o-${o.id}`;
              if (!clearedNotifIds.has(notifId)) {
                initialNotifs.push({
                  id: notifId,
                  title: "Active Food Order",
                  message: `Order #${o.id} for ${o.dishName} in Room ${o.roomNumber}.`,
                  time: new Date(o.created_at || Date.now()).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                  read: readNotifIds.has(notifId),
                  type: "order",
                  path: "/admin/menu"
                });
              }
            }
          });
        }

        // Contact messages
        const resM = await fetch(`${API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataM = await resM.json();
        if (dataM.success && dataM.data) {
          dataM.data.forEach((m) => {
            seenMessages.current.add(m.id);
            if (m.status !== "Read") {
              unreadEnquiriesCount++;
              const notifId = `m-${m.id}`;
              if (!clearedNotifIds.has(notifId)) {
                initialNotifs.push({
                  id: notifId,
                  title: "Contact Inquiry",
                  message: `Message from "${m.name}": "${m.subject}".`,
                  time: new Date(m.created_at || Date.now()).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                  read: readNotifIds.has(notifId),
                  type: "content",
                  path: "/admin/enquiries?tab=contact"
                });
              }
            }
          });
        }

        // Event enquiries
        const resEE = await fetch(`${API_URL}/api/events/enquiries/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataEE = await resEE.json();
        if (dataEE.success && dataEE.data) {
          dataEE.data.forEach((ee) => {
            seenEventEnquiries.current.add(ee.id || ee._id);
            if (ee.status !== "Read") {
              unreadEnquiriesCount++;
              const notifId = `ee-${ee.id || ee._id}`;
              if (!clearedNotifIds.has(notifId)) {
                initialNotifs.push({
                  id: notifId,
                  title: "Event Enquiry",
                  message: `Enquiry from "${ee.name}" for "${ee.eventName}".`,
                  time: new Date(ee.created_at || Date.now()).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                  read: readNotifIds.has(notifId),
                  type: "event-enquiry",
                  path: "/admin/enquiries?tab=event"
                });
              }
            }
          });
        }

        initialNotifs.sort((x, y) => y.id.localeCompare(x.id));
        setNotifications((prev) => {
          const cleared = new Set(JSON.parse(localStorage.getItem("clearedNotificationIds") || "[]"));
          const existingIds = new Set(prev.map((n) => n.id));
          const newOnes = initialNotifs.filter((n) => !existingIds.has(n.id) && !cleared.has(n.id));
          const merged = [...newOnes, ...prev].filter((n) => !cleared.has(n.id));
          return merged.slice(0, 20);
        });

        // Seed initial unread counts if we are not currently active on those pages
        setUnreadCounts((prev) => {
          const isBookingsActive = location.pathname === "/admin/bookings" || location.pathname.startsWith("/admin/bookings/");
          const isMenuActive = location.pathname === "/admin/menu" || location.pathname.startsWith("/admin/menu/");
          const isEnquiriesActive = location.pathname === "/admin/enquiries" || location.pathname.startsWith("/admin/enquiries/");
          return {
            ...prev,
            "/admin/bookings": isBookingsActive ? 0 : pendingBookingsCount,
            "/admin/menu": isMenuActive ? 0 : pendingOrdersCount,
            "/admin/enquiries": isEnquiriesActive ? 0 : unreadEnquiriesCount
          };
        });
      } catch (err) {
        console.warn("Failed to seed initial notifications baseline:", err);
      }
    };

    const pollNewRequests = async () => {
      if (!isMounted) return;
      try {
        const clearedNotifIds = new Set(JSON.parse(localStorage.getItem("clearedNotificationIds") || "[]"));
        let pendingBookingsCount = 0;
        let pendingOrdersCount = 0;
        let unreadEnquiriesCount = 0;

        // Bookings
        const resB = await fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataB = await resB.json();
        if (dataB.success && dataB.data) {
          dataB.data.forEach((b) => {
            if (b.is_manual) {
              seenBookings.current.add(b.id);
              return;
            }
            if (b.status === "pending") {
              pendingBookingsCount++;
            }
            if (!seenBookings.current.has(b.id)) {
              seenBookings.current.add(b.id);
              if (!clearedNotifIds.has(`b-${b.id}`)) {
                triggerPopLeft(
                  "New Booking Request",
                  `Guest "${b.guest_name || "Guest"}" booked Room "${b.room_name}" (Status: ${b.status}).`,
                  React.createElement(Calendar, { className: "w-5 h-5" })
                );

                setNotifications((prev) => [
                  {
                    id: `b-${b.id}`,
                    title: "New Booking Request",
                    message: `Guest "${b.guest_name || "Guest"}" booked Room "${b.room_name}" (Status: ${b.status}).`,
                    time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    type: "booking",
                    path: "/admin/bookings"
                  },
                  ...prev
                ].slice(0, 20));
              }
            }
          });
        }

        // Food Orders
        const resO = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataO = await resO.json();
        const nonActiveOrderIds = new Set();
        if (dataO.success && dataO.data) {
          dataO.data.forEach((o) => {
            if (o.status === "pending" || o.status === "preparing") {
              pendingOrdersCount++;
            } else {
              nonActiveOrderIds.add(`o-${o.id}`);
            }
            if (!seenOrders.current.has(o.id)) {
              seenOrders.current.add(o.id);
              if ((o.status === "pending" || o.status === "preparing") && !clearedNotifIds.has(`o-${o.id}`)) {
                triggerPopLeft(
                  "New Food Order",
                  `Room ${o.roomNumber} (${o.guestName}) ordered ${o.quantity}x "${o.dishName}".`,
                  React.createElement(UtensilsCrossed, { className: "w-5 h-5" })
                );

                setNotifications((prev) => [
                  {
                    id: `o-${o.id}`,
                    title: "New Food Order",
                    message: `Room ${o.roomNumber} (${o.guestName}) ordered ${o.quantity}x "${o.dishName}".`,
                    time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    type: "order",
                    path: "/admin/menu"
                  },
                  ...prev
                ].slice(0, 20));
              }
            }
          });
        }

        // Contact Messages
        const resM = await fetch(`${API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataM = await resM.json();
        const readMessageIds = new Set();
        if (dataM.success && dataM.data) {
          dataM.data.forEach((m) => {
            if (m.status !== "Read") {
              unreadEnquiriesCount++;
            } else {
              readMessageIds.add(`m-${m.id}`);
            }
            if (!seenMessages.current.has(m.id)) {
              seenMessages.current.add(m.id);
              if (m.status !== "Read" && !clearedNotifIds.has(`m-${m.id}`)) {
                triggerPopLeft(
                  "New Message",
                  `Message from "${m.name}": "${m.subject}".`,
                  React.createElement(Bell, { className: "w-5 h-5" })
                );

                setNotifications((prev) => [
                  {
                    id: `m-${m.id}`,
                    title: "New Message",
                    message: `Message from "${m.name}": "${m.subject}".`,
                    time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    type: "content",
                    path: "/admin/enquiries?tab=contact"
                  },
                  ...prev
                ].slice(0, 20));
              }
            }
          });
        }

        // Event enquiries
        const resEE = await fetch(`${API_URL}/api/events/enquiries/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataEE = await resEE.json();
        const readEventEnquiryIds = new Set();
        if (dataEE.success && dataEE.data) {
          dataEE.data.forEach((ee) => {
            if (ee.status !== "Read") {
              unreadEnquiriesCount++;
            } else {
              readEventEnquiryIds.add(`ee-${ee.id || ee._id}`);
            }
            const key = ee.id || ee._id;
            if (!seenEventEnquiries.current.has(key)) {
              seenEventEnquiries.current.add(key);
              const notifId = `ee-${key}`;
              if (ee.status !== "Read" && !clearedNotifIds.has(notifId)) {
                triggerPopLeft(
                  "New Event Enquiry",
                  `Enquiry from "${ee.name}" for package "${ee.eventName}".`,
                  React.createElement(MessageSquare, { className: "w-5 h-5" })
                );

                setNotifications((prev) => [
                  {
                    id: notifId,
                    title: "New Event Enquiry",
                    message: `Enquiry from "${ee.name}" for package "${ee.eventName}".`,
                    time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    type: "event-enquiry",
                    path: "/admin/enquiries?tab=event"
                  },
                  ...prev
                ].slice(0, 20));
              }
            }
          });
        }

        // Auto remove notifications that are no longer active/pending/unread
        setNotifications((prev) =>
          prev.filter((n) => {
            if (nonActiveOrderIds.has(n.id)) return false;
            if (readMessageIds.has(n.id)) return false;
            if (readEventEnquiryIds.has(n.id)) return false;
            return true;
          })
        );

        // Update counts
        setUnreadCounts((prev) => {
          const isBookingsActive = location.pathname === "/admin/bookings" || location.pathname.startsWith("/admin/bookings/");
          const isMenuActive = location.pathname === "/admin/menu" || location.pathname.startsWith("/admin/menu/");
          const isEnquiriesActive = location.pathname === "/admin/enquiries" || location.pathname.startsWith("/admin/enquiries/");
          return {
            ...prev,
            "/admin/bookings": isBookingsActive ? 0 : pendingBookingsCount,
            "/admin/menu": isMenuActive ? 0 : pendingOrdersCount,
            "/admin/enquiries": isEnquiriesActive ? 0 : unreadEnquiriesCount
          };
        });
      } catch (err) {
        console.warn("Notification polling check failed:", err.message);
      }
    };

    seedInitialNotifications().then(() => {
      const interval = setInterval(pollNewRequests, 5000);
      return () => clearInterval(interval);
    });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  React.useEffect(() => {
    const handleInquiryMarkedRead = (e) => {
      const { id } = e.detail;
      setNotifications((prev) => prev.filter((n) => n.id !== `m-${id}`));
      setUnreadCounts((prev) => ({
        ...prev,
        "/admin/enquiries": Math.max(0, prev["/admin/enquiries"] - 1)
      }));
    };

    const handleEventEnquiryMarkedRead = (e) => {
      const { id } = e.detail;
      setNotifications((prev) => prev.filter((n) => n.id !== `ee-${id}`));
      setUnreadCounts((prev) => ({
        ...prev,
        "/admin/enquiries": Math.max(0, prev["/admin/enquiries"] - 1)
      }));
    };

    const handleInquiryDeleted = (e) => {
      const { id } = e.detail;
      setNotifications((prev) => prev.filter((n) => n.id !== `m-${id}`));
    };

    const handleEventEnquiryDeleted = (e) => {
      const { id } = e.detail;
      setNotifications((prev) => prev.filter((n) => n.id !== `ee-${id}`));
    };

    window.addEventListener("inquiryMarkedRead", handleInquiryMarkedRead);
    window.addEventListener("eventEnquiryMarkedRead", handleEventEnquiryMarkedRead);
    window.addEventListener("inquiryDeleted", handleInquiryDeleted);
    window.addEventListener("eventEnquiryDeleted", handleEventEnquiryDeleted);

    return () => {
      window.removeEventListener("inquiryMarkedRead", handleInquiryMarkedRead);
      window.removeEventListener("eventEnquiryMarkedRead", handleEventEnquiryMarkedRead);
      window.removeEventListener("inquiryDeleted", handleInquiryDeleted);
      window.removeEventListener("eventEnquiryDeleted", handleEventEnquiryDeleted);
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
  <img
    src="/logo.png"
    alt="Sree Raaga Resorts"
    className="h-12 w-auto object-contain"
  />
  <p className="text-xs text-white/40 mt-2">Admin Panel</p>
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
  <img
    src="/logo.png"
    alt="Sree Raaga Resorts"
    className="h-18 w-auto object-contain"
  />
  <p className="text-xs text-white/40 mt-2">Admin Panel</p>
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

          <div className="flex items-center gap-3 relative" ref={dropdownRef}>

            <button 
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className={`p-3 mt-2 rounded-full transition relative ${isNotifDropdownOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-[#C8A64D] hover:text-white "} cursor-pointer`}
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0 aspect-square"></span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#081A2F] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden text-sm">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#071524]">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#C8A64D]" /> Notifications
                  </h3>

                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-xs">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotifClick(n)}
                        className={`p-3 flex gap-3 hover:bg-white/2 transition cursor-pointer ${n.read ? "opacity-60" : "bg-white/2"}`}
                      >
                        <div className="mt-0.5 text-[#C8A64D]">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-semibold text-xs text-white truncate">{n.title}</span>
                            <span className="text-[9px] text-white/40 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-0.5 line-clamp-2 leading-snug">{n.message}</p>
                        </div>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full self-center shrink-0 aspect-square"></span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-white/5 text-center bg-[#071524]">
                    <button 
                      onClick={clearAllNotifs}
                      className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold tracking-wider cursor-pointer bg-transparent border-0"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}

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