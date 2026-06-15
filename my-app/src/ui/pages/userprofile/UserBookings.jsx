import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, Calendar, Users, Maximize } from "lucide-react";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setBookings(res.data.data);
        } else {
          throw new Error(res.data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "checked_in":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-yellow-500" />
        <span className="font-light tracking-wider">Loading your reservations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-none text-center max-w-md mx-auto mt-12 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-serif font-light mb-6 text-white border-b border-yellow-500/10 pb-3">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-zinc-950 border border-yellow-500/20 rounded-none p-12 text-center text-gray-400 font-light shadow-2xl">
          <p className="text-lg">No bookings yet.</p>
          <p className="text-xs mt-1 text-gray-500">Ready to experience luxury? Go book your favorite room!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-zinc-950 border border-yellow-500/20 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row hover:border-yellow-500/40 transition duration-300">
              
              {/* Room Image */}
              <div className="md:w-64 h-48 md:h-auto relative">
                <img 
                  src={getImageUrl(booking.room_image)} 
                  alt={booking.room_name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Booking Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-serif font-light text-white">{booking.room_name}</h2>
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded border ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs text-gray-300">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Check In</p>
                      <p className="font-semibold mt-1 text-white">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Check Out</p>
                      <p className="font-semibold mt-1 text-white">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Guests</p>
                      <p className="font-semibold mt-1 text-white">{booking.adults} Adults {booking.children > 0 && `, ${booking.children} Children`}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Total Price</p>
                      <p className="font-bold mt-1 text-yellow-500 text-sm">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-yellow-500/10 pt-4 mt-6 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Booking ID: BK-{booking.id.toString().padStart(4, "0")}</span>
                  <span>Booked on: {new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;