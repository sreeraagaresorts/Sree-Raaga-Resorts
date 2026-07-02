import React, { useState, useEffect } from "react";
import { Plus, Edit2, X, Upload, RefreshCw, Search, Leaf, ShoppingBag, User, MapPin, ClipboardList, Pencil } from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { compressImage } from "../utils/imageCompressor";

const AdminMenu = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("dishes"); // "dishes" or "orders"

  // Dishes Inventory states
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Dishes Modal & Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isDrink, setIsDrink] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Room Service Orders states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Dynamic Categories states
  const [categories, setCategories] = useState(["Breakfast", "Starters", "Main Course", "Biryani", "Rice & Noodles", "Desserts", "Beverages"]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchDishes();
    fetchOrders();
    fetchCategories();

    // Auto-poll orders every 10 seconds silently to show new room service requests in real-time
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "Category added successfully!");
        setNewCategoryName("");
        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to add category.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add category.");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/categories/${encodeURIComponent(catName)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "Category deleted successfully!");
        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to delete category.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete category.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName.trim()) return;

    setAddingCategory(true);

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${encodeURIComponent(editingCategory)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Category updated successfully!");
        setEditingCategory(null);
        setNewCategoryName("");
        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to update category.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update category.");
    } finally {
      setAddingCategory(false);
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/dishes`);
      const data = await response.json();
      if (data.success) {
        setDishes(data.data);
      } else {
        throw new Error(data.message || "Failed to load menu items.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to fetch dishes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoadingOrders(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message || "Failed to load orders.");
      }
    } catch (err) {
      if (!silent) toast.error(err.message || "Failed to fetch orders.");
    } finally {
      if (!silent) setLoadingOrders(false);
    }
  };

  const openAddModal = () => {
    setEditingDish(null);
    setName("");
    setPrice("");
    setCategory("Breakfast");
    setDescription("");
    setIsVegetarian(true);
    setIsAvailable(true);
    setIsDrink(false);
    setImageFile(null);
    setImagePreview("");
    setIsFormOpen(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price);
    setCategory(dish.category);
    setDescription(dish.description || "");
    setIsVegetarian(dish.isVegetarian === true || dish.isVegetarian === "true");
    setIsAvailable(dish.isAvailable === true || dish.isAvailable === "true");
    setIsDrink(dish.isDrink === true || dish.isDrink === "true");
    setImageFile(null);
    setImagePreview(dish.image ? (dish.image.startsWith("http") ? dish.image : `${API_URL}/uploads/${dish.image}`) : "");
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
      // Compress image on the frontend before sending to prevent Nginx 413 Payload Too Large
      let compressedImage = imageFile;
      if (imageFile) {
        compressedImage = await compressImage(imageFile);
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isVegetarian", isVegetarian);
      formData.append("isAvailable", isAvailable);
      formData.append("isDrink", isDrink);
      if (compressedImage) {
        formData.append("image", compressedImage);
      }

      let url = `${API_URL}/api/dishes`;
      let method = "POST";

      if (editingDish) {
        url = `${API_URL}/api/dishes/${editingDish.id}`;
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
        throw new Error(data.message || "Failed to save dish.");
      }

      toast.success(editingDish ? "Dish updated successfully!" : "Dish created successfully!");
      setIsFormOpen(false);
      fetchDishes();
    } catch (err) {
      toast.error(err.message || "Failed to save dish.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish from the menu?")) return;

    try {
      const response = await fetch(`${API_URL}/api/dishes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete dish.");
      }

      toast.success("Dish deleted successfully!");
      fetchDishes();
    } catch (err) {
      toast.error(err.message || "Failed to delete dish.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}!`);
        fetchOrders();
      } else {
        throw new Error(data.message || "Failed to update order status.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating order status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Order deleted successfully!");
        fetchOrders();
      } else {
        throw new Error(data.message || "Failed to delete order.");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting order.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  // Filters
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === "All" || dish.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((order) => {
    const term = orderSearchQuery.toLowerCase();
    return order.guestName.toLowerCase().includes(term) ||
           order.roomNumber.toLowerCase().includes(term) ||
           order.dishName.toLowerCase().includes(term);
  });

  // Group filtered dishes by category
  const groupedDishes = filteredDishes.reduce((acc, dish) => {
    const cat = dish.category || "Other";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(dish);
    return acc;
  }, {});

  // Define display order — Starters first, then the rest
  const categoryOrder = ["Starters", "Breakfast", "Main Course", "Biryani", "Rice & Noodles", "Desserts", "Beverages"];
  const sortedGroupedDishes = Object.entries(groupedDishes).sort(([a], [b]) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
          <p className="text-white/50 text-sm">
            Configure hotel dishes and track guest room service requests.
          </p>
        </div>

        {activeTab === "dishes" && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsCategoryFormOpen(true)}
              className="border border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium cursor-pointer hover:bg-white/5 transition"
            >
              <Plus size={16} /> Manage Categories
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition"
            >
              <Plus size={16} /> Add Dish
            </button>
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("dishes")}
          className={`pb-4 text-sm font-bold tracking-wider uppercase cursor-pointer transition ${
            activeTab === "dishes"
              ? "text-[#C8A64D] border-b-2 border-[#C8A64D]"
              : "text-white/40 hover:text-white"
          }`}
        >
          Dishes Inventory
        </button>
      </div>

      {/* TAB 1: DISHES INVENTORY */}
      {activeTab === "dishes" && (
        <>
          {/* FILTER BAR */}
          <div className="bg-[#081A2F] border border-white/10 p-4 rounded-xl flex flex-col gap-4 shadow-md">
            <div className="flex items-center bg-[#071524] px-3 rounded-lg border border-white/5 w-full">
              <Search className="text-white/40 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 outline-none text-white text-sm"
              />
            </div>

            <div className="flex gap-2 w-full overflow-x-auto pb-1">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-4 py-2 text-sm uppercase tracking-wider transition rounded shrink-0 font-medium cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? "bg-[#C8A64D] text-black font-bold"
                      : "bg-[#071524] border border-white/10 text-white hover:border-yellow-500/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* DISHES LIST GRID - CENTERED CATEGORY HEADINGS */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#C8A64D]">
              <RefreshCw className="animate-spin mb-4" size={32} />
              <span>Loading menu dishes...</span>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
              <p className="text-white/50 text-lg">No dishes found in the menu.</p>
            </div>
          ) : (
            <div className="space-y-16 mt-8">
              {sortedGroupedDishes.map(([categoryName, items]) => (
                <div key={categoryName} className="flex flex-col gap-6">
                  
                  {/* Center Category Heading */}
                  <div className="flex flex-col items-start justify-center mb-2">
                    <h3 className="text-xl uppercase font-medium text-[#C8A64D]  py-3  border-b-1 border-white/10 w-full  capitalize text-start">
                      {categoryName}
                    </h3>
                    {/* <div className="w-full h-0.5 bg-white/10 mt-3 rounded-full"></div> */}
                  </div>

                  {/* Dishes List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((dish) => (
                      <div key={dish.id} className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between group">
                        <div>
                          <div className="relative h-48 w-full overflow-hidden">
                            <img
                              src={getImageUrl(dish.image)}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            {/* Veg indicator badge */}
                            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                              {!(dish.isDrink === true || dish.isDrink === "true") && (
                                <div className="bg-black/80 backdrop-blur px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider rounded border border-white/5">
                                  <span className={`w-2 h-2 rounded-full shrink-0 aspect-square ${(dish.isVegetarian === true || dish.isVegetarian === "true") ? "bg-green-500" : "bg-red-600"}`}></span>
                                  <span>{(dish.isVegetarian === true || dish.isVegetarian === "true") ? "Veg" : "Non-Veg"}</span>
                                </div>
                              )}
                              {(dish.isDrink === true || dish.isDrink === "true") && (
                                <div className="bg-black/80 backdrop-blur px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider rounded border border-blue-500/30 text-blue-400">
                                  <img src="/drinks.svg" alt="Drink" className="w-4 h-4 invert object-contain" />
                                  <span>Drink</span>
                                </div>
                              )}
                            </div>

                            {/* Availability badge */}
                            {!dish.isAvailable && (
                              <div className="absolute inset-0 bg-black/75 z-10 flex items-center justify-center text-red-400 font-bold uppercase tracking-widest text-sm">
                                Sold Out / Unavailable
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold group-hover:text-yellow-500 transition">{dish.name}</h3>
                              <span className="text-[#C8A64D] font-bold">₹{dish.price}</span>
                            </div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{dish.category}</p>
                            <p className="text-white/60 text-sm leading-relaxed line-clamp-3 font-light">
                              {dish.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2 p-5 border-t border-white/5 mt-4">
                          <button
                            onClick={() => openEditModal(dish)}
                            className="flex-1 bg-white/10 py-2 rounded-lg flex items-center justify-center hover:bg-white/20 transition cursor-pointer text-sm text-[#C8A64D]"
                            title="Edit Dish"
                          >
                            <Edit2 size={14} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dish.id)}
                            className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition cursor-pointer text-sm"
                            title="Delete Dish"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ROOM SERVICE ORDERS */}
      {activeTab === "orders" && (
        <>
          {/* SEARCH & REFRESH */}
          <div className="bg-[#081A2F] border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-md justify-between">
            <div className="flex-1 flex items-center bg-[#071524] px-3 rounded-lg border border-white/5 max-w-md">
              <Search className="text-white/40 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search by room, guest, or dish name..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 outline-none text-white text-sm"
              />
            </div>

            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="p-3 bg-[#071524] border border-white/10 hover:border-yellow-500/50 rounded-lg text-white transition flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50 font-bold"
            >
              <RefreshCw className={loadingOrders ? "animate-spin" : ""} size={16} /> Refresh
            </button>
          </div>

          {/* ORDERS TABLE */}
          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#C8A64D]">
              <RefreshCw className="animate-spin mb-4" size={32} />
              <span>Loading food orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#081A2F] border border-white/10 p-12 text-center rounded-xl text-white/50">
              <p className="text-white/50 text-lg">No orders found.</p>
            </div>
          ) : (
            <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#071524] text-white/50 text-xs uppercase tracking-wider border-b border-white/5">
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Guest & Room</th>
                      <th className="p-4 font-bold">Dish & Qty</th>
                      <th className="p-4 font-bold">Total Price</th>
                      <th className="p-4 font-bold">Instructions</th>
                      <th className="p-4 font-bold">Date & Time</th>
                      <th className="p-4 font-bold text-center">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/2">
                        {/* ID */}
                        <td className="p-4 font-semibold text-white/90">#{order.id}</td>
                        
                        {/* Guest details */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white flex items-center gap-1">
                              <User size={13} className="text-[#C8A64D]" /> {order.guestName}
                            </span>
                            <span className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-yellow-500/60" /> Room {order.roomNumber}
                            </span>
                          </div>
                        </td>

                        {/* Dish Details */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              <ShoppingBag size={13} className="text-[#C8A64D]" /> {order.dishName}
                            </span>
                            <span className="text-white/50 text-xs mt-0.5">Qty: {order.quantity} x ₹{order.price}</span>
                          </div>
                        </td>

                        {/* Total Price */}
                        <td className="p-4 font-bold text-[#C8A64D]">₹{order.totalPrice.toLocaleString()}</td>

                        {/* Special instructions */}
                        <td className="p-4 max-w-xs">
                          <p className="text-white/60 text-xs italic truncate" title={order.specialInstructions}>
                            {order.specialInstructions || <span className="text-white/20 not-italic">None</span>}
                          </p>
                        </td>

                        {/* Time */}
                        <td className="p-4 text-white/50 text-xs">
                          {new Date(order.created_at).toLocaleString("en-IN")}
                        </td>

                        {/* Status Editor */}
                        <td className="p-4 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingStatusId === order.id}
                            className={`px-3 py-1.5 bg-[#071524] rounded border font-semibold outline-none text-xs cursor-pointer ${
                              order.status === "pending"
                                ? "text-yellow-500 border-yellow-500/20"
                                : order.status === "preparing"
                                ? "text-blue-500 border-blue-500/20"
                                : order.status === "delivered"
                                ? "text-green-500 border-green-500/20"
                                : "text-red-500 border-red-500/20"
                            }`}
                          >
                            <option value="pending" className="bg-[#081A2F] text-yellow-500">PENDING</option>
                            <option value="preparing" className="bg-[#081A2F] text-blue-500">PREPARING</option>
                            <option value="delivered" className="bg-[#081A2F] text-green-500">DELIVERED</option>
                            <option value="cancelled" className="bg-[#081A2F] text-red-500">CANCELLED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition cursor-pointer bg-transparent border-0 text-xs font-semibold"
                            title="Delete Order"
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
          )}
        </>
      )}

      {/* DISHES ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#081A2F] w-full max-w-[120vh] rounded-xl p-6 border border-white/10 my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingDish ? "Edit Dish" : "Add Dish"}</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Dish Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white"
                    placeholder="e.g. Kerala Prawn Curry"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Price (₹)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white"
                    placeholder="e.g. 380"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#081A2F]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-4 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-white/10 bg-black text-[#C8A64D] focus:ring-[#C8A64D] accent-[#C8A64D]"
                    />
                    <span className="text-xs uppercase tracking-wider text-white/80 flex items-center gap-1 font-bold">
                      <Leaf size={14} className="text-green-500" /> Vegetarian
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isDrink}
                      onChange={(e) => setIsDrink(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-white/10 bg-black text-blue-400 focus:ring-blue-400 accent-blue-400"
                    />
                    <span className="text-xs uppercase tracking-wider text-white/80 flex items-center gap-1 font-bold">
                      <img src="/drinks.svg" alt="Drink" className="w-4 h-4 invert object-contain" /> Drinks
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-white/10 bg-black text-[#C8A64D] focus:ring-[#C8A64D] accent-[#C8A64D]"
                    />
                    <span className="text-xs uppercase tracking-wider text-white/80 font-bold">
                      In Stock
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Description</label>
             <textarea
  required
  value={description}
  maxLength={100}
  onChange={(e) => {
    const inputText = e.target.value;
    
    // Only update state if character count is 100 or less
    if (inputText.length <= 100) {
      setDescription(inputText);
    }
  }}
  className="w-full bg-[#071524] p-3 rounded-lg border border-white/10 outline-none focus:border-yellow-500 transition text-white font-light text-sm"
  rows={3}
  placeholder="Describe the dish ingredients, flavor, spice level... (Max 100 characters)"
/>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Dish Image</label>
                <div className="border border-dashed border-white/20 p-6 rounded-lg text-center bg-[#071524] relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} className="max-h-40 mx-auto object-cover rounded shadow" alt="Preview" />
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

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white rounded-lg transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#C8A64D] text-black px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition disabled:opacity-50 text-sm"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} /> Saving...
                    </>
                  ) : (
                    "Save Dish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGE MODAL */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#081A2F] w-full max-w-md rounded-xl p-6 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Categories</h2>
              <button
                onClick={() => setIsCategoryFormOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-0"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Add Category Form */}
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-4 mb-6 pb-6 border-b border-white/10">
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Desserts, Beverages"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={addingCategory}
                    className="px-5 py-3 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {addingCategory 
                      ? (editingCategory ? "Updating..." : "Adding...") 
                      : (editingCategory ? "Update" : "Add")}
                  </button>
                  
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName("");
                      }}
                      className="px-4 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* List of Existing Categories */}
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex justify-between items-center bg-[#071524] px-4 py-2.5 rounded-lg border border-white/5"
              >
                <span className="text-white text-sm font-medium">{cat}</span>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setNewCategoryName(cat);
                    }} 
                    className="text-blue-400 hover:text-blue-500 hover:bg-blue-500/10 p-1.5 rounded transition cursor-pointer bg-transparent border-0"
                    title="Edit Category"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10 px-2 py-1 rounded transition cursor-pointer bg-transparent border-0 text-xs font-semibold"
                    title="Delete Category"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCategoryFormOpen(false)}
                className="px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;