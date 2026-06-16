import React from "react";
import { Link } from "react-router-dom";
import { Heart, Maximize, BedDouble, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "../../components/Toast";

const mockWishlist = [
  {
    id: 1,
    name: "Luxury Suite",
    price: 8999,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
    area: "600 SQ FT",
    beds: "KING BED",
    description: "Experience premium comfort with stunning views and luxury amenities.",
  }
];

const UserWishlist = () => {
  const toast = useToast();
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-serif font-light mb-6 text-white border-b border-yellow-500/10 pb-3">My Wishlist</h1>

      {mockWishlist.length === 0 ? (
        <div className="bg-zinc-950 border border-yellow-500/20 rounded-none p-12 text-center text-gray-400 font-light">
          <Heart size={40} className="mx-auto text-rose-500/50 mb-3" />
          <p className="text-lg font-medium">Your wishlist is empty.</p>
          <p className="text-xs mt-1 text-gray-500">Explore our luxury rooms and save your favorites here!</p>
          <Link to="/rooms" className="mt-4 inline-block bg-yellow-500 text-black px-6 py-2.5 rounded-none font-semibold text-xs uppercase tracking-widest hover:bg-yellow-400 transition">
            Browse Rooms
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mockWishlist.map((item) => (
            <div key={item.id} className="bg-zinc-950 border border-yellow-500/20 rounded-none overflow-hidden shadow-2xl flex flex-col justify-between hover:border-yellow-500/40 transition duration-300">
              <div>
                <div className="h-48 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toast.success("Room removed from wishlist.")}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-rose-400 hover:bg-black/80 hover:text-rose-500 cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h2 className="text-xl font-serif font-light text-white">{item.name}</h2>
                  <p className="text-yellow-500 font-bold text-sm">₹{item.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">/ night</span></p>
                  <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed font-light">{item.description}</p>
                  
                  <div className="flex gap-4 text-[9px] text-gray-400 border-t border-yellow-500/10 pt-3 mt-3 uppercase tracking-wider font-light">
                    <span className="flex items-center gap-1"><BedDouble size={12} className="text-yellow-500" /> {item.beds}</span>
                    <span className="flex items-center gap-1"><Maximize size={12} className="text-yellow-500" /> {item.area}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-yellow-500/10">
                <Link to={`/rooms/${item.id}`} className="w-full bg-yellow-500 text-black py-2.5 rounded-none font-semibold flex items-center justify-center gap-1 text-xs uppercase tracking-widest hover:bg-yellow-400 transition">
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