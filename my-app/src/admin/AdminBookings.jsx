import React, { useState, useEffect } from "react";
import {
  Edit,
  CheckCircle,
  XCircle,
  Trash,
  Plus,
  X,
  Search,
  ArrowRight,
  RefreshCw,
  UserCheck,
} from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // New booking form details
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        throw new Error(data.message || "Failed to load bookings.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndRooms = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      // Fetch users
      const uRes = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uData = await uRes.json();
      if (uData.success) {
        setUsers(uData.data);
        if (uData.data.length > 0) setSelectedUser(uData.data[0].id.toString());
      }

      // Fetch rooms
      const rRes = await fetch("http://localhost:5000/api/rooms");
      const rData = await rRes.json();
      if (rData.success) {
        setRooms(rData.data);
        if (rData.data.length > 0) setSelectedRoom(rData.data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to fetch helper lists:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenForm = async () => {
    await fetchUsersAndRooms();
    setCheckIn("");
    setCheckOut("");
    setAdults(1);
    setChildren(0);
    setIsFormOpen(true);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedRoom || !checkIn || !checkOut) {
      alert("All fields are required.");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: Number(selectedUser),
          room_id: Number(selectedRoom),
          check_in: checkIn,
          check_out: checkOut,
          adults: Number(adults),
          children: Number(children),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      alert("Booking created successfully!");
      setIsFormOpen(false);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status.");
      }

      alert(`Booking status changed to ${status}!`);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking.");
      }

      alert("Booking deleted successfully!");
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "All" || (b.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      (b.guest_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.guest_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.room_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings Manager</h1>
          <p className="text-white/50 text-sm">
            Manage reservations and guest stays
          </p>
        </div>

        <button
          onClick={handleOpenForm}
          className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141]"
        >
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#081A2F] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#071524] px-3 rounded-lg border border-white/5">
          <Search className="w-4 h-4 text-white/40" />
          <input
            placeholder="Search by guest name, email, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent p-2 outline-none text-sm text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#071524] px-3 py-2 rounded-lg text-sm border border-white/10 text-white outline-none focus:border-[#C8A64D]"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
          <span>Loading bookings...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
          No bookings found.
        </div>
      ) : (
        <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#071524] text-white/60 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left font-semibold">Guest Details</th>
                  <th className="p-4 text-left font-semibold">Room booked</th>
                  <th className="p-4 text-left font-semibold">Reservation Dates</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    {/* GUEST */}
                    <td className="p-4">
                      <div className="font-semibold">{b.guest_name}</div>
                      <div className="text-xs text-white/40">{b.guest_email}</div>
                      {b.guest_phone && <div className="text-[10px] text-white/30">{b.guest_phone}</div>}
                    </td>

                    {/* ROOM */}
                    <td className="p-4">
                      <div className="text-white/70 font-medium">{b.room_name}</div>
                      <div className="text-xs text-white/40">ID: BK-{b.id.toString().padStart(4, "0")}</div>
                    </td>

                    {/* DATES */}
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-2 text-white/70">
                        <span>{new Date(b.check_in).toLocaleDateString()}</span>
                        <ArrowRight className="w-3 h-3 text-white/30" />
                        <span>{new Date(b.check_out).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">
                        Guests: {b.adults} Adults {b.children > 0 && `, ${b.children} Children`}
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 text-[#C8A64D] font-bold text-base">
                      ₹{parseFloat(b.total_price).toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                          b.status === "confirmed"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : b.status === "checked_in"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : b.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "confirmed")}
                            className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded cursor-pointer"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "checked_in")}
                            className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded cursor-pointer"
                            title="Check In"
                          >
                            <UserCheck size={14} />
                          </button>
                        )}
                        {b.status !== "cancelled" && b.status !== "checked_in" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "cancelled")}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded cursor-pointer"
                            title="Cancel Booking"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 bg-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400 rounded cursor-pointer transition"
                          title="Delete Booking Record"
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

      {/* NEW BOOKING MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-2xl p-6 rounded-xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-xl font-bold">New Booking Creation</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest dropdown */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Guest / User Account</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room dropdown */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Inventory</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  >
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ₹{parseFloat(room.price).toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check In */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Check In</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Check Out */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Check Out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Adults */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Adults count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Children */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Children count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition disabled:bg-yellow-600/50 cursor-pointer"
                >
                  {saving ? "Creating..." : "Save Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;