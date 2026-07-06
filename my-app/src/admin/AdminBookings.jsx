import React, { useState, useEffect } from "react";
import {
  Edit,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Search,
  ArrowRight,
  RefreshCw,
  UserCheck,
  ChevronDown
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const AdminBookings = () => {
  const toast = useToast();
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
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [saving, setSaving] = useState(false);

  // Assign Room Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBooking, setAssignBooking] = useState(null);
  const [assignRoomNumber, setAssignRoomNumber] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // Manual guest registration details
  const [guestMode, setGuestMode] = useState("existing");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const fetchBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
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
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchUsersAndRooms = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      // Fetch users
      const uRes = await fetch(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uData = await uRes.json();
      if (uData.success) {
        setUsers(uData.data);
        const nonAdmins = uData.data.filter(u => u.role !== "admin");
        if (nonAdmins.length > 0) {
          setSelectedUser(nonAdmins[0].id.toString());
        } else {
          setSelectedUser("");
        }
      }

      // Fetch rooms
      const rRes = await fetch(`${API_URL}/api/rooms`);
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
    fetchUsersAndRooms();

    // Auto-refresh bookings silently every 10 seconds
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const availableRoomNumbers = React.useMemo(() => {
    if (!checkIn || !checkOut) {
      const list = [];
      rooms.forEach((room) => {
        const units = room.roomStatuses || [];
        units.forEach((unit) => {
          if (unit.status !== "Maintenance") {
            list.push({
              roomId: room.id,
              roomName: room.name,
              price: room.price,
              roomNumber: unit.roomNumber
            });
          }
        });
      });
      return list;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const bookedRoomNumbers = new Set();
    bookings.forEach((b) => {
      if (b.status !== "cancelled" && b.room_number) {
        const bStart = new Date(b.check_in);
        const bEnd = new Date(b.check_out);
        if (bStart < end && bEnd > start) {
          bookedRoomNumbers.add(b.room_number);
        }
      }
    });

    const list = [];
    rooms.forEach((room) => {
      const units = room.roomStatuses || [];
      units.forEach((unit) => {
        if (unit.status !== "Maintenance" && !bookedRoomNumbers.has(unit.roomNumber)) {
          list.push({
            roomId: room.id,
            roomName: room.name,
            price: room.price,
            roomNumber: unit.roomNumber
          });
        }
      });
    });

    return list;
  }, [rooms, bookings, checkIn, checkOut]);

  const assignAvailableRooms = React.useMemo(() => {
    if (!assignBooking) return [];

    const start = new Date(assignBooking.check_in);
    const end = new Date(assignBooking.check_out);

    const bookedRoomNumbers = new Set();
    bookings.forEach((b) => {
      if (b.id !== assignBooking.id && b.status !== "cancelled" && b.room_number) {
        const bStart = new Date(b.check_in);
        const bEnd = new Date(b.check_out);
        if (bStart < end && bEnd > start) {
          bookedRoomNumbers.add(b.room_number);
        }
      }
    });

    const targetRoomCategory = rooms.find(r => Number(r.id) === Number(assignBooking.room_id));
    if (!targetRoomCategory) return [];

    const list = [];
    const units = targetRoomCategory.roomStatuses || [];
    units.forEach((unit) => {
      if (unit.status !== "Maintenance" && !bookedRoomNumbers.has(unit.roomNumber)) {
        list.push(unit.roomNumber);
      }
    });

    return list;
  }, [rooms, bookings, assignBooking]);

  const handleOpenAssignModal = (booking) => {
    setAssignBooking(booking);
    setAssignRoomNumber("");
    setIsAssignModalOpen(true);
  };

  const handleAssignRoom = async (e) => {
    e.preventDefault();
    if (!assignBooking || !assignRoomNumber) return;

    setAssignSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/bookings/${assignBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room_number: assignRoomNumber
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to assign room.");
      }

      toast.success(`Room ${assignRoomNumber} assigned successfully to booking #${assignBooking.id}!`);
      setIsAssignModalOpen(false);
      setAssignBooking(null);
      setAssignRoomNumber("");
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Failed to assign room.");
    } finally {
      setAssignSaving(false);
    }
  };

  const handleOpenForm = async () => {
    await fetchUsersAndRooms();
    setCheckIn("");
    setCheckOut("");
    setSelectedRoomNumber("");
    setSelectedRoom("");
    setAdults(1);
    setChildren(0);
    setGuestMode("existing");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setPaymentMethod("cash");
    setIsFormOpen(true);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) {
      toast.warning("Please select a room and enter check-in/check-out dates.");
      return;
    }

    if (guestMode === "existing" && !selectedUser) {
      toast.warning("Please select a guest account.");
      return;
    }

    if (guestMode === "new" && (!guestName || !guestEmail || !guestPhone)) {
      toast.warning("Please enter all new guest details.");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      let finalUserId = null;

      if (guestMode === "new") {
        // Register the new user first
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: guestName,
            email: guestEmail,
            phone: guestPhone,
            password: "SreeRaagaGuest@123",
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.message || "Failed to register new guest.");
        }
        finalUserId = regData.userId;
      } else {
        finalUserId = Number(selectedUser);
      }

      // Create the booking
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: finalUserId,
          room_id: Number(selectedRoom),
          check_in: checkIn,
          check_out: checkOut,
          adults: Number(adults),
          children: Number(children),
          room_number: selectedRoomNumber || null,
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      toast.success("Booking created successfully!");
      setIsFormOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Failed to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
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

      toast.success(`Booking status changed to ${status}!`);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Failed to update booking status.");
    }
  };

  const handleUpdatePaymentMethod = async (id, paymentMethod) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment method.");
      }

      toast.success(`Payment method changed to ${paymentMethod.toUpperCase()}!`);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Failed to update payment method.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking.");
      }

      toast.success("Booking deleted successfully!");
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Failed to delete booking.");
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
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">
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
          className="bg-[#C8A64D] text-black px-3 py-0.5 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141]"
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
        <div className="bg-[#081A2F]  p-12 text-center rounded-xl text-white">
          No bookings found.
        </div>
      ) : (
        <div className="bg-[#081A2F] border border-white/10  rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <thead className="bg-[#071524] text-white/60 text-sm uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Guest Details</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Room booked</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Assign Room</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Reservation Dates</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Amount</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Payment</th>
                  <th className="p-4 text-left font-semibold text-[#c8a64d] ">Status</th>
                  <th className="p-4 text-center font-semibold text-[#c8a64d]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    {/* GUEST */}
                    <td className="p-4 ">
                      <div className="font-semibold text-[16px]">{b.guest_name}</div>
                      <div className="text-[16px] text-white mt-0.5">{b.guest_email}</div>
                      {b.guest_phone && <div className="text-[16px] text-white mt-0.5">{formatPhoneNumber(b.guest_phone)}</div>}
                    </td>

                    {/* ROOM */}
                    <td className="p-4 ">
                      <div className="text-white font-medium text-[16px]">{b.room_name}</div>
                      <div className="text-[16px] text-white mt-0.5">ID: BK-{b.id.toString().padStart(4, "0")}</div>
                    </td>

                    {/* ASSIGN ROOM */}
                    <td className="p-4 ">
                      {b.room_number ? (
                        <span className="text-xs text-green-400 font-semibold border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">
                          Room: {b.room_number}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(b)}
                          className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[12px] font-semibold transition cursor-pointer"
                        >
                          Assign Room
                        </button>
                      )}
                    </td>

                    {/* DATES */}
                    <td className="p-4 text-[16px] ">
                      <div className="flex items-center gap-">
                        <span>{new Date(b.check_in).toLocaleDateString("en-GB")}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                        <span>{new Date(b.check_out).toLocaleDateString("en-GB")}</span>
                      </div>
                      <div className="text-[16px] text-white mt-1">
                        Guests: {b.adults} Adults {b.children > 0 && `, ${b.children} Children`}
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 text-[#C8A64D] font-bold text-[18px] ">
                      ₹{parseFloat(b.total_price).toLocaleString()}
                    </td>

                    {/* PAYMENT METHOD */}
                    <td className="p-4 ">
                      <span
                        className={`text-[15px] px-3 py-1.5 rounded-full border font-semibold uppercase ${
                          b.payment_method === "online"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-[#C8A64D]/10 text-[#C8A64D] border-[#C8A64D]/20"
                        }`}
                      >
                        {b.payment_method || "cash"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 ">
                      <span
                        className={`text-[16px] px-3 py-1.5 rounded-full border font-semibold ${
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
                        {/* Confirm Button */}
                        <button
                          onClick={() => b.status === "pending" && handleUpdateStatus(b.id, "confirmed")}
                          disabled={b.status !== "pending"}
                          className={`p-1.5 rounded transition ${
                            b.status === "pending"
                              ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 cursor-pointer"
                              : "bg-white/5 text-white/20 cursor-not-allowed opacity-30"
                          }`}
                          title={b.status === "pending" ? "Confirm Booking" : "Cannot Confirm"}
                        >
                          <CheckCircle size={14} />
                        </button>

                        {/* Check In Button */}
                        <button
                          onClick={() => b.status === "confirmed" && handleUpdateStatus(b.id, "checked_in")}
                          disabled={b.status !== "confirmed"}
                          className={`p-1.5 rounded transition ${
                            b.status === "confirmed"
                              ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                              : "bg-white/5 text-white/20 cursor-not-allowed opacity-30"
                          }`}
                          title={b.status === "confirmed" ? "Check In" : "Cannot Check In"}
                        >
                          <UserCheck size={14} />
                        </button>

                        {/* Cancel Button */}
                        <button
                          onClick={() => {
                            if (b.status === "pending" || b.status === "confirmed") {
                              if (window.confirm("Are you sure you want to cancel this booking?")) {
                                handleUpdateStatus(b.id, "cancelled");
                              }
                            }
                          }}
                          disabled={b.status !== "pending" && b.status !== "confirmed"}
                          className={`p-1.5 rounded transition ${
                            b.status === "pending" || b.status === "confirmed"
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                              : "bg-white/5 text-white/20 cursor-not-allowed opacity-30"
                          }`}
                          title={b.status === "pending" || b.status === "confirmed" ? "Cancel Booking" : "Cannot Cancel"}
                        >
                          <XCircle size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="px-2.5 py-1.5 bg-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400 rounded cursor-pointer transition text-xs font-semibold"
                          title="Delete Booking Record"
                        >
                          Delete
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
                {/* Guest Selection Mode */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Guest Selection Mode</label>
                  <div className="flex gap-6 bg-[#071524] p-3 rounded-lg border border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80 hover:text-white">
                      <input
                        type="radio"
                        name="guestMode"
                        value="existing"
                        checked={guestMode === "existing"}
                        onChange={() => setGuestMode("existing")}
                        className="accent-yellow-500"
                      />
                      Select Existing User
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80 hover:text-white">
                      <input
                        type="radio"
                        name="guestMode"
                        value="new"
                        checked={guestMode === "new"}
                        onChange={() => setGuestMode("new")}
                        className="accent-yellow-500"
                      />
                      Register New Guest
                    </label>
                  </div>
                </div>

                {/* Guest Selection or Fields */}
                {guestMode === "existing" ? (
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Guest / User Account</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                    >
                      <option value="">-- Select Guest --</option>
                      {users.filter(u => u.role !== "admin").map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-yellow-500/5 p-4 rounded-lg border border-yellow-500/10">
                    <h3 className="col-span-1 md:col-span-3 text-xs font-semibold text-yellow-500 uppercase tracking-widest border-b border-yellow-500/10 pb-2 mb-1">
                      New Guest Information
                    </h3>
                    <div>
                      <label className="block text-yellow-500 text-[10px] uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-500 text-[10px] uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-500 text-[10px] uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Room Number dropdown */}
                <div className={guestMode === "new" ? "col-span-1 md:col-span-2" : ""}>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Number (Available Only)</label>
                  <select
                    value={selectedRoomNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedRoomNumber(val);
                      const found = availableRoomNumbers.find(item => item.roomNumber === val);
                      if (found) {
                        setSelectedRoom(found.roomId.toString());
                      } else {
                        setSelectedRoom("");
                      }
                    }}
                    required
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  >
                    <option value="">-- Select Room Number --</option>
                    {availableRoomNumbers.map((item) => (
                      <option key={item.roomNumber} value={item.roomNumber}>
                        {item.roomNumber} ({item.roomName}) - ₹{parseFloat(item.price).toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                  {availableRoomNumbers.length === 0 && (
                    <p className="text-[11px] text-red-400 mt-1">No available rooms found for the selected check-in/out dates.</p>
                  )}
                </div>

                {/* Dates range picker */}
                <div className="col-span-1 md:col-span-2 relative">
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Check In - Check Out</label>
                  <DatePicker
                    wrapperClassName="w-full"
                    selectsRange={true}
                    startDate={checkIn ? new Date(checkIn) : null}
                    endDate={checkOut ? new Date(checkOut) : null}
                    onChange={(update) => {
                      const [start, end] = update;
                      const formatDate = (date) => {
                        if (!date) return "";
                        const tzOffset = date.getTimezoneOffset() * 60000;
                        return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
                      };
                      setCheckIn(start ? formatDate(start) : "");
                      setCheckOut(end ? formatDate(end) : "");
                    }}
                    minDate={new Date()}
                    customInput={
                      <button
                        type="button"
                        className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white flex items-center justify-between outline-none cursor-pointer text-left focus:border-yellow-500 transition-all text-sm"
                      >
                        <span>
                          {checkIn
                            ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}${
                                checkOut
                                  ? ` - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                                  : " - Check Out"
                              }`
                            : "Select Check-in and Check-out dates"}
                        </span>
                        <ChevronDown size={16} className="text-white/40" />
                      </button>
                    }
                    calendarClassName="custom-datepicker"
                    popperModifiers={[
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "viewport",
                        },
                      },
                    ]}
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

                {/* Payment Method */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="online">Online Payment</option>
                  </select>
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

      {/* ASSIGN ROOM MODAL */}
      {isAssignModalOpen && assignBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAssignRoom}
            className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4"
          >
            <h2 className="text-lg font-bold border-b border-white/5 pb-2">
              Assign Room Number
            </h2>
            <div className="text-sm space-y-1.5 text-white/70">
              <p><span className="font-semibold text-white">Guest:</span> {assignBooking.guest_name}</p>
              <p><span className="font-semibold text-white">Category:</span> {assignBooking.room_name}</p>
              <p><span className="font-semibold text-white">Dates:</span> {new Date(assignBooking.check_in).toLocaleDateString("en-GB")} - {new Date(assignBooking.check_out).toLocaleDateString("en-GB")}</p>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Select Physical Room Number</label>
              <select
                value={assignRoomNumber}
                onChange={(e) => setAssignRoomNumber(e.target.value)}
                required
                className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="">-- Select Room Number --</option>
                {assignAvailableRooms.map((num) => (
                  <option key={num} value={num}>
                    Room {num} (Available)
                  </option>
                ))}
              </select>
              {assignAvailableRooms.length === 0 && (
                <p className="text-xs text-red-400 mt-2">No available rooms found in this category for the booking dates.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setAssignBooking(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignSaving || assignAvailableRooms.length === 0}
                className="px-4 py-2 rounded-lg bg-[#C8A64D] hover:bg-[#b09141] text-black font-bold flex items-center gap-1.5 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignSaving ? "Assigning..." : "Assign Room"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;