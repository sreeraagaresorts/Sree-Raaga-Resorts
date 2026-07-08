import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Maximize, BedDouble, Trash2, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "../../components/Toast";
import { API_URL } from "../../../config/api";

const UserWishlist = () => {
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setWishlist(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (roomId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });
      const data = await response.json();
      if (data.success) {
        setWishlist((prev) => prev.filter((item) => item.id !== roomId));
        toast.success("Room removed from wishlist.");
      } else {
        throw new Error(data.message || "Failed to remove from wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not remove room from wishlist.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#0d2b4e] font-light">
        <RefreshCw className="animate-spin w-8 h-8 text-[#c8a64d] mb-4" />
        <p className="text-sm">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#0d2b4e]">
      <h1 className="text-3xl font-medium mb-6 text-[#0d2b4e] border-b border-gray-200/50 pb-3">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-gray-200/50  p-12 text-center text-gray-500 font-light shadow-sm">
          <Heart size={40} className="mx-auto text-rose-500/50 mb-3" />
          <p className="text-lg font-medium">Your wishlist is empty.</p>
          <p className="text-xs mt-1 text-gray-600 font-medium">Explore our luxury rooms and save your favorites here!</p>
          <Link to="/rooms" className="mt-4 inline-block bg-[#c8a64d] text-white px-6 py-4  font-semibold text-xs uppercase tracking-widest hover:bg-[#b09141] transition shadow-sm">
            Browse Rooms
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div key={item.id || item._id} className="bg-white border border-gray-200/50  overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#c8a64d]/40 transition duration-300">
              <div>
                <div className="h-48 relative bg-gray-100">
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-1.5 bg-black/60  text-rose-400 hover:bg-black/80 hover:text-rose-500 cursor-pointer border-0"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h2 className="text-xl font-medium text-[#0d2b4e]">{item.name}</h2>
                  <p className="text-[#c8a64d] font-bold text-lg">₹{parseFloat(item.price).toLocaleString()} <span className="text-gray-500 font-medium text-[17px]">/ night</span></p>
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed font-medium">{item.description}</p>
                  
                  <div className="flex gap-4 text-[14px] text-gray-500 border-t border-gray-200/50 pt-3 mt-3 uppercase tracking-wider font-medium">
                    <span className="flex items-center gap-1"><BedDouble size={12} className="text-[#c8a64d]" /> {item.beds || "KING BED"}</span>
                    <span className="flex items-center gap-1"><Maximize size={12} className="text-[#c8a64d]" /> {item.area || "500 SQ FT"}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-200/50">
               <Link
  to={`/rooms/${item.id}`}
  className="block w-full rounded-none bg-[#c8a64d] text-white py-3 font-semibold rounded-none flex items-center justify-center gap-1 text-xs uppercase tracking-widest hover:bg-[#b09141] transition shadow-sm"
>
  Book Stay Now <ArrowRight size={12} />
</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;