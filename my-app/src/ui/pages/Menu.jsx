import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, RefreshCw, Leaf, X, Phone, Mail } from "lucide-react";
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
      <div className="bg-[#fcfaf2] text-[#0d2b4e] font-serif min-h-screen ">
        
        {/* ================= HERO BANNER ================= */}
        <section
          className="relative h-[55vh] flex items-center justify-center bg-cover bg-center select-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000')"
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
          <div className="relative z-10 text-center text-white px-6 w-full max-w-5xl">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-2 text-xs font-semibold font-sans">
              Restaurant
            </span>
            <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight mb-8">
              Restaurent Menu
            </h1>
            
            {/* Details Row */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-8 border-t border-white/20 font-sans text-[10px] md:text-xs uppercase tracking-widest text-white/80">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#c8a64d]" />
                <span>+91 99000 11550</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#c8a64d]" />
                <span>support@sreeraagaresorts.in</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅 Mon - Sun</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕒 08:00 AM - 10:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍽️ Poolside Lounge</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTRO DESCRIPTION SECTION ================= */}
        <section className="py-20 max-w-4xl mx-auto px-6 text-center select-none">
          <h2 className="text-3xl font-light text-[#0d2b4e] leading-relaxed mb-6">
            An integral part of relax and perfect experience of your stay is exceptional gastronomy. Chefs' team prepares daily delicious meals from domestic and international cuisine with love for you.
          </h2>
          <p className="text-gray-500 font-light text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
            Our commitment to quality starts with the selection of the finest ingredients from organic farms. Each dish is a masterpiece designed to delight your taste buds and create memorable dining experiences for our guests.
          </p>
        </section>

        {/* ================= RESORT GALLERY IMAGES ================= */}
        <section className="pb-16 select-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-6">
            {[
              "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600", // pool
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600", // resort
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600", // dining
              "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600"  // table
            ].map((img, idx) => (
              <div key={idx} className="aspect-[3/4] overflow-hidden rounded-sm shadow-md">
                <img 
                  src={img} 
                  alt={`Resort gallery ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= MENU HIGHLIGHTS SECTION ================= */}
        <section className="py-16 max-w-7xl mx-auto px-6 pb-28">
          
          <div className="text-center mb-10 select-none">
            <span className="text-[#c8a64d] uppercase tracking-[4px] mb-3 text-xs font-semibold font-sans block">
              Our Menu
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-[#0d2b4e]">
              Menu Highlights
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center items-center font-sans text-xs uppercase tracking-widest text-gray-400 select-none mb-8">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                {idx > 0 && <span className="text-[#c8a64d]/60">•</span>}
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`hover:text-[#c8a64d] transition font-bold cursor-pointer ${
                    selectedCategory === cat ? "text-[#c8a64d]" : "text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search & Veg filters */}
          <div className="max-w-xl mx-auto px-6 mb-16 flex flex-col sm:flex-row gap-6 items-center justify-between font-sans text-xs select-none">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fbfbfb] border border-gray-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0d2b4e] focus:outline-none focus:border-[#c8a64d] transition shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={13} />
            </div>

            {/* Veg Checkbox Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(e) => setVegetarianOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-200 bg-white text-[#c8a64d] focus:ring-[#c8a64d] accent-[#c8a64d]"
              />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 font-bold">
                <Leaf size={12} className="text-green-600" /> Veg Only
              </span>
            </label>
          </div>

          {/* LOADING & ERRORS */}
          {loading && (
            <div className="text-center text-[#c8a64d] py-16 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="animate-spin text-[#c8a64d]" size={28} />
              <span>Loading menu items...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-16 text-lg">
              Failed to load menu: {error}
            </div>
          )}

          {!loading && !error && filteredDishes.length === 0 && (
            <div className="text-center text-gray-400 py-16 text-lg font-light">
              No dishes found matching your current filters.
            </div>
          )}

          {/* DISHES LIST - 2 COLUMN MINIMALIST LAYOUT */}
          {!loading && !error && filteredDishes.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-y-12 md:gap-x-16 max-w-6xl mx-auto px-6">
              {filteredDishes.map((dish) => (
                <div 
                  key={dish.id || dish._id} 
                  onClick={() => setSelectedDishForOrder(dish)}
                  className="flex gap-4 items-start cursor-pointer group hover:opacity-90 transition"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-md">
                    <img 
                      src={getImageUrl(dish.image)} 
                      alt={dish.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end gap-2 mb-1">
                      <h4 className="font-serif text-lg text-[#0d2b4e] group-hover:text-[#c8a64d] transition truncate">
                        {dish.name}
                      </h4>
                      {/* Dotted connector */}
                      <div className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1.5 min-w-[20px]" />
                      <span className="font-sans text-sm font-semibold text-[#c8a64d] shrink-0">
                        ₹{parseFloat(dish.price).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed font-sans">
                      {dish.description || "Freshly cooked exquisite dish prepared by our resort specialty chefs."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ================= ORDER ROOM SERVICE MODAL ================= */}
      {selectedDishForOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 overflow-y-auto font-sans">
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
                <span className="text-[#c8a64d] font-bold">₹{selectedDishForOrder.price}</span>
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
                    <option key={room.id || room._id} value={room.roomNumber} className="bg-[#081A2F]">
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
                <span className="text-[#c8a64d] text-xl font-bold">₹{(selectedDishForOrder.price * quantity).toLocaleString()}</span>
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
                  className="bg-[#c8a64d] text-black px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition disabled:opacity-50 text-sm"
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
