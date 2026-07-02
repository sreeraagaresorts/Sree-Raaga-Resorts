import React, { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import {
  Users,
  BedDouble,
  CalendarDays,
  IndianRupee,
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
  const [users, setUsers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      // 1. Fetch bookings
      const bRes = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bData = await bRes.json();
      if (bData.success) {
        setBookings(bData.data);
      } else {
        throw new Error(bData.message || "Failed to fetch bookings.");
      }

      // 2. Fetch rooms
      const rRes = await fetch(`${API_URL}/api/rooms`);
      const rData = await rRes.json();
      if (rData.success) {
        setRoomsCount(rData.data.length);
      }

      // 3. Fetch users
      const uRes = await fetch(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uData = await uRes.json();
      if (uData.success) {
        setUsers(uData.data);
        setUsersCount(uData.data.length);
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh stats silently every 10 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Compute metrics
  const getMetrics = () => {
    let totalRevenue = 0;
    let todaysRevenue = 0;
    let yesterdaysRevenue = 0;
    let pendingPayments = 0;
    let checkedInCount = 0;

    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const now = new Date();

    const getDaysAgo = (n) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const sevenDaysAgo = getDaysAgo(7);
    const fourteenDaysAgo = getDaysAgo(14);

    let occupancyLastWeek = 0;

    let pendingThisWeek = 0;
    let pendingLastWeek = 0;

    bookings.forEach((b) => {
      const price = parseFloat(b.total_price) || 0;
      if (b.status === "confirmed" || b.status === "checked_in") {
        totalRevenue += price;
        const bookingDate = new Date(b.created_at).toDateString();
        if (bookingDate === todayStr) {
          todaysRevenue += price;
        } else if (bookingDate === yesterdayStr) {
          yesterdaysRevenue += price;
        }
      } else if (b.status === "pending") {
        pendingPayments += price;

        // Pending trends
        const createdDate = new Date(b.created_at);
        if (createdDate >= sevenDaysAgo && createdDate <= now) {
          pendingThisWeek += price;
        } else if (createdDate >= fourteenDaysAgo && createdDate < sevenDaysAgo) {
          pendingLastWeek += price;
        }
      }

      if (b.status === "checked_in") {
        checkedInCount += 1;
      }

      // Occupancy 7 days ago (confirmed/checked_in/completed bookings active 7 days ago)
      if (b.status === "confirmed" || b.status === "checked_in" || b.status === "completed") {
        const checkInDate = new Date(b.check_in);
        const checkOutDate = new Date(b.check_out);
        if (checkInDate <= sevenDaysAgo && checkOutDate >= sevenDaysAgo) {
          occupancyLastWeek += 1;
        }
      }
    });

    const occupancyRate = roomsCount > 0 ? Math.round((checkedInCount / roomsCount) * 100) : 0;

    // Calculate trends
    // 1. Revenue (Today's Revenue vs Yesterday's Revenue)
    let revenueTrendVal = 0;
    if (yesterdaysRevenue > 0) {
      revenueTrendVal = ((todaysRevenue - yesterdaysRevenue) / yesterdaysRevenue) * 100;
    } else if (todaysRevenue > 0) {
      revenueTrendVal = 100;
    }
    const revenueTrend = `${revenueTrendVal >= 0 ? "+" : ""}${revenueTrendVal.toFixed(1)}%`;
    const revenueTrendPositive = revenueTrendVal >= 0;

    // 2. Occupancy
    let occupancyTrendVal = 0;
    if (occupancyLastWeek > 0) {
      occupancyTrendVal = ((checkedInCount - occupancyLastWeek) / occupancyLastWeek) * 100;
    } else if (checkedInCount > 0) {
      occupancyTrendVal = 100;
    }
    const occupancyTrend = `${occupancyTrendVal >= 0 ? "+" : ""}${occupancyTrendVal.toFixed(1)}%`;
    const occupancyTrendPositive = occupancyTrendVal >= 0;

    // 3. Pending
    let pendingTrendVal = 0;
    if (pendingLastWeek > 0) {
      pendingTrendVal = ((pendingThisWeek - pendingLastWeek) / pendingLastWeek) * 100;
    } else if (pendingThisWeek > 0) {
      pendingTrendVal = 100;
    }
    const pendingTrend = `${pendingTrendVal >= 0 ? "+" : ""}${pendingTrendVal.toFixed(1)}%`;
    const pendingTrendPositive = pendingTrendVal >= 0;

    // 4. Users
    let usersLastWeek = 0;
    users.forEach((u) => {
      const createdDate = new Date(u.created_at);
      if (createdDate < sevenDaysAgo) {
        usersLastWeek += 1;
      }
    });
    let usersTrendVal = 0;
    const usersThisWeek = users.length;
    if (usersLastWeek > 0) {
      usersTrendVal = ((usersThisWeek - usersLastWeek) / usersLastWeek) * 100;
    } else if (usersThisWeek > 0) {
      usersTrendVal = 100;
    }
    const usersTrend = `${usersTrendVal >= 0 ? "+" : ""}${usersTrendVal.toFixed(1)}%`;
    const usersTrendPositive = usersTrendVal >= 0;

    return {
      totalRevenue,
      todaysRevenue,
      pendingPayments,
      occupancyRate,
      checkedInCount,
      revenueTrend,
      revenueTrendPositive,
      occupancyTrend,
      occupancyTrendPositive,
      pendingTrend,
      pendingTrendPositive,
      usersTrend,
      usersTrendPositive
    };
  };

  const metrics = getMetrics();

  const getMonthlyRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        monthName: months[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        revenue: 0,
        pending: 0
      });
    }

    bookings.forEach((b) => {
      const bookingDate = new Date(b.created_at || b.check_in);
      const bookingMonth = bookingDate.getMonth();
      const bookingYear = bookingDate.getFullYear();
      const price = parseFloat(b.total_price) || 0;

      const monthObj = data.find(m => m.monthIndex === bookingMonth && m.year === bookingYear);
      if (monthObj) {
        if (b.status === "confirmed" || b.status === "checked_in") {
          monthObj.revenue += price;
        } else if (b.status === "pending") {
          monthObj.pending += price;
        }
      }
    });

    return data.map((d) => {
      return {
        label: d.monthName,
        revenue: d.revenue,
        pending: d.pending,
        total: d.revenue + d.pending
      };
    });
  };

  const chartData = getMonthlyRevenueData();
  const maxVal = Math.max(...chartData.map(d => d.total), 1000) * 1.15;

  const stats = [
    { 
      label: "Today's Revenue", 
      value: `₹${metrics.todaysRevenue.toLocaleString()}`, 
      icon: IndianRupee, 
      trend: metrics.revenueTrend, 
      isPositive: metrics.revenueTrendPositive,
      trendLabel: "vs yesterday",
      bgClass: "bg-[#062419]/80 border border-green-500/20",
      iconBgClass: "bg-green-500/10 border border-green-500/10",
      iconColorClass: "text-green-400"
    },
    { 
      label: "Room Occupancy", 
      value: `${metrics.checkedInCount} ${metrics.checkedInCount === 1 ? 'Room' : 'Rooms'}`, 
      icon: BedDouble, 
      trend: metrics.occupancyTrend, 
      isPositive: metrics.occupancyTrendPositive,
      bgClass: "bg-[#061f24]/80 border border-cyan-500/20",
      iconBgClass: "bg-cyan-500/10 border border-cyan-500/10",
      iconColorClass: "text-cyan-400"
    },
    { 
      label: "Pending Payments", 
      value: `₹${metrics.pendingPayments.toLocaleString()}`, 
      icon: Wallet, 
      trend: metrics.pendingTrend, 
      isPositive: metrics.pendingTrendPositive,
      bgClass: "bg-[#241a06]/80 border border-amber-500/20",
      iconBgClass: "bg-amber-500/10 border border-amber-500/10",
      iconColorClass: "text-amber-400"
    },
    { 
      label: "Registered Users", 
      value: usersCount.toString(), 
      icon: Users, 
      trend: metrics.usersTrend, 
      isPositive: metrics.usersTrendPositive,
      bgClass: "bg-[#061f24]/80 border border-cyan-500/20",
      iconBgClass: "bg-cyan-500/10 border border-cyan-500/10",
      iconColorClass: "text-cyan-400"
    },
  ];

  const recentBookings = bookings.slice(0, 4).map((b) => ({
    id: b.id,
    name: b.guest_name,
    room: b.room_name,
    amount: parseFloat(b.total_price),
    status: b.status,
    date: new Date(b.created_at).toLocaleDateString("en-GB"),
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
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">
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
            className={`${stat.bgClass || "bg-[#081A2F] border border-white/5"} p-5 rounded-xl hover:border-white/10 transition`}
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
                  {stat.trend} <span className="text-white/40 ml-1">{stat.trendLabel || "vs last week"}</span>
                </div>
              </div>

              <div className={`w-10 h-10 ${stat.iconBgClass || "bg-[#071524] border border-white/5"} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColorClass || "text-[#C8A64D]"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-[#081A2F] border border-white/5 p-6 rounded-xl relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-xs text-white/50">
                Monthly performance analytics
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40">Total Pool Value</span>
              <p className="text-lg font-bold text-[#C8A64D]">₹{(metrics.totalRevenue + metrics.pendingPayments).toLocaleString()}</p>
            </div>
          </div>

          <div className="h-[220px] relative w-full select-none">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A64D" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C8A64D" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, index) => {
                const y = 15 + ratio * 160;
                const tickVal = Math.round((1 - ratio) * maxVal);
                return (
                  <g key={index}>
                    <line
                      x1="45"
                      y1={y}
                      x2="485"
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="35"
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-white/40 font-mono"
                    >
                      ₹{tickVal >= 1000 ? `${(tickVal / 1000).toFixed(0)}K` : tickVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              <path
                d={`M 45,175 L ${chartData
                  .map((d, i) => `${45 + (i / 5) * 440},${15 + (1 - d.total / maxVal) * 160}`)
                  .join(" L ")} L 485,175 Z`}
                fill="url(#chartGradient)"
              />

              {/* Curve Line */}
              <path
                d={`M ${chartData
                  .map((d, i) => `${45 + (i / 5) * 440},${15 + (1 - d.total / maxVal) * 160}`)
                  .join(" L ")}`}
                fill="none"
                stroke="#C8A64D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Vertical Guide Line */}
              {hoveredIndex !== null && (
                <line
                  x1={45 + (hoveredIndex / 5) * 440}
                  y1="15"
                  x2={45 + (hoveredIndex / 5) * 440}
                  y2="175"
                  stroke="rgba(200, 166, 77, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Dots for Points */}
              {chartData.map((d, i) => {
                const x = 45 + (i / 5) * 440;
                const y = 15 + (1 - d.total / maxVal) * 160;
                const isHovered = hoveredIndex === i;
                return (
                  <g key={i}>
                    {/* Ripple/Pulse effect for hovered dot */}
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#C8A64D"
                        opacity="0.3"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? "5" : "3.5"}
                      fill={isHovered ? "#FFFFFF" : "#C8A64D"}
                      stroke="#081A2F"
                      strokeWidth={isHovered ? "1.5" : "1"}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* X Axis month labels */}
              {chartData.map((d, i) => {
                const x = 45 + (i / 5) * 440;
                return (
                  <text
                    key={i}
                    x={x}
                    y="192"
                    textAnchor="middle"
                    className={`text-[10px]  font-semibold tracking-wider transition-colors duration-200 ${
                      hoveredIndex === i ? "fill-[#C8A64D]" : "fill-white/40"
                    }`}
                  >
                    {d.label}
                  </text>
                );
              })}

              {/* Invisible Hover Overlay Blocks */}
              {chartData.map((d, i) => {
                const xStart = i === 0 ? 45 : 45 + ((i - 0.5) / 5) * 440;
                const xEnd = i === 5 ? 485 : 45 + ((i + 0.5) / 5) * 440;
                const width = xEnd - xStart;
                return (
                  <rect
                    key={i}
                    x={xStart}
                    y="10"
                    width={width}
                    height="180"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredIndex !== null && (
              <div
                className="absolute bg-zinc-950/95 border border-yellow-500/20 p-3 shadow-2xl rounded-lg pointer-events-none z-20 text-xs text-left"
                style={{
                  left: `${((45 + (hoveredIndex / 5) * 440) / 500) * 100}%`,
                  transform: "translateX(-50%)",
                  bottom: "185px",
                }}
              >
                <p className="text-yellow-500 font-bold uppercase tracking-wider text-[9px] mb-1.5 border-b border-white/5 pb-1">
                  {chartData[hoveredIndex].label} Summary
                </p>
                <div className="space-y-1 text-white/70 ">
                  <p className="flex justify-between gap-5">
                    <span>Confirmed:</span>
                    <span className="font-semibold text-white">₹{chartData[hoveredIndex].revenue.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between gap-5">
                    <span>Pending:</span>
                    <span className="font-semibold text-white">₹{chartData[hoveredIndex].pending.toLocaleString()}</span>
                  </p>
                  <div className="border-t border-white/10 pt-1 mt-1.5 flex justify-between font-bold text-white">
                    <span>Total pool:</span>
                    <span className="text-[#C8A64D]">₹{chartData[hoveredIndex].total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
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
              onClick={() => navigate("/admin/hotel-mgmt",)}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30 transition text-center cursor-pointer"
            >
              <CalendarDays className="text-green-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Manage Hotel</p>
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