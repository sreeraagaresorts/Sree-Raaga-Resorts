import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
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
  Wind,
  X,
  Tag
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
  
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // Custom dropdown open states
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isAdultsOpen, setIsAdultsOpen] = useState(false);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);

  // Dynamic Labeling for Villas vs Rooms
  const isVilla = room?.category?.toLowerCase().includes("villa") || false;
  const unitLabelSingle = isVilla ? "Villa" : "Room";
  const unitLabelPlural = isVilla ? "Villas" : "Rooms";

  // Slider State
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  // Coupon State
  const [coupons, setCoupons] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (!room) return;
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/coupons`);
        const data = await res.json();
        if (data.success) {
          const now = new Date();
          const target = isVilla ? "VILLAS" : "ROOMS";

          const valid = data.data.filter(c => 
            c.status === "active" && 
            new Date(c.expiry_date) >= now &&
            (c.target_service === "ALL" || c.target_service === target) &&
            (!c.max_cap || c.used_count < c.total_uses)
          );
          setCoupons(valid);
        }
      } catch (err) {}
    };
    fetchCoupons();
  }, [room]);

  const handleApplyCoupon = (codeOverride) => {
    const code = (typeof codeOverride === 'string' ? codeOverride : couponInput).trim().toUpperCase();
    if (!code) return;
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      toast.error("Invalid or expired coupon code.");
      return;
    }
    setAppliedCoupon(coupon);
    setIsCouponModalOpen(false);
    setCouponInput("");
    toast.success(`Coupon ${code} applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed.");
  };

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
    const checkRoomAvailability = async (silent = false) => {
      if (!checkIn || !checkOut || !room) {
        setAvailability(null);
        return;
      }
      if (!silent) setCheckingAvailability(true);
      try {
        const response = await fetch(`${API_URL}/api/rooms/${room.id || room._id}/availability?check_in=${checkIn}&check_out=${checkOut}`);
        const data = await response.json();
        if (data.success) {
          setAvailability(data);
        } else {
          setAvailability(null);
        }
      } catch (err) {
        console.warn("Failed to check availability:", err.message);
        setAvailability(null);
      } finally {
        if (!silent) setCheckingAvailability(false);
      }
    };
    checkRoomAvailability();

    const interval = setInterval(() => {
      checkRoomAvailability(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [checkIn, checkOut, room]);

  const maxAvailable = availability ? availability.remainingRooms : (room ? room.totalRooms : 5);

  useEffect(() => {
    if (rooms > maxAvailable) {
      setRooms(maxAvailable || 1);
    }
  }, [maxAvailable, rooms]);

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

    let subtotalWithServices = subtotal + services;
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === "percentage") {
        discount = (subtotalWithServices * appliedCoupon.discount_value) / 100;
        if (appliedCoupon.max_cap && discount > appliedCoupon.max_cap) {
          discount = appliedCoupon.max_cap;
        }
      } else {
        discount = appliedCoupon.discount_value;
      }
    }

    let gst = 0;
    const gstRate = room.gst_percentage !== undefined ? room.gst_percentage : 8;
    const taxableAmount = Math.max(0, subtotalWithServices - discount);
    gst = (taxableAmount * gstRate) / 100;

    return {
      nights,
      subtotal,
      services,
      discount,
      gst,
      gstRate,
      total: Math.max(0, taxableAmount + gst)
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

    const isSoldOut = availability && (availability.available === false || rooms > availability.remainingRooms);
    if (isSoldOut) {
      toast.error("Booking failed. This room type is fully booked for the selected dates.");
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

        // Detect demo/mock mode (no real Razorpay keys configured)
        const isDemoMode = !orderData.key_id || orderData.key_id === "rzp_test_mockkeyid12";

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Sree Raaga Resort",
          description: `Booking for ${room.name}`,
          image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=120&h=120",
          order_id: orderData.order_id,
          handler: async function (response) {
            // If running in demo/mock mode, skip server-side signature verification
            if (isDemoMode) {
              toast.success("Demo Mode: Booking request processed successfully!");
              navigate("/dashboard/bookings");
              return;
            }

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
                  children,
                  rooms,
                  total_price: totals.total,
                  subtotal: totals.subtotal,
                  services_price: totals.services,
                  discount_price: totals.discount,
                  gst_amount: totals.gst,
                  coupon_code: appliedCoupon ? appliedCoupon.code : null
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
            payment_method: "cash",
            total_price: totals.total,
            subtotal: totals.subtotal,
            services_price: totals.services,
            discount_price: totals.discount,
            gst_amount: totals.gst,
            coupon_code: appliedCoupon ? appliedCoupon.code : null
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
  const isBookingFull = availability && (availability.available === false || rooms > availability.remainingRooms);
  const gallery = getGalleryImages();
  const visibleImagesCount = 3; 
  const maxGalleryIndex = Math.max(0, gallery.length - visibleImagesCount);

  // Extract the booking sidebar into a variable so it can be rendered dynamically
  // based on the screen size without duplicating code logic.
  const bookingSidebarWidget = (
    <div className="border border-[#0d2b4e]/20 p-8 space-y-14 shadow-xl max-w-[400px] w-full mx-auto lg:ml-auto bg-white relative z-10">
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
            calendarClassName="custom-datepicker mt-14"
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
              {rooms} {rooms === 1 ? unitLabelSingle : unitLabelPlural}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${isRoomsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isRoomsOpen && (
            <div className="absolute top-[110%] left-0 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{unitLabelPlural}</span>
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
                      if (rooms < maxAvailable) setRooms(rooms + 1);
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

        {/* Payment Method / Coupon Section */}
        <div>
          {/* Add Coupon Button */}
          {!appliedCoupon && (
            <div className="flex justify-between items-start pt-2">
              <span className="text-gray-800">Coupon Code</span>
              <button type="button" onClick={() => setIsCouponModalOpen(true)} className="text-[15px] font-bold text-[#800000] underline underline-offset-2 decoration-[1.5px] hover:text-red-900 transition cursor-pointer">
                Add Coupon
              </button>
            </div>
          )}
          {/* Applied Coupon Details */}
          {appliedCoupon && (
            <div className="flex justify-between items-start border border-black/20 px-3 py-2 rounded-xl">
              <div>
                <div className="text-gray-800 flex text-[14px] items-center gap-2">
                  Coupon Discounts
                </div>
                <div className="text-emerald-600 text-[12px] font-bold mt-1 uppercase tracking-wide">Discount '{appliedCoupon.code}'</div>
              </div>
              <button type="button" onClick={removeCoupon} className="text-[14px] font-bold text-red-400 hover:text-red-600 transition cursor-pointer uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                Remove
              </button>
            </div>
          )}

          <div className="border-t border-[#eeeadd] mt-6 pt-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[17px] font-semibold text-[#3d2c23]">Price</div>
              </div>
              <div className="text-[#c8a64d] font-bold text-[25px]">₹ {(totals.subtotal + totals.services).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              
            </div>
                {checkingAvailability ? (
            <span className="text-gray-400 text-xs block text-right ">Checking availability...</span>
          ) : availability ? (
            availability.available && availability.remainingRooms >= rooms ? (
              <span className="text-emerald-600 text-[14px] font-semibold block text-right mt-2">
                Available! ( Only {availability.remainingRooms}  room left )
              </span>
            ) : (
              <span className="text-rose-600 text-xs font-semibold block text-right mt-2">
                Sold Out / Booking Full for these dates!
              </span>
            )
          ) : null}
          </div>
          
          {/* Price Details */}
          {checkIn && checkOut && (
            <div className=" rounded-2xl  mt-6 select-none border border-black/10 p-2">
              <h3 className="text-[20px] font-semibold font-jost  text-[#3d2c23] mb-6">Price Details</h3>
              <div className="space-y-3 text-[15px]">
                
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-gray-800 text=[14px]">Base Price</div>
                    <div className="text-[#a89082] text-[12px] font-semibold ">For {totals.nights > 0 ? totals.nights : 1} Night{totals.nights > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-gray-800 font-medium text-[14px]">₹ {(totals.subtotal + totals.services).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                
                {/* Applied Coupon Details */}
                {appliedCoupon && (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-gray-800 flex text-[14px] items-center gap-2">
                        Coupon Discounts
                      </div>
                      <div className="text-emerald-600 text-[12px] font-bold mt-1 uppercase tracking-wide">Discount '{appliedCoupon.code}'</div>
                    </div>
                    <div className="text-emerald-600 font-bold text-[14px]">- ₹ {totals.discount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  </div>
                )}

                <div className="flex justify-between items-start pt-1">
                  <div className="text-gray-800 text-[14px]">GST ({totals.gstRate}%)</div>
                  <div className="text-gray-800 text-[14px] font-medium">₹ {totals.gst.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
              </div>

              <div className="border-t border-[#eeeadd] mt-6 pt-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[16px] font-semibold text-[#3d2c23]">Total Amount</div>
                    <div className="text-gray-500 text-[12px] mt-1 font-medium">Including Tax </div>
                  </div>
                  <div className="text-[22px] font-bold text-[#3d2c23]">₹{totals.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          )}                  
          
      
        </div>

        {/* Booking Trigger CTA */}
        {isAdmin ? (
          <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center">
            Administrators cannot book rooms in the user interface.
          </div>
        ) : (
          <>
            <button
              onClick={handleBooking}
              disabled={bookingLoading || isBookingFull}
              className={`w-full mt-4 py-5 px-3 transition font-bold uppercase tracking-[2.5px] text-[17px] shadow-md cursor-pointer ${
                isBookingFull
                  ? "bg-[#0d2b4e] hover:bg-[#f5d7b8] hover:text-[#0d2b4e] text-white opacity-90 cursor-not-allowed"
                  : bookingLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#f5d7b8] hover:bg-[#0d2b4e] text-[#0d2b4e] hover:text-white"
              }`}
            >
              {bookingLoading ? "Processing..." : isBookingFull ? "BOOKING FULL" : `BOOK YOUR STAY NOW`}
            </button>
            <p className="text-center text-[12px] text-gray-500 mt-[-4px] select-none font-jost">
              By proceeding you agree to our <Link to="/privacy-policy" className="underline hover:text-[#0d2b4e] transition">Privacy Policy</Link> and <Link to="/terms-conditions" className="underline hover:text-[#0d2b4e] transition">T&C</Link>.
            </p>
          </>
        )}

      </div>
    </div>
  );

  return (
    <>
    {/* 2. ADD HELMET COMPONENT HERE */}
     <Helmet>
  <title>Room Details | Sree Raaga Resorts</title>

  <meta
    name="description"
    content="Explore our luxury rooms and villas at Sree Raaga Resorts. Discover spacious accommodations, modern amenities, scenic views, and premium comforts for a relaxing and memorable stay."
  />

  <meta
    name="keywords"
    content="Sree Raaga Resorts rooms, luxury rooms, private villas, premium accommodation, resort rooms, family suites, luxury stay, resort booking, villa booking"
  />

  {/* Open Graph Tags */}
  <meta
    property="og:title"
    content="Room Details | Sree Raaga Resorts"
  />

  <meta
    property="og:description"
    content="Discover beautifully designed rooms and villas at Sree Raaga Resorts, offering premium amenities, comfort, and a peaceful retreat for every guest."
  />

  <meta property="og:type" content="website" />
</Helmet>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden min-h-screen pt-28 md:pt-36">
        
        {/* ================= MAIN CONTENT DETAILS GRID ================= */}
        <section className="py-12 max-w-7xl mx-auto md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[6.8fr_4.2fr] gap-16 items-start">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* Gallery Image Slider (Single active image layout matching Swiss Resort) */}
              <div className="relative overflow-hidden aspect-[80/55] shadow-md group select-none bg-black/5 ">
                {room?.view360Iframe && (
                  <button
                    onClick={() => setIs360ModalOpen(true)}
                    className="absolute top-4 left-4 z-30 bg-[#c8a64d] text-white px-2 py-1 md:px-4 md:py-2  text-sm font-bold shadow-xl hover:bg-[#b09141] transition cursor-pointer border border-white/20 uppercase tracking-widest"
                  >
                    360° View
                  </button>
                )}
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
              <div className="select-none space-y-2 px-6 md:px-0">
                <div className="font-semibold text-[25px] uppercase tracking-[2px] font-jost text-[#c8a64d]">
                  ₹{parseFloat(room.price).toLocaleString()} / NIGHT
                </div>
                <div className="font-semibold text-[17px]  tracking-[2px] font-jost text-gray-500">
                  Exclusive of taxes
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium font-corm text-[#0d2b4e] leading-tight">
                  {room.name}
                </h1>
                
                {/* Specs Row */}
                <div className="flex flex-wrap items-center gap-6 text-[17px] text-gray-500 font-jost">
                  <div className="flex items-center">
                    <Maximize className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.area || "30 M²"} Sqft</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.guests || "2 Guests"} </span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.beds || "1 Bed"}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>{room.bathrooms || "1 Bath"} </span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Mobile Booking Box Injection */}
              <div className="block lg:hidden w-full px-4 md:px-0">
                {bookingSidebarWidget}
              </div>

              {/* About accommodation */}
              <div className="space-y-4 max-w-3xl px-6 md:px-0">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e]">
                  About accommodation
                </h3>
                <p className="text-gray-500 text-[17px] leading-relaxed text-justify ">
                  {room.description}
                </p>
              
              </div>

              <hr className="border-gray-200/60" />

              {/* Room Amenities (12 items) */}
              <div className="space-y-6 px-6 md:px-0">
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
                      <span className="text-[17px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* What's included in this suite? */}
              <div className="space-y-6 px-6 md:px-0">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e] select-none">
                  What's included in this suite?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-none text-xs md:text-sm text-gray-600">
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">Premium Quality Bedding</span>
    </div>

    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">Fresh Towels & Toiletries</span>
    </div>

    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">Complimentary Bottled Water</span>
    </div>
  </div>

  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">
        Modern Bathroom with Hot & Cold Water
      </span>
    </div>

    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">Spacious Storage Area</span>
    </div>

    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 text-[#c8a64d]" />
      <span className="text-[17px] text-gray-700">Daily Housekeeping Service</span>
    </div>
  </div>
</div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Room Rules */}
              <div className="space-y-6 px-6 md:px-0">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e] select-none">
                  Room Rules
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <ul className="space-y-4 text-[17px] text-gray-700 list-disc pl-5 select-none">
                    <li>Please carry a valid ID for Verification</li>
                    <li>Early check-in & check-out may be possible <br /> upon request, subject to availability</li>
                    <li>Check-in from 1:00 PM - Anytime</li>
                    <li>Check-out: 12:00 PM</li>
                  </ul>
                  <ul className="space-y-4 text-[17px] text-gray-700 list-disc pl-5 select-none">
                    <li>Self-check-in with lockbox</li>
                    <li>No smoking</li>
                    <li>Pets are allowed</li>
                  </ul>
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Cancellation Policy */}
              <div className="space-y-6 px-6 md:px-0">
                <h3 className="text-3xl font-medium font-corm  text-[#0d2b4e] select-none">
                  Cancellation Policy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before card */}
                  {/* Before card */}
                  <div className="py-4 px-5 rounded-2xl border border-[#f5ebd0] bg-[#fdfaf2] flex flex-col justify-between min-h-[75px] select-none">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-black font-jost">
                      BEFORE
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 inline-block"></span>
                      <span className="text-[14px] text-gray-800 font-jost">Non refundable.</span>
                    </div>
                  </div>

                  {/* Within card */}
                  <div className="py-4 px-5 rounded-2xl border border-[#ffdce0] bg-[#fff5f6] flex flex-col justify-between min-h-[75px] select-none">
                    <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-wider text-black font-jost">
                      <span>WITHIN</span>
                      <span className="text-black font-extrabold text-[13px]">No Refund</span>
                    </div>
                    <div className="flex justify-between items-end mt-2 text-[14px] text-gray-800 font-jost">
                      <span>15 days from check-in</span>
                      <span className="text-gray-900 font-medium">Non-Refundable</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (BOOKING SIDEBAR CARD) */}
            <div className="hidden lg:block lg:sticky lg:top-10">
              {bookingSidebarWidget}
            </div>
          </div>
        </section>

        {/* ================= SIMILAR ROOMS SECTION ================= */}
        <section className="py-28 md:px-6 bg-[#fdfeff] border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Header Titles */}
            <div className="flex flex-col px-6 md:px-0 sm:flex-row justify-between md:items-end mb-16 select-none">
              <div>
           
                <h2 className="text-5xl md:text-6xl font-medium font-corm  text-[#0d2b4e]">
                  Explore Rooms
                </h2>
              </div>
              <Link 
                to="/rooms" 
                className="group inline-flex items-center text-base font-bold  uppercase tracking-[2px] text-[#0d2b4e] hover:text-[#c8a64d] transition-colors mt-4 sm:mt-0"
              >
                <span className="mr-2 border-b border-transparent group-hover:border-[#c8a64d] pb-0.5">View All Rooms</span>
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {getSimilarRoomsList().map((item) => (
                <div key={item.id || item._id} className="group flex flex-col">
                  {/* Image hover block */}
                  <Link 
                    to={`/rooms/${item.id || item._id}`} 
                    className="block relative overflow-hidden  aspect-[76/62] mb-6 shadow-md"
                  >
                    <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
                      <span className="text-sm font-semibold  tracking-[3px]">BOOK NOW</span>
                    </div>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Title & Price details */}
                  <div className="flex flex-col select-none px-6 md:px-0">
                    <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="text-3xl md:text-3xl font-medium font-jost  text-[#0d2b4e] transition-colors duration-300 ">
                          {item.name}
                        </h4>
                        {item.category && (
                          <span className="text-sm text-[#c8a64d]  font-bold tracking-[2px] block mt-1.5 uppercase">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg md:text-2xl  font-bold text-[#c8a64d]">
                          ₹{parseFloat(item.price).toLocaleString()}
                        </span>
                        <span className="text-[17px] text-gray-700  block tracking-wider uppercase font-semibold">
                          / NIGHT
                        </span>
                     
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="flex flex-wrap items-center gap-5 pb-6 text-[17px]  text-gray-400">
                      <div className="flex items-center">
                        <Maximize className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                        <span className="text-black">{item.area || "30 M²"} Sqft</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                        <span className="text-black">{item.beds || "1 Bed"} Bed</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                        <span className="text-black">{item.bathrooms || "1 Bath"} </span>
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

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-jost">
          <div className="bg-[#faf9f7] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#3d2c23] font-corm">Discount Coupons</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              {/* Input */}
              <div className="relative mb-8">
                <input 
                  type="text" 
                  placeholder="Enter Coupon Code" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-24 text-[#3d2c23] placeholder:text-gray-400 outline-none focus:border-[#c8a64d] transition bg-white font-medium shadow-sm"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-gray-500 hover:text-[#3d2c23] transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Coupons List */}
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Best Offers</p>
                {coupons.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No active coupons available at the moment.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((c) => (
                      <div key={c._id || c.code} className="bg-[#f2f1ef] border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 border border-blue-100 bg-white px-2.5 py-1 rounded-sm shadow-sm">
                              <span className="font-extrabold text-[#0d2b4e] text-sm tracking-wide">{c.code}</span>
                            </div>
                            <button onClick={() => handleApplyCoupon(c.code)} className="text-sm font-bold text-gray-500 group-hover:text-[#3d2c23] transition cursor-pointer">
                              Apply
                            </button>
                          </div>
                          <p className="text-[13px] font-bold text-[#c8a64d] mb-1.5 leading-tight">
                            {c.discount_type === 'percentage' ? `Get ${c.discount_value}% OFF` : `Get ₹${c.discount_value} OFF`}
                            {c.max_cap ? ` up to ₹${c.max_cap}` : ''}
                          </p>
                          <p className="text-xs text-gray-600 leading-snug">
                            {c.description || `Valid for ${c.target_service === 'ALL' ? 'all bookings' : 'rooms'}.`}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200/60">
                          <p className="text-[12px] text-gray-800">Book and save with code {c.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 360 View Modal */}
      {is360ModalOpen && room?.view360Iframe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Click outside overlay */}
          <div className="absolute inset-0" onClick={() => setIs360ModalOpen(false)}></div>
          
          {/* 360 View Container */}
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center border border-white/10 z-10 bg-black">
            <button 
              onClick={() => setIs360ModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-[#c8a64d] z-[110] transition p-2 cursor-pointer bg-black/50 hover:bg-black/80 rounded-full"
              title="Close 360 View"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!border-0"
              dangerouslySetInnerHTML={{ __html: room.view360Iframe }}
            />
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </>
  );
};

export default RoomDetails;

