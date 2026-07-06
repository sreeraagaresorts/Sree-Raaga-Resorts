import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  Plus,
  X,
  Upload,
  Users,
  Maximize,
  BedDouble,
  RefreshCw,
  GripVertical // Add this import
} from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { compressImage } from "../utils/imageCompressor";

const AdminRooms = () => {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] = useState(false);

  // Room category list state
  const [roomCategories, setRoomCategories] = useState([]);

  // Category form modal state
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState("Villas");
  const [editingCategory, setEditingCategory] = useState(null);
const [draggedCatIndex, setDraggedCatIndex] = useState(null);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, index) => {
    setDraggedCatIndex(index);
    e.dataTransfer.effectAllowed = "move"; 
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === dropIndex) return;

    const updatedCategories = [...roomCategories];
    const draggedItem = updatedCategories[draggedCatIndex];

    updatedCategories.splice(draggedCatIndex, 1);
    updatedCategories.splice(dropIndex, 0, draggedItem);

    setRoomCategories(updatedCategories);
    setDraggedCatIndex(null);

    // Backend Update 
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/room-categories/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          orderedIds: updatedCategories.map(cat => cat._id || cat.id) 
        }),
      });
      
      if (!response.ok) throw new Error("Failed to save order");
      toast.success("Category order updated!");
    } catch (err) {
      toast.error("Failed to save new order.");
      fetchCategories(); 
    }
  };


  // Dynamically extract unique categories from the loaded categories list
  const categories = React.useMemo(() => {
    return ["All", ...roomCategories.map((c) => c.name)];
  }, [roomCategories]);

  // Filter rooms based on the selected category
  const filteredRooms = React.useMemo(() => {
    if (selectedCategory === "All") return rooms;
    return rooms.filter((room) => room.category === selectedCategory);
  }, [rooms, selectedCategory]);

  // Group rooms directly by category name
  const villasRooms = React.useMemo(() => {
    return filteredRooms.filter((room) => room.category === "Villas");
  }, [filteredRooms]);

  const roomsRooms = React.useMemo(() => {
    return filteredRooms.filter((room) => room.category === "Rooms");
  }, [filteredRooms]);

  const uncategorizedRooms = React.useMemo(() => {
    return filteredRooms.filter(
      (room) => room.category !== "Villas" && room.category !== "Rooms"
    );
  }, [filteredRooms]);

  // Reset selected category to "All" if it is no longer in the categories list
  useEffect(() => {
    if (selectedCategory !== "All" && !categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  // Form states
  const [roomNumber, setRoomNumber] = useState("");
  const [totalRooms, setTotalRooms] = useState("1");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [gstPercentage, setGstPercentage] = useState("12");
  const [category, setCategory] = useState("Executive Rooms");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [guests, setGuests] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Extra images states
  const [existingExtraImages, setExistingExtraImages] = useState([]);
  const [newExtraImageFiles, setNewExtraImageFiles] = useState([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([]);

  const [saving, setSaving] = useState(false);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/room-categories`);
      const data = await response.json();
      if (data.success) {
        setRoomCategories(data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch room categories:", err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchCategories();

    // Auto-refresh rooms silently every 10 seconds
    const interval = setInterval(() => {
      fetchRooms(true);
      fetchCategories();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const openAddModal = () => {
    setEditingRoom(null);
    setRoomNumber("");
    setTotalRooms("1");
    setName("");
    setPrice("");
    setGstPercentage("12");
    setCategory(roomCategories.length > 0 ? roomCategories[0].name : "Villas");
    setArea("");
    setBeds("");
    setBathrooms("");
    setGuests("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setExistingExtraImages([]);
    setNewExtraImageFiles([]);
    setExtraImagePreviews([]);
    setIsFormOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber || "");
    setTotalRooms(room.totalRooms || "1");
    setName(room.name);
    setPrice(room.price);
    setGstPercentage(room.gst_percentage || "12");
    setCategory(room.category || "Executive Rooms");
    setArea(room.area);
    setBeds(room.beds);
    setBathrooms(room.bathrooms);
    setGuests(room.guests || "");
    setDescription(room.description);
    setImageFile(null);
    setImagePreview(
      room.image
        ? room.image.startsWith("http")
          ? room.image
          : `${API_URL}/uploads/${room.image}`
        : ""
    );

    const extraImgs = room.images || [];
    setExistingExtraImages(extraImgs);
    setNewExtraImageFiles([]);
    setExtraImagePreviews(
      extraImgs.map((img) => ({
        id: img,
        url: img.startsWith("http") ? img : `${API_URL}/uploads/${img}`,
        isExisting: true,
        filename: img,
      }))
    );
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleExtraFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...newExtraImageFiles, ...files];
      setNewExtraImageFiles(newFiles);

      const newPreviews = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        isExisting: false,
        file,
      }));

      setExtraImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveExtraImage = (previewItem) => {
    setExtraImagePreviews((prev) => prev.filter((item) => item.id !== previewItem.id));
    if (previewItem.isExisting) {
      setExistingExtraImages((prev) => prev.filter((img) => img !== previewItem.filename));
    } else {
      setNewExtraImageFiles((prev) => prev.filter((file) => file !== previewItem.file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      let compressedMainImage = imageFile;
      if (imageFile) {
        compressedMainImage = await compressImage(imageFile);
      }

      const compressedExtraImages = [];
      for (const file of newExtraImageFiles) {
        const compressed = await compressImage(file);
        compressedExtraImages.push(compressed);
      }

      const formData = new FormData();
      formData.append("roomNumber", roomNumber);
      formData.append("totalRooms", totalRooms);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("gst_percentage", gstPercentage);
      formData.append("category", category);
      formData.append("area", area);
      formData.append("beds", beds);
      formData.append("bathrooms", bathrooms);
      formData.append("guests", guests);
      formData.append("description", description);
      if (compressedMainImage) {
        formData.append("image", compressedMainImage);
      }
      formData.append("existingExtraImages", JSON.stringify(existingExtraImages));
      compressedExtraImages.forEach((file) => {
        formData.append("extraImages", file);
      });

      let url = `${API_URL}/api/rooms`;
      let method = "POST";

      if (editingRoom) {
        url = `${API_URL}/api/rooms/${editingRoom.id || editingRoom._id}`;
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

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName || catName.trim() === "") {
      toast.warning("Category name is required.");
      return;
    }
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    const payload = {
      name: catName.trim(),
      parent: catParent || null,
    };

    try {
      let response;
      if (editingCategory) {
        response = await fetch(`${API_URL}/api/room-categories/${editingCategory._id || editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_URL}/api/room-categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save category.");
      }

      toast.success(editingCategory ? "Category updated successfully!" : "Category created successfully!");
      setIsCatFormOpen(false);
      setEditingCategory(null);
      setCatName("");
      setCatParent("");
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category.");
    }
  };

  const handleDeleteCategory = async (cat) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/room-categories/${cat._id || cat.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category.");
      }

      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to delete category.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  // Reusable room card rendering function
  const renderRoomCard = (room) => (
    <div
      key={room.id || room._id}
      className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300 flex flex-col justify-between"
    >
      <div>
        <img
          src={getImageUrl(room.image)}
          className="h-48 w-full object-cover border-b border-white/10"
          alt={room.name}
        />
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-[18px] leading-tight text-white">{room.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {room.category && (
                  <span className="text-[12px] text-white/60 uppercase tracking-widest font-bold block">
                    {room.category}
                  </span>
                )}
              </div>
            </div>
            <span className="bg-[#C8A64D]/10 text-[#C8A64D] text-[12px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
              {room.availableRooms !== undefined
                ? `Available: ${room.availableRooms}/${room.totalRooms}`
                : `Rooms: ${room.roomNumber}`}
            </span>
          </div>

          <p className="text-[#C8A64D] font-bold text-[18px]">
            ₹{parseFloat(room.price).toLocaleString()}{" "}
            <span className="text-white text-[14px] font-normal">/ night</span>
          </p>

          <div className="text-[14px] text-white/80 font-medium">
            Number of Rooms: <span className="text-[#C8A64D] font-bold">{room.totalRooms}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[14px] text-white border-t border-white/10 pt-3">
            <span className="flex items-center justify-center gap-1.5 border border-white/10 p-2 rounded-lg bg-black/20" title="Beds">
              <BedDouble size={14} className="text-[#C8A64D]" />
              {room.beds}
            </span>

            <span className="flex items-center justify-center gap-1.5 border border-white/10 p-2 rounded-lg bg-black/20" title="Area">
              <Maximize size={14} className="text-[#C8A64D]" />
              {room.area}
            </span>

            {room.guests && (
              <span className="flex items-center justify-center gap-1.5 border border-white/10 p-2 rounded-lg bg-black/20" title="Guests Capacity">
                <Users size={14} className="text-[#C8A64D]" />
                {room.guests}
              </span>
            )}

            {room.images && room.images.length > 0 && (
              <span className="flex items-center justify-center gap-1.5 border border-white/10 p-2 rounded-lg bg-black/20 col-span-full sm:col-span-1" title="Gallery Images">
                <Upload size={14} className="text-[#C8A64D]" />
                {room.images.length} Extra
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-t border-white/5">
        <button
          onClick={() => openEditModal(room)}
          className="flex-1 bg-white/10 py-2 rounded-lg flex items-center justify-center hover:bg-white/20 transition cursor-pointer text-white border-0"
          title="Edit Room"
        >
          <Edit size={14} className="mr-1" /> Edit
        </button>
        <button
          onClick={() => handleDelete(room.id || room._id)}
          className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition cursor-pointer border-0"
          title="Delete Room"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Rooms Inventory</h1>
          <p className="text-white/50 text-sm">Manage hotel room categories & details</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManageCategoryModalOpen(true)}
            className="bg-white/5 text-white border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-white/10 transition text-sm"
          >
            Manage Category
          </button>
          <button
            onClick={openAddModal}
            className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition text-sm"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* ADD / EDIT ROOM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-5xl rounded-xl p-6 lg:p-8 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingRoom ? "Edit Room" : "Add Room"}</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-0"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Room Number
                  </label>
                  <input
                    required
                    placeholder="e.g. HE-101"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Number of Rooms
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 40"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Room Name
                  </label>
                  <input
                    required
                    placeholder="e.g. Royal Suite"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                      Price 
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 8000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                    />
                  </div>
                
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Area
                  </label>
                  <input
                    required
                    placeholder="e.g. 500 SQ FT"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Beds
                  </label>
                  <input
                    required
                    placeholder="e.g. KING BED"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Bathrooms
                  </label>
                  <input
                    required
                    placeholder="e.g. 1 BATHROOM"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Capacity
                  </label>
                  <input
                    required
                    placeholder="e.g. 2 GUESTS"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                  >
                    {roomCategories.map((c) => (
                      <option key={c._id || c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                  <div>
                    <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                      GST (%)
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 12"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(e.target.value)}
                      className="w-full bg-[#071524] border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500 transition text-white text-sm"
                    />
                  </div>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Describe the room amenities, view, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#071524] p-3 rounded-lg border border-white/10 outline-none focus:border-yellow-500 transition text-white text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Room Image
                  </label>
                  <div className="border border-dashed border-white/20 p-4 rounded-lg text-center bg-[#071524] relative h-[120px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          className="max-h-16 mx-auto object-cover rounded"
                          alt="Preview"
                        />
                        <p className="text-[#C8A64D] text-[10px]">
                          Click/drag to change main image
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-2 text-[#C8A64D]" size={20} />
                        <p className="text-white/60 text-xs">
                          Click or drag image to upload main image
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Extra Images (Details Gallery)
                  </label>
                  <div className="border border-dashed border-white/20 p-4 rounded-lg text-center bg-[#071524] relative h-[120px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExtraFilesChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="mx-auto mb-2 text-[#C8A64D]" size={20} />
                    <p className="text-white/60 text-xs">
                      Click or drag multiple images to upload
                    </p>
                  </div>
                </div>
              </div>

              {extraImagePreviews.length > 0 && (
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                    Uploaded Gallery Images ({extraImagePreviews.length})
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-2 bg-[#071524] border border-white/10 rounded-lg">
                    {extraImagePreviews.map((previewItem) => (
                      <div
                        key={previewItem.id}
                        className="relative group aspect-square rounded overflow-hidden bg-black/40 border border-white/10"
                      >
                        <img
                          src={previewItem.url}
                          alt="Extra Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraImage(previewItem)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 cursor-pointer transition shadow z-10 border-0"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer border-0 text-white text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition disabled:bg-yellow-600/50 cursor-pointer border-0 text-sm"
                >
                  {saving ? "Saving..." : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER SECTION */}
      {!loading && rooms.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 bg-[#081A2F] border border-white/10 p-4 rounded-xl">
          <span className="text-sm text-white/60">Filter by Category:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer border-0 ${
                  selectedCategory === cat
                    ? "bg-[#C8A64D] text-black"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
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
            className="mt-4 px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg border-0 cursor-pointer"
          >
            Create Your First Room
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl">
          <p className="text-white/50 text-lg">No rooms found in this category.</p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-4 px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg border-0 cursor-pointer hover:bg-[#b09141] transition"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {villasRooms.length > 0 && (
            <div>
              <div className="border-b border-white/10 pb-2 mb-6">
                <h2 className="text-xl font-semibold text-[#C8A64D] uppercase tracking-wider">
                  Villas
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {villasRooms.map((room) => renderRoomCard(room))}
              </div>
            </div>
          )}

          {roomsRooms.length > 0 && (
            <div>
              <div className="border-b border-white/10 pb-2 mb-6">
                <h2 className="text-xl font-semibold text-[#C8A64D] uppercase tracking-wider">
                  Rooms
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomsRooms.map((room) => renderRoomCard(room))}
              </div>
            </div>
          )}

          {uncategorizedRooms.length > 0 && (
            <div>
              <div className="border-b border-white/10 pb-2 mb-6">
                <h2 className="text-xl font-semibold text-[#C8A64D] uppercase tracking-wider">

                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uncategorizedRooms.map((room) => renderRoomCard(room))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MANAGE CATEGORY MODAL */}
      {isManageCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-3xl rounded-xl p-6 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-lg font-bold">Manage Room Categories</h2>
              <button
                onClick={() => setIsManageCategoryModalOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50">
                List of all room categories registered in the system.
              </span>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCatName("");
                  setCatParent("");
                  setIsCatFormOpen(true);
                }}
                className="bg-[#C8A64D] text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer text-xs hover:bg-[#b09141] border-0"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="overflow-x-auto max-h-96">
         <table className="w-full text-sm border-collapse text-left">
  <thead className="bg-[#071524] text-white/60 text-xs uppercase tracking-wider border-b border-white/10 font-bold">
    <tr>
      {/* New empty th for the drag handle */}
      <th className="p-3 w-10"></th> 
      <th className="p-3 text-[#c8a64d]">Category Name</th>
      <th className="p-3 text-[#c8a64d]">Parent Category</th>
      <th className="p-3 text-[#c8a64d]">Created Date</th>
      <th className="p-3 text-[#c8a64d] text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-white/5">
    {roomCategories.map((cat, index) => (
      <tr 
        key={cat._id || cat.id} 
        draggable // Enables dragging
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        // Add visual feedback when the row is being dragged
        className={`hover:bg-white/5 transition ${draggedCatIndex === index ? 'opacity-30 bg-black/50' : ''}`}
      >
        {/* Drag Handle Cell */}
        <td className="p-3 text-white/30 cursor-grab active:cursor-grabbing hover:text-white/80 transition">
          <GripVertical size={16} />
        </td>
        <td className="p-3 font-semibold text-white">{cat.name}</td>
        <td className="p-3 text-white/70">
          {cat.parent || <span className="text-white/30 italic">None (Top-Level)</span>}
        </td>
        <td className="p-3 text-white/50 text-xs">
          {new Date(cat.created_at || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td className="p-3 text-center flex justify-center gap-2">
          {/* ... existing Edit and Delete buttons ... */}
          <button
            onClick={() => {
              setEditingCategory(cat);
              setCatName(cat.name);
              setCatParent(cat.parent || "");
              setIsCatFormOpen(true);
            }}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold cursor-pointer border-0"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(cat)}
            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs font-semibold cursor-pointer border-0"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT CATEGORY MODAL OVERLAY */}
      {isCatFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-[#081A2F] w-full max-w-md rounded-xl p-6 border border-white/10 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-md font-bold text-white">
                {editingCategory ? "Edit Room Category" : "Add Room Category"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCatFormOpen(false);
                  setEditingCategory(null);
                  setCatName("");
                  setCatParent("");
                }}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-yellow-500 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duplex Villas"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 text-white rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-yellow-500 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
                  Parent Category
                </label>
                <select
                  value={catParent}
                  onChange={(e) => setCatParent(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 text-white rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500"
                >
                  <option value="">None (Top-Level)</option>
                  <option value="Villas">Villas</option>
                  <option value="Rooms">Rooms</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setIsCatFormOpen(false);
                  setEditingCategory(null);
                  setCatName("");
                  setCatParent("");
                }}
                className="px-4 py-2 bg-white/5 text-white text-xs font-semibold rounded hover:bg-white/10 border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C8A64D] text-black text-xs font-bold rounded hover:bg-[#b09141] border-0 cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;