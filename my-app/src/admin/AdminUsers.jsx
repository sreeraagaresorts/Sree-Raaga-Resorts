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
    return u.role !== "admin" && !u.is_manual;
  });

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
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Guests */}
          <div className="bg-[#061f24]/80 border border-cyan-500/20 p-5 rounded-xl hover:border-cyan-500/30 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">Guests</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => u.role !== "admin" && !u.is_manual).length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-cyan-400 font-semibold">
                  Guest Accounts
                </div>
              </div>
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Total Administrators */}
          <div className="bg-[#241a06]/80 border border-yellow-500/20 p-5 rounded-xl hover:border-yellow-500/30 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">Administrators</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => u.role === "admin").length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-yellow-400 font-semibold">
                  Staff Members
                </div>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Total Accounts */}
          <div className="bg-[#1f0624]/80 border border-purple-500/20 p-5 rounded-xl hover:border-purple-500/30 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">Total Accounts</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => !u.is_manual).length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-purple-400 font-semibold">
                  Guests & Staff
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}

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
        historyLogs.length === 0 ? (
          <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
            No administration actions recorded yet.
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
                  {historyLogs.map((log) => (
                    <tr
                      key={log.id}
                      className={`border-t border-white/5 transition ${
                        log.actionType && log.actionType.toLowerCase().includes("delete")
                          ? "bg-red-500/10 text-red-100 hover:bg-red-500/15"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="p-4 text-white text-xs">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-semibold text-white/90">{log.adminName}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${
                            log.actionType && log.actionType.toLowerCase().includes("delete")
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : log.actionType === "Login"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {log.actionType}  
                        </span>
                      </td>
                      <td className="p-4 text-white">{log.details}</td>
                      <td className="p-4 text-center">
                        <span className="text-xs px-2.5 py-0.5 rounded border font-semibold bg-green-500/10 text-green-400 border-green-500/20">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
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
                      {new Date(u.created_at).toLocaleDateString("en-GB")}
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

