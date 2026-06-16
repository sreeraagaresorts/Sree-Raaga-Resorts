import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash,
  Plus,
  X,
  Upload,
  Users,
  Maximize,
  BedDouble,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";

const AdminRooms = () => {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      } else {
        throw new Error(data.message || "Failed to load rooms.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingRoom(null);
    setName("");
    setPrice("");
    setArea("");
    setBeds("");
    setBathrooms("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setIsFormOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setName(room.name);
    setPrice(room.price);
    setArea(room.area);
    setBeds(room.beds);
    setBathrooms(room.bathrooms);
    setDescription(room.description);
    setImageFile(null);
    setImagePreview(room.image ? (room.image.startsWith("http") ? room.image : `${API_URL}/uploads/${room.image}`) : "");
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("area", area);
    formData.append("beds", beds);
    formData.append("bathrooms", bathrooms);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let url = `${API_URL}/api/rooms`;
      let method = "POST";

      if (editingRoom) {
        url = `${API_URL}/api/rooms/${editingRoom.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save room.");
      }

      toast.success(editingRoom ? "Room updated successfully!" : "Room created successfully!");
      setIsFormOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.message || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete room.");
      }

      toast.success("Room deleted successfully!");
      fetchRooms();
    } catch (err) {
      toast.error(err.message || "Failed to delete room.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <p className="text-white/50 text-sm">
            Manage hotel rooms & inventory
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#081A2F] w-full max-w-3xl rounded-xl p-6 border border-white/10 my-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingRoom ? "Edit Room" : "Add Room"}</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* FORM UI */}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Room Name</label>
                  <input 
                    required 
                    placeholder="e.g. Royal Suite" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Price (₹ per night)</label>
                  <input 
                    required 
                    type="number" 
                    placeholder="e.g. 8000" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Area (e.g. 500 sqft)</label>
                  <input 
                    required 
                    placeholder="e.g. 500 SQ FT" 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Beds</label>
                  <input 
                    required 
                    placeholder="e.g. KING BED" 
                    value={beds} 
                    onChange={(e) => setBeds(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Bathrooms</label>
                  <input 
                    required 
                    placeholder="e.g. 1 BATHROOM" 
                    value={bathrooms} 
                    onChange={(e) => setBathrooms(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  placeholder="Describe the room amenities, view, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#071524] p-3 rounded-lg border border-white/10 outline-none focus:border-yellow-500 transition text-white"
                  rows={3}
                />
              </div>

              {/* IMAGE UPLOAD UI */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Room Image</label>
                <div className="border border-dashed border-white/20 p-6 rounded-lg text-center bg-[#071524] relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} className="max-h-40 mx-auto object-cover rounded" alt="Preview" />
                      <p className="text-[#C8A64D] text-xs">Click or drag another image to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto mb-2 text-[#C8A64D]" />
                      <p className="text-white/60 text-sm">Click or drag image to upload</p>
                    </>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
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
                  {saving ? "Saving..." : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROOM GRID */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 justify-center py-12">
          <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
          <span>Loading room inventory...</span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl">
          <p className="text-white/50 text-lg">No rooms created yet.</p>
          <button 
            onClick={openAddModal} 
            className="mt-4 px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg"
          >
            Create Your First Room
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300 flex flex-col justify-between"
            >
              {/* IMAGE */}
              <div>
                <img
                  src={getImageUrl(room.image)}
                  className="h-48 w-full object-cover"
                  alt={room.name}
                />

                {/* CONTENT */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-lg">{room.name}</h2>
                  </div>

                  <p className="text-[#C8A64D] font-bold text-lg">
                    ₹{parseFloat(room.price).toLocaleString()} <span className="text-white/40 text-xs font-normal">/ night</span>
                  </p>

                  <p className="text-white/50 text-xs line-clamp-2">
                    {room.description}
                  </p>

                  {/* INFO */}
                  <div className="flex gap-4 text-xs text-white/60 border-t border-white/5 pt-3">
                    <span className="flex items-center gap-1">
                      <BedDouble size={14} className="text-[#C8A64D]" />
                      {room.beds}
                    </span>

                    <span className="flex items-center gap-1">
                      <Maximize size={14} className="text-[#C8A64D]" />
                      {room.area}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 p-4 border-t border-white/5">
                <button 
                  onClick={() => openEditModal(room)}
                  className="flex-1 bg-white/10 py-2 rounded-lg flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                  title="Edit Room"
                >
                  <Edit size={14} className="mr-1" /> Edit
                </button>

                <button 
                  onClick={() => handleDelete(room.id)}
                  className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition cursor-pointer"
                  title="Delete Room"
                >
                  <Trash size={14} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRooms;