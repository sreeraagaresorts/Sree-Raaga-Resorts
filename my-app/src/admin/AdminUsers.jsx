import React, { useState, useEffect } from "react";
import { Trash, Shield, ShieldAlert, RefreshCw, Users } from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("guests");

  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.message || "Failed to load users.");
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Auto-refresh users silently every 10 seconds
    const interval = setInterval(() => {
      fetchUsers(true);
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
      fetchUsers();
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
      fetchUsers();
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

      {/* TABS */}
      <div className="flex gap-4 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab("guests")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition cursor-pointer ${
            activeTab === "guests"
              ? "border-[#C8A64D] text-[#C8A64D]"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Guests ({users.filter((u) => u.role !== "admin").length})
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition cursor-pointer ${
            activeTab === "admins"
              ? "border-[#C8A64D] text-[#C8A64D]"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Administrators ({users.filter((u) => u.role === "admin").length})
        </button>
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
                <tr>
                  <th className="p-4 text-left font-semibold">User details</th>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Phone</th>
                  <th className="p-4 text-left font-semibold">Role</th>
                  <th className="p-4 text-left font-semibold">Registered on</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold text-white/90">
                      {u.full_name}
                      <span className="text-[10px] text-white/30 block">User ID: #{u.id}</span>
                    </td>
                    <td className="p-4 text-white/70">{u.email}</td>
                    <td className="p-4 text-white/70">{u.phone || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${
                          u.role === "admin"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                        }`}
                      >
                        {u.role === "admin" ? <Shield size={12} /> : <Users size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
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
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition"
                          title="Delete User Account"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
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

export default AdminUsers;