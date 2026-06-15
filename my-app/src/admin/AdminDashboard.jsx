import React, { useState, useEffect } from "react";
import {
  Users,
  BedDouble,
  CalendarDays,
  DollarSign,
  Wallet,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [roomsCount, setRoomsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      try {
        // 1. Fetch bookings
        const bRes = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bData = await bRes.json();
        if (bData.success) {
          setBookings(bData.data);
        } else {
          throw new Error(bData.message || "Failed to fetch bookings.");
        }

        // 2. Fetch rooms
        const rRes = await fetch("http://localhost:5000/api/rooms");
        const rData = await rRes.json();
        if (rData.success) {
          setRoomsCount(rData.data.length);
        }

        // 3. Fetch users
        const uRes = await fetch("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uData = await uRes.json();
        if (uData.success) {
          setUsersCount(uData.data.length);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute metrics
  const getMetrics = () => {
    let totalRevenue = 0;
    let pendingPayments = 0;
    let checkedInCount = 0;

    bookings.forEach((b) => {
      const price = parseFloat(b.total_price);
      if (b.status === "confirmed" || b.status === "checked_in") {
        totalRevenue += price;
      } else if (b.status === "pending") {
        pendingPayments += price;
      }

      if (b.status === "checked_in") {
        checkedInCount += 1;
      }
    });

    const occupancyRate = roomsCount > 0 ? Math.round((checkedInCount / roomsCount) * 100) : 0;

    return {
      totalRevenue,
      pendingPayments,
      occupancyRate,
    };
  };

  const metrics = getMetrics();

  const stats = [
    { label: "Room Occupancy", value: `${metrics.occupancyRate}%`, icon: BedDouble, trend: "+2.1%", isPositive: true },
    { label: "Total Revenue", value: `₹${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", isPositive: true },
    { label: "Pending Payments", value: `₹${metrics.pendingPayments.toLocaleString()}`, icon: Wallet, trend: "-8.1%", isPositive: false },
    { label: "Registered Users", value: usersCount.toString(), icon: Users, trend: "+4.3%", isPositive: true },
  ];

  const recentBookings = bookings.slice(0, 4).map((b) => ({
    id: b.id,
    name: b.guest_name,
    room: b.room_name,
    amount: parseFloat(b.total_price),
    status: b.status,
    date: new Date(b.created_at).toLocaleDateString(),
  }));

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 justify-center py-24">
        <RefreshCw className="animate-spin w-8 h-8 text-[#C8A64D]" />
        <span className="text-xl">Loading Admin Dashboard metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#081A2F] border border-white/5 p-5 rounded-xl hover:border-white/10 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">{stat.label}</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </h2>

                <div
                  className={`flex items-center gap-1 text-xs mt-2 ${
                    stat.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.trend} <span className="text-white/40 ml-1">vs last week</span>
                </div>
              </div>

              <div className="w-10 h-10 bg-[#071524] border border-white/5 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[#C8A64D]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
          <p className="text-xs text-white/50 mb-6">
            Monthly performance analytics
          </p>

          <div className="h-[250px] flex flex-col items-center justify-center text-white/30 border border-dashed border-white/10 rounded-lg bg-[#071524]/30 p-6">
            <span className="text-2xl font-bold text-white mb-2">₹{(metrics.totalRevenue + metrics.pendingPayments).toLocaleString()}</span>
            <p className="text-sm text-center max-w-sm">Total booking pool value (inclusive of pending reservations) is currently loaded.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Room Inventory
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Total rooms created on backend
            </p>
          </div>

          <div className="flex flex-col items-center justify-center h-[200px] text-white/30">
            <span className="text-6xl font-light text-[#C8A64D] mb-2">{roomsCount}</span>
            <span className="text-sm font-semibold uppercase tracking-wider text-white/60">Rooms Available</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RECENT BOOKINGS */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Recent Bookings
            </h3>

            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <div className="text-center py-12 text-white/40 text-sm">No reservations received yet.</div>
              ) : (
                recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-white/5 transition"
                  >
                    <div>
                      <p className="text-white text-sm font-semibold">{b.name}</p>
                      <p className="text-white/50 text-xs mt-0.5">
                        {b.room} - ₹{b.amount.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${
                        b.status === "confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        b.status === "checked_in" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        b.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {b.status}
                      </span>
                      <p className="text-white/30 text-[10px] mt-1">{b.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/bookings")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30 transition text-center cursor-pointer"
            >
              <BedDouble className="text-blue-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Bookings</p>
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30 transition text-center cursor-pointer"
            >
              <Users className="text-teal-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Users</p>
            </button>

            <button
              onClick={() => navigate("/admin/events")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30 transition text-center cursor-pointer"
            >
              <CalendarDays className="text-green-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Events</p>
            </button>

            <button
              onClick={() => navigate("/admin/billing")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30 transition text-center cursor-pointer"
            >
              <FileText className="text-[#C8A64D] mx-auto" />
              <p className="text-xs text-white/70 mt-2">Billing Ledger</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;