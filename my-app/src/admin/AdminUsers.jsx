import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, RefreshCw, Users, TrendingUp, TrendingDown } from "lucide-react";
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
      fetchUsersAndBookings();
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
      fetchUsersAndBookings();
      loadHistoryLogs();
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  const displayedUsers = users.filter((u) => {
    if (activeTab === "admins") {
      return u.role === "admin";
    }
    return u.role !== "admin";
  });

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
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
          {/* Total Users */}
          <div className="bg-[#061f24]/80 border border-cyan-500/20 p-5 rounded-xl hover:border-cyan-500/30 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">Total Users</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => u.role !== "admin").length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  +4.3% <span className="text-white/40 ml-1">vs last week</span>
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
                <p className="text-white/60 text-xs">Active Users</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => u.role !== "admin" && bookings.some((b) => b.guest_email === u.email || b.user_id === u.id)).length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  +2.1% <span className="text-white/40 ml-1">vs last week</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          {/* Inactive Users */}
          <div className="bg-[#240606]/80 border border-red-500/20 p-5 rounded-xl hover:border-red-500/30 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs">Inactive Users</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {users.filter((u) => u.role !== "admin" && !bookings.some((b) => b.guest_email === u.email || b.user_id === u.id)).length}
                </h2>
                <div className="flex items-center gap-1 text-xs mt-2 text-red-400">
                  <TrendingDown className="w-3 h-3" />
                  -1.5% <span className="text-white/40 ml-1">vs last week</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-400" />
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
            {tab === 'guests' ? 'Guests' : tab === 'admins' ? 'Administrators' : 'Admin History'}
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
                    <th className="p-4 text-left font-semibold">Timestamp</th>
                    <th className="p-4 text-left font-semibold">Administrator</th>
                    <th className="p-4 text-left font-semibold">Action Type</th>
                    <th className="p-4 text-left font-semibold">Details</th>
                    <th className="p-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 text-white/50 text-xs">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-semibold text-white/90">{log.adminName}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${
                            log.actionType === "User Deletion"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {log.actionType}
                        </span>
                      </td>
                      <td className="p-4 text-white/70">{log.details}</td>
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
                     <th className="p-4 text-center font-semibold">Guest ID</th>
                  <th className="p-4 text-center font-semibold">User Name</th>
                  <th className="p-4 text-center font-semibold">Email</th>
                  <th className="p-4 text-center font-semibold">Role</th>
                  <th className="p-4 text-center font-semibold">Registered on</th>
                  {activeTab === "guests" && <th className="p-4 text-center font-semibold">Actions</th>}
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
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded cursor-pointer transition"
                            title={`Toggle role to ${u.role === "admin" ? "user" : "admin"}`}
                          >
                            <ShieldAlert size={14} />
                          </button>
                           <button
                             onClick={() => handleDelete(u.id)}
                             className="px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition text-xs font-semibold"
                             title="Delete User Account"
                           >
                             Delete
                           </button>
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
    </div>
  );
};

export default AdminUsers;