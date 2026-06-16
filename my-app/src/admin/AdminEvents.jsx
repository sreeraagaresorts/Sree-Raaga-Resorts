import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash,
  Plus,
  X,
  Upload,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../ui/components/Toast";

const AdminEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || "Failed to load events.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setName("");
    setCategory("Wedding");
    setEventDate("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setIsFormOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setName(event.name);
    setCategory(event.category);
    setEventDate(event.event_date || "");
    setDescription(event.description || "");
    setImageFile(null);
    setImagePreview(event.image ? (event.image.startsWith("http") ? event.image : `http://localhost:5000/uploads/${event.image}`) : "");
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
    formData.append("category", category);
    formData.append("event_date", eventDate);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let url = "http://localhost:5000/api/events";
      let method = "POST";

      if (editingEvent) {
        url = `http://localhost:5000/api/events/${editingEvent.id}`;
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
        throw new Error(data.message || "Failed to save event.");
      }

      toast.success(editingEvent ? "Event updated successfully!" : "Event created successfully!");
      setIsFormOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event.");
      }

      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      toast.error(err.message || "Failed to delete event.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Events Management</h1>
          <p className="text-white/50 text-sm">
            Manage resort activities, weddings, and conferences
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition"
        >
          <Plus size={16} /> Add Event
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
          <div className="bg-[#081A2F] w-full max-w-2xl rounded-xl p-6 border border-white/10 my-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingEvent ? "Edit Event" : "Create Event"}</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* FORM UI */}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Event Title</label>
                  <input 
                    required 
                    placeholder="e.g. Luxury Wedding Ceremony" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Business">Business</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Event Date / Availability</label>
                  <input 
                    required 
                    placeholder="e.g. 2026-10-15 or Available Year Round" 
                    value={eventDate} 
                    onChange={(e) => setEventDate(e.target.value)} 
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  placeholder="Provide event package descriptions, catering details, venue layouts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#071524] p-3 rounded-lg border border-white/10 outline-none focus:border-yellow-500 transition text-white"
                  rows={3}
                />
              </div>

              {/* IMAGE UPLOAD UI */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Event Image</label>
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
                  {saving ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT GRID */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 justify-center py-12">
          <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
          <span>Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl">
          <p className="text-white/50 text-lg">No events created yet.</p>
          <button 
            onClick={openAddModal} 
            className="mt-4 px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300 flex flex-col justify-between"
            >
              {/* IMAGE */}
              <div>
                <img
                  src={getImageUrl(event.image)}
                  className="h-48 w-full object-cover"
                  alt={event.name}
                />

                {/* CONTENT */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[#C8A64D] text-[10px] uppercase tracking-widest font-semibold border border-[#C8A64D]/25 px-2 py-0.5 rounded">
                      {event.category}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg">{event.name}</h2>
                  
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Calendar size={14} className="text-[#C8A64D]" />
                    <span>{event.event_date}</span>
                  </div>

                  <p className="text-white/50 text-xs line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 p-4 border-t border-white/5">
                <button 
                  onClick={() => openEditModal(event)}
                  className="flex-1 bg-white/10 py-2 rounded-lg flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                  title="Edit Event"
                >
                  <Edit size={14} className="mr-1" /> Edit
                </button>

                <button 
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition cursor-pointer"
                  title="Delete Event"
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

export default AdminEvents;