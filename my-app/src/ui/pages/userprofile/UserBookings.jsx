import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, Calendar, Users, Maximize } from "lucide-react";
import { API_URL } from "../../../config/api";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
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
    return `${API_URL}/uploads/${image}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "checked_in":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#0d2b4e]/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-[#c8a64d]" />
        <span className="font-light tracking-wider">Loading your reservations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-center max-w-md mx-auto mt-12 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#0d2b4e]">
      <h1 className="text-3xl font-serif font-light mb-6 text-[#0d2b4e] border-b border-gray-200/50 pb-3">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200/50 rounded-none p-12 text-center text-gray-500 font-light shadow-sm">
          <p className="text-lg">No bookings yet.</p>
          <p className="text-xs mt-1 text-gray-400">Ready to experience luxury? Go book your favorite room!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200/50 rounded-none overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-[#c8a64d]/40 transition duration-300">
              
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h2 className="text-2xl font-serif font-light text-[#0d2b4e]">{booking.room_name}</h2>
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded border w-fit ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs text-gray-500">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Check In</p>
                      <p className="font-semibold mt-1 text-[#0d2b4e]">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Check Out</p>
                      <p className="font-semibold mt-1 text-[#0d2b4e]">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Guests</p>
                      <p className="font-semibold mt-1 text-[#0d2b4e]">{booking.adults} Adults {booking.children > 0 && `, ${booking.children} Children`}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Total Price</p>
                      <p className="font-bold mt-1 text-[#c8a64d] text-sm">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-4 mt-6 flex justify-between items-center text-[10px] text-gray-500">
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