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
import { API_URL } from "../config/api";
import { compressImage } from "../utils/imageCompressor";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const AdminEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Enquiries states
  const [activeTab, setActiveTab] = useState("packages"); // "packages" or "enquiries"
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sqft, setSqft] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchEvents = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || "Failed to load events.");
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchEnquiries = async (silent = false) => {
    if (!silent) setEnquiriesLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/events/enquiries/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setEnquiries(data.data);
      } else {
        throw new Error(data.message || "Failed to load enquiries.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setEnquiriesLoading(false);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/events/enquiries/admin/${enquiryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete enquiry.");
      }

      toast.success("Enquiry deleted successfully!");
      fetchEnquiries();
    } catch (err) {
      toast.error(err.message || "Failed to delete enquiry.");
    }
  };

  useEffect(() => {
    if (activeTab === "packages") {
      fetchEvents();
    } else {
      fetchEnquiries();
    }

    const interval = setInterval(() => {
      if (activeTab === "packages") {
        fetchEvents(true);
      } else {
        fetchEnquiries(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const openAddModal = () => {
    setEditingEvent(null);
    setName("");
    setDescription("");
    setPrice("");
    setSqft("");
    setShowPrice(false);
    setImageFile(null);
    setImagePreview("");
    setIsFormOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setName(event.name);
    setDescription(event.description || "");
    setPrice(event.price || "");
    setSqft(event.sqft || "");
    setShowPrice(event.show_price || false);
    setImageFile(null);
    setImagePreview(event.image ? (event.image.startsWith("http") ? event.image : `${API_URL}/uploads/${event.image}`) : "");
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

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      // Compress image on the frontend before sending to prevent Nginx 413 Payload Too Large
      let compressedImage = imageFile;
      if (imageFile) {
        compressedImage = await compressImage(imageFile);
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("sqft", sqft);
      formData.append("show_price", showPrice);
      if (compressedImage) {
        formData.append("image", compressedImage);
      }

      let url = `${API_URL}/api/events`;
      let method = "POST";

      if (editingEvent) {
        url = `${API_URL}/api/events/${editingEvent.id}`;
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
      const response = await fetch(`${API_URL}/api/events/${id}`, {
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
    return `${API_URL}/uploads/${image}`;
  };

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Events & Packages Management</h1>
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

      {/* TABS */}
      <div className="flex gap-6 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab("packages")}
          className={`pb-3 px-1 font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "packages"
              ? "text-[#C8A64D] border-b-2 border-[#C8A64D]"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          Event Packages
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`pb-3 px-1 font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "enquiries"
              ? "text-[#C8A64D] border-b-2 border-[#C8A64D]"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          Event Enquiries ({enquiries.length})
        </button>
      </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Package Price (₹)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 150000" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Venue Size (Sq Ft)</label>
                    <input 
                      required
                      placeholder="e.g. 5,000 Sq Ft" 
                      value={sqft} 
                      onChange={(e) => setSqft(e.target.value)} 
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#071524] p-3 rounded-lg border border-white/5">
                  <input
                    type="checkbox"
                    id="showPrice"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#071524] border-white/10 rounded focus:ring-yellow-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="showPrice" className="text-white/80 text-sm font-semibold select-none cursor-pointer">
                    Show Price on Public Website (Toggle off to show "Enquire Now" only)
                  </label>
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
      {activeTab === "packages" && (
        loading ? (
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
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-semibold">
                        {event.sqft || "N/A Sq Ft"}
                      </span>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                        event.show_price 
                          ? "bg-green-500/10 text-green-400 border-green-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {event.show_price ? `₹${Number(event.price || 0).toLocaleString()}` : "Enquire Mode"}
                      </span>
                    </div>

                    <h2 className="font-bold text-lg">{event.name}</h2>
                    
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
        )
      )}

      {/* EVENT ENQUIRIES */}
      {activeTab === "enquiries" && (
        <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden">
          {enquiriesLoading && enquiries.length === 0 ? (
            <div className="flex items-center gap-2 text-white/60 justify-center py-12">
              <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
              <span>Loading event enquiries...</span>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center text-white/50">
              No event enquiries received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="bg-[#071524] text-[#C8A64D] text-xs uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Event Package</th>
                    <th className="px-6 py-4 text-center">Guests</th>
                    <th className="px-6 py-4">Submitted At</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id || enquiry._id} className="hover:bg-white/2 transition">
                      <td className="px-6 py-4 font-bold text-[#C8A64D]">#{enquiry.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">{enquiry.name}</td>
                      <td className="px-6 py-4">{formatPhoneNumber(enquiry.phone)}</td>
                      <td className="px-6 py-4 text-white/60">{enquiry.email}</td>
                      <td className="px-6 py-4 font-medium text-white">{enquiry.eventName}</td>
                      <td className="px-6 py-4 text-center font-bold">{enquiry.guests}</td>
                      <td className="px-6 py-4 text-white/40">
                        {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry.id || enquiry._id)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 mx-auto transition cursor-pointer font-bold text-xs"
                          title="Delete Enquiry"
                        >
                          <Trash size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;