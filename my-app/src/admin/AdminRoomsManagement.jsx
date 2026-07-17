import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BedDouble, 
  ChevronDown, 
  Plus, 
  RefreshCw, 
  Wrench, 
  CheckCircle,
  HelpCircle,
  Eye,
  MoreVertical
} from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";

const AdminRoomsManagement = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Status Change Modal State
  const [selectedUnit, setSelectedUnit] = useState(null); // { roomObj, unitObj }
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Add Room Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addRoomNumber, setAddRoomNumber] = useState("");
  const [addCategory, setAddCategory] = useState("Executive Rooms");
  const [addFloor, setAddFloor] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addStatus, setAddStatus] = useState("Available");
  const [addSaving, setAddSaving] = useState(false);

  // Edit Room Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOldRoomNumber, setEditOldRoomNumber] = useState("");
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editStatus, setEditStatus] = useState("Available");
  const [editSaving, setEditSaving] = useState(false);

  // Dropdown Menu State
  const [activeMenuRoom, setActiveMenuRoom] = useState(null);

  useEffect(() => {
    const closeMenu = () => setActiveMenuRoom(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const fetchRooms = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      } else {
        throw new Error(data.message || "Failed to load rooms.");
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Auto-refresh room statuses silently every 10 seconds
    const interval = setInterval(() => {
      fetchRooms(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Compute all individual room units across all categories
  const allUnits = React.useMemo(() => {
    const list = [];
    rooms.forEach((room) => {
      const statuses = room.roomStatuses || [];
      statuses.forEach((unit) => {
        const floor = unit.floor !== undefined && unit.floor !== null ? unit.floor : "";

        list.push({
          room,
          unit,
          floor
        });
      });
    });
    return list;
  }, [rooms]);

  // Filtered by category (used for statistics computation)
  const categoryFilteredUnits = React.useMemo(() => {
    return allUnits.filter(({ room }) => {
      return selectedCategory === "All" || room.category === selectedCategory;
    });
  }, [allUnits, selectedCategory]);

  // Compute statistics counts
  const stats = React.useMemo(() => {
    let available = 0;
    let occupied = 0;
    let reserved = 0;
    let maintenance = 0;
    let cleaning = 0;

    categoryFilteredUnits.forEach(({ unit }) => {
      if (unit.status === "Occupied") occupied++;
      else if (unit.status === "Reserved") reserved++;
      else if (unit.status === "Maintenance") maintenance++;
      else if (unit.status === "Cleaning") cleaning++;
      else available++;
    });

    return { available, occupied, reserved, maintenance, cleaning };
  }, [categoryFilteredUnits]);

  // Unique categories for filtering
  const categories = React.useMemo(() => {
    const cats = new Set();
    rooms.forEach((r) => {
      if (r.category) cats.add(r.category);
    });
    return ["All", ...Array.from(cats)];
  }, [rooms]);

  // Filtered unit list for display
  const filteredUnits = React.useMemo(() => {
    return categoryFilteredUnits.filter(({ unit }) => {
      return selectedStatus === "All" || unit.status === selectedStatus;
    });
  }, [categoryFilteredUnits, selectedStatus]);

  const openStatusModal = (room, unit) => {
    setSelectedUnit({ room, unit });
    setNewStatus(unit.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedUnit) return;
    setUpdating(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/rooms/${selectedUnit.room.id || selectedUnit.room._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomNumber: selectedUnit.unit.roomNumber,
          status: newStatus
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update unit status.");
      }

      toast.success(`Unit ${selectedUnit.unit.roomNumber} is now ${newStatus}`);
      setSelectedUnit(null);
      fetchRooms(true);
    } catch (err) {
      toast.error(err.message || "Failed to update unit status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!addRoomNumber || !addCategory) {
      toast.warning("Please enter Room Number and select Category.");
      return;
    }
    setAddSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/rooms/add-unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomNumber: addRoomNumber,
          categoryName: addCategory,
          floor: addFloor !== "" ? Number(addFloor) : null,
          price: addPrice ? parseFloat(addPrice) : undefined,
          status: addStatus
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add room unit.");
      }

      toast.success(`Room ${addRoomNumber} added successfully to ${addCategory}!`);
      setIsAddModalOpen(false);
      setAddRoomNumber("");
      setAddFloor("");
      setAddPrice("");
      setAddStatus("Available");
      fetchRooms(true);
    } catch (err) {
      toast.error(err.message || "Failed to add room unit.");
    } finally {
      setAddSaving(false);
    }
  };

  const openEditModal = (room, unit) => {
    setSelectedUnit({ room, unit });
    setEditOldRoomNumber(unit.roomNumber);
    setEditRoomNumber(unit.roomNumber);
    setEditFloor(unit.floor !== undefined && unit.floor !== null ? unit.floor : "");
    setEditStatus(unit.status);
    setIsEditModalOpen(true);
  };

  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    if (!editRoomNumber) {
      toast.warning("Room Number is required.");
      return;
    }
    setEditSaving(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/rooms/${selectedUnit.room.id || selectedUnit.room._id}/unit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldRoomNumber: editOldRoomNumber,
          newRoomNumber: editRoomNumber,
          floor: editFloor !== "" ? Number(editFloor) : null,
          status: editStatus
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update room unit.");
      }

      toast.success(`Room ${editRoomNumber} updated successfully!`);
      setIsEditModalOpen(false);
      setSelectedUnit(null);
      fetchRooms(true);
    } catch (err) {
      toast.error(err.message || "Failed to update room unit.");
    } finally {
      setEditSaving(false);
    }
  };

  const toggleCardMenu = (roomNo) => {
    setActiveMenuRoom((prev) => (prev === roomNo ? null : roomNo));
  };

  const handleDeleteUnit = async (roomCategory, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
      return;
    }
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/rooms/${roomCategory.id || roomCategory._id}/unit/${roomNumber}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete room unit.");
      }
      toast.success(`Room ${roomNumber} deleted successfully!`);
      fetchRooms(true);
    } catch (err) {
      toast.error(err.message || "Failed to delete room unit.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Occupied":
        return "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20";
      case "Reserved":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Maintenance":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Cleaning":
        return "bg-[#ffc300]/20 text-[#ffc300] border-[#ffc300]/30";
      default:
        return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  return (
    <div className="space-y-6 text-white max-w-[180vh] mx-auto select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <p className="text-white/50 text-sm">
           Manage room details, availability, pricing, and booking status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C8A64D] text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] min-w-[150px]"
          >
            <Plus size={16} /> Add Room
          </button>
          <Link
            to="/admin/bookings"
            className="bg-[#C8A64D] text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] min-w-[150px]"
          >
            My Booking
          </Link>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Available */}
        <div className="bg-[#081A2F] border border-green-500/20 p-5 rounded-xl">
          <span className="text-green-400 text-xs font-bold uppercase tracking-wider block">Available</span>
          <span className="text-4xl font-bold text-green-400 block mt-2">{stats.available}</span>
        </div>
            {/* Reserved */}
        <div className="bg-[#081A2F] border border-orange-500/20 p-5 rounded-xl">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-wider block">Reserved</span>
          <span className="text-4xl font-bold text-orange-400 block mt-2">{stats.reserved}</span>
        </div>
        {/* Occupied */}
        <div className="bg-[#081A2F] border border-[#06B6D4]/20 p-5 rounded-xl">
          <span className="text-[#06B6D4] text-xs font-bold uppercase tracking-wider block">Occupied</span>
          <span className="text-4xl font-bold text-[#06B6D4] block mt-2">{stats.occupied}</span>
        </div>
    
             {/* Cleaning Required */}
        <div className="bg-[#081A2F] border border-yellow-500/20 p-5 rounded-xl">
          <span className="text-[#ffc300] text-xs font-bold uppercase tracking-wider block">Cleaning Required</span>
          <span className="text-4xl font-bold text-[#ffc300] block mt-2">{stats.cleaning}</span>
        </div>
        {/* Maintenance */}
        <div className="bg-[#081A2F] border border-red-500/20 p-5 rounded-xl">
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider block">Maintenance</span>
          <span className="text-4xl font-bold text-red-400 block mt-2">{stats.maintenance}</span>
        </div>
   
      </div>

      {/* FILTERS */}
      <div className="bg-[#081A2F] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Filter by Room Type</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#071524] px-3 py-2.5 rounded-lg text-sm border border-white/10 text-white outline-none focus:border-[#C8A64D]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Room Types" : c}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Filter by Status</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#071524] px-3 py-2.5 rounded-lg text-sm border border-white/10 text-white outline-none focus:border-[#C8A64D]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
            
           
            <option value="Cleaning">Cleaning Required</option>
             <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* ROOM UNITS GRID */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 justify-center py-12">
          <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
          <span>Loading room status grid...</span>
        </div>
      ) : filteredUnits.length === 0 ? (
        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl">
          <p className="text-white/50 text-lg">No rooms match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUnits.map(({ room, unit, floor }) => (
            <div
              key={unit.roomNumber}
              className="bg-[#081A2F] border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-[#C8A64D]/50 transition-all duration-300 relative group"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#071524] rounded-lg text-[#C8A64D]">
                    <BedDouble size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-white">{unit.roomNumber}</h3>
                    <span className="text-xs text-white/70 block mt-0.5 leading-tight font-medium">{room.name}</span>
                    <span className="text-[11px] text-white/30 block leading-tight">{room.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 relative">
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold uppercase ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardMenu(unit.roomNumber);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-white/60 hover:text-white cursor-pointer bg-transparent border-0 flex items-center justify-center shrink-0"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuRoom === unit.roomNumber && (
                      <div className="absolute right-0 mt-1 w-32 bg-[#071524] border border-white/10 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuRoom(null);
                            openEditModal(room, unit);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-[11px] font-semibold text-white cursor-pointer bg-transparent border-0 whitespace-nowrap"
                        >
                          Edit Room
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuRoom(null);
                            handleDeleteUnit(room, unit.roomNumber);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-[11px] font-semibold text-red-400 cursor-pointer bg-transparent border-0 whitespace-nowrap"
                        >
                          Delete Room
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-4 border-t border-white/5 pt-3 space-y-1.5 text-[13px] text-white/70">
                {floor !== undefined && floor !== null && floor !== "" && (
                  <div className="flex justify-between">
                    <span>Floor</span>
                    <span className="text-white font-medium">{floor}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span className="text-white font-medium">₹{parseFloat(room.price).toLocaleString()}/night</span>
                </div>
                {unit.status === "Occupied" && (
                  <div className="flex justify-between text-[#06B6D4] font-medium">
                    <span>Guest</span>
                    <span>Occupied</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT ROOM UNIT MODAL */}
      {isEditModalOpen && selectedUnit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleUpdateUnit}
            className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4"
          >
            <h2 className="text-lg font-bold border-b border-white/5 pb-2">
              Edit Room Unit: {editOldRoomNumber}
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Edit the room unit settings. Changes here will immediately reflect in the status grid.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Number</label>
                <input
                  type="text"
                  required
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Floor Number</label>
                <input
                  type="text"
                  value={editFloor}
                  onChange={(e) => setEditFloor(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Select Room Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                >
                  <option value="Available">Available (Clean & Ready)</option>
                                    <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>

                 
                  <option value="Cleaning">Cleaning Required</option>
                   <option value="Maintenance">Maintenance (Out Of Service)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUnit(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="px-4 py-2 rounded-lg bg-[#C8A64D] hover:bg-[#b09141] text-black font-bold flex items-center gap-1.5 cursor-pointer border-0"
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ADD ROOM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddRoom}
            className="bg-[#081A2F] w-full max-w-md p-6 rounded-xl border border-white/10 space-y-4"
          >
            <h2 className="text-lg font-bold border-b border-white/5 pb-2">
              Add New Room Unit
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Add a new physical room number and associate it with a category.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HE-141"
                  value={addRoomNumber}
                  onChange={(e) => setAddRoomNumber(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Room Category</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                >
                  <option value="Executive Rooms">Executive Rooms</option>
                  <option value="Luxury Villas">1 BHK Villas (Luxury Villas)</option>
                  <option value="Compact Villas">Compact Villas</option>
                  <option value="Duplex Villa">Duplex Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Floor Number</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={addFloor}
                  onChange={(e) => setAddFloor(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Price per night (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 4990"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-wider mb-2">Initial Status</label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Cleaning">Cleaning Required</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addSaving}
                className="px-4 py-2 rounded-lg bg-[#C8A64D] hover:bg-[#b09141] text-black font-bold flex items-center gap-1.5 cursor-pointer border-0"
              >
                {addSaving ? "Adding..." : "Add Room"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminRoomsManagement;


