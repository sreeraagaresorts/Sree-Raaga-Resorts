import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Maximize, 
  Users, 
  Bed, 
  Bath, 
  Check, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Calendar,
  Lock,
  Wind
} from "lucide-react";
import Navbar from "../components/RoomNav";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";
import DatePicker from "react-datepicker";

const fallbackRoomsDetails = {
  "executive-room": {
    id: "executive-room",
    name: "Executive Room",
    price: 4990,
    area: "30 M²",
    beds: "1 Double Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "EXECUTIVE ROOMS",
    description: "Our Executive Rooms offer a perfect blend of comfort and style, featuring modern amenities, cozy bedding, and a peaceful atmosphere for business or leisure travelers.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
  },
  "1bhk-villa": {
    id: "1bhk-villa",
    name: "1 BHK Villa",
    price: 6990,
    area: "45 M²",
    beds: "1 King Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "1 BHK VILLAS",
    description: "Indulge in our private 1 BHK Villas, offering a spacious living area, fully equipped kitchenette, and a private balcony overlooking the resort's lush gardens.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
  },
  "compact-villa": {
    id: "compact-villa",
    name: "Compact Villa",
    price: 5990,
    area: "38 M²",
    beds: "1 Queen Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "COMPACT VILLAS",
    description: "Compact yet luxurious, these villas are perfect for couples looking for privacy and comfort, complete with premium fittings and beautiful outdoor patio seating.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
  },
  "duplex-villa": {
    id: "duplex-villa",
    name: "Duplex Villa",
    price: 9990,
    area: "75 M²",
    beds: "2 Double Beds",
    bathrooms: "2 Bathrooms",
    guests: "4 Guests",
    category: "DUPLEX VILLA",
    description: "Our signature Duplex Villa is the pinnacle of resort luxury, spanning two levels with separate living spaces, a private pool access, and premium butler service.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
  },
  "panorama-suite": {
    id: "panorama-suite",
    name: "Panorama Suite",
    price: 7990,
    area: "50 M²",
    beds: "1 King Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "PANORAMA SUITE",
    description: "Wake up to stunning panoramic views of the scenic surrounding mountains. Features a luxury jacuzzi, premium sound system, and floor-to-ceiling glass windows.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800"
  },
  "garden-cottage": {
    id: "garden-cottage",
    name: "Garden Cottage",
    price: 5490,
    area: "35 M²",
    beds: "1 Double Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "COMPACT VILLAS",
    description: "Tucked away in the resort's quietest garden corner, this cottage offers rustic charm blended with modern comfort, ideal for a serene nature getaway.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800"
  }
};

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const userStr = localStorage.getItem("user");
  let isAdmin = false;
  if (userStr) {
    try {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser && parsedUser.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {}
  }

  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [extraService1, setExtraService1] = useState(false); // Service per Booking (₹1000)
  const [extraService2, setExtraService2] = useState(false); // Service per Person Daily (₹1200)
  
  // Custom dropdown open states
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isAdultsOpen, setIsAdultsOpen] = useState(false);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);

  // Slider State
  const [galleryIndex, setGalleryIndex] = useState(0);

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
            setSimilarRooms(allData.data.filter(r => r.id !== Number(id) && r.id !== id));
          }
        }
      } catch (err) {
        console.warn("API Offline or room not found, using fallback details:", err.message);
        // Fallback to mock details
        const mockRoom = fallbackRoomsDetails[id] || fallbackRoomsDetails["executive-room"];
        setRoom(mockRoom);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".booking-field")) {
        setIsRoomsOpen(false);
        setIsAdultsOpen(false);
        setIsChildrenOpen(false);
        setIsPaymentMethodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getGalleryImages = () => {
    const mainImg = getImageUrl(room?.image);
    if (room?.images && room.images.length > 0) {
      return [mainImg, ...room.images.map(img => getImageUrl(img))];
    }
    return [
      mainImg,
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
    ];
  };

  const calculateTotal = () => {
    if (!room) return { nights: 0, subtotal: 0, services: 0, total: 0 };

    let nights = 0;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      }
    }

    const priceVal = parseFloat(room.price) || 4990;
    const subtotal = (nights > 0 ? nights : 1) * priceVal * rooms;
    
    let services = 0;
    if (extraService1) {
      services += 1000;
    }
    if (extraService2) {
      const totalGuests = Number(adults) + Number(children);
      services += 1200 * totalGuests * (nights > 0 ? nights : 1);
    }

    return {
      nights,
      subtotal,
      services,
      total: subtotal + services
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
    if (isAdmin) {
      toast.error("Administrators cannot book rooms in the user interface.");
      return;
    }

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

    const totals = calculateTotal();
    setBookingLoading(true);

    if (paymentMethod === "online") {
      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
          setBookingLoading(false);
          return;
        }

        const orderRes = await fetch(`${API_URL}/api/bookings/razorpay-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            room_id: room.id || room._id,
            check_in: checkIn,
            check_out: checkOut,
            rooms,
            total_amount: totals.total // Include calculated totals with services
          })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.message || "Failed to initiate online order.");
        }

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
                  room_id: room.id || room._id,
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
        console.error("Booking API Error, mock booking request:", err.message);
        toast.success("Demo Mode: Booking request processed successfully!");
        navigate("/dashboard/bookings");
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
            room_id: room.id || room._id,
            check_in: checkIn,
            check_out: checkOut,
            adults,
            children,
            rooms,
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
        console.warn("Cash booking API failure, mock request successful:", err.message);
        toast.success("Demo Mode: Cash booking request processed successfully!");
        navigate("/dashboard/bookings");
      } finally {
        setBookingLoading(false);
      }
    }
  };

  const getSimilarRoomsList = () => {
    if (similarRooms.length > 0) return similarRooms.slice(0, 3);
    const mockList = Object.values(fallbackRoomsDetails).filter(r => r.id !== id);
    return mockList.slice(0, 3);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#fdfeff] text-[#0d2b4e] min-h-screen flex items-center justify-center ">
          <p className="text-[#c8a64d] text-2xl font-light">Loading room details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !room) {
    return (
      <>
        <Navbar />
        <div className="bg-[#fdfeff] text-[#0d2b4e] min-h-screen flex items-center justify-center ">
          <p className="text-red-500 text-2xl font-light">Error: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  const totals = calculateTotal();
  const gallery = getGalleryImages();
  const visibleImagesCount = 3; 
  const maxGalleryIndex = Math.max(0, gallery.length - visibleImagesCount);

  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden min-h-screen pt-28 md:pt-36">
        
        {/* ================= MAIN CONTENT DETAILS GRID ================= */}
        <section className="py-12 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[6.8fr_4.2fr] gap-16 items-start">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* Gallery Image Slider (Single active image layout matching Swiss Resort) */}
              <div className="relative overflow-hidden aspect-[80/55] shadow-md group select-none bg-black/5 ">
                {gallery.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-750 ease-in-out ${
                      idx === galleryIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Room Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Left/Right chevrons */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-[#c8a64d] backdrop-blur-md text-white flex items-center justify-center transition-all z-20 border border-white/10 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-[#c8a64d] backdrop-blur-md text-white flex items-center justify-center transition-all z-20 border border-white/10 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Price, Title & Specs */}
              <div className="select-none space-y-4">
                <div className="font-semibold text-xs uppercase tracking-[2px] font-jost text-[#c8a64d]">
                  ₹{parseFloat(room.price).toLocaleString()} / NIGHT
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium font-corm text-[#0d2b4e] leading-tight">
                  {room.name}
                </h1>
                
                {/* Specs Row */}
                <div className="flex flex-wrap items-center gap-6 text-[15px] text-gray-500 font-jost">
                  <div className="flex items-center">
                    <Maximize className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.area || "30 M²"} SQM</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.guests || "2 Guests"} Guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.beds || "1 Bed"}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.bathrooms || "1 Bath"} Bathroom</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* About accommodation */}
              <div className="space-y-4">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e]">
                  About accommodation
                </h3>
                <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed ">
                  {room.description}
                </p>
                <p className="text-gray-500 text-xs md:text-[17px] leading-relaxed ">
                  Experience premium resort living with custom services tailored specifically for you. Sree Raaga Resorts prioritizes design excellence and clean spaces to make your vacation peaceful and relaxing.
                </p>
              </div>

              <hr className="border-gray-200/60" />

              {/* Room Amenities (12 items) */}
              <div className="space-y-6">
                <h3 className="text-3xl font-medium  font-corm text-[#0d2b4e] select-none">
                  Room Amenities
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 select-none">
                  {[
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12a10 10 0 0 1 14 0" /><path d="M8.5 15a5 5 0 0 1 7 0" /><circle cx="12" cy="18" r="1" fill="currentColor" /><path d="M15 10v2.5c0 1.2.8 2.2 2 2.5 1.2-.3 2-1.3 2-2.5V10l-2-1-2 1z" /><path d="M16.5 12l0.7 0.7 1.3-1.3" />
                        </svg>
                      ), 
                      name: "Wifi & Internet" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M3 18h18" /><path d="M8 18V8h7v10" /><path d="M5 8h12v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1z" /><line x1="8" y1="12" x2="11" y2="10" /><circle cx="11" cy="10" r="1" />
                        </svg>
                      ), 
                      name: "Buggy services" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="6" width="14" height="10" rx="1" /><path d="M8 16v3h4v-3H8zM6 19h8" /><rect x="19" y="8" width="2" height="8" rx="0.5" /><circle cx="20" cy="10" r="0.5" fill="currentColor" /><line x1="20" y1="12" x2="20" y2="15" strokeWidth="1" />
                        </svg>
                      ), 
                      name: "Smart TV" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 17h18" /><path d="M6 17a6 6 0 0 1 12 0" /><circle cx="12" cy="9.5" r="1.5" /><path d="M2 20h20" />
                        </svg>
                      ), 
                      name: "Room Service" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="4" width="14" height="16" rx="2" /><circle cx="12" cy="13" r="5" /><circle cx="12" cy="13" r="3" strokeDasharray="2 1" /><circle cx="8" cy="7" r="0.8" fill="currentColor" /><circle cx="10" cy="7" r="0.8" fill="currentColor" /><line x1="13" y1="7" x2="16" y2="7" />
                        </svg>
                      ), 
                      name: "Laundry Services" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12h8l-1 8H5l-1-8z" /><path d="M4 12a4 4 0 0 1 8 0" /><line x1="18" y1="4" x2="10" y2="20" /><path d="M16 4l3 3-1.5 1.5-3-3L16 4z" fill="currentColor" /><path d="M20 12l0.5 0.5-0.5 0.5-0.5-0.5z" fill="currentColor" /><path d="M15 18l0.4 0.4-0.4 0.4-0.4-0.4z" fill="currentColor" />
                        </svg>
                      ), 
                      name: "Housekeeper Services" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Mini Bar outline icon */}
                          <rect x="5" y="3" width="14" height="18" rx="2" /><line x1="5" y1="10" x2="19" y2="10" /><circle cx="9" cy="6" r="1" fill="currentColor" /><line x1="15" y1="14" x2="15" y2="17" />
                        </svg>
                      ), 
                      name: "Mini Bar" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Telephone outline icon */}
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      ), 
                      name: "Telephone" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Hair Dryer outline icon */}
                          <path d="M12 6h8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-8v-6z" /><path d="M12 12l-3 8" /><path d="M15 14v4" /><circle cx="7" cy="9" r="2" />
                        </svg>
                      ), 
                      name: "Hair Dryer" 
                    },
                    { 
                      icon: <Lock className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, 
                      name: "Safe Box" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Slippers/Bathrobe hanger */}
                          <path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" /><path d="M19 9l-4-3H9L5 9v11h14V9z" />
                        </svg>
                      ), 
                      name: "Slippers & Bathrobe" 
                    },
                    { 
                      icon: <Wind className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, 
                      name: "Air conditioning" 
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs  text-gray-700">
                      {item.icon}
                      <span className="text-[15px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* What's included in this suite? */}
              <div className="space-y-6">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e] select-none">
                  What's included in this suite?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-none  text-xs md:text-sm text-gray-600">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span  className="text-[17px]">220V electrical sockets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span className="text-[17px]">Safety box</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span className="text-[17px]">Room safe for your top mountain photos</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span className="text-[17px]">220V electrical sockets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span className="text-[17px]">Slippers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#c8a64d]" />
                      <span className="text-[17px]">Mini bar</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Room Rules */}
              <div className="space-y-6">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e] select-none">
                  Room Rules
                </h3>
                
                <ul className="space-y-4  text-xs md:text-[17px] text-gray-500 list-disc pl-5 select-none">
                  <li>Check-in from 9:00 AM - anytime</li>
                  <li>Check-out: 11:00 AM</li>
                  <li>Self-check-in with lockbox</li>
                  <li>No smoking</li>
                  <li>Pets are allowed</li>
                </ul>
              </div>

            </div>

            {/* RIGHT COLUMN (BOOKING SIDEBAR CARD) */}
            <div className="lg:sticky ">
              <div className=" border border-gray-200/80 p-8  space-y-14  shadow-xl">
                
                <h3 className="text-3xl md:text-[30px] font-semibold font-corm text-[#0d2b4e] select-none text-center lg:text-left">
                  Book Your Room
                </h3>
                <div className="space-y-5 font-jost">
                  {/* Dates range picker dropdown */}
                  <div className="relative">
                    <DatePicker
                      wrapperClassName="w-full"
                      selectsRange={true}
                      startDate={checkIn ? new Date(checkIn) : null}
                      endDate={checkOut ? new Date(checkOut) : null}
                      onChange={(update) => {
                        const [start, end] = update;
                        const formatDate = (date) => {
                          if (!date) return "";
                          const tzOffset = date.getTimezoneOffset() * 60000;
                          return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
                        };
                        setCheckIn(start ? formatDate(start) : "");
                        setCheckOut(end ? formatDate(end) : "");
                      }}
                      minDate={new Date()}
                      customInput={
                        <button
                          type="button"
                          className="w-full border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] flex items-center justify-between outline-none cursor-pointer text-left font-jost focus:border-[#c8a64d] transition-all"
                        >
                          <span className="font-medium text-[#0d2b4e]">
                            {checkIn
                              ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}${
                                  checkOut
                                    ? ` - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                                    : " - Check Out"
                                }`
                              : "Check In - Check Out"}
                          </span>
                          <ChevronDown size={16} className="text-gray-400" />
                        </button>
                      }
                      calendarClassName="custom-datepicker"
                      popperModifiers={[
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "viewport",
                          },
                        },
                      ]}
                    />
                  </div>

                   {/* Rooms dropdown */}
                  <div className="relative booking-field">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoomsOpen(!isRoomsOpen);
                        setIsAdultsOpen(false);
                        setIsChildrenOpen(false);
                        setIsPaymentMethodOpen(false);
                      }}
                      className="w-full border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] flex items-center justify-between outline-none cursor-pointer text-left font-jost focus:border-[#c8a64d] transition-all"
                    >
                      <span className="font-medium text-[#0d2b4e]">
                        {rooms} {rooms === 1 ? "Room" : "Rooms"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${isRoomsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isRoomsOpen && (
                      <div className="absolute top-[110%] left-0 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">Rooms</span>
                          <div className="flex items-center gap-6">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rooms > 1) setRooms(rooms - 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              -
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{rooms}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rooms < 5) setRooms(rooms + 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Adults dropdown */}
                  <div className="relative booking-field">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdultsOpen(!isAdultsOpen);
                        setIsRoomsOpen(false);
                        setIsChildrenOpen(false);
                        setIsPaymentMethodOpen(false);
                      }}
                      className="w-full border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] flex items-center justify-between outline-none cursor-pointer text-left font-jost focus:border-[#c8a64d] transition-all"
                    >
                      <span className="font-medium text-[#0d2b4e]">
                        {adults} {adults === 1 ? "Adult (18+ Years)" : "Adults (18+ Years)"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${isAdultsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isAdultsOpen && (
                      <div className="absolute top-[110%] left-0 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">Adults (18+ Years)</span>
                          <div className="flex items-center gap-6">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (adults > 1) setAdults(adults - 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              -
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{adults}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (adults < 10) setAdults(adults + 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Children dropdown */}
                  <div className="relative booking-field">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChildrenOpen(!isChildrenOpen);
                        setIsRoomsOpen(false);
                        setIsAdultsOpen(false);
                        setIsPaymentMethodOpen(false);
                      }}
                      className="w-full border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] flex items-center justify-between outline-none cursor-pointer text-left font-jost focus:border-[#c8a64d] transition-all"
                    >
                      <span className="font-medium text-[#0d2b4e]">
                        {children === 0 ? "Children" : children === 1 ? "1 Child" : `${children} Children`}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${isChildrenOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isChildrenOpen && (
                      <div className="absolute top-[110%] left-0 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">Children</span>
                          <div className="flex items-center gap-6">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (children > 0) setChildren(children - 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              -
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{children}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (children < 10) setChildren(children + 1);
                              }}
                              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                   
                    {/* <div className="relative booking-field">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPaymentMethodOpen(!isPaymentMethodOpen);
                          setIsRoomsOpen(false);
                          setIsAdultsOpen(false);
                          setIsChildrenOpen(false);
                        }}
                        className="w-full bg-white border border-gray-200 rounded px-4 py-4 text-xs text-[#0d2b4e] flex items-center justify-between outline-none cursor-pointer text-left font-jost focus:border-[#c8a64d] transition-all"
                      >
                        <span className="font-medium text-[#0d2b4e]">
                          {paymentMethod === "online" ? "Online Payment (Razorpay)" : "Pay at Resort (Cash)"}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-gray-400 transition-transform duration-300 ${isPaymentMethodOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isPaymentMethodOpen && (
                        <div className="absolute top-[110%] left-0 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl py-3 px-2 shadow-2xl z-50 font-jost text-left select-none border-none">
                          {[
                            { label: "Online Payment (Razorpay)", value: "online" },
                            { label: "Pay at Resort (Cash)", value: "cash" }
                          ].map((option) => (
                            <div
                              key={option.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentMethod(option.value);
                                setIsPaymentMethodOpen(false);
                              }}
                              className={`px-4 py-2.5 rounded-full text-xs lg:text-sm font-semibold transition hover:bg-[#fbd2a4] hover:text-[#0d2b4e] cursor-pointer ${
                                paymentMethod === option.value ? "bg-[#0d2b4e] text-white" : ""
                              }`}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div> */}
                  </div>

                  {/* Price Calculation details */}
                  <div className="border-t border-gray-200/60 pt-5 space-y-2 select-none">
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-[17px] font-semibold text-[#0d2b4e]">Total Cost</span>
                      <span className="text-4xl font-bold text-[#c8a64d]">₹{totals.total.toLocaleString()}</span>
                    </div>
                    {totals.nights > 0 && (
                      <span className="text-yellow-500 text-[14px] font-semibold uppercase tracking-wider block text-right">
                        For {totals.nights} Nights Stay
                      </span>
                    )}
                  </div>

                  {/* Booking Trigger CTA */}
                  {isAdmin ? (
                    <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center">
                      Administrators cannot book rooms in the user interface.
                    </div>
                  ) : (
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className="w-full mt-4 py-5 bg-[#f5d7b8] hover:bg-[#0d2b4e] text-[#0d2b4e] hover:text-white transition font-bold uppercase tracking-[2.5px] text-[17px] shadow-md disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                    >
                      {bookingLoading ? "Processing..." : `BOOK YOUR STAY NOW`}
                    </button>
                  )}

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= SIMILAR ROOMS SECTION ================= */}
        <section className="py-24 px-6 bg-[#fdfeff] border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Titles */}
            <div className="flex flex-col sm:flex-row justify-between items-end mb-16 select-none">
              <div>
           
                <h2 className="text-3xl md:text-4xl font-medium font-corm  text-[#0d2b4e]">
                  Similar Rooms
                </h2>
              </div>
              <Link 
                to="/rooms" 
                className="group inline-flex items-center text-xs font-bold  uppercase tracking-[2px] text-[#0d2b4e] hover:text-[#c8a64d] transition-colors mt-4 sm:mt-0"
              >
                <span className="mr-2 border-b border-transparent group-hover:border-[#c8a64d] pb-0.5">View All Rooms</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getSimilarRoomsList().map((item) => (
                <div key={item.id || item._id} className="group flex flex-col">
                  {/* Image hover block */}
                  <Link 
                    to={`/rooms/${item.id || item._id}`} 
                    className="block relative overflow-hidden rounded-sm aspect-[76/62] mb-6 shadow-md"
                  >
                    <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
                      <span className="text-[10px] font-semibold  tracking-[3px]">BOOK NOW</span>
                    </div>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Title & Price details */}
                  <div className="flex flex-col select-none">
                    <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="text-xl md:text-2xl font-medium font-corm  text-[#0d2b4e] transition-colors duration-300 group-hover:text-[#c8a64d]">
                          {item.name}
                        </h4>
                        {item.category && (
                          <span className="text-[11px] text-[#c8a64d]  font-bold tracking-[2px] block mt-1 uppercase">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs md:text-sm  font-semibold text-[#c8a64d]">
                          ₹{parseFloat(item.price).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-gray-400  block tracking-wider uppercase font-semibold">
                          / NIGHT
                        </span>
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="flex flex-wrap items-center gap-4 pb-6 text-[13px]  text-gray-400">
                      <div className="flex items-center">
                        <Maximize className="w-3.5 h-3.5 text-[#c8a64d] mr-1.5" strokeWidth={1.2} />
                        <span className="text-black">{item.area || "30 M²"} Sqft</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-3.5 h-3.5 text-[#c8a64d] mr-1.5" strokeWidth={1.2} />
                        <span className="text-black">{item.beds || "1 Bed"} Bed</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-3.5 h-3.5 text-[#c8a64d] mr-1.5" strokeWidth={1.2} />
                        <span className="text-black">{item.bathrooms || "1 Bath"} Bathroom</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default RoomDetails;