import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/rooms/${id}`);
        if (!response.ok) {
          throw new Error("Room not found");
        }
        const data = await response.json();
        if (data.success) {
          setRoom(data.data);
        } else {
          throw new Error(data.message || "Failed to load room details");
        }

        // Fetch other rooms for similar rooms section
        const allRes = await fetch(`${API_URL}/api/rooms`);
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.success) {
            setSimilarRooms(allData.data.filter(r => r.id !== Number(id)).slice(0, 2));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut)
      return { nights: 0, total: room ? parseFloat(room.price) : 0 };

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start)
      return { nights: 0, total: parseFloat(room.price) };

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return {
      nights,
      total: nights * parseFloat(room.price),
    };
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please sign in to book a room.");
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.warning("Please select check-in and check-out dates.");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    setBookingLoading(true);

    if (paymentMethod === "online") {
      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
          setBookingLoading(false);
          return;
        }

        // 1. Create order on backend
        const orderRes = await fetch(`${API_URL}/api/bookings/razorpay-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            room_id: room.id,
            check_in: checkIn,
            check_out: checkOut
          })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.message || "Failed to initiate online order.");
        }

        // 2. Open Razorpay checkout modal
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Sree Raaga Resort",
          description: `Booking for ${room.name}`,
          image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=120&h=120",
          order_id: orderData.order_id,
          handler: async function (response) {
            try {
              setBookingLoading(true);
              const verifyRes = await fetch(`${API_URL}/api/bookings/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  room_id: room.id,
                  check_in: checkIn,
                  check_out: checkOut,
                  adults,
                  children
                })
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(verifyData.message || "Payment verification failed.");
              }

              toast.success("Online payment verified & booking confirmed successfully!");
              navigate("/dashboard/bookings");
            } catch (err) {
              toast.error(err.message || "Payment verification failed.");
            } finally {
              setBookingLoading(false);
            }
          },
          theme: {
            color: "#C8A64D"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error(err.message || "Failed to start online payment.");
      } finally {
        setBookingLoading(false);
      }
    } else {
      // CASH payment method
      try {
        const response = await fetch(`${API_URL}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            room_id: room.id,
            check_in: checkIn,
            check_out: checkOut,
            adults,
            children,
            payment_method: "cash"
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to submit booking.");
        }

        toast.success("Booking request submitted successfully! Please pay cash at resort check-in.");
        navigate("/dashboard/bookings");
      } catch (err) {
        toast.error(err.message || "Booking failed.");
      } finally {
        setBookingLoading(false);
      }
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <p className="text-yellow-500 text-2xl font-light">Loading room details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Navbar />
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-2xl font-light">Error: {error || "Room not found"}</p>
        </div>
        <Footer />
      </>
    );
  }

  const totals = calculateTotal();
  const features = room.features || [
    "Free WiFi",
    "Swimming Pool",
    "Breakfast Included",
    "Room Service",
    "Smart TV",
    "Private Balcony",
  ];



  return (
 <>
  <Navbar/>
    <div className="bg-black text-white">

      {/* Hero */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${getImageUrl(room.image)})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-light mb-4">
            {room.name}
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / Room Details
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left Side */}
          <div className="lg:col-span-2">

            <img
              src={getImageUrl(room.image)}
              alt={room.name}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover mb-10"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-yellow-500/20 pb-8 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl mb-4">
                  {room.name}
                </h2>

                <div className="flex flex-wrap gap-3 text-yellow-500 text-xs uppercase">
                  <span>{room.area}</span>
                  <span>•</span>
                  <span>{room.beds}</span>
                  <span>•</span>
                  <span>{room.bathrooms}</span>
                </div>
              </div>

              <div className="border border-yellow-500/30 px-6 py-3 shrink-0">
                <p className="text-xs text-gray-400 mb-1">
                  Price
                </p>

                <p className="text-xl sm:text-2xl text-yellow-500">
                  ₹{parseFloat(room.price).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">
              {room.description}
            </p>

            <p className="text-gray-400 leading-relaxed mb-10">
              Enjoy world-class hospitality, premium amenities,
              and unforgettable luxury experiences at our resort.
            </p>

            {/* Features */}
            <h3 className="text-3xl mb-8">
              Extra Services
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <Check
                    size={18}
                    className="text-yellow-500"
                  />

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Review */}
            <div className="border border-yellow-500/20 p-8 bg-zinc-950 flex justify-between items-center">
              <div className="flex gap-5 items-center">
                <span className="text-6xl text-yellow-500">
                  5.0
                </span>

                <div>
                  <div className="flex gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm">
                    5 Reviews
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Booking Sidebar */}
          <div>

            <div className="bg-[oklch(0.35_0.05_96.46)] border border-yellow-500/20 p-8 sticky top-28">

              <h3 className="text-3xl mb-8">
                Book Now
              </h3>

              <div className="space-y-5">

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Check In
                  </label>

                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) =>
                      setCheckIn(e.target.value)
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Check Out
                  </label>

                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) =>
                      setCheckOut(e.target.value)
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Adults
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) =>
                      setAdults(Number(e.target.value))
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Children
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) =>
                      setChildren(Number(e.target.value))
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-transparent text-white border-b border-gray-600 py-2 outline-none cursor-pointer"
                  >
                    <option value="online" className="bg-zinc-950 text-white">Online Payment (Razorpay)</option>
                    <option value="cash" className="bg-zinc-950 text-white">Pay at Resort (Cash)</option>
                  </select>
                </div>

                <div className="border-t border-yellow-500/20 pt-6 text-center">

                  <p className="text-gray-400 mb-2">
                    Total Price
                  </p>

                  <p className="text-4xl text-yellow-500 mb-2">
                    ₹{totals.total.toLocaleString()}
                  </p>

                  {totals.nights > 0 && (
                    <p className="text-gray-500 text-sm mb-6">
                      {totals.nights} Nights
                    </p>
                  )}

                  <button
                    className="w-full py-4 bg-yellow-500 text-black hover:bg-yellow-400 transition font-bold disabled:bg-yellow-500/50"
                    onClick={handleBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Book Now"}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Similar Rooms */}
        <div className="mt-24">

          <h2 className="text-4xl text-center mb-12">
            Similar Rooms
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {similarRooms.length === 0 ? (
              <p className="text-center text-white/40 col-span-2">No other rooms available.</p>
            ) : (
              similarRooms.map((item) => (
                <Link
                  key={item.id}
                  to={`/rooms/${item.id}`}
                  className="group"
                >
                  <div className="overflow-hidden mb-4">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>

                  <h3 className="text-2xl group-hover:text-yellow-500">
                    {item.name}
                  </h3>
                </Link>
              ))
            )}

          </div>

        </div>

      </section>
    </div>
      <Footer/>
   </>
  );
};

export default RoomDetails;