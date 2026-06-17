import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, RefreshCw, Leaf, X } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const Menu = () => {
  const toast = useToast();
  const [dishes, setDishes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  // Order Modal states
  const [selectedDishForOrder, setSelectedDishForOrder] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const categories = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

  useEffect(() => {
    fetchDishes();
    fetchRooms();
    
    // Autofill name and email from logged in user if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u) {
          if (u.full_name) setGuestName(u.full_name);
          if (u.email) setGuestEmail(u.email);
        }
      } catch (e) {}
    }
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/dishes`);
      if (!response.ok) {
        throw new Error("Failed to load restaurant menu.");
      }
      const data = await response.json();
      if (data.success) {
        setDishes(data.data);
      } else {
        throw new Error(data.message || "Failed to load restaurant menu.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  // Filter logic
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
    const matchesVeg = !vegetarianOnly || dish.isVegetarian;
    return matchesSearch && matchesCategory && matchesVeg && dish.isAvailable;
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!roomNumber || !guestName || !guestEmail) {
      toast.error("Please fill in your name, email address, and room number.");
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishName: selectedDishForOrder.name,
          quantity,
          price: selectedDishForOrder.price,
          totalPrice: selectedDishForOrder.price * quantity,
          roomNumber,
          guestName,
          guestEmail,
          specialInstructions
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Order placed successfully!\nYour food will be delivered to room ${roomNumber}.`);
        setSelectedDishForOrder(null);
        setQuantity(1);
        setSpecialInstructions("");
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (err) {
      toast.error("Error connecting to server to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen">
        {/* Hero Banner */}
        <section
          className="relative h-[55vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center pt-24">
            <h1 className="text-5xl md:text-7xl font-light mb-4">
              Fine Dining Menu
            </h1>
            <p className="text-yellow-500 uppercase tracking-[4px] text-sm">
              Home / Restaurant Menu
            </p>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Our Specialties
            </p>
            <h2 className="text-4xl md:text-5xl font-light">
              Restaurant Menu
            </h2>
            <p className="text-white/40 mt-4 max-w-2xl mx-auto font-light text-sm">
              Delight in our curated selection of fine local and international cuisines. Handcrafted by master chefs using premium local ingredients.
            </p>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-zinc-900 border border-yellow-500/10 p-5 mb-12 flex flex-col md:flex-row gap-5 items-center justify-between rounded shadow-xl">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/55 border border-white/10 rounded p-2.5 pl-10 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
              />
              <Search className="absolute left-3 top-3 text-white/40" size={16} />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider transition font-medium cursor-pointer rounded ${
                    selectedCategory === cat
                      ? "bg-yellow-500 text-black font-bold"
                      : "bg-black/30 border border-white/10 text-white hover:border-yellow-500/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Veg Checkbox Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none shrink-0 border-l border-white/10 pl-5">
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(e) => setVegetarianOnly(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-white/10 bg-black text-yellow-500 focus:ring-yellow-500 accent-yellow-500"
              />
              <span className="text-xs uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-bold">
                <Leaf size={14} className="text-green-500" /> Veg Only
              </span>
            </label>
          </div>

          {/* DISHES LIST */}
          {loading && (
            <div className="text-center text-yellow-500 py-16 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="animate-spin text-yellow-500" size={32} />
              <span>Loading menu items...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-16 text-lg">
              Failed to load menu: {error}
            </div>
          )}

          {!loading && !error && filteredDishes.length === 0 && (
            <div className="text-center text-white/40 py-16 text-lg font-light">
              No dishes found matching your current filters.
            </div>
          )}

          {!loading && !error && filteredDishes.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  onClick={() => setSelectedDishForOrder(dish)}
                  className="group bg-zinc-900 border border-yellow-500/10 hover:border-yellow-500/35 transition-all rounded-[20px] duration-300 flex flex-col justify-between overflow-hidden shadow-2xl relative cursor-pointer"
                >
                  <div>
                    {/* Dish Photo */}
                    <div className="relative h-56 overflow-hidden aspect-[4/3] w-full">
                      <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition duration-500"></div>
                      <img
                        src={getImageUrl(dish.image)}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur px-3 py-1.5 border border-yellow-500/30 text-[#C8A64D] text-sm font-semibold">
                        ₹{parseFloat(dish.price).toLocaleString()}
                      </div>

                      {/* Veg indicator badge */}
                      <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider rounded border border-white/5">
                        <span className={`w-2.5 h-2.5 rounded-full border border-white/10 ${dish.isVegetarian ? "bg-green-600" : "bg-red-700"}`}></span>
                        <span>{dish.isVegetarian ? "Veg" : "Non-Veg"}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-medium text-white mb-2 group-hover:text-yellow-500 transition">
                        {dish.name}
                      </h3>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
                        {dish.category}
                      </p>
                      <p className="text-[#D8C8A5] text-sm leading-relaxed font-light line-clamp-3">
                        {dish.description || "Freshly cooked exquisite dish prepared by our resort specialty chefs."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-2">
                    <div className="border-t border-white/5 pt-4 text-[10px] uppercase tracking-widest text-white/30 group-hover:text-[#C8A64D] text-center font-bold transition">
                      Click to Order Room Service
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ORDER MODAL */}
      {selectedDishForOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-[#081A2F] w-full max-w-lg rounded-xl p-6 border border-white/10 my-8 shadow-2xl relative text-white">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Order Room Service
              </h2>
              <button
                onClick={() => setSelectedDishForOrder(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dish details summary */}
            <div className="bg-black/25 border border-white/5 p-4 rounded-lg flex gap-4 items-center mb-5">
              <img
                src={getImageUrl(selectedDishForOrder.image)}
                alt={selectedDishForOrder.name}
                className="w-16 h-16 object-cover rounded shadow border border-white/10"
              />
              <div>
                <h3 className="font-bold text-lg">{selectedDishForOrder.name}</h3>
                <span className="text-[#C8A64D] font-bold">₹{selectedDishForOrder.price}</span>
                <span className="text-white/40 text-xs ml-3 capitalize">• {selectedDishForOrder.category}</span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2 font-bold">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 bg-black/30 border border-white/10 rounded flex items-center justify-center text-lg hover:border-yellow-500/50 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 bg-black/30 border border-white/10 rounded flex items-center justify-center text-lg hover:border-yellow-500/50 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Name & Email Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2 font-bold">Your Name</label>
                  <input
                    required
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-sm text-white"
                    placeholder="Guest Name"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
                  <input
                    required
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-sm text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Room Number Selector */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2 font-bold">Room Number</label>
                <select
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-sm text-white cursor-pointer"
                >
                  <option value="" className="bg-[#081A2F]">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.roomNumber} className="bg-[#081A2F]">
                      Room {room.roomNumber} ({room.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2 font-bold">Special Instructions</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#071524] p-3 rounded-lg border border-white/10 outline-none focus:border-yellow-500 transition text-sm text-white font-light"
                  rows={2}
                  placeholder="e.g. Extra spicy, no onions, etc."
                />
              </div>

              {/* Total Price display */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-sm">
                <span className="text-white/50">Total Amount:</span>
                <span className="text-[#C8A64D] text-xl font-bold">₹{(selectedDishForOrder.price * quantity).toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedDishForOrder(null)}
                  className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white rounded-lg transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="bg-[#C8A64D] text-black px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition disabled:opacity-50 text-sm"
                >
                  {placingOrder ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} /> Ordering...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Menu;
