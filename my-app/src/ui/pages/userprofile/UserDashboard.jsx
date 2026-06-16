import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Heart,
  Bell,
  User,
  ArrowRight,
  Shield,
  Coffee,
  MapPin,
  RefreshCw,
  Clock,
  Settings,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../config/api";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "checked_in").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-yellow-500" />
        <span className="font-light tracking-wider">Loading dashboard summary...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-white">
      
      {/* WELCOME HERO */}
      <div className="bg-zinc-950 border border-yellow-500/20 p-8 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative">
        <div className="space-y-2">
          <span className="text-yellow-500 text-[10px] uppercase tracking-[4px] font-medium block">Guest Privileges</span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-white">
            Welcome Back, <span className="italic text-yellow-500 font-normal">{user ? user.full_name : "Guest"}</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl font-light leading-relaxed">
            Welcome to your personal sanctuary. Manage your premium resort stays, coordinate upcoming events, and access exclusive member amenities.
          </p>
        </div>

        <Link
          to="/rooms"
          className="bg-yellow-500 text-black px-6 py-3 rounded-none font-semibold uppercase tracking-widest text-xs hover:bg-yellow-400 transition w-fit shrink-0"
        >
          Book Your Stay
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-zinc-950 p-6 rounded-none border border-yellow-500/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Total Stays</p>
            <h2 className="text-white text-3xl font-light mt-1 font-serif">{bookings.length}</h2>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-none flex items-center justify-center border border-yellow-500/20">
            <Calendar className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-none border border-yellow-500/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Active Bookings</p>
            <h2 className="text-white text-3xl font-light mt-1 font-serif">{activeBookings}</h2>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-none flex items-center justify-center border border-yellow-500/20">
            <Shield className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-none border border-yellow-500/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Pending Approvals</p>
            <h2 className="text-white text-3xl font-light mt-1 font-serif">{pendingBookings}</h2>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-none flex items-center justify-center border border-yellow-500/20">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-none border border-yellow-500/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Saved Rooms</p>
            <h2 className="text-white text-3xl font-light mt-1 font-serif">1</h2>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-none flex items-center justify-center border border-yellow-500/20">
            <Heart className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PRIVILEGES SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-yellow-500/10 p-6 rounded-none space-y-6">
            <h3 className="text-xl font-serif font-light text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-yellow-500 inline-block"></span> Guest Privileges & Amenities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-5 rounded-none border border-yellow-500/10 flex gap-4 items-start">
                <Coffee className="text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-yellow-500 tracking-wide uppercase text-xs">Complimentary Breakfast</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">Every premium suite reservation includes a gourmet buffet breakfast curated by our executive culinary team.</p>
                </div>
              </div>

              <div className="bg-zinc-900 p-5 rounded-none border border-yellow-500/10 flex gap-4 items-start">
                <MapPin className="text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-yellow-500 tracking-wide uppercase text-xs">Airport Shuttle Pickup</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">Arrange direct airport transport to/from Kochi International Airport. Coordinate shuttle times via profile settings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="bg-zinc-950 border border-yellow-500/10 p-6 rounded-none">
            <h3 className="text-xl font-serif font-light text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-yellow-500 inline-block"></span> Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/dashboard/profile" className="p-5 bg-zinc-900 border border-yellow-500/10 rounded-none text-center hover:border-yellow-500/40 transition group">
                <User className="mx-auto text-yellow-500 mb-2 group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-300 block">Edit Profile</span>
              </Link>

              <Link to="/dashboard/bookings" className="p-5 bg-zinc-900 border border-yellow-500/10 rounded-none text-center hover:border-yellow-500/40 transition group">
                <Calendar className="mx-auto text-yellow-500 mb-2 group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-300 block">My Stays</span>
              </Link>

              <Link to="/dashboard/notifications" className="p-5 bg-zinc-900 border border-yellow-500/10 rounded-none text-center hover:border-yellow-500/40 transition group">
                <Bell className="mx-auto text-yellow-500 mb-2 group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-300 block">Alerts</span>
              </Link>

              <Link to="/dashboard/settings" className="p-5 bg-zinc-900 border border-yellow-500/10 rounded-none text-center hover:border-yellow-500/40 transition group">
                <Settings className="mx-auto text-yellow-500 mb-2 group-hover:scale-110 transition" />
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-300 block">Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY */}
        <div className="bg-zinc-950 border border-yellow-500/10 p-6 rounded-none flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-light text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-yellow-500 inline-block"></span> Recent Stays
            </h3>
            
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="p-4 bg-zinc-900 rounded-none border border-yellow-500/10 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white truncate max-w-[120px] tracking-wide">{b.room_name}</h4>
                    <p className="text-gray-400 font-light">{new Date(b.check_in).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-yellow-500 block">₹{parseFloat(b.total_price).toLocaleString()}</span>
                    <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border ${
                      b.status === "confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      b.status === "checked_in" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      b.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-light text-sm">
                  You have no recent booking activities.
                </div>
              )}
            </div>
          </div>

          {bookings.length > 0 && (
            <Link to="/dashboard/bookings" className="text-xs text-yellow-500 hover:text-yellow-400 hover:underline flex items-center justify-center gap-1 mt-6 font-semibold uppercase tracking-wider">
              View All Bookings <ArrowRight size={12} />
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};

export default UserDashboard;