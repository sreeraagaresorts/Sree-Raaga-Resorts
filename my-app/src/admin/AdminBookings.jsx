import React, { useState, useEffect } from "react";
import {
  Edit,
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
// Replace selectedRoomNumber (string) with selectedRoomNumbers (array)
const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [saving, setSaving] = useState(false);
const [roomCount, setRoomCount] = useState(1);
const [selectedRoomCount, setSelectedRoomCount] = useState(1);
  // Assign Room Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBooking, setAssignBooking] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Edit Dates Modal State
  const [editBooking, setEditBooking] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [updatingDates, setUpdatingDates] = useState(false);

  // Extend Stay Modal State
  const [extendBooking, setExtendBooking] = useState(null);
  const [extendCheckOut, setExtendCheckOut] = useState("");
  const [extending, setExtending] = useState(false);

  // Settle Payment & Check Out State
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [settlePaymentMethod, setSettlePaymentMethod] = useState("cash");
  const [assignSaving, setAssignSaving] = useState(false);

  // Manual guest registration details
  const [guestMode, setGuestMode] = useState("new");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("+91");
  const [paymentMethod, setPaymentMethod] = useState("pay_later");
  const [bookingSource, setBookingSource] = useState("Direct");
  const [extraBed, setExtraBed] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "primary", onConfirm: null });

  // Cancel Booking Modal State
  const [cancelModal, setCancelModal] = useState({ isOpen: false, booking: null });
  const [cancelReason, setCancelReason] = useState("");

  const showConfirm = (title, message, type = "primary", onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (!val.startsWith("+91")) {
      setGuestPhone("+91");
      return;
    }
    const rawDigits = val.substring(3).replace(/\D/g, "");
    const limitedDigits = rawDigits.slice(0, 10);
    setGuestPhone(`+91${limitedDigits}`);
  };

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
      if (b.status !== "cancelled" && b.status !== "checked_out" && b.room_number) {
        const bStart = new Date(b.check_in);
        const bEnd = new Date(b.check_out);
        if (bStart < end && bEnd > start) {
          const nums = b.room_number.split(",").map(num => num.trim());
          nums.forEach(n => bookedRoomNumbers.add(n));
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


  const selectedRoomObject = React.useMemo(() => {
    return rooms.find((r) => r.id.toString() === selectedRoom.toString());
  }, [rooms, selectedRoom]);

  const baseCapacityPerRoom = selectedRoomObject?.max_guests || 2;
  const totalAllowedCapacity = baseCapacityPerRoom * (parseInt(roomCount) || 1);
  const filteredAvailableRoomNumbers = React.useMemo(() => {


    if (!selectedRoom) return [];
    return availableRoomNumbers.filter(
      (item) => item.roomId.toString() === selectedRoom.toString()
    );

    
  }, [availableRoomNumbers, selectedRoom]);

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
          const nums = b.room_number.split(",").map(num => num.trim());
          nums.forEach(n => bookedRoomNumbers.add(n));
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

    const currentRooms = assignBooking.room_number 
      ? assignBooking.room_number.split(",").map(r => r.trim())
      : [];
    currentRooms.forEach(num => {
      if (!list.includes(num)) {
        list.push(num);
      }
    });

    return list.sort();
  }, [rooms, bookings, assignBooking]);

  const handleOpenAssignModal = (booking) => {
    if (booking.status !== "confirmed" && booking.status !== "pending") {
      toast.error("Cannot assign or change room after check-in or cancellation.");
      return;
    }
    setAssignBooking(booking);
    const currentRooms = booking.room_number 
      ? booking.room_number.split(",").map(r => r.trim())
      : [];
    setSelectedRooms(currentRooms);
    setIsAssignModalOpen(true);
  };

  const handleAssignRoom = async (e) => {
    e.preventDefault();
    if (!assignBooking) return;
    if (assignBooking.status !== "confirmed" && assignBooking.status !== "pending") {
      toast.error("Cannot assign or change room after check-in or cancellation.");
      return;
    }
    if (selectedRooms.length !== assignBooking.rooms) {
      toast.error(`Please select exactly ${assignBooking.rooms} room(s).`);
      return;
    }

    setAssignSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    const roomNumberStr = selectedRooms.join(", ");

    try {
      const response = await fetch(`${API_URL}/api/bookings/${assignBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room_number: roomNumberStr
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to assign room.");
      }

      toast.success(`Rooms ${roomNumberStr} assigned successfully to booking #${assignBooking.id}!`);
      setIsAssignModalOpen(false);
      setAssignBooking(null);
      setSelectedRooms([]);
      setBookings((prev) => prev.map((b) => b.id === assignBooking.id ? { ...b, room_number: roomNumberStr } : b));
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
    setRoomCount(1); // Add this
    setSelectedRoomNumbers([]);
    setSelectedRoom("");
    setAdults(1);
    setChildren(0);
    setExtraBed(false);
    setGuestMode("new");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("+91");
    setPaymentMethod("pay_later");
    setBookingSource("Direct");
    setIsFormOpen(true);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) {
      toast.warning("Please select a room category and room number, and enter check-in/check-out dates.");
      return;
    }

if (!guestName || !guestPhone) {
  toast.warning("Please enter guest name and phone number.");
  return;
}

if (guestEmail && !/\S+@\S+\.\S+/.test(guestEmail)) {
  toast.warning("Please enter a valid email address.");
  return;
}

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(guestPhone)) {
      toast.warning("Phone number must be a valid 10-digit number starting with +91");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      let finalUserId = null;

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
          is_manual: true,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.message || "Failed to register new guest.");
      }
      finalUserId = regData.userId;

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: finalUserId,
          room_id: Number(selectedRoom),
          rooms: Number(roomCount), // Add this
          check_in: checkIn,
          check_out: checkOut,
          adults: Number(adults),
          children: Number(children),
          extraBed: extraBed,
          room_number: selectedRoomNumbers.join(", ")|| null,
          payment_method: paymentMethod,
          booking_source: bookingSource,
          is_manual: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      toast.success("Booking created successfully!");
      setIsFormOpen(false);
      fetchBookings(true);
    } catch (err) {
      toast.error(err.message || "Failed to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status, reason = "") => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const body = { status };
      if (status === "cancelled") body.cancellation_reason = reason;
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status.");
      }

      toast.success(`Booking status changed to ${status}!`);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status, ...data.data } : b));
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
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, payment_method: paymentMethod } : b));
    } catch (err) {
      toast.error(err.message || "Failed to update payment method.");
    }
  };

  const handleOpenEditDatesModal = (booking) => {
    setEditBooking(booking);
    setEditCheckIn(new Date(booking.check_in).toISOString().split("T")[0]);
    setEditCheckOut(new Date(booking.check_out).toISOString().split("T")[0]);
  };

  const handleUpdateDates = async (e) => {
    e.preventDefault();
    if (!editCheckIn || !editCheckOut) {
      toast.warning("Please specify both check-in and check-out dates.");
      return;
    }
    if (new Date(editCheckIn) >= new Date(editCheckOut)) {
      toast.warning("Check-out date must be after check-in date.");
      return;
    }

    // Check if the assigned room units are already booked by another active booking on the new dates
    if (editBooking.room_number) {
      const assignedRooms = editBooking.room_number.split(",").map(r => r.trim());
      const newStart = new Date(editCheckIn);
      const newEnd = new Date(editCheckOut);

      const hasConflict = bookings.some(b => {
        if (b.id === editBooking.id || b.status === "cancelled") return false;
        if (!b.room_number) return false;

        const otherRooms = b.room_number.split(",").map(r => r.trim());
        const shareRoom = assignedRooms.some(r => otherRooms.includes(r));
        if (!shareRoom) return false;

        const otherStart = new Date(b.check_in);
        const otherEnd = new Date(b.check_out);

        return newStart < otherEnd && newEnd > otherStart;
      });

if (hasConflict) {
    toast.error(`Room ${editBooking.room_number} is not available for the selected dates.`);
    return;
}
    }

    setConfirmModal({
      isOpen: true,
      title: "Update Booking Dates",
      message: `Are you sure you want to change the stay dates to: ${new Date(editCheckIn).toLocaleDateString("en-GB")} - ${new Date(editCheckOut).toLocaleDateString("en-GB")}?`,
      type: "primary",
      onConfirm: async () => {
        setUpdatingDates(true);
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        try {
          const response = await fetch(`${API_URL}/api/bookings/${editBooking.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              check_in: editCheckIn,
              check_out: editCheckOut,
              initial_price: editBooking.initial_price || editBooking.total_price,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to update booking dates.");
          }

          toast.success("Booking dates updated successfully!");
          fetchBookings(true);
          setEditBooking(null);
        } catch (err) {
          toast.error(err.message || "Failed to update booking dates.");
        } finally {
          setUpdatingDates(false);
        }
      }
    });
  };

  const handleOpenExtendModal = (booking) => {
    setExtendBooking(booking);
    setExtendCheckOut(new Date(booking.check_out).toISOString().split("T")[0]);
  };

  const handleExtendStay = async (e) => {
    e.preventDefault();
    if (!extendCheckOut) {
      toast.warning("Please select a new check-out date.");
      return;
    }

    const originalCheckOut = new Date(extendBooking.check_out);
    const newCheckOutDate = new Date(extendCheckOut);

    if (newCheckOutDate <= originalCheckOut) {
      toast.warning("New check-out date must be after the current check-out date.");
      return;
    }

    if (extendBooking.room_number) {
      const assignedRooms = extendBooking.room_number.split(",").map(r => r.trim());
      const extensionStart = originalCheckOut;
      const extensionEnd = newCheckOutDate;

      const hasConflict = bookings.some(b => {
        if (b.id === extendBooking.id || b.status === "cancelled") return false;
        if (!b.room_number) return false;

        const otherRooms = b.room_number.split(",").map(r => r.trim());
        const shareRoom = assignedRooms.some(r => otherRooms.includes(r));
        if (!shareRoom) return false;

        const otherStart = new Date(b.check_in);
        const otherEnd = new Date(b.check_out);

        return otherStart < extensionEnd && otherEnd > extensionStart;
      });
if (hasConflict) {
    toast.error(`Cannot extend, Room ${extendBooking.room_number} is already booked for the selected extension dates.`);
    return;
}
    }

    setConfirmModal({
      isOpen: true,
      title: "Extend Guest Stay",
      message: `Are you sure you want to extend this stay until ${new Date(extendCheckOut).toLocaleDateString("en-GB")}?`,
      type: "primary",
      onConfirm: async () => {
        setExtending(true);
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        try {
          const response = await fetch(`${API_URL}/api/bookings/${extendBooking.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              check_out: extendCheckOut,
              initial_price: extendBooking.initial_price || extendBooking.total_price,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to extend stay.");
          }

          toast.success("Stay extended successfully!");
          fetchBookings(true);
          setExtendBooking(null);
        } catch (err) {
          toast.error(err.message || "Failed to extend stay.");
        } finally {
          setExtending(false);
        }
      }
    });
  };

  const handleCheckInClick = (b) => {
    const today = new Date();
    const checkInDate = new Date(b.check_in);
    
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkInZero = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());
    
    let confirmMsg = "Are you sure you want to check in this guest today?";
    if (todayZero.getTime() !== checkInZero.getTime()) {
      const todayStr = today.toLocaleDateString("en-GB");
      const checkInStr = checkInDate.toLocaleDateString("en-GB");
      confirmMsg = `Today is ${todayStr}. The booking check-in date is ${checkInStr}.\nAre you sure you want to perform check-in on this date?`;
    }

    showConfirm("Confirm Guest Check-In", confirmMsg, "primary", () => {
      handleUpdateStatus(b.id, "checked_in");
    });
  };

  const handleCheckOutClick = (b) => {
    if (b.payment_method === "pay_later") {
      setCheckoutBooking(b);
      setSettlePaymentMethod("cash");
    } else {
      showConfirm(
        "Confirm Guest Check-Out",
        "Are you sure you want to check out this guest? This will move the record to the Billing History.",
        "primary",
        () => {
          handleUpdateStatus(b.id, "checked_out");
        }
      );
    }
  };

  const handleSettleAndCheckOut = (e) => {
    e.preventDefault();
    showConfirm(
      "Confirm Settlement & Check-Out",
      "Confirm payment received and check out this guest?",
      "primary",
      async () => {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        try {
          const response = await fetch(`${API_URL}/api/bookings/${checkoutBooking.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "checked_out",
              payment_method: settlePaymentMethod,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to settle payment and check out.");
          }

          toast.success("Payment settled and guest checked out successfully!");
          setBookings((prev) =>
            prev.map((b) =>
              b.id === checkoutBooking.id
                ? {
                    ...b,
                    status: "checked_out",
                    payment_method: settlePaymentMethod,
                    payment_status: "Paid",
                    ...data.data,
                  }
                : b
            )
          );
          setCheckoutBooking(null);
        } catch (err) {
          toast.error(err.message || "Failed to check out.");
        }
      }
    );
  };

  const handleDelete = (id) => {
    showConfirm(
      "Delete Booking Record",
      "Are you sure you want to permanently delete this booking record? This action cannot be undone.",
      "destructive",
      async () => {
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
          setBookings((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
          toast.error(err.message || "Failed to delete booking.");
        }
      }
    );
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.guest_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.guest_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.room_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const getLocalDateString = (dateInput) => {
      if (!dateInput) return "";
      const d = new Date(dateInput);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateString(new Date());
    const checkInStr = getLocalDateString(b.check_in);

    let matchesFilter = true;
    
// Hide checked_out AND cancelled bookings from standard views to simulate them moving to History
    if (statusFilter === "Today") {
      matchesFilter = checkInStr === todayStr && b.status !== "checked_out" && b.status !== "cancelled";
    } else if (statusFilter === "Reservations") {
      matchesFilter = checkInStr > todayStr && b.status !== "checked_in" && b.status !== "checked_out" && b.status !== "cancelled";
    } else if (statusFilter === "All") {
      matchesFilter = b.status !== "checked_out" && b.status !== "cancelled";
    } else {
      matchesFilter = (b.status || "").toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && matchesFilter;
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
          className="bg-[#C8A64D] text-black px-4 py-2 text-sm rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141]"
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
           <option value="All">All Active Bookings</option>
          <option value="Today"> Today Checking-in</option>
                 <option value="checked_in">Checked In</option>
          <option value="confirmed">Confirmed</option>
   
          <option value="Reservations">Reservations</option>
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
        <div className="flex items-center gap-2  justify-center py-12">
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
              <thead className="bg-[#071524]  text-sm uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Guest Details</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Room Booked</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Assign Room</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Booking Dates</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#c8a64d]">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#c8a64d]">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#c8a64d]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    {/* GUEST */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[15px]">{b.guest_name}</div>
                         {b.guest_phone &&
                       <div className="text-[14px] text-white mt-0.5">{formatPhoneNumber(b.guest_phone)}</div>}
                      <div className="text-[14px] text-white mt-0.5">{b.guest_email}</div>
                    </td>

                    {/* ROOM */}
                    <td className="px-4 py-3">
                      <div className="text-white font-medium text-[15px]">{b.room_name}</div>
                      <div className="text-[14px] text-white mt-0.5">ID: BK-{b.id.toString().padStart(4, "0")}</div>
                      <div className="text-[12px] text-yellow-500 mt-1 font-semibold">
                        Source: {
                          (b.payment_method === "online" || b.payment_method === "razorpay")
                            ? "Website"
                            : (b.booking_source === "Direct" || b.booking_source === "Walkin" || b.booking_source === "Walk-in" || !b.booking_source)
                            ? "Direct"
                            : b.booking_source === "MakeMyTrip"
                            ? "Make My Trip"
                            : b.booking_source
                        }
                      </div>
                    </td>

                    {/* ASSIGN ROOM */}
                    <td className="px-4 py-3">
                      {b.room_number ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-green-400 font-semibold border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">
                            Room: {b.room_number}
                          </span>
                          {(b.status === "confirmed" || b.status === "pending") && (
                            <button
                              onClick={() => handleOpenAssignModal(b)}
                              className="p-1 bg-white/5 hover:bg-white/10  hover:text-white rounded transition cursor-pointer"
                              title="Change Assigned Room"
                            >
                              <Edit size={12} />
                            </button>
                          )}
                        </div>
                      ) : (
                        (b.status === "confirmed" || b.status === "pending") ? (
                          <button
                            onClick={() => handleOpenAssignModal(b)}
                            className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[12px] font-semibold transition cursor-pointer"
                          >
                            Assign Room
                          </button>
                        ) : (
                          <span className="text-xs text-white italic">Not Assigned</span>
                        )
                      )}
                    </td>

                    {/* DATES */}
                    <td className="px-4 py-3 text-[15px]">
                      <div className="flex items-center gap-1.5">
                        <span>{new Date(b.check_in).toLocaleDateString("en-GB")}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                        <span>{new Date(b.check_out).toLocaleDateString("en-GB")}</span>
                        {(b.status === "confirmed" || b.status === "pending") && (
                          <button
                            onClick={() => handleOpenEditDatesModal(b)}
                            className="p-1 bg-white/5 hover:bg-white/10 text-yellow-400 hover:text-yellow-300 rounded transition cursor-pointer"
                            title="Edit Stay Dates"
                          >
                            <Edit size={12} />
                          </button>
                        )}
                      </div>
                      <div className="text-[14px]  mt-1">
                        Guests: {b.adults} Adults {b.children > 0 && `, ${b.children} Children`}
                      </div>
                      {b.extraBed && (
                        <div className="mt-1.5">
                          <span className="text-[12px] font-semibold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                            Extra Bed Requested
                          </span>
                        </div>
                      )}
                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-3 text-center">
                      {(() => {
                        const initialPrice = (b.initial_price && b.initial_price > 0) ? b.initial_price : b.total_price;
                        const isExtended = b.total_price > initialPrice;
                        return (
                          <>
                            <div className="text-[#C8A64D] font-bold text-[16px]">
                              ₹{initialPrice.toLocaleString()}
                            </div>
                            {isExtended ? (
                              <div className="text-red-400 text-xs mt-1 font-semibold">
                                Due: ₹{(b.total_price - initialPrice).toLocaleString()}
                              </div>
                            ) : (
                              b.payment_status === "Unpaid" && (
                                <div className="text-red-400 text-xs mt-1 font-semibold">
                                  Due: ₹{b.total_price.toLocaleString()}
                                </div>
                              )
                            )}
                          </>
                        );
                      })()}
                    </td>

                    {/* PAYMENT METHOD */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold uppercase ${
                          b.payment_status === "Unpaid"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : b.payment_method === "online"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : b.payment_method === "credit_card"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : b.payment_method === "upi"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : b.payment_method === "bank_transfer"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : b.payment_method === "pay_later"
                            ? "bg-orange-500/10 text-red-400 border-orange-500/20"
                            : "bg-[#C8A64D]/10 text-[#C8A64D] border-[#C8A64D]/20"
                        }`}
                      >
                        {b.payment_status === "Unpaid"
                          ? "Unpaid"
                          : b.payment_method === "online" 
                          ? "Razorpay" 
                          : b.payment_method === "credit_card" 
                          ? "Debit/Credit Card" 
                          : b.payment_method === "pay_later"
                          ? "Unpaid"
                          : (b.payment_method || "cash").replace("_", " ")}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                          b.status === "confirmed"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : b.status === "checked_in"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : b.status === "checked_out"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : b.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {/* Check In / Check Out Button */}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => {
                              if (!b.room_number) {
                                toast.error("Please assign a room before checking in.");
                                return;
                              }
                              handleCheckInClick(b);
                            }}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded cursor-pointer transition text-xs font-semibold"
                          >
                            Check In
                          </button>
                        )}
                        {b.status === "checked_in" && (
                          <>
                            <button
                              onClick={() => handleCheckOutClick(b)}
                              className="px-2 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded cursor-pointer transition text-xs font-semibold"
                            >
                              Check Out
                            </button>
                            <button
                              onClick={() => handleOpenExtendModal(b)}
                              className="px-2 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded cursor-pointer transition text-xs font-semibold"
                            >
                              Extend
                            </button>
                          </>
                        )}

                        {/* Cancel Button */}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => {
                              setCancelReason("");
                              setCancelModal({ isOpen: true, booking: b });
                            }}
                            className="px-2 py-1 bg-yellow-500/20 text-red-400 hover:bg-yellow-500/70 rounded cursor-pointer transition text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="px-2 py-1 bg-white/10  hover:bg-red-500/20 hover:text-red-400 rounded cursor-pointer transition text-xs font-semibold"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 md:p-10">
          <div className="bg-[#081A2F] w-full max-w-5xl p-6 md:p-8 rounded-xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-xl font-bold">New Booking Creation</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className=" hover:text-white cursor-pointer"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 ">
         
                  <div>
                    <label className="block text-yellow-500 text-[12px] uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter the Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
                 
                  <div>
                    <label className="block text-yellow-500 text-[12px] uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter Your Phone Number"
                      value={guestPhone}
                      onChange={handlePhoneChange}
                      required
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
                   <div>
                    <label className="block text-yellow-500 text-[12px] uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter Email (Optional) "
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
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
                    calendarClassName="custom-datepicker mt-14"
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
                {/* Room Category dropdown */}
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Category</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => {
                      setSelectedRoom(e.target.value);
                      setSelectedRoomNumbers([]);
                      setRoomCount(1);
                    }}
                    required
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                  >
                    <option value="">-- Select Category --</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ₹{parseFloat(room.price).toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>

       <div>
  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">
    Select Room Number(s)
  </label>
  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-[#071524] border border-white/10 rounded-lg">
    {filteredAvailableRoomNumbers.map((item) => {
      const isSelected = selectedRoomNumbers.includes(item.roomNumber);
      return (
        <button
          key={item.roomNumber}
          type="button"
          onClick={() => {
            if (isSelected) {
              const updated = selectedRoomNumbers.filter(n => n !== item.roomNumber);
              setSelectedRoomNumbers(updated);
              setRoomCount(updated.length || 1);
            } else {
              const updated = [...selectedRoomNumbers, item.roomNumber];
              setSelectedRoomNumbers(updated);
              setRoomCount(updated.length);
            }
          }}
          className={`p-2 text-xs rounded border transition ${
            isSelected 
              ? "bg-[#C8A64D] text-black border-[#C8A64D]" 
              : "bg-[#081A2F] text-white border-white/10 hover:border-white/30"
          }`}
        >
          {item.roomNumber}
        </button>
      );
    })}
  </div>
</div>

               
{/* Number of Rooms */}
<div>
  <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Number of Rooms</label>
  <input
    type="number"
    value={roomCount}
    readOnly
    className="w-full bg-[#071524]/50 border border-white/10 rounded-lg p-3 text-white/70 outline-none cursor-not-allowed"
  />
</div>
                {/* Adults & Children */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Adults (18+ Years)</label>
                    <input
                      type="number"
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Children (Below 10 Years)</label>
                    <input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Payment Method & Booking Source */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                    >
                      <option value="pay_later">Pay Later</option>
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="credit_card">Debit/Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Booking Source</label>
                    <select
                      value={bookingSource}
                      onChange={(e) => setBookingSource(e.target.value)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                    >
                      <option value="Direct">Direct</option>
                      <option value="Make My Trip">Make My Trip</option>
                      <option value="Goibibo">Goibibo</option>
                    </select>
                  </div>
                </div>
                
                {/* Extra Bed Checkbox (Second Column) */}
                <div className="flex items-center gap-3 bg-yellow-500/5 p-3.5 rounded-lg border border-yellow-500/10 self-end h-[50px]">
                  <input
                    type="checkbox"
                    id="extraBedCheckbox"
                    checked={extraBed}
                    onChange={(e) => setExtraBed(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#071524] border-white/10 accent-yellow-500 cursor-pointer"
                  />
                  <label htmlFor="extraBedCheckbox" className="text-yellow-500 text-xs uppercase tracking-wider cursor-pointer select-none font-semibold">
                    Request Extra Bed (₹1,500 / night per room)
                  </label>
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
                  {saving ? "Creating..." : "Create Booking"}
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
              Assign / Change Room Number
            </h2>
            <div className="text-sm space-y-1.5 text-white/70">
              <p><span className="font-semibold text-white">Guest:</span> {assignBooking.guest_name}</p>
              <p><span className="font-semibold text-white">Category:</span> {assignBooking.room_name}</p>
              <p><span className="font-semibold text-white">Dates:</span> {new Date(assignBooking.check_in).toLocaleDateString("en-GB")} - {new Date(assignBooking.check_out).toLocaleDateString("en-GB")}</p>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">
                Select Rooms (Please select exactly {assignBooking.rooms} {assignBooking.rooms > 1 ? "rooms" : "room"})
              </label>
              
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-[#071524] border border-white/10 rounded-lg">
                {assignAvailableRooms.map((num) => {
                  const isChecked = selectedRooms.includes(num);
                  return (
                    <label
                      key={num}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                          : "bg-white/5 border-white/5 text-white/70 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedRooms(prev => prev.filter(r => r !== num));
                          } else {
                            if (selectedRooms.length >= assignBooking.rooms) {
                              if (assignBooking.rooms === 1) {
                                setSelectedRooms([num]);
                              } else {
                                toast.error(`You can only select up to ${assignBooking.rooms} rooms.`);
                              }
                            } else {
                              setSelectedRooms(prev => [...prev, num]);
                            }
                          }
                        }}
                        className="accent-yellow-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold text-sm">Room {num}</span>
                    </label>
                  );
                })}
              </div>
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
                  setSelectedRooms([]);
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignSaving || selectedRooms.length !== assignBooking.rooms}
                className="px-4 py-2 rounded-lg bg-[#C8A64D] hover:bg-[#b09141] text-black font-bold flex items-center gap-1.5 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignSaving ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT DATES MODAL */}
      {editBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Edit Booking Dates</h2>
              <button 
                onClick={() => setEditBooking(null)}
                className=" hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

   <form onSubmit={handleUpdateDates} className="space-y-4">
              <div className="relative">
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Check In - Check Out Dates</label>
                <DatePicker
                  wrapperClassName="w-full"
                  selectsRange={true}
                  startDate={editCheckIn ? new Date(editCheckIn) : null}
                  endDate={editCheckOut ? new Date(editCheckOut) : null}
                  minDate={new Date()}
                  onChange={(update) => {
                    const [start, end] = update;
                    const formatDate = (date) => {
                      if (!date) return "";
                      const tzOffset = date.getTimezoneOffset() * 60000;
                      return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
                    };

                    const originalNights = editBooking && (() => {
                      const s = new Date(editBooking.check_in);
                      const e = new Date(editBooking.check_out);
                      return Math.round((e - s) / (1000 * 60 * 60 * 24));
                    })();

                    if (originalNights && start) {
                      const calculatedEnd = new Date(start.getTime() + originalNights * 24 * 60 * 60 * 1000);
                      setEditCheckIn(formatDate(start));
                      setEditCheckOut(formatDate(calculatedEnd));
                    } else {
                      setEditCheckIn(start ? formatDate(start) : "");
                      setEditCheckOut(end ? formatDate(end) : "");
                    }
                  }}
                  customInput={
                    <button
                      type="button"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white flex items-center justify-between outline-none cursor-pointer text-left focus:border-[#C8A64D] transition-all text-sm"
                    >
                      <span>
                        {editCheckIn
                          ? `${new Date(editCheckIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}${
                              editCheckOut
                                ? ` - ${new Date(editCheckOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
                                : " - Check Out"
                            }`
                          : "Select Check-in and Check-out dates"}
                      </span>
                      <ChevronDown size={16} className="text-white/40" />
                    </button>
                  }
                  calendarClassName="custom-datepicker mt-14"
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

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBooking(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded font-semibold cursor-pointer border-0 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingDates}
                  className="px-4 py-2 bg-[#C8A64D] hover:bg-[#b09141] text-black rounded font-bold border-0 cursor-pointer transition text-sm disabled:opacity-50"
                >
                  {updatingDates ? "Updating..." : "Save Dates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXTEND STAY MODAL */}
      {extendBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Extend Guest Stay</h2>
              <button 
                onClick={() => setExtendBooking(null)}
                className=" hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExtendStay} className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-2 text-sm text-white/80">
                <p><span className="font-semibold text-white">Room(s):</span> {extendBooking.room_number || "—"}</p>
                <p><span className="font-semibold text-white">Current Check-In:</span> {new Date(extendBooking.check_in).toLocaleDateString("en-GB")}</p>
                <p><span className="font-semibold text-white">Current Check-Out:</span> {new Date(extendBooking.check_out).toLocaleDateString("en-GB")}</p>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">New Check Out Date</label>
                <DatePicker
                  wrapperClassName="w-full"
                  selected={extendCheckOut ? new Date(extendCheckOut) : null}
                  onChange={(date) => {
                    if (!date) {
                      setExtendCheckOut("");
                      return;
                    }
                    const tzOffset = date.getTimezoneOffset() * 60000;
                    const dateStr = new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
                    setExtendCheckOut(dateStr);
                  }}
                  minDate={new Date(new Date(extendBooking.check_out).getTime() + 24 * 60 * 60 * 1000)}
                  customInput={
                    <button
                      type="button"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white flex items-center justify-between outline-none cursor-pointer text-left focus:border-[#C8A64D] transition-all text-sm"
                    >
                      <span>
                        {extendCheckOut
                          ? new Date(extendCheckOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "Select new Check-out date"}
                      </span>
                      <ChevronDown size={16} className="text-white/40" />
                    </button>
                  }
                  calendarClassName="custom-datepicker mt-14"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendBooking(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded font-semibold cursor-pointer border-0 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extending}
                  className="px-4 py-2 bg-[#C8A64D] hover:bg-[#b09141] text-black rounded font-bold border-0 cursor-pointer transition text-sm disabled:opacity-50"
                >
                  {extending ? "Extending..." : "Save Extension"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTLE PAYMENT & CHECK OUT MODAL */}
      {checkoutBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-[18px] font-bold text-white">Settle Outstanding Due & Check Out</h2>
              <button 
                onClick={() => setCheckoutBooking(null)}
                className=" hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSettleAndCheckOut} className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-2 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase">Booking ID</p>
                    <p className="text-white font-bold text-sm">BK-{checkoutBooking.id.toString().padStart(4, "0")}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase">Outstanding Due</p>
                    <p className="text-red-400 font-bold text-lg">₹{parseFloat(checkoutBooking.total_price).toLocaleString()}</p>
                  </div>
                </div>
                {checkoutBooking.guest_phone && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-white/40 text-xs uppercase">Guest Phone</p>
                    <a
                      href={`tel:${checkoutBooking.guest_phone}`}
                      className="text-yellow-400 hover:text-yellow-300 font-bold text-sm block mt-0.5 hover:underline"
                    >
                      {formatPhoneNumber(checkoutBooking.guest_phone)}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Select Settle Payment Method</label>
                <select
                  value={settlePaymentMethod}
                  onChange={(e) => setSettlePaymentMethod(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8A64D]"
                  required
                >
                  <option value="cash" className="text-black bg-white">Cash</option>
                  <option value="upi" className="text-black bg-white">UPI</option>
                  <option value="credit_card" className="text-black bg-white">Debit/Credit Card</option>
                  <option value="bank_transfer" className="text-black bg-white">Bank Transfer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutBooking(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded font-semibold cursor-pointer border-0 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C8A64D] hover:bg-[#b09141] text-black rounded font-bold border-0 cursor-pointer transition text-sm"
                >
                  Confirm and Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL BOOKING MODAL */}
      {cancelModal.isOpen && cancelModal.booking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#081A2F] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Booking</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Booking #{cancelModal.booking.id} — {cancelModal.booking.guest_name}
                </p>
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-xs font-semibold text-[#C8A64D] uppercase tracking-wider mb-2">
                Reason for Cancellation <span className="text-red-400">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={4}
                placeholder="Enter the reason for cancelling this booking "
                className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#C8A64D] resize-none placeholder:text-white/30 leading-relaxed"
              />
              {!cancelReason.trim() && (
                <p className="text-xs text-white/40 mt-1.5">A reason is required to proceed with cancellation.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={!cancelReason.trim()}
                onClick={() => {
                  handleUpdateStatus(cancelModal.booking.id, "cancelled", cancelReason.trim());
                  setCancelModal({ isOpen: false, booking: null });
                  setCancelReason("");
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition cursor-pointer"
              >
                Confirm Cancellation
              </button>
              <button
                type="button"
                onClick={() => { setCancelModal({ isOpen: false, booking: null }); setCancelReason(""); }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#081A2F] border border-white/10 rounded-2xl p-6 max-w-xl w-full text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mb-2">
              <RefreshCw className={`w-6 h-6 ${confirmModal.type === "destructive" ? "text-red-400 animate-spin" : "text-[#C8A64D]"}`} />
            </div>
            
            <h3 className="text-lg font-bold text-white tracking-wide">
              {confirmModal.title}
            </h3>
            
            <p className="text-[20px] text-white  leading-relaxed">
              {confirmModal.message}
            </p>
            
            <div className="flex gap-3 pt-2">
              
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ isOpen: false, title: "", message: "", type: "primary", onConfirm: null });
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition cursor-pointer text-sm ${
                  confirmModal.type === "destructive"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-[#C8A64D] hover:bg-[#b09141] text-black"
                }`}
              >
                Confirm
              </button>
               <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, title: "", message: "", type: "primary", onConfirm: null })}
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;