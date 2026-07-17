import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, RefreshCw, Users, TrendingUp, TrendingDown, MoreVertical, Eye, Trash2, X } from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("guests");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenuUserId, setActiveMenuUserId] = useState(null);
  const now = new Date();
  const [historyFilterYear, setHistoryFilterYear] = useState(String(now.getFullYear()));
  const [historyFilterMonth, setHistoryFilterMonth] = useState(String(now.getMonth() + 1));
  const [historyFilterDay, setHistoryFilterDay] = useState("");

  const loadHistoryLogs = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHistoryLogs(data.data);
      } else {
        throw new Error(data.message || "Failed to load admin history.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsersAndBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to load users.");
      }

      const bResponse = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bData = await bResponse.json();
      if (!bData.success) {
        throw new Error(bData.message || "Failed to load bookings.");
      }

      setUsers(data.data);
      setBookings(bData.data);
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndBookings();
    loadHistoryLogs();

    // Auto-refresh users and logs silently every 10 seconds
    const interval = setInterval(() => {
      fetchUsersAndBookings(true);
      loadHistoryLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Are you sure you want to change ${user.full_name}'s role to ${newRole}?`)) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${user.id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change user role.");
      }

      toast.success("User role updated successfully!");
      fetchUsersAndBookings(true);
      loadHistoryLogs();
    } catch (err) {
      toast.error(err.message || "Failed to change user role.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user profile? All their bookings will also be deleted!")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      toast.success("User account deleted successfully!");
      fetchUsersAndBookings(true);
      loadHistoryLogs();
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  const displayedUsers = users.filter((u) => {
    if (activeTab === "admins") {
      return u.role === "admin";
    }
    // Removed `!u.is_manual` so manual guest walk-ins successfully display in the Users Table
   return u.role === "user" && !u.is_manual;
  });

  const renderHistory = () => {
    const now2 = new Date();
    const months = [
      { v: "1", l: "January" }, { v: "2", l: "February" }, { v: "3", l: "March" },
      { v: "4", l: "April" }, { v: "5", l: "May" }, { v: "6", l: "June" },
      { v: "7", l: "July" }, { v: "8", l: "August" }, { v: "9", l: "September" },
      { v: "10", l: "October" }, { v: "11", l: "November" }, { v: "12", l: "December" }
    ];
    const years = Array.from(new Set(historyLogs.map(l => new Date(l.timestamp).getFullYear()))).sort((a, b) => b - a);
    if (!years.includes(now2.getFullYear())) years.unshift(now2.getFullYear());

    const filteredLogs = historyLogs.filter(log => {
      const d = new Date(log.timestamp);
      if (historyFilterYear && d.getFullYear() !== Number(historyFilterYear)) return false;
      if (historyFilterMonth && (d.getMonth() + 1) !== Number(historyFilterMonth)) return false;
      if (historyFilterDay && d.getDate() !== Number(historyFilterDay)) return false;
      return true;
    });

    const getRowClass = (actionType) => {
      const t = (actionType || "").toLowerCase();
      if (t.includes("delete") || t.includes("deletion") || t === "booking cancellation") {
        return "bg-red-500/10 hover:bg-red-500/15";
      }
      if (t === "logout") return " ";
      return "hover:bg-white/5";
    };

    const getBadgeClass = (actionType) => {
      const t = (actionType || "").toLowerCase();
      if (t.includes("delete") || t.includes("deletion")) return "bg-red-500/10 text-red-400 border-red-500/20";
      if (t === "logout") return "bg-red-500/20  border-red-500/20";
      if (t === "login") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      if (t === "booking cancellation") return "bg-red-500/10 text-red-400 border-red-500/20";
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={historyFilterYear}
            onChange={e => { setHistoryFilterYear(e.target.value); setHistoryFilterMonth(""); setHistoryFilterDay(""); }}
            className="bg-[#071524] border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C8A64D] cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={historyFilterMonth}
            onChange={e => { setHistoryFilterMonth(e.target.value); setHistoryFilterDay(""); }}
            className="bg-[#071524] border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C8A64D] cursor-pointer"
          >
            <option value="">All Months</option>
            {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
          </select>
          <select
            value={historyFilterDay}
            onChange={e => setHistoryFilterDay(e.target.value)}
            className="bg-[#071524] border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C8A64D] cursor-pointer"
          >
            <option value="">All Days</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{String(d).padStart(2, "0")}</option>
            ))}
          </select>
          {(historyFilterMonth || historyFilterDay) && (
            <button
  onClick={() => {
    setHistoryFilterMonth(String(now2.getMonth() + 1));
    setHistoryFilterDay("");
    setHistoryFilterYear(String(now2.getFullYear()));
  }}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C8A64D]/30 bg-[#C8A64D]/10 text-[#C8A64D] text-sm font-medium hover:bg-[#C8A64D] hover:text-black transition-all duration-200 cursor-pointer"
>
  Reset to Current Month
</button>
          )}
          <span className="ml-auto text-xs text-white/40">{filteredLogs.length} record{filteredLogs.length !== 1 ? "s" : ""}</span>
        </div>
        {filteredLogs.length === 0 ? (
          <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
            No history records found for the selected period.
          </div>
        ) : (
          <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#071524] text-white/60 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-left font-semibold text-[#c8a64d]">Timestamp</th>
                    <th className="p-4 text-left font-semibold text-[#c8a64d]">Administrator</th>
                    <th className="p-4 text-left font-semibold text-[#c8a64d]">Action Type</th>
                    <th className="p-4 text-left font-semibold text-[#c8a64d]">Details</th>
                    <th className="p-4 text-center font-semibold text-[#c8a64d]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className={`border-t border-white/5 transition ${getRowClass(log.actionType)}`}>
                      <td className="p-4 text-white/80 text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-semibold text-white/90">{log.adminName}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${getBadgeClass(log.actionType)}`}>
                          {log.actionType ? log.actionType.replace(/Deletion/g, "Deleted").replace(/deletion/g, "deleted") : ""}
                        </span>
                      </td>
                      <td className="p-4 text-white/80 text-xs">{log.details}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${
                          (log.actionType || "").toLowerCase() === "booking cancellation"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : (log.actionType || "").toLowerCase().includes("delete") || (log.actionType || "").toLowerCase().includes("deletion")
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}>
                          {(log.actionType || "").toLowerCase() === "Success"
                            ? "booking cancellation"
                            : log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Guests & Administrators</h1>
          <p className="text-white/50 text-sm">
            Manage user profiles, registration details, and administrative roles.
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      {!loading && !error && (() => {
        // Updated stat calculation to include manual guests, ensuring total counts map perfectly 
    const guestUsers = users.filter(
  (u) => u.role !== "admin" && !u.is_manual
);
        const totalUsers = guestUsers.length;
        const activeUserIds = new Set(bookings.filter(b => b.status !== "cancelled").map(b => b.user_id));
        const activeUsers = guestUsers.filter(u => activeUserIds.has(u.id)).length;
        const inactiveUsers = totalUsers - activeUsers;
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="bg-[#061f24]/80 border border-cyan-500/20 p-5 rounded-xl hover:border-cyan-500/30 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Total Users</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{totalUsers}</h2>
                  <div className="flex items-center gap-1 text-xs mt-2 text-cyan-400 font-semibold">
                    Registered Accounts
                  </div>
                </div>
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-[#062419]/80 border border-green-500/20 p-5 rounded-xl hover:border-green-500/30 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Active Users</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{activeUsers}</h2>
                  <div className="flex items-center gap-1 text-xs mt-2 text-green-400 font-semibold">
                    Have Bookings
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-500/10 border border-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            {/* Inactive Users */}
            <div className="bg-[#1a0606]/80 border border-red-500/20 p-5 rounded-xl hover:border-red-500/30 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Inactive Users</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{inactiveUsers}</h2>
                  <div className="flex items-center gap-1 text-xs mt-2 text-red-400 font-semibold">
                    No Bookings Yet
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TABS */}
      <div className="flex flex-wrap gap-3 text-base font-bold uppercase tracking-wider w-full sm:w-auto border-b border-white/5 pb-4">
        {['guests', 'admins', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg cursor-pointer transition text-sm font-semibold border ${
              activeTab === tab
                ? 'bg-[#C8A64D] text-[#071524] border-[#C8A64D] hover:bg-[#C8A64D]/90'
                : 'bg-[#071524] text-white/50 border-white/10 hover:bg-white/5'
            }`}
          >
            {tab === 'guests' ? 'Users' : tab === 'admins' ? 'Administrators' : 'Admin History'}
          </button>
        ))}
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 justify-center py-12">
          <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
          <span>Loading guest profiles...</span>
        </div>
      ) : activeTab === "history" ? (
        renderHistory()
      ) : displayedUsers.length === 0 ? (

        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
          {activeTab === "admins"
            ? "No registered administrator profiles found."
            : "No registered guest profiles found."}
        </div>
      ) : (
        <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#071524] text-white/60 text-xs uppercase tracking-wider">
                <tr className="text-center">
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">Guest ID</th>
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">User Name</th>
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">Email</th>
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">Role</th>
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">Registered on</th>
                  {activeTab === "guests" && <th className="p-4 text-center font-semibold text-[#c8a64d]">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/5 text-center hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold text-white">
                      <span className="text-[16px] text-white block"> #{u.id}</span>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {u.full_name}
                    </td>
                    <td className="p-4 text-white">{u.email} <br></br> {formatPhoneNumber(u.phone)}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-6 py-2 rounded border font-semibold inline-flex items-center gap-1 ${
                          u.role === "admin"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-white  text-xs">
                      <div className="flex flex-col items-center justify-center gap-1">
                        {new Date(u.created_at).toLocaleDateString("en-GB")}
                        {/* New indicator helping Admins distinguish Online Users vs Walk-Ins */}
                        {u.is_manual ? (
                          <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-white/10">Walk-in</span>
                        ) : (
                          <span className="bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-blue-500/20">Online</span>
                        )}
                      </div>
                    </td>
                    {activeTab === "guests" && (
                      <td className="p-2 text-center relative">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setActiveMenuUserId(activeMenuUserId === u.id ? null : u.id)}
                            className="p-1 hover:bg-white/10 rounded cursor-pointer transition text-white/60 hover:text-white"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeMenuUserId === u.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setActiveMenuUserId(null)}
                              />
                              <div className="absolute right-12 mt-2 w-36 bg-[#081A2F] border border-white/10 rounded-lg shadow-xl z-20 py-1 text-left">
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setActiveMenuUserId(null);
                                  }}
                                  className="w-full  py-2 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye size={12} className="text-blue-400" />
                               <span className="text-[11px]">   View Details</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(u.id);
                                    setActiveMenuUserId(null);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer border-t border-white/5"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GUEST DETAILS MODAL */}
      {selectedUser && (() => {
        const u = selectedUser;
        const guestBookings = bookings.filter(b => b.user_id === u.id);
        const paidAmount = guestBookings.filter(b => b.payment_method !== "pay_later" && b.status !== "cancelled").reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
        const dueAmount = guestBookings.filter(b => b.payment_method === "pay_later" && b.status !== "cancelled").reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#081A2F] w-full max-w-3xl p-6 rounded-xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C8A64D]" />
                  Guest Details & History
                </h2>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* PROFILE DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg border border-white/5 text-left">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Full Name</p>
                  <p className="text-white font-semibold text-base mt-0.5">{u.full_name}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Email Address</p>
                  <p className="text-white font-semibold text-base mt-0.5">{u.email}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Phone Number</p>
                  <p className="text-white font-semibold text-base mt-0.5">{formatPhoneNumber(u.phone)}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Registration Date</p>
                  <p className="text-white font-semibold text-base mt-0.5">
                    {new Date(u.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {/* PAYMENT SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-[#061f24]/80 border border-cyan-500/20 p-4 rounded-xl">
                  <p className="text-white/60 text-xs">Total Bookings</p>
                  <h3 className="text-xl font-bold text-white mt-1">{guestBookings.length}</h3>
                </div>
                <div className="bg-[#062419]/80 border border-green-500/20 p-4 rounded-xl">
                  <p className="text-white/60 text-xs">Amount Paid</p>
                  <h3 className="text-xl font-bold text-green-400 mt-1">₹{paidAmount.toLocaleString("en-IN")}</h3>
                </div>
                <div className="bg-[#240606]/80 border border-red-500/20 p-4 rounded-xl">
                  <p className="text-white/60 text-xs">Amount Due</p>
                  <h3 className="text-xl font-bold text-red-400 mt-1">₹{dueAmount.toLocaleString("en-IN")}</h3>
                </div>
              </div>

              {/* BOOKINGS HISTORY */}
              <div className="space-y-3 text-left">
                <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-500">Booking Logs</h3>
                {guestBookings.length === 0 ? (
                  <p className="text-white/40 text-sm italic">No bookings recorded for this guest.</p>
                ) : (
                  <div className="border border-white/5 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#071524] text-white/60 uppercase tracking-wider">
                        <tr>
                          <th className="p-3 font-semibold text-[#c8a64d]">Booking ID</th>
                          <th className="p-3 font-semibold text-[#c8a64d]">Stay Dates</th>
                          <th className="p-3 font-semibold text-[#c8a64d]">Total Amount</th>
                          <th className="p-3 font-semibold text-[#c8a64d]">Payment Method</th>
                          <th className="p-3 font-semibold text-[#c8a64d]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guestBookings.map((b) => (
                          <tr key={b.id} className="border-t border-white/5 hover:bg-white/5 transition">
                            <td className="p-3 font-semibold text-white">BK-{b.id.toString().padStart(4, "0")}</td>
                            <td className="p-3 text-white/90">
                              {new Date(b.check_in).toLocaleDateString("en-GB")} to {new Date(b.check_out).toLocaleDateString("en-GB")}
                            </td>
                            <td className="p-3 font-semibold text-[#C8A64D]">₹{parseFloat(b.total_price).toLocaleString()}</td>
                            <td className="p-3 text-white/80 uppercase">{(b.payment_method || "cash").replace("_", " ")}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                                b.status === "confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                b.status === "checked_in" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                b.status === "checked_out" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded font-semibold cursor-pointer transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminUsers;