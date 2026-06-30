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
      <div className="flex items-center gap-2 text-[#0d2b4e]/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-[#c8a64d]" />
        <span className="font-light tracking-wider">Loading dashboard summary...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-[#0d2b4e]">
      
      {/* WELCOME HERO */}
      <div className="bg-white border border-[#0d2b4e]/10 p-8 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative">
        <div className="space-y-2">
          <span className="text-[#c8a64d] text-[14px] uppercase tracking-[2px] font-medium block">Guest Privileges</span>
          <h1 className="text-3xl md:text-4xl  font-bold text-[#0d2b4e]">
            Welcome Back, <span className="italic text-[#c8a64d] font-normal">{user ? user.full_name : "Guest"}</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl font-medium leading-relaxed">
            Welcome to your personal sanctuary. Manage your premium resort stays, coordinate upcoming events, and access exclusive member amenities.
          </p>
        </div>

        <Link
          to="/rooms"
          className="bg-[#c8a64d] text-white px-6 py-3 rounded-none font-semibold uppercase tracking-widest text-xs hover:bg-[#b09141] transition w-fit shrink-0 shadow-sm"
        >
          Book Your Stay
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-none border border-gray-200/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Total Stays</p>
            <h2 className="text-[#0d2b4e] text-3xl font-light mt-1 ">{bookings.length}</h2>
          </div>
          <div className="w-10 h-10 bg-[#fdfeff] rounded-none flex items-center justify-center border border-[#c8a64d]/20">
            <Calendar className="w-5 h-5 text-[#c8a64d]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-none border border-gray-200/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Active Bookings</p>
            <h2 className="text-[#0d2b4e] text-3xl font-light mt-1 ">{activeBookings}</h2>
          </div>
          <div className="w-10 h-10 bg-[#fdfeff] rounded-none flex items-center justify-center border border-[#c8a64d]/20">
            <Shield className="w-5 h-5 text-[#c8a64d]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-none border border-gray-200/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Pending Approvals</p>
            <h2 className="text-[#0d2b4e] text-3xl font-light mt-1 ">{pendingBookings}</h2>
          </div>
          <div className="w-10 h-10 bg-[#fdfeff] rounded-none flex items-center justify-center border border-[#c8a64d]/20">
            <Clock className="w-5 h-5 text-[#c8a64d]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-none border border-gray-200/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Saved Rooms</p>
            <h2 className="text-[#0d2b4e] text-3xl font-light mt-1 ">1</h2>
          </div>
          <div className="w-10 h-10 bg-[#fdfeff] rounded-none flex items-center justify-center border border-[#c8a64d]/20">
            <Heart className="w-5 h-5 text-[#c8a64d]" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PRIVILEGES SECTION */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* QUICK LINKS */}
          <div className="bg-white border border-gray-200/50 p-6 rounded-none shadow-sm">
            <h3 className="text-xl  font-light text-[#0d2b4e] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#c8a64d] inline-block"></span> Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/dashboard/profile" className="p-5 bg-[#fdfeff] border border-gray-200/30 rounded-none text-center hover:border-[#c8a64d]/40 transition group">
                <User className="mx-auto text-[#c8a64d] mb-2 group-hover:scale-110 transition" />
                <span className="text-[11px] tracking-wider uppercase font-semibold text-gray-600 block">Edit Profile</span>
              </Link>

              <Link to="/dashboard/bookings" className="p-5 bg-[#fdfeff] border border-gray-200/30 rounded-none text-center hover:border-[#c8a64d]/40 transition group">
                <Calendar className="mx-auto text-[#c8a64d] mb-2 group-hover:scale-110 transition" />
                <span className="text-[11px] tracking-wider uppercase font-semibold text-gray-600 block">My Stays</span>
              </Link>

              <Link to="/dashboard/notifications" className="p-5 bg-[#fdfeff] border border-gray-200/30 rounded-none text-center hover:border-[#c8a64d]/40 transition group">
                <Bell className="mx-auto text-[#c8a64d] mb-2 group-hover:scale-110 transition" />
                <span className="text-[11px] tracking-wider uppercase font-semibold text-gray-600 block">Alerts</span>
              </Link>

              <Link to="/dashboard/settings" className="p-5 bg-[#fdfeff] border border-gray-200/30 rounded-none text-center hover:border-[#c8a64d]/40 transition group">
                <Settings className="mx-auto text-[#c8a64d] mb-2 group-hover:scale-110 transition" />
                <span className="text-[11px] tracking-wider uppercase font-semibold text-gray-600 block">Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY */}
        <div className="bg-white border border-gray-200/50 p-6 rounded-none flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xl  font-light text-[#0d2b4e] flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#c8a64d] inline-block"></span> Recent Stays
            </h3>
            
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="p-4 bg-[#fdfeff] rounded-none border border-gray-200/30 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-[#0d2b4e] truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px] tracking-wide text-[17px]">{b.room_name}</h4>
                    <p className="text-gray-500 font-light">{new Date(b.check_in).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-[#c8a64d] block text-[17px]">₹{parseFloat(b.total_price).toLocaleString()}</span>
                    <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border ${
                      b.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" :
                      b.status === "checked_in" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      b.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-light text-sm">
                  You have no recent booking activities.
                </div>
              )}
            </div>
          </div>

          {bookings.length > 0 && (
            <Link to="/dashboard/bookings" className="text-xs text-[#c8a64d] hover:text-[#b09141] hover:underline flex items-center justify-center gap-1 mt-6 font-semibold uppercase tracking-wider">
              View All Bookings <ArrowRight size={12} />
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};

export default UserDashboard;